import React, { useMemo } from "react";
import styled from "styled-components";

const isVisibleForRole = (field, role) => {
  if (!field.roles || field.roles.length === 0) return true;
  return field.roles.includes(role);
};

const isVisibleForView = (field, view) => {
  if (field.showInForm !== undefined || field.showInList !== undefined) {
    return view === "form" ? field.showInForm !== false : field.showInList !== false;
  }
  if (!field.visible || field.visible.length === 0) return true;
  return field.visible.includes(view);
};

const DynamicTable = ({
  moduleDefinition,
  records = [],
  role = "admin",
  onRowClick,
}) => {
  const columns = useMemo(() => {
    const raw = moduleDefinition?.fields || [];
    return raw
      .filter((field) => field.status !== "disabled")
      .filter((field) => isVisibleForRole(field, role))
      .filter((field) => isVisibleForView(field, "list"))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [moduleDefinition, role]);

  return (
    <Table>
      <thead>
        <tr>
          {columns.map((field) => (
            <th key={field.key}>{field.label || field.key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records.length === 0 ? (
          <tr>
            <td colSpan={columns.length || 1}>No records found</td>
          </tr>
        ) : (
          records.map((record) => (
            <tr
              key={record._id || record.id}
              onClick={() => onRowClick?.(record)}
              role={onRowClick ? "button" : undefined}
            >
              {columns.map((field) => (
                <td key={`${record._id || record.id}-${field.key}`}>
                  {formatValue(record?.data?.[field.key], field)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

const formatValue = (value, field) => {
  if (value === undefined || value === null || value === "") return "—";
  if (field.type === "boolean") return value ? "Yes" : "No";
  if (field.type === "relation" && Array.isArray(field.options || [])) {
    if (Array.isArray(value)) {
      return value
        .map((val) => {
          const match = field.options.find(
            (opt) => (opt.value ?? opt) === val
          );
          return match?.label || match || val;
        })
        .join(", ");
    }
    const match = field.options.find((opt) => (opt.value ?? opt) === value);
    return match?.label || match || value;
  }
  if (Array.isArray(value)) return value.join(", ");
  return value;
};

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th,
  td {
    padding: 0.75rem;
    border-bottom: 1px solid var(--nb-border);
    text-align: left;
  }

  th {
    background: var(--nb-muted);
    font-weight: 600;
    color: var(--nb-ink);
  }

  tbody tr:hover {
    background: var(--nb-muted);
  }
`;

export default DynamicTable;
