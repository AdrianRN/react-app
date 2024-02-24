import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import React from 'react';

const LinkSmallTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Titillium Web',
  fontWeight: 600, // SemiBold
  fontSize: '15px',
  lineHeight: '24px',
  letterSpacing: '0.75px',
  // No se aplica paragraph-spacing en Typography
}));

function LinkSmall( props : any) {
  return <LinkSmallTypography>{props.children}</LinkSmallTypography>;
}

export default LinkSmall;