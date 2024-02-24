import { GridColDef } from "@mui/x-data-grid";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import DataGrid from "../../../OuiComponents/DataGrid/DataGrid";
import {
  ColorError,
  ColorGreen,
  ColorPink,
  ColorWhite,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import Box from "../../../OuiComponents/Layout/Box";
import { Avatar, Typography } from "../../../OuiComponents/DataDisplay";
import { Stack } from "../../../OuiComponents/Layout";
import { useParams } from "react-router-dom";
import {
  Button, 
} from "../../../OuiComponents/Inputs";
import { Delete, Edit, Plus } from "../../../OuiComponents/Icons";
import Autocomplete from "../../../OuiComponents/Inputs/Autocomplete";
import Title from "../../Title/Title";
import Paper from "../../../OuiComponents/Surfaces/Paper";
import IconButton from "@mui/material/IconButton/IconButton";
import { endorsementService } from "../../../../services/endorsement.service";
import { IEndorsement } from "../../../../insuranceModels/Endorsement";
import PoliciesService from "../../../../insuranceServices/policies.service";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import CompaniesService from "../../../../services/companies.service";
import FormatData from "../../../../utils/Formats.Data";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";
import { useErrorBoundary } from "react-error-boundary";
import PoliciyService from "../../../../insuranceServices/policies.service";
import Constants from "../../../../utils/Constants";
import catalogValueService from "../../../../services/catalogvalue.service";
//import { Constants } from "@azure/msal-common";


export interface IPolicyInfo {
  folio: string,
  noPolicy: string,
  insuranceCompany: string,
  clientName: string,
  insuranceId: string,
  policyStatusFolio:string,
  policyStatusDescription:string,
}


export default function Endorsement() {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const { showBoundary } = useErrorBoundary();
  const [rows, setRows] = React.useState<IEndorsement[]>([]);
  const [change, setChange] = React.useState(true);
  const navigate = useNavigate();
  const { policyId } = useParams();
  const [image, setImage] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [policyFolio, setPolicyFolio] = React.useState(policyId ? policyId : "");
  const [policy, setPolicy] = React.useState<IPolicyInfo>()
  const [disable, setDisabled] = React.useState(false);
  
  React.useEffect(() => {
   if(policyId){
      validatePolicy();
      getAllEndorsement(policyFolio);
      fetchData(policyFolio);
      getPolicyInfo(policyFolio);
    }
   
  }, [change]);

  //Traer catalogos effect
  React.useEffect(()=>{
    fetchCatalogsData();
  },[])
  const [endorsementType, setEndorsementType] = React.useState<any>();
  const fetchCatalogsData = async () => {
    const responseEndorsementTypeCatalog = await catalogValueService.getCatalogValueByCatalogId(Constants.endorsementInsuranceCatalogFolio)
        const responseEndorsementTypeCatalogIndexed = (responseEndorsementTypeCatalog.data).reduce((acc: any,el:any)=>{
            acc[el.folio]=el
            return acc
        },{})
        setEndorsementType(responseEndorsementTypeCatalogIndexed??[])

  }
const validatePolicy = async () => {
  if(policyFolio){
    await PoliciyService.getPoliciesByFolio(policyFolio).then((response)=>{
      if(response.data.policyStatusFolio === Constants.statusCancelledFolio)
        setDisabled(true);
    });
  }
};
  const getAllEndorsement = async (folio: string) => {
    try {
    const response = await endorsementService.getEndorsementPolicy(folio);
    setRows(response.data);
    setChange(false);
    } catch (error) {
      // Manejo de errores
      console.error("Error al obtener datos:", error);
      showBoundary(error);
    }
    
  };

  const getPolicyInfo = async (folio: string) => {
    try {
    const response = await PoliciesService.getPoliciesByFolio(folio);
    setPolicy(response.data)
    } catch (error) {
      console.error("Error al obtener datos:", error);
      showBoundary(error);
    }
  }

  const fetchData = async (folio: string) => {

    try {
      const response = await PoliciesService.getPoliciesByFolio(folio);
      // Ahora que hemos obtenido el dato de la primera petición, podemos usarlo para la segunda petición

      const companyResponse = await CompaniesService.getByFolio(response.data.insuranceId);

      // Actualiza la URL de la imagen en el estado
      setPolicy(response.data)
      setImage(FormatData.getUriLogoCompany(companyResponse.data.logo));

    } catch (error) {
      // Manejo de errores
      console.error("Error al obtener datos:", error);
    }

  };

  const columns: GridColDef[] = [
    {
      field: "numberEndorsement",
      headerName: "No. Endoso",
      flex: 1,
      valueGetter: (params) => {
        
        if (params.row.endorsement[0].numberEndorsement) {
          return params.row.endorsement[0].numberEndorsement;
        }
      },
    },
    {
      field: "endorsementTypes",
      headerName: "Tipo de endoso",
      flex: 1,
      renderCell: (params) => {
        return (
            <Typography sx={TextSmallFont}>
                {
                    endorsementType[params.row.endorsement[0]?.endorsementType??'']?.description ?? 'DESCONOCIDO'
                }
            </Typography>
        )
    }
    },
    {
      field: "concept",
      headerName: "Concepto",
      flex: 1,
      valueGetter: (params) => {
        
        if (params.row.endorsement[0].concept) {
          return params.row.endorsement[0].concept;
        }
      },
    },
    {
      field: "startDate",
      headerName: "Vigencia Inicial",
      flex: 1,
      valueGetter: (params) => {
        if (params.row.endorsement[0].startDate) {
          return FormatData.stringDateFormatDDMMYYY(params.row.endorsement[0].startDate);
        }
      },
    },
    {
      field: "endDate",
      headerName: "Vigencia Final",
      flex: 1,
      valueGetter: (params) => {
        if (params.row.endorsement[0].endDate) {
          return FormatData.stringDateFormatDDMMYYY(params.row.endorsement[0].endDate);
        }
      },
    },
    {
      field: "totalPremium",
      headerName: "Prima Total",
      flex: 1,
      valueGetter: (params) => {
        var showIt:boolean = true;
        if(params.row.endorsement[0]?.transactions&&
          params.row.endorsement[0]?.transactions!==''){
            showIt=enableCharge(params.row.endorsement[0]?.transactions);
        }
        const number = params.row.endorsement[0].totalPremium;
        if(showIt){
          return `$ ${new Intl.NumberFormat().format(number)}`;
        }else{
          return 'No aplica.';
        }
        
      },
    },
    {
      field: "objectStatusId",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        if (params.row.endorsement[0].objectStatusId === 1) {
          return <Typography color={ColorGreen}>VIGENTE</Typography>;
        } else {
          return <Typography color={ColorError}>EXPIRO</Typography>;
        }
      },
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      flex: 1, // Set default flex value
      renderCell: (params: any) => (
        <>
          <IconButton onClick={() => handleEditEndorsement(params)} >
            <Edit color={ColorPink} />
          </IconButton>

          <IconButton onClick={() => handleDeleteEndorsement(params)}>
            <Delete color={ColorPink} />
          </IconButton>
        </>
      ),
    },
  ];
  const enableCharge = (transaction: string) =>{
    let active: boolean = true;
    switch(transaction){
    case Constants.endorsementTransactions.switchContractor://CAMBIO DE CONTRATANTE
      active = false;
      break;
    case Constants.endorsementTransactions.modify://MODIFICAR ENDOSO GENERAL
      active = false;
      break;
    case Constants.endorsementTransactions.cancelPolicy://CANCELACION DE POLIZA
      active = false;
      break;
    case Constants.endorsementTransactions.addPolicyholder://BENEFICIARIO PREFERETE
    active = false;  
    break;
    default:
   }
    return active;
  };
  const handleEditEndorsement = (params: any) => {    
    navigate(`/index/seguros/endosos/NuevoEndoso/${params.row.policy}/${params.row.folio}`);
  };

  const handleDeleteEndorsement = async (params: any) => {
    await endorsementService.deleteEndorsement(params.row.folio);
    setDataAlert(true,"El endoso se eliminó exitosamente.","success",autoHideDuration);
    getAllEndorsement(policyFolio);
  };

  const getCompayLogo = async (insuranceId:string) => {
    const companyResponse = await CompaniesService.getByFolio(
      insuranceId
    );

    let companyLogoUrl = "";

    if (companyResponse.data) {
      // Actualiza la URL de la imagen en el estado
      companyLogoUrl = FormatData.getUriLogoCompany(companyResponse.data.logo);
    }

    if (companyLogoUrl) {
      setImage(companyLogoUrl);
    } else {
      setImage(null);
    }

  }

  const handleCallBack = (obj: any) => {
    getCompayLogo(obj.insuranceId);
    getAllEndorsement(obj.folio);
    getPolicyInfo(obj.folio);    
  }

  useEffect(() => {   

    if (image === null) {
      setTimeout(() => {
        setShowLoader(false);
      }, 1000); // Espera 1 segundo antes de mostrar la imagen de relleno
    }  

  }, [image]); 

  return (
    <>
      <MessageBar
        open={isSnackbarOpen}
        severity={severity}
        message={messageAlert}
        close={handleSnackbarClose}
        autoHideDuration={autoHideDuration}
      />
      <Title title={"Endosos"} url={window.location.href.slice(SIZE_WEB_URL)} />

      <Paper sx={{ p: "24px", borderRadius: "16px" }}>
        <Box sx={{ mb: 5 }}>
          <Box sx={{ padding: "5px 5px 5px 5px" }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box width="250px">
                <Autocomplete
                  parentCallBack={handleCallBack}
                  function={PoliciesService.getPoliciesByNoPolicy}
                  name={"noPolicy"}
                  placeholderValue="Buscar póliza"
                />
              </Box>
              <Typography sx={{ ...TextSmallFont, mx: 3 }}>
                Núm.Póliza: {policy?.noPolicy}
              </Typography>
              <Typography sx={{ ...TextSmallFont, mx: 3 }}>
                Estado de la póliza: {policy?.policyStatusDescription}
              </Typography>
              <Typography sx={{ ...TextSmallFont, mx: 3 }}>
                Cliente: {policy?.clientName}
              </Typography>

              <Avatar
                src={image ?? undefined}
                variant="rounded"
                alt="Policy Image"
                sx={{
                  width: "120px",
                  height: "100px",
                  mx: 3,
                }}
              />

              <Box>
                <Button
                  size="small"
                  sx={{ mx: 1 }}
                  onClick={() =>{
                    if(policy?.policyStatusFolio !== Constants.statusActiveFolio){
                      setDataAlert(true,"Solo las pólizas con estado 'VIGENTE' pueden generar endosos.","error",autoHideDuration);
                    }else{
                      navigate(
                      "/index/seguros/endosos/NuevoEndoso/" + policy?.folio
                      );
                    }
                  }}
                  startIcon={<Plus color={ColorWhite} />}
                  disabled={disable || policy?.noPolicy ? false: true}
                >
                  Nuevo endoso
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.folio + ""}
          disableRowSelectionOnClick
        />
      </Paper>
    </>
  );
}
