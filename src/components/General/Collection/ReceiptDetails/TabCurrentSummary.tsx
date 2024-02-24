import { Box } from "@mui/material";
import React from "react";
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
//console.log(props.data)
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
                                    No.Póliza
                                </Typography>
                                <TextField
                                name="policyFolio"
                                    disabled
                                    value={props.data?.noPolicy ?? ""}
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
                                    Estado del recibo
                                </Typography>
                                <TextField
                                    name="description"
                                    disabled
                                    value={ Constants.receiptStatusObject[props.data?.receiptStatus]?.description
                                         ?? ""}
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
                                    No.Recibo
                                </Typography>
                                <TextField
                                name="receiptNumber"
                                    disabled
                                    value={props.data?.receiptNumber+" de "+
                                    props?.data?.totalReceipts}                       
                                    type="text"
                                    
                                />
                            </Stack>
                        </Grid>
                        {/* <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Fecha de emisión
                                </Typography>
                                <TextField
                                name="createdAt"
                                    disabled
                                    value={FormatsData.stringDateFormat(props.data?.createdAt)}
                                    type="date"
                                    
                                />
                            </Stack>
                        </Grid> */}
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Vigencia de
                                </Typography>
                                <TextField
                                name="startValidity"
                                    disabled
                                    value={FormatsData.stringDateFormat(props.data?.startValidity)}
                                    type="date"
                                   
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Vigencia hasta
                                </Typography>
                                <TextField
                                name="endValidity"
                                    disabled
                                    value={FormatsData.stringDateFormat(props.data?.endValidity)}
                                    type="date"
                                    
                                />
                            </Stack>
                        </Grid>
                        {/* <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Fecha de vencimiento
                                </Typography>
                                <TextField
                                    name="dueDate"
                                    disabled
                                    value={FormatsData.stringDateFormat(props.data?.dueDate)}                         
                                    type="date"
                                   
                                />
                            </Stack>
                        </Grid> */}
                        
                        {/* <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Cliente
                                </Typography>
                                <TextField
                                name="clientName"
                                   disabled
                                    value={props.data?.clientName}
                                    type="text"
                                    
                                />
                            </Stack>
                        </Grid> */}
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Prima neta
                                </Typography>
                                <TextField
                                name="netPremium"
                                    disabled
                                    value={props.data?.netPremium}
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                      }}
                                    
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Descuento 1
                                </Typography>
                                <TextField
                                name="settingOne"
                                    disabled
                                    value={props.data?.settingOne}
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                      }}
                                    
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Descuento 2
                                </Typography>
                                <TextField
                                name="settingTwo"
                                    disabled
                                    value={props.data?.settingTwo}
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                      }}
                                    
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Recargo 
                                </Typography>
                                <TextField
                                name="additionalCharge"
                                    disabled
                                    value={props.data?.additionalCharge}
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                      }}
                                    
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    Derecho
                                </Typography>
                                <TextField
                                name="rights"
                                    disabled
                                    value={props.data?.rights}
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                      }}
                                    
                                />
                            </Stack>
                        </Grid>
                        {/* <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                    I.V.A
                                </Typography>
                                <TextField
                                name="ivaPercentage"
                                    disabled
                                    value={props.data?.ivaPercentage+"%"}
                                   
                                />
                            </Stack>
                        </Grid> */}
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                     I.V.A
                                </Typography>
                                <TextField
                                name="ivaPercentage"
                                    disabled
                                    value={moneyTypeNumber(ROUND(props?.data?.ivaAmount ?? 0))}
                                    type="text"
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                      }}
                                    
                                />
                            </Stack>
                        </Grid>
                        {/* <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1}>
                                <Typography sx={{ ...TextSmallFont }}>
                                Prima neta monto
                                </Typography>
                                <TextField
                                name="netPremiumAmount"
                                    disabled
                                    value={props.data?.netPremiumAmount}
                                    type="text"
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                      }}
                                />
                            </Stack>
                        </Grid> */}
                        <Grid item xs={4} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={1} sx={{ paddingBottom: "32px" }}>
                                <Typography sx={{ ...TextSmallFont }}>
                                Prima total
                                </Typography>
                                <TextField
                                name="grandTotal"
                                    disabled
                                    value={props.data?.grandTotal}
                                    type="text"
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                                        inputComponent: NumericFormatCustom as any,
                                      }}
                                    
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