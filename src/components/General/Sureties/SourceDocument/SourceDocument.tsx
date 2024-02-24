import { GridColDef } from "@mui/x-data-grid";
import * as React from "react";
import { useNavigate } from "react-router";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import {
  ColorGrayDark2,
  ColorGreen,
  ColorPink,
  ColorPureWhite,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import Box from "../../../OuiComponents/Layout/Box";
import { ListItemButton, Typography } from "../../../OuiComponents/DataDisplay";
import { Grid } from "../../../OuiComponents/Layout";
import { useParams } from "react-router-dom";
import sourceDocumentService from "../../../../services/sourceDocument";
import { ISourceDocument } from "../../../../models/SourceDocument";
import { Button } from "../../../OuiComponents/Inputs";
import AddIcon from "@mui/icons-material/Add";
import { Delete, Edit, History, Plus } from "../../../OuiComponents/Icons";
import peopleService from "../../../../services/people.service";
import Autocomplete from "../../../OuiComponents/Inputs/Autocomplete";
import Title from "../../Title/Title";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import SourceDocumentModal from "./SourceDocumentModal";
import IconButton from "@mui/material/IconButton/IconButton";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";

export default function SourceDocument() {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [rows, setRows] = React.useState<ISourceDocument[]>([]);
  const [clientFullName, setClientFullName] = React.useState("");
  const [change, setChange] = React.useState(true);
  const [sourceDocumentModal, setSourceDocumentModal] = React.useState(false);
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [sourceDocumentFolio, setSourceDocumentFolio] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [clientFolio, setClientFolio] = React.useState(
    clientId ? clientId : ""
  );
  const [sourceDocument, setSourceDocument] = React.useState<ISourceDocument>();
  React.useEffect(() => {
    getSourceDocuments("0");
  }, [change]);

  const columns: GridColDef[] = [
    {
      field: "relatedTo",
      headerName: "Relacionado a",
      headerClassName: "column",
      flex: 1,
      renderCell: (params: any) => (
        <ListItemButton
          onClick={() =>
            navigate(
              `/index/fianzas/polizas/${params.row.client.folio}/${params.row.folio}`
            )
          }
        >
          {params.row.relatedTo}
        </ListItemButton>
      ),
    },
    {
      field: "beneficiary",
      headerName: "Beneficiario",
      headerClassName: "column",
      flex: 1,
      valueGetter: (params) => {
        if (params.row.beneficiary) {
          return params.row.beneficiary.fullName;
        }
      },
    },
    {
      field: "documentType",
      headerName: "Tipo",
      headerClassName: "column",
      flex: 1,
      valueGetter: (params) => {
        if (params.row.documentType) {
          return params.row.documentType.description;
        }
      },
    },
    {
      field: "endDate",
      headerName: "Vigencia",
      headerClassName: "column",
      flex: 1,
      valueGetter: (params) => {
        if (params.row.endDate) {
          return new Date(params.row.endDate).toLocaleDateString();
        }
      },
    },
    {
      field: "obligationDate",
      headerName: "Obligación",
      headerClassName: "column",
      flex: 1,
      valueGetter: (params) => {
        if (params.row.obligationDate) {
          return new Date(params.row.obligationDate).toLocaleDateString();
        }
      },
    },
    {
      field: "bondNumber",
      headerName: "Fianzas",
      headerClassName: "column",
      flex: 1,
    },
    {
      field: "objectStatusId",
      headerName: "Estatus",
      headerClassName: "column",
      flex: 1,
      renderCell: (params) => {
        if (params.row.objectStatusId == 1) {
          return <Typography color={ColorGreen}>VIGENTE</Typography>;
        }
      },
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      headerClassName: "column",
      type: "Action",
      flex: 1, // Set default flex value
      renderCell: (params: any) => (
        <>
          <IconButton onClick={() => ToEditDocument(params)}>
            <Edit color={ColorPink} />
          </IconButton>

          <IconButton onClick={() => handleDocumentDeleteClick(params)}>
            <Delete color={ColorPink} />
          </IconButton>
        </>
      ),
    },
  ];

  const getSourceDocuments = (id: string) => {
    if (id !== "0") {
      sourceDocumentService
        .getSourceDocumentByClientId(id)
        .then((response) => response.data)
        .then((json) => setRows(json));
    }
    if (clientId) {
      sourceDocumentService
        .getSourceDocumentByClientId(clientId)
        .then((response) => response.data)
        .then((json) => {
          setRows(json);
          setClientFullName(
            json[0].client.name +
              " " +
              json[0].client.lastName +
              " " +
              json[0].client.maternalLastName
          );
        });
    }
  };

  const data = rows.map((row: { [key: string]: any }) => {
    const columns = Object.keys(row.beneficiary).map((column) => {
      if (column === "name") {
        const lastName = row.beneficiary["lastName"] || "";
        const maternalLastName = row.beneficiary["maternalLastName"] || "";
        const fullName =
          `${row.beneficiary[column]} ${lastName} ${maternalLastName}`.trim();
        row.beneficiary["fullName"] = fullName;
        return { field: "name", headerName: "Name" };
      }
      return { field: column, headerName: column };
    });
    return columns;
  });

  const data2 = rows.map((row: { [key: string]: any }) => {
    const columns = Object.keys(row.client).map((column) => {
      if (column === "name") {
        const clientLastName = row.client["lastName"] || "";
        const clientMaternalLastName = row.client["maternalLastName"] || "";
        const clientFullName =
          `${row.client[column]} ${clientLastName} ${clientMaternalLastName}`.trim();

        const sellerLastName = row.seller["lastName"] || "";
        const sellerMaternalLastName = row.seller["maternalLastName"] || "";
        const sellerFullName =
          `${row.seller[column]} ${sellerLastName} ${sellerMaternalLastName}`.trim();

        row.seller["fullName"] = sellerFullName;
        row.client["fullName"] = clientFullName;

        return { field: "name", headerName: "Name" };
      }
      return { field: column, headerName: column };
    });
    return columns;
  });

  const handleCallBack = ({ name, folio }: any) => {
    setClientFullName(name);
    getSourceDocuments(folio);
    setClientFolio(folio);
  };

  const handleNewSourceDocument = () => {
    setSourceDocument(undefined);
    setOpen(true);
  };

  const ToEditDocument = (params: any) => {
    setSourceDocument(params.row);
    setSourceDocumentFolio(params.row.folio);
    setOpen(true);
  };

  const handleDocumentDeleteClick = async (params: any) => {
    await sourceDocumentService
      .deleteSourceDocument(params.row.folio)
      .then((response: any) => {
        setDataAlert(true, "El documento fue eliminado.", "success", autoHideDuration);
      })
      .catch((e: Error) => {
        setDataAlert(true,e.message,"error",autoHideDuration);
      });

    getSourceDocuments(clientFolio);
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
        title={"Documentos fuente"}
        url={window.location.href.slice(SIZE_WEB_URL)}
      />
      <Paper sx={{ p: "24px", borderRadius: "16px" }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={7}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={TextSmallFont}>
              {clientFullName && <>{clientFullName}</>}
            </Typography>
            <Box width={300}>
              <Autocomplete
                parentCallBack={handleCallBack}
                function={peopleService.getAllByName}
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={5}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              size="small"
              sx={{ mx: 1 }}
              onClick={handleNewSourceDocument}
              startIcon={<Plus color={ColorPureWhite} />}
            >
              {" "}
              Nuevo documento
            </Button>
            <Button
              size="small"
              sx={{ mx: 1 }}
              startIcon={<History color={ColorPureWhite} />}
            >
              Historial
            </Button>
          </Grid>
        </Grid>
        <Box
          sx={{
            "& .column": {
              backgroundColor: ColorGrayDark2,
              color: "white",
              textAlign: "center",
            },
            ...(rows.length === 0 && {
              height: 200,
            }),
          }}
        >
          <DataGrid
            //loading={change}
            rows={rows}
            sx={{
              // disable cell selection style
              ".MuiDataGrid-cell:focus": {
                outline: "none",
              },
              // pointer cursor on ALL rows
              "& .MuiDataGrid-row:hover": {
                cursor: "pointer",
              },
              mt: 5,
            }}
            columns={columns}
            getRowId={(row) => row.folio + ""}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            slots={{
              noRowsOverlay: () => {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <Typography>No se enontraron registros</Typography>
                  </Box>
                );
              },
            }}
            pageSizeOptions={[10, 20, 30]}
            disableRowSelectionOnClick
          />
        </Box>
      </Paper>

      {open && (
        <SourceDocumentModal
          clientFolio={clientFolio}
          open={open}
          data={sourceDocument}
          sourceDocumentFolio={sourceDocumentFolio}
          close={() => {
            setChange(true);
            setOpen(false);
            getSourceDocuments(clientFolio);
          }}
        />
      )}
    </>
  );
}
