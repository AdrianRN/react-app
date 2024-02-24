import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import LogoutImg from './img/Logo-logout.svg'

import './css/styles.css';
import './css/onesta-font.css';
import './css/bootstrap-grid.min.css';

export default function LogOut() {

    const navigate = useNavigate();

    const BackHome = () => {
         navigate('/')
    }

    return (
        <div className="html mh-100">
            <div className="body mh-100">
                <div className="row mb-3 justify-content-center h-100 w-100" >
                    <div className="col-6 mt-auto mb-auto">
                        <div className="card p-5">
                            <div className="card-body d-flex flex-column text-algin-center align-items-center">
                                <div>
                                    <img className="img-logout m-auto" src={LogoutImg}/>
                                </div>
                                <div className="pt-3">
                                    <h2>¡Gracias por utilizar Onesta One!</h2>
                                </div>
                                <div className="pt-4">
                                    <button type="button" onClick={() => BackHome()} className="btn btn-primary btn-onesta mr-2 align-items-center"><i className="icon-Home"></i> Volver al inicio</button>
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
}