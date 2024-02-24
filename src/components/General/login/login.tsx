import { BrowserUtils, PublicClientApplication } from "@azure/msal-browser";
import axios from "axios";
import { AES } from "crypto-js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import onestaLogoLogin from "../../../assets/img/onestaLogoLogin.png";
import { config } from "../../../azureConfig";
import { API_URL } from "../../../enviroment/enviroment";
import Carrousel from "./carrousel/Carrousel";
import styles from "./login-styles.module.css"; // Importa los estilos utilizando CSS Modules
import { Checkbox } from "../../OuiComponents/Inputs";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { useAlertContext } from "../../../context/alert-context";
import MessageBar from "../../OuiComponents/Feedback/MessageBar";
import UserService from "../../../services/user.service";

const apiUrl: any = process.env.REACT_APP_API_URL;
const encryptionKey: any = process.env.REACT_APP_ENCRYPTION_KEY;

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: config.appId,
    redirectUri: config.redirectUri,
    authority: config.authority,
  },
  cache: {
    cacheLocation: "localStorage", // storing sesionData in localStorage
    storeAuthStateInCookie: true,
  },
  system: {
    allowRedirectInIframe: true
  }
});

export default function Login() {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessionTime, setSessionTime] = useState<string>('10000');

  useEffect(() => {
    localStorage.setItem("sessionTime", "10000")
    const checkLoginStatus = async () => {
      await msalInstance.handleRedirectPromise();

      const accounts = msalInstance.getAllAccounts();
      setLoggedIn(accounts.length > 0);

      // Si el usuario está autenticado, redirige al /index
      if (accounts.length > 0) {
        navigate("/index");
      }
    };
    checkLoginStatus();
  }, []);

  const navigate = useNavigate();

  const handleManualLogin = async () => {
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;

    if (!email && !password) {
      setDataAlert(true, "Favor de introducir sus credenciales.", "warning", autoHideDuration);
      return
    } else if (!email) {
      setDataAlert(true, "Favor de introducir su usuario.", "warning", autoHideDuration);
      return
    } else if (!password) {
      setDataAlert(true, "Favor de introducir su contraseña.", "warning", autoHideDuration);
      return
    }

    try {
      //const response = await axios.post(`${process.env.REACT_APP_API_URL}/Authentication/Authorize`, {
      const response = await axios.post(
        `${API_URL}/api/Authentication/Authorize`,
        {
          email: email,
          password: password,
        }
      );

      if (response.status === 200) {
        const token = response.data.data;

        // Cifra el token
        const encryptedToken = AES.encrypt(
          token,
          `${process.env.REACT_APP_ENCRYPTION_KEY}`
        ).toString();

        // Guarda el token cifrado en el localStorage
        localStorage.setItem("token", encryptedToken);
        localStorage.setItem("userEmail", email);

        navigate("/index");
      } else {
        console.log("Error en la respuesta de la API");
      }
    } catch (error) {
      setDataAlert(true, "Credenciales incorrectas.", "error", autoHideDuration);
      console.log("Error al iniciar sesión manual:", error);
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      const loginResponse = await msalInstance.loginPopup();
      const accessToken = loginResponse.accessToken;
      const accounts = msalInstance.getAllAccounts();
      setLoggedIn(accounts.length > 0);

      // Obtener datos del usuario
      const userResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();

        localStorage.setItem("userName", userData.displayName);
        localStorage.setItem("userEmail", userData.mail);

        const userInfo = await UserService.getByEmail(userData.mail);

        if (!userInfo.data) {

          setDataAlert(true, "Credenciales sin acceso.", "error", autoHideDuration);
          setTimeout(() => {
            msalInstance.logoutRedirect({
              account: msalInstance.getActiveAccount(),
              onRedirectNavigate: () => !BrowserUtils.isInIframe()
            })
          }, 1000);
          localStorage.clear();
          return
        }

        localStorage.setItem("userInfo", JSON.stringify(userInfo.data));

      } else {
        console.log("Error al obtener los datos del usuario.");
      }

      // Obtener datos de la organización
      const organizationResponse = await fetch("https://graph.microsoft.com/v1.0/organization", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (organizationResponse.ok) {
        const organizationData = await organizationResponse.json();
        // Extraer el nombre de la organización
        const organizationName = organizationData.value[0].displayName;
        localStorage.setItem("organizationName", organizationName);
      } else {
        console.log("Error al obtener los datos de la organización.");
      }

      // Obtener foto del usuario
      const userPhotoResponse = await fetch(
        "https://graph.microsoft.com/v1.0/me/photo/$value",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const blob = await userPhotoResponse.blob();
      const reader = new FileReader();
      reader.onload = () => {
        // Almacenar la imagen en formato base64 en el localStorage
        localStorage.setItem("userImage", reader.result as string);
      };
      reader.readAsDataURL(blob);
      setTimeout(() => {
        navigate("/index");
      }, 500);
    } catch (error) {
      console.log("Error al iniciar sesión:", error);
    }
  };

  const handleActiveSession = () => {
    //console.log(sessionTime =="30000" ? "10000" : "30000")
    if (sessionTime == "30000") {
      setSessionTime("10000")
      console.log("10 segundos")
      localStorage.setItem("sessionTime", "10000")
    } else {
      setSessionTime("30000")
      console.log("30 segundos")
      localStorage.setItem("sessionTime", "30000")
    }
  }

  return (
    <>
      <MessageBar
        open={isSnackbarOpen}
        severity={severity}
        message={messageAlert}
        close={handleSnackbarClose}
        autoHideDuration={autoHideDuration}
      />
      <div className={styles["split"] + " " + styles["left"]}>
        <div
          className={
            styles["centered"] +
            " " +
            styles["text-login-form"] +
            " " +
            styles["login-form"]
          }
        >
          <img
            className={styles["logo"]}
            src={onestaLogoLogin}
            alt="Onesta One"
          />
          <form autoComplete="off">
            <div className={styles["form-group"]}>
              <label htmlFor="email" className={styles["form-label"]}>
                Correo electrónico
              </label>
              <input
                type="email"
                className={styles["form-control"]}
                id="email"
                placeholder="Correo electrónico"
              />
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="password" className={styles["form-label"]}>
                Contraseña
              </label>
              <input
                type="password"
                className={styles["form-control"]}
                id="password"
                placeholder="Contraseña"

              />
              <FormGroup>
                <FormControlLabel control={<Checkbox onChange={handleActiveSession} />} label="Mantener sesión activada" />
              </FormGroup>
            </div>
            <div className={styles["p25"]}>
              <button
                type="button"
                className={styles["btn"]}
                onClick={handleManualLogin}
              >
                Iniciar sesión
              </button>
            </div>
          </form>
          <hr />
          <div>
            <button
              onClick={handleMicrosoftLogin}
              className={styles["btnLoginMicrosoft"]}
            >
              <img
                style={{ marginRight: "8px" }}
                src="https://learn.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-apps/ms-symbollockup_mssymbol_19.png"
                alt="Microsoft logo"
              />
              Inicia sesión con Microsoft
            </button>
          </div>
        </div>
      </div>
      <div className={styles["split"] + " " + styles["right"]}>
        <Carrousel />
      </div>
    </>
  );
}
