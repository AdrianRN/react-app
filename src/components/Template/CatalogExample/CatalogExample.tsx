import React, { useEffect, useState } from 'react';
import { getCatalogs } from '../../../services/catalog.service';
import {  Catalog } from '../../../models/Catalog';
import ResultObject from '../../../models/ResultObject';



function CatalogList() {
    const [catalogs, setCatalogs] =  useState<Catalog[]>([]);
    useEffect(() => {
        async function fetchData() {
            try{
                const response = await getCatalogs();
                setCatalogs( prevCatalogs => response?.data || prevCatalogs);
            }catch{
                //Manejo de errores
            }
        }
        fetchData();
    }, []);

    return  <div>
        <h2>Lista de Catalogs</h2>
      
        {    catalogs.map(  (catalog, index) =>(
              <p>{catalog.description}</p>
        ))} 
      

    </div>  ;
}


export default CatalogList;