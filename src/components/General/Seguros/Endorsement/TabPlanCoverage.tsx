import { Box, IconButton, styled } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import CoveragePackage from "../../../../insuranceModels/coveragepackage";
import Policies from "../../../../insuranceModels/policies";
import CoveragePackagesService from "../../../../insuranceServices/coveragepackages.service";
import { Divider, Typography } from "../../../OuiComponents/DataDisplay";
import { Cancel, Complete, Plus } from "../../../OuiComponents/Icons";
import { Button, Select } from "../../../OuiComponents/Inputs";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { MenuItem } from "../../../OuiComponents/Navigation";
import { useNavigate } from "react-router";
import {
  ColorPureWhite,
  LinkLargeFont,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import { endorsementService } from "../../../../services/endorsement.service";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";
import { GridColDef } from "@mui/x-data-grid/models";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import Constants from "../../../../utils/Constants";

type coverageType = {
  _id: string;
  name: string;
  amount: number;
  deductible: number;
  actions: number;
  belong: string;
};

type packageType = {
  branch: string;
  folio: string;
  packageName: string;
  subBranch: string;
  insuranceCompanyFolio: string;
  coverages: coverageType[];
};
type endorsementSetting = {
  endorsementType: string;
  transactions: string;
};
function TabPlanCoverage(props: any) {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [packageType, setPackageType] = React.useState<Policies>();
  const navigate = useNavigate();
  const [coveragePackages, setCoveragePackages] =
    React.useState<CoveragePackage[]>();
  const [expanded, setExpanded] = React.useState<string | false>("");
  const [disabled, setDisabled] = React.useState(false);

  //Este hook almacena el plan y  cobertura de la poliza
  const [policyPackage, setPolicyPackage] = React.useState<packageType>();
  // Este hook almacena los paquetes que existen dentro de la compania seleccionada en poliza
  const [companyPackages, setCompanyPackages] = React.useState<any>([]);
  //Este hook guarda el paquete seleccionado por el select
  const [rowsCoverage, setRowsCoverage] = React.useState<any>([]);
  //Este hook guarda el tipo de endoso y su movimiento
  const [endorsementType, setEndorsementType] =
    React.useState<endorsementSetting>();
  //Este hook guarda el paquete custome en caso de existir
  const [customePack, setCustomePack] = React.useState<string>("");
  //Este hook controlara la carga de datos
  const [loading, setLoading] = React.useState(true);
  //Este hook guarda el nuevo paquete para el endoso tipo A CAMBIO EN EL PLAN
  const [switchPackage, setSwitchPackage] = React.useState("");
  //Este hook determina el nombre del paquete actual de la poliza
  const [packageDescription, setPackageDescription] = React.useState("");
  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  React.useEffect(() => {
    if (loading == true) {
      fetchData();
      setLoading(false);
    }
  }, [loading]);

  //Este metodo determinara la accion de los planes y coberturas
  //dependiendo el tipo de endoso
  const endorsementAction = (
    endorsement: endorsementSetting | undefined,
    packageFolio: string,
    belongFolio: string
  ) => {
    var condition = false;

    switch (endorsement?.endorsementType) {
      //Los tipos de movimiento estan en CATA-63
      //https://localhost:7298/api/CatalogValue/GetCatalogValueCatalog/CATA-63
      //Los tipos de movimiento de endoso A en CATA-64
      //Los tipos de movimiento de endoso D en CATA-66
      case "CAVA-269": //Endoso tipo A
        if (
          endorsement.transactions == //'CAVA-270'){// Movimiento INCLUSION COBERTURA
          Constants.endorsementTransactions.addCoverage
        ) {
          condition = packageFolio != belongFolio;
        }
        if (
          endorsement.transactions == //'CAVA-272'){// Movimiento CAMBIO EN EL PLAN
          Constants.endorsementTransactions.switchPackage
        ) {
          condition = packageFolio != belongFolio;
        }
        break;
      case "CAVA-268": //Endoso tipo D
        if (endorsement.transactions == "CAVA-278") {
          // Movimiento BAJA DE COBERTURA
          condition = packageFolio == belongFolio;
        }
        break;
      //case Constants.endorsementTransactions.switchPackage : //Endoso tipo A
      default:
    }
    return condition;
  };
  const fetchData = async () => {
    //Guardando el tipo de endoso y su movimiento para poder validar ejecucion
    setEndorsementType({
      endorsementType: props.endorsement.endorsement?.[0].endorsementType,
      transactions: props.endorsement.endorsement?.[0].transactions,
    });

    const companyID =
      props.endorsement.endorsement?.[0].policies?.[0].insuranceId + "";
    const branchId =
      props.endorsement.endorsement?.[0].policies?.[0].branchId + "";
    //Definir el package del endoso
    //Obtenemos el customPackage
    let packageEndoserment =
      props.endorsement.endorsement?.[0].customPackageFolio;
    //Verificamos si existe un custome package
    if (packageEndoserment && packageEndoserment != "") {
      packageEndoserment =
        props.endorsement.endorsement?.[0].customPackageFolio;
      setCustomePack(packageEndoserment + "");
    } else {
      //Si no existe paquete custom entonces ocupa el de la poliza
      packageEndoserment =
        props.endorsement.endorsement?.[0].policies?.[0].coveragePackageFolio;
      setCustomePack("");
    }
    //Obtener el Id del paquete que posee la poliza copiada en el endoso
    // const propsPolicyPackage =
    //   props.endorsement.endorsement?.[0].policies?.[0].coveragePackageFolio;

    // Esta constante se encarga de almacenar las coberturas que pose el paquete seleccionado en la poliza
    const currentPolicyPackage = await CoveragePackagesService.getByFolio(
      packageEndoserment //propsPolicyPackage
    );

    /////-------------------------------Seccion para definir tabla de paquete actual de la poliza
    //Agregando atributo belong a la covertura de la poliza
    const updatedPolicy: any = settingCoveragePolicy(currentPolicyPackage);

    //Guardamos el paquete de la poliza en Hook policyPackage
    setPolicyPackage(updatedPolicy); //currentPolicyPackage.data);
    //Recuperamos la descripcion del paquete seleccionado:
    const descriptionTEMP = await CoveragePackagesService.getByFolio(
      updatedPolicy?.folio + ""
    );
    setPackageDescription(descriptionTEMP.data.packageName + "");
    /////-------------------------------Seccion para Idexar los paquetes de la poliza
    //Aqui vamos a recuperar los paquetes que pertenezcan a la compania que se escogio al crear la poliza (companyID)
    //Sin tomar el cuenta el paquete que ya posee la poliza (propsPolicyPackage) al emitir la poliza.
    const coveragePackageIndexed = await getIndexedCoverages(
      {
        endorsementType: props.endorsement.endorsement?.[0].endorsementType,
        transactions: props.endorsement.endorsement?.[0].transactions,
      },
      companyID,
      branchId,
      packageEndoserment
    ); //propsPolicyPackage);//COMP-3
    setCompanyPackages(coveragePackageIndexed);

    /////-------------------------------Seccion sin uso
    //Aqui recuperamos la poliza copiada en una constante endorsementPackage
    const endorsementPackage = props.endorsement.endorsement[0].policies[0];
    setPackageType(endorsementPackage);
  };

  //Esta funcion agrega un identificador belong a cada cobertura de la poliza existente
  const settingCoveragePolicy = (coverages: any) => {
    //Esta funcion se encarga de agregar un identificador belong
    // para comprender a que paquete pertenece la cobertura y
    //asi evitar duplicados y poder determinar su manipulacion
    const updatedCoverages = coverages.data.coverages?.map((coverage: any) => {
      return {
        ...coverage,
        belong: coverages.data.folio + "", // Agregar la propiedad belong con el valor 'PACK-13'
      };
    });
    //Reconstruimos el paquete= con la nueva estructurta que tiene belong
    const updatedPolicyPackage = {
      ...coverages,
      data: {
        ...coverages.data,
        coverages: updatedCoverages,
      },
    };
    return updatedPolicyPackage.data;
  };

  //Esta funcion retorna las paquetes de la poliza ya indexados para su busqueda
  const getIndexedCoverages = async (
    endorsementType: endorsementSetting,
    companyID: string,
    branchId: string,
    propsPolicyPackage: string
  ) => {
    //Esta constante se encarga de recuperar los paquetes que posee la compania
    //seleccionada en la poliza companyID
    const coveragePackage = await CoveragePackagesService.getByBranchCompany(
      companyID,
      branchId
    );

    //Almacenamos los paquetes en un hook para colocarlos en el MenuItem del select Agregar coberturas
    setCoveragePackages(coveragePackage.data);

    //Indexar los paquetes que genero coveragePackage
    const coveragePackageIndexed = coveragePackage.data.reduce(
      (acc: any, elemento: any) => {
        var condicion: boolean = endorsementAction(
          endorsementType,
          elemento?.folio + "",
          propsPolicyPackage
        );
        if (condicion) {
          acc[elemento?.folio] = elemento?.coverages.map((coverage: any) => ({
            ...coverage,
            //Tambien le concatenamos belong para identificar de que paquete viene la covertura
            belong: elemento?.folio,
          }));
          return acc;
        } else {
          return acc;
        }
      },
      {}
    );
    return coveragePackageIndexed;
  };

  const onSubmit = (data: any) => {
    endorsementService
      .putEndorsementPoliciesCoveragePackage(
        props.endorsement.folio,
        props.endorsement.endorsement[0].folioEndo,
        props.endorsement.endorsement[0].policies[0].folio,
        data.folio
      )
      .then((response: any) => {
        setDataAlert(
          true,
          "El paquete se asoció a la póliza con éxito.",
          "success",
          autoHideDuration
        );
      })
      .catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      });
  };

  const { handleSubmit, handleChange, values, setFieldValue } = useFormik({
    initialValues: {
      folio: "0",
    },
    onSubmit,
    enableReinitialize: true,
  });
  //Definir columnas del paquete actual de la poliza
  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Coberturas", width: 250 },
    { field: "amount", headerName: "Monto asegurado", width: 150 },
    { field: "deductible", headerName: "Deducibles", width: 150 },
    { field: "conditions", headerName: "Condiciones", width: 150 },
    //{ field: "belong", headerName: "Pertenece a", width: 150 },
    {
      field: "acctions",
      headerName: "Acciones",
      width: 150,
      renderCell: (params: any) => {
        var condicion: boolean = endorsementAction(
          endorsementType,
          policyPackage?.folio + "",
          params.row.belong
        );
        if (condicion) {
          ///Esta condicion dependera del tipo de endoso
          return (
            <>
              <IconButton
                value={params.row._id}
                onClick={(e) => {
                  //Eliminamos la poliza de la covertura dentro de policyPackage
                  const updatedPackage = removeCoverage(
                    policyPackage,
                    params.row._id
                  );
                  setPolicyPackage(updatedPackage);
                  try {
                    //Ahora recuperamos la fila borrada en el grid de coberturas
                    const newRow = validateCoverage(
                      updatedPackage.coverages,
                      companyPackages?.[values.folio + ""]
                    );
                    setRowsCoverage(newRow);
                  } catch (e) {
                    //En caso de que el usuario no escoja un paquete
                  }
                }}
                disabled={(props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
              >
                <Cancel />
              </IconButton>
            </>
          );
        } else return <></>;
      },
    },
  ];

  //Esta funcion se encarga de agregar una covertura al paquete actual de la poliza
  const addCoverage = (newCoverage: coverageType) => {
    setPolicyPackage((prevPackage: any) => ({
      ...prevPackage,
      coverages: [...prevPackage.coverages, newCoverage],
    }));
  };

  //Este paquete quita una cobertura agregada al paquete actual de la poliza
  const removeCoverage = (
    prevPackage: any,
    coverageIdToRemove: string
  ): packageType => {
    return {
      ...prevPackage,
      coverages: prevPackage.coverages.filter(
        (coverage: coverageType) => coverage._id !== coverageIdToRemove
      ),
    };
  };

  //Este paquete quita una cobertura de la seccion para agregarla en el paquete de la poliza.
  //La quita del paquete seleccionado en Agregar coberturas.
  const removeCoverageById = (idToRemove: string) => {
    setRowsCoverage((prevRowsCoverage: any) =>
      prevRowsCoverage.filter((coverage: any) => coverage._id !== idToRemove)
    );
  };
  //Definir columnas de las coberturas
  const columnsDynamic: GridColDef[] | null = [
    { field: "_id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Coberturas", width: 250 },
    { field: "amount", headerName: "Monto asegurado", width: 150 },
    { field: "deductible", headerName: "Deducibles", width: 150 },
    { field: "conditions", headerName: "Condiciones", width: 150 },
    //{ field: "belong", headerName: "Pertenece a", width: 150 },
    {
      field: "acctions",
      headerName: "Acciones",
      width: 150,
      renderCell: (params: any) => {
        //Mientras sea diferente a 'CAVA-272' CAMBIO  DE PLAN, se podra agrega acciones.
        return endorsementType?.transactions !=
          Constants.endorsementTransactions.switchPackage ? (
          <>
            <IconButton
              value={params.row._id}
              onClick={(e) => {
                addCoverage(params.row);
                removeCoverageById(params.row._id);
              }}
              disabled={(props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
            >
              <Plus />
            </IconButton>
          </>
        ) : (
          <></>
        );
      },
    },
  ];

  const getRowId = (row: any) => row._id;

  //Funcion para validar si una cobertura que sera agregada al grid de  agregar coberturas
  // no existe en el paquete actual de la poliza
  const validateCoverage = (coverages: any, checking: any) => {
    //companyPackages?.[folio];
    const filteredChecking = checking.filter((check: any) => {
      return !coverages.some((coverage: any) => coverage._id === check._id);
    });
    return filteredChecking;
  };
  return (
    <>
      <Box
        component="form" //onSubmit={handleSubmit}
        onSubmit={() => {}}
      >
        <Stack direction="column" spacing={4}>
          <Grid container rowSpacing={1}>
            <Grid item xs={12} md={6} lg={4}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography sx={LinkLargeFont}>
                  Paquete actual de la poliza
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Grid container rowSpacing={1}>
            <Typography sx={{ ...TextSmallFont }}>
              Paquete: {packageDescription ?? ""}
            </Typography>
          </Grid>
          <Grid container rowSpacing={1}>
            <DataGrid
              //loading={loading}
              rows={policyPackage?.coverages || []}
              columns={columns.filter((col) => col.field != "_id")}
              disableRowSelectionOnClick
              getRowId={getRowId}
            />
          </Grid>

          {endorsementType?.transactions ==
          Constants.endorsementTransactions.switchPackage ? (
            <>
              <Divider />
              <Typography sx={LinkLargeFont}>Cambiar cobertura</Typography>
              <Grid container rowSpacing={1}>
                <Grid item xs={12} md={6} lg={4}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ ...TextSmallFont }}>Paquete</Typography>
                    <Select
                      sx={{ width: "100%" }}
                      name="folio"
                      defaultValue={0}
                      value={values.folio ? values.folio : 0}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      disabled={disabled||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                    >
                      <MenuItem key={"0"} value={"0"} disabled>
                        Selecciona
                      </MenuItem>
                      {coveragePackages?.map((packages: any) => {
                        let propsPolicyPackage =
                          props.endorsement.endorsement?.[0].policies?.[0]
                            .coveragePackageFolio;
                        if (
                          customePack &&
                          customePack != "" &&
                          customePack != undefined
                        ) {
                          propsPolicyPackage = customePack;
                        }
                        if (propsPolicyPackage != packages.folio)
                          return (
                            <MenuItem
                              key={packages.folio}
                              value={packages.folio}
                              onClick={() => {
                                setSwitchPackage(packages.folio + "");
                                //Logica para ternar coberturas algun endoso
                                const newRow = validateCoverage(
                                  policyPackage?.coverages,
                                  companyPackages?.[packages.folio]
                                );
                                setRowsCoverage(newRow);
                              }}
                            >
                              {packages.packageName}
                            </MenuItem>
                          );
                        else return null;
                      })}
                    </Select>
                  </Stack>
                </Grid>
              </Grid>
            </>
          ) : (
            <></>
          )}

          {endorsementType?.transactions ==
            Constants.endorsementTransactions.addCoverage || //'CAVA-270'
          endorsementType?.transactions ==
            Constants.endorsementTransactions.cancelCoverage ? ( //'CAVA-278'
            <>
              <Divider />
              <Typography sx={LinkLargeFont}>Agregar coberturas</Typography>
              <Grid container rowSpacing={1}>
                <Grid item xs={12} md={6} lg={4}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ ...TextSmallFont }}>Paquete</Typography>
                    <Select
                      sx={{ width: "100%" }}
                      name="folio"
                      defaultValue={0}
                      value={values.folio ? values.folio : 0}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      disabled={disabled||
                        (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                    >
                      <MenuItem key={0} value={0} disabled>
                        Selecciona
                      </MenuItem>
                      {coveragePackages?.map((packages: any) => {
                        let propsPolicyPackage =
                          props.endorsement.endorsement?.[0].policies?.[0]
                            .coveragePackageFolio;
                        if (
                          customePack &&
                          customePack != "" &&
                          customePack != undefined
                        ) {
                          propsPolicyPackage = customePack;
                        }
                        var condicion: boolean = endorsementAction(
                          endorsementType,
                          propsPolicyPackage + "",
                          packages.folio
                        );
                        if (condicion)
                          ///Esta condicion dependera del tipo de endoso
                          return (
                            <MenuItem
                              key={packages.folio}
                              value={packages.folio}
                              onClick={() => {
                                //Logica para ternar coberturas algun endoso
                                const newRow = validateCoverage(
                                  policyPackage?.coverages,
                                  companyPackages?.[packages.folio]
                                );
                                setRowsCoverage(newRow);
                              }}
                            >
                              {packages.packageName}
                            </MenuItem>
                          );
                        else return null;
                      })}
                    </Select>
                  </Stack>
                </Grid>
              </Grid>
            </>
          ) : (
            <></>
          )}
          {endorsementType?.transactions ==
            Constants.endorsementTransactions.addCoverage || //'CAVA-270'
          endorsementType?.transactions ==
            Constants.endorsementTransactions.cancelCoverage || //'CAVA-278'
          endorsementType?.transactions ==
            Constants.endorsementTransactions.switchPackage ? (
            <>
              <Typography sx={LinkLargeFont}>Coberturas</Typography>
              <Grid container rowSpacing={1}>
                <DataGrid
                  //loading={loading}
                  rows={rowsCoverage || []}
                  columns={columnsDynamic.filter((col) => col.field != "_id")}
                  disableRowSelectionOnClick
                  getRowId={getRowId}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4} textAlign="center">
                <Button
                  //type="submit"
                  size="small"
                  endIcon={<Complete color={ColorPureWhite} />}
                  disabled={disabled||
                    (props.endorsement.endorsement?.[0].endorsementStatus === Constants.endorsementStatus.current)}
                  onClick={async () => {
                    //En caso de que el tipo de movimiento de endoso sea CAMBIO DE PLAN 'CAVA-272'
                    if (
                      endorsementType?.transactions ==
                      Constants.endorsementTransactions.switchPackage
                    ) {
                      await endorsementService
                        .patchEndorSementCPackage(
                          props.endorsement.folio,
                          props.endorsement.endorsement?.[0].folioOT,
                          switchPackage
                        )
                        .then((response) => {
                          //Actualizamos los props
                          props.onDataChange(response.data);
                          //props=response.data;
                          setLoading(true);
                          setRowsCoverage([]);
                          setFieldValue("folio", "0");
                          setDataAlert(
                            true,
                            "El paquete ha sido cambiado.",
                            "success",
                            autoHideDuration
                          );
                        });
                    } else {
                      //Creamos el objeto a enviar el cual contiene las configuraciones del paquete
                      const newPackage = {
                        insuranceCompanyFolio: props.endorsement.folio, //"string",
                        branch: "",
                        subBranch: "",
                        packageName: "Personalizado-"+props.endorsement.endorsement?.[0].folioOT,
                        coverages: policyPackage?.coverages,
                      };
                      //Creamos el paquete
                      await CoveragePackagesService.postCoveragePackage(
                        newPackage
                      ).then(async (response) => {
                        //Asignamos el paquete creado al endoso
                        await endorsementService
                          .patchEndorSementCPackage(
                            props.endorsement.folio,
                            props.endorsement.endorsement?.[0].folioOT,
                            response?.data.folio
                          )
                          .then((response) => {
                            //Actualizamos los props
                            props.onDataChange(response.data);
                            //props=response.data;
                            setLoading(true);
                            setDataAlert(
                              true,
                              "Se ha creado un paquete personalizado.",
                              "success",
                              autoHideDuration
                            );
                          });
                      });
                    }
                  }}
                >
                  {customePack != "" ? "Actualizar Paquete" : "Cambiar paquete"}
                </Button>
              </Grid>
            </>
          ) : (
            <></>
          )}
        </Stack>
        <MessageBar
          open={isSnackbarOpen}
          severity={severity}
          message={messageAlert}
          close={handleSnackbarClose}
          autoHideDuration={autoHideDuration}
        />
      </Box>
    </>
  );
}

export default TabPlanCoverage;
