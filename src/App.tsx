import React from "react";
import {
  BrowserRouter,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./App.css";
import AnnualGoals from "./components/General/Admin/AnnualGoals/AnnualGoals";
import Catalogs from "./components/General/Admin/Catalogs/Catalogs";
import Communications from "./components/General/Admin/Communications/Comms";
import Company from "./components/General/Admin/Company/Company";
import CreatePerson from "./components/General/Admin/People/CreatePerson";
import People from "./components/General/Admin/People/People";
import Users from "./components/General/Admin/Users/Users";
import Home from "./components/General/Home/Home";
import Layout from "./components/General/Layout/Layout";
import LogOut from "./components/General/LogOut/LogOut";
import OuiView from "./components/General/OuiView/OuiView";
import PolicyLoad from "./components/General/PolicyLoad/PolicyLoad";
import Customers from "./components/General/Seguros/Customers/Customers";
import Policies from "./components/General/Seguros/Policies/Policies";
import Prospects from "./components/General/Seguros/Prospects/Prospects";
import Status from "./components/General/Status/Status";
import CustomersSureties from "./components/General/Sureties/CustomersSureties/CustomersSureties";
import Login from "./components/General/login/login";
import Template from "./components/Template/Template";
import HeaderPolicie from "./components/General/Seguros/Policies/HeaderPolicies";
import SourceDocument from "./components/General/Sureties/SourceDocument/SourceDocument";
import { MultiCotizador } from "./components/General/Seguros/Cotizador/MultiCotizador";
import SuretiesPolicies from "./components/General/Sureties/Policies/SuretyPolicies";
import Endorsement from "./components/General/Seguros/Endorsement/Endorsement";
import BondEndorsement from "./components/General/Sureties/Endorsement/Endorsement";
import Claims from "./components/General/Seguros/Claims/Claims";
import ClaimCapture from "./components/General/Seguros/ClaimCapture/ClaimCapture";
import ProtectedRoutes from "./components/router/protectedRoutes";
import HeaderBondPolicy from "./components/General/Sureties/Policies/HeaderBondPolicy";
import NewEndorsement from "./components/General/Seguros/Endorsement/NewEndorsement";
import QuoteTabs from "./components/General/Seguros/Cotizador/QuoteTabs";
import BondEndorsementTabs from "./components/General/Sureties/Endorsement/BondEndorsementTabs";
import Consultation from "./components/General/Collection/Consultation/Consultation";
import TabModalReceiptDetails from "./components/General/Collection/ReceiptDetails/TabModalReceiptDetails";
import Reconciliations from "./components/General/Reconciliations/Reconciliations";

//import ErrorBoundary from './errorHandling/ErrorBoundary';
import NotFound from "./components/General/NotFound/NotFound";
import ReactErrorBoundary from  "./components/General/Error/ReactErrorBoundary";
import ErrorPage from "./components/General/Error/ErrorPage";
import Comisiones from "./components/General/Comisiones/Comisiones";
import ClaimsSureties from "./components/General/Sureties/Claims/ClaimsSureties";

import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles/custom-toast-container.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    
    <>
      <Route index element={ <ReactErrorBoundary><Login /> </ReactErrorBoundary>} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/index" element={ <ReactErrorBoundary><Layout /></ReactErrorBoundary>}>
          <Route index element={ <ReactErrorBoundary><Home /></ReactErrorBoundary>} />
          <Route path="prospectos" element={ <ReactErrorBoundary><Prospects /></ReactErrorBoundary>} />
          <Route path="seguros/clientes" element={<ReactErrorBoundary><Customers /></ReactErrorBoundary>} />
          <Route path="seguros/polizas" element={ <ReactErrorBoundary><Policies /></ReactErrorBoundary>} />
          <Route path="seguros/polizas/emision" element={<ReactErrorBoundary><HeaderPolicie /></ReactErrorBoundary> } />
          <Route path="seguros/polizas/emision/:clientId?/:polizaId?/:modifyble?" element={<ReactErrorBoundary><HeaderPolicie /></ReactErrorBoundary>} />
          <Route path="seguros/prospectos" element={<ReactErrorBoundary><Prospects /></ReactErrorBoundary>} />
          <Route path="seguros/importacion" element={<ReactErrorBoundary><PolicyLoad /></ReactErrorBoundary>} />
          <Route path="seguros/endosos/:policyId?" element={ <ReactErrorBoundary><Endorsement /></ReactErrorBoundary>     } />
          <Route path="seguros/endosos/NuevoEndoso/:policyId?" element={ <ReactErrorBoundary><NewEndorsement /></ReactErrorBoundary>} />
          <Route path="seguros/endosos/NuevoEndoso/:policyId?/:endorsementId?" element={ <ReactErrorBoundary><NewEndorsement /></ReactErrorBoundary>} />
          <Route path="seguros/siniestros/:policyId?" element={ <ReactErrorBoundary><Claims /></ReactErrorBoundary>} />
          <Route path="seguros/siniestros/ClaimCapture/:policyId?" element={ <ReactErrorBoundary><ClaimCapture /></ReactErrorBoundary>} />
          <Route path="seguros/prospectos" element={ <ReactErrorBoundary><Prospects /></ReactErrorBoundary> } />
          <Route path="seguros/cotizador" element={ <ReactErrorBoundary><QuoteTabs /></ReactErrorBoundary>} />
          <Route path="seguros/multicotizador" element={ <ReactErrorBoundary><MultiCotizador /></ReactErrorBoundary>} />
          <Route path="seguros/multicotizador/:ownerId?" element={ <ReactErrorBoundary><MultiCotizador /></ReactErrorBoundary> } />
          <Route path="seguros/multicotizador/quote/:quoteId?" element={  <ReactErrorBoundary><MultiCotizador /></ReactErrorBoundary>} />
          <Route path="seguros/polizas/:personId?" element={ <ReactErrorBoundary><Policies /></ReactErrorBoundary> } />
          <Route path="fianzas/cotizador" element={ <ReactErrorBoundary><QuoteTabs /></ReactErrorBoundary>} />
          <Route path="fianzas/clientes" element={  <ReactErrorBoundary><CustomersSureties /></ReactErrorBoundary> } />
          <Route path="fianzas/polizas/:personId?" element={  <ReactErrorBoundary><SuretiesPolicies /></ReactErrorBoundary>} />
          <Route path="fianzas/polizas/emision" element={ <ReactErrorBoundary><HeaderBondPolicy /></ReactErrorBoundary> } />
          <Route path="fianzas/polizas/emision/:personId?/:policyId?/:modifyble?" element={<ReactErrorBoundary><HeaderBondPolicy /></ReactErrorBoundary>} />
          <Route path="fianzas/endosos/:bondFolio?" element={ <ReactErrorBoundary><BondEndorsement /></ReactErrorBoundary>} />
          <Route path="fianzas/endosos/NuevoEndoso/:bondFolio?/:bondEndorsementFolio?" element={ <ReactErrorBoundary><BondEndorsementTabs /></ReactErrorBoundary>  } />
          <Route path="fianzas/documentoFuente/:clientId?" element={  <ReactErrorBoundary><SourceDocument /></ReactErrorBoundary>} />
          <Route path="fianzas/reclamos/:bondFolio?" element={ <ReactErrorBoundary><ClaimsSureties /></ReactErrorBoundary>} />


          <Route path="conciliaciones" element={<ReactErrorBoundary><Reconciliations/></ReactErrorBoundary>}/>
          <Route path="comisiones" element={  <ReactErrorBoundary><Comisiones /></ReactErrorBoundary>} />

          <Route path="cobranza" element={  <ReactErrorBoundary><Consultation /></ReactErrorBoundary>} />
          <Route path="cobranza/detalleRecibo" element={ <ReactErrorBoundary><TabModalReceiptDetails /></ReactErrorBoundary>} />

          <Route path="users" element={ <ReactErrorBoundary><Users /></ReactErrorBoundary>} />
          <Route path="catalogos" element={ <ReactErrorBoundary><Catalogs /></ReactErrorBoundary>} />
          <Route path="NewPerson" element={ <ReactErrorBoundary><CreatePerson /></ReactErrorBoundary>} />
          <Route path="administracion/usuarios" element={  <ReactErrorBoundary><Users /></ReactErrorBoundary>} />
          <Route path="administracion/catalogos" element={  <ReactErrorBoundary><Catalogs /></ReactErrorBoundary>} />
          <Route path="administracion/personas" element={ <ReactErrorBoundary><People /></ReactErrorBoundary>} />
          <Route path="administracion/companias" element={ <ReactErrorBoundary><Company /></ReactErrorBoundary>} />
          <Route path="administracion/personas/NewPerson/:personId?" element={  <ReactErrorBoundary><CreatePerson /></ReactErrorBoundary>} />
          <Route path="administracion/comunicados" element={  <ReactErrorBoundary><Communications /></ReactErrorBoundary>} />
          <Route path="administracion/annualgoals" element={    <ReactErrorBoundary><AnnualGoals /></ReactErrorBoundary>  } />
          <Route path="seguros/prospectos" element={ <ReactErrorBoundary><Prospects /></ReactErrorBoundary>} />
          <Route path="seguros/siniestrocaptura" element={  <ReactErrorBoundary><Claims /></ReactErrorBoundary>} />
          <Route path="template" element={  <ReactErrorBoundary><Template /></ReactErrorBoundary>} />
        </Route>

        <Route path="logout" element={  <ReactErrorBoundary><LogOut /></ReactErrorBoundary>} />
      </Route>
      <Route path="*" element={     <ReactErrorBoundary><NotFound /></ReactErrorBoundary> } />
      <Route path="error" element={     <ReactErrorBoundary><ErrorPage /></ReactErrorBoundary> } />
      <Route path="status" element={ <ReactErrorBoundary><Status /></ReactErrorBoundary>} />
      <Route path="oui" element={ <ReactErrorBoundary><OuiView /></ReactErrorBoundary>} />
    </>
    
  )
);
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer                
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        transition={Bounce}
        closeButton={false}
        limit={3}
      />
    </>
  );
};

export default App;
