import { Alert, Box } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { styled } from '@mui/system';
import React, { useEffect, useState } from 'react';
import LinkSmall from '../Typography/LinkSmall';


interface CustomSnackbarProps {
    open: boolean;
    autoHideDuration: number;
    icon: React.ReactElement<SvgIconProps>;
    message: string;
}
const CustomSnackbar = styled(Snackbar)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  
   // Aplica el corner radius de 20
});

const CustomAlert = styled(Alert)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FEFEE5',
  borderRadius: '20px'
});

function SnackBarWarning(props : CustomSnackbarProps) {
  const { open, autoHideDuration, icon, message } = props; 
  const [isOpen, setIsOpen] = useState(open);
  
  useEffect(() => {
    setIsOpen(open);
    if (open) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        console.log(isOpen);
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration]);



  return (
    <Box> 
        <CustomSnackbar 
          open={isOpen} 
          autoHideDuration={autoHideDuration} 
          anchorOrigin = {{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <CustomAlert iconMapping={{ success: icon }}
                sx={{ color: '#000' }}
            >
                <LinkSmall>
                    {message}
                </LinkSmall>
          </CustomAlert>
        </CustomSnackbar>
     </Box>
  );
}

export default SnackBarWarning;