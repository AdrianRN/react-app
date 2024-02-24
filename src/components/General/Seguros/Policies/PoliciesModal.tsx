import Dialog from "../../../OuiComponents/Feedback/Dialog";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import { Button, TextField } from "../../../OuiComponents/Inputs";
import Stack from "../../../OuiComponents/Layout/Stack";
import Grid from "../../../OuiComponents/Layout/Grid";
import {
  Avatar,
  Tooltip,
  Typography,
} from "../../../OuiComponents/DataDisplay";
import { Box, DialogTitle, IconButton } from "@mui/material";
import ModelPolicies from "../../../../insuranceModels/policies";
import PoliciesService from "../../../../insuranceServices/policies.service";
import React, { useState, useRef, useEffect } from "react";
import {
  Cancel,
  Complete,
  Document,
  Edit,
  Paste,
  Refresh,
  View,
} from "../../../OuiComponents/Icons";
import { useNavigate } from "react-router-dom";
import FormatData from "../../../../utils/Formats.Data";
import CompaniesService from "../../../../services/companies.service";
import CircularProgress from "../../../OuiComponents/Feedback/ProgressCircular";
import PeopleService from "../../../../services/people.service";
import CatalogValueService from "../../../../services/catalogvalue.service";
import ModelCatalogValue, { CacheCatalogValue } from "../../../../models/CacheCatalogValue";
import CoveragePackage from "../../../../insuranceModels/coveragepackage";
import {
  ColorPink,
  ColorPinkDark,
  ColorPureWhite,
  LinkLargeFont,
  LinkSmallFont,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import CoveragePackagesService from "../../../../insuranceServices/coveragepackages.service";
import Constants from "../../../../utils/Constants";
import ButtonMUI from "@mui/material/Button";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { Modal } from "../../../OuiComponents/Utils";
import { endorsementService } from "../../../../services/endorsement.service";
import ReceiptsService from "../../../../services/receipts.service";
import LoadingScreen from "../../../OuiComponents/Utils/LoadingScreen";
import UploadPdfFile from "../../../OuiComponents/Inputs/UploadPdfFile";
import CacheService from "../../../../services/cache.service";
import CatalogValue from "../../../../models/CatalogValue";
import CarAccident from "../../../OuiComponents/Icons/CarAccident";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import dayjs from "dayjs";
import VehiclePolicy from "../../../../insuranceServices/vehiclepolicy.service";
import DamagePoliciesService from "../../../../insuranceServices/damagePolicies.service";
import SubBranchesService from "../../../../services/subbranches.service";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix="$"
        decimalSeparator={"."}
        decimalScale={2}
      />
    );
  }
);

function NewDesign(props: any) {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [policy, setPolicy] = React.useState<ModelPolicies>();
  const [currency, setCurrency] = React.useState<ModelCatalogValue>();
  const [typePackage, setTypePackage] = React.useState<CoveragePackage>();
  const [paymentMethod, setPaymentMethod] = React.useState<ModelCatalogValue>();
  const [groups, setGroups] = React.useState<CacheCatalogValue>();
  const [date, setDate] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [fullSeller, setFullSeller] = React.useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [enableFinishButton, setEnableFinishButton] = React.useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  //poliza datos
  const [policyDataHook, setPolicyDataHook] = React.useState<any>();
  //Abre modal que cancela la poliza y recibos
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  //ejecuta ciclo de carga
  const [loading, setLoading] = React.useState(false);
  //
  const [policyStatusDescription, setPolicyStatusDescription] = React.useState('');
  const defaultImage =
    "https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/a4/e0/6b/a4e06b03-b0a0-cb68-5fc8-a0f16660cc43/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1024x1024.jpg";
  const navigate = useNavigate();
  const [renewalPolicy, setRenewalPolicy] = React.useState(false);

  // Función para cerrar el modal
  const handleCloseModal = () => {
    window.location.reload();
    props.setOpen(false); // Usar setOpen para cerrar el modal
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    setBase64(event.dataTransfer.files[0]);
  };

  const setBase64 = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const readerSplit = reader.result?.toString().split(",")[1] ?? null;
      setImage(URL.createObjectURL(file));
    };
  };

  const handleNavigate = () => {
    if(policy?.policyStatusFolio !== Constants.statusActiveFolio){
      setDataAlert(true,"Solo las pólizas con estado 'VIGENTE' pueden generar endosos.","error",autoHideDuration);
    }else{
      navigate("/index/seguros/endosos/" + policy?.folio);
    }
    
  };

  const handleNavigateModificate = () => {
    let clientRoute = props.folioclient;

    if (!clientRoute) {
      clientRoute = policy?.clientId;
    }

    navigate(
      "/index/seguros/polizas/emision/" +
      clientRoute +
      "/" +
      policy?.folio +
      "/" +
      "1"
    );
  };

  const handleNavigateConsult = () => {
    navigate("/index/seguros/polizas/emision/0/" + policy?.folio + "/" + "0");
  };

  const handleNavigateReceipt = () => {
    navigate("/index/seguros/polizas/emision/0/" + policy?.folio + "/" + "0");
    localStorage.setItem("indexReceipt", "3")

  };



  const handleVigencyStatus = () => {
    if (policy?.policyStatusFolio === Constants.statusActiveFolio//"VIGENTE"
    ) {
      return true;
    } else {
      return false;
    }
  };

  React.useEffect(() => {
    fetchData1();
  }, []);
  //Este hook guarda la fecha de finde vigencia
  const [endValidity, setEndValidity] = React.useState<any>();
  const fetchData1 = async () => {
    if (props.folio) {
      try {
        const groupsResponse = await CacheService.getByFolioCatalog(Constants.groupsCatalogFolio)
        const policyResponse = await PoliciesService.getPoliciesByFolio(
          props.folio
        );
        const policyData = policyResponse.data;
        setPolicyDataHook(policyResponse.data);
        // await getConcept(policyResponse.data.folio, policyResponse.data.branchId, 
        //   policyResponse.data.personPolicie);
        setGroups(groupsResponse.data)
        // se concatena inico de vigencia y fin de vigencia en el hook setDate
        setDate(
          FormatData.stringDateFormatDDMMYYY(policyResponse.data.startValidity ?? "") +
          " - " +
          FormatData.stringDateFormatDDMMYYY(policyResponse.data.endValidity ?? "")
        );
        setEndValidity(policyResponse.data.endValidity ?? new Date());
        const diffDays = Math.round(
          (new Date(policyResponse.data.endValidity).getTime() -
            new Date().getTime()) /
          (1000 * 60 * 60 * 24)
        );

        setRenewalPolicy(
          diffDays <= 90 &&
            (policyResponse.data.policyStatusFolio ===
              Constants.statusActiveFolio ||
              policyResponse.data.policyStatusFolio ===
              Constants.statusExpireFolio ||
              policyResponse.data.policyStatusFolio ===
              Constants.statusExpiredDateFolio)
            ? true
            : false
        );

        // Ahora que hemos obtenido el dato de la primera petición, podemos usarlo para la segunda petición
        if (policyData && policyData.insuranceCompany) {
          const companyResponse = await CompaniesService.getByFolio(
            policyData.insuranceId
          );

          // Actualiza la URL de la imagen en el estado
          const companyLogoUrl = FormatData.getUriLogoCompany(
            companyResponse.data.logo
          );
          setImage(companyLogoUrl);
        }
      } catch (error) {
        // Manejo de errores
        console.error("Error al obtener datos:", error);
      }
    }
  };

  React.useEffect(() => {
    fetchData2();
  }, []);

  const fetchData2 = async () => {
    if (props.folio) {
      try {
        const policyResponse = await PoliciesService.getPoliciesByFolio(
          props.folio
        );
        const policyData = policyResponse.data;
        setPolicy(policyData);
        if (dayjs(policyData.endValidity).isSame(dayjs()) || dayjs().isAfter(dayjs(policyData.endValidity))) {
          setEnableFinishButton(true);
        }
        const statusFolioTEMP = policyResponse.data.policyStatusFolio;
        setPolicyStatusDescription(Constants.policyStatus[statusFolioTEMP].description)

        if (policyData && policyData.clientId) {
          const clientResponse = await PeopleService.getById(
            policyData.clientId
          );

          if (clientResponse?.data?.typePersonId === Constants.folioMoralPerson) {
            setFullName(
              clientResponse.data.name
            );
          } else {
            setFullName(
              clientResponse.data.name +
              " " +
              clientResponse.data.lastName +
              " " +
              clientResponse.data.maternalLastName
            );
          }
        }
      } catch (error) {
        // Manejo de errores
        console.error("Error al obtener datos:", error);
      }
    }
  };
  const [policyConcept, setPolicyConcept] = React.useState('Cargando...');
  const getConcept = async (policyFolio: string, folioBranch: string, people: any) => {
    switch (folioBranch) {
      case 'CAVA-0'://FLOTILLAS
      case 'CAVA-1'://AUTO
        if (policyFolio)
          await fetchVehicles(policyFolio).then((response) => {
            if (response.length > 0) {
              var v_concept: string = ``;
              response.map((res: any) => {
                v_concept += `(${res?.cmst}) ${res?.brand} - ${res?.description} ${res?.model} \n`;
              });
              setPolicyConcept(v_concept);
            } else {
              setPolicyConcept('Poliza sin vehiculos');
            }
            //setPolicyConcept
          }).catch(() => {
            setPolicyConcept('Poliza sin vehiculos');
          });
        break;
      case 'CAVA-3'://SALUD GRUPO
      case 'CAVA-4'://SALUD INDIVIDUAL
      case 'CAVA-223'://VIDA INDIVIDUAL
      case 'CAVA-224'://ACCIDENTES PERSONALES
        if (people.length > 0) {
          var v_concept: string = ``;
          people.map((res: any) => {
            v_concept += `(${res?.rfc}) ${res?.name} \n`;
          });
          setPolicyConcept(v_concept);
        } else {
          setPolicyConcept('Poliza sin personas');
        }
        break;
      case 'CAVA-2'://DIVERSOS
        await fetchDamage(policyFolio, folioBranch).then((response) => {
          if (response.length > 0) {
            var v_concept: string = ``;
            response.map((res: any) => {
              v_concept += `(${res?.folio}) - ${res?.subcategory}\n`;
            });
            setPolicyConcept(v_concept);
          } else {
            setPolicyConcept('Poliza sin bienes');
          }
        }).catch(() => {
          setPolicyConcept('Poliza sin bienes');
        });
        break;
      case 'CAVA-226'://AHORRO
        break;
    }
    //Personas
    //Bienes
    //Autos
  };
  const fetchVehicles = async (folioPlicy: string) => {
    if (folioPlicy) {
      const vehiclePolicy = await VehiclePolicy.getVehiclePolicy(folioPlicy);
      if (vehiclePolicy.data.length > 0) {
        const vehicleMap = (vehiclePolicy.data).map((auto: any) => ({
          brand: auto?.vehicle?.brand ?? '',
          model: auto?.vehicle?.model ?? '',
          description: auto?.vehicle?.description ?? '',
          cmst: auto?.vehicle?.cmst ?? '',
        }));
        return vehicleMap;
      } else {
        return []
      }
    } else {
      return []
    }
  };
  const fetchDamage = async (folioPolicy: string, folioBranch: string) => {
    const responseSubBranchesCatalog = await SubBranchesService.getByBranch(folioBranch);
    if (responseSubBranchesCatalog.data.length > 0) {
      const subBranchesIndexed = (responseSubBranchesCatalog.data).reduce((acc: any, el: any) => {
        acc[el.folio] = el;
        return acc;
      }, {});
      const responsePropertyData = await DamagePoliciesService.getDamagePoliciesByPolicy(folioPolicy);
      if (responsePropertyData.data.length > 0) {
        const damageData = (responsePropertyData.data).map((res: any) => ({
          folio: res?.subcategories?.[0]?.series,
          subcategory: subBranchesIndexed?.[res?.subcategories?.[0]?.subcategory]?.description
            ?? res?.subcategories?.[0]?.subcategory,
        }));
        return damageData;
      } else {
        return [];
      }
    } else {
      return [];
    }
  };
  React.useEffect(() => {
    fetchData3();
  }, []);

  const fetchData3 = async () => {
    if (props.folio) {
      try {
        const policyResponse = await PoliciesService.getPoliciesByFolio(
          props.folio
        );
        const policyData = policyResponse.data;
        setPolicy(policyData);
        if (dayjs(policyData.endValidity).isSame(dayjs()) || dayjs().isAfter(dayjs(policyData.endValidity))) {
          setEnableFinishButton(true);
        }
        const statusFolioTEMP = policyResponse.data.policyStatusFolio;
        setPolicyStatusDescription(Constants.policyStatus[statusFolioTEMP].description)

        if (policyData && policyData.salesPerson) {
          const sellerResponse = await PeopleService.getById(
            policyData.salesPerson
          );

          setFullSeller(
            sellerResponse.data.name +
            " " +
            sellerResponse.data.lastName +
            " " +
            sellerResponse.data.maternalLastName
          );
        }
      } catch (error) {
        // Manejo de errores
        console.error("Error al obtener datos:", error);
      }
    }
  };

  React.useEffect(() => {
    fetchData4();
  }, []);

  const fetchData4 = async () => {
    let policyData: any = null;
    if (props.folio) {
      try {
        const policyResponse = await PoliciesService.getPoliciesByFolio(
          props.folio
        );
        policyData = policyResponse.data;
        setPolicy(policyData);
        if (dayjs(policyData.endValidity).isSame(dayjs()) || dayjs().isAfter(dayjs(policyData.endValidity))) {
          setEnableFinishButton(true);
        }
        const statusFolioTEMP = policyResponse.data.policyStatusFolio;
        setPolicyStatusDescription(Constants.policyStatus[statusFolioTEMP].description)
      } catch (error) {
        console.log("Error al obtener datos:", error);
      }

      try {
        if (
          policyData.paymentFrequency === "" ||
          policyData.paymentFrequency === "string"
        ) {
          throw new Error("No existe metodo de pago");
        } else {
          const paymentType = await CatalogValueService.getCatalogValueFolio(
            policyData.paymentFrequency
          );
          const paymentData = paymentType.data;
          setPaymentMethod(paymentData);
        }
      } catch (error) {
        console.log("Error al obtener datos:", error);
      }

      try {
        if (policyData.currency === "" || policyData.currency === "string") {
          throw new Error("No existe tipo de moneda");
        } else {
          const typeCurrency = await CatalogValueService.getCatalogValueFolio(
            policyData.currency
          );

          const currencyData = typeCurrency.data;
          setCurrency(currencyData);
        }
      } catch (error) {
        console.log("Error al obtener datos:", error);
      }

      try {
        if (
          policyData.coveragePackageFolio === "" ||
          policyData.coveragePackageFolio === "string"
        ) {
          throw new Error("No existe folio de paquete de cobertura");
        } else {
          const typePackage = await CoveragePackagesService.getByFolio(
            policyData.coveragePackageFolio
          );
          const packageData = typePackage.data;
          setTypePackage(packageData);
        }
      } catch (error) {
        console.log("Error al obtener datos:", error);
      }
    }
  };

  useEffect(() => {
    if (image === null) {
      setTimeout(() => {
        setShowLoader(false);
      }, 1000); // Espera 1 segundo antes de mostrar la imagen de relleno
    }
  }, [image]);

  const handleRenewPolicy = () => {
    PoliciesService.postPolicyCopy(policy?.folio ?? props.folio)
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
                const policyPatch: any = {
                  //EXTENSION DE VIGENCIA
                  endValidity: new Date().toISOString(), /////

                  //CAMBIO DE CONTRATANTE
                  clientName: policyDataHook.clientName,
                  rfc: policyDataHook.rfc,
                  street: policyDataHook.street,
                  state: policyDataHook.state,
                  municipality: policyDataHook.municipality,
                  locality: policyDataHook.locality,
                  zip: policyDataHook.zip,
                  country: policyDataHook.country,

                  //CANCELACION DE POLIZA
                  policyStatusFolio: Constants.statusCancelledFolio,

                  //ALTA/BAJA DE ASEGURADO/ UNIDAD
                  personPolicie: policyDataHook.personPolicie,

                  //Modificacion alguna en el paquete de coberturas
                  coveragePackageFolio: policyDataHook.coveragePackageFolio,
                };
                if (policyPatch) {
                  await endorsementService
                    .policyEndorsementIssuance(props.folio, policyPatch)
                    .then(async (response) => {
                      //Logica para cancelar recibos, mandarlos a CANCELADO CAVA-92
                      await ReceiptsService.changeAllStatusReceipts(
                        props.folio
                      ).catch((e) => { });

                      fetchData1();
                      fetchData2();
                      fetchData3();
                      fetchData4();
                      setPolicy(response.data);
                      if (dayjs(response?.data?.endValidity ?? '').isSame(dayjs()) || dayjs().isAfter(dayjs(response?.data?.endValidity ?? ''))) {
                        setEnableFinishButton(true);
                      }
                      const statusFolioTEMP = response.data.policyStatusFolio;
                      setPolicyStatusDescription(Constants.policyStatus[statusFolioTEMP].description);
                      setDataAlert(
                        true,
                        "La póliza ha sido cancelada con éxito.",
                        "success",
                        autoHideDuration
                      );
                      props.onDataChange()
                    })
                    .catch((error) => {
                      setDataAlert(true, error.message, "error", autoHideDuration);
                    });
                }
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

  /*
  El siguiente modal ejecuta el vencimiento de la poliza por medio del boton terminar
  [terminateModal, setTerminateModal] - mientras sean verdaderos, visualizaran
  el modal terminarModal.
  [messageTerminate, setMessageTerminate] - Guardara un comentario del termino de poliza.
  terminarModal - Ejecuta un modal el cual preguntara si se desea completar la accion.
  [errorTerminate, setErrorTerminate] - Ejecutara un mensaje de error en caso de que
  el usuario no complete el comentario.
  handleCloseterminateModal - Cierra el modal.
  handleterminateModal - Valida si el comentario existe y ejecuta el vencimiento de la poliza.
  El modal cuenta con un comentario obligatoria para vencer la poliza y dos botones Si y No.
  */
  const [terminateModal, setTerminateModal] = React.useState(false);
  const [messageTerminate, setMessageTerminate] = React.useState('');
  const [errorTerminate, setErrorTerminate] = React.useState('');
  const handleCloseTerminateModal = () => {
    setTerminateModal(false);
    setMessageTerminate('');
    setErrorTerminate('');
  };
  const handleterminateModal = async () => {
    if (messageTerminate !== '') {
      const data = {
        comments: messageTerminate ?? '',
        policyStatusDescription: Constants.policyStatus[Constants.statusExpireFolio].description
          ?? policy?.policyStatusDescription ?? policyDataHook.policyStatusDescription,
        policyStatusFolio: Constants.policyStatus[Constants.statusExpireFolio].folio
          ?? policy?.policyStatusFolio ?? policyDataHook.folio,
      };
      await PoliciesService.patchPolicyStatus((props.folio ?? policy?.folio ?? policyDataHook.folio), data).then((response) => {
        if (response?.data?.folio) {
          setPolicyDataHook(response.data);
          setPolicy(response.data);
          if (dayjs(response?.data?.endValidity ?? '').isSame(dayjs()) || dayjs().isAfter(dayjs(response?.data?.endValidity ?? ''))) {
            setEnableFinishButton(true);
          }
          setPolicyStatusDescription(Constants.policyStatus[Constants.statusExpireFolio].description ?? policyStatusDescription)
          handleCloseTerminateModal();
          setDataAlert(
            true,
            "La póliza ha sido terminada.",
            "success",
            autoHideDuration
          );

        }
      }).catch((error) => {
        setDataAlert(
          true,
          "Se ha producido un error interno al intentar actualizar la póliza. Por favor, inténtelo de nuevo más tarde o póngase en contacto con el soporte técnico para obtener ayuda.",
          "error",
          autoHideDuration
        );
      });

    } else {
      setDataAlert(
        true,
        "Por favor, proporcione un comentario para completar esta acción.",
        "error",
        autoHideDuration
      );
      setErrorTerminate('Escriba un comentrario.')
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
      <Dialog
        open={props.open}
        aria-labelledby="modal-modal-title"
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: "15px",
            padding: 1,
            width: "1025px",
            height: "auto",
          },
        }}
      >
        <DialogTitle>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <Cancel />
          </IconButton>
          <Typography
            position="absolute"
            sx={{ ...LinkLargeFont }}
          >
            Operación de la póliza
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "flex-end",
              justifyContent: "flex-end",
              marginRight: "5%",
              marginTop: "20px",
            }}
          >
            <Tooltip title={"Renovar Póliza."}>
              <span>
                <ButtonMUI
                  disabled={renewalPolicy ? false : true}
                  variant="contained"
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
            {policyStatusDescription === (Constants.statusPending || Constants.statusExpired) && (
              <Tooltip title={"Modificar Póliza."}>
                <span>
                  <ButtonMUI
                    variant="contained"
                    sx={{
                      borderRadius: "10px",
                      backgroundColor: ColorPink,
                      "&:hover": { backgroundColor: ColorPinkDark },
                    }}
                    onClick={handleNavigateModificate}
                    disabled={handleVigencyStatus()}
                  >
                    <Edit color="#FFF" />
                  </ButtonMUI>
                </span>
              </Tooltip>
            )}
            {policy?.folio &&
              <UploadPdfFile policyFolio={policy?.folio} policyStatus={policy?.policyStatusFolio} />}
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Stack direction="row" spacing={2}>
            <Grid container spacing={2} sx={{ paddingTop: " 10px" }}>
              <Box sx={{ "& button": { m: 0.5 } }}>
                <Grid sx={{ width: "100%" }}>
                  <Stack sx={{ order: { xs: 2, sm: 1 } }}>
                    <Button
                      variant="outlined"
                      sx={{ height: "50px", borderRadius: "16px" }}
                      //disabled={handleVigencyStatus()}
                      onClick={handleNavigateConsult}
                    >
                      <View color={ColorPink} />
                      Consultar
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ height: "50px", borderRadius: "16px" }}
                      onClick={handleNavigate}
                    >
                      <Paste color={ColorPink} />
                      Endosos
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ height: "50px", borderRadius: "12px" }}
                      onClick={handleNavigateReceipt}
                    >
                      <Document color={ColorPink} />
                      Recibos
                    </Button>
                    {
                      /*<Button
                        variant="outlined"
                        sx={{ height: "50px", borderRadius: "12px" }}
                        disabled
                      >
                        <Chat color={ColorPinkDisabled} />
                        Seguimiento
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{ height: "50px", borderRadius: "12px" }}
                      >
                        <Calculator color={ColorPink} />
                        Austes
                      </Button> 
                      <Button
                        variant="outlined"
                        sx={{ height: "50px", borderRadius: "12px" }}
                        disabled
                      >
                        <DocumentFind color={ColorPinkDisabled} />
                        Log
                      </Button>*/
                    }
                    <Button
                      variant="outlined"
                      sx={{ height: "50px", borderRadius: "12px" }}
                      onClick={() =>
                        navigate("/index/seguros/siniestros/" + policy?.folio)
                      }
                    >
                      <CarAccident color={ColorPink} />
                      Siniestros
                    </Button>
                    {(policy?.policyStatusFolio !== Constants.statusCancelledFolio && policy?.policyStatusFolio !== Constants.statusExpireFolio) ? (<><Button
                      variant="outlined"
                      sx={{ height: "50px", borderRadius: "12px" }}
                      onClick={() => {
                        setIsModalOpen(true);
                      }}
                    >
                      <Cancel color={ColorPink} />
                      Cancelar
                    </Button>
                      {!enableFinishButton ?
                        (<></>) : (<><span><Button
                          variant="outlined"
                          sx={{ height: "50px", borderRadius: "12px" }}
                          onClick={() => {
                            setTerminateModal(true);
                          }}
                        >
                          <Complete color={ColorPink} />
                          Terminar{" "}
                        </Button></span>
                        </>)}
                    </>) : (<></>)}
                  </Stack>
                </Grid>
              </Box>
            </Grid>
            {/* ------------------------------------- */}
            <Grid container spacing={2}>
              <Box>
                <Stack direction="row" spacing={2} marginLeft="20px">
                  <Grid container spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        height="82px" // Ajusta la altura de la caja
                        width="100px" // Ajusta el ancho de la caja
                        marginLeft="16px"
                        borderRadius={3}
                        sx={{
                          cursor: "pointer",
                        }}
                        onClick={() => inputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          ref={inputRef}
                          onChange={(e) => {
                            if (e.target.files?.length) {
                              setBase64(e.target.files[0]);
                            }
                          }}
                        />
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
                      <Stack>
                        <Typography sx={{ ...TextSmallFont }}>
                          Cliente
                        </Typography>
                        <TextField
                          sx={{ width: "300px" }}
                          placeholder="Contratante"
                          disabled={true}
                          value={fullName}
                        ></TextField>
                      </Stack>
                      <Stack>
                        <Typography sx={{ ...TextSmallFont }}>
                          Póliza
                        </Typography>
                        <TextField
                          placeholder="Poliza"
                          sx={{ width: "300px" }}
                          disabled={true}
                          value={policy?.noPolicy}
                        />
                      </Stack>
                    </Stack>
                  </Grid>
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  marginLeft="20px"
                  paddingTop="25px"
                >
                  <Grid item xs={12} sm={12}>
                    <Stack>
                      <Typography sx={{ ...TextSmallFont }}>
                        Concepto
                      </Typography>
                      <TextField
                        placeholder="Concepto"
                        sx={{ height: "70px" }}
                        disabled={true}
                        value={policy?.concept !== '' ? policy?.concept : 'No se redacto concepto en la póliza.'}
                      ></TextField>
                    </Stack>
                  </Grid>
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  marginLeft="20px"
                  paddingTop="25px"
                >
                  <Grid container spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <Stack>
                        <Typography sx={{ ...TextSmallFont }}>
                          Vendedor
                        </Typography>
                        <TextField
                          placeholder="Vendedor"
                          sx={{ width: "235px" }}
                          disabled={true}
                          value={fullSeller}
                        ></TextField>
                      </Stack>
                      <Stack>
                        <Typography sx={{ ...TextSmallFont }}>
                          Status
                        </Typography>
                        <TextField
                          disabled={true}
                          sx={{ width: "235px" }}
                          value={
                            policyStatusDescription ?? "SIN ESTATUS"
                          }
                        ></TextField>
                      </Stack>
                      <Stack>
                        <Typography sx={{ ...TextSmallFont }}>
                          Vigencia
                        </Typography>
                        <TextField
                          placeholder="Vigencia"
                          sx={{ width: "235px" }}
                          disabled={true}
                          value={date}
                        />
                      </Stack>
                    </Stack>
                  </Grid>
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  marginLeft="20px"
                  paddingTop="25px"
                >
                  <Grid container spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <Stack>
                        <Typography sx={{ ...TextSmallFont }}>
                          Endosos
                        </Typography>
                        <TextField
                          placeholder="Endosos"
                          sx={{ width: "235px" }}
                          disabled={true}
                          value={policy?.endorsement}
                        ></TextField>
                      </Stack>
                      <Stack>
                        <Typography sx={{ ...TextSmallFont }}>Grupo</Typography>
                        <TextField
                          placeholder="Grupo"
                          sx={{ width: "235px" }}
                          disabled={true}
                          value={groups && policy?.groups ?
                            Object(groups.values ?? []).find((g: CatalogValue) => g.folio === policy?.groups).description
                            : 'No definido en póliza'
                          }
                        ></TextField>
                      </Stack>
                      <Stack>
                        <Typography sx={{ ...TextSmallFont }}>Plan</Typography>
                        <TextField
                          placeholder="Plan"
                          sx={{ width: "235px" }}
                          disabled={true}
                          value={typePackage?.packageName && typePackage?.packageName !== '' ? typePackage?.packageName : 'No definido.'}
                        ></TextField>
                      </Stack>
                    </Stack>
                  </Grid>
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  marginLeft="20px"
                  paddingTop="25px"
                >
                  <Grid container spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <Stack>
                        <Typography sx={{ ...TextSmallFont }}>
                          Prima total
                        </Typography>
                        <TextField
                          placeholder="Prima total"
                          sx={{ width: "235px" }}
                          disabled={true}
                          value={policy?.totalPremium}
                          InputProps={{
                            inputComponent: NumericFormatCustom as any,
                          }}
                        ></TextField>
                      </Stack>
                      <Stack>
                        <Typography sx={{ ...TextSmallFont }}>
                          Moneda
                        </Typography>
                        <TextField
                          placeholder="Moneda"
                          sx={{ width: "235px" }}
                          disabled={true}
                          value={currency?.description}
                        ></TextField>
                      </Stack>
                      <Stack>
                        <Typography sx={{ ...TextSmallFont }}>
                          Forma de pago
                        </Typography>
                        <TextField
                          placeholder="Forma de pago"
                          sx={{ width: "235px" }}
                          disabled={true}
                          value={paymentMethod?.description}
                        />
                      </Stack>
                    </Stack>
                  </Grid>
                </Stack>
              </Box>
            </Grid>
          </Stack>

          {/* -=------------------------------------------- */}

          <Grid>
            <Stack
              direction="row"
              alignItems="flex-end"
              justifyContent="flex-end"
              sx={{ flexGrow: 1, paddingTop: "30pt" }}
            >
              <Button variant="outlined" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Stack>
          </Grid>
        </DialogContent>
      </Dialog>
      {cancelPolicynModal}
      {(loading !== false) ? <LoadingScreen message='Eliminando' /> : <></>}
      <>
        <Modal
          open={terminateModal}
          onClose={handleCloseTerminateModal}
          sx={{ width: "100%", height: "100%", top: "300px" }}
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
            <Typography sx={{ ...LinkSmallFont, height: "30px" }}>
              {
                "¿Deseas cambiar la póliza a vencida?"
              }
            </Typography>
            <TextField
              name='notes'
              placeholder={'Escriba aqui un comentario.'}
              type="text"
              value={messageTerminate}
              //helperText={errorTerminate}
              multiline
              rows={2}
              sx={{ width: '100%', height: '80px', marginBottom: '10px' }}
              onChange={(e) => {
                const inputValue = e.target.value;//
                const newValue = inputValue
                  .replace(/(^,)|(^[^\wñÑáéíóúÁÉÍÓÚ\s\-.])|([^,\wñÑáéíóúÁÉÍÓÚ\s\-.])/g, '');
                setMessageTerminate(newValue);
                if (errorTerminate !== '') {
                  setErrorTerminate('');
                }
              }}
              InputProps={{
                inputProps: {
                  maxLength: 150
                }
              }}

            />
            <Box sx={{ display: "flex" }}>
              <Button
                sx={{ marginRight: "auto", height: "30px" }}
                variant="outlined"
                onClick={handleCloseTerminateModal}
              >
                No
              </Button>
              <Button
                onClick={handleterminateModal}
                sx={{ height: "20px", padding: "10px 25px" }}
              >
                Si
              </Button>
            </Box>
          </Box>
        </Modal>
      </>
    </>
  );
}

export default NewDesign;
