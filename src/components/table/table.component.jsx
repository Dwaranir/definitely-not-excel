import React, { useEffect, useState } from "react";
import Filter from "../filter/filter.component";
import { v4 as id4 } from "uuid";
import "./table.component.css";

const Table = () => {
  const [tableData, setTableData] = useState();
  const [filter, setFilter] = useState({ filterValue: "", key: "" });
  const { filterValue, key } = filter;
  const fetchData = () => {
    return fetch("https://gorest.co.in/public/v2/todos").then((response) =>
      response.json()
    );
  };

  // Fetching data when page loaded
  useEffect(() => {
    fetchData().then((rest) => {
      setTableData(rest);
    });
  }, []);

  // Simple sorting function
  const sortItems = (a, b) => {
    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    }

    if (a.toLowerCase() < b.toLowerCase()) {
      return 1;
    }
    if (a.toLowerCase() > b.toLowerCase()) {
      return -1;
    }
    return 0;
  };

  // Copy current table state in new variable,
  // sorting it and setting new table data
  const sortRows = (key, ascent = true) => {
    let newTable = tableData;

    newTable.sort((a, b) => sortItems(a[key], b[key], ascent));

    setTableData([...newTable]);
  };

  // Guard close to stop App from falling when data still fetching
  if (!tableData) return;
  const headers = Object?.keys(tableData?.[0]);

  function renderHeaders() {
    if (!headers) return;

    return headers.map((header) => {
      return (
        <th key={header}>
          <Filter setFilter={setFilter} />
          {header}
        </th>
      );
    });
  }

  const renderRows = () => {
    if (!headers) return;
    const filteredData = filterTable(filterValue, key);

    return filteredData.map((data) => (
      <tr key={id4()}>
        {headers.map((header) => (
          <td key={id4()}>{data[header]}</td>
        ))}
      </tr>
    ));
  };

  // Copy current state in new variable, before filtering
  // because we still need old state with
  // full amount of items when filter is empty
  function filterTable(filter, key) {
    if (!key) return tableData;

    const data = tableData;

    // eslint-disable-next-line array-callback-return
    const filteredResult = data.filter((el) => {
      try {
        return JSON.stringify(el[key])
          ?.toLowerCase()
          ?.includes(filter?.toLowerCase());
      } catch (error) {
        console.log(error);
      }
    });

    return filteredResult;
  }

  return headers ? (
    <table
      className="table"
      onClick={({ target }) => {
        const { localName, innerText } = target;
        if (localName !== "th") return;

        sortRows(innerText);
      }}
    >
      <thead>
        <tr>{renderHeaders()}</tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </table>
  ) : (
    <></>
  );
};

export default Table;
