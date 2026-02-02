import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import { FaSearch, FaPlus } from "react-icons/fa";
import RetailerForm from "./RetailerForm";
import DynamicTable from "../components/DynamicTable";
import {
  fetchRecords,
  hydrateModuleDefinition,
} from "../utils/dynamicApi";

const RetailerList = () => {
  const [records, setRecords] = useState([]);
  const [moduleDefinition, setModuleDefinition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRecord, setEditingRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const fetchRetailers = async () => {
    try {
      setLoading(true);
      const data = await fetchRecords("retailer");
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch retailers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetailers();
  }, []);

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingRecord(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingRecord(null);
    fetchRetailers();
  };

  const filteredRecords = useMemo(() => {
    if (!searchTerm) return records;
    const query = searchTerm.toLowerCase();
    return records.filter((record) =>
      Object.values(record.data || {}).some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [records, searchTerm]);

  return (
    <Layout>
      <PageHeader>Retailer List</PageHeader>

      <ActionsContainer>
        <SearchContainer>
          <FaSearch />
          <SearchInput
            type="text"
            placeholder="Search retailers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        <ButtonGroup>
          <AddButton onClick={handleAddNew}>
            <FaPlus /> Add New
          </AddButton>
        </ButtonGroup>
      </ActionsContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <LoadingMessage>Loading retailers...</LoadingMessage>
      ) : (
        <DynamicTable
          moduleDefinition={moduleDefinition}
          records={filteredRecords}
          onRowClick={handleEdit}
        />
      )}

      {showForm && (
        <ModalOverlay>
          <ModalContent>
            <RetailerForm
              record={editingRecord}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--nb-muted);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--nb-white);
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const PageHeader = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--nb-ink);
  text-align: center;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--nb-muted);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  width: 100%;
  max-width: 400px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  margin-left: 0.5rem;
  width: 100%;
  outline: none;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--nb-blue);
  color: var(--nb-white);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  padding: 0.75rem 1rem;
  background-color: var(--nb-muted);
  color: var(--nb-orange);
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const LoadingMessage = styled.div`
  padding: 1rem;
  text-align: center;
  color: var(--nb-ink);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export default RetailerList;
