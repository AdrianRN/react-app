import React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';

const DisplayHugeTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'TitilliumWeb-SemiBold, sans-serif',
  fontWeight: 400, // SemiBold
  fontSize: '64px',
  lineHeight: '72px',
  letterSpacing: '1px',
  // No se aplica paragraph-spacing en Typography
}));

function LinkSmall( props : any) {
  return <DisplayHugeTypography>{props.children}</DisplayHugeTypography>;
}

export default LinkSmall;