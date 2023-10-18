import React from "react";
import { Table } from "react-bootstrap";

const CustomTable = ({ items, headers }) => {
  return (
    <>
      <Table responsive>
        <thead>
          <tr style={{ backgroundColor: "transparent", color: "#ffff" }}>
            {headers.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row, index) => (
            <React.Fragment key={index}>
              <tr style={{ background: "#ffff" }}>
                {headers.map(
                  (column, index) => console.log(row[index])
                  // <td key={column}>{row[column]}</td>
                )}
              </tr>
              <tr className="spacer"></tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default CustomTable;
