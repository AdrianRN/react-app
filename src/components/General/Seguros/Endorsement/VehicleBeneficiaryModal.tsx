import React from "react";
import {  Dialog } from "../../../OuiComponents/Feedback";
import { Box, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Cancel } from "../../../OuiComponents/Icons";
import { Stack } from "@mui/system";
import { Typography } from "../../../OuiComponents/DataDisplay";
import { LinkLargeFont } from "../../../OuiComponents/Theme";
import { Grid } from "../../../OuiComponents/Layout";
import PeopleService from "../../../../services/people.service";
import VehiclePolicy from "../../../../insuranceServices/vehiclepolicy.service";
import { Autocomplete } from "../../../OuiComponents/Inputs";
import { useAlertContext } from "../../../../context/alert-context";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { endorsementService } from "../../../../services/endorsement.service";

function VehicleBeneficiaryModal(props: any) {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();

  //Con esta funcion actualizamos el beneficiario del vehiculo
  const handleBeneficiarySubmit = (data: any) => {
    //console.log(props.data, data.folio)
    endorsementService.patchVehicleBeneficiaryFolio(
      props.data?.endorsementFolio,
      props.data?.endorsementFolioEndo,
      props.data?.policyFolio,
      props.data?.vehicleFolio,
      data.folio
    ).then((response: any) => {
          //console.log('response: ',response)
          setDataAlert(true,"El beneficiario se registró con éxito.","success",autoHideDuration);
    }).catch((e: Error) => {
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
                        fullWidth
                        function={PeopleService.getAllByName}
                        parentCallBack={handleBeneficiarySubmit}
                      />
                    </Stack>
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
