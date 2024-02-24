import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Typography } from '../../OuiComponents/DataDisplay';
import { ColorPink, TextXSmallFont } from '../../OuiComponents/Theme';


const breadcrumbLabels: { [key: string]: string } = {
  '/index': 'Home',
  '/seguros/customers': 'People',
  '/seguros/prospectos': 'Prospectos',
  '/administracion/usuarios': 'Usuarios',
  '/administracion/catalogos': 'Catalogs',
  '/administracion/personas': 'Personas',
  '/administracion/comunicados': 'Communications',
  '/administracion/customers': 'Consulta de clientes',
  '/administracion/companias': 'Companies',
  '/seguros/clientes': 'Clientes',
  '/seguros/polizas':'Pólizas',
  '/fianzas/clientes': 'Clientes',
  '/seguros/importacion':'Importación',
  '/fianzas/polizas': 'Polizas',
  '/fianzas/documentoFuente': 'Consulta de Documentos Fuente',
  //'/administracion/companias':'Compañias'
  // Add more entries as needed
};

function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment !== '');

  const breadcrumbTrail = [];
  let currentPath = '';

  for (let index = 0; index < pathSegments.length; index++) {
    const segment = pathSegments[index];
    currentPath += `/${segment}`;
    const fullPath = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = breadcrumbLabels[currentPath];

    if (label) {
      breadcrumbTrail.push({ label, path: fullPath, currentPath });
      currentPath = '';
    }
  }

  return (
    <div>
      {breadcrumbTrail.map((breadcrumb, index) => (
        <span key={breadcrumb.path}>
          
          {breadcrumb.path === location.pathname ? (
            
              breadcrumb.label
              
          ) : (
            <Link to={breadcrumb.path}>{breadcrumb.label}</Link>
          )}
          
          {index < breadcrumbTrail.length - 1 && ' > '}
         
        </span>
      ))}
    </div>
  );
}

export default Breadcrumbs;
