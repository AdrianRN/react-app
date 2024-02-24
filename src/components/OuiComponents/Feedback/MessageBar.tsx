import React, { useEffect, useState } from "react"; // Hooks
import CustomSnackbar from './CustomSnackbar'

export default function MessageBar(props: any) {
  return (
    <>
      <CustomSnackbar
        open={props.open}
        onClose={props.close}
        autoHideDuration={props.autoHideDuration}
        severity={props.severity} // Cambia la severidad según sea necesario
        message={props.message} // 
      />
    </>
  );
}
