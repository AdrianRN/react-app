import React, { useEffect, useState } from "react";
import { MenuItem } from "../../../OuiComponents/Navigation";
import Button from "../../../OuiComponents/Inputs/Button";
import * as Yup from "yup";
import { useFormik } from "formik";
import Select from "../../../OuiComponents/Inputs/Select";
import { Checkbox, Switch, TextField, ToggleButton } from "../../../OuiComponents/Inputs";
import { ListItemIcon, Typography } from "../../../OuiComponents/DataDisplay";
import {
  ArrowRight,
  Cancel,
  CarIcon,
  FemaleIcon,
  MaleIcon,
} from "../../../OuiComponents/Icons";
import { ToggleButtonGroup } from "../../../OuiComponents/Inputs";
import { Avatar } from "../../../OuiComponents/DataDisplay";
import SelectedOptionSeguro from "./SelectedOptionSeguro";
import {
  ColorPureWhite,
  ColorWhite,
  LinkLargeFont,
  LinkMediumBoldFont,
  LinkMediumFont,
  TextMediumBoldWhiteFont,
  TextSmallBlackFont,
  TextSmallFont,
} from "../../../OuiComponents/Theme";
import CatalogValue from "../../../../models/CatalogValue";
import ChubbVehicles, { ChubbVehicle } from "../../../../models/ChubbVehicles";
import {
  getChubbVehicleCacheByYear,
} from "../../../../services/chubbvehicles.service";
import cotizacionService from "../../../../services/cotizacion.service";
import { Paper } from "../../../OuiComponents/Surfaces";
import CoberturasModal from "./CoberturasModal";
import CompaniesService from "../../../../services/companies.service";
import FormatData from "../../../../utils/Formats.Data";
import People from "../../../../models/People";
import PeopleService from "../../../../services/people.service";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Dialog } from "../../../OuiComponents/Feedback";
import IconButton from "@mui/material/IconButton/IconButton";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import Grid from "../../../OuiComponents/Layout/Grid";
import Title from "../../Title/Title";
import { SIZE_WEB_URL } from "../../../../enviroment/enviroment";
import { Autocomplete, Box } from "@mui/material";
import Quote, { IQuote } from "../../../../models/Quote";
import QuotesService from "../../../../insuranceServices/quotes.service";
import ChubbCatalogVehicleService from "../../../../insuranceServices/chubbCatalogVehicles.service";
import Companies from "../../../../models/Companies";
import CacheService from "../../../../services/cache.service";
import CacheCatalogValue from "../../../../models/CacheCatalogValue";
import MessageBar from "../../../OuiComponents/Feedback/MessageBar";
import { useAlertContext } from "../../../../context/alert-context";
import HDIInsuranceService from "../../../../insuranceServices/HDI.service";
import HDIQuote, { HDICotizacion } from "../../../../insuranceModels/HDICotizacion";
import chubbInsuranceService from "../../../../insuranceServices/chubbInsurance.service";
import ChubbIssuance from "../../../../models/ChubbIssuance";
import ChubbPerson from "../../../../models/ChubbPerson";
import Constants from "../../../../utils/Constants";
import { createPackageKey, formatDeductible, formatMoney } from "./packageUtils";
import CompararModal from "./CompararModal";
import CompanyStatus from "./CompanyStatus";
import LoadingScreen from "../../../OuiComponents/Utils/LoadingScreen";
import { showToast } from "../../../OuiComponents/Feedback/CustomToast";

export interface Cobertura {
  description: string;
  sumAssured: string;
  deductibleValue: string;
  premiumAmount: number;
}

export interface Status {
  insurance: string;
  status: boolean;
  logo: string;
}

export interface Packet {
  CotizacionId: number;
  VersionId: number;
  Type: string;
  FinVigencia: string;
  Terceros: any;
  GastosMedicos: any;
  PagoAnual: any;
  Coberturas: Cobertura[];
  Icon: string;
  Insurer: string;
}

interface InsuranceItemProps {
  item: Packet;
}

export function MultiCotizador() {
  const {
    isSnackbarOpen,
    severity,
    messageAlert,
    autoHideDuration,
    handleSnackbarClose,
    setDataAlert,
  } = useAlertContext();
  const { ownerId } = useParams();
  const { quoteId } = useParams();

  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<
    "Auto" | "Vida" | "GM" | "Danos" | "Ahorro"
  >("Auto");
  const [selectedPacket, setSelectedPacket] = useState<
    "Amplia" | "Limitada" | "RC"
  >("Amplia");
  const [selectedModel, setSelectedModel] = useState<ChubbVehicles>();
  const [TypeSeguro, setTypeSeguro] = React.useState<CacheCatalogValue>();
  const [TypePayment, setTypePayment] = React.useState<CacheCatalogValue>();
  const [OriginVehicle, setOriginVehicle] = React.useState<CacheCatalogValue>();
  const [CivilStatus, setCivilStatus] = React.useState<CacheCatalogValue>();
  const [InsuranceCompany, setInsuranceCompany] = React.useState<Companies[]>([]);
  const [InsuranceCompaniesStatus, setInsuranceCompaniesStatus] = React.useState<Status[]>([]);
  const [modelData, setModelData] = React.useState<ChubbVehicles[]>([]);
  const [fechaCotizacion, setFechaCotizacion] = React.useState<Date>();
  const [loadingOwner, setLoadingOwner] = React.useState(false);
  const [selectedOwner, setSelectedOwner] = useState<People>();
  const [loadingDriver, setLoadingDriver] = React.useState(false);
  const [selectedDriver, setSelectedDriver] = useState<People>();
  const [peopleData, setPeopleData] = React.useState<People[]>([]);
  const [packet, setPacket] = useState<Packet>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [amplia, setAmplia] = useState<Packet[]>([]);
  const [limitada, setLimitada] = useState<Packet[]>([]);
  const [RC, setRC] = useState<Packet[]>([]);
  const [loadingVehicle, setLoadingVehicle] = React.useState(false);
  const [isContratarModalOpen, setIsContratarModalOpen] = useState(false);
  const [cotizar, setCotizar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isIssued, setIsIssued] = useState(false);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") ?? "");
  const [hdiError, setHdiError] = useState("");
  const [chubbError, setChubbError] = useState("");


  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const handleCompareButton = () => {
    setIsCompareModalOpen(true);
  };

  const getSelectedPackages = () => {
    const combinedPackages = [...amplia, ...limitada, ...RC];
    return combinedPackages.filter(pkg => selectedPackages[createPackageKey(pkg)]);
  };

  const currentYear = new Date().getFullYear();
  const yearRange = Array.from(
    { length: currentYear - 1949 },
    (_, index) => 1950 + index
  );
  yearRange.reverse();

  const initialValues = {
    tipoSeguro: selectedOption,
    gender: Constants.folioMalePerson,
    duracionSeguro: "",
    condicionAuto: "",
    vehicleFolio: "",
    tipoAuto: Constants.folioNationalCar,
    ano: 0,
    modelo: '',
    vin: '',
    owner: ownerId ? ownerId : '',
    driver: '',
    institucionFinanciera: '',
    fechaInicioPoliza: '',
    vigenciaSeguro: '',

    fechaNacimientoOwner: '',
    genderOwner: Constants.folioMalePerson,
    nombreOwner: '',
    apellidoPaternoOwner: '',
    apellidoMaternoOwner: '',
    calleOwner: '',
    numeroExteriorOwner: '',
    numeroInteriorOwner: '',
    codigoPostalOwner: '',
    correoElectronicoOwner: '',
    telefonoOwner: '',
    estadoCivilOwner: '',

    fechaNacimiento: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    codigoPostal: '',
    correoElectronico: '',
    telefono: '',
    estadoCivil: '',

    serie: '',
    placa: '',
    motor: '',
  };

  const [preloadedValues, setPreloadedValues] = useState(initialValues);

  const currentDate = new Date();
  const nextYearDate = new Date();
  nextYearDate.setFullYear(currentDate.getFullYear() + 1);

  const [cotizacionObject, setCotizacionObject] = useState({
    cotizacionId: 0,
    versionId: 0,
    datosGenerales: {
      negocioId: 7190,
      agenteId: 93300,
      conductoId: "0",
      tarifaId: 200,
      inicioVigencia: currentDate.toISOString().substr(0, 10),
      finVigencia: nextYearDate.toISOString().substr(0, 10),
      productoId: 1,
      agrupacionId: 208802,
      tipoCalculoId: 1,
      formasPago: [
        {
          id: 12,
        },
      ],
      monedaId: 1,
    },
    incisos: [
      {
        tipoRiesgoId: 1,
        PorcentajeDescuento: 95,
        vehiculo: {
          vehiculoId: 0,
          modelo: 0,
          codigoPostal: 64460,
          usoId: 1,
          tipoSumaAseguradaId: 1,
        },
        paquetes: [
          {
            id: 1,
          },
          {
            id: 2,
          },
          {
            id: 3,
          },
        ],
      },
    ],
  });

  const genderOptions = [
    { folio: Constants.folioMalePerson, label: "Masculino", icon: <MaleIcon /> },
    { folio: Constants.folioFemalePerson, label: "Femenino", icon: <FemaleIcon /> },
  ];

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data: any) => {
    console.log("Se mando al Multicotizador");
    console.log(data);
  };

  const getFormaPago = (duracionSeguro: string) => {
    switch (duracionSeguro) {
      case 'CAVA-234':
        return 12;
      case 'CAVA-235':
        return 2;
      case 'CAVA-236':
        return 1;
      case 'CAVA-252':
        return 6;
      case 'CAVA-302':
        return 3;
      default:
        return 12;
    }
  };

  const packetsChubb = async () => {
    const formaPago = getFormaPago(values.duracionSeguro);
    setCotizacionObject((prevCotizacionObject) => {
      return {
        ...prevCotizacionObject,
        datosGenerales: {
          ...prevCotizacionObject.datosGenerales,
          formasPago: [
            {
              id: formaPago,
            },
          ],
        },
      };
    });
    cotizacionObject.datosGenerales.formasPago[0].id = formaPago;
    cotizacionObject.incisos[0].vehiculo.codigoPostal = parseInt(values.codigoPostalOwner);

    const Insurer = Constants.chubbInsuranceName;

    const insuranceCompany = InsuranceCompany.find(
      (company: any) => company.corporateName.toString().toUpperCase().includes(Insurer.toUpperCase())
    );

    const targetFolioId = insuranceCompany?.folio;

    const Icon = insuranceCompany?.logo ?? "";

    const cotizacionResponse = await cotizacionService.getCotizacion(cotizacionObject);
    const cotizacion = cotizacionResponse.data;

    if (cotizacion.data.isSuccess === false || cotizacion.status === 404 || cotizacion.status === 500 || cotizacion.status === 400) {
      const status: Status = { status: false, insurance: targetFolioId!, logo: Icon };
      setInsuranceCompaniesStatus(prevStatuses => [...prevStatuses, status]);
      const chubbErrorMessage: string = cotizacion.message?.toString()!;
      setChubbError(chubbErrorMessage);
    } else {
      const status: Status = { status: true, insurance: targetFolioId!, logo: Icon };
      setInsuranceCompaniesStatus(prevStatuses => [...prevStatuses, status]);
    }

    const incisos = cotizacion.data?.responseData?.incisos ?? null;
    const CotizacionId = cotizacion.data?.responseData?.cotizacionId;

    const newPacketsData: Packet[] = [];

    if (incisos) {

      incisos.forEach((inciso: any) => {
        const paquetes = inciso.paquetes;

        if (paquetes && paquetes.length > 0) {
          paquetes.forEach((Packet: any) => {
            const coverages = Packet.formasPago[0].coberturas;
            const VersionId = Packet.versionId;
            const FinVigencia = Packet.formasPago[0].recibos[0].fechaLimitePago;
            const Coberturas: Cobertura[] = [];

            let Terceros: string = "";
            let GastosMedicos: string = "";
            const roundedTotalPremium = parseFloat(Packet.primaNetaMonto.toFixed(2));
            let PagoAnual = roundedTotalPremium;
            let Type: string = "Amplia";

            if (Packet.id === 1) Type = "Amplia";
            else if (Packet.id === 2) Type = "Limitada";
            else if (Packet.id === 3) {
              Type = "RC";
            }

            coverages.forEach((item: any) => {
              const sumaAsegurada = formatMoney(item.sumaAsegurada.toString());
              if (
                item.descripcion === "RESPONSABILIDAD CIVIL POR DAÑOS A TERCEROS"
              ) {
                Terceros = sumaAsegurada;
              } else if (item.descripcion === "GASTOS MÉDICOS OCUPANTES" || item.descripcion === 'RESPONSABILIDAD CIVIL PERSONAS') {
                GastosMedicos = sumaAsegurada;
              }
              const newCobertura: Cobertura = {
                description: item.descripcion,
                sumAssured: sumaAsegurada,
                deductibleValue: item.deducibleDescripcion,
                premiumAmount: item.primaTotalMonto,
              };

              Coberturas.push(newCobertura);
            });

            newPacketsData.push({
              CotizacionId,
              VersionId,
              Type,
              FinVigencia,
              Terceros,
              GastosMedicos,
              PagoAnual,
              Coberturas,
              Icon,
              Insurer,
            });
          });
        }
      });

      const ampliaPackets = newPacketsData.filter(
        (packet: any) => packet.Type === "Amplia"
      );
      const limitadaPackets = newPacketsData.filter(
        (packet: any) => packet.Type === "Limitada"
      );
      const RCPackets = newPacketsData.filter(
        (packet: any) => packet.Type === "RC"
      );

      setAmplia((prevAmplia) => [...prevAmplia, ...ampliaPackets]);
      setLimitada((prevLimitada) => [...prevLimitada, ...limitadaPackets]);
      setRC((prevRC) => [...prevRC, ...RCPackets]);

    }

    //setIsLoading(false);
    return newPacketsData;
  };



  const _ = require('lodash');

  const getHDI = async () => {
    HDIQuote.DEFAULT_HDI_QUOTE_VALUES.body.packagesRequest.validity.initial = currentDate.toISOString();
    HDIQuote.DEFAULT_HDI_QUOTE_VALUES.body.packagesRequest.validity.final = nextYearDate.toISOString();

    const amplia = _.cloneDeep(HDIQuote.DEFAULT_HDI_QUOTE_VALUES);
    const limitada = _.cloneDeep(HDIQuote.DEFAULT_HDI_QUOTE_VALUES);
    const RC = _.cloneDeep(HDIQuote.DEFAULT_HDI_QUOTE_VALUES);

    limitada.body.packagesRequest.packagesWithChanges.coveragePackagesRequest.key = 21;
    RC.body.packagesRequest.packagesWithChanges.coveragePackagesRequest.key = 22;

    limitada.body.packagesRequest.vehicleData.additionalData.circulationPostalCode = values.codigoPostalOwner;
    amplia.body.packagesRequest.vehicleData.additionalData.circulationPostalCode = values.codigoPostalOwner;
    RC.body.packagesRequest.vehicleData.additionalData.circulationPostalCode = values.codigoPostalOwner;

    const [
      ampliaPackets,
      limitadaPackets,
      RCPackets,
    ] = await Promise.all([
      packetsHDI(_.cloneDeep(amplia), 'Amplia'),
      packetsHDI(_.cloneDeep(limitada), 'Limitada'),
      packetsHDI(_.cloneDeep(RC), 'RC'),
    ]);

    const HDIPackets = ampliaPackets.concat(limitadaPackets, RCPackets);

    //setIsLoading(false);
    return HDIPackets;
  };


  const updateInsuranceStatus = (newStatus: Status) => {
    setInsuranceCompaniesStatus(prevStatuses => {
      const index = prevStatuses.findIndex(status => status.insurance === newStatus.insurance);
      if (index === -1) {
        //setIsLoading(false);
        return [...prevStatuses, newStatus];
      } else {
        return prevStatuses.map((status, idx) => idx === index ? newStatus : status);
      }
    });
  };

  const packetsHDI = async (hdiQuote: HDICotizacion, type: string) => {
    const responseData = await HDIInsuranceService.postHDIInsurance(hdiQuote);

    const Insurer = Constants.hdiInsuranceName;

    const insuranceCompany = InsuranceCompany.find(
      (company: any) => company.corporateName.toString().toUpperCase().includes(Insurer.toUpperCase())
    );

    const targetFolioId = insuranceCompany?.folio;

    const Icon = insuranceCompany?.logo ?? "";

    if (responseData.status === 404 || responseData.status === 500 || responseData.status === 400) {
      const status: Status = { status: false, insurance: targetFolioId!, logo: Icon };
      updateInsuranceStatus(status);
      const hdiErrorMessage: string = responseData?.message?.toString()!;
      setHdiError(hdiErrorMessage);
    } else {
      const status: Status = { status: true, insurance: targetFolioId!, logo: Icon };
      updateInsuranceStatus(status);
    }

    if (!responseData || !responseData.data) {
      return [];
    }

    const { key, description, mandatoryCoverages, validity, optionalMandatoryCoverages,
      optionalCoverages, totals, receipts, adjustments } = responseData.data;

    const packetsData: Packet[] = [];
    const Type = type;
    const FinVigencia = validity.finalDate;

    const roundedTotalPremium = parseFloat(totals.totalPremium.toFixed(2));
    const PagoAnual = roundedTotalPremium;

    let Terceros = '';
    let GastosMedicos = '';
    let Coberturas: Cobertura[] = [];

    const processCoverages = (coverages: any[]): Cobertura[] => {
      return coverages.map((coverage: any) => {
        const sumAssured = formatMoney(coverage.coverageSumAssured);
        if (coverage.coverageDescription === 'Responsabilidad Civil (Límite Único y Combinado)') {
          Terceros = sumAssured;
        }
        else if (coverage.coverageDescription === 'Gastos Médicos Ocupantes (Límite Único Combinado)') {
          GastosMedicos = sumAssured;
        }

        const roundedNetPremium = parseFloat(coverage.netPremium.toFixed(2));

        return {
          description: coverage.coverageDescription,
          sumAssured: sumAssured,
          deductibleValue: coverage.deductible.toString(),
          premiumAmount: roundedNetPremium,
        };
      });
    };

    if (mandatoryCoverages && mandatoryCoverages.coverages) {
      Coberturas = Coberturas.concat(processCoverages(mandatoryCoverages.coverages));
    }

    if (optionalMandatoryCoverages && optionalMandatoryCoverages.coverages) {
      Coberturas = Coberturas.concat(processCoverages(optionalMandatoryCoverages.coverages));
    }

    if (optionalCoverages && optionalCoverages.coverages) {
      Coberturas = Coberturas.concat(processCoverages(optionalCoverages.coverages));
    }

    packetsData.push({
      Type,
      FinVigencia,
      Terceros,
      GastosMedicos,
      PagoAnual,
      Coberturas,
      Icon: Icon,
      Insurer: Insurer,
      CotizacionId: 0,
      VersionId: 0
    });

    if (Type === 'Amplia') {
      setAmplia((prevAmplia) => [...prevAmplia, ...packetsData]);
    }
    else if (Type === 'Limitada') {
      setLimitada((prevLimitada) => [...prevLimitada, ...packetsData]);
    }
    else if (Type === 'RC') {
      setRC((prevRC) => [...prevRC, ...packetsData]);
    }

    return packetsData;
  };


  // Define custom validation functions
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const phoneRegex = /^[0-9]{10}$/;
  const postalCodeRegex = /^[0-9]{5}$/;

  const validationSchema = Yup.object().shape({
    condicionAuto: Yup.string().required("Este campo es requerido."),
    duracionSeguro: Yup.string().required("Este campo es requerido."),
    tipoAuto: Yup.string().required("Este campo es requerido."),
    ano: Yup.number().required("Este campo es requerido."),
    modelo: Yup.string().required("Este campo es requerido."),
    owner: Yup.string().required("Este campo es requerido."),
    driver: Yup.string().required("Este campo es requerido."),
    institucionFinanciera: Yup.string().required("Este campo es requerido."),
    fechaInicioPoliza: Yup.string().required("Este campo es requerido."),
    vigenciaSeguro: Yup.string().required("Este campo es requerido."),

    fechaNacimientoOwner: Yup.string().required("Este campo es requerido."),
    nombreOwner: Yup.string().required("Este campo es requerido."),
    apellidoPaternoOwner: Yup.string().required("Este campo es requerido."),
    apellidoMaternoOwner: Yup.string().required("Este campo es requerido."),
    calleOwner: Yup.string().required("Este campo es requerido."),
    numeroInteriorOwner: Yup.string().required("Este campo es requerido."),
    codigoPostalOwner: Yup.string()
      .required("Este campo es requerido.")
      .matches(postalCodeRegex, 'Código postal no válido'),
    correoElectronicoOwner: Yup.string()
      .required("Este campo es requerido.")
      .email('Correo electrónico no válido')
      .test('email', 'Correo electrónico no válido', (value) => {
        return emailRegex.test(value);
      }),
    telefonoOwner: Yup.string()
      .required("Este campo es requerido.")
      .matches(phoneRegex, 'Número de teléfono no válido'),
    estadoCivilOwner: Yup.string().required("Este campo es requerido."),

    fechaNacimiento: Yup.string().required("Este campo es requerido."),
    nombre: Yup.string().required("Este campo es requerido."),
    apellidoPaterno: Yup.string().required("Este campo es requerido."),
    apellidoMaterno: Yup.string().required("Este campo es requerido."),
    calle: Yup.string().required("Este campo es requerido."),
    numeroInterior: Yup.string().required("Este campo es requerido."),
    codigoPostal: Yup.string()
      .required("Este campo es requerido.")
      .matches(postalCodeRegex, "Código postal no válido"),
    correoElectronico: Yup.string()
      .required("Este campo es requerido.")
      .email("Correo electrónico no válido")
      .test("email", "Correo electrónico no válido", (value) => {
        return emailRegex.test(value);
      }),
    telefono: Yup.string()
      .required("Este campo es requerido.")
      .matches(phoneRegex, "Número de teléfono no válido"),
    vehicleFolio: Yup.string().required("Este campo es requerido."),
    vin: Yup.string()
      .required("Este campo es requerido.")
      .matches(vinRegex, 'VIN no válido'),
    estadoCivil: Yup.string().required("Este campo es requerido."),

    serie: Yup.string().required("Este campo es requerido."),
  });

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    setFieldValue,
    setFieldError,
    isValid,
    setFieldTouched
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true
  });


  React.useEffect(() => {
    const fetchData = async () => {
      const peopleDataResponse = await PeopleService.getAll();
      setPeopleData(peopleDataResponse.data);

      const restTypeSeguro = await CacheService.getByFolioCatalog(Constants.insuranceTypeFolio);
      setTypeSeguro(restTypeSeguro.data);

      const restTypePayment = await CacheService.getByFolioCatalog(Constants.paymentFrequencyCatalogFolio);
      setTypePayment(restTypePayment.data);

      const restOriginVehicle = await CacheService.getByFolioCatalog(Constants.vehicleOriginFolio);
      setOriginVehicle(restOriginVehicle.data);

      const restCivilStatus = await CacheService.getByFolioCatalog(Constants.civilStatusFolio);
      setCivilStatus(restCivilStatus.data);

      const restInsuranceCompany = await CompaniesService.getByCompanyType(
        Constants.folioInsuranceCompany
      );
      setInsuranceCompany(restInsuranceCompany.data);

      if (ownerId && ownerId !== "") {
        const person = peopleDataResponse.data.find(
          (person: People) => person.folio === ownerId
        );

        if (person) {
          handleChangeOwner(person);
        } else {
          console.log("Person not found");
        }
      }

      if (quoteId && quoteId !== "") {
        setStep(4);

        const apiData = await QuotesService.getQuoteByFolio(quoteId);
        const quote: Quote = apiData.data;

        if (quote.chubbResponse.issuanceDate !== '') {
          setFechaCotizacion(new Date(quote.chubbResponse.issuanceDate));

        } else if (quote.hdiResponse.issuanceDate) {
          setFechaCotizacion(new Date(quote.hdiResponse.issuanceDate));
        }

        const model = await ChubbCatalogVehicleService.getCatalogVehicleByFolio(
          quote.vehicleId
        );
        const person = peopleDataResponse.data.find(
          (person: People) => person.folio === quote.clientId
        );
        const driver = peopleDataResponse.data.find(
          (person: People) => person.folio === quote.driverFolio
        );

        const transformedData = transformApiData(
          quote,
          model.data,
          person,
          driver
        );

        const newAmplia: Packet[] = [];
        const newLimitada: Packet[] = [];
        const newRC: Packet[] = [];

        if (quote.chubbResponse.comprehensiveCoverage.versionId !== 0) {
          newAmplia.push(
            transformChubbResponseToPacket(
              quote.chubbResponse.comprehensiveCoverage,
              "Amplia",
              quote.chubbResponse.expirationDate,
              restInsuranceCompany.data,
              quote.chubbResponse.cotizacionId
            )
          );
        }

        if (quote.chubbResponse.limitedCoverage.versionId !== 0) {
          newLimitada.push(
            transformChubbResponseToPacket(
              quote.chubbResponse.limitedCoverage,
              "Limitada",
              quote.chubbResponse.expirationDate,
              restInsuranceCompany.data,
              quote.chubbResponse.cotizacionId
            )
          );
        }

        if (quote.chubbResponse.rcCoverage.versionId !== 0) {
          newRC.push(
            transformChubbResponseToPacket(
              quote.chubbResponse.rcCoverage,
              "RC",
              quote.chubbResponse.expirationDate,
              restInsuranceCompany.data,
              quote.chubbResponse.cotizacionId
            )
          );
        }

        // Load HDI responses
        if (quote.hdiResponse.comprehensiveCoverage.versionId !== null) {
          newAmplia.push(
            transformHDIResponseToPacket(
              quote.hdiResponse.comprehensiveCoverage,
              "Amplia",
              quote.hdiResponse.expirationDate,
              restInsuranceCompany.data,
              quote.hdiResponse.cotizacionId
            )
          );
        }

        if (quote.hdiResponse.limitedCoverage.versionId !== null) {
          newLimitada.push(
            transformHDIResponseToPacket(
              quote.hdiResponse.limitedCoverage,
              "Limitada",
              quote.hdiResponse.expirationDate,
              restInsuranceCompany.data,
              quote.hdiResponse.cotizacionId
            )
          );
        }

        if (quote.hdiResponse.rcCoverage.versionId !== null) {
          newRC.push(
            transformHDIResponseToPacket(
              quote.hdiResponse.rcCoverage,
              "RC",
              quote.hdiResponse.expirationDate,
              restInsuranceCompany.data,
              quote.hdiResponse.cotizacionId
            )
          );
        }

        setAmplia(newAmplia);
        setLimitada(newLimitada);
        setRC(newRC);

        (
          Object.keys(transformedData) as Array<keyof typeof transformedData>
        ).forEach((field) => {
          setFieldValue(field, transformedData[field]);
        });

        setPreloadedValues(transformedData);
      }
    };
    fetchData();
  }, []);

  const transformChubbResponseToPacket = (
    chubbResponse: any,
    type: string,
    finVigencia: string,
    insuranceCompany: any,
    cotizacionId: number
  ) => {
    const Insurer = Constants.chubbInsuranceName;
    const companyIcon = insuranceCompany.find(
      (company: any) => company.corporateName.toString().toUpperCase().includes(Insurer.toUpperCase())
    );
    const Icon = companyIcon?.logo ?? "";

    const coberturas = chubbResponse.chubbCoverages;

    return {
      CotizacionId: cotizacionId,
      VersionId: chubbResponse.versionId,
      Type: type,
      FinVigencia: finVigencia,
      Terceros: chubbResponse.thirdPartyDamages,
      GastosMedicos: chubbResponse.medicalExpenses,
      PagoAnual: chubbResponse.annualPayment,
      Coberturas: Array.isArray(coberturas)
        ? coberturas.map((c: any) => ({
          description: c.description,
          sumAssured: c.sumAssured,
          deductibleValue: c.deductibleValue,
          premiumAmount: c.premiumAmount,
        }))
        : [],
      Icon: Icon,
      Insurer: Constants.chubbInsuranceName,
    };
  };

  const transformHDIResponseToPacket = (
    hdiResponse: any,
    type: string,
    finVigencia: string,
    insuranceCompany: any,
    cotizacionId: number
  ) => {
    const Insurer = Constants.hdiInsuranceName;
    const companyIcon = insuranceCompany.find(
      (company: any) => company.corporateName.toString().toUpperCase().includes(Insurer.toUpperCase())
    );
    const Icon = companyIcon?.logo ?? "";

    const coberturas = hdiResponse.hdiCoverages;

    return {
      CotizacionId: cotizacionId,
      VersionId: hdiResponse.versionId,
      Type: type,
      FinVigencia: finVigencia,
      Terceros: hdiResponse.thirdPartyDamages,
      GastosMedicos: hdiResponse.medicalExpenses,
      PagoAnual: hdiResponse.annualPayment,
      Coberturas: Array.isArray(coberturas)
        ? coberturas.map((c: any) => ({
          description: c.description,
          sumAssured: c.sumAssured,
          deductibleValue: c.deductibleValue,
          premiumAmount: c.premiumAmount,
        }))
        : [],
      Icon: Icon,
      Insurer: Constants.hdiInsuranceName,
    };
  };

  const checkForChanges = () => {
    return Object.keys(preloadedValues).some(
      (key) => (preloadedValues as any)[key] !== (values as any)[key]
    );
  };

  React.useEffect(() => {
    const fetchData = async () => {
      if (values.ano !== 0) {
        setLoadingVehicle(true);
        const restVehicles = await getChubbVehicleCacheByYear(values.ano);

        setModelData(restVehicles.data);
        if (selectedModel) {
          await Promise.all([
            handleChubbVehicleChange(selectedModel),
            handleHDIVehicleChange(selectedModel)
          ]);
        }
        setLoadingVehicle(false);
      }
    };

    fetchData();
  }, [values.ano]);

  const handleHDIVehicleChange = async (selectedVehicle: ChubbVehicles | null) => {
    if (selectedVehicle) {
      const vehicleIdType = '4579';

      try {
        const vehicleResult = await HDIInsuranceService.getHDIVehicle(selectedVehicle.model.toString(), vehicleIdType, selectedVehicle);

        if (vehicleResult) {
          const vehicleData = vehicleResult.data.vehicleData;
          const defaultValues = HDIQuote.DEFAULT_HDI_QUOTE_VALUES.body.packagesRequest.vehicleData;

          defaultValues.vechicleId = vehicleData.idVehiculo || defaultValues.vechicleId;
          defaultValues.brandId = vehicleData.idMarca || defaultValues.brandId;
          defaultValues.modelId = vehicleData.idModelo || defaultValues.modelId;
          defaultValues.typeId = vehicleData.idTipo || defaultValues.typeId;
          defaultValues.versionId = vehicleData.idVersion || defaultValues.versionId;
          defaultValues.transmissionId = vehicleData.idTransmision || defaultValues.transmissionId;
          defaultValues.useId = vehicleData.idUso || defaultValues.useId;
          defaultValues.vehicleType = vehicleData.tipoVehiculo || defaultValues.vehicleType;
          defaultValues.engineNumber = vehicleData.numeroMotor || defaultValues.engineNumber;
          defaultValues.plates = vehicleData.placas || defaultValues.plates;
          defaultValues.color = vehicleData.color || defaultValues.color;
          defaultValues.serialNumber = vehicleData.numeroSerie || defaultValues.serialNumber;
          defaultValues.passengers = vehicleData.pasajeros || defaultValues.passengers;
          defaultValues.circulationZoneId = vehicleData.idZonaCirculacion || defaultValues.circulationZoneId;
          defaultValues.tonnageId = vehicleData.idTonelaje || defaultValues.tonnageId;
          defaultValues.serviceId = vehicleData.idServicio || defaultValues.serviceId;
          defaultValues.loadRiskId = vehicleData.idRiesgoCarga || defaultValues.loadRiskId;

        } else {
          throw new Error('Vehicle data fetch failed');
        }
      } catch (error) {
        console.error('Error in handleHDIVehicleChange:', error);
        // Handle the error appropriately
      }
    }
  }


  const transformApiData = (
    apiData: Quote,
    model: ChubbVehicle,
    person: People,
    driver: People
  ) => {
    const transformedData = { ...initialValues };

    if (model) {
      transformedData.ano = model.model;
      transformedData.modelo = model.model.toString();
      setSelectedModel(model);
    } else {
      console.log("Vehicle not found");
    }

    if (person) {
      setSelectedOwner(person);
    } else {
      console.log("Owner not found");
    }

    if (driver) {
      setSelectedDriver(driver);
    } else {
      console.log("Driver not found");
    }

    transformedData.tipoSeguro = apiData.insuranceType as
      | "Auto"
      | "Vida"
      | "GM"
      | "Danos"
      | "Ahorro";
    transformedData.gender = apiData.driverInfo.genderFolio;
    transformedData.duracionSeguro = apiData.paymentFrequency;
    transformedData.condicionAuto = "";
    transformedData.vehicleFolio = apiData.vehicleId;
    transformedData.tipoAuto = apiData.vehicleType;
    transformedData.vin = "";
    transformedData.owner =
      apiData.clientId || (ownerId ? ownerId : transformedData.owner);
    transformedData.driver = apiData.driverFolio;
    transformedData.institucionFinanciera = "";
    transformedData.fechaInicioPoliza = apiData.chubbResponse.issuanceDate;
    transformedData.vigenciaSeguro = "";
    transformedData.fechaNacimiento = apiData.driverInfo.birthDay;
    transformedData.nombre = apiData.driverInfo.firstName;
    transformedData.apellidoPaterno = apiData.driverInfo.lastName;
    transformedData.apellidoMaterno = apiData.driverInfo.maternalLastName;
    transformedData.codigoPostal = apiData.driverInfo.zipCode;
    transformedData.correoElectronico = apiData.driverInfo.email;
    transformedData.telefono = apiData.driverInfo.phone;
    transformedData.estadoCivil = apiData.driverInfo.civilStatus;
    transformedData.calle = apiData.driverInfo.addressDetails.street;
    transformedData.numeroExterior = apiData.driverInfo.addressDetails.outdoorNumber;
    transformedData.numeroInterior = apiData.driverInfo.addressDetails.indoorNumber;

    transformedData.genderOwner = apiData.ownerInfo.genderFolio;
    transformedData.fechaNacimientoOwner = apiData.ownerInfo.birthDay;
    transformedData.nombreOwner = apiData.ownerInfo.firstName;
    transformedData.apellidoPaternoOwner = apiData.ownerInfo.lastName;
    transformedData.apellidoMaternoOwner = apiData.ownerInfo.maternalLastName;
    transformedData.codigoPostalOwner = apiData.ownerInfo.zipCode;
    transformedData.correoElectronicoOwner = apiData.ownerInfo.email;
    transformedData.telefonoOwner = apiData.ownerInfo.phone;
    transformedData.estadoCivilOwner = apiData.ownerInfo.civilStatus;
    transformedData.calleOwner = apiData.ownerInfo.addressDetails.street;
    transformedData.numeroExteriorOwner = apiData.ownerInfo.addressDetails.outdoorNumber;
    transformedData.numeroInteriorOwner = apiData.ownerInfo.addressDetails.indoorNumber;

    transformedData.serie = apiData.vehicleDetails.serialNumber;
    transformedData.placa = apiData.vehicleDetails.plates;
    transformedData.motor = apiData.vehicleDetails.engineNumber;

    return transformedData;
  };

  const handleChubbVehicleChange = async (selectedVehicle: ChubbVehicles | null) => {
    if (selectedVehicle) {
      setSelectedModel(selectedVehicle);
      setCotizacionObject((prevCotizacionObject) => ({
        ...prevCotizacionObject,
        incisos: [
          {
            ...prevCotizacionObject.incisos[0],
            vehiculo: {
              ...prevCotizacionObject.incisos[0].vehiculo,
              vehiculoId: selectedVehicle.vehicle,
              modelo: selectedVehicle.model,
            },
          },
        ],
      }));
    } else {
      console.log("No ChubbVehicle selected");
    }
  };

  const handleOptionSelect = (
    option: "Auto" | "Vida" | "GM" | "Danos" | "Ahorro"
  ) => {
    setSelectedOption(option);
    setFieldValue("tipoSeguro", option);
  };

  const isOptionSelected = (option: string) => {
    return selectedOption === option;
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          !!values.duracionSeguro &&
          !!values.tipoAuto &&
          (values.tipoAuto === Constants.folioNationalCar
            ? !!values.ano && !!selectedModel
            : vinRegex.test(values.vin))
        );
      case 2:
        if (
          !!values.fechaNacimientoOwner &&
          !!values.nombreOwner &&
          !!values.apellidoPaternoOwner &&
          !!values.apellidoMaternoOwner &&
          !!values.calleOwner &&
          postalCodeRegex.test(values.codigoPostalOwner) &&
          emailRegex.test(values.correoElectronicoOwner) &&
          phoneRegex.test(values.telefonoOwner) &&
          !!values.estadoCivilOwner &&
          !!values.genderOwner &&
          !!values.owner
        ) {
          return true;
        } else {
          return false;
        }
      case 3:
        if (
          !!values.fechaNacimiento &&
          !!values.nombre &&
          !!values.apellidoPaterno &&
          !!values.apellidoMaterno &&
          !!values.calle &&
          postalCodeRegex.test(values.codigoPostal) &&
          emailRegex.test(values.correoElectronico) &&
          phoneRegex.test(values.telefono) &&
          !!values.estadoCivil &&
          !!values.gender &&
          !!values.driver &&
          !!values.serie
        ) {
          setIsLoading(true);
          cotizarInsurers();
          return true;
        } else {
          return false;
        }
      default:
        return false;
    }
  };

  const cotizarInsurers = async () => {
    if (quoteId && quoteId !== "" && !checkForChanges()) {
    } else {
      try {


        setAmplia([]);
        setLimitada([]);
        setRC([]);

        setFechaCotizacion(undefined);


        setSelectedPackages({});
        setInsuranceCompaniesStatus([]);

        const [chubbPackets, hdiPackets] = await Promise.all([packetsChubb(), getHDI()]);

        setCotizar(true);
      } catch (error) {
        console.error("Error during packetsChubb:", error);
      }
    }
  };

  useEffect(() => {
    if (cotizar) {
      setIsLoading(true);
      handleCotizar();
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      setCotizar(false);
    }
  }, [cotizar]);

  const nextStep = () => {
    if (isStepValid()) {
      setStep(step + 1);
    } else {
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleCoberturas = (packet: Packet) => {
    setPacket(packet);
    setIsModalOpen(true);
  };

  const textItems = [
    {
      text: "Amplia",
      description:
        "Cubre la responsabilidad civil, asistencia legal, gastos médicos a ocupantes, robo total y daños materiales",
    },
    {
      text: "Limitada",
      description:
        "Cubre la responsabilidad civil, asistencia legal, gastos médicos a ocupantes y robo total",
    },
    {
      text: "RC",
      description:
        "Cubre la responsabilidad civil, asistencia legal y gastos médicos a ocupantes",
    },
  ];

  const handleCloseContratarModal = () => {
    setIsContratarModalOpen(false);
  };

  const handleContratarButton = (packet: Packet) => {
    setPacket(packet);
    setIsContratarModalOpen(true);
  };

  /*const showAlert: any = (content: string, severity = "success") => {
    setAlertContent(content);
    setAlertSeverity(severity);
    setAlert(true);
  };*/

  const chubbPersona = async (person: ChubbPerson) => {
    if (!selectedOwner || !packet || !selectedModel) {
      console.log("Falta un valor");
      return person;
    }
    let responseData: any;

    //console.log('person', person)
    const personRequest = await chubbInsuranceService.getChubbPerson(
      selectedOwner.folio
    );
    const personRegistered: ChubbPerson[] = personRequest.data;

    const lastIndexNotDriver = personRegistered.findIndex(
      (person) => !person.isPersonDriver
    );
    const lastIndexDriver = personRegistered.findIndex(
      (person) => person.isPersonDriver
    );

    if (lastIndexNotDriver === -1) {
      const response = await chubbInsuranceService.postChubbPerson(person);
      if (response.message === "OK") {
        setDataAlert(
          true,
          "El cliente se registró con éxito en Chubb.",
          "success",
          autoHideDuration
        );
      } else {
        //setDataAlert(true, response.message ?? "", "error", autoHideDuration);
      }
      responseData = response.data;
      return responseData;
    } else if (lastIndexDriver === -1) {
      const response = await chubbInsuranceService.postChubbPerson(person);
      if (response.message === "OK") {
        setDataAlert(
          true,
          "El cliente se registró con éxito en Chubb.",
          "success",
          autoHideDuration + 1000
        );
      } else {
        setDataAlert(true, response.message ?? "", "error", autoHideDuration);
      }
      responseData = response.data;
      return responseData;
    } else if (personRegistered[lastIndexNotDriver].messages.length > 0 && lastIndexNotDriver === 0 && !person.isPersonDriver) {
      const response = await chubbInsuranceService.editChubbPerson(
        person,
        personRegistered[lastIndexNotDriver].folio
      );
      if (response.message === "OK") {
        setDataAlert(
          true,
          "El cliente se actualizó y registró con éxito en Chubb.",
          "success",
          autoHideDuration
        );
      } else {
        setDataAlert(true, response.message ?? "", "error", autoHideDuration);
      }
      responseData = response.data;
      return responseData;
    } else if (personRegistered[lastIndexDriver]?.messages?.length > 0 && lastIndexDriver === 1 && person.isPersonDriver) {
      const response = await chubbInsuranceService.editChubbPerson(
        person,
        personRegistered[lastIndexDriver].folio
      );
      if (response.message === "OK") {
        setDataAlert(
          true,
          "El conductor se actualizó y registró con éxito en Chubb.",
          "success",
          autoHideDuration + 1000
        );
      } else {
        setIsLoading(false)
        setDataAlert(true, response.message ?? "", "error", autoHideDuration);
      }
      responseData = response.data;
      return responseData;
    } else {
      if (!person.isPersonDriver) {
        return personRegistered[lastIndexNotDriver];
      } else {
        return personRegistered[lastIndexDriver];
      }
    }
  };


  const getZipCodeChubb = async (codigoPostal: string) => {
    const zipCodeData = await chubbInsuranceService.getChubbColonies(codigoPostal);

    if (zipCodeData.message !== 'OK' || !zipCodeData.data.isSuccess) {
      setDataAlert(true, zipCodeData.message + ' ' + codigoPostal, 'error', autoHideDuration);
      console.error('Error in the response:', zipCodeData.message);
      setIsLoading(false);
      return 0;
    }

    const responseData = zipCodeData.data.responseData;

    if (responseData && Array.isArray(responseData) && responseData.length > 0) {
      const firstColony = responseData[0];
      const zipCode = firstColony.id;
      return zipCode;
    } else {
      setDataAlert(true, 'No colonies found for the given postal code.', 'error', autoHideDuration);
      console.error('No colonies found for the given postal code.');
      setIsLoading(false);
      return 0;
    }
  };


  const handleContratar = async () => {
    setIsLoading(true);
    if (!selectedOwner || !packet || !selectedModel || !selectedDriver) {
      setDataAlert(true, 'Falta un valor', 'error', autoHideDuration);
      console.log('Falta un valor');
      return;
    }

    const rfcOwner = selectedOwner.rfc;
    const homoclaveOwner = rfcOwner.slice(-3);
    const rfcWithoutHomoclaveOwner = rfcOwner.slice(0, -3);

    const ladaLength = 3;
    const numeroLength = 7;

    const ladaOwner = values.telefonoOwner.substring(0, ladaLength);
    const numeroOwner = values.telefonoOwner.substring(ladaLength, ladaLength + numeroLength);

    const rfc = selectedDriver.rfc;
    const homoclave = rfc.slice(-3);
    const rfcWithoutHomoclave = rfc.slice(0, -3);

    const lada = values.telefono.substring(0, ladaLength);
    const numero = values.telefono.substring(ladaLength, ladaLength + numeroLength);

    const numeroInteriorOwner = values.numeroInteriorOwner || '';
    const numeroExteriorOwner = values.numeroExteriorOwner || 'n/a';
    const numeroInteriorDriver = values.numeroInterior || '';
    const numeroExteriorDriver = values.numeroExterior || 'n/a';

    if (packet.Insurer.toUpperCase() === Constants.chubbInsuranceName) {
      const zipCode = await getZipCodeChubb(values.codigoPostal);
      const zipCodeOwner = await getZipCodeChubb(values.codigoPostalOwner);
      const chubbInsuranceCompanyData = InsuranceCompany.find(
        (company: any) => company.corporateName.toString().toUpperCase().includes(Constants.chubbInsuranceName.toUpperCase())
      );

      if (zipCode === 0 || zipCodeOwner === 0) {
        return;
      }

      const personOwner: ChubbPerson = {
        personalidadJuridicaId: 0,
        personFolio: selectedOwner.folio,
        rfc: rfcWithoutHomoclaveOwner,
        homoclave: homoclaveOwner,
        giroId: 11,
        primerNombre: values.nombreOwner,
        segundoNombre: '',
        apellidoPaterno: values.apellidoPaternoOwner,
        apellidoMaterno: values.apellidoMaternoOwner,
        tipoSociedadId: 0,
        razonSocial: '',
        fechaNacimientoConstitucion: values.fechaNacimientoOwner,
        generoId: 1,
        curp: selectedOwner.curp,
        estadoCivilId: 2,
        direccion: {
          tipoDireccionId: 1,
          calle: values.calleOwner,
          numeroExterior: numeroExteriorOwner,
          numeroInterior: numeroInteriorOwner,
          coloniaId: zipCodeOwner || 46006,
        },
        email: values.correoElectronicoOwner,
        telefonoPersonal: {
          lada: ladaOwner || '',
          numero: numeroOwner || '',
        },
        celular: {
          lada: ladaOwner || '',
          numero: numeroOwner || '',
        },
        chubbPersonId: '',
        folio: '',
        isSuccess: false,
        isPersonDriver: false,
        messages: [],
        responseData: {
          tranId: 0,
          personaId: 0,
          direccionId: 0
        },
        objectStatusId: 0,
        createdAt: '',
        createdBy: '',
        updatedAt: '',
        updatedBy: ''
      };

      const personDriver: ChubbPerson = {
        personalidadJuridicaId: 0,
        personFolio: selectedDriver.folio,
        rfc: rfcWithoutHomoclave,
        homoclave: homoclave,
        giroId: 11,
        primerNombre: values.nombre,
        segundoNombre: '',
        apellidoPaterno: values.apellidoPaterno,
        apellidoMaterno: values.apellidoMaterno,
        tipoSociedadId: 0,
        razonSocial: '',
        fechaNacimientoConstitucion: values.fechaNacimiento,
        generoId: 1,
        curp: selectedDriver.curp,
        estadoCivilId: 2,
        direccion: {
          tipoDireccionId: 1,
          calle: values.calle,
          numeroExterior: numeroExteriorDriver,
          numeroInterior: numeroInteriorDriver,
          coloniaId: zipCode || 46006,
        },
        email: values.correoElectronico,
        telefonoPersonal: {
          lada: lada || '',
          numero: numero || '',
        },
        celular: {
          lada: lada || '',
          numero: numero || '',
        },
        chubbPersonId: '',
        folio: '',
        isSuccess: false,
        isPersonDriver: true,
        messages: [],
        responseData: {
          tranId: 0,
          personaId: 0,
          direccionId: 0
        },
        objectStatusId: 0,
        createdAt: '',
        createdBy: '',
        updatedAt: '',
        updatedBy: ''
      };

      const personOwnerChubb: ChubbPerson = await chubbPersona(personOwner);
      if (personOwnerChubb.messages.length > 0 && !personOwnerChubb.isPersonDriver) {
        const message = `Error al registrar al cliente: ${personOwnerChubb.messages[0].message}`;
        setDataAlert(true, message, "error", autoHideDuration);
        return;
      }

      const personDriverChubb: ChubbPerson = await chubbPersona(personDriver);
      if (personDriverChubb.messages.length > 0 && personDriverChubb.isPersonDriver) {
        const message = `Error al registrar al conductor: ${personOwnerChubb.messages[0].message}`;
        setDataAlert(true, message, "error", autoHideDuration);
        return;
      }

      const formaPago = getFormaPago(values.duracionSeguro);
      const chubbCompanyFolio = chubbInsuranceCompanyData?.folio;
      const chubbCompanyName = chubbInsuranceCompanyData?.corporateName;
      const issuance: ChubbIssuance = {
        CotizacionId: packet.CotizacionId,
        VersionId: packet.VersionId,
        formaPagoId: formaPago,
        asegurado: {
          tranId: personOwnerChubb.responseData.tranId,
          aseguradoId: personOwnerChubb.responseData.personaId,
          direccionId: personOwnerChubb.responseData.direccionId,
        },
        Incisos: [
          {
            numeroInciso: 1,
            paqueteId: packet.Type === 'Amplia' ? 1 : packet.Type === 'Limitada' ? 2 : 3,
            vehiculo: {
              serie: values.serie,
              placa: values.placa,
              motor: values.motor ?? "",
              referencia: "Emision",
            },
            propietario: {
              tranId: personDriverChubb.responseData.tranId,
              propietarioId: personDriverChubb.responseData.personaId,
              direccionId: personDriverChubb.responseData.direccionId,
            },
            beneficiario: {
              tranId: 0,
              beneficiarioId: 0,
            },
          },
        ],
        Facturacion: {
          PersonalidadJuridicaId: 0,
          Rfc: selectedOwner.rfc,
          Nombre: selectedOwner.name + ' ' + selectedOwner.lastName + ' ' + selectedOwner.maternalLastName,
          CodigoPostal: values.codigoPostalOwner,
          RegimenFiscalId: 3,
          usoCFDIId: 1,
          email: selectedOwner.email,
          emailComplementoPago: selectedOwner.email,
          comentarios: "comments",
          ordenCompra: "ordenCompra",
        },
        CompanyData: {
          companyFolioIssuance: chubbCompanyFolio!,
          companyNameIssuance: chubbCompanyName!,
          salesPersonEmail: userEmail!
        }
      };



      chubbInsuranceService.postChubbIssuance(issuance, selectedOwner.folio)
        .then((response: any) => {
          if (response.message === 'OK') {
            //console.log('responseIssuanceOk', response)
            setIsIssued(true);
            setIsLoading(false);
            setDataAlert(true, 'La emisión se completó con éxito.', 'success', autoHideDuration);
            setTimeout(() => {
              handleCloseContratarModal();
              navigate('/index/seguros/polizas');
            }, 2000);
          } else {
            //console.log('responseIssuanceFail', response)
            setIsLoading(false);
            setDataAlert(true, response.messages[0] ?? '', 'error', autoHideDuration);
            setTimeout(() => {
              handleCloseContratarModal();
            }, 2000);
          }
        })
        .catch((e: Error) => {
          console.log('e', e)
          setIsLoading(false);
          setDataAlert(true, e.message, 'error', autoHideDuration);
        });
    }

    if (packet.Insurer.toUpperCase() === Constants.hdiInsuranceName) {
      //console.log('salesPersonName', userEmail)
      setIsIssued(true);
      setIsLoading(false);
      setDataAlert(true, "Este es un mensaje dummy de la contratación de HDI", 'success', autoHideDuration);
      setTimeout(() => {
        handleCloseContratarModal();
        navigate('/index/seguros/polizas');
      }, 2000);
    }

  };

  const handleCotizar = async () => {
    if (!selectedOwner || !selectedModel || !selectedDriver) {
      return;
    }

    const newQuote: IQuote = new Quote();
    newQuote.clientId = selectedOwner?.folio;

    newQuote.insuranceType = values.tipoSeguro;
    newQuote.paymentFrequency = values.duracionSeguro;
    newQuote.chubbResponse.issuanceDate = new Date().toISOString();
    newQuote.hdiResponse.issuanceDate = new Date().toISOString();

    newQuote.chubbResponse.cotizacionId = 0;
    newQuote.chubbResponse.comprehensiveCoverage.versionId = 0;
    newQuote.chubbResponse.limitedCoverage.versionId = 0;
    newQuote.chubbResponse.rcCoverage.versionId = 0;
    newQuote.chubbResponse.expirationDate = new Date().toISOString();

    amplia.forEach((packet) => {
      if (packet.Insurer.toUpperCase() === Constants.chubbInsuranceName) {
        newQuote.chubbResponse.expirationDate = packet.FinVigencia;

        newQuote.chubbResponse.cotizacionId = packet.CotizacionId;
        newQuote.chubbResponse.comprehensiveCoverage.versionId =
          packet.VersionId;
        newQuote.chubbResponse.comprehensiveCoverage.thirdPartyDamages =
          packet.Terceros;
        newQuote.chubbResponse.comprehensiveCoverage.medicalExpenses =
          packet.GastosMedicos;
        newQuote.chubbResponse.comprehensiveCoverage.annualPayment =
          packet.PagoAnual;
        newQuote.chubbResponse.comprehensiveCoverage.chubbCoverages =
          packet.Coberturas;
      } else if (packet.Insurer.toUpperCase() === Constants.hdiInsuranceName) {
        newQuote.hdiResponse.expirationDate = packet.FinVigencia;

        newQuote.hdiResponse.cotizacionId = packet.CotizacionId;
        newQuote.hdiResponse.comprehensiveCoverage.versionId =
          packet.VersionId;
        newQuote.hdiResponse.comprehensiveCoverage.thirdPartyDamages =
          packet.Terceros;
        newQuote.hdiResponse.comprehensiveCoverage.medicalExpenses =
          packet.GastosMedicos;
        newQuote.hdiResponse.comprehensiveCoverage.annualPayment =
          packet.PagoAnual;
        newQuote.hdiResponse.comprehensiveCoverage.hdiCoverages =
          packet.Coberturas;
      }
    });

    limitada.forEach((packet) => {
      if (packet.Insurer.toUpperCase() === Constants.chubbInsuranceName) {
        newQuote.chubbResponse.expirationDate = packet.FinVigencia;

        newQuote.chubbResponse.cotizacionId = packet.CotizacionId;
        newQuote.chubbResponse.limitedCoverage.versionId = packet.VersionId;
        newQuote.chubbResponse.limitedCoverage.thirdPartyDamages =
          packet.Terceros;
        newQuote.chubbResponse.limitedCoverage.medicalExpenses =
          packet.GastosMedicos;
        newQuote.chubbResponse.limitedCoverage.annualPayment = packet.PagoAnual;
        newQuote.chubbResponse.limitedCoverage.chubbCoverages =
          packet.Coberturas;
      } else if (packet.Insurer.toUpperCase() === Constants.hdiInsuranceName) {
        newQuote.hdiResponse.expirationDate = packet.FinVigencia;

        newQuote.hdiResponse.cotizacionId = packet.CotizacionId;
        newQuote.hdiResponse.limitedCoverage.versionId = packet.VersionId;
        newQuote.hdiResponse.limitedCoverage.thirdPartyDamages =
          packet.Terceros;
        newQuote.hdiResponse.limitedCoverage.medicalExpenses =
          packet.GastosMedicos;
        newQuote.hdiResponse.limitedCoverage.annualPayment = packet.PagoAnual;
        newQuote.hdiResponse.limitedCoverage.hdiCoverages =
          packet.Coberturas;
      }
    });

    RC.forEach((packet) => {
      if (packet.Insurer.toUpperCase() === Constants.chubbInsuranceName) {
        newQuote.chubbResponse.expirationDate = packet.FinVigencia;

        newQuote.chubbResponse.cotizacionId = packet.CotizacionId;
        newQuote.chubbResponse.rcCoverage.versionId = packet.VersionId;
        newQuote.chubbResponse.rcCoverage.thirdPartyDamages = packet.Terceros;
        newQuote.chubbResponse.rcCoverage.medicalExpenses =
          packet.GastosMedicos;
        newQuote.chubbResponse.rcCoverage.annualPayment = packet.PagoAnual;
        newQuote.chubbResponse.rcCoverage.chubbCoverages = packet.Coberturas;
      } else if (packet.Insurer.toUpperCase() === Constants.hdiInsuranceName) {
        newQuote.hdiResponse.expirationDate = packet.FinVigencia;

        newQuote.hdiResponse.cotizacionId = packet.CotizacionId;
        newQuote.hdiResponse.rcCoverage.versionId = packet.VersionId;
        newQuote.hdiResponse.rcCoverage.thirdPartyDamages = packet.Terceros;
        newQuote.hdiResponse.rcCoverage.medicalExpenses =
          packet.GastosMedicos;
        newQuote.hdiResponse.rcCoverage.annualPayment = packet.PagoAnual;
        newQuote.hdiResponse.rcCoverage.hdiCoverages = packet.Coberturas;
      }
    });

    newQuote.hdiResponse.cotizacionId = 0;
    newQuote.hdiResponse.comprehensiveCoverage.versionId = 0;
    newQuote.hdiResponse.limitedCoverage.versionId = 0;
    newQuote.hdiResponse.rcCoverage.versionId = 0;

    newQuote.ownerInfo = {
      genderFolio: values.genderOwner || Constants.folioMalePerson,
      birthDay: values.fechaNacimientoOwner || '',
      firstName: values.nombreOwner || '',
      lastName: values.apellidoPaternoOwner || '',
      maternalLastName: values.apellidoMaternoOwner || '',
      zipCode: values.codigoPostalOwner || '',
      email: values.correoElectronicoOwner || '',
      phone: values.telefonoOwner || '',
      civilStatus: values.estadoCivilOwner || '',
      addressDetails: {
        typeAddress: 1,
        street: values.calleOwner || '',
        outdoorNumber: values.numeroExteriorOwner || '',
        indoorNumber: values.numeroInteriorOwner || '',
        colonyId: 0,
      },
    };

    newQuote.vehicleId = selectedModel?.folio;
    newQuote.vehicleType = values.tipoAuto;
    newQuote.driverFolio = selectedDriver?.folio;

    newQuote.driverInfo = {
      genderFolio: values.gender || Constants.folioMalePerson,
      birthDay: values.fechaNacimiento || '',
      firstName: values.nombre || '',
      lastName: values.apellidoPaterno || '',
      maternalLastName: values.apellidoMaterno || '',
      zipCode: values.codigoPostal || '',
      email: values.correoElectronico || '',
      phone: values.telefono || '',
      civilStatus: values.estadoCivil || '',
      addressDetails: {
        typeAddress: 1,
        street: values.calle || '',
        outdoorNumber: values.numeroExterior || '',
        indoorNumber: values.numeroInterior || '',
        colonyId: 0,
      },
    };

    newQuote.vehicleDetails = {
      serialNumber: values.serie || '',
      plates: values.placa || '',
      engineNumber: values.motor || '',
    };

    newQuote.quoteStatus = "Espera";

    const result = await QuotesService.getQuotesByClientVehicleFolio(
      newQuote.clientId,
      newQuote.vehicleId
    );
    const quote: Quote = result.data;
    let quoteFolio = quoteId;

    if (quote) {
      quoteFolio = quote.quoteFolio;
    } else {
      quoteFolio = "";
    }

    if (newQuote.chubbResponse.issuanceDate !== '') {
      setFechaCotizacion(new Date(newQuote.chubbResponse.issuanceDate));

    } else if (newQuote.hdiResponse.issuanceDate) {
      setFechaCotizacion(new Date(newQuote.hdiResponse.issuanceDate));
    }



    if (quoteFolio && quoteFolio !== "") {
      QuotesService.putQuote(quoteFolio, newQuote)
        .then((response: any) => {
          if (response.message === "OK") {
            //setDataAlert(true, "La cotización se actualizó con éxito.", "success", autoHideDuration);
            showToast("La cotización se actualizó con éxito.", "success");
            setPreloadedValues(values);
            checkForErrors();
          } else {
            //setDataAlert(true, response.message, "error", autoHideDuration);
            showToast(response.message, "error");
            checkForErrors();
          }
        })
        .catch((e: Error) => {
          setDataAlert(true, e.message, "error", autoHideDuration);
          checkForErrors();
        });
    } else {
      QuotesService.postQuote(newQuote)
        .then((response: any) => {
          if (response.message === "OK") {
            //setDataAlert(true, "La cotización se registró con éxito.", "success", autoHideDuration);
            showToast("La cotización se registró con éxito.", "success");
            setPreloadedValues(values);
            checkForErrors();
          } else {
            //setDataAlert(true, response.message, "error", autoHideDuration);
            showToast(response.message, "error");
            checkForErrors();
          }
        })
        .catch((e: Error) => {
          console.log('e', e.message)
          checkForErrors();
        });
    }
  };


  const checkForErrors = () => {
    if (hdiError) {
      showToast(`Mensaje de HDI: ${hdiError}`, 'error');
    }
    if (chubbError) {
      showToast(`Mensaje de Chubb: ${chubbError}`, 'error');
    }
    setIsLoading(false);
    setChubbError("");
    setHdiError("");
  }

  const handleGenderSelect = (folio: string) => {
    setFieldValue("gender", folio);
  };

  const handleOwnerGenderSelect = (folio: string) => {
    setFieldValue('genderOwner', folio);
  };


  const handleChangeDriver = (driver: People) => {
    setFieldValue("driver", driver?.folio);
    setSelectedDriver(driver);
    setFieldValue("gender", driver.genderId);

    const date = new Date(driver.birthDay);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;
    setFieldValue("fechaNacimiento", formattedDate);

    setFieldValue('nombre', driver.name);
    setFieldValue('apellidoPaterno', driver.lastName);
    setFieldValue('apellidoMaterno', driver.maternalLastName);
    setFieldValue('correoElectronico', driver.email);

    setTimeout(() => {
      setFieldTouched('driver', true);
      setFieldTouched('gender', true);
      setFieldTouched('fechaNacimiento', true);
      setFieldTouched('nombre', true);
      setFieldTouched('apellidoPaterno', true);
      setFieldTouched('apellidoMaterno', true);
      setFieldTouched('correoElectronico', true);
    });
  }

  const handleChangeOwner = (owner: People) => {

    setFieldValue('owner', owner?.folio);
    setSelectedOwner(owner);
    setFieldValue('genderOwner', owner.genderId);

    const date = new Date(owner.birthDay);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;
    setFieldValue('fechaNacimientoOwner', formattedDate);

    setFieldValue('nombreOwner', owner.name);
    setFieldValue('apellidoPaternoOwner', owner.lastName);
    setFieldValue('apellidoMaternoOwner', owner.maternalLastName);
    setFieldValue('correoElectronicoOwner', owner.email);

    setTimeout(() => {
      setFieldTouched('owner', true);
      setFieldTouched('genderOwner', true);
      setFieldTouched('fechaNacimientoOwner', true);
      setFieldTouched('nombreOwner', true);
      setFieldTouched('apellidoPaternoOwner', true);
      setFieldTouched('apellidoMaternoOwner', true);
      setFieldTouched('correoElectronicoOwner', true);
    });

  }

  const contratarModal = (
    <Dialog
      open={isContratarModalOpen}
      onClose={handleCloseContratarModal}
      sx={{ width: "100%", height: "100%" }}
      disableEnforceFocus
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      PaperProps={{ sx: { borderRadius: "25px", padding: 2 } }}
    >
      <IconButton
        onClick={handleCloseContratarModal}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <Cancel />
      </IconButton>
      <DialogContent>
        <Box
          sx={{
            borderRadius: "20px",
            padding: "16px",
            margin: "auto",
            backgroundColor: ColorPureWhite,
          }}
        >
          <Typography variant="body1" sx={{ marginBottom: "16px" }}>
            ¿Seguro que quieres contratar esta cotización?
          </Typography>

          <Box sx={{ display: "flex" }}>
            <Button
              sx={{ marginRight: "auto" }}
              variant="outlined"
              onClick={handleCloseContratarModal}
              disabled={isIssued}
            >
              Cerrar
            </Button>
            <Button onClick={handleContratar} disabled={isIssued}>Contratar</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const [visibleCobertura, setVisibleCobertura] = useState<string | null>(null);

  type SelectedPackagesState = {
    [key: string]: boolean;
  };

  const [selectedPackages, setSelectedPackages] = useState<SelectedPackagesState>({});

  const toggleCoberturaVisibility = (packageKey: string) => {
    setVisibleCobertura(visibleCobertura === packageKey ? null : packageKey);
  };

  const togglePackageSelection = (selectedPackage: Packet) => {
    const packageKey = createPackageKey(selectedPackage);
    setSelectedPackages(prevSelectedPackages => ({
      ...prevSelectedPackages,
      [packageKey]: !prevSelectedPackages[packageKey],
    }));
  };

  const handleVehicleChange = async (value: ChubbVehicles | null) => {
    setFieldValue("vehicleFolio", value?.folio);
    if (value !== null) {
      try {
        await Promise.all([
          handleChubbVehicleChange(value),
          handleHDIVehicleChange(value)
        ]);
      } catch (error) {
        console.error("Error handling vehicle change:", error);
      }
    }
  };

  const isDatePast = (finVigencia: string) => {
    const finVigenciaDate = new Date(finVigencia);
    return finVigenciaDate < new Date(Date.now());
  };

  const [isContractorDriver, setIsContractorDriver] = useState(false);

  const handleSameContractor = (event: any) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setIsContractorDriver(true);
      setFieldValue("driver", values.owner);
      setFieldValue("gender", values.genderOwner);
      setFieldValue('fechaNacimiento', values.fechaNacimientoOwner);
      setFieldValue('nombre', values.nombreOwner);
      setFieldValue('apellidoPaterno', values.apellidoPaternoOwner);
      setFieldValue('apellidoMaterno', values.apellidoMaternoOwner);
      setFieldValue('calle', values.calleOwner);
      setFieldValue('numeroInterior', values.numeroInteriorOwner);
      setFieldValue('numeroExterior', values.numeroExteriorOwner);
      setFieldValue('codigoPostal', values.codigoPostalOwner);
      setFieldValue('correoElectronico', values.correoElectronicoOwner);
      setFieldValue('telefono', values.telefonoOwner);
      setFieldValue('estadoCivil', values.estadoCivilOwner);
      setTimeout(() => {
        setFieldTouched('driver', true);
        setFieldTouched('gender', true);
        setFieldTouched('fechaNacimiento', true);
        setFieldTouched('nombre', true);
        setFieldTouched('apellidoPaterno', true);
        setFieldTouched('apellidoMaterno', true);
        setFieldTouched('correoElectronico', true);
      });
    } else {
      setIsContractorDriver(false);
      setFieldValue("driver", '');
      setFieldValue("gender", '');
      setFieldValue('fechaNacimiento', '');
      setFieldValue('nombre', '');
      setFieldValue('apellidoPaterno', '');
      setFieldValue('apellidoMaterno', '');
      setFieldValue('calle', '');
      setFieldValue('numeroInterior', '');
      setFieldValue('numeroExterior', '');
      setFieldValue('codigoPostal', '');
      setFieldValue('correoElectronico', '');
      setFieldValue('telefono', '');
      setFieldValue('estadoCivil', '');
      setTimeout(() => {
        setFieldTouched('driver', false);
        setFieldTouched('gender', false);
        setFieldTouched('fechaNacimiento', false);
        setFieldTouched('nombre', false);
        setFieldTouched('apellidoPaterno', false);
        setFieldTouched('apellidoMaterno', false);
        setFieldTouched('correoElectronico', false);
      });
    }
  }

  function InsuranceItem({ item }: InsuranceItemProps) {
    const annual = formatMoney(item.PagoAnual);
    const packageKey = createPackageKey(item);
    const isCoberturaVisible = visibleCobertura && visibleCobertura === packageKey;

    return (
      <div style={{ position: 'relative', marginBottom: '20px', marginLeft: '50px' }}>
        <Checkbox
          checked={!!selectedPackages[packageKey]}
          onChange={() => togglePackageSelection(item)}
          style={{
            position: 'absolute',
            left: '-50px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
        <div
          className="card"
          style={{
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            border: "1px solid #ddd",
            marginBottom: "20px",
            position: 'relative',
          }}
        >
          <div className="card-content">
            <Grid
              container
              justifyContent="space-between"
              style={{ marginTop: "20px" }}
            >
              <Grid item xs={3} container alignItems="center" justifyContent="center"
                sx={{
                  overflow: "hidden",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              >
                <ListItemIcon>
                  <Avatar
                    src={FormatData.getUriLogoCompany(item.Icon) ?? ""}
                    variant="rounded"
                    sx={{
                      width: "100%",
                      height: "auto",
                      maxWidth: "120px",
                    }}
                  />
                </ListItemIcon>
              </Grid>
              <Grid item xs={2}>
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <Typography sx={LinkMediumBoldFont} variant="body1">
                      ${item.Terceros}
                    </Typography>
                    <Typography variant="body2">R.C. Daños a terceros</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={2}>
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <Typography sx={LinkMediumBoldFont} variant="body1">
                      ${item.GastosMedicos}
                    </Typography>
                    <Typography variant="body2">Gastos médicos</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Paper
                  sx={{
                    bgcolor: "grey.700",
                    color: "white",
                    borderRadius: 1,
                    marginLeft: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "70%",
                  }}
                >
                  <Typography sx={TextMediumBoldWhiteFont} variant="body1">
                    ${annual}
                  </Typography>
                  <Typography variant="body2">Pago único anual</Typography>
                </Paper>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" alignItems="center">
              <Grid item>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                    gap: "40px",
                    marginBottom: "10px",
                    marginRight: "10px",
                  }}
                >
                  <Typography
                    variant="body2"
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => toggleCoberturaVisibility(packageKey)}
                    sx={LinkMediumFont}
                  >
                    Ver detalles
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleContratarButton(item)}
                    endIcon={<ArrowRight color={ColorPureWhite} />}
                    disabled={isDatePast(item.FinVigencia)}
                  >
                    Contratar
                  </Button>
                </div>
              </Grid>
              <Grid item xs={12} style={{ marginTop: '20px' }}>
                {isCoberturaVisible && item.Coberturas.map((cobertura, index) => (
                  <div key={index} className="cobertura-detail">
                    <Grid container justifyContent="space-between" style={{ padding: '0 20px', marginBottom: '15px' }}>
                      <Grid item xs={5}>
                        <Grid container direction="column" spacing={1}>
                          <Grid item>
                            <Typography sx={LinkLargeFont} style={{ marginBottom: '20px' }}>{cobertura.description}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={2}>
                        <Grid container direction="column" spacing={1}>
                          <Grid item>
                            <Typography sx={LinkMediumBoldFont} variant="body1">${cobertura.sumAssured}</Typography>
                            <Typography variant="body2">Suma asegurada</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={1}>
                        <Grid container direction="column" spacing={1}>
                          <Grid item>
                            <Typography sx={LinkMediumBoldFont} variant="body1">{formatDeductible(cobertura.deductibleValue)}</Typography>
                            <Typography variant="body2">Deducible</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={1}>
                        <Grid container direction="column" spacing={1}>
                          <Grid item>
                            <Typography sx={LinkMediumBoldFont} variant="body1">${formatMoney(cobertura.premiumAmount.toString())}</Typography>
                            <Typography variant="body2">Prima total</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                ))}
              </Grid>
            </Grid>
          </div>
        </div>
        <div>
        </div>
      </div>
    );
  }

  // Render the form based on the current step
  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Title
              title={"Multicotizador"}
              url={window.location.href.slice(SIZE_WEB_URL)}
            />
            <Paper sx={{ p: "24px", borderRadius: 8 }}>
              <div className="row" style={{ marginBottom: "10px" }}>
                <div className="col-md-12">
                  <Typography
                    sx={TextSmallFont}
                    style={{ marginBottom: "20px" }}
                  >
                    ¡Cotiza tu seguro ahora!
                  </Typography>
                  <div className="mb-3" style={{ marginBottom: "10px" }}>
                    <div className="d-flex justify-content-around">
                      <Button
                        onClick={() => handleOptionSelect("Auto")}
                        startIcon={
                          <CarIcon
                            color={isOptionSelected("Auto") ? "black" : "white"}
                          />
                        }
                        variant={
                          isOptionSelected("Auto") ? "outlined" : "contained"
                        }
                      >
                        Auto
                      </Button>
                      {/* Se quitan del render */}
                      {/* <Button
                        onClick={() => handleOptionSelect("Danos")}
                        startIcon={
                          <DamageIcon
                            color={
                              isOptionSelected("Danos") ? "black" : "white"
                            }
                          />
                        }
                        variant={
                          isOptionSelected("Danos") ? "outlined" : "contained"
                        }
                      >
                        Daños
                      </Button>
                      <Button
                        onClick={() => handleOptionSelect("GM")}
                        startIcon={
                          <GmIcon
                            color={isOptionSelected("GM") ? "black" : "white"}
                          />
                        }
                        variant={
                          isOptionSelected("GM") ? "outlined" : "contained"
                        }
                      >
                        GM
                      </Button>
                      <Button
                        onClick={() => handleOptionSelect("Vida")}
                        startIcon={
                          <LifeIcon
                            color={isOptionSelected("Vida") ? "black" : "white"}
                          />
                        }
                        variant={
                          isOptionSelected("Vida") ? "outlined" : "contained"
                        }
                      >
                        Vida
                      </Button>
                      <Button
                        onClick={() => handleOptionSelect("Ahorro")}
                        startIcon={
                          <SavingIcon
                            color={
                              isOptionSelected("Ahorro") ? "black" : "white"
                            }
                          />
                        }
                        variant={
                          isOptionSelected("Ahorro") ? "outlined" : "contained"
                        }
                      >
                        Ahorro
                      </Button> */}
                    </div>
                  </div>
                  <hr style={{ marginBottom: "10px" }} />
                </div>
              </div>

              <Grid container spacing={3} style={{ marginBottom: "15px" }}>
                <Grid item xs={12}>
                  <Typography sx={LinkLargeFont}>Tipo de Pago</Typography>
                  <Select
                    name="duracionSeguro"
                    value={values.duracionSeguro}
                    onChange={handleChange}
                    error={!!errors.duracionSeguro}
                    displayEmpty
                    fullWidth
                    style={{ width: "40%" }}
                  >
                    {Object(TypePayment?.values ?? []).map(
                      (data: CatalogValue) => (
                        <MenuItem key={data.folio} value={data.folio}>
                          {data.description}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </Grid>
              </Grid>

              <Typography sx={LinkLargeFont} style={{ marginBottom: "20px" }}>
                Vehiculo
              </Typography>

              <Grid container spacing={3} style={{ marginBottom: "15px" }}>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={TextSmallFont}>Tipo de auto</Typography>
                  <Select
                    name="tipoAuto"
                    value={values.tipoAuto}
                    onChange={handleChange}
                    error={!!errors.tipoAuto}
                    displayEmpty
                    fullWidth
                    style={{ width: "82%" }}
                  >
                    {Object(OriginVehicle?.values ?? []).map(
                      (data: CatalogValue) => (
                        <MenuItem key={data.folio} value={data.folio}>
                          {data.description}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </Grid>
                {values.tipoAuto === Constants.folioNationalCar ? (
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography sx={TextSmallFont}>Año</Typography>
                    <Select
                      name="ano"
                      value={values.ano}
                      onChange={handleChange}
                      error={!!errors.ano}
                      displayEmpty
                      fullWidth
                    >
                      {yearRange.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography sx={TextSmallFont}>VIN</Typography>
                    <TextField
                      name="vin"
                      value={values.vin}
                      onChange={handleChange}
                      error={!!errors.vin}
                      fullWidth
                    />
                  </Grid>
                )}
              </Grid>
              {values.tipoAuto === Constants.folioNationalCar ? (
                <Grid container spacing={3} style={{ marginBottom: "15px" }}>
                  <Grid item xs={12}>
                    <Typography sx={TextSmallFont}>Modelo</Typography>
                    <Autocomplete
                      fullWidth
                      value={selectedModel || null}
                      getOptionLabel={(option) =>
                        option.brand + " " + option.description
                      }
                      filterOptions={(options, { inputValue }) =>
                        inputValue.trim() !== ""
                          ? options.filter((option) =>
                            (option.brand + " " + option.description)
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                          )
                          : []
                      }
                      options={modelData ?? []}
                      loading={loadingVehicle}
                      noOptionsText="No se encontraron coincidencias"
                      loadingText="Buscando..."
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.vehicle}>
                          {option.brand + " " + option.description}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          error={!!errors.vehicleFolio}
                          helperText={errors.vehicleFolio}
                          placeholder="Busca tu vehículo"
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loadingVehicle && (
                                  <CircularProgress
                                    sx={{ color: "#E5105D" }}
                                    size={20}
                                  />
                                )}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      onChange={(event, value) => {
                        handleVehicleChange(value);
                      }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <></>
              )}
            </Paper>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "25px",
              }}
            >
              <Button
                onClick={nextStep}
                endIcon={<ArrowRight color={ColorWhite} />}
              >
                Continuar
              </Button>
            </div>
          </>
        );

      case 2:
        return (
          <div>
            <SelectedOptionSeguro
              selectedOption={selectedOption}
              gender={values.gender}
              isGenderVisible={false}
            />
            <Paper sx={{ p: "24px", borderRadius: 8 }}>
              <Grid container spacing={3} style={{ marginBottom: "15px" }}>
                <Grid item xs={12} md={4}>
                  <Typography sx={LinkLargeFont} style={{ marginBottom: '15px' }}>¿Quién es el cliente responsable?</Typography>
                  <div className="row" style={{ marginBottom: '10px' }}>
                    <div className="col-md-12">
                      <div className="mb-3" style={{ marginBottom: '10px' }}>
                        <Autocomplete
                          fullWidth
                          value={selectedOwner || null}
                          getOptionLabel={(option) => option.name + ' ' + option.lastName + ' ' + option.maternalLastName}
                          options={peopleData ?? []}
                          filterOptions={(options, { inputValue }) =>
                            inputValue.trim() !== ''
                              ? options.filter((option) =>
                                (option.name + ' ' + option.lastName + ' ' + option.maternalLastName)
                                  .toLowerCase()
                                  .includes(inputValue.toLowerCase())
                              )
                              : []
                          }
                          loading={loadingOwner}
                          noOptionsText='No se encontraron coincidencias'
                          loadingText='Buscando...'
                          renderOption={(props, option) => (
                            <Box component='li' {...props} key={option.folio}>
                              {option.name + ' ' + option.lastName + ' ' + option.maternalLastName}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              error={!!errors.owner}
                              helperText={errors.owner}
                              placeholder='Busca al responsable'
                              {...params}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {loadingOwner ? <CircularProgress sx={{ color: "#E5105D" }} size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                          onChange={(event, value) => {
                            if (value !== null) {
                              handleChangeOwner(value);
                            }
                          }}
                        />
                      </div>
                      <hr style={{ marginBottom: '10px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {genderOptions.map((option) => (
                      <Button
                        key={option.folio}
                        variant={values.genderOwner === option.folio ? 'outlined' : 'contained'}
                        onClick={() => handleOwnerGenderSelect(option.folio)}
                        style={{ minWidth: 100, marginRight: '10px' }}
                        startIcon={
                          values.genderOwner === option.folio ? option.icon : React.cloneElement(option.icon, { color: ColorWhite })
                        }
                      >
                        {option.label}
                      </Button>
                    ))}
                    {errors.genderOwner && <span style={{ color: 'red' }}>{errors.genderOwner}</span>}
                  </div>
                </Grid>
              </Grid>

              <hr style={{ marginBottom: '15px' }}></hr>

              <Grid container spacing={3} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Fecha de nacimiento</Typography>
                  <TextField
                    name="fechaNacimientoOwner"
                    value={values.fechaNacimientoOwner}
                    onChange={handleChange}
                    error={!!errors.fechaNacimientoOwner}
                    type="date"
                    fullWidth
                    defaultValue={values.fechaNacimientoOwner}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Nombre</Typography>
                  <TextField
                    name="nombreOwner"
                    value={values.nombreOwner}
                    onChange={handleChange}
                    error={!!errors.nombreOwner}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Apellido Paterno</Typography>
                  <TextField
                    name="apellidoPaternoOwner"
                    value={values.apellidoPaternoOwner}
                    onChange={handleChange}
                    error={!!errors.apellidoPaternoOwner}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Apellido Materno</Typography>
                  <TextField
                    name="apellidoMaternoOwner"
                    value={values.apellidoMaternoOwner}
                    onChange={handleChange}
                    error={!!errors.apellidoMaternoOwner}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Calle</Typography>
                  <TextField
                    name="calleOwner"
                    value={values.calleOwner}
                    onChange={handleChange}
                    error={!!errors.calleOwner}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Número Interior</Typography>
                  <TextField
                    name="numeroInteriorOwner"
                    value={values.numeroInteriorOwner}
                    onChange={handleChange}
                    error={!!errors.numeroInteriorOwner}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Número Exterior</Typography>
                  <TextField
                    name="numeroExteriorOwner"
                    value={values.numeroExteriorOwner}
                    onChange={handleChange}
                    error={!!errors.numeroExteriorOwner}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Código postal</Typography>
                  <TextField
                    name="codigoPostalOwner"
                    value={values.codigoPostalOwner}
                    //onChange={handleChange}
                    error={!!errors.codigoPostalOwner}
                    fullWidth
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFieldValue('codigoPostalOwner', value.slice(0, 5));
                    }}
                    inputProps={{
                      maxLength: 5,
                      pattern: "^[0-9]+$"
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Correo electrónico</Typography>
                  <TextField
                    name="correoElectronicoOwner"
                    value={values.correoElectronicoOwner}
                    onChange={handleChange}
                    error={!!errors.correoElectronicoOwner}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Teléfono</Typography>
                  <TextField
                    name="telefonoOwner"
                    value={values.telefonoOwner}
                    //onChange={handleChange}
                    error={!!errors.telefonoOwner}
                    fullWidth
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFieldValue('telefonoOwner', value.slice(0, 10));
                    }}
                    inputProps={{
                      maxLength: 10,
                      pattern: "[0-9]*"
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Estado civil</Typography>
                  <Select
                    name="estadoCivilOwner"
                    value={values.estadoCivilOwner}
                    onChange={handleChange}
                    error={!!errors.estadoCivilOwner}
                    displayEmpty
                    fullWidth
                    style={{ width: '100%' }}
                  >
                    {Object(CivilStatus?.values ?? []).map(
                      (data: CatalogValue) => (
                        <MenuItem key={data.folio} value={data.folio}>
                          {data.description}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </Grid>
              </Grid>

            </Paper>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', marginBottom: "25px" }}>
              <Button onClick={prevStep}>Regresar</Button>
              <Button onClick={nextStep} endIcon={<ArrowRight color={ColorWhite} />}>Continuar</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <SelectedOptionSeguro selectedOption={selectedOption} gender={values.gender} isGenderVisible={false} />
            <Paper sx={{ p: '24px', borderRadius: 8 }}>
              <Grid container spacing={3} xs={12} gap={2}>
                <Grid item xs={12} md={4}>
                  <Typography sx={LinkLargeFont} style={{ marginBottom: '15px' }}>¿Quién conduce el vehículo?</Typography>
                  <Autocomplete
                    disabled={isContractorDriver}
                    fullWidth
                    value={selectedDriver || null}
                    getOptionLabel={(option) => option.name + ' ' + option.lastName + ' ' + option.maternalLastName}
                    options={peopleData ?? []}
                    filterOptions={(options, { inputValue }) =>
                      inputValue.trim() !== ''
                        ? options.filter((option) =>
                          (option.name + ' ' + option.lastName + ' ' + option.maternalLastName)
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        )
                        : []
                    }
                    loading={loadingDriver}
                    noOptionsText="No se encontraron coincidencias"
                    loadingText="Buscando..."
                    renderOption={(props, option) => (
                      <Box component="li" {...props} key={option.folio}>
                        {option.name +
                          " " +
                          option.lastName +
                          " " +
                          option.maternalLastName}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        error={!!errors.driver}
                        //helperText={errors.driver}
                        placeholder="Busca al conductor"
                        name="driver"
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingDriver ? (
                                <CircularProgress
                                  sx={{ color: "#E5105D" }}
                                  size={20}
                                />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    onChange={(event, value) => {
                      if (value !== null) {
                        handleChangeDriver(value);
                      }
                    }}
                  />


                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={LinkLargeFont} style={{ marginBottom: '15px' }}>¿Mismo contratrante?</Typography>
                  <Box height={'56px'} display={'flex'} alignItems={'center'}>
                    <Switch checked={isContractorDriver} onChange={handleSameContractor} />
                  </Box>
                </Grid>
              </Grid>

              <hr style={{ marginBottom: '10px', marginTop: '10px' }}></hr>

              <Grid style={{ display: "flex", alignItems: "center" }}>
                <Box >
                  {genderOptions.map((option) => (
                    <Button
                      key={option.folio}
                      variant={
                        values.gender === option.folio
                          ? "outlined"
                          : "contained"
                      }
                      onClick={() => handleGenderSelect(option.folio)}
                      style={{ minWidth: 100, marginRight: "10px" }}
                      startIcon={
                        values.gender === option.folio
                          ? option.icon
                          : React.cloneElement(option.icon, {
                            color: ColorWhite,
                          })
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                  {errors.gender && (
                    <span style={{ color: "red" }}>{errors.gender}</span>
                  )}
                </Box>
              </Grid>

              <hr style={{ marginBottom: '25px', marginTop: '10px' }}></hr>

              <Grid container spacing={3} style={{ marginBottom: "15px" }}>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>
                    Fecha de nacimiento
                  </Typography>
                  <TextField
                    name="fechaNacimiento"
                    value={values.fechaNacimiento}
                    onChange={handleChange}
                    error={!!errors.fechaNacimiento}
                    type="date"
                    fullWidth
                    defaultValue={values.fechaNacimiento}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Nombre</Typography>
                  <TextField
                    name="nombre"
                    value={values.nombre}
                    onChange={handleChange}
                    error={!!errors.nombre}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Apellido Paterno</Typography>
                  <TextField
                    name="apellidoPaterno"
                    value={values.apellidoPaterno}
                    onChange={handleChange}
                    error={!!errors.apellidoPaterno}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Apellido Materno</Typography>
                  <TextField
                    name="apellidoMaterno"
                    value={values.apellidoMaterno}
                    onChange={handleChange}
                    error={!!errors.apellidoMaterno}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Calle</Typography>
                  <TextField
                    name="calle"
                    value={values.calle}
                    onChange={handleChange}
                    error={!!errors.calle}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Número Interior</Typography>
                  <TextField
                    name="numeroInterior"
                    value={values.numeroInterior}
                    onChange={handleChange}
                    error={!!errors.numeroInterior}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Número Exterior</Typography>
                  <TextField
                    name="numeroExterior"
                    value={values.numeroExterior}
                    onChange={handleChange}
                    error={!!errors.numeroExterior}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Código postal</Typography>
                  <TextField
                    name="codigoPostal"
                    value={values.codigoPostal}
                    //onChange={handleChange}
                    error={!!errors.codigoPostal}
                    fullWidth
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFieldValue('codigoPostal', value.slice(0, 5));
                    }}
                    inputProps={{
                      maxLength: 5,
                      pattern: "^[0-9]+$"
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Correo electrónico</Typography>
                  <TextField
                    name="correoElectronico"
                    value={values.correoElectronico}
                    onChange={handleChange}
                    error={!!errors.correoElectronico}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Teléfono</Typography>
                  <TextField
                    name="telefono"
                    value={values.telefono}
                    //onChange={handleChange}
                    error={!!errors.telefono}
                    fullWidth
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFieldValue('telefono', value.slice(0, 10));
                    }}
                    inputProps={{
                      maxLength: 10,
                      pattern: "[0-9]*"
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Estado civil</Typography>
                  <Select
                    name="estadoCivil"
                    value={values.estadoCivil}
                    onChange={handleChange}
                    error={!!errors.estadoCivil}
                    displayEmpty
                    fullWidth
                    style={{ width: "100%" }}
                  >
                    {Object(CivilStatus?.values ?? []).map(
                      (data: CatalogValue) => (
                        <MenuItem key={data.folio} value={data.folio}>
                          {data.description}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </Grid>
              </Grid>

              <hr style={{ marginBottom: '25px', marginTop: '10px' }}></hr>
              <Typography sx={LinkLargeFont} style={{ marginBottom: '15px' }}>Datos del vehículo</Typography>
              <Grid container spacing={3} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Serie</Typography>
                  <TextField
                    name="serie"
                    value={values.serie}
                    onChange={handleChange}
                    error={!!errors.serie}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Placa</Typography>
                  <TextField
                    name="placa"
                    value={values.placa}
                    onChange={handleChange}
                    error={!!errors.placa}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TextSmallFont}>Motor</Typography>
                  <TextField
                    name="motor"
                    value={values.motor}
                    onChange={handleChange}
                    error={!!errors.motor}
                    fullWidth
                  />
                </Grid>
              </Grid>

            </Paper>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "25px",
                marginBottom: "25px"
              }}
            >
              <Button onClick={prevStep}>Regresar</Button>
              <Button
                onClick={nextStep}
                endIcon={<ArrowRight color={ColorWhite} />}
              >
                Cotizar
              </Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            {isModalOpen ? (
              <CoberturasModal
                open={isModalOpen}
                close={() => {
                  closeModal();
                }}
                packet={packet}
                openContratarModal={handleContratarButton}
              />
            ) : (
              <></>
            )}
            <MessageBar
              open={isSnackbarOpen}
              severity={severity}
              message={messageAlert}
              close={handleSnackbarClose}
              autoHideDuration={autoHideDuration}
            />
            <SelectedOptionSeguro
              selectedOption={selectedOption}
              gender={values.gender}
              isGenderVisible={true}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: "1 1 20%", marginRight: "20px", justifyContent: "center" }}>
                <Paper sx={{ p: "24px", borderRadius: 8, justifyContent: 'center' }}>
                  <Grid container spacing={3}>
                    {fechaCotizacion && (
                      <div style={{
                        padding: '15px',
                        borderRadius: '8px',
                        margin: '0 0 0 0',
                      }}>
                        <Typography variant="body2" sx={TextSmallBlackFont}>
                          Fecha de Cotización: {fechaCotizacion.toLocaleDateString('es-ES')}
                        </Typography>
                      </div>
                    )}
                    <Grid item xs={12}>
                      <Typography
                        sx={LinkLargeFont}
                        style={{ marginBottom: "20px" }}
                      >
                        Tipo de cobertura:{" "}
                      </Typography>
                      <ToggleButtonGroup
                        value={selectedPacket}
                        exclusive
                        onChange={(event, newPacket) =>
                          setSelectedPacket(newPacket)
                        }
                        aria-label="packet"
                      >
                        {textItems.map((item, index) => (
                          <ToggleButton
                            key={index}
                            value={item.text}
                            aria-label={item.text}
                          >
                            {item.text}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Grid>
                  </Grid>
                </Paper>
              </div>
              <div style={{ flex: "2 1 80%", padding: "20px" }}>
                {selectedPacket === "Amplia" ? (
                  <div>
                    {amplia.map((item: Packet, index) => (
                      <InsuranceItem key={index} item={item} />
                    ))}
                  </div>
                ) : selectedPacket === "Limitada" ? (
                  <div>
                    {limitada.map((item: Packet, index) => (
                      <InsuranceItem key={index} item={item} />
                    ))}
                  </div>
                ) : selectedPacket === "RC" ? (
                  <div>
                    {RC.map((item: Packet, index) => (
                      <InsuranceItem key={index} item={item} />
                    ))}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "25px",
              }}
            >
              <Button onClick={prevStep}>Regresar</Button>
              <Button
                color="primary"
                onClick={handleCompareButton}
                sx={{
                  marginTop: 2,
                  marginLeft: 5,
                  alignSelf: 'flex-end'
                }}
              >
                Comparar
              </Button>
            </div>
            <Grid container spacing={2}>
              {InsuranceCompaniesStatus.map((status: Status, idx: number) => (
                <Grid item xs={4} key={idx}>
                  <CompanyStatus status={status} />
                </Grid>
              ))}
            </Grid>
            {contratarModal}
            <CompararModal
              isOpen={isCompareModalOpen}
              onClose={() => setIsCompareModalOpen(false)}
              selectedPackages={getSelectedPackages()}
            />
          </div>
        );
      case 5:
        return <></>;
      default:
        return null;
    }
  };

  return (
    <div>
      {isLoading ? (
        <>
          {(isLoading) ? <LoadingScreen message="Espere un momento, estamos obteniendo la información necesaria ⏳" /> : <></>}
        </>
      ) : (
        renderForm()
      )}
    </div>
  );


}
