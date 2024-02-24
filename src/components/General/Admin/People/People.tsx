import { GridColDef } from "@mui/x-data-grid";
import * as React from "react";
import { useNavigate } from "react-router";
import PeopleDataService from "../../../../services/people.service";
import { useEffect, useState } from "react";
import Button from "../../../OuiComponents/Inputs/Button";
import InputSearch from "../../../OuiComponents/Inputs/InputSearch";
import Title from "../../Title/Title";
import CreatePerson from "./CreatePerson";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import ListItemButton from "../../../OuiComponents/DataDisplay/ListItemButton";
import IconButton from "@mui/material/IconButton/IconButton";
import Edit from "../../../OuiComponents/Icons/Edit";
import Box from "../../../OuiComponents/Layout/Box";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import Stack from "../../../OuiComponents/Layout/Stack";
import InputAdornment from "../../../OuiComponents/Inputs/InputAdornment";
import Search from "../../../OuiComponents/Icons/Search";
import { Plus } from "../../../OuiComponents/Icons";
import {
  ColorPink,
  ColorPureWhite,
  ColorWhite,
  ColorOrange,
  ColorYellow,
  ColorGreen,
  ColorBlue,
} from "../../../OuiComponents/Theme";
import DataGrid from "../../../OuiComponents/DataGrid/DataGrid";
import PersonModel from "../../../../models/People";
import TabModalPerson from "./TabModalPerson";
import catalogValueService from "../../../../services/catalogvalue.service";
import { Health, Typography } from "../../../OuiComponents/DataDisplay";
import Constants from "../../../../utils/Constants";
import PeopleService from "../../../../services/people.service";
import LoadingScreen from "../../../OuiComponents/Utils/LoadingScreen";

export default function People() {
  const [rows, setRows] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchByName, setSearchByName] = useState("");
  const [change, setChange] = React.useState(true);
  const [showClearIcon, setShowClearIcon] = React.useState(false);
  const [personFolio, setPersonFolio] = React.useState<PersonModel>();
  const [personTypePersonId, setPersonTypePersonId] = React.useState<string | undefined>();
  const [showFormPersons, setFormPersons] = React.useState(false);
  const [beneficiary, setBeneficiary] = React.useState<String | null>();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    //Esto sirve para conocer las propiedades que se envian en la URL
    // console.log('urlParams',urlParams,urlParams.entries(),
    // urlParams.keys(),urlParams.values())
    // const keysArray = Array.from(urlParams.keys());
    // // Imprimir las claves
    // console.log(keysArray);
    // // Imprimir las claves y sus valores
    // keysArray.forEach(key => {
    //   const value = urlParams.get(key);
    //   console.log(`Clave: ${key}, Valor: ${value}`);
    // });

    const openCreatePersonModal = urlParams.get('openCreatePersonModal');
    const beneficiary = urlParams.get('beneficiary');
    const folio = urlParams.get('folio');
    const typePersonId = urlParams.get('typePersonId');
    const openEditPersonModal = urlParams.get('openEditPersonModal');
    if (openCreatePersonModal && beneficiary !== null) {
      ToNewBeneficiary(beneficiary);
    }
    else if (openEditPersonModal && folio !== null && typePersonId !== null) {
      ToEditBeneficiary(folio,typePersonId);
    }
  }, []);

  useEffect(() => {
    const getPeople = async () => {
      //const response = await PeopleService.getAll();
      //const list = response.data
      setRows([])
      setChange(false);
    }
    
    getPeople();
  }, [change]);
  

  const navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const ToEditBeneficiary = (folio: any, typePersonId: any) => {
    
      setPersonFolio(folio);
      setPersonTypePersonId(typePersonId);
      setFormPersons(true);
    

  };

  const ToNewBeneficiary = (beneficiary: String) => {
    setPersonFolio(undefined);
    setPersonTypePersonId(undefined);
    setFormPersons(true);
    setBeneficiary(beneficiary);
  };

  const ToNewPerson = () => {
    setPersonFolio(undefined);
    //setPersonNationality(undefined);
    setPersonTypePersonId(undefined);
    setFormPersons(true);
  };

  const ToEditUser = (params: any) => {
    setPersonFolio(params.row.folio);
    //setPersonNationality(params.row.nationality);
    setPersonTypePersonId(params.row.typePersonId);
    setFormPersons(true);
  };

  const handleShowClearIcon = () => {
    setSearchByName("");
    setShowClearIcon(false);
    setChange(false);
    setRows([])
  };

  // Function to handle the "Enter" key press for the search by name input
  const handleKeyPressName = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setChange(true);
    }
  };

  const handleClickSearchName = () => {
    setChange(true);
  };

  const handleInputValidation = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  };

  const handleSearchTextChangeName = async(
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    
    setSearchByName(event.target.value);
    const newText = await handleInputValidation(event.target.value)
    setTimeout(async () => {
      if (event.target.value && newText === event.target.value && event.target.value.length > 0 ) {
        const response = await PeopleService.getAllsByName(newText)
        const list = response.data
  
        list.map((row: { [key: string]: any }) => {
          let columns = null;

          if(row.typePersonId === Constants.folioNaturalPerson || row.typePersonId === ''){
            columns = Object.keys(row).map((column) => {
              if (column === "name") {
                const lastName = row['lastName'] || '';
                const maternalLastName = row['maternalLastName'] || '';
                const fullName = `${row[column]} ${lastName} ${maternalLastName}`.trim();
                row['name'] = fullName;
                return { field: 'name', headerName: 'Name' };
              }
              return { field: column, headerName: column };
            });            
          }
          
          return columns;
        });
        setRows(list)
        setShowClearIcon(newText.length > 0);
        
      }else{
        setRows([]);
      }
    }, 500)
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      width: 150,
      renderCell: (params: any) => (
        <ListItemButton onClick={() => ToEditUser(params)}>
          {params.row.name}
        </ListItemButton>
      ),
    },
    {
      field: "email",
      headerName: "Correo",
      flex: 1,
      width: 150,
    },
    {
      field: "rfc",
      headerName: "RFC",
      flex: 1,
      width: 150,
    },
    {
      field: "curp",
      headerName: "CURP",
      flex: 1,
      width: 150,
    },
    {
      field: "nationality",
      headerName: "Nacionalidad",
      flex: 1,
      width: 150,
      renderCell: (params) => {
        if(params.row.nationalities)
        return (
          <Typography>
            {params.row.nationalities.description}
          </Typography>
        );
      },
    },
    {
      field: "typePersonId",
      headerName: "Tipo de persona",
      flex: 1,
      width: 150,
      renderCell: (params) => {
        if(params.row.typePerson)
        return (
          <Typography>
            {params.row.typePerson.description}
          </Typography>
        );
      },
    },
    {
      field: "healt",
      headerName: "Score",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <>
          <Box>
            {(params.row.healt == null || params.row.healt == 0) && (
              <Health
                bgColor={ColorPink}
                circleColor={ColorPureWhite}
                circleNumber="1"
              />
            )}
            {params.row.healt > 0 && params.row.healt <= 20 && (
              <Health
                bgColor={ColorPink}
                circleColor={ColorPureWhite}
                circleNumber={params.row.healt}
              />
            )}
            {params.row.healt > 20 && params.row.healt <= 40 && (
              <Health
                bgColor={ColorOrange}
                circleColor={ColorPureWhite}
                circleNumber={params.row.healt}
              />
            )}
            {params.row.healt > 40 && params.row.healt <= 60 && (
              <Health
                bgColor={ColorYellow}
                circleColor={ColorPureWhite}
                circleNumber={params.row.healt}
              />
            )}
            {params.row.healt > 60 && params.row.healt <= 80 && (
              <Health
                bgColor={ColorGreen}
                circleColor={ColorPureWhite}
                circleNumber={params.row.healt}
              />
            )}
            {params.row.healt > 80 && (
              <Health
                bgColor={ColorBlue}
                circleColor={ColorPureWhite}
                circleNumber={params.row.healt}
              />
            )}
          </Box>
        </>
      ),
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      type: "Action",
      flex: 1,
      width: 150,
      renderCell: (params: any) => (
        <>
          <IconButton onClick={() => ToEditUser(params)}>
            <Edit color={ColorPink} />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      {showFormPersons ? (
        <TabModalPerson
          data={personFolio}
          //nationality={personNationality}
          typePersonId={personTypePersonId}
          open={showFormPersons}
          beneficiary={beneficiary}
          close={() => {
            setChange(true);
            setFormPersons(false);
          }}
        />
      ) : (
        <></>
      )}

      <Title
        title={" Administración de personas"}
        url={window.location.href.slice(SIZE_WEB_URL)}
      />
      <Paper sx={{ p: "24px", borderRadius: "16px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 5 }}
        >
          <Box sx={{ display: "flex", flexGrow: 1, pr: 2 }}>
            <InputSearch
              value={searchByName}
              showClearIcon={showClearIcon}
              handleCancelClick={handleShowClearIcon}
              handleSearchClick={handleClickSearchName}
              onKeyDown={handleKeyPressName}
              onChange={handleSearchTextChangeName}
              placeholder="Buscar"
            >
              <InputAdornment position="start">
                <IconButton>
                  <Search />
                </IconButton>
              </InputAdornment>
            </InputSearch>
          </Box>
          <Box>
            <Button
              onClick={() => ToNewPerson()}
              variant="contained"
              startIcon={<Plus color={ColorPureWhite} />}
            >
              Nueva persona
            </Button>
          </Box>
        </Stack>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.personId + ""}
          disableRowSelectionOnClick
        />
      </Paper>
      {(change !== false) ? <LoadingScreen message="Cargando" /> : <></>}
    </>
  );
}
