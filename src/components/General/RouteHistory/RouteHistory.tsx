import React, { useEffect, useRef, useState } from "react";
import { Link, RouteObject, useLocation, useNavigate } from "react-router-dom";
import RouteRegex from "../../../models/RouteRegex";

const RouteHistory: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Utiliza un estado para mantener un historial completo de rutas visitadas
  const [routeHistory, setRouteHistory] = useState<
    { path: string; fullPath: string }[]
  >([]);
  const initialRender = useRef(true); // Utiliza una referencia para seguir el estado inicial

  let currentCategory = location.pathname.split("/")[2];
  currentCategory = currentCategory === "administracion" ? "administración" : currentCategory;
  let id: any = null;

  const pathMatch = location.pathname.match(/\/index\/seguros\/polizas\/(.+)/);
  if (pathMatch) {
    id = pathMatch[1]; // Captura el valor del ID desde la ruta
  }


  const specialCategories: any = {
    cobranza: ["Home"],
    conciliaciones: ["Home"],
    // Añade más categorías y rutas personalizadas según sea necesario
  };

  // Mapeo de rutas a nombres
  const routeNames: { [key: string]: string } = {
    "/index": "Home",
    "/index/seguros/customers": "People",
    "/index/seguros/prospectos": "Prospectos",
    "/index/administracion/usuarios": "Usuarios",
    "/index/administracion/catalogos": "Catálogos",
    "/index/administracion/personas": "Personas",
    "/index/administracion/comunicados": "Comunicados Internos",
    "/index/administracion/customers": "Clientes",
    "/index/administracion/companias": "Compañías",
    "/index/seguros/clientes": "Clientes",
    "/index/seguros/polizas": "Pólizas",
    "/index/fianzas/clientes": "Clientes",
    "/index/seguros/importacion": "Importación",
    "/index/fianzas/polizas": "Pólizas de fianzas",
    "/index/fianzas/documentoFuente": "Documentos Fuente",
    "/index/seguros/multicotizador": "Multicotizador",
    "/index/administracion/annualgoals": "Metas Anuales",
    "/index/seguros/siniestrocaptura": "Captura de Siniestro",
    "/index/seguros/siniestros": "Siniestros",
    "/index/seguros/siniestros/ClaimCapture": "Captura de Siniestros",
    "/index/seguros/polizas/emision": "Emisión de póliza",
    "/index/seguros/endosos": "Endosos",
    "/index/seguros/polizas/emision/0/": "Emision de la poliza",
    "/index/fianzas/cotizador": "Cotizador",
    "/index/fianzas/endosos": "Endosos",
    "/index/fianzas/endosos/NuevoEndoso": "Registro de endoso",
    "/index/cobranza": "Cobranza",
    "/index/conciliaciones": "Conciliaciones",
    "/index/fianzas/polizas/emision": "Emisión de fianza",
    "/index/fianzas/reclamos": "Reclamos",
  };


  const routeWithParams: { [key: string]: string } = {
    polizas: "Pólizas",
    documentoFuente: "Documentos Fuente",
    //endosos: "endosos",
    siniestros: "Siniestros",
    ClaimCapture: "Captura de Siniestros",
    emision: "Emisión de póliza",
    multicotizador: "Multicotizador",
    quote: "Multicotizador",
    NuevoEndoso: "Registro de endoso"
  };

  const routesRegex: RouteRegex[] = [
    {
      regex: /^\/index\/seguros\/polizas\/PERS-.+$/,
      value: "Pólizas"
    },
    {
      regex: /^\/index\/seguros\/polizas\/emision\/.+\/$/,
      value: "Emisión de póliza"
    },
    {
      regex: /^\/index\/seguros\/polizas\/emision\/.+\/.+\/[01]$/,
      value: "Emisión de póliza"
    },
    {
      regex: /^\/index\/seguros\/polizas\/emision\/0\/.+\/0$/,
      value: "Emisión de póliza"
    },
    {
      regex: /^\/index\/fianzas\/polizas\/.+$/,
      value: "Pólizas"
    },
    {
      regex: /^\/index\/fianzas\/polizas\/emision\/.+\/.+\/[01]$/,
      value: "Emisión de fianza"
    },
    {
      regex: /^\/index\/fianzas\/polizas\/emision\/.+\/$/,
      value: "Emisión de fianza"
    },
    {
      regex: /^\/index\/seguros\/endosos\/POLI-.+$/,
      value: "Endosos"
    },
    {
      regex: /^\/index\/seguros\/endosos\/NuevoEndoso\/.+$/,
      value: "Nuevo endoso"
    },
    {
      regex: /^\/index\/seguros\/siniestros\/.+$/,
      value: "Siniestros"
    },
    {
      regex: /^\/index\/seguros\/siniestros\/ClaimCapture\/.+\/.+$/,
      value: "Captura de siniestro"
    },
    {
      regex: /^\/index\/fianzas\/endosos\/NuevoEndoso\/.+$/,
      value: "Registro de endoso"
    },
    {
      regex: /^\/index\/fianzas\/endosos\/NuevoEndoso\/.+\/.+$/,
      value: "Registro de endoso"
    },
    {
      regex: /^\/index\/seguros\/endosos\/NuevoEndoso\/.+\/.+$/,
      value: "Detalle de endoso"
    },
    {
      regex: /^\/index\/comisiones+$/,
      value: "Comisiones"
    },
    {
      regex: /^\/index\/fianzas\/reclamos\/.+$/,
      value: "Reclamos"
    },
    {
      regex: /^\/index\/seguros\/multicotizador\/quote\/QUOT-.+$/,
      value: "Cotización"
    }
  ];

  // Define a state variable for routeHistory

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const lastCategory =
      routeHistory.length > 0
        ? routeHistory[routeHistory.length - 1].path.split("/")[2]
        : null;

    if (lastCategory && currentCategory !== lastCategory) {
      // Si el usuario navega a una categoría diferente, borra el historial de breadcrumb
      setRouteHistory([
        { path: location.pathname, fullPath: location.pathname }
      ]);
    } else if (routeHistory.length > 0) {
      const currentSegments = location.pathname.split("/");
      const hasParamInHistory = routeHistory.some(
        (item) => item.fullPath === location.pathname
      );

      if (hasParamInHistory) {
        const firstIndex = routeHistory.findIndex(
          (item) => item.fullPath === location.pathname
        );
        setRouteHistory(routeHistory.slice(0, firstIndex + 1));
      } else if (currentSegments.length >= 5) {
        const specialRoutes = specialCategories[currentCategory];
        const indexOfSegment = 2 + routeHistory.length;
        let routeToAdd;

        if (
          currentSegments[3] &&
          currentSegments[3].includes("multicotizador")
        ) {
          routeToAdd = ["multicotizador"];
        } else {
          routeToAdd = specialRoutes
            ? specialRoutes
            : [currentSegments[indexOfSegment]];
        }

        setRouteHistory([
          ...routeHistory,
          { path: routeToAdd[0], fullPath: location.pathname }
        ]);
      } else {
        setRouteHistory([
          { path: location.pathname, fullPath: location.pathname }
        ]);
      }
    } else {
      setRouteHistory([
        { path: location.pathname, fullPath: location.pathname }
      ]);
    }
  }, [location.pathname]);

  const redirectToRoute = (pathname: string) => {
    navigate(pathname);
  };

  const getRouteName = (pathname: string) => {
    const routeName = routeNames[pathname];
    if (routeName) {
      return routeName;
    }

    const routeNameWithParam = routeWithParams[pathname];
    if (routeNameWithParam) {
      return routeNameWithParam;
    }

    for (const route of routesRegex) {
      if (route.regex.test(pathname)) {
        return route.value;
      }
    }

    return "Desconocido";
  };

  const textStyle = {
    color: "#E5105D",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "none"
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index >= 0 && index < routeHistory.length - 1) {
      const targetPath = routeHistory[index];
      navigate(targetPath.fullPath);
      setRouteHistory((prevHistory) => prevHistory.slice(0, index));
    }
  };

  const findSelectedBreadcrumbIndex = () => {
    const currentPath = location.pathname;
    return routeHistory.findIndex((path) => path.path === currentPath);
  };

  return (

    <div style={{ marginTop: "80px" }}>
      {routeHistory.length > 0 && (
        <>
          <Link to="/index" style={textStyle}>
            Home
          </Link>
          {" > "}
        </>
      )}
      {currentCategory && !specialCategories[currentCategory] && (
        <>
          <span style={textStyle}>
            {currentCategory &&
              currentCategory.charAt(0).toUpperCase() +
              currentCategory.slice(1)}
          </span>
          {routeHistory.length > 0 ? " > " : ""}
        </>
      )}
      {routeHistory.map((pathname, index) => {
        const routeName = getRouteName(pathname.fullPath);
        if (routeName) {
          return (
            <span key={index}>
              {index >= 1 && " > "}
              <span
                onClick={() => navigateToBreadcrumb(index)}
                style={textStyle}>
                {routeName}
              </span>
            </span>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default RouteHistory;
