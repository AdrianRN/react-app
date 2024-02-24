import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, useTheme } from '@mui/material';
import PackageComparisonItem from './PackageComparisonItem';
import { Packet } from './MultiCotizador';
import { Grid } from '../../../OuiComponents/Layout';
import { ColorPink, ColorPureWhite, TextMediumPlusFont } from '../../../OuiComponents/Theme';
import { CancelWhite } from '../../../OuiComponents/Icons';
import IconButton from '@mui/material/IconButton/IconButton';
import { Button } from '../../../OuiComponents/Inputs';

const normalizeString = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

type CoverageData = {
    [key: string]: {
      sumAssured: string;
      deductibleValue: string;
    };
  };
  

const CompararModal = ({ isOpen, onClose, selectedPackages }: any) => {

    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const coverages = [
        { label: 'Daños materiales', included: true },
        { label: 'Robo total', included: true },
        { label: 'Responsabilidad civil', included: true },
        { label: 'Servicios de Asistencia', included: true },
        { label: 'Gastos Médicos', included: false },
        { label: 'Asistencia Jurídica', included: true },
    ];
    const theme = useTheme();

    const isNumber = (value: string) => {
        return /^\$?(\d{1,3}(,\d{3})*|(\d+))(\.\d{2})?$/.test(value);
    };
    
    const packageCoverageData: CoverageData[] = selectedPackages.map((pkg: Packet) => {
        const coverageData: CoverageData = {};
        pkg.Coberturas.forEach((cov) => {
            let normalizedDescription = normalizeString(cov.description);
    
            if (["responsabilidad civil bienes", "responsabilidad civil exceso por muerte", "adaptaciones y conversiones (dm)", "equipo especial daños materiales", "cero deducible daños materiales por pérdida total", "cero deducible daños materiales por pérdida parcial"].map(normalizeString).includes(normalizedDescription)) {
                normalizedDescription = 'daños materiales';
            }
            else if (["robo total", "equipo especial robo total", "adaptaciones y conversiones (rt)", "robo de autopartes", "robo o extravío de llaves", "cerocible pérdida total robo"].map(normalizeString).includes(normalizedDescription)) {
                normalizedDescription = 'robo total';
            }
            else if (["responsabilidad civil (límite único y combinado)", "responsabilidad civil familiar", "responsabilidad civil por daños a los ocupantes", "responsabilidad civil cruzada", "responsabilidad civil en usa y canadá", "extensión de responsabilidad civil para automóvil particular"].map(normalizeString).includes(normalizedDescription)) {
                normalizedDescription = 'responsabilidad civil';
            }
            else if (["asistencia en viajes", "asistencia médica", "asistencia funeraria", "asistencia legal plus provial*", "ayuda para gastos de transporte", "ayuda para gastos de transporte pérdida parcial", "beneficios servicios satelitales"].map(normalizeString).includes(normalizedDescription)) {
                normalizedDescription = 'servicios de asistencia';
            }
            else if (["gastos médicos ocupantes (límite único combinado)", "gastos médicos ocupantes", "asistencia médica"].map(normalizeString).includes(normalizedDescription)) {
                normalizedDescription = 'gastos médicos';
            }
            else if (["asistencia jurídica", "asistencia legal plus provial*"].map(normalizeString).includes(normalizedDescription)) {
                normalizedDescription = 'asistencia jurídica';
            }
    
            const sumAssured = cov.sumAssured;
            coverageData[normalizedDescription] = {
                sumAssured: isNumber(sumAssured) ? `$${sumAssured}` : sumAssured,
                deductibleValue: cov.deductibleValue,
            };
        });
        return coverageData;
    });
    
    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xl" PaperProps={{ sx: { borderRadius: "25px"} }}>
            <DialogTitle sx={{ textAlign: 'center', background: ColorPink, ...TextMediumPlusFont, color: ColorPureWhite }}>Comparar Coberturas</DialogTitle>
            <IconButton
                onClick={onClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    
                }}
            >
                <CancelWhite />
            </IconButton>
            <DialogContent dividers style={{ overflowX: 'auto' }}>
                <Grid container direction="column" spacing={2}>
                    <Grid item xs={12} container wrap="nowrap" >
                        <Grid item style={{ minWidth: '200px' }} >
                            <></>
                        </Grid>
                        {selectedPackages.map((pkg: Packet, idx: number) => (
                            <Grid item style={{ minWidth: '200px', flexShrink: 0 }} key={idx}>
                                <PackageComparisonItem packet={pkg} />
                            </Grid>
                        ))}
                    </Grid>
                    {coverages.map((coverage, coverageIdx) => (
                        <Grid item xs={12} container wrap="nowrap" key={coverageIdx}>
                            <Grid item style={{ minWidth: '200px', flexShrink: 0, marginLeft: '10px'}}>
                                <Typography variant="subtitle1">{coverage.label}</Typography>
                            </Grid>
                            {packageCoverageData.map((data: any, idx: number) => (
                                <Grid item style={{ minWidth: '200px', flexShrink: 0}} key={idx}>
                                    <Typography variant="subtitle1">
                                        {data[normalizeString(coverage.label)]?.sumAssured ? data[normalizeString(coverage.label)]?.sumAssured : 'No incluye'}
                                    </Typography>
                                    <Typography variant="body2">
                                        Deducible {data[normalizeString(coverage.label)]?.deductibleValue || 'no incluye'}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions sx={{padding:2}}>
                <Button variant='contained' onClick={onClose} >
                Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CompararModal;