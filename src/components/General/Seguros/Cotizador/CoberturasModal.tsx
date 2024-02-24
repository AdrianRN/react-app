import React, { useEffect, useState } from 'react';
import FormatData from '../../../../utils/Formats.Data';
import Button from '../../../OuiComponents/Inputs/Button';
import { ColorPureWhite, LinkLargeFont, LinkMediumBoldFont, TextMediumBoldWhiteFont } from '../../../OuiComponents/Theme';
import { Cobertura, Packet } from './MultiCotizador';
import { Avatar, ListItemIcon, Typography } from '../../../OuiComponents/DataDisplay';
import { ArrowRight, Cancel } from '../../../OuiComponents/Icons';
import { Dialog } from '../../../OuiComponents/Feedback';
import { DialogContent, IconButton, Modal } from '@mui/material';
import Stack from '../../../OuiComponents/Layout/Stack';
import Grid from '../../../OuiComponents/Layout/Grid';
import Paper from '../../../OuiComponents/Surfaces/Paper';

function CoberturasModal(props: any) {
  const [open, setOpen] = useState(false);
  const [packet, setPacket] = useState<Packet>({
    CotizacionId: 0,
    VersionId: 0,
    Type: '',
    FinVigencia: '',
    Terceros: {},
    GastosMedicos: {},
    PagoAnual: {},
    Coberturas: [],
    Icon: '',
    Insurer: '',
  });

  useEffect(() => {
    setOpen(props.open);
    setPacket(props.packet);
  }, [props.open, props.packet]);

  const handleClose = () => {
    setOpen(false);
    props.close();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div
        style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          width: '80%', 
          margin: '0 auto', 
          marginTop: '20px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <IconButton
          onClick={props.close}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <Cancel />
        </IconButton>
        <Stack display="column" spacing={1}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Cancel />
          </IconButton>
          <Typography sx={{ flexGrow: 1 }} variant="h5" style={{ marginBottom: '32px' }}>
            Coberturas
          </Typography>
        </Stack>
        <Stack display="column" spacing={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: '24px', borderRadius: 8, marginBottom: '24px', width: '90%' }}>
                <Grid container justifyContent="space-between" style={{ marginTop: '20px' }}>
                  <Grid item xs={4}>
                    <ListItemIcon>
                      <Avatar
                        src={FormatData.getUriLogoCompany(packet.Icon) ?? ''}
                        variant="rounded"
                        alt={packet.Icon}
                        sx={{
                          width: '70%',
                          height: '70%',
                        }}
                      />
                    </ListItemIcon>
                  </Grid>
                  <Grid item xs={3}>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <Typography sx={LinkMediumBoldFont} variant="body1">${packet.Terceros}</Typography>
                        <Typography variant="body2">R.C. Daños a terceros</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2}>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <Typography sx={LinkMediumBoldFont} variant="body1">${packet.GastosMedicos}</Typography>
                        <Typography variant="body2">Gastos médicos</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper
                      sx={{
                        bgcolor: 'grey.700',
                        color: 'white',
                        borderRadius: 1,
                        marginLeft: '8px', // Control spacing on the left
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', // Center the content vertically
                        justifyContent: 'center', // Center the content horizontally
                        width: '70%'
                      }}
                    >
                      <Typography sx={TextMediumBoldWhiteFont} variant="body1">${packet.PagoAnual}</Typography>
                      <Typography variant="body2">Pago único anual</Typography>
                    </Paper>
                  </Grid>
                </Grid>
                <Grid container justifyContent="flex-end" alignItems="center">
                  <Grid item>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '8px' }}>
                      <Button variant="contained"
                        color="primary"
                        endIcon={<ArrowRight color={ColorPureWhite} />}
                        onClick={() => {
                          props.openContratarModal(packet);
                        }}
                      >
                        Contratar
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </Paper>
              {packet.Coberturas.map((item: Cobertura, index) => (
                <Paper
                  key={index}
                  sx={{ p: '24px', borderRadius: 8, marginBottom: '24px', width: '90%' }}
                >
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                      <Grid container direction="column" spacing={1}>
                        <Grid item>
                          <Typography sx={LinkLargeFont} style={{ marginBottom: '20px' }}>{item.description}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="space-between" style={{ marginBottom: '15px' }}>
                    <Grid item xs={3}>
                      <Grid container direction="column" spacing={1}>
                        <Grid item>
                          <Typography sx={LinkMediumBoldFont} variant="body1">{item.sumAssured}</Typography>
                          <Typography variant="body2">Suma asegurada</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={2}>
                      <Grid container direction="column" spacing={1}>
                        <Grid item>
                          <Typography sx={LinkMediumBoldFont} variant="body1">{item.deductibleValue}</Typography>
                          <Typography variant="body2">Deducible</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={2}>
                      <Grid container direction="column" spacing={1}>
                        <Grid item>
                          <Typography sx={LinkMediumBoldFont} variant="body1">${item.premiumAmount}</Typography>
                          <Typography variant="body2">Prima total</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>
          </Grid>
        </Stack>
      </div>
    </Modal>
  );
}

export default CoberturasModal;
