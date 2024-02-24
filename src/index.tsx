import { CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "dayjs/locale/es-mx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AlertProvider } from "./context/alert-context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <>
    <CssBaseline />
    
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
        <AlertProvider>
          
            <App />
          
        </AlertProvider>
      </LocalizationProvider>
    
  </>
);
