// ResultsTable.js
import React from "react";
import styled from "styled-components";

const TestResultsTable = ({ results, selectedModel }) => {
  if (selectedModel === "Tanaka" || selectedModel === "Saito") {
    return (
      <TableWrapper>
        <TableTitle>{selectedModel} Results</TableTitle>
        <StyledTable>
          <thead>
            <tr>
              <TableHeader>Insert #</TableHeader>
              <TableHeader>Material</TableHeader>
              <TableHeader>
                ρ<sub>e</sub>
              </TableHeader>
              <TableHeader>
                Z<sub>eff</sub>
              </TableHeader>
              <TableHeader>Stopping Power Ratio</TableHeader>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{result.material}</TableCell>
                <TableCell>{result.rho_e}</TableCell>
                <TableCell>{result.z_eff}</TableCell>
                <TableCell>{result.stopping_power}</TableCell>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
    );
  }

  if (selectedModel === "Hunemohr") {
    return (
      <TableWrapper>
        <TableTitle>{selectedModel} Results</TableTitle>
        <StyledTable>
          <thead>
            <tr>
              <TableHeader>Insert #</TableHeader>
              <TableHeader>Material</TableHeader>
              <TableHeader>
                ρ<sub>e</sub>
              </TableHeader>
              <TableHeader>
                Z<sub>eff</sub>
              </TableHeader>
              <TableHeader>Stopping Power Ratio</TableHeader>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <TableCell>{result.material}</TableCell>
                <TableCell>{result.rho_e}</TableCell>
                <TableCell>{result.z_eff}</TableCell>
                <TableCell>{result.stopping_power}</TableCell>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
    );
  }

  return null;
};

export default TestResultsTable;

const TableWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  color: #e0eafc;
`;

const TableTitle = styled.h4`
  color: #ff6bcb;
  margin-bottom: 10px;
  text-align: center;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
`;

const ParametersTable = styled(StyledTable)`
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 12px;
  background: #ff6bcb;
  color: white;
  text-align: center;
`;

const TableCell = styled.td`
  padding: 10px;
  border-top: 1px solid #ff6bcb;
  text-align: center;
  &:first-child {
    border-left: none;
  }
`;
