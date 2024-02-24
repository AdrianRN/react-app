import { FormHelperText, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid/models";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import * as Yup from "yup";
import { useAlertContext } from "../../../../context/alert-context";
import { getCatalogValueById } from "../../../../services/catalog.service";
import CompaniesBranchesService from "../../../../services/companiesbranches.service";
import Constants from "../../../../utils/Constants";
import { Typography } from "../../../OuiComponents/DataDisplay";
import { DataGrid } from "../../../OuiComponents/DataGrid";
import { Cancel, Delete, SaveDisquet } from "../../../OuiComponents/Icons";
import {
  Button,
  InputAdornment,
  Select,
  TextField
} from "../../../OuiComponents/Inputs";
import { Grid, Stack } from "../../../OuiComponents/Layout";
import { MenuItem } from "../../../OuiComponents/Navigation";
import { ColorPink, ColorPureWhite, LinkSmallFont } from "../../../OuiComponents/Theme";


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
        decimalSeparator={"."}
        decimalScale={2}
      />
    );
  }
);
type surchargeType = {
  folio: string;
  paymentMethod: string;
  description: string;
  surcharge: number;
};

const validationSchema = Yup.object().shape({
  paymentMethod: Yup.string().required("La forma de pago es requerida"),
  issuingCost: Yup.string().required("El gasto de expedición es requerido"),
  surcharge: Yup.number().required("El porcentaje de recargo es requerido"),
});

type paymentMethodsCatalog = {
  folio: string;
  description: string;
};
function TabIssuingCost(props: any) {
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = useState<surchargeType[]>([]);
  const [updatedListPM, setUpdatedListPM] = useState<JSX.Element[]>([]);
  const [branches, setBranches] = useState<JSX.Element[]>([]);
  const [disable, setDisable] = useState(false);
  const [issuingCost, setIssuingCost] = useState(0);
  const [commissionPercentage, setCommissionPercentage] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState("0");
  const [paymentMethodsData, setPaymentMethodsData] = useState<
    paymentMethodsCatalog[]
  >([]);
  const [branchFolioSurch, setBranchFolioSurch] = useState("");
  const [branchFoliohook, setBranchFoliohook] = useState("");
  const [onUpdateData, setOnUpdateData] = useState(false);
  const [disabledBranch, setDisabledBranch] = useState(true);
  const [paymentSelectedValidity, setPaymentSelectedValidity] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      //Traer formas de pago
      const valuesData = await getCatalogValueById(Constants.paymentFrequencyCatalogFolio);
      const data = valuesData.data.values;
      setPaymentMethodsData(data);
    };
    fetchData();
  }, []);

  const addRow = (paymentMethod: string, surcharge: number) => {
    const newRow = {
      folio: generateRandomId(8), //(rows.length + 1).toString(),
      paymentMethod: paymentMethod,
      description: " ",
      surcharge: surcharge,
    };
    setRows((prevRows) => [...prevRows, newRow]);
  };
  const deleteRow = (id: string) => {
    const updatedRows = rows.filter((row) => row.folio !== id);
  };
  const updateSurchargeById = async (
    idToUpdate: string,
    newSurchargeValue: number
  ) => {
    await CompaniesBranchesService.putCompaniesSurchargeBranch(
      branchFolioSurch,
      idToUpdate,
      newSurchargeValue + ""
    );
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.folio === idToUpdate) {
          return { ...row, surcharge: newSurchargeValue };
        }
        return row;
      })
    );
  };
  const formik = useFormik({
    initialValues: {
      paymentMethod: "0",
      surcharge: 0,
      issuingCost: 0,
      commissionPercentage: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Lógica para manejar el envío del formulario
      const selectedValue = branchFoliohook;
      const selectedItem = currentDataItems?.find(
        (item) => item.key === selectedValue
      );

      CompaniesBranchesService.companyBranchPaymentMethod(
        selectedItem.companyBranchFolio,
        selectedItem.key,
        {
          paymentMethod: values.paymentMethod,
          description: "",
          surcharge: values.surcharge,
        }
      )
        .then(async (e: any) => {
          const methodsRow = e.data.branch.paymentMethods;
          setRows(methodsRow);
          setDataAlert(
            true,
            "Metodo de pago agregado.",
            "success",
            autoHideDuration
          );
        })
        .catch((error: any) => {
          console.error("Error: ", error);
          setDataAlert(
            true,
            "Error al agregar metodo de pago.",
            "error",
            autoHideDuration
          );
        });

      setOnUpdateData(true);
      //addRow(values.paymentMethod, values.surcharge);
      formik.values.paymentMethod = "0";
      formik.values.surcharge = 0;
      setPaymentSelectedValidity(true);
    },
  });
  const [surchargeEditValue, setSurchargeEditValue] = useState(0);
  type EditableCellProps = {
    initialValue: string;
    ID: string;
  };
  const EditableCell: React.FC<EditableCellProps> = ({ initialValue, ID }) => {
    const [editValue, setEditValue] = useState(initialValue);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditValue(event.target.value);
    };

    const handleInputBlur = () => {
      setSurchargeEditValue(Number(editValue));
    };

    return (
      <TextField
        type="number"
        value={editValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        InputProps={{
          inputComponent: NumericFormatCustom as any,
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        sx={{
          width: "130px",
          outline: "none",
          border: "4px",
          background: "none",
        }}
      />
    );
  };
  const columns: GridColDef[] = [
    { field: "folio", headerName: "ID", width: 150 },
    {
      field: "paymentMethod",
      headerName: "Forma de pago",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => {
        return (
          <>{getPaymentMethod(params.row.paymentMethod, paymentMethodsData)}</>
        );
      },
    },
    {
      field: "surcharge",
      headerName: "Recargo pago fraccionado",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => {
        return (
          <>
            <EditableCell
              initialValue={params.row.surcharge + ""}
              ID={params.row.folio + ""}
            />
          </>
        );
      },
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => {
        //deleteRow
        return (
          <>
            <span>
              <IconButton
                value={params.row.folio}
                onClick={() => {
                  try {
                    updateSurchargeById(
                      params.row.folio,
                      surchargeEditValue
                    );
                    setDataAlert(
                      true,
                      `Metodo de pago ${getPaymentMethod(
                        params.row.paymentMethod,
                        paymentMethodsData
                      )} actualizado.`,
                      "success",
                      autoHideDuration
                    );
                  } catch (exception) {
                    console.error("error al agregar", exception);
                    setDataAlert(
                      true,
                      `error al actualizar metodo de pago ${getPaymentMethod(
                        params.row.paymentMethod,
                        paymentMethodsData
                      )}.`,
                      "error",
                      autoHideDuration
                    );
                  }
                }}
                //disabled={disabled}
              >
                <SaveDisquet color={ColorPink} />
              </IconButton>
            </span>
            <span>
              <IconButton
                onClick={() => {
                  //deleteRow(params.row.paymentMethodFolio + "");
                  try {
                    const selectedValue = branchFoliohook;
                    const selectedItem = currentDataItems?.find(
                      (item) => item.key === selectedValue
                    );
                    if (selectedItem) {
                      CompaniesBranchesService.companiesBranchPaymentMethod(
                        selectedItem.companyBranchFolio,
                        selectedItem.key,
                        params.row.folio
                      ).then((e) => {
                        setRows(e.data.branch.paymentMethods);
                        setOnUpdateData(true);
                      });
                    }
                    setDataAlert(
                      true,
                      `Metodo de pago ${getPaymentMethod(
                        params.row.paymentMethod,
                        paymentMethodsData
                      )} eliminado.`,
                      "success",
                      autoHideDuration
                    );
                  } catch (exception) {
                    console.error("Error al eliminar");
                    setDataAlert(
                      true,
                      `Error al eliminar mtodo de pago ${getPaymentMethod(
                        params.row.paymentMethod,
                        paymentMethodsData
                      )}.`,
                      "success",
                      autoHideDuration
                    );
                  }
                }}
              >
                <Delete color={ColorPink} />
              </IconButton>
            </span>
          </>
        );
      },
    },
  ];
  const getRowId = (row: any) => row.folio;

  const filterCatalog = (catalog: any) => {
    const usedPaymentMethods = new Set(rows.map((row) => row.paymentMethod));
    const filteredCatalog = catalog.filter(
      (item: any) => !usedPaymentMethods.has(item.folio)
    );
    return filteredCatalog;
  };
  const getPaymentMethod = (folio: string, array: paymentMethodsCatalog[]) => {
    const description = array.find((item) => item.folio === folio)?.description;
    return description;
  };
  useEffect(() => {
    const fetchData = async () => {
      if (paymentMethodsData) {
        const updatedCatalog = await filterCatalog(paymentMethodsData);
        const items = updatedCatalog.map((values: any) => ({
          key: String(values.folio),
          description: String(values.description),
        }));
        const menuItems = renderItem2MenuItem(items);
        if (menuItems.length <= 5 && menuItems.length > 0) {
          setDisable(false);
        } else {
          setDisable(true);
        }
        setUpdatedListPM(menuItems);
      }
    };
    fetchData();
  }, [rows, paymentMethodsData]);

  const renderItem2MenuItem = (enumObj: any) => {
    return enumObj.map((item: any) => (
      <MenuItem key={item.key} value={item.key}>
        {item.description}
      </MenuItem>
    ));
  };
  const [currentDataItems, setCurrentDataItems] = useState<any[]>();

  const fetchDataAndSetRows = async () => {
    try {
      // Lógica para obtener los datos
      const valuesData =
        await CompaniesBranchesService.getBranchesByCompanyFolio(props.data);
      const data = valuesData.data;

      if (data) {
        const items = data.map((values: any) => ({
          key: String(values.branch.folio),
          description: String(values.branch.description),
          issuingCost: Number(values.branch.issuingCost),
          commissionPercentage: Number(values.branch.commissionPercentage),
          paymentMethods: values.branch.paymentMethods,
          companyBranchFolio: values.companyBranchFolio,
        }));

        const flattenedItems = items.flat();
        setCurrentDataItems(flattenedItems);
        const menuItems = renderItem2MenuItem(flattenedItems);
        setBranches(menuItems);
        return flattenedItems;
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchDataAndSetRows();
  }, [onUpdateData]);
  const { autoHideDuration, setDataAlert } = useAlertContext();
  return (
    <>
      <Stack direction="column" spacing={3}>
        {/*--------------------------------Encabezado-------------------------------------*/}
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1 }}>
          <Grid item xs={11} sm={11} md={3} alignSelf="center">
            {/*<Typography sx={{ ...LinkSmallFont }}>
              Nombre de la compania
            </Typography>*/}
          </Grid>
        </Grid>
        {/*--------------------------------seleccionramo-----------------------------------*/}
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1 }}>
          <Grid item xs={11} sm={11} md={3} alignSelf="center">
            <Typography sx={{ ...LinkSmallFont }}>Ramo</Typography>
            <Select
              value={selectedBranch}
              onChange={(e) => {
                fetchDataAndSetRows();
                const selectedValue = e.target.value as string;
                setBranchFoliohook(selectedValue);
                const selectedItem = currentDataItems?.find(
                  (item) => item.key === selectedValue
                );
                if (selectedItem) {
                  setBranchFolioSurch(selectedItem.companyBranchFolio);
                  setIssuingCost(selectedItem.issuingCost);
                  setCommissionPercentage(selectedItem.commissionPercentage)
                  //setBranchFolioSurch(selectedItem.companyBranchFolio);
                  setRows(selectedItem.paymentMethods);
                  setDisabledBranch(false);
                }
                setSelectedBranch(selectedValue);
                setPaymentSelectedValidity(true);
                formik.values.paymentMethod = "0";
                formik.values.surcharge = 0;
              }}
            >
              <MenuItem value={0} disabled>
                Seleccione
              </MenuItem>
              {branches ?? <MenuItem value={1}>Seleccione...</MenuItem>}
            </Select>
          </Grid>
          <Grid item xs={11} sm={11} md={3} alignSelf="center">
            <Typography sx={{ ...LinkSmallFont }}>Gasto expedición</Typography>
            <TextField
              placeholder="Gasto expedición"
              name="issuingCost"
              value={issuingCost}
              onChange={(e) => {
                const valueField = Number(e.target.value);
                setIssuingCost(valueField);
              }}
              InputProps={{
                inputComponent: NumericFormatCustom as any,
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              disabled={disabledBranch}
            />
          </Grid>
          <Grid item xs={11} sm={11} md={3} alignSelf="center">
            <Typography sx={{ ...LinkSmallFont }}>Comisión</Typography>
            <TextField
              placeholder="Comisión"
              name="commissionPercentage"
              value={commissionPercentage}
              onChange={(e) => {
                const valueField = Number(e.target.value);
                if (!isNaN(valueField) && valueField >= 0 && valueField <= 100) {
                  setCommissionPercentage(valueField);
                }else{
                  setCommissionPercentage(0);
                }
              }}
              InputProps={{
                inputComponent: NumericFormatCustom as any,
                startAdornment: (
                  <InputAdornment position="start">%</InputAdornment>
                ),
              }}
              disabled={disabledBranch}
            />
          </Grid>
          <Grid item xs={11} sm={11} md={11} alignSelf="center">
            <Button
              size="small"
              onClick={async () => {
                try {
                  const selectedValue = branchFoliohook;
                  const selectedItem = currentDataItems?.find(
                    (item) => item.key === selectedValue
                  );
                  CompaniesBranchesService.putCompaniesIssuingCost(
                    selectedItem.companyBranchFolio,
                    selectedItem.key,
                    issuingCost + "",
                    commissionPercentage
                  )
                    .then((e) => {
                      const newRows = e.data.branch.paymentMethods;
                      setRows(newRows);
                      //setIssuingCost(0);
                      //setSelectedBranch('0');
                      setDataAlert(
                        true,
                        "Gasto de expedición actualizado.",
                        "success",
                        autoHideDuration
                      );
                    })
                    .catch((error: any) => {
                      console.error("Nel", error);
                      setDataAlert(
                        true,
                        "Error al actualizar gasto de expedición.",
                        "error",
                        autoHideDuration
                      );
                    });
                  setOnUpdateData(true);
                } catch (e) {
                  setDataAlert(
                    true,
                    "No se ha seleccionado un ramo.",
                    "warning",
                    autoHideDuration
                  );
                }
              }}
            >
              Actualizar datos
            </Button>
          </Grid>
        </Grid>
        <form onSubmit={formik.handleSubmit}>
          {/*------------------------------FormaPago/GastoExpe-------------------------------*/}
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1 }}>
            <Grid item xs={11} sm={11} md={3} alignSelf="center">
              <Typography sx={{ ...LinkSmallFont }}>Forma de pago</Typography>
              <Select
                value={formik.values.paymentMethod}
                name="paymentMethod"
                onChange={(e)=>{
                  formik.handleChange(e);
                  setPaymentSelectedValidity(false);
                }}
                onBlur={formik.handleBlur}
                disabled={disable || disabledBranch}
              >
                <MenuItem value={"0"} disabled>
                  Seleccione
                </MenuItem>
                {updatedListPM ?? (
                  <MenuItem value={"1"}>Seleccione...</MenuItem>
                )}
              </Select>
              {formik.touched.paymentMethod && formik.errors.paymentMethod && (
                <FormHelperText>{formik.errors.paymentMethod}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={11} sm={11} md={3} alignSelf="center">
              <Typography sx={{ ...LinkSmallFont }}>
                Recargo pago fraccionado
              </Typography>
              <TextField
                placeholder="Recargo pago fraccionado"
                name="surcharge"
                type="number"
                error={
                  formik.touched.surcharge && Boolean(formik.errors.surcharge)
                }
                helperText={formik.touched.surcharge && formik.errors.surcharge}
                value={formik.values.surcharge}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                InputProps={{
                  inputComponent: NumericFormatCustom as any,
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                disabled={disable || disabledBranch}
              />
            </Grid>
            <Grid item xs={11} sm={11} md={11} alignSelf="center">
              <Button
                size="small"
                type="submit"
                disabled={disable || disabledBranch || paymentSelectedValidity}
              >
                Agregar
              </Button>
            </Grid>
          </Grid>
        </form>
        {/*------------------------------Tabla-------------------------------*/}
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1 }}>
          <DataGrid
            //loading={loading}
            rows={rows}
            columns={columns.filter((col) => col.field != "folio")}
            disableRowSelectionOnClick
            getRowId={getRowId}
          />
        </Grid>
        <Grid container paddingTop={1}>
            <Grid item xs={12} sm={6} md={5} lg={4} xl={3} textAlign='center' container justifyContent="flex-start">
              <Button
                size="small"
                endIcon={<Cancel color={ColorPureWhite} />}
                onClick={(e)=>{
                  props.onClose(false);
                }}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
      </Stack>
    </>
  );
}
export default TabIssuingCost;

function generateRandomId(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return randomId;
}
