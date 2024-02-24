import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Dialog from "../../../OuiComponents/Feedback/Dialog";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { TextSmallFont } from '../../../OuiComponents/Theme';
import { Box, Grid, Stack } from '../../../OuiComponents/Layout';
import { Button, Select, TextField } from '../../../OuiComponents/Inputs';
import { Typography } from '../../../OuiComponents/DataDisplay';
import catalogValueService from '../../../../services/catalogvalue.service';
import { MenuItem } from '../../../OuiComponents/Navigation';
import { ClaimsService } from '../../../../services/claims.service';
import Constants from '../../../../utils/Constants';

// Define los tipos de las propiedades
interface EditModalProps {
  claimData: any;
  isOpen: boolean;
  onClose: () => void;
  claimFolio: string; // Agrega el folio como una prop
  refreshClaims: Dispatch<SetStateAction<boolean>>;
}

interface ResponsabilityTypes {
  catalogValueId: string;
  folio: string;
  description: string;
  catalogId: string;
  objectStatusId: number;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

export function EditModal({ claimData, isOpen, claimFolio, onClose, refreshClaims }: EditModalProps) {
  const [formData, setFormData] = React.useState(claimData);
  const [responsability, setResponsability] = useState<ResponsabilityTypes[]>([]);


  const updateClaimData = (field: string, value: unknown) => {
    if (typeof value === 'string') {
      if (field === 'dateClaim' || field === 'deliveryCommitmentDate') {
        // Parse the selected date value from the field
        const selectedDate = new Date(value);
  
        // Format the new date as a string in ISO format
        const newDate = selectedDate.toISOString();
  
        setFormData({
          ...formData,
          [field]: newDate,
        });
      } else {
        if (field === 'deductible') {
          setFormData({
            ...formData,
            [field]: parseFloat(value), // Convierte el valor de "deductible" a número
          });
        } else {
          setFormData({
            ...formData,
            [field]: value,
          });
        }
      }
    }
  };
  

  const onSave = async () => {
    try {
      // Quita los campos no deseados del objeto formData
      const {
        claimId,
        createdAt,
        createdBy,
        folio,
        updatedAt,
        updatedBy,
        ...cleanedData
      } = formData;
  
      const result = await ClaimsService.putClaims(claimFolio, cleanedData);
      refreshClaims((prev) => !prev);
      console.log("cleaned data:", cleanedData);
      console.log("Solicitud exitosa. Resultado:", result);
      onClose();
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
    onClose();
  };


  useEffect(() => {
    // Assuming you have an async function that fetches data
    console.log(formData);
    async function fetchData() {
      try {
        const { data } = await catalogValueService.getCatalogValueByCatalogId(Constants.typeCarResponsibilityFolio);
        setResponsability(data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }

    fetchData(); // Call the async function when the component mounts
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      aria-labelledby="modal-modal-title"
    >
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Editar Siniestro</h2>
          <IconButton onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent dividers>
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Stack direction='column' spacing={1}>
                  <Typography sx={{ ...TextSmallFont }}>
                    Fecha
                  </Typography>
                  <TextField
                    name="dateClaim"
                    value={new Date(formData.dateClaim).toLocaleDateString('en-CA', { timeZone: 'UTC' })}
                    type='date'
                    onChange={(event) => updateClaimData('dateClaim', event.target.value)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction='column' spacing={1}>
                  <Typography sx={{ ...TextSmallFont }}>
                    Cliente
                  </Typography>
                  <TextField
                    disabled
                    name="client"
                    value={formData.client}
                    type='text'
                    onChange={(event) => updateClaimData('client', event.target.value)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction='column' spacing={1}>
                  <Typography sx={{ ...TextSmallFont }}>
                    Póliza
                  </Typography>
                  <TextField
                    disabled
                    name="policy"
                    value={formData.policy}
                    type='text'
                    onChange={(event) => updateClaimData('policy', event.target.value)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction='column' spacing={1}>
                  <Typography sx={{ ...TextSmallFont }}>
                    Aseguradora
                  </Typography>
                  <TextField
                    disabled
                    name="insuranceCompany"
                    value={formData.insuranceCompany}
                    type='text'
                    onChange={(event) => updateClaimData('insuranceCompany', event.target.value)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction='column' spacing={1}>
                  <Typography sx={{ ...TextSmallFont }}>
                    Responsabilidad
                  </Typography>
                  {/* <TextField
                    name="liabilityType"
                    value={formData.liabilityType}
                    type='text'
                    onChange={(event) => updateClaimData('liabilityType', event.target.value)}
                  /> */}
                  <Select
                    style={{ width: '100%' }}
                    value={formData.liabilityType || ''} // Asegura que haya un valor seleccionado
                    onChange={(event) => updateClaimData('liabilityType', event.target.value)}
                  >
                    {responsability.map((element) => (
                      <MenuItem key={element.catalogValueId} value={element.description}>
                        {element.description}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction='column' spacing={1}>
                  <Typography sx={{ ...TextSmallFont }}>
                    Deducible
                  </Typography>
                  <TextField
                    name="deductible"
                    value={formData.deductible}
                    type='number'
                    onChange={(event) => updateClaimData('deductible', event.target.value)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction='column' spacing={1}>
                  <Typography sx={{ ...TextSmallFont }}>
                    Porcentaje de Daño
                  </Typography>
                  <TextField
                    name="damagePercentage"
                    value={formData.damagePercentage}
                    type='number'
                    onChange={(event) => updateClaimData('damagePercentage', event.target.value)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction='column' spacing={1}>
                  <Typography sx={{ ...TextSmallFont }}>
                    Fecha de Compromiso de Entrega
                  </Typography>
                  <TextField
                    name="deliveryCommitmentDate"
                    value={new Date(formData.deliveryCommitmentDate).toLocaleDateString('en-CA', { timeZone: 'UTC' })}
                    type='date'
                    onChange={(event) => updateClaimData('deliveryCommitmentDate', event.target.value)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography sx={{ ...TextSmallFont }}>
                  Observaciones
                </Typography>
                <TextField
                  style={{ width: '100%', marginBottom: '20px' }}
                  multiline
                  rows={4}
                  name="observations"
                  value={formData.observations}
                  onChange={(event) => updateClaimData('observations', event.target.value)}
                />
              </Grid>
            </Grid>
            <Button variant="contained" color="primary" onClick={onSave}>
              Guardar Cambios
            </Button>
          </Box>
        </DialogContent>
      </div>
    </Dialog>
  );
}
