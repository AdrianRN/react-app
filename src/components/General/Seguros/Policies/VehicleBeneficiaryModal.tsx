import React from "react";
import { CircularProgress, Dialog } from "../../../OuiComponents/Feedback";
import { Box, DialogContent, DialogTitle, IconButton, Autocomplete } from "@mui/material";
import { Cancel } from "../../../OuiComponents/Icons";
import { Stack } from "@mui/system";
import { Typography } from "../../../OuiComponents/DataDisplay";
import { LinkLargeFont } from "../../../OuiComponents/Theme";
import { Grid } from "../../../OuiComponents/Layout";
import PeopleService from "../../../../services/people.service";
import VehiclePolicy from "../../../../insuranceServices/vehiclepolicy.service";
import { Button, TextField } from "../../../OuiComponents/Inputs";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useFormik } from "formik";

function VehicleBeneficiaryModal(props: any) {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [valueBeneficiary, setValueBeneficiary] = React.useState<any | null>(null);
  const [optionsBeneficiary, setOptionsBeneficiary] = React.useState<any[]>([]);
  const [loadingBeneficiary, setLoadingBeneficiary] = React.useState(false);

  React.useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    if (props.data.beneficiaryFolio) {
      const responseBeneficiary = await PeopleService.getById(props.data.beneficiaryFolio);
      setValueBeneficiary(responseBeneficiary.data ?? null);
    }
  }

  const handleInputPeopleChange = async (value: any) => {
    setTimeout(async () => {
      if (value) {
        let response = null;
        setLoadingBeneficiary(true);

        response = await PeopleService.getAllByName(value);

        if (response == null) {
          setOptionsBeneficiary([]);
          setLoadingBeneficiary(false);
          return;
        }

        const list = response.data;

        list.map((row: { [key: string]: any }) => {
          const columns = Object.keys(row).map((column) => {
            if (column === "name") {
              const fullName = `${row[column]}`.trim();
              row["name"] = fullName;
              return { field: "name", headerName: "Name" };
            }
            return { field: column, headerName: column };
          });
          return columns;
        });

        //Si el listado es de otro tipo y no cuenta con la propiedad 'name'
        list.map((row: { [key: string]: any }) => {
          if (!row["lastName"]) {
            Object.keys(row).map((column) => {
              if (
                column
                  .toLowerCase()
                  .includes((props.name ? props.name : "name").toLowerCase())
              ) {
                row["name"] = row[column];
              }
            });
          } else {
            return;
          }
        });

        setOptionsBeneficiary(list);
        setLoadingBeneficiary(false);

      } else {
        setOptionsBeneficiary([]);
        setLoadingBeneficiary(false);
      }
    }, 500);
  };

  const handleBeneficiarySubmit = (data: any) => {
    VehiclePolicy.patchVehicleBeneficiaryPolicy(props.data.folio, data.folio)
      .then((response: any) => {
        setDataAlert(true, "El beneficiario se registró con éxito.", "success", autoHideDuration);
        setTimeout(() => {
          props.close()
        }, 1000)
      })
      .catch((e: Error) => {
        setDataAlert(true, e.message, "error", autoHideDuration);
      });
  };

  return (
    <>
      <Dialog
        open={props.open}
        aria-labelledby="modal-modal-title"
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3, padding: 1 } }}
      >
        <DialogTitle display="flex">
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
        </DialogTitle>
        <DialogContent>
          <Box>
            <Stack direction="column" spacing={3}>
              <Box>
                <Typography sx={LinkLargeFont}>Alta beneficiario</Typography>
              </Box>
              <Box component="form" paddingBottom={5}>
                <Grid container rowSpacing={2} columnSpacing={{ sx: 1 }}>
                  <Grid item xs={12}>
                    <Stack direction="column" spacing={1}>
                      <Autocomplete
                        noOptionsText="No se encontraron coincidencias, capture uno nuevo."
                        loadingText="Buscando..."
                        options={optionsBeneficiary ?? []}
                        loading={loadingBeneficiary}
                        isOptionEqualToValue={(option, value) =>
                          option.name === value.name
                        }
                        getOptionLabel={(option: any) => {
                          return (
                            option.name +
                            " " +
                            option.lastName +
                            " " +
                            option.maternalLastName
                          );
                        }}
                        onInputChange={(e, value) => {
                          handleInputPeopleChange(value);
                        }}
                        onChange={(e, value) => {
                          setLoadingBeneficiary(false);
                          if (value) {
                            handleBeneficiarySubmit(value);
                          }else{
                            setValueBeneficiary(null)
                          }
                        }}
                        value={valueBeneficiary}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              placeholder="Buscar"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {loadingBeneficiary ? (
                                      <CircularProgress
                                        sx={{ color: "#E5105D" }}
                                        size={20}
                                      />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                            />
                          );
                        }}
                        renderOption={(props, option) => (
                          <li {...props} key={option.folio}>
                            {option.name +
                              " " +
                              option.lastName +
                              " " +
                              option.maternalLastName}
                          </li>
                        )}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container>
                  <Grid item xs={12} md={6} lg={3}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={props.close}
                    >
                      Cerrar
                    </Button>
                  </Grid>
                </Grid>
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
    </>
  );
}

export default VehicleBeneficiaryModal;
