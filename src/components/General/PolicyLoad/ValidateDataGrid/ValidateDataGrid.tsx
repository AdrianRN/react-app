import Radio from "@mui/material/Radio";
import {GridColDef, esES } from "@mui/x-data-grid";
import * as React from "react";
import { useState } from "react";
import styles from "./ValidateDataGrid.module.css";

import PolicyLoadM from "../../../../models/PolicyLoadM";
import DataGrid from "../../../OuiComponents/DataGrid/DataGrid";
import Checkbox from "../../../OuiComponents/Inputs/Checkbox";

export interface Row {
  name: string;
  dateUpload: string;
  contentType: string;
  size: string;
  status: string;
  id?: number;
}

const rows: Row[] = [
  { name: "x", dateUpload: "x", contentType: "x", size: "x", status: "x" },
];

for (let i = 0; i < rows.length; i++) {
  rows[i].id = i + 1;
}

function CustomGrid(props: any) {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const handleRowSelectionChange = (id: number) => {
    setSelectedRowId(id === selectedRowId ? null : id);
    const selectedRow = props.rows.find((row: Row) => row.id === id);
    if (selectedRow) {
      props.onSelectRow([selectedRow]);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "radiobutton",
      headerName: "",
      width: 70,
      sortable: false,
      editable: false,
      renderCell: (params) => (
        <Checkbox
          // disabled={params.row.status === "imported"}
          checked={params.row.id === selectedRowId}
          onChange={() => handleRowSelectionChange(params.row.id)}
          value={params.row.id}
        />
      ),
    },
    {
      field: "name",
      headerName: "Archivo",
      width: 320,
      editable: false,
      align: "left",
      headerAlign: "left",
      flex: 1,
    },
    {
      field: "dateUpload",
      headerName: "Fecha de carga",
      width: 200,
      editable: false,
      align: "left",
      headerAlign: "left",
      flex: 1,
      renderCell: (params) => (
        <div>
          {new Date(params.value).toLocaleString("es-ES", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </div>
      ),
    },
    {
      field: "size",
      headerName: "Tamaño",
      type: "number",
      width: 200,
      editable: false,
      align: "left",
      headerAlign: "left",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Estado",
      width: 200,
      align: "left",
      flex: 1,
      headerAlign: "left",
      renderCell: (params) => (
        <div
          className={
            params.value === "imported" ? styles.okButton : styles.noButton
          }
        >
          {params.value === "imported" ? "importado" : "pendiente"}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.customGridSize}>
      <DataGrid
        rows={props.rows}
        columns={columns}       
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        disableRowSelectionOnClick={true} // Deshabilita el resaltado de color al hacer clic
      />
    </div>
  );
}

export default CustomGrid;