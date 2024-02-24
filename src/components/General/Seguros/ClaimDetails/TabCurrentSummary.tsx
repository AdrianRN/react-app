import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Typography from "../../../OuiComponents/DataDisplay/Typography";
import { InputAdornment, TextField } from "../../../OuiComponents/Inputs";
import Stack from "../../../OuiComponents/Layout/Stack";
import {
    LinkLargeFont,
    TextSmallFont,
} from "../../../OuiComponents/Theme";
import { Grid } from "../../../OuiComponents/Layout";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { constants } from "buffer";
import Constants from "../../../../utils/Constants";
import FormatsData from '../../../../utils/Formats.Data';
import PoliciyService from "../../../../insuranceServices/policies.service";

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

  

function TabCurrentSummary(props: any) {

    const [noPolicy, setNoPolicy] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const policy: any = await PoliciyService.getPoliciesByFolio(props.data.policy);

                // Verificar si policy tiene algún valor antes de mostrarlo
                if (policy) {
                    setNoPolicy(policy.data.noPolicy);
                }

            } catch (error) {
                // Manejar errores en la obtención de la política
                console.error("Error al obtener la política:", error);
            }
        }

        fetchData();
    }, []);


    return (
        <>
        
            <Box component='form' maxWidth="auto">
                <Typography variant="h2" sx={{ ...LinkLargeFont, pb: 2 }}>
                    Resumen actual
                </Typography>

                <Stack direction="row" display="flex" spacing={1}>
                    <Grid
                        container
                        flexGrow={1}
                        flexBasis={0}
                        rowSpacing={1}
                        columnSpacing={{ xs: 1 }}
                    >
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Póliza
                                </Typography>
                                <TextField
                                name="policyFolio"
                                    disabled
                                    value={noPolicy ?? ""}
                                    type="text"
                                    
                                />
                                
                            </Stack>
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack
                                direction="column"
                                spacing={1}
                            >
                                <Typography sx={{ ...TextSmallFont }}>
                                    Estado del siniestro
                                </Typography>
                                <TextField
                                    name="description"
                                    disabled
                                    value={props.data?.objectStatusId ?? ""}
                                    type="text"
                                    
                                />

                            </Stack>
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack
                                direction="column"
                                spacing={1}
                            >
                                <Typography sx={{ ...TextSmallFont }}>
                                    No.Siniestro
                                </Typography>
                                <TextField
                                name="receiptNumber"
                                    disabled
                                    value={props.data?.folio ?? ""}                       
                                    type="text"
                                    
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Fecha de emisión
                                </Typography>
                                <TextField
                                name="createdAt"
                                    disabled
                                    value={FormatsData.stringDateFormat(props.data?.dateClaim)}
                                    type="date"
                                    
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Fecha de entrega
                                </Typography>
                                <TextField
                                name="startValidity"
                                    disabled
                                    value={FormatsData.stringDateFormat(props.data?.dateClaim)}
                                    type="date"
                                   
                                />
                            </Stack>
                        </Grid>
                        
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Tipo de responsabilidad
                                </Typography>
                                <TextField
                                    name="limitPayDate"
                                    disabled
                                    value={props.data?.liabilityType ?? ""}                         
                                    type="text"
                                   
                                />
                            </Stack>
                        </Grid>
                        
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Deducible
                                </Typography>
                                <TextField
                                name="clientName"
                                   disabled
                                    value={props.data?.deductible ?? ""}
                                    type="text"
                                    
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    porcentaje de daños
                                </Typography>
                                <TextField
                                name="damagePercentage"
                                    disabled
                                    value={props.data?.damagePercentage+"%"} 
                                    type="text"
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} alignSelf="center">
                                            <Stack direction='column' spacing={1}>
                                                <Typography sx={{ ...TextSmallFont }}>
                                                    Observaciones
                                                </Typography>
                                                <TextField
                                                    disabled
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    name='observations'
                                                    value={props.data?.observations}
                                                    inputProps={{ maxLength: 1000 }}
                                                />
                                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>

            </Box>
        </>
    );
}
export default TabCurrentSummary
const ROUND = (numb: number) => {
    return Math.ceil(numb * 100) / 100;
  };

  const moneyTypeNumber = (numb: number) => {
    return new Intl.NumberFormat("en-IN").format(numb);
  };