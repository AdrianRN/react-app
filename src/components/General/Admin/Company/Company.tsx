import * as React from "react";
import { GridColDef } from "@mui/x-data-grid";
import CompaniesDataServices from "../../../../services/companies.service";
import { Complete, Delete, Edit, Plus, Search } from "../../../OuiComponents/Icons";
import { ColorPink, ColorPureWhite, DisplaySmallBoldFont, LinkSmallFont, TextSmallFont, TextXSmallFont } from "../../../OuiComponents/Theme";
import { Paper } from "../../../OuiComponents/Surfaces";
import { InputSearch } from "../../../OuiComponents/Inputs";
import { Button, InputAdornment } from "../../../OuiComponents/Inputs";
import TabModalCompany from "./TabModalCompany";
import CompanyModel from "../../../../models/Company";
import { Tooltip, Typography } from "../../../OuiComponents/DataDisplay";
import { IconButton } from "@mui/material";
import Box from "../../../OuiComponents/Layout/Box";
import DataGrid from "../../../OuiComponents/DataGrid/DataGrid";
import Title from "../../Title/Title";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import Stack from "../../../OuiComponents/Layout/Stack";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import LoadingScreen from "../../../OuiComponents/Utils/LoadingScreen";
type alertMessage = {
  message:string,
  result:any,};
function Company() {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [originalRows, setOriginalRows] = React.useState([{}]);
  const [rows, setRows] = React.useState([{}]);
  const [search, setSearch] = React.useState("");
  const [companyFolio, setCompanyFolio] = React.useState<CompanyModel>();
  const [companyType, setCompanyType] = React.useState<any>();
  const [showFormCompanies, setFormCompanies] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [changeInput, setChangeInput] = React.useState(true);
  const [showClearIcon, setShowClearIcon] = React.useState(false);
  //const [loadingScreen, setLoadingScreen] = useState(true);
  const [textAlert, setTextAlert] = React.useState<alertMessage|null>(null);

  React.useEffect(() => {
    if(change!==false)
      fetchData().finally(()=>{
        if(textAlert!==null){
          setDataAlert(true, textAlert.message, textAlert.result, autoHideDuration);
          setTextAlert(null);
        }
      });
  }, [change]);

  const fetchData = async () => {
    const companiesResponse = await CompaniesDataServices.getAll()

    setOriginalRows(Object(companiesResponse.data ?? []).filter((c: any) => c.objectStatusId !== 2))
    setRows(Object(companiesResponse.data ?? []).filter((c: any) => c.objectStatusId !== 2))
    setChange(false)
  }

  const handleInputValidation = (str: string) => { return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = handleInputValidation(event.target.value);
    setSearch(event.target.value);
    setShowClearIcon(newText.length > 0);
    let rowText: string = '';

    if (newText.length === 0) {
      setChange(true);
    } else {
      setRows(originalRows.filter((row: any) => {
        rowText = handleInputValidation(row.corporateName)
        return rowText.includes(newText);
      }))
    }
  };

  const handleCompanyEditClick = (params: any) => {
    setCompanyFolio(params.row.folio);
    setCompanyType(params?.row?.companyType ?? '');
    setFormCompanies(true);
  };

  const handleNewCompanyClick = () => {
    setCompanyFolio(undefined);
    setFormCompanies(true);
  }

  const handleRowDelete = async (params: any) => {

    const fetchDelete = async () => {
      await CompaniesDataServices.deleteByFolio(params.row.folio)
        .then((response: any) => {
          setTextAlert({
            message:'La compañía ha sido eliminada.',
            result:'success',
          });
          //setDataAlert(true, "La compañía ha sido eliminada.", "success", autoHideDuration);
        })
        .catch((e: Error) => {
          setTextAlert({
            message:e.message,
            result:'error',
          });
          //setDataAlert(true, e.message, "error", autoHideDuration);
        }).finally(async ()=>{
          setChange(true);
        });
    };

    await fetchDelete();
  };

  const columns: GridColDef[] = [
    {
      field: "corporateName",
      headerName: "Razón Social",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>
            {params.row.corporateName}
          </Typography>
        )
      }
    },
    {
      field: "abbreviation",
      headerName: "Abreviación",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>
            {params.row.abbreviation}
          </Typography>
        )
      }
    },
    {
      field: "objectStatusId",
      headerName: "Estatus",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography sx={TextSmallFont}>
            {params.row.objectStatusId === 1 ? 'Activo' : 'No activo'}
          </Typography>
        )
      }
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      type: "Action",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <>
          <Tooltip title={<Typography sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}>Editar</Typography>}>
            <IconButton onClick={() => handleCompanyEditClick(params)}>
              <Edit color={ColorPink} />
            </IconButton>
          </Tooltip>
          <Tooltip title={<Typography sx={{ ...TextXSmallFont, color: { ColorPureWhite } }}>Eliminar</Typography>}>
            <IconButton onClick={async () => handleRowDelete(params)}>
              <Delete color={ColorPink} />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const handleShowClearIcon = () => {
    setSearch("");
    setShowClearIcon(false);
    setChange(true);
  };

  const handleClickSearchName = () => {
    setChangeInput(true);
  };

  const handleKeyPressName = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setChangeInput(true);
    }
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
      <Title title={"Administración de compañías"} url={(window.location.href).slice(SIZE_WEB_URL)} />
      <Paper sx={{ p: '24px', borderRadius: '16px' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', flexGrow: 1, pr: 2 }}>
            {showFormCompanies ?
              <TabModalCompany data={companyFolio} type={companyType} open={showFormCompanies} close={() => { setChange(true); setFormCompanies(false); }} /> :
              <></>
            }

            <InputSearch
              value={search}
              showClearIcon={showClearIcon}
              handleCancelClick={handleShowClearIcon}
              handleSearchClick={handleClickSearchName}
              onKeyDown={handleKeyPressName}
              onChange={handleInputChange}
              placeholder='Buscar'
            >
              <InputAdornment position="start">
                <IconButton>
                  <Search />
                </IconButton>
              </InputAdornment>
            </InputSearch>
          </Box>
          <Box>
            <Button variant='contained' onClick={() => handleNewCompanyClick()} startIcon={<Plus color={ColorPureWhite} />} >
              Nueva compañía
            </Button>
          </Box>

        </Stack>
        <DataGrid
          //loading={change}
          rows={rows}
          columns={columns.filter((col) => col.field != 'companyId')}
          getRowId={(row) => row.companyId + ""}
          disableRowSelectionOnClick
        />
      </Paper >
      {(change !== false) ? <LoadingScreen message="Cargando" /> : <></>}
    </>
  );
}

export default Company