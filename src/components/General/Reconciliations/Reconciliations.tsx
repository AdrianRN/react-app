import React, { useEffect, useState } from "react";
import { SIZE_WEB_URL } from "../../../enviroment/enviroment";
import Title from "../Title/Title";
import { GridColDef } from "@mui/x-data-grid";
import { Paper } from "../../OuiComponents/Surfaces";
import { Box, IconButton, Tooltip, Zoom } from "@mui/material";
import Typography from "../../OuiComponents/DataDisplay/Typography";
import { Stack } from "../../OuiComponents/Layout";
import Grid from "../../OuiComponents/Layout/Grid";
import DatePicker from "../../OuiComponents/Inputs/DatePicker";
import { Button, Select, TextField } from "../../OuiComponents/Inputs";
import { Menu, MenuItem } from "../../OuiComponents/Navigation";
import { ColorGrayDark2, ColorPink, ColorPureWhite, TextSmallFont } from "../../OuiComponents/Theme";
import { Complete, Edit } from "../../OuiComponents/Icons";
import { useAlertContext } from "../../../context/alert-context";
import CacheCatalogValue from "../../../models/CacheCatalogValue";
import CacheService from "../../../services/cache.service";
import Constants from "../../../utils/Constants";
import CatalogValue from "../../../models/CatalogValue";
import MessageBar from "../../OuiComponents/Feedback/MessageBar";
import FormatData from "../../../utils/Formats.Data";
import ReceiptsService from "../../../services/receipts.service";
import DataGrid from "../../OuiComponents/DataGrid/DataGrid";
import ReconciliationsModal from "./ReconciliationsModal";
import Receipts from "../../../models/Receipts";
import * as XLSX from 'xlsx';
import Grow from '@mui/material/Grow';


interface ReconciliationsCompanyFormData {
  CatalogCurrency: CacheCatalogValue;
  CatalogBranches: CacheCatalogValue;
}

interface DataFilterReceipts {
  paymentDateOf: string;
  paymentDateUntil: string;
  branch: string;
  currency: string;
}

interface DataResultReconcilations {

  insuranceId: string;
  insuranceName: string;
  conciliado: number;
  noConciliado: number;
}
function Reconciliations() {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [valuesData, setValuesData] =
    useState<ReconciliationsCompanyFormData>();
  const [filterData, setfilterData] = useState<DataFilterReceipts>({
    paymentDateOf: FormatData.dateFormat(new Date()).toString(),
    paymentDateUntil: FormatData.dateFormat(new Date()).toString(),
    branch: "",
    currency: "",
  });
  const [rows, setRows] = React.useState([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [receiptsData, setReceiptsdata] = useState<any[]>([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [receiptsFolio, setReceiptsFolio] = React.useState<Receipts[]>([]);
  const [idCompany, setIdCompany] = useState<string>("");
  useEffect(() => {
    fetchData();

  }, []);
  const fetchData = async () => {
    const restBranches = await CacheService.getByFolioCatalog(
      Constants.branchesCatalogFolio
    );
    const restCurrency = await CacheService.getByFolioCatalog(
      Constants.currencyCatalogFolio
    );
    setValuesData({
      CatalogCurrency: restCurrency.data.values,
      CatalogBranches: restBranches.data.values,
    });

  };


  const handleSend = () => {
    getReceiptReconcilations();

  }
  const getReceiptReconcilations = () => {
    ReceiptsService.getReceiptReconcilations(
      filterData.paymentDateOf,
      filterData.paymentDateUntil,
      filterData.branch,
      filterData.currency
    )
      .then((response) => {
        const dataWithId = response.data ? response.data.map((obj: any, index: any) => {
          return {
            ...obj,
            id: index + 1 // Puedes usar otro criterio para generar el id si es necesario
          };
        }) : [];
          setRows(dataWithId);
          const receipts = response.data.find((item: any) => item.insuranceId === idCompany);
          if (receipts && receipts.resultReceipts) {
            setReceiptsdata(receipts.resultReceipts);
          } else {
            // console.log("No se encontraron datos de receipts.");
          }
        
      })
      .catch((error) => {
        setDataAlert(true, "No se encontraron recibos.", "info", 3000);
        setRows([])
        setSelectedCompany(null);
      });
  };

  const handleOpen = (params: any) => {
    if (params.row.receiptStatus === Constants.receiptStatus.payed) {
      setOpenModal(true);
      setReceiptsFolio(params.row);
    } else {

      setDataAlert(true, "Este recibo ya fue conciliado.", "info", 3000);
    }
  };
  const handleRowClick = (params: any) => {

    if (params.row) {
      setIdCompany(params.row.insuranceId);
      const receiptsData = params.row.resultReceipts;
      setReceiptsdata(receiptsData);
      setSelectedCompany(params.row.insuranceId);
    } else if (params.row) {
      setIdCompany(params.rows.insuranceId);
      const receiptsData = params.row.resultReceipts;
      setReceiptsdata(receiptsData);
      setSelectedCompany(params.row.insuranceId);
    } else {
      console.error("Algunas propiedades de params son undefined.");
    }
  }

  const receiptsColumns: GridColDef[] = [
    {
      field: "descriptionReceiptStatus",
      headerName: "Estatus",
      flex: 1,
      renderCell: (params: any) => (
        <>
          <Typography sx={TextSmallFont}>
            {params.row.descriptionReceiptStatus}
          </Typography>
        </>
      ),
    },
    {
      field: "receiptNumber",
      headerName: "Recibo",
      flex: .9,
      renderCell: (params) => (
        <Typography sx={TextSmallFont}>{params.row.receiptNumber}/{params.row.totalReceipts}</Typography>
      ),
    },
    {
      field: "noPolicy",
      headerName: "Póliza",
      flex: 1,
      renderCell: (params) => (
        <Tooltip
          title={params.row.noPolicy}
          TransitionComponent={Zoom}
          placement="top">
          <span style={TextSmallFont} color={ColorGrayDark2}>{params.row.noPolicy}</span>
        </Tooltip>
      ),
    },
    {
      field: "clientName",
      headerName: "Cliente",
      flex: 1.2,
      renderCell: (params) => (
        <Tooltip
          title={params.row.clientName}
          TransitionComponent={Zoom}
          placement="top">
          <span style={TextSmallFont} color={ColorGrayDark2}>{params.row.clientName}</span>
        </Tooltip>
      ),
    },
    {
      field: "grandTotal",
      headerName: "Monto",
      flex: 1,
      renderCell: (params) => {
        const grandTotal = params.row.grandTotal;
        const formattedGrandTotal = grandTotal.toLocaleString();

        return (
          <Tooltip
            title={formattedGrandTotal}
            TransitionComponent={Zoom}
            placement="top"
          >
            <span style={TextSmallFont}>{'$'} {' '}{formattedGrandTotal}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "payReceipt",
      headerName: "Fecha de pago",
      width: 300,
      flex: 1,
      renderCell: (params) => {
        const payDate = new Date(params.row.payReceipt);
        const day = payDate.getDate();
        const month = payDate.getMonth() + 1;
        const year = payDate.getFullYear();
        const formatDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
        return (
          <Tooltip
            title={formatDate}
            TransitionComponent={Zoom}
            placement="top"
          >
            <span style={TextSmallFont} color={ColorGrayDark2}>{formatDate}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "dueDate",
      headerName: "Vencimiento",
      flex: 1,
      renderCell: (params) => {
        return (
          <Tooltip
            title={FormatData.stringDateFormatDDMMYYY(params.row.dueDate)}
            TransitionComponent={Zoom}
            placement="top"
          >
            <span style={TextSmallFont} color={ColorGrayDark2}>{FormatData.stringDateFormatDDMMYYY(params.row.dueDate)}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "receiptId",
      headerName: "Conciliado",
      flex: .7,
      renderCell: (params: any) => (
        <>
          {params.row.receiptStatus == Constants.receiptStatus.reconciled ? (
            <Box sx={{ display: "flex", justifyContent: 'center', paddingLeft: '20px' }}>
              <Complete color={ColorPink} />{" "}
            </Box>
          ) : (
            ""
          )}
        </>
      ),
    },
  ]

  const columns: GridColDef[] = [
    {
      field: "insuranceIdName",
      headerName: "Compañía",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <div onClick={() => handleRowClick(params.row)}>
            <Typography sx={TextSmallFont}>
              {params.row.insuranceIdName}
            </Typography>
          </div>
        );
      },
    },
    {
      field: "noConciliado",
      headerName: "Conciliados",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <div onClick={() => handleRowClick(params.row)}>
            <Typography sx={TextSmallFont}>{params.row.noConciliado}</Typography>
          </div>
        );
      },
    },
    {
      field: "conciliado",
      headerName: "Sin Conciliar",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        return (
          <>
            <div onClick={() => handleRowClick(params.row)}>
              <Typography sx={TextSmallFont}>
                {params.row.conciliado}
              </Typography>
            </div>
          </>
        );
      },
    },
  ];

  const handleExportdata = () => {
    const selectedColumns: Array<keyof Receipts> = receiptsColumns.map(column => column.field as keyof Receipts);

    // Filtra las filas para incluir solo las columnas seleccionadas
    const filteredRows = receiptsData.map(row =>
      selectedColumns.reduce((filteredRow, column) => {
        filteredRow[column] = row[column] ?? "";
        return filteredRow;
      }, {} as Record<keyof Receipts, any>)
    );

    // Crea la hoja de cálculo y el libro de trabajo
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Descarga el archivo Excel
    XLSX.writeFile(workbook, 'Recibos.xlsx');
  };


  return (
    <>
      <Title
        title="Conciliación"
        url={window.location.href.slice(SIZE_WEB_URL)}
      />

      <Paper sx={{ p: "24px", borderRadius: "16px" }} elevation={1}>
        <Box>
          <Stack spacing={1}>
            <Box sx={{ paddingLeft: "0px", paddingRight: "40px" }}>
              <Stack spacing={1}>
                <Grid
                  container
                  rowSpacing={3}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={12} sm={5}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>
                        Fecha de pago
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography sx={{ ...TextSmallFont, mx: 3 }}>
                          De:
                        </Typography>
                        <TextField
                          name="dateOf"
                          type="date"
                          value={filterData.paymentDateOf}
                          onChange={(e) => {
                            const selectedDateOf = new Date(e?.target?.value);
                            const selectedDateUntil = new Date(
                              filterData.paymentDateUntil
                            );
                            if (
                              selectedDateOf <= selectedDateUntil ||
                              !selectedDateUntil
                            ) {
                              setfilterData({
                                ...filterData,
                                paymentDateOf: e?.target?.value,
                              });
                            } else {
                              setDataAlert(
                                true,
                                "Fecha no es válida.",
                                "error",
                                autoHideDuration
                              );
                              setfilterData({
                                ...filterData,
                                paymentDateOf: FormatData.dateFormat(
                                  new Date()
                                ).toString(),
                                paymentDateUntil: FormatData.dateFormat(
                                  new Date()
                                ).toString(),
                              });
                            }
                          }}
                        />
                        <Typography sx={{ ...TextSmallFont, mx: 3 }}>
                          Hasta:
                        </Typography>
                        <TextField
                          name="dateUntil"
                          type="date"
                          value={filterData.paymentDateUntil}
                          onChange={(e) => {
                            const selectedDateUntil = new Date(
                              e?.target?.value
                            );
                            const selectedDateOf = new Date(
                              filterData.paymentDateOf
                            );
                            // Verificar si dateUntil es mayor o igual a dateOf
                            if (
                              selectedDateOf <= selectedDateUntil ||
                              !selectedDateUntil
                            ) {
                              setfilterData({
                                ...filterData,
                                paymentDateUntil: e?.target?.value,
                              });
                            } else {
                              setDataAlert(
                                true,
                                "Fecha no es válida.",
                                "error",
                                autoHideDuration
                              );
                              setfilterData({
                                ...filterData,
                                paymentDateOf: FormatData.dateFormat(
                                  new Date()
                                ).toString(),
                                paymentDateUntil: FormatData.dateFormat(
                                  new Date()
                                ).toString(),
                              });
                            }
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Ramo</Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Select
                          sx={{ width: "100%" }}
                          value={
                            filterData.branch !== "" ? filterData.branch : 0
                          }
                          onChange={(e) => {
                            setfilterData({
                              ...filterData,
                              branch: (e?.target?.value as string) || "",
                            });
                          }}
                          variant="outlined"
                        >
                          <MenuItem key={"Todos"} value={0}>
                            Todos
                          </MenuItem>
                          {Object(valuesData?.CatalogBranches ?? []).map(
                            (data: CatalogValue) => (
                              <MenuItem key={data.folio} value={data.folio}>
                                {data?.description}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Stack direction="column" spacing={1}>
                      <Typography sx={{ ...TextSmallFont }}>Moneda</Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Select
                          sx={{ width: "100%" }}
                          value={
                            filterData.currency !== "" ? filterData.currency : 0
                          }
                          onChange={(e) => {
                            setfilterData({
                              ...filterData,
                              currency: (e?.target?.value as string) || "",
                            });
                          }}
                          variant="outlined"
                        >
                          <MenuItem key={0} value={0} disabled>
                            Selecciona
                          </MenuItem>
                          {Object(valuesData?.CatalogCurrency ?? []).map(
                            (data: any) =>
                              (data.folio === Constants.folioCurrencyMXN ||
                                data.folio === Constants.folioUsdCurrency) && (
                                <MenuItem key={data.folio} value={data.folio}>
                                  {data?.description}
                                </MenuItem>
                              )
                          )}
                        </Select>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Stack
                      direction="column"
                      spacing={2}
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ paddingLeft: "50px" }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ paddingTop: "27px" }}
                      >
                        <Button
                          size="small"
                          endIcon={<Complete color={ColorPureWhite} />}
                          onClick={() => {
                            handleSend();
                          }}
                        >
                          Procesar
                        </Button>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
                <Box sx={{ pt: 5 }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.id + ""}
                    onRowClick={handleRowClick}
                    disableRowSelectionOnClick
                  />
                </Box>
                {selectedCompany && (
                  <Grow in={true} timeout={500}>
                    <Box sx={{ pt: 5 }}>
                      {/* Compañia: {params.row.insuranceName} */}
                      <DataGrid
                        rows={receiptsData}
                        columns={receiptsColumns}
                        getRowId={(row) => row.receiptId + ""}
                        onRowClick={handleOpen}
                        disableRowSelectionOnClick
                      />
                      <Grid direction='column' container sx={{ alignContent: 'flex-end', justifyContent: 'flex-end', paddingTop: '15px' }}>
                        <Button onClick={handleExportdata}>Exportar</Button>
                      </Grid>
                    </Box>
                  </Grow>
                )}

              </Stack>
            </Box>
          </Stack>
        </Box>

      </Paper>
      {openModal && (
        <ReconciliationsModal
          open={openModal}
          close={() => {
            setOpenModal(false);
            getReceiptReconcilations()

          }}
          setOpen={setOpenModal}
          data={receiptsFolio}
        />
      )}
      <MessageBar
        open={isSnackbarOpen}
        severity={severity}
        message={messageAlert}
        close={handleSnackbarClose}
        autoHideDuration={autoHideDuration}
      />
    </>
  );
}

export default Reconciliations;
