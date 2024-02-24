import * as React from "react";
import { Dialog } from "../../../OuiComponents/Feedback";
import { DialogContent, IconButton } from "@mui/material";
//import Box from '../../../OuiComponents/Layout/Box';
import { Box } from "@mui/material";
import Stack from "../../../OuiComponents/Layout/Stack";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import Grid from "../../../OuiComponents/Layout/Grid";
import TextField from "../../../OuiComponents/Inputs/TextField";
import Button from "../../../OuiComponents/Inputs/Button";
import Check from "@mui/icons-material/Check";
import {
  LinkLargeFont,
  LinkSmallFont,
  TextMediumFont,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import { Divider } from "../../../OuiComponents/DataDisplay";
import MenuItem from "../../../OuiComponents/Navigation/MenuItem";
import Select from "../../../OuiComponents/Inputs/Select";
import { ISourceDocument } from "../../../../models/SourceDocument";
import FormatData from "../../../../utils/Formats.Data";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ICatalogValue } from "../../../../models/CatalogValue";
import CacheService from "../../../../services/cache.service";
import { Autocomplete } from "../../../OuiComponents/Inputs";
import PeopleService from "../../../../services/people.service";
import sourceDocumentService from "../../../../services/sourceDocument";
import locationService from "../../../../services/location.service";
import { IEntities, IMunicipalities } from "../../../../models/Location";
import Cancel from "../../../OuiComponents/Icons/Cancel";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";
import Constants from "../../../../utils/Constants";

export default function SourceDocumentModal(props: any) {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [open, setOpen] = React.useState(false);
  const [valuesData, setValuesData] = React.useState<ISourceDocument>();
  const [catalogValues, setCatalogValues] = React.useState<ICatalogValue[]>([]);
  const [beneficiaryId, setBeneficiaryId] = React.useState("");
  const [currencyValues, setCurrencyValues] = React.useState<ICatalogValue[]>(
    []
  );
  const [sellerId, setSellerId] = React.useState("");
  const [alert, setAlert] = React.useState(false);
  const [alertContent, setAlertContent] = React.useState("");
  const [sourceDocumentFolio, setSourceDocumentFolio] = React.useState("");
  const [entities, setEntities] = React.useState<readonly IEntities[]>([]);
  const [municipalities, setMunicipalities] = React.useState<
    readonly IMunicipalities[]
  >([]);

  React.useEffect(() => {
    setOpen(props.open);
    getCatalogValues();
    getCurrencyValues();
    getEntities();

    if (props.data) {
      sourceDocumentService
        .getSourceDocumentFolio(props.sourceDocumentFolio)
        .then((response) => response.data)
        .then((json) => setValuesData(json));
      setSourceDocumentFolio(props.sourceDocumentFolio);

      locationService
        .getMunicipalitiesByStateId(props.data.statesId)
        .then((response) => setMunicipalities(response.data));
    }
  }, []);

  const getCatalogValues = async () => {
    await CacheService.getByFolioCatalog(Constants.sourceDocumentCatalogFolio)
      .then((response) => response.data)
      .then((json) => setCatalogValues(json.values));
  };

  const getCurrencyValues = async () => {
    await CacheService.getByFolioCatalog(Constants.currencyCatalogFolio)
      .then((response) => response.data)
      .then((json) => setCurrencyValues(json.values));
  };
  const getEntities = async () => {
    await locationService
      .getStates()
      .then((response) => setEntities(response.data));
  };

  const initialValues: ISourceDocument = {
    clientId: props.clientFolio,
    client: {
      typePerson: "",
      folio: "",
      name: "",
      lastName: "",
      maternalLastName: "",
      email: "",
    },
    beneficiaryId: valuesData?.beneficiaryId ?? "",
    beneficiary: valuesData?.beneficiary ?? "",
    bondCompanyId: valuesData?.bondCompanyId ?? "",
    bondCompany: valuesData?.bondCompany ?? "",
    creationDate: FormatData.stringDateFormat(
      valuesData?.creationDate ?? new Date().toString()
    ),
    startDate: FormatData.stringDateFormat(
      valuesData?.startDate ?? new Date().toString()
    ),
    endDate: FormatData.stringDateFormat(
      valuesData?.endDate ?? new Date().toString()
    ),
    obligationDate: FormatData.stringDateFormat(
      valuesData?.obligationDate ?? new Date().toString()
    ),
    documentTypeId: valuesData?.documentTypeId ?? "",
    documentType: valuesData?.documentType ?? "",
    number: valuesData?.number ?? "",
    signinDate: FormatData.stringDateFormat(
      valuesData?.signinDate ?? new Date().toString()
    ),
    sellerId: valuesData?.sellerId ?? "",
    seller: valuesData?.seller ?? "",
    relatedTo: valuesData?.relatedTo ?? "",
    netAmount: valuesData?.netAmount ?? 0,
    ivaPercentage: valuesData?.ivaPercentage ?? 16,
    iva: valuesData?.iva ?? 0,
    totalAmount: valuesData?.totalAmount ?? 0,
    currencyId: valuesData?.currencyId ?? "",
    currency: valuesData?.currency ?? "",
    objectStatusId: valuesData?.objectStatusId ?? 1,
    operationDate: FormatData.stringDateFormat(
      valuesData?.operationDate ?? new Date().toString()
    ),
    createdAt: FormatData.stringDateFormat(
      valuesData?.createdAt ?? new Date().toString()
    ),
    createdBy: FormatData.stringDateFormat(
      valuesData?.createdBy ?? new Date().toString()
    ),
    updatedBy: FormatData.stringDateFormat(
      valuesData?.updatedBy ?? new Date().toString()
    ),
    updatedAt: FormatData.stringDateFormat(
      valuesData?.updatedAt ?? new Date().toString()
    ),
    referenceOne: valuesData?.referenceOne ?? "",
    referenceTwo: valuesData?.referenceTwo ?? "",
    statesId: valuesData?.statesId ?? 0,
    municipalitiesId: valuesData?.municipalitiesId ?? 0,
  };

  const onSubmit = async (data: ISourceDocument) => {
    sellerId && (data["sellerId"] = sellerId);
    beneficiaryId && (data["beneficiaryId"] = beneficiaryId);
    data["bondCompanyId"] = "COMP-1";

    if (props.data) {
      sourceDocumentService
        .putSourceDocument(props.sourceDocumentFolio, data)
        .then((response: any) => {
          setAlertContent("El Documento se actualizó con éxito.");
          setAlert(true);
          setTimeout(() => {
            props.close(false);
          }, 1000);
        })
        .catch((e: Error) => {
          setAlertContent(e.message);
          setAlert(true);
        });
    } else {
      await sourceDocumentService
        .postSourceDocument(data)
        .then((response: any) => {
          setAlertContent("El documento fuente se ha regitrado con éxito");
          setAlert(true);
        })
        .catch((e: Error) => {
          setAlertContent(e.message);
          setAlert(true);
        });

      setTimeout(() => {
        props.close(false);
      }, 1000);
    }
  };

  const { handleSubmit, handleChange, errors, values, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema: Yup.object({
        operationDate: Yup.string().required("Este campo es requerido."),
        startDate: Yup.string().required("Este campo es requerido."),
        endDate: Yup.string().required("Este campo es requerido."),
        obligationDate: Yup.string().required("Este campo es requerido."),
        documentTypeId: Yup.string().required("Este campo es requerido."),
        signinDate: Yup.string().required("Este campo es requerido."),
        relatedTo: Yup.string().required("Este campo es requerido."),
        netAmount: Yup.string().required("Este campo es requerido."),
        currencyId: Yup.string().required("Este campo es requerido."),
        statesId: Yup.string().required("Este campo es requerido."),
        municipalitiesId: Yup.string().required("Este campo es requerido."),
      }),
      onSubmit,
      enableReinitialize: true,
    });

  const handleStateMunicipalities = async (cvE_ENT: number) => {
    await locationService
      .getMunicipalitiesByStateId(cvE_ENT)
      .then((response) => setMunicipalities(response.data));
  };

  const handleBeneficiaryInfo = ({ folio }: any) => setBeneficiaryId(folio);
  const handleSellerInfo = ({ folio }: any) => setSellerId(folio);

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
        open={open}
        aria-labelledby="modal-modal-title"
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: "20px", padding: 1 } }}
      >
        <IconButton
          onClick={props.close}
          sx={{
            position: "absolute",
            right: 25,
            top: 8,
          }}
        >
          <Cancel />
        </IconButton>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Box>
              <Typography variant="h5" sx={{ ...LinkLargeFont }}>
                <strong>Documento fuente</strong>
              </Typography>
              <Stack direction="column">
                <Box paddingTop={3} paddingBottom={3}>
                  <Grid container rowSpacing={3} columnSpacing={{ xs: 5 }}>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>
                          Beneficiario
                        </Typography>
                        <Autocomplete
                          function={PeopleService.getAllByName}
                          parentCallBack={handleBeneficiaryInfo}
                          data={props.data ? props.data.beneficiary : null}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={{ ...TextSmallFont }}>
                          Fecha de operación
                        </Typography>
                        <TextField
                          name="operationDate"
                          value={values.operationDate}
                          onChange={handleChange}
                          type="date"
                          helperText={errors.operationDate}
                          error={!!errors.operationDate}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                  <Box paddingTop={3}>
                    <Grid container rowSpacing={2} columnSpacing={{ xs: 3 }}>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Fecha de inicio
                          </Typography>
                          <TextField
                            name="startDate"
                            value={values.startDate}
                            onChange={handleChange}
                            type="date"
                            helperText={errors.startDate}
                            error={!!errors.startDate}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Fecha de término
                          </Typography>
                          <TextField
                            name="endDate"
                            value={values.endDate}
                            onChange={handleChange}
                            type="date"
                            helperText={errors.endDate}
                            error={!!errors.endDate}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Fecha de obligación
                          </Typography>
                          <TextField
                            name="obligationDate"
                            value={values.obligationDate}
                            onChange={handleChange}
                            type="date"
                            helperText={errors.obligationDate}
                            error={!!errors.obligationDate}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

                <Divider />
                <Box paddingTop={2}>
                  <Typography variant="h5" sx={{ ...LinkLargeFont }}>
                    <strong>Datos del documento</strong>
                  </Typography>
                  <Box paddingTop={3} paddingBottom={3}>
                    <Grid container rowSpacing={2} columnSpacing={{ xs: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Relacionado a:
                          </Typography>
                          <TextField
                            placeholder="Relacionado a:"
                            name="relatedTo"
                            value={values.relatedTo}
                            onChange={handleChange}
                            helperText={errors.relatedTo}
                            error={!!errors.relatedTo}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Tipo
                          </Typography>

                          <Select
                            sx={{ width: "100%" }}
                            name="documentTypeId"
                            onChange={handleChange}
                            value={
                              values.documentTypeId ? values.documentTypeId : 0
                            }
                            error={!!errors.documentTypeId}
                          >
                            <MenuItem key={0} value={0} disabled>
                              Selecciona
                            </MenuItem>
                            {catalogValues.map((data: ICatalogValue) => (
                              <MenuItem key={data.folio} value={data.folio}>
                                {data.description}
                              </MenuItem>
                            ))}
                          </Select>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Estado
                          </Typography>
                          <Select
                            sx={{ width: "100%" }}
                            name="statesId"
                            onChange={handleChange}
                            value={values.statesId}
                            error={!!errors.statesId}
                          >
                            <MenuItem key={0} value={0} disabled>
                              Selecciona
                            </MenuItem>
                            {entities.map((data: IEntities) => (
                              <MenuItem
                                onClick={() =>
                                  handleStateMunicipalities(data.cvE_ENT)
                                }
                                key={data.cvE_ENT}
                                value={data.cvE_ENT}
                              >
                                {data.noM_ENT}
                              </MenuItem>
                            ))}
                          </Select>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Municipio
                          </Typography>
                          <Select
                            sx={{ width: "100%" }}
                            name="municipalitiesId"
                            onChange={handleChange}
                            value={values.municipalitiesId}
                            error={!!errors.municipalitiesId}
                          >
                            <MenuItem key={0} value={0} disabled>
                              Selecciona
                            </MenuItem>
                            {municipalities.map((data: any) => (
                              <MenuItem key={data.cvE_MUN} value={data.cvE_MUN}>
                                {data.noM_MUN}
                              </MenuItem>
                            ))}
                          </Select>
                        </Stack>
                      </Grid>

                      {/* PREGUNTAR QUÉ FECHA VA AQUÍ */}
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Fecha
                          </Typography>
                          <TextField
                            name="signinDate"
                            value={values.signinDate}
                            onChange={handleChange}
                            type="date"
                            helperText={errors.signinDate}
                            error={!!errors.signinDate}
                          />
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Vendedor
                          </Typography>
                          <Autocomplete
                            function={PeopleService.getSellers}
                            parentCallBack={handleSellerInfo}
                            data={props.data ? props.data.seller : null}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Referencia 1
                          </Typography>
                          <TextField
                            placeholder="Referencia"
                            name="referenceOne"
                            value={values.referenceOne}
                            onChange={handleChange}
                            helperText={errors.referenceOne}
                            error={!!errors.referenceOne}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Referencia 2
                          </Typography>
                          <TextField
                            placeholder="Referencia"
                            name="referenceTwo"
                            value={values.referenceTwo}
                            onChange={handleChange}
                            helperText={errors.referenceTwo}
                            error={!!errors.referenceTwo}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
                <Divider />
                <Box paddingTop={1}>
                  <Typography variant="h5" sx={{ ...LinkLargeFont }}>
                    <strong>Valor</strong>
                  </Typography>
                  <Box paddingTop={3} paddingBottom={3}>
                    <Grid container rowSpacing={2} columnSpacing={{ xs: 3 }}>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Moneda
                          </Typography>

                          <Select
                            sx={{ width: "100%" }}
                            name="currencyId"
                            onChange={handleChange}
                            value={values.currencyId ? values.currencyId : 0}
                            error={!!errors.currencyId}
                          >
                            <MenuItem key={0} value={0} disabled>
                              Selecciona
                            </MenuItem>
                            {Object(
                              currencyValues.map((data: ICatalogValue) => (
                                <MenuItem key={data.folio} value={data.folio}>
                                  {data.description}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Monto sin IVA
                          </Typography>
                          <TextField
                            name="netAmount"
                            type="number"
                            value={values.netAmount}
                            onChange={handleChange}
                            helperText={errors.netAmount}
                            error={!!errors.netAmount}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            %IVA
                          </Typography>
                          <TextField
                            name="ivaPercentage"
                            disabled
                            value={values.ivaPercentage}
                            onChange={handleChange}
                            helperText={errors.ivaPercentage}
                            error={!!errors.ivaPercentage}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>IVA</Typography>
                          <TextField
                            name="iva"
                            disabled
                            type="number"
                            value={
                              (values.iva =
                                (values.netAmount * values.ivaPercentage) / 100)
                            }
                            onChange={handleChange}
                            helperText={errors.iva}
                            error={!!errors.iva}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack direction="column" spacing={1}>
                          <Typography sx={{ ...TextSmallFont }}>
                            Monto con IVA
                          </Typography>
                          <TextField
                            placeholder="0.00"
                            name="totalAmount"
                            type="number"
                            disabled
                            value={
                              (values.totalAmount =
                                values.netAmount + values.iva)
                            }
                            onChange={handleChange}
                            helperText={errors.totalAmount}
                            error={!!errors.totalAmount}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Stack>
            </Box>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                alignSelf: "stretch",
              }}
            >
              <Box>
                <Button variant="outlined" onClick={props.close}>
                  Cerrar
                </Button>
              </Box>

              <Box sx={{ pb: 2 }}>
                <Button
                  variant="contained"
                  disableElevation
                  type="submit"
                  startIcon={<Check />}
                  size="large"
                  sx={{ backgroundColor: "#e5105d" }}
                >
                  Guardar
                </Button>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
