import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import {
  ColorPink,
  ColorPureBlack,
  ColorPureWhite,
  TextMediumFont,
  TextMediumPlusFont,
  TextSmallFont,
  TextXSmallFont,
} from "../../OuiComponents/Theme";
import { DataGrid } from "../../OuiComponents/DataGrid";
import { Box } from "../../OuiComponents/Layout";
import { Button, TextField } from "../../OuiComponents/Inputs";
import * as XLSX from "xlsx";
import CommissionAgentService from "../../../insuranceServices/commission.service";
import ConceptService from "../../../insuranceServices/concept.service";
import { formatMoney } from "../Seguros/Cotizador/packageUtils";
import MessageBar from "../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../context/alert-context";
import { Tooltip } from "../../OuiComponents/DataDisplay";
import {
  Cancel,
  Delete,
  Edit,
  Plus,
  SaveDisquet,
} from "../../OuiComponents/Icons";

const ComisionModal = ({ isOpen, onClose, selectedSeller, data, updateData }: any) => {
  
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();

  const [change, setChange] = React.useState(true);
  const [name, setName] = React.useState("");
  const [rows, setRows] = React.useState<any[]>([]);
  const [fianzas, setFianzas] = React.useState<any[]>([]);
  const [concepts, setConcepts] = React.useState<any[]>([]);
  const [dataCommissions, setDataCommissions] = React.useState<any>();
  const [conceptFolio, setConceptFolio] = React.useState("");
  const [conceptId, setConceptId] = React.useState("");

  const [totalSeguros, setTotalSeguros] = React.useState<number>(0);
  const [totalFianzas, setTotalFianzas] = React.useState<number>(0);
  const [totalConcepts, setTotalConcepts] = React.useState<number>(0);

  const [newConceptTitle, setNewConceptTitle] = React.useState("");
  const [newConceptAmount, setNewConceptAmount] = React.useState("");

  const [editingConcept, setEditingConcept] = React.useState<any>(null);
  const [editingTitle, setEditingTitle] = React.useState("");
  const [editingAmount, setEditingAmount] = React.useState("");

  useEffect(() => {
    
    fetchCommissionAgent();
  }, [isOpen]);
  const fetchCommissionAgent = async () => {
    if (!isOpen) {
      return;
    }

    const commissionAgentFolio = data.commissionsXagentsFolio;
    const agentFolio = selectedSeller.folio;

    const response = await CommissionAgentService.getIndividualCommission(
      commissionAgentFolio,
      agentFolio
    );

    if (response.data) {
      setDataCommissions(response.data);
      setRows(response.data.insuranceCommissions);
      setFianzas(response.data.suretiesCommissions);
      setTotalSeguros(response.data.totalInsuranceCommissions);
      setTotalFianzas(response.data.totalSuretiesCommissions);

      if (response.data.otherConcepts) {
        setConcepts(response.data.otherConcepts.concepts);
        setTotalConcepts(response.data.totalOtherConcepts);
        setConceptFolio(response.data.otherConcepts.folio);
        setConceptId(response.data.otherConcepts.id);
      }
    }

    setChange(false);
  };

  const close = () => {
    setRows([]);
    setFianzas([]);

    onClose();
  };

  const columns: GridColDef[] = [
    { field: "receiptNumber", headerName: "No Recibo", flex: 1, minWidth: 110 },
    { field: "noPolicy", headerName: "Póliza", flex: 1, minWidth: 110 },
    { field: "branch", headerName: "Ramo", flex: 1, minWidth: 110 },
    { field: "commission", headerName: "Comisión", flex: 1, minWidth: 160 },
    {
      field: "commissionLLN",
      headerName: "Comisión LLN",
      flex: 1,
      minWidth: 160,
    },
  ];

  const columnsFianzas: GridColDef[] = [
    { field: "receiptNumber", headerName: "No Recibo", flex: 1, minWidth: 110 },
    { field: "receiptFolio", headerName: "Póliza", flex: 1, minWidth: 110 },
    { field: "branch", headerName: "Ramo", flex: 1, minWidth: 110 },
    { field: "maquila", headerName: "Maquila", flex: 1, minWidth: 160 },
    { field: "premium", headerName: "Prima", flex: 1, minWidth: 160 },
  ];

  const columnsConcepts: GridColDef[] = [
    {
      field: "title",
      headerName: "Concepto",
      flex: 1,
      minWidth: 110,
      renderCell: (params) =>
        editingConcept?.id === params.row.id ? (
          <TextField
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            size="small"
            fullWidth
          />
        ) : (
          <Typography sx={{ ...TextSmallFont }}>
          {params.value}
        </Typography>
          
        ),
    },
    {
      field: "amount",
      headerName: "Monto",
      flex: 1,
      minWidth: 110,
      renderCell: (params) =>
        editingConcept?.id === params.row.id ? (
          <TextField
            value={editingAmount}
            onChange={(e) => setEditingAmount(e.target.value)}
            size="small"
            type="number"
            fullWidth
          />
        ) : (
          <Typography sx={{ ...TextSmallFont }}>
          $ {params.value}
        </Typography>
          
        ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      type: "Action",
      flex: 1,
      minWidth: 110,
      renderCell: (params) =>
        editingConcept?.id === params.row.id ? (
          <>
            <Tooltip
              title={
                <Typography
                  sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}
                >
                  Guardar
                </Typography>
              }
            >
              <IconButton onClick={handleSaveEditedConcept}>
                <SaveDisquet color={ColorPink} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <Typography
                  sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}
                >
                  Cancelar
                </Typography>
              }
            >
              <IconButton onClick={() => setEditingConcept(null)}>
                <Cancel color={ColorPink} />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip
              title={
                <Typography
                  sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}
                >
                  Editar
                </Typography>
              }
            >
              <IconButton onClick={() => handleEditConcept(params)}>
                <Edit color={ColorPink} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <Typography
                  sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}
                >
                  Eliminar
                </Typography>
              }
            >
              <IconButton onClick={() => handleDeleteConcept(params.row.id)}>
                <Delete color={ColorPink} />
              </IconButton>
            </Tooltip>
          </>
        ),
    },
  ];

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();
    const agent = dataCommissions;
    const nameShort = agent?.fullNameAgent?.split(" ");
    const name = nameShort[0] + " " + nameShort[1];
    const worksheet = XLSX.utils.json_to_sheet(
      [
        { Nombre: name }, // Título con fullNameAgent
        {}, // Espacio en blanco
      ],
      {}
    );

    const insuranceCommissionsTableData = (
      agent.insuranceCommissions.length > 0
        ? agent.insuranceCommissions
        : [
            {
              receiptNumber: "",
              noPolicy: "",
              branch: "",
              commission: "",
              commissionLLN: "",
            },
          ]
    ).map((c: any) => [
      c.receiptNumber,
      c.noPolicy,
      c.branch,
      c.commission,
      c.commissionLLN,
    ]);
    const insuranceCommissionsHeader = [
      "No Recibo",
      "Póliza",
      "Ramo",
      "Comisión",
      "Comisión LLN",
    ];
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [insuranceCommissionsHeader, ...insuranceCommissionsTableData],
      { origin: -1 }
    );

    XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: -1 });
    XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: -1 });
    const suretyCommissionsTableData = (
      agent.suretiesCommissions.length > 0
        ? agent.suretiesCommissions
        : [
            {
              receiptFolio: "",
              noPolicy: "",
              branch: "",
              maquila: "",
              premium: "",
            },
          ]
    ).map((c: any) => [
      c.receiptFolio,
      c.noPolicy,
      c.branch,
      c.maquila,
      c.premium,
    ]);
    const suretyCommissionsHeader = [
      "No Recibo",
      "Póliza",
      "Ramo",
      "Maquila",
      "Prima",
    ];
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [suretyCommissionsHeader, ...suretyCommissionsTableData],
      { origin: -1 }
    );

    XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: -1 });
    XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: -1 });
    const otherConceptsTableData = (
      concepts !== null && concepts.length > 0
        ? concepts
        : [
            {
              title: "",
              amount: "",
            },
          ]
    ).map((c: any) => [c.title, c.amount]);
    const otherConceptsHeader = ["Concepto", "Monto"];
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [otherConceptsHeader, ...otherConceptsTableData],
      { origin: -1 }
    );

    XLSX.utils.book_append_sheet(workbook, worksheet, 1 + "-." + name);

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
    a.download = "Comision "+ name +".xlsx";

    // Simula un clic en el enlace para iniciar la descarga
    a.click();

    // Libera el objeto URL
    window.URL.revokeObjectURL(url);

  };

  const isValidAmount = (amount: string) => {
    // Regular expression to match a positive or negative number with optional decimal places
    const regex = /^-?[0-9]+(\.[0-9]{1,2})?$/;
    return regex.test(amount);
  };

  const handleAddConcept = async () => {
    if (!newConceptTitle.trim() || newConceptTitle.trim() === "") {
      setDataAlert(
        true,
        "No hay título en el concepto.",
        "error",
        autoHideDuration
      );
      return;
    }

    if (
      !isValidAmount(newConceptAmount) ||
      newConceptAmount === "" ||
      parseFloat(newConceptAmount) === 0
    ) {
      setDataAlert(
        true,
        "La cantidad del concepto no está correcta o es 0.",
        "error",
        autoHideDuration
      );
      return;
    }

    const newAmount = parseFloat(newConceptAmount);
    const isAddingNew = conceptFolio === "";
    const response = isAddingNew
      ? await ConceptService.postNewConcept(
          selectedSeller.folio,
          data.year,
          data.month,
          newConceptTitle,
          newAmount
        )
      : await ConceptService.postConcept(
          conceptFolio,
          newConceptTitle,
          newAmount
        );

    handleResponse(response);
  };

  const updateTotalConcepts = () => {};

  const handleResponse = (response: any) => {
    if (response.data) {
      const totalAmount = response.data.concepts.reduce(
        (accumulator: number, currentValue: any) =>
          accumulator + currentValue.amount,
        0
      );
      setTotalConcepts(totalAmount);
      setConcepts(response.data.concepts);
      updateData();
      resetForm();
      setDataAlert(
        true,
        "El concepto se agregó con éxito.",
        "success",
        autoHideDuration
      );
    } else {
      setDataAlert(
        true,
        "El concepto no se guardó.",
        "error",
        autoHideDuration
      );
    }
  };

  const resetForm = () => {
    setNewConceptTitle("");
    setNewConceptAmount("");
  };

  const handleDeleteConcept = async (conceptId: string) => {
    const response = await ConceptService.deleteByFolio(
      conceptFolio,
      conceptId
    );

    if (response.data) {
      setConcepts(response.data.concepts);
      updateData();
      setDataAlert(
        true,
        "El concepto se borro con éxito.",
        "success",
        autoHideDuration
      );
    } else {
      setDataAlert(
        true,
        "El concepto no se pudo borrar, vuelva a intentar.",
        "error",
        autoHideDuration
      );
    }
  };

  const handleEditConcept = (params: any) => {
    setEditingConcept(params.row);
    setEditingTitle(params.row.title);
    setEditingAmount(params.row.amount.toString());
  };

  const handleSaveEditedConcept = async () => {
    if (!editingTitle.trim()) {
      setDataAlert(
        true,
        "No hay título en el concepto.",
        "error",
        autoHideDuration
      );
      return;
    }

    if (
      !isValidAmount(editingAmount) ||
      editingAmount === "" ||
      parseFloat(editingAmount) === 0
    ) {
      setDataAlert(
        true,
        "La cantidad del concepto no está correcta o es 0.",
        "error",
        autoHideDuration
      );
      return;
    }

    const updatedConcepts = concepts.map((concept) =>
      concept.id === editingConcept.id
        ? { ...concept, title: editingTitle, amount: parseFloat(editingAmount) }
        : concept
    );
    
    const totalAmount = updatedConcepts.reduce(
      (accumulator: number, currentValue: any) =>
        accumulator + currentValue.amount,
      0
    );
    setTotalConcepts(totalAmount);
    const request = {
      id: conceptId,
      folio: conceptFolio,
      personFolio: selectedSeller.folio,
      year: data.year,
      month: data.month,
      concepts: updatedConcepts,
    };
    const response = await ConceptService.putByFolio(conceptFolio, request);

    if (response.data) {
      setConcepts(response.data.concepts);
      updateData();
      setDataAlert(
        true,
        "El concepto se actualizo con éxito.",
        "success",
        autoHideDuration
      );
      
    } else {
      setDataAlert(
        true,
        "El concepto no se pudo actualizar, vuelva a intentar.",
        "error",
        autoHideDuration
      );
    }

    setEditingConcept(null);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle sx={{ textAlign: "center", ...TextMediumPlusFont }}>
        Detalle de Comisión - {selectedSeller?.name}
      </DialogTitle>
      <DialogContent dividers style={{ minHeight: 400, width: "100%" }}>
        <MessageBar
          open={isSnackbarOpen}
          severity={severity}
          message={messageAlert}
          close={handleSnackbarClose}
          autoHideDuration={autoHideDuration}
        />
        <Typography
          sx={{
            ...TextMediumFont,
            color: ColorPureBlack,
          }}
          style={{ marginBottom: "20px" }}
        >
          Seguros
        </Typography>
        <DataGrid
          loading={change}
          rows={rows}
          columns={columns}
          getRowId={(row) => row.folio + ""}
          disableRowSelectionOnClick
          style={{ marginBottom: "20px" }}
        />
        <Typography
          sx={{
            ...TextMediumFont,
            color: ColorPureBlack,
          }}
          style={{ marginBottom: "30px", textAlign: "right" }}
        >
          Total seguros: {totalSeguros}
        </Typography>
        <Typography
          sx={{
            ...TextMediumFont,
            color: ColorPureBlack,
          }}
          style={{ marginBottom: "20px" }}
        >
          Fianzas
        </Typography>
        <DataGrid
          loading={change}
          rows={fianzas}
          columns={columnsFianzas}
          getRowId={(row) => row.folio + ""}
          disableRowSelectionOnClick
          style={{ marginBottom: "20px" }}
        />
        <Typography
          sx={{
            ...TextMediumFont,
            color: ColorPureBlack,
          }}
          style={{ textAlign: "right" }}
        >
          Total fianzas: {totalFianzas}
        </Typography>

        <Typography
          sx={{
            ...TextMediumFont,
            color: ColorPureBlack,
            marginBottom: "20px",
          }}
        >
          Nuevo Concepto
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            paddingBottom: "30px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <TextField
              label="Titulo"
              variant="outlined"
              value={newConceptTitle}
              onChange={(e) => setNewConceptTitle(e.target.value)}
              sx={{ flexGrow: 1, flexBasis: "45%" }}
            />
            <TextField
              label="Monto"
              type="number"
              variant="outlined"
              value={newConceptAmount}
              onChange={(e) => setNewConceptAmount(e.target.value)}
              sx={{ flexGrow: 1, flexBasis: "45%" }}
            />
            <Button
              startIcon={<Plus color={ColorPureWhite} />}
              variant="contained"
              onClick={handleAddConcept}
              sx={{ width: "30%" }}
            >
              Agregar concepto
            </Button>
          </Box>
        </Box>

        <DataGrid
          loading={change}
          rows={concepts}
          columns={columnsConcepts}
          getRowId={(row) => row.id + ""}
          disableRowSelectionOnClick
          style={{ marginBottom: "20px" }}
        />
        <Typography
          sx={{
            ...TextMediumFont,
            color: ColorPureBlack,
          }}
          style={{ marginBottom: "20px", textAlign: "right" }}
        >
          Total conceptos: {totalConcepts}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "20px",
          }}
        >
          <Button variant="contained" onClick={close}>
            Cerrar
          </Button>
          <Button variant="contained" onClick={handleExport}>
            Exportar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ComisionModal;
