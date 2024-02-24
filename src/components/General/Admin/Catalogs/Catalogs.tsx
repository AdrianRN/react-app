import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import IconButton from "@mui/material/IconButton/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid";
import * as React from "react";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import Catalog from "../../../../models/Catalog";
import CatalogValue from "../../../../models/CatalogValue";
import {
  deleteCatalogDetailFolio,
  getCatalogs,
  postCatalogDetail,
  putCatalogDetailFolio,
} from "../../../../services/catalog.service";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import {
  Cancel,
  Delete,
  Edit,
  Plus,
  Save,
  Search,
} from "../../../OuiComponents/Icons";
import {
  Button,
  InputAdornment,
  InputSearch,
  Switch as MuiSwitch,
} from "../../../OuiComponents/Inputs";
import { Box, Grid, Stack } from "../../../OuiComponents/Layout";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import {
  ColorGrayDisabled,
  ColorPink,
  ColorPureWhite,
  LinkLargeFont,
} from "../../../OuiComponents/Theme";
import Title from "../../Title/Title";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import BranchesService from "../../../../services/branches.service";
import catalogValueService from "../../../../services/catalogvalue.service";

interface CatalogValueInternal {
  folio: string;
  description: string;
  state?: boolean; // Propiedad opcional
}

export default function Catalogs() {
  const [originalRows, setOriginalRows] = React.useState<Catalog[]>([]);
  const [catalogsList, setCatalogsList] = React.useState<Catalog[]>([]);
  const [catalogValues, setCatalogValues] = React.useState<CatalogValueInternal[]>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [showClearIcon, setShowClearIcon] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [search, setSearch] = React.useState("");
  
  const [selectedIndexDetail, setSelectedIndexDetail] = React.useState(0);
  const [catalogId, setCatalogId] = React.useState("");

  const [newDetail, setNewDetail] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [showAddButton, setShowAddButton] = React.useState(true);
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [catalogDescription, setCatalogDescription] = React.useState<any>(null);
  

  React.useEffect(() => {
    getCatalogsList();
  }, []);

  const catalogColumns: GridColDef[] = [
    {
      field: "description",
      headerName: "Descripción",
      flex: 1,
      renderCell: (params: any) => (
        <ListItemButton
          onClick={() => getCatalogInfo(params.row.folio)}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pe: 2,
            borderRadius: 1,
          }}
        >
          {params.row.description}
          <Box display="flex" flexDirection="row-reverse">
            <ArrowForwardIcon sx={{ color: "rgb(229, 16, 93)" }} />
          </Box>
        </ListItemButton>
      ),
    },
  ];

  const catalogValuesColumns: GridColDef[] = [
  {
    field: "description",
    headerName: "valor",
    width: 250,
    editable: true,
  },
  {
    field: "Acciones",
    headerName: "Acciones",
    type: "Action",
    flex: 1,
    align: "center",
    minWidth: 150,
    width: 50,
    filterable: false,
    sortable: false,
    hideable: false,
    renderCell: (params: any) => (
      <>
        {rowModesModel[params.row.folio + params.row.description]?.mode ===
        GridRowModes.Edit ? (
          <Stack direction="row">
            <IconButton 
              onClick={(e) => saveDetail(e, params)}
              title="Guardar"
            >
              <Save color={ColorPink} />
            </IconButton>
            <IconButton 
              onClick={() => cancelDetail(params)}
              title="Cancelar"
            >
              <Cancel color={ColorPink} />
            </IconButton>
          </Stack>
        ) : (
            <Stack direction="row" alignItems={"center"}>                       
            <IconButton 
              onClick={(event) => editCatalogDetail(params)}
              title="Editar"
              disabled={
                
                (!params.row.state && params.row.folio === catalogValues[catalogValues.findIndex(item => item.folio === params.row.folio)].folio)
              }
            >
                <Edit color={
                  (!params.row.state && params.row.folio === catalogValues[catalogValues.findIndex(item => item.folio === params.row.folio)].folio)
                  ? ColorGrayDisabled : ColorPink} />
            </IconButton>
            <IconButton
              onClick={() => deleteCatalogDetailById(params.row.folio)}
              title="Eliminar"
                disabled={
                  (!params.row.state && params.row.folio === catalogValues[catalogValues.findIndex(item => item.folio === params.row.folio)].folio)}
            >
                <Delete color={
                  (!params.row.state && params.row.folio === catalogValues[catalogValues.findIndex(item => item.folio === params.row.folio)].folio)
                  ? ColorGrayDisabled : ColorPink} />
              </IconButton>
              <MuiSwitch
                onChange={(event) => editCatalogObjectStatus(params)}
                title={
                  (!params.row.state && params.row.folio === catalogValues[catalogValues.findIndex(item => item.folio === params.row.folio)].folio)
                  ? "Activar"
                    : "Desactivar"}
                defaultChecked= {(params.row.state && params.row.folio === catalogValues[catalogValues.findIndex(item => item.folio === params.row.folio)].folio)}
              />
          </Stack>
        )}
      </>
    ),
  },
];


  // const handleListItemClick = (
  //   event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  //   index: string
  // ) => {
  //   setSelectedIndex(index);
  // };

  // const handleDetailClick = (
  //   event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  //   index: number
  // ) => {
  //   setSelectedIndexDetail(index);
  // };

  const handleInputValidation = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const busqueda = handleInputValidation(e.target.value);
    setSearch(e.target.value);
    setShowClearIcon(busqueda.length > 0);
    let rowText: string = "";

    if (busqueda.length === 0) {
      setChange(true);
    } else {
      setCatalogsList(
        originalRows.filter((row) => {
          rowText = handleInputValidation(row.description);
          return rowText.includes(busqueda);
        })
      );
    }

    setShowClearIcon(busqueda.length > 0);
  };

  const getCatalogsList = () => {
    getCatalogs()
      .then((response) => response.data)
      .then((json) => {        
        setCatalogsList(json);
        setOriginalRows(json);
      });
  };

  const getCatalogInfo = async (id: string) => {
    setCatalogId(id);
    await catalogValueService.getCatalogValueAdmin(id)
      .then((response) => response.data)
      .then(async (json) => {        
        setCatalogDescription(json.description);
        //setCatalogValues(json.values)
        const updatedCatalogValues = [];

        for (let index = 0; index < json.values.length; index++) {
          const value = json.values[index];
          const response = await catalogValueService.getCatalogValueFolioAdmin(value.folio);       
    
          if (response.data !== null) {
            let stateValue: boolean = true;
          if (response.data.isActive === null) {
            stateValue = true;
          } else {
            stateValue = response.data.isActive;
          }
            
          if (value.folio === response.data.folio) {
            updatedCatalogValues[index] = {
              folio: value.folio,
              description: value.description,
              state: stateValue,
            };
          }

        }        
          }
        setCatalogValues(updatedCatalogValues);
      });      
  };

  const saveCatalogDetail = async (description: string) => {
    try {
      if (description.length > 150) {
        setDataAlert(
          true,
          "La descripción no puede superar los 150 caracteres.",
          "warning",
          autoHideDuration
        );
        getCatalogInfo(catalogId);
        setNewDetail(false);
        setShowAddButton(true)
      } else {      
        const obj = {
          description: description,
          catalogId: catalogId,
          subCatalog: "",
        };      
        const catalogResponse = await postCatalogDetail(obj);
  
        const branch = {
          catalogValueId: catalogResponse?.data.folio,
          catalogValueDescription: catalogResponse?.data.description,
          catalogId: catalogResponse?.data.catalogId,
          catalogDescription: catalogDescription
        }
  
        await BranchesService.post(branch);
        getCatalogInfo(catalogId);
        setNewDetail(false);
        setShowAddButton(true)
      }
    } catch (error) {
      console.log('error', error)
    }
  };

  const updateCatalogDetail = async (folio: string, description: string) => {
    const obj = {
      description: description,
      catalogId: catalogId,
      subCatalog: "",
      objectStatusId: "1",
    };
    const catalogResponse = await putCatalogDetailFolio(folio, obj);
    const branch = {
      catalogValueId: catalogResponse.data.folio,
      catalogValueDescription: catalogResponse.data.description,
      catalogId: catalogResponse.data.catalogId,
      catalogDescription: catalogDescription
    }    
    await BranchesService.put(branch.catalogValueId ,branch);
    setNewDetail(false);
    setDescription("");
    getCatalogInfo(catalogId);
    setSelectedIndexDetail(0);
  };

  const saveDetail = async (e: any, params: any) => {
    e.preventDefault();
    setRowModesModel({
      ...rowModesModel,
      [params.row.folio + params.row.description]: { mode: GridRowModes.View },
    });
  };

  const cancelDetail = (params: any) => {
    setShowAddButton(true)
    getCatalogInfo(catalogId);
    setRowModesModel({
      ...rowModesModel,
      [params.row.folio + params.row.description]: {
        mode: GridRowModes.View,
        ignoreModifications: true,
      },
    });
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    if (!newRow.description) return false;
    // const rowDescription = newRow.description;
    // const obj = {
    //   description: rowDescription,
    //   catalogId: catalogId,
    //   objectStatusId: "1",
    // };
    newRow.folio === "new"
      ? saveCatalogDetail(newRow.description)
      : updateCatalogDetail(newRow.folio, newRow.description);
    return true;
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const editCatalogDetail = (params: any) => {
    setRowModesModel({
      ...rowModesModel,
      [params.row.folio + params.row.description]: {
        mode: GridRowModes.Edit,
        fieldToFocus: "description",
      },
    });
  };

  const editCatalogObjectStatus = async (params: any) => {
    try {
      const response = await catalogValueService.editCatalogObjectStatus(
        params.row.folio
      );
      const updatedCatalogValues = [...catalogValues];

      const indexToUpdate = catalogValues.findIndex((catalog) => catalog.folio === response.data.folio);

      if (indexToUpdate !== -1) {
        updatedCatalogValues[indexToUpdate] = {
          ...updatedCatalogValues[indexToUpdate],
          state: response.data.isActive
        }

        setCatalogValues(updatedCatalogValues);
      }    
    } catch (error) {}
  };

  const deleteCatalogDetailById = async (folio: string) => {
    await deleteCatalogDetailFolio(folio);
    await BranchesService.deleteBranch(folio);
    getCatalogInfo(catalogId);
  };

  const addNewRow = () => {
    setCatalogValues((prevRows) => [...prevRows, new CatalogValue()]);
    setRowModesModel((oldModel) => ({ ...oldModel, "new": { mode: GridRowModes.Edit, fieldToFocus: 'description' } }));
    setShowAddButton(false);
  };

  function handleShowClearIcon(): void {
    setSearch("");
    setShowClearIcon(false);
    setChange(true);
  }

  function handleClickSearchName(): void {
    setChange(true);
  }

  function handleKeyPressName(
    event: React.KeyboardEvent<HTMLDivElement>
  ): void {
    if (event.key === "Enter") {
      setChange(true);
    }
  }

  return (
    <>
      <Title
        title={"Catálogos"}
        url={window.location.href.slice(SIZE_WEB_URL)}
      />
      <MessageBar
        open={isSnackbarOpen}
        severity={severity}
        message={messageAlert}
        close={handleSnackbarClose}
        autoHideDuration={autoHideDuration}
      />
      <Paper sx={{ p: "24px", borderRadius: "16px" }}>
        <Grid container spacing={2} sx={{ maxHeight: "100vh" }}>
          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 1,
              }}
            >
              <Typography sx={{ ...LinkLargeFont, flexGrow: 1 }} variant="h5">
                <strong>Catálogos</strong>
              </Typography>

              <InputSearch
                value={search}
                showClearIcon={showClearIcon}
                handleCancelClick={handleShowClearIcon}
                handleSearchClick={handleClickSearchName}
                onKeyDown={handleKeyPressName}
                onChange={handleChange}
                placeholder="Buscar"
              >
                <InputAdornment position="start">
                  <IconButton>
                    <Search />
                  </IconButton>
                </InputAdornment>
              </InputSearch>
            </Box>

            <List
              sx={{
                width: "auto",
                bgcolor: "background.paper",
                maxHeight: "100%",
                overflow: "auto",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              <Box sx={{ height: 520, width: "100%" }}>
                <DataGrid
                  rows={catalogsList}
                  columns={catalogColumns}
                  getRowId={(row) => row.catalogId + row.description}
                  hideFooter
                  disableRowSelectionOnClick
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
                          <Typography>No se encontraron registros</Typography>
                        </Box>
                      );
                    },
                    columnHeaders: () => null,
                  }}
                />
              </Box>
            </List>
          </Grid>

          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 1,
              }}
            >
              <Typography sx={{ ...LinkLargeFont, flexGrow: 1 }} variant="h5">
                <strong>Detalle</strong>
              </Typography>
              {catalogId && (
                <Button
                  variant="contained"
                  onClick={() => addNewRow()}
                  startIcon={<Plus color={ColorPureWhite} />}
                  size="large"
                  sx={{
                    backgroundColor: '#e5105d',
                    opacity: showAddButton ? 1 : 0,
                    pointerEvents: showAddButton ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease-in-out', // agrega una transición 
                }}
                >
                  Agregar
                </Button>
              )}
            </Box>

            <List
              sx={{ width: "auto", bgcolor: "background.paper" }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              <Box sx={{ height: 520, width: "100%" }}>
                <DataGrid
                  rows={catalogValues}
                  columns={catalogValuesColumns}
                  getRowId={(row) => { if (row.folio !== undefined && row.folio !== null) {
                    return row.folio + row.description
                  }}}
                  onRowModesModelChange={handleRowModesModelChange}
                  hideFooter
                  editMode="row"
                  rowModesModel={rowModesModel}
                  onRowEditStop={handleRowEditStop}
                  processRowUpdate={processRowUpdate}
                  disableRowSelectionOnClick
                  slotProps={{
                    toolbar: { setCatalogValues, setRowModesModel },
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
                          <Typography>No se encontraron registros</Typography>
                        </Box>
                      );
                    },
                    columnHeaders: () => null,
                  }}
                />
              </Box>
            </List>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
