import React, { useEffect } from "react";
//import {useForm} from "react-hook-form";
import { Dialog } from "../../../OuiComponents/Feedback";
import { DialogTitle, IconButton } from "@mui/material";
import {
  Attached,
  Cancel,
  Paste,
  View,
  Document,
  Chat,
  Print,
  Refresh,
  Calculator,
  DocumentFind,
  Share,
  Edit as Editar,
  Complete,
  Sinister,
  Edit,
  Fire,
} from "../../../OuiComponents/Icons";
import FormatData from "../../../../utils/Formats.Data";
import PeopleService from "../../../../services/people.service";
import CatalogValueService from "../../../../services/catalogvalue.service";
import CompaniesService from "../../../../services/companies.service";
import CircularProgress from "../../../OuiComponents/Feedback/ProgressCircular";
import { Box, Grid, Stack } from "../../../OuiComponents/Layout";
import { Avatar, Tooltip, Typography } from "../../../OuiComponents/DataDisplay";
import {
  ColorPink,
  ColorPinkDark,
  ColorPinkDisabled,
  ColorPureWhite,
  LinkLargeFont,
  LinkSmallFont,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import { Button, TextField } from "../../../OuiComponents/Inputs";
import { useNavigate, useParams } from "react-router-dom";
import Constants from "../../../../utils/Constants";
import ButtonMUI from '@mui/material/Button';
import UploadPdfFile from "../../../OuiComponents/Inputs/UploadPdfFile";
import Claim from "../../../OuiComponents/Icons/Claim";
import bondService from "../../../../services/bonds.service";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { Modal } from "../../../OuiComponents/Utils";
import ReceiptsService from "../../../../services/receipts.service";

type operationBondPolicyType = {
  noPolicy: string;
  debtorName: string;
  folioOt: string;
  description: string;
  salesPerson: string;
  statusBonds: string;
  vigency: string;
  endoso: string;
  group: string;
  typePackage: string;
  totalPremium: number;
  currency: string;
  paymentMethod: string;
};
function ModalOperationBondPolicyInquiry(props: any) {
  const [open, setOpen] = React.useState(false);
  /*const form = useForm<operationBondPolicyType>({
        defaultValues:{

        }
    });*/

  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const gottenValues = props.data;
  const date =
    FormatData.stringDateFormat(gottenValues.startCoverage ?? "") +
    " / " +
    FormatData.stringDateFormat(gottenValues.endCoverage ?? "");
  const [fullName, setFullName] = React.useState("");
  const [salesPersonFullName, setSalesPersonFullName] = React.useState("");
  const [currencyDesc, setCurrencyDesc] = React.useState("");
  const [groupDesc, setGroupDesc] = React.useState("");
  const [disabledTextfields, setDisabledTextfields] = React.useState(true);
  const [statusDesc, setStatusDesc] = React.useState("");
  const [showLoader, setShowLoader] = React.useState<boolean>(true);
  const [image, setImage] = React.useState<string | null>(null);
  const surityImage = gottenValues.suretyCompany;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const defaultImage =
    "https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/a4/e0/6b/a4e06b03-b0a0-cb68-5fc8-a0f16660cc43/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1024x1024.jpg";

  const [policyStatusDescription, setPolicyStatusDescription] = React.useState(props.data.bondStatusFolio);
  const [renewalPolicy, setRenewalPolicy] = React.useState(false);
  //Abre modal que cancela la poliza y recibos
  const [isModalOpen, setIsModalOpen] = React.useState(false);



  React.useEffect(() => {
    setOpen(props.open);
  }, [props.data]);
  const getPeopleName = async (personID: string) => {
    const clientResponse = await PeopleService.getById(personID);
    const clientData = clientResponse.data;
    return (
      clientData.name +
      " " +
      clientData.lastName +
      " " +
      clientData.maternalLastName
    );
  };
  /////////
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        let name;
        if (gottenValues.debtor) {
          name = await getPeopleName(gottenValues.debtor);
          if (name) setFullName(name + "");
        }
        if (gottenValues.salesperson) {
          name = await getPeopleName(gottenValues.salesperson);
          setSalesPersonFullName(name + "");
        }
      } catch (exception) {
        console.error(exception);
      }
    };
    fetchData();
  }, [props.data]);
  const getCatalogValueDesc = async (folio: string) => {
    const typeCurrency = await CatalogValueService.getCatalogValueFolio(folio);
    const currencyData = typeCurrency.data;

    if (!currencyData) {
      return '';
    }

    return currencyData.description;
  };
  React.useEffect(() => {
    const fetchData = async () => {
      let catalogDescription;
      if (gottenValues.currency) {
        catalogDescription = await getCatalogValueDesc(gottenValues.currency);
        setCurrencyDesc(catalogDescription + "");
      }
      if (gottenValues.group) {
        catalogDescription = await getCatalogValueDesc(gottenValues.group);
        setGroupDesc(catalogDescription + "");
      }
      if (gottenValues.bondStatusFolio) {
        catalogDescription = await getCatalogValueDesc(
          gottenValues.bondStatusFolio
        );
        setStatusDesc(catalogDescription + "");
      }
    };
    fetchData();
  }, [props.data]);
  const [operationBondPolicyValues, setOperationBondPolicyValues] =
    React.useState<operationBondPolicyType>({
      noPolicy: gottenValues.number ? gottenValues.number : "",
      debtorName: fullName ?? "",
      folioOt: gottenValues.folioOT ? gottenValues.folioOT : "",
      description: "Concepto",
      salesPerson: salesPersonFullName ?? "",
      statusBonds: statusDesc ?? "SIN STATUS",
      vigency: date ? date : "",
      endoso: "??????",
      group: groupDesc ?? "",
      typePackage: "string",
      totalPremium: gottenValues.netPremium ?? 0, //gottenValues.totalAmount ? gottenValues.totalAmount : 0,
      currency: currencyDesc ?? "",
      paymentMethod: "string",
    });
  React.useEffect(() => {
    setOperationBondPolicyValues({
      noPolicy: gottenValues.number ? gottenValues.number : "",
      debtorName: fullName ?? "",
      folioOt: gottenValues.folioOT ? gottenValues.folioOT : "",
      description: "Concepto",
      salesPerson: salesPersonFullName ?? "",
      statusBonds: statusDesc ?? "SIN STATUS", // gottenValues.statusBonds ? gottenValues.statusBonds : "SIN STATUS???",
      vigency: date ? date : "",
      endoso: "SIN ENDOSO????",
      group: groupDesc ?? "",
      typePackage: "SIN PLAN???",
      totalPremium: gottenValues.netPremium ?? 0, //gottenValues.totalAmount : 0,
      currency: currencyDesc ?? "",
      paymentMethod: "SIN FORMA DE PAGO???",
    });
  });
  useEffect(() => {
    if (image === null) {
      setTimeout(() => {
        setShowLoader(false);
      }, 1000); // cuenta 1 segundo por cada 1000
    }
  }, [image]);

  useEffect(() => {
    const fetchLogo = async () => {
      if (surityImage && surityImage != "") {
        const logo = await CompaniesService.getByFolio(surityImage);
        const companyLogo = logo.data.logo;
        const companyLogoUrl = FormatData.getUriLogoCompany(companyLogo);
        setImage(companyLogoUrl);
      }
    };
    fetchLogo();
  }, [props.data]);
  //----Navegacion
  const navigate = useNavigate();
  const handleNavigateConsult = () => {
    navigate(
      "/index/fianzas/polizas/emision/" +
      gottenValues.debtor +
      "/" +
      gottenValues.folio +
      "/" +
      '0'
    );
  };
  const handleNavigateModify = () => {
    navigate(
      "/index/fianzas/polizas/emision/" +
      gottenValues.debtor +
      "/" +
      gottenValues.folio +
      "/" +
      '1'
    );
  };

  const handleNavigateReceipts = () => {
    navigate(
      "/index/fianzas/polizas/emision/" +
      gottenValues.debtor +
      "/" +
      gottenValues.folio +
      "/" +
      '1'
    );

    setTimeout(() => {
      var receiptsButton = document.getElementById('simple-tab-1');

      if (receiptsButton) {
        receiptsButton.click();
      } else {
        console.error("El elemento con ID 'simple-tab-1' no se encontró.");
      }
    }, 1000);
  };
  //--Validar modificacion
  let hideModify: boolean = false;
  hideModify =
    statusDesc != Constants.statusPending &&
      statusDesc != null &&
      statusDesc != undefined &&
      statusDesc != ""
      ? false
      : true;

  useEffect(() => {
    // Calcula la diferencia de días y actualiza el estado de renewalPolicy
    const diffDays = Math.round(
      (new Date(props.data.endCoverage).getTime() -
        new Date().getTime()) /
      (1000 * 60 * 60 * 24)
    );

    setRenewalPolicy(
      diffDays <= 90 &&
        (props.data.bondStatusFolio ==
          Constants.statusActiveFolio ||
          props.data.bondStatusFolio ==
          Constants.statusExpireFolio ||
          props.data.bondStatusFolio ==
          Constants.statusExpiredDateFolio)
        ? true
        : false
    );


  }, [props.data]);

  const handleRenewPolicy = () => {
    bondService.postCopyBondFolio(props.data.folio)
      .then((response: any) => {
        setDataAlert(
          true,
          "Se genero la renovación de la póliza con éxito.",
          "success",
          autoHideDuration
        );
      })
      .catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      });
  };

  const handleCloseModal = () => {
    props.setOpen(false); // Usar setOpen para cerrar el modal
  };



  const cancelPolicynModal = (
    <>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        sx={{ width: "100%", height: "100%", top: "150px" }}
        disableEnforceFocus
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: "555px",
            borderRadius: "20px",
            padding: "16px",
            margin: "auto",
            top: "150px",
            backgroundColor: ColorPureWhite,
          }}
          textAlign="center"
        >
          <Typography sx={{ ...LinkSmallFont, height: "62px" }}>
            {
              "Cancelar la póliza implicará también la cancelación de los recibos. ¿Desea continuar?"
            }
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Button
              sx={{ marginRight: "auto", height: "30px" }}
              variant="outlined"
              onClick={() => setIsModalOpen(false)}
            >
              No
            </Button>
            <Button
              onClick={async () => {
                let obj = props.data;
                delete obj.bondsId;
                delete obj.folioOT;

                obj.bondStatusFolio = Constants.statusCancelledFolio;

                await bondService.put(obj.folio, obj);
                await ReceiptsService.putReceiptBondsByPolicyFolio(props.data.folio, Constants.statusCancelledFolio);

                setDataAlert(
                  true,
                  "Se canceló la póliza con éxito.",
                  "success",
                  autoHideDuration
                );


                

                setIsModalOpen(false);
              }}
              sx={{ height: "20px", padding: "10px 25px" }}
            >
              Si
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );



  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="modal-modal-title"
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: "15px",
            padding: '0px 28px',
            width: "1025px",
            height: "auto",
          },
        }}
      >
        <MessageBar
          open={isSnackbarOpen}
          severity={severity}
          message={messageAlert}
          close={handleSnackbarClose}
          autoHideDuration={autoHideDuration}
        />
        <IconButton
          onClick={props.close}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <Cancel />
        </IconButton>
        <Stack
          direction="row"
          alignItems="flex-end"
          justifyContent="space-between"
          sx={{
            marginRight: "5%",
            marginTop: "20px",
          }}
        >
          {/* Título */}
          <Typography
            style={{ margin: '30px 10px' }}
            sx={LinkLargeFont}
          >
            Operación póliza
          </Typography>
          {/* Botones */}
          <Stack direction="row" spacing={2}>
            <Tooltip title={"Renovar Póliza"}>
              <span>
                <ButtonMUI
                  variant="contained"
                  disabled={renewalPolicy ? false : true}
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: ColorPink,
                    "&:hover": { backgroundColor: ColorPink },
                  }}
                  onClick={handleRenewPolicy}
                >
                  <Refresh color="#FFF" />
                </ButtonMUI>
              </span>
            </Tooltip>
            {props.data.folio && <UploadPdfFile policyFolio={props.data.folio} policyStatus={props.data.bondStatusFolio} />}
          </Stack>
        </Stack>

        <Grid container spacing={2} sx={{ paddingTop: "10px" }}>

          {/* Grid a la izquierda */}
          <Grid item sx={{ maxWidth: '190px' }} >
            <Box sx={{ "& button": { m: 0.5 } }}>
              <Stack sx={{ order: { xs: 2, sm: 1 }, }}>
                <Button
                  variant="outlined"
                  sx={{ height: "50px", borderRadius: "16px", maxWidth: '188px' }}
                  //disabled={handleVigencyStatus()}
                  onClick={handleNavigateConsult}
                >
                  <View color={ColorPink} />
                  Consultar
                </Button>
                <Button
                  variant="outlined"
                  sx={{ height: "50px", borderRadius: "16px", maxWidth: '188px' }}
                  onClick={handleNavigateModify}
                  disabled={props.data.bondStatusFolio !== "CAVA-242"}
                >
                  <Editar color={props.data.bondStatusFolio !== "CAVA-242" ? '#ed94ad' : ColorPink} />
                  Modificar
                </Button>

                <Button
                  variant="outlined"
                  sx={{ height: "50px", borderRadius: "16px", maxWidth: '188px' }}
                  onClick={handleNavigateReceipts}
                >
                  <Document color={ColorPink} />
                  Recibos
                </Button>
                <Button
                  variant="outlined"
                  sx={{ height: "50px", borderRadius: "16px", maxWidth: '188px' }}
                onClick={() =>
                  navigate("/index/fianzas/reclamos/" + props.data.folio)
                }
                >
                  <span style={{margin:'3px'}}>
                    <Claim color={ColorPink} />
                  </span> Reclamación
                  
                </Button>
                <Button
                  variant="outlined"
                  sx={{ height: "50px", borderRadius: "16px", maxWidth: '188px' }}
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                  
                >
                  <Cancel color={ColorPink} />
                  Cancelar
                </Button>





              </Stack>
            </Box>
          </Grid>

          {/* Stack a la derecha */}
          <Grid sx={{ marginLeft: '32px' }}>
            <Stack direction="column" spacing={3} sx={{ flexGrow: 1, width: '100%' }}>

              {/*---------------------------IMG Box-----------------------------------*/}
              <Box
                height="82px"
                width="100px"
                borderRadius={3}
                onClick={() => { }}
              >
                <input type="file" accept="image/*" hidden ref={inputRef} />
                {showLoader ? (
                  <CircularProgress />
                ) : image !== null ? (
                  <Avatar
                    src={image}
                    variant="rounded"
                    alt="Policy Image"
                    sx={{
                      width: "100%",
                      height: "100%",
                      marginLeft: "16px"
                    }}
                  />
                ) : (
                  <img
                    src={defaultImage}
                    alt="Imagen de Relleno"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                )}
              </Box>
              {/*---------------------------Póliza/Contratante/OT-----------------------------------*/}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                {/* Póliza */}
                <Grid alignSelf="center" sx={{ marginRight: '20px' }}>
                  <Typography sx={LinkSmallFont}>Póliza</Typography>
                  <TextField
                    value={operationBondPolicyValues.noPolicy ?? ""}
                    onChange={(e) => { }}
                    disabled={disabledTextfields}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                {/* Contratante */}
                <Grid alignSelf="center" sx={{ marginRight: '20px' }}>
                  <Typography sx={LinkSmallFont}>Contratante</Typography>
                  <TextField
                    value={operationBondPolicyValues.debtorName ?? ""}
                    onChange={(e) => { }}
                    disabled={disabledTextfields}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                {/* OT */}
                <Grid alignSelf="center" sx={{ marginRight: '20px' }}>
                  <Typography sx={LinkSmallFont}>OT</Typography>
                  <TextField
                    value={operationBondPolicyValues.folioOt ?? ""}
                    onChange={(e) => { }}
                    disabled={disabledTextfields}
                    sx={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
              {/* ... (Código adicional) */}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                {/* Vendedor */}
                <Grid alignSelf="center" sx={{ marginRight: '20px' }}>
                  <Typography sx={LinkSmallFont}>Vendedor</Typography>
                  <TextField
                    value={operationBondPolicyValues.salesPerson ?? ""}
                    onChange={(e) => { }}
                    disabled={disabledTextfields}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                {/* Status */}
                <Grid alignSelf="center" sx={{ marginRight: '20px' }}>
                  <Typography sx={LinkSmallFont}>Status</Typography>
                  <TextField
                    value={operationBondPolicyValues.statusBonds ?? "SIN STATUS"}
                    onChange={(e) => { }}
                    disabled={disabledTextfields}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                {/* Vigencia */}
                <Grid alignSelf="center" sx={{ marginRight: '20px' }}>
                  <Typography sx={LinkSmallFont}>Vigencia</Typography>
                  <TextField
                    value={operationBondPolicyValues.vigency ?? ""}
                    onChange={(e) => { }}
                    disabled={disabledTextfields}
                    sx={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
              {/* ... (Código adicional) */}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                {/* Grupo */}
                <Grid alignSelf="center" sx={{ marginRight: '20px' }}>
                  <Typography sx={LinkSmallFont}>Grupo</Typography>
                  <TextField
                    value={operationBondPolicyValues.group ?? ""}
                    onChange={(e) => { }}
                    disabled={disabledTextfields}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                {/* Prima Neta */}
                <Grid alignSelf="center" sx={{ marginRight: '20px' }}>
                  <Typography sx={LinkSmallFont}>Prima Neta</Typography>
                  <TextField
                    value={
                      "$ " +
                      Intl.NumberFormat("en-US").format(
                        operationBondPolicyValues.totalPremium
                      )
                    }
                    onChange={(e) => { }}
                    disabled={disabledTextfields}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                {/* Moneda */}
                <Grid alignSelf="center" sx={{ marginRight: '20px' }}>
                  <Typography sx={LinkSmallFont}>Moneda</Typography>
                  <TextField
                    value={operationBondPolicyValues.currency ?? ""}
                    onChange={(e) => { }}
                    disabled={disabledTextfields}
                    sx={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
              {/*---------------------------Botones-----------------------------------*/}
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2 }}
                rowGap={"28px"}
              >
                <Grid item xs={12} md={6} lg={4} alignSelf="center">
                  {/* Agrega aquí los botones necesarios */}
                </Grid>
              </Grid>
              {/*---------------------------Cerrar Button-----------------------------------*/}
            </Stack>
          </Grid>
        </Grid>

















        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2 }}
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <Grid item xs={3} md={6} lg={2} alignSelf="center">
            <Button
              onClick={props.close}
              variant="outlined"
              sx={{ right: 32, bottom: 8 }}
            >
              Cerrar
            </Button>
          </Grid>
        </Grid>
      </Dialog>
      {cancelPolicynModal}
    </>
  );


}
export default ModalOperationBondPolicyInquiry;






