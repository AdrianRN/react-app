// Este toast puede ser utilizado para mostrar multiples mensajes o errores
import React from 'react';
import { toast } from 'react-toastify';
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const showToast = (message: any, severity: any, autoHideDuration: number = 4000) => {  
  const toastOptions = {
    autoClose: autoHideDuration,
    icon: () => {
      const iconMapping = {
        error: <CancelIcon className="errorIcon" fontSize="inherit" />,
        warning: <ErrorIcon className="warningIcon" fontSize="inherit" />,
        info: <InfoOutlinedIcon className="infoIcon" fontSize="inherit" />,
        success: <CheckCircleIcon className="successIcon" fontSize="inherit" />,
      }as Record<string, JSX.Element>;
      return iconMapping[severity];
    },
  };

  // Utilizar el método de toast correspondiente a la severidad
  switch (severity) {
    case 'error':
      toast.error(message, toastOptions);
      break;
    case 'warning':
      toast.warning(message, toastOptions);
      break;
    case 'info':
      toast.info(message, toastOptions);
      break;
    case 'success':
      toast.success(message, toastOptions);
      break;
    default:
      break;
  }
};
