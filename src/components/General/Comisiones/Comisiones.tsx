import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  IconButton,
  InputAdornment,
  ListItemButton,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import Title from "../Title/Title";
import Paper from "../../OuiComponents/Surfaces/Paper";
import ComisionModal from "./ComisionModal";
import PeopleService from "../../../services/people.service";
import { SIZE_WEB_URL } from "../../../enviroment/enviroment";
import People from "../../../models/People";
import { Button, Select } from "../../OuiComponents/Inputs";
import { Modal } from "../../OuiComponents/Utils";
import { Typography } from "../../OuiComponents/DataDisplay";
import { DataGrid } from "../../OuiComponents/DataGrid";
import { MenuItem } from "../../OuiComponents/Navigation";
import * as XLSX from "xlsx";
import CommissionService from "../../../services/commissions.service";
import CommissionAgentService from "../../../insuranceServices/commission.service";
import { useAlertContext } from "../../../context/alert-context";
import MessageBar from "../../OuiComponents/Feedback/MessageBar";
import { LinkSmallFont, TextSmallFont, TextXSmallFont } from "../../OuiComponents/Theme";
import Constants from "../../../utils/Constants";
export default function Comisiones() {

  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [rows, setRows] = useState<any[]>([]);
  const [change, setChange] = useState(false);
  const [data, setData] = useState<any>(null);
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowComissionsAgentsFolio, setRowComissionsAgentsFolio]= useState<any[]>([]);
  const [status, setStatus] = useState("Previo");
  const [commissionsAgent, setCommissionsAgent] = useState("");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  useEffect(() => {
    let adjustedYear = currentYear;
    let adjustedMonth = currentMonth - 1;

    if (adjustedMonth < 1) {
      adjustedYear -= 1;
      adjustedMonth = 12;
    }

    setSelectedYear(adjustedYear);
    setSelectedMonth(adjustedMonth);
  }, []);

  const [isGenerateCommissionsModalOpen, setIsGenerateCommissionsModalOpen] =
    useState(false);

  const fetchData = async () => {
    const response = await CommissionAgentService.getCommissionsByYearMonth(
      selectedYear,
      selectedMonth
    );

    if (response.data && response.data.commissionsSummary != null) {
      setStatus(response.data.status);
      setRows(response.data.commissionsSummary);
      setData(response.data);
      setCommissionsAgent(response.data.commissionsXagentsFolio);
      const reponseCommissions = await CommissionAgentService.getByFolio(response.data.commissionsXagentsFolio);
      if(reponseCommissions.data){
        setRowComissionsAgentsFolio(reponseCommissions.data.individualsCommissions);
      }else{
        setRowComissionsAgentsFolio([]);
      }
      
    } else {
      setDataAlert(
        true,
        "No se encontraron resultados.",
        "warning",
        autoHideDuration
      );
      setData(null);
      setRows([]);
    }

    setChange(false);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      width: 200,
      renderCell: (params: any) => (
        <ListItemButton
          onClick={() => {
            setSelectedPerson(params.row);
            setIsModalOpen(true);
          }}
        >
          <Typography sx={{ ...TextSmallFont }}>
          {params.row.name} {params.row.lastName} {params.row.maternalLastName}
        </Typography>
          
        </ListItemButton>
      ),
    },
    {
      field: "totalCommission",
      headerName: "Total Comisiones",
      flex: 1,
      renderCell: (params: any) => (
        <Typography sx={{ ...TextSmallFont }}>
          $ {params.row.totalCommission}
        </Typography>
      ),
    },
  ];

  const handleRowClick = (id: GridRowId) => {
    const person = rows.find((row) => row.folio === id);
    if (person) {
      setSelectedPerson(person);
      setIsModalOpen(true);
    }
  };

  const handleOpenGenerateCommissionsModal = () => {
    setIsGenerateCommissionsModalOpen(true);
  };

  const handleGenerateCommissions = async () => {

    CommissionAgentService.patch(commissionsAgent,"Comisionado")
    .then((response: any) => {
      if (response.message === "OK") {
        setStatus(Constants.statusComisionado);
        setDataAlert(true, `Comisiones generados con éxito`, "success", autoHideDuration);
        setIsGenerateCommissionsModalOpen(false);
      }else{
        console.error(
          "CommissionAgentService.patch",
          commissionsAgent,
          response.message
        );
      }
    })
    .catch((e: Error) => {
      setDataAlert(true, `Error al generar comisiones`, "error", autoHideDuration);
      console.error(e);
    })
    //
  };

  const handleCloseGenerateCommissionsModal = () => {
    setIsGenerateCommissionsModalOpen(false);
  };

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleYearChange = (event: SelectChangeEvent<unknown>) => {
    const year = event.target.value as number;
    setSelectedYear(year);
    if (year === currentYear && selectedMonth > currentMonth) {
      setSelectedMonth(currentMonth);
    }
  };

  const handleMonthChange = (event: SelectChangeEvent<unknown>) => {
    const month = event.target.value as string;
    if (currentYear === selectedYear && selectedMonth > currentMonth) {
      setSelectedMonth(currentMonth);
    } else {
      setSelectedMonth(monthNames.indexOf(month) + 1);
    }
  };

  const handleCalculate = () => {
    setChange(true);

    fetchData();
  };

  const handleExport = () => {
      const workbook = XLSX.utils.book_new();
      rowComissionsAgentsFolio.forEach((agent, index) => {
        const nameShort = agent.fullNameAgent.split(" ");
        const name = nameShort[0] +  " " + nameShort[1];
        
        const worksheet = XLSX.utils.json_to_sheet([
          { Nombre:  name  }, // Título con fullNameAgent
            {}, // Espacio en blanco
        ], {
          //header: ['fullNameAgent'], 
        });

        
          const insuranceCommissionsTableData = 
           (agent.insuranceCommissions.length > 0 ? agent.insuranceCommissions : [{
            receiptNumber: "",
            noPolicy: "",
            branch: "",
            commission: "",
            commissionLLN: ""
           }])
           .map((c:any) => [c.receiptNumber,c.noPolicy,c.branch,c.commission,c.commissionLLN]);
          const insuranceCommissionsHeader = ['No Recibo', 'Póliza', 'Ramo', 'Comisión', 'Comisión LLN'];
          XLSX.utils.sheet_add_aoa(worksheet, [insuranceCommissionsHeader, ...insuranceCommissionsTableData], { origin: -1 }); 
        

         
        
          XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: -1 });
          XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: -1 });
          const suretyCommissionsTableData = (
            agent.suretiesCommissions.length > 0 ? agent.suretiesCommissions : [{
              receiptFolio: "",
              noPolicy: "",
              branch: "",
              maquila: "",
              premium: ""
             }]).map((c:any) => [c.receiptFolio,c.noPolicy,c.branch,c.maquila,c.premium]);
          const suretyCommissionsHeader = ['No Recibo', 'Póliza', 'Ramo', 'Maquila', 'Prima'];
          XLSX.utils.sheet_add_aoa(worksheet, [suretyCommissionsHeader, ...suretyCommissionsTableData], { origin: -1 }); 
        
        
        
          XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: -1 });
          XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: -1 });
          const otherConceptsTableData  = (
            agent.otherConcepts !==null && agent.otherConcepts.concepts.length > 0 ?agent.otherConcepts.concepts:[{
              title: "",
              amount: ""
            }]).map((c:any) => [c.title,c.amount]);
          const otherConceptsHeader  = ['Concepto', 'Monto'];
          XLSX.utils.sheet_add_aoa(worksheet, [otherConceptsHeader, ...otherConceptsTableData], { origin: -1 }); 
        

        XLSX.utils.book_append_sheet(workbook, worksheet,   ( index +1 ) + "-." + name);
      });

      const base64String = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "base64",
      });

      // Convierte la cadena base64 en un blob
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Crea un objeto URL para el blob
      const url = window.URL.createObjectURL(blob);

      // Crea un enlace <a> para descargar el blob
      const a = document.createElement("a");
      a.href = url;
      a.download = "Comisiones.xlsx";

      // Simula un clic en el enlace para iniciar la descarga
      a.click();

      // Libera el objeto URL
      window.URL.revokeObjectURL(url);

  };

  return (
    <>
      <MessageBar
          open={isSnackbarOpen}
          severity={severity}
          message={messageAlert}
          close={handleSnackbarClose}
          autoHideDuration={autoHideDuration}
        />
      <Title
        title={"Comisiones"}
        url={window.location.href.slice(SIZE_WEB_URL)}
      />
      <Paper sx={{ p: "24px", borderRadius: "16px", position: "relative" }}>
        <Stack direction="column" spacing={1} sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center">
            <span style={{ marginRight: "8px" }}>Año:</span>
            <Select value={selectedYear} onChange={handleYearChange}>
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box display="flex" alignItems="center">
            <span style={{ marginRight: "8px" }}>Mes:</span>
            <Select
              value={monthNames[selectedMonth - 1]}
              onChange={handleMonthChange}
            >
              {monthNames.map((month, index) => (
                <MenuItem key={index} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box display="flex" alignItems="center">
            <span style={{ marginRight: "8px" }}>Estado:</span>
            <span>{status}</span>
          </Box>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 5 }}
        >
          <DataGrid
            loading={change}
            rows={rows}
            columns={columns}
            getRowId={(row) => row.folio + ""}
            onRowClick={(params) => handleRowClick(params.id)}
            //pageSizeOptions={[15, 25, 50, 70, 100]}
            sx={{ height: "auto", minHeight: "650px" }}
          />
        </Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px",
          }}
        >
          <Button variant="outlined" onClick={handleCalculate}>
          {status===Constants.statusComisionado?"Re-Calcular":"Calcular"
          
          }
            
          </Button>
          {rows.length > 0 &&
            <Button variant="outlined" onClick={handleExport}>
            Exportar
          </Button>}
          <Button
            variant="contained"
            onClick={handleOpenGenerateCommissionsModal}
            disabled={status===Constants.statusComisionado || status==="Previo"}
          >
            Generar comisiones
          </Button>
        </Box>
      </Paper>
      <Modal
        open={isGenerateCommissionsModalOpen}
        onClose={handleCloseGenerateCommissionsModal}
        aria-labelledby="generate-commissions-modal-title"
        aria-describedby="generate-commissions-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
            p: 2,
            boxSizing: "border-box",
          }}
        >
          <Typography
            id="generate-commissions-modal-title"
            variant="h6"
            component="h2"
          >
            Generar Comisiones del Mes
          </Typography>
          <Typography
            id="generate-commissions-modal-description"
            sx={{ mt: 2, mb: 2 }}
          >
            Se generaran las comisiones del mes para todos los vendedores.
            ¿Estas seguro de que deseas cerrar el mes?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button onClick={handleGenerateCommissions}>Sí</Button>
            <Button onClick={handleCloseGenerateCommissionsModal}>No</Button>
          </Box>
        </Paper>
      </Modal>
      <ComisionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          //fetchData();
        }}
        selectedSeller={selectedPerson}
        data={data}
        updateData={fetchData}
      />
    </>
  );
}
