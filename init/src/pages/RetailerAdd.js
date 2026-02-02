// RetailerAdd.js
import React, { useState, useEffect } from "react";
import * as xlsx from "xlsx";
import styled from "styled-components";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import DynamicForm from "../components/DynamicForm";
import {
  createRecord,
  hydrateModuleDefinition,
} from "../utils/dynamicApi";
const RetailerAdd = () => {
  const navigate = useNavigate();
  const [manualRetailer, setManualRetailer] = useState({});
  const [moduleDefinition, setModuleDefinition] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [importProgress, setImportProgress] = useState({
    current: 0,
    total: 0,
  });

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await createRecord("retailer", manualRetailer);
      setMessage("Retailer added successfully!");
      setManualRetailer({});
      setFieldErrors({});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add retailer");
      setFieldErrors(err.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const loadModule = async () => {
      try {
        const definition = await hydrateModuleDefinition("retailer");
        setModuleDefinition(definition);
      } catch (err) {
        setError("Failed to load retailer module");
      }
    };
    loadModule();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setError("");
  };

  const validateExcelStructure = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = xlsx.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

          const headers = jsonData[0] || [];
          const lowerHeaders = headers.map((h) =>
            String(h).toLowerCase().trim(),
          );

          // Required columns
          const requiredColumns = ["retailer name", "address 1"];
          const missingColumns = requiredColumns.filter(
            (col) => !lowerHeaders.includes(col.toLowerCase()),
          );

          if (missingColumns.length > 0) {
            resolve(`Missing required columns: ${missingColumns.join(", ")}`);
            return;
          }
          const allowedColumns = [
            "retailer name",
            "address 1",
            "address 2",
            "assigned to",
            "day assigned",
          ];
          const unrecognizedColumns = headers.filter(
            (h) => !allowedColumns.includes(h.toLowerCase().trim()),
          );

          if (unrecognizedColumns.length > 0) {
            resolve(
              `Warning: Unrecognized columns will be ignored: ${unrecognizedColumns.join(
                ", ",
              )}`,
            );
            return;
          }

          resolve(null);
        } catch (error) {
          resolve("Error reading Excel file: " + error.message);
        }
      };
      reader.onerror = () => {
        resolve("Error reading file. Please check if the file is valid.");
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    const validationError = await validateExcelStructure(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setImportProgress({ current: 0, total: 0 });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:2500/api/retailers/import",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported in this browser");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const data = JSON.parse(line);
            if (data.type === "progress") {
              setImportProgress({
                current: data.current,
                total: data.total,
              });
            } else if (data.type === "result") {
              setMessage(
                `Successfully imported ${data.importedCount} retailers. ${data.errorCount} records had errors.`,
              );
              if (data.errorCount > 0) {
                const exampleErrors = data.errors?.join(";\n") || "";
                setError(
                  `Some rows had errors. Examples:\n${exampleErrors}${
                    data.errorCount > 10 ? "\n...and more" : ""
                  }`,
                );
              }
            } else if (data.type === "error") {
              setError(data.message || "Failed to import retailers");
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }
      }

      setFile(null);
      document.getElementById("fileInput").value = "";
    } catch (error) {
      console.error("Error importing file:", error);
      setError(error.message || "Failed to import retailers");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    navigate("/admin/view-retailer");
  };

  return (
    <Layout>
      <PageHeader>Add Retailers</PageHeader>

      <ButtonContainer>
        <BackButton onClick={handleBackToList}>
          Back to Retailer List
        </BackButton>
      </ButtonContainer>

      {/* Manual Retailer Entry Form */}
      <FormContainer>
        <SectionHeader>Manual Retailer Entry</SectionHeader>
        {moduleDefinition ? (
          <DynamicForm
            moduleDefinition={moduleDefinition}
            values={manualRetailer}
            onChange={(key, value) =>
              setManualRetailer((prev) => ({ ...prev, [key]: value }))
            }
            onSubmit={handleManualSubmit}
            errors={fieldErrors}
            submitLabel="Add Retailer"
          />
        ) : (
          <LoadingMessage>Loading fields...</LoadingMessage>
        )}

        {loading && importProgress.total > 0 && (
          <ProgressBar>
            <ProgressFill
              width={`${(importProgress.current / importProgress.total) * 100}%`}
            />
          </ProgressBar>
        )}
      </FormContainer>

      {/* Excel File Upload Form */}
      <UploadForm onSubmit={handleImport}>
        <SectionHeader>Upload Retailers (Excel)</SectionHeader>
        <FileUploadContainer>
          <FileInputLabel>
            <FileInput
              id="fileInput"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
            <span>Choose File</span>
          </FileInputLabel>
          <FileName>{file ? file.name : "No file chosen"}</FileName>
        </FileUploadContainer>

        <ButtonContainer>
          <SubmitButton type="submit" disabled={loading || !file}>
            {loading ? "Processing..." : "Upload Retailers"}
          </SubmitButton>
        </ButtonContainer>

        <NoteText>
          Note: Excel file should have columns for Retailer Name, Address 1
          (required), and Address 2 (optional).
        </NoteText>
      </UploadForm>

      {message && <SuccessMessage>{message}</SuccessMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Layout>
  );
};
const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: var(--nb-border);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: var(--nb-blue);
  width: ${(props) => props.width};
  transition: width 0.3s ease;
`;
const PageHeader = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--nb-ink);
  text-align: center;
`;

const FormContainer = styled.div`
  background: var(--nb-white);
  padding: 1.25rem;
  border-radius: 0.5rem;
  box-shadow: var(--nb-shadow-md);
  margin-bottom: 1.5rem;
`;

const UploadForm = styled.form`
  background: var(--nb-white);
  padding: 1.25rem;
  border-radius: 0.5rem;
  box-shadow: var(--nb-shadow-md);
  margin-bottom: 1.5rem;
`;

const SectionHeader = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--nb-ink);
`;

const LoadingMessage = styled.div`
  padding: 0.75rem 0;
  color: var(--nb-ink);
`;


const ButtonContainer = styled.div`
  margin-top: 1.25rem;
  display: flex;
  justify-content: center;
`;

const BackButton = styled.button`
  padding: 0.625rem 1rem;
  background-color: var(--nb-ink);
  color: var(--nb-white);
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  padding: 0.625rem 1rem;
  background-color: var(--nb-blue);
  color: var(--nb-white);
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
`;

const FileUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 0.625rem 1rem;
  background-color: var(--nb-muted);
  color: var(--nb-ink);
  border: 1px solid var(--nb-border);
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  text-align: center;
`;

const FileInput = styled.input`
  display: none;
`;

const FileName = styled.span`
  font-size: 0.875rem;
  color: var(--nb-ink);
`;

const NoteText = styled.p`
  font-size: 0.875rem;
  color: var(--nb-ink);
  margin-top: 1rem;
`;

const SuccessMessage = styled.div`
  padding: 0.75rem 1rem;
  background-color: var(--nb-muted);
  color: var(--nb-blue);
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const ErrorMessage = styled.div`
  padding: 0.75rem 1rem;
  background-color: var(--nb-muted);
  color: var(--nb-orange);
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  var(--nb-white)-space: pre-line;
`;

export default RetailerAdd;
