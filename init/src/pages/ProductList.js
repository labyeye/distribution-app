import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import { FaSearch } from "react-icons/fa";
import DynamicTable from "../components/DynamicTable";
import {
  fetchRecords,
  hydrateModuleDefinition,
} from "../utils/dynamicApi";

const ProductList = () => {
  const [records, setRecords] = useState([]);
  const [moduleDefinition, setModuleDefinition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadModule = async () => {
      try {
        const definition = await hydrateModuleDefinition("product");
        setModuleDefinition(definition);
      } catch (err) {
        setError("Failed to load product module");
      }
    };
    loadModule();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchRecords("product");
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      <PageHeader>Product List</PageHeader>
      <ActionsContainer>
        <SearchContainer>
          <FaSearch />
          <SearchInput
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </ActionsContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <LoadingMessage>Loading products...</LoadingMessage>
      ) : (
        <DynamicTable moduleDefinition={moduleDefinition} records={filteredRecords} />
      )}
    </Layout>
  );
};

const PageHeader = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--nb-ink);
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  border: 1px solid var(--nb-border);
  border-radius: 4px;
  width: 300px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  margin-left: 0.5rem;
  width: 100%;
`;

const ErrorMessage = styled.div`
  color: var(--nb-orange);
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: var(--nb-muted);
  border-radius: 4px;
`;

const LoadingMessage = styled.div`
  color: var(--nb-blue);
  margin-bottom: 1rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  width: 100%;
`;

export default ProductList;
