import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import LogoutImg from "./../../General/NotFound/img/Logo-logout.svg";

import "./../../General/NotFound/css/styles.css";
import "./../../General/NotFound/css/onesta-font.css";
import "./../../General/NotFound/css/bootstrap-grid.min.css";
import { useNavigate } from "react-router-dom";
import {
    ColorPureWhite,
  DisplayMediumBoldFont,
  DisplaySmallBoldFont,
  LinkXLFont,
} from "../../OuiComponents/Theme";

import { Box } from "@mui/material";
import Button from "../../OuiComponents/Inputs/Button";
import Refresh from "../../OuiComponents/Icons/Refresh";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

const ErrorPage = (props: any) => {
    console.log("En error page");
    console.log(props);
  const navigate = useNavigate();

  const BackHome = () => {
    navigate("/index");
  };
  return (
    <div className="html mh-100">
      <div className="body mh-100">
        <div className="row mb-3 justify-content-center h-100 w-100">
          <div className="col-10 mt-auto mb-auto">
            <div className="card p-5">
              <div className="card-body d-flex flex-column text-algin-center align-items-center">
                <div>
                  <img className="img-logout m-auto" src={LogoutImg} alt=""/>
                </div>
                <div className="pt-3">
                  <Typography sx={{ ...DisplayMediumBoldFont }}>
                    ¡Ooops!
                  </Typography>
                  <Typography sx={{...DisplaySmallBoldFont, marginBottom: "20px"}}>
                    Sucedió algo inesperado, favor de ponerse en contacto con soporte.
                  </Typography>
                  <Typography sx={{...LinkXLFont, marginBottom: "20px"}}>
                    <strong> Mensaje:  {props.error.message} </strong>
                  </Typography>
                </div>
                <div className="pt-4">
                  <Box display="flex">
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ pb: 1 }}>
                      <Button
                        variant="contained"
                        type="submit"
                        startIcon={<KeyboardReturnIcon  />}
                        size="large"
                        disableElevation
                        sx={{ backgroundColor: "#e5105d" }}
                        onClick={props.resetErrorBoundary}
                      >
                        Volver
                      </Button>
                    </Box>
                  </Box>
                </div>
                <div className="pt-4">
                  <small className="text-muted">
                    © Onesta Seguros y Finanzas | All Rights Reserved
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
