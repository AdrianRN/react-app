import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Cancel from "../../../OuiComponents/Icons/Cancel";
import Button from "../../../OuiComponents/Inputs/Button";
import { CircularProgress, Dialog } from "../../../OuiComponents/Feedback";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import Grid from "../../../OuiComponents/Layout/Grid";
import TextField from "../../../OuiComponents/Inputs/TextField";
import { Autocomplete, Box, DialogContent, IconButton } from "@mui/material";
import PeopleService from "../../../../services/people.service";
import { Check } from "@mui/icons-material";
import { Stack } from "../../../OuiComponents/Layout";
import bondService from "../../../../services/bonds.service";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";


function ModalFormClaims(props: { open: boolean, close: (flag: boolean) => void, data?: any, bondFolio: any, updateClaimsData: any, editingData?: any }) {

  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();


  // Define el esquema de validación
  const validationSchema = Yup.object().shape({
    claimDate: Yup.string().required("La fecha del reclamo es requerida"),
    client: Yup.string().required("El cliente es requerido"),
    claimNumber: Yup.string().required("El número de reclamo es requerido"),
    amount: Yup.number().required("El monto es requerido"),
    resolution: Yup.string().required("La resolución es requerida"),
    term: Yup.string().required("El término es requerido"),
  });

  const [values, setValues] = useState({
    claimDate: "",
    client: "",
    bond: props.bondFolio,
    claimNumber: "",
    amount: "",
    resolution: "",
    term: "",
    objectStatusId: 1
  });

  const handleReset = () => {
    setValues({
      claimDate: "",
      client: "",
      bond: props.bondFolio,
      claimNumber: "",
      amount: "",
      resolution: "",
      term: "",
      objectStatusId: 1
    });
  };

  useEffect(() => {
    if (props.open && !props.editingData) {
      // Si el modal se abre y no hay datos de edición, establece los valores en blanco
      setValues({
        claimDate: "",
        client: "",
        bond: props.bondFolio,
        claimNumber: "",
        amount: "",
        resolution: "",
        term: "",
        objectStatusId: 1
      });
    } else if (props.editingData) {
      // Si hay datos de edición disponibles, establece los valores del formulario
      setValues({
        ...props.editingData,
        claimDate: props.editingData.claimDate.split("T")[0] // Formatea la fecha
      });
    }
  }, [props.open, props.editingData, props.bondFolio]);

  useEffect(() => {
    // Cuando editingData cambie a null o undefined, establecer los valores en blanco
    if (!props.editingData) {
      setValues({
        claimDate: "",
        client: "",
        bond: props.bondFolio,
        claimNumber: "",
        amount: "",
        resolution: "",
        term: "",
        objectStatusId: 1
      });
    } else {
      // Si hay datos de edición disponibles, establecer los valores del formulario
      setValues({
        ...props.editingData,
        claimDate: props.editingData.claimDate.split("T")[0] // Formatea la fecha
      });
    }
  }, [props.editingData, props.bondFolio]);

  useEffect(() => {
    if (props.editingData) {
      // Si hay datos de edición disponibles, establece los valores del formulario
      setValues({
        ...props.editingData,
        claimDate: props.editingData.claimDate.split("T")[0] // Formatea la fecha
      });
    }
  }, [props.editingData]);

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await PeopleService.getAllByName("");
        const list = response.data;
        const formattedOptions = list.map((person: any) => ({
          label: `${person.name} ${person.lastName} ${person.maternalLastName}`,
          value: person.folio
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = async (value: any) => {
    setLoading(true);
    try {
      const response = await PeopleService.getAllByName(value);
      const list = response.data;
      const formattedOptions = list.map((person: any) => ({
        label: `${person.name} ${person.lastName} ${person.maternalLastName}`,
        value: person.folio
      }));
      setOptions(formattedOptions);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Valida los valores con el esquema de validación
      await validationSchema.validate(values, { abortEarly: false });

      // Envía el formulario si pasa la validación
      if (props.editingData) {
        // Si hay datos de edición disponibles, comprueba si son iguales a los valores iniciales
        const initialValues = {
          claimDate: "",
          client: "",
          bond: props.bondFolio,
          claimNumber: "",
          amount: "",
          resolution: "",
          term: "",
          objectStatusId: 1
        };

        const isEqualToInitialValues = JSON.stringify(props.editingData) === JSON.stringify(initialValues);

        if (isEqualToInitialValues) {
          // Si los datos de edición son iguales a los valores iniciales, realiza una solicitud POST
          await bondService.postClaimsBonds(values);
        } else {
          // Si los datos de edición son diferentes a los valores iniciales, realiza una solicitud PUT
          await bondService.putClaimsByFolio(props.editingData.folio, values);
        }
      } else {
        // Si no hay datos de edición, realiza una solicitud POST
        await bondService.postClaimsBonds(values);
      }

      setValues({
        claimDate: "",
        client: "",
        bond: props.bondFolio,
        claimNumber: "",
        amount: "",
        resolution: "",
        term: "",
        objectStatusId: 1
      });
      props.close(false);
      props.updateClaimsData();

      setDataAlert(
        true,
        props.editingData ? "Reclamo actualizado con éxito" : "Reclamo creado con éxito",
        "success",
        autoHideDuration
      );
    } catch (error: any) {
      // Si la validación falla, muestra una alerta con los errores
      const errorMessage = error.inner.map((e: { message: string }) => e.message).join("\n");
      setDataAlert(
        true,
        errorMessage || "Todos los campos son requeridos",
        "warning",
        autoHideDuration
      );
    }
  };
  const [selectedOption, setSelectedOption] = useState<any>(null);

  let clientNameG;

  useEffect(() => {
    if (props.editingData) {
      const fetchClientData = async () => {
        try {
          setLoading(true);
          const response = await PeopleService.getById(props.editingData.client);
          const { name, lastName, maternalLastName } = response.data;
          // Establece el valor del cliente en el formato deseado para el Autocomplete
          const clientName = `${name} ${lastName} ${maternalLastName}`;
          setSelectedOption({
            label: clientName,
            value: props.editingData.client
          });
        } catch (error) {
          console.error('Error fetching client data:', error);
          setSelectedOption('');
        } finally {
          setLoading(false);
        }
      };
  
      fetchClientData();
    }
  }, [props.editingData]);

  return (
    <Dialog
      open={props.open}
      onClose={() => props.close(false)}
      aria-labelledby="modal-modal-title"
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: "20px", padding: 1 } }}

    >
      <IconButton
        onClick={() => {
          props.close(false);
        }}
        sx={{
          position: "absolute",
          right: 20,
          top: 8,
        }}
      >
        <Cancel />
      </IconButton>
      <DialogContent>
        <Typography variant="h5" sx={{ mt: 2 }}>
          <strong>Nuevo reclamo</strong>
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack display="column" spacing={1}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12} sm={6} md={3.9}>
                <Stack direction="column" spacing={1}>
                  <Typography>
                    Fecha reclamo
                  </Typography>
                  <TextField
                    placeholder="Fecha reclamo"
                    type="date"
                    value={values.claimDate}
                    name="claimDate"
                    onChange={handleChange}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={3.9}>
                <Stack direction="column" spacing={1}>
                  <Typography>
                    Cliente
                  </Typography>
                  <Autocomplete
                    options={options}
                    loading={loading}
                    onInputChange={(event: any, value: any) => handleInputChange(value)}
                    onChange={(event, value: any) => setValues((prevValues) => ({ ...prevValues, client: value ? value.value : '' }))}
                    value={selectedOption}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        label="Buscar persona"
                        variant="outlined"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={3.9}>
                <Stack direction="column" spacing={1}>
                  <Typography>
                    Folio de póliza fianza
                  </Typography>
                  <TextField
                    placeholder="Folio de póliza fianza"
                    name="bond"
                    value={values.bond}
                    onChange={handleChange}
                    disabled
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={3.9}>
                <Stack direction="column" spacing={1}>
                  <Typography>
                    Número de reclamo
                  </Typography>
                  <TextField
                    placeholder="Número de reclamo"
                    name="claimNumber"
                    value={values.claimNumber}
                    onChange={handleChange}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={3.9}>
                <Stack direction="column" spacing={1}>
                  <Typography>
                    Monto
                  </Typography>
                  <TextField
                    placeholder="Monto"
                    name="amount"
                    value={values.amount}
                    onChange={handleChange}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={3.9}>
                <Stack direction="column" spacing={1}>
                  <Typography>
                    Resolución
                  </Typography>
                  <TextField
                    placeholder="Resolución"
                    name="resolution"
                    value={values.resolution}
                    onChange={handleChange}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={3.9}>
                <Stack direction="column" spacing={1}>
                  <Typography>
                    Término
                  </Typography>
                  <TextField
                    placeholder="Término"
                    name="term"
                    value={values.term}
                    onChange={handleChange}
                  />
                </Stack>
              </Grid>
            </Grid>
            <Box display="flex">
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ pb: 1 }}>
                <Button
                  variant="contained"
                  type="submit"
                  endIcon={<Check />}
                  size="large"
                  disableElevation
                  sx={{ backgroundColor: "#e5105d" }}
                >
                  Registrar reclamo
                </Button>
              </Box>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
      <MessageBar
        open={isSnackbarOpen}
        severity={severity}
        message={messageAlert}
        close={handleSnackbarClose}
        autoHideDuration={autoHideDuration}
      />
    </Dialog>

  );

}

export default ModalFormClaims;