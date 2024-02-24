import  React, { createContext, ReactNode, useContext, useState } from "react";
interface AlertContextProps {
  isSnackbarOpen: boolean;
  severity: "success" | "info" | "warning" | "error";
  messageAlert: string;
  autoHideDuration: number;
  handleSnackbarClose: () => void;
  setDataAlert: (
    open: boolean,
    message: string,
    severity: "success" | "info" | "warning" | "error",
    autoHideDuration: number
  ) => void;
}
const AlertContext = createContext<AlertContextProps | undefined>(
  {} as AlertContextProps
);

interface AlertProviderProps {
  children: ReactNode;
}

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error(
      "useAlertContext debe ser usado dentro de un proveedor AlertProvider"
    );
  }
  return context;
};
export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [severity, setSeverity] = useState<
    "success" | "info" | "warning" | "error"
  >("success");
  const [messageAlert, setMessageAlert] = useState("");
  const [autoHideDuration, setAutoHideDuration] = useState(3000);

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
    setSeverity("success");
    setMessageAlert("");
  };

  const setDataAlert = (
    open: boolean,
    message: string,
    severity: "success" | "info" | "warning" | "error",
    autoHideDuration: number
  ) => {
    setIsSnackbarOpen(open);
    setMessageAlert(message);
    setSeverity(severity);
    setAutoHideDuration(autoHideDuration);
  };

  const contextValue: AlertContextProps = {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  };

  return (
    <AlertContext.Provider value={contextValue}>
    {children}
  </AlertContext.Provider>
  )
}
