import { Dialog, DialogTitle, IconButton, Typography } from "@mui/material";
import React from "react";
import { Box, Grid, Stack } from "../../OuiComponents/Layout";
import DialogContent from "@mui/joy/DialogContent/DialogContent";
import Button from "../../OuiComponents/Inputs/Button";
import TextField from "../../OuiComponents/Inputs/TextField";
import { Form } from "react-router-dom";

function ReconciliationSkeleton(props: any) {
  return (
    <>
      <Dialog
        open={props.open}
        aria-labelledby="modal-modal-title"
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "15px",
            padding: 2,
          },
        }}
      >
        <DialogContent>
          <Typography sx={{ color: "#000" }}></Typography>
          <Form>
            <Box>
              <Stack direction="row" spacing="10px" sx={{ paddingTop: "10px" }}>
                <Grid container direction="column" xs={4}>
                  <Stack direction="column" spacing={0.5}>
                    <Typography>Folio</Typography>
                    <TextField />
                    <Typography>Recibo</Typography>
                    <TextField />
                    <Typography>Poliza</Typography>
                    <TextField />
                    <Typography>Cliente</Typography>
                    <TextField />
                  </Stack>
                </Grid>
                <Grid container direction="column" xs={4}>
                  <Stack direction="column" spacing={0.5} paddingBottom="10px">
                    <Typography>Monto</Typography>
                    <TextField />
                    <Typography>% IVA</Typography>
                    <TextField />
                    <Typography>Monto IVA</Typography>
                    <TextField />
                    <Typography>Subtotal</Typography>
                    <TextField />
                    <Typography>Comisiones</Typography>
                    <TextField />
                    <Typography>Maquila</Typography>
                    <TextField />
                  </Stack>
                </Grid>
                <Grid
                  container
                  direction="column"
                  xs={4}
                  sx={{ justifyContent: "end", alignContent: "end" }}
                >
                  <Stack direction="column" paddingBottom="10px" spacing={0.5}>
                    <Typography>Total</Typography>
                    <TextField />
                  </Stack>
                </Grid>
              </Stack>
            </Box>

            <Stack
              direction="row"
              sx={{ paddingTop: "10px", justifyContent: "space-between" }}
            >
              <Button type="submit">Conciliar</Button>
              <Button variant="outlined">Cancelar</Button>
            </Stack>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ReconciliationSkeleton;
