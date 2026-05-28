import React, { useState, useEffect, useContext, use } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Stack,
  Divider,
  TextField as TF,
  IconButton,
} from '@mui/material';
import {
  Save,
  ArrowBack,
  Settings,
  Grid4x4,
  Add,
  Today,
} from '@mui/icons-material';
import TextField from '../../../components/common/Textfield';
import Select from '../../../components/common/Select';
import { toast } from 'react-toastify';
import { set, z } from 'zod';
import { DataContext } from '../../../contexts/DataContext';
import diametroImg from '../../../../assets/diamentro.png';
import altoImg from '../../../../assets/altura.png';
import anchoImg from '../../../../assets/ancho.png';
import espesorImg from '../../../../assets/espesor.png';
import redondeoImg from '../../../../assets/redondeo.png';
import reviradoAltImg from '../../../../assets/revidaro.png';
import rectitudImg from '../../../../assets/rectitud.png';
import rectangularidadImg from '../../../../assets/rect.png';
import concavidadImg from '../../../../assets/convac.png';
import Modal from '../../../components/common/Modal';
import TableDimensions from './Table';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import StraightenIcon from '@mui/icons-material/Straighten';
import FactoryIcon from '@mui/icons-material/Factory';
import ArticleIcon from '@mui/icons-material/Article';
import SquareFootIcon from '@mui/icons-material/SquareFoot';

const nominalValuesStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
};

// Esquema de validación Zod adaptado a los campos de la imagen
const controlDimensionalSchema = z.object({
  maquina_id: z.coerce.number().min(1, 'Requerido'),
  calidad_id: z.coerce.number().min(1, 'Requerido'),
  tubo_id: z.coerce.number().min(1, 'Requerido'),
  med_diametro: z.coerce.number().min(0, 'No negativo'),
  med_alto: z.coerce.number().min(0, 'No negativo'),
  med_ancho: z.coerce.number().min(0, 'No negativo'),
  med_espesor: z.coerce.number().min(0, 'No negativo'),
  med_concavidad: z.coerce.number().min(0, 'No negativo'),
  med_rectangularidad: z.coerce.number().min(0, 'No negativo'),
  med_redondeo: z.coerce.number().min(0, 'No negativo'),
  med_revirado_alt: z.coerce.number().min(0, 'No negativo'),
  med_revirado_base: z.coerce.number().min(0, 'No negativo'),
  med_rectitud: z.coerce.number().min(0, 'No negativo'),
  med_longitud: z.coerce.number().min(0, 'No negativo'),
  fecha: z.string().min(1, 'Requerido'),
});

const ControlDimensionalForm = ({
  handleBackMenu = () => {},
  handleControlDID = () => {},
}) => {
  const { maquinas, tiposCalidad, operarios } = useContext(DataContext);

  // Estados locales para la lógica de negocio
  const [tubos, setTubos] = useState([]);
  const [loadingTubos, setLoadingTubos] = useState(false);
  const [tuboSeleccionado, setTuboSeleccionado] = useState(null);
  const [tolerancias, setTolerancias] = useState({});
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  // Paginado de las dimensiones
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const methods = useForm({
    resolver: zodResolver(controlDimensionalSchema),
    defaultValues: {
      maquina_id: 0,
      calidad_id: 0,
      tubo_id: 0,
      med_diametro: '',
      med_alto: '',
      med_ancho: '',
      med_espesor: '',
      med_concavidad: '',
      med_rectangularidad: '',
      med_redondeo: '',
      med_revirado_alt: '',
      med_revirado_base: '',
      med_rectitud: '',
      med_longitud: '',
      fecha: new Date().toISOString().split('T')[0],
    },
  });

  const { handleSubmit, watch, setValue, resetField } = methods;

  const watchMaquinaId = watch('maquina_id');
  const watchCalidadId = watch('calidad_id');
  const watchTuboId = watch('tubo_id');
  const watchFecha = watch('fecha');

  // Observadores para validación visual en tiempo real
  const valoresMedidos = watch([
    'med_diametro',
    'med_alto',
    'med_ancho',
    'med_espesor',
    'med_concavidad',
    'med_rectangularidad',
    'med_redondeo',
    'med_revirado_alt',
    'med_revirado_base',
    'med_rectitud',
    'med_longitud',
  ]);

  const loadGridRecords = async ({
    page,
    pageSize,
    tubo_id,
    maquina_id,
    fecha,
  }) => {
    setLoadingRecords(true);
    try {
      if (tubo_id !== 0 && maquina_id !== 0) {
        const res = await window.api.dimensiones.getAll({
          page: page || 1,
          pageSize: pageSize || 10,
          maquina_id: maquina_id,
          tubo_id: tubo_id,
          fecha: fecha,
        });
        setRecords(res?.data || []);
        setTotalRecords(res?.total || 0);
      } else {
        setRecords([]);
        setTotalRecords(0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1);
    loadGridRecords({
      page: newPage + 1,
      pageSize,
      tubo_id: watchTuboId,
      maquina_id: watchMaquinaId,
      fecha: watchFecha,
    });
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPage(1);
    loadGridRecords({
      page: 1,
      pageSize: newSize,
      tubo_id: watchTuboId,
      maquina_id: watchMaquinaId,
      fecha: watchFecha,
    });
  };

  useEffect(() => {
    const fetchTubos = async () => {
      if (!watchCalidadId || !watchMaquinaId) {
        setTubos([]);
        return;
      }
      try {
        setLoadingTubos(true);
        // Filtrado por calidad
        const result = await window.api.tubos.getAllForSelects({
          calidad_id: watchCalidadId,
        });
        setTubos(result?.data || []);
      } catch (err) {
        toast.error('Error al filtrar tubos');
      } finally {
        setLoadingTubos(false);
      }
    };
    fetchTubos();
    setValue('tubo_id', 0);
    setTuboSeleccionado(null);
  }, [watchCalidadId, watchMaquinaId, setValue]);

  // Paso 2 y 3: Obtención de Nominales y Cálculo de Máximos y Mínimos (Tolerancias)
  useEffect(() => {
    const load = async () => {
      const cargarNominalesYTolerancias = async () => {
        if (!watchTuboId || watchTuboId === 0) {
          setTuboSeleccionado(null);
          return;
        }
        try {
          const result = await window.api.tubos.getById({
            id: watchTuboId,
          });
          const tubo = result?.data;
          setTuboSeleccionado(tubo);

          if (tubo) {
            // Extraer nombre de la calidad seleccionada para aplicar reglas de negocio
            const calidadNombre =
              tiposCalidad.find((c) => c.id === watchCalidadId)?.nombre || '';
            calcularTolerancias(tubo, calidadNombre);
          }
        } catch (err) {
          console.log('Error al obtener especificaciones teóricas', err);
          toast.error('Error al obtener especificaciones teóricas');
        }
      };
      await cargarNominalesYTolerancias();
      await loadGridRecords({
        page,
        pageSize,
        tubo_id: watchTuboId,
        maquina_id: watchMaquinaId,
        fecha: watchFecha,
      });
    };
    load();
  }, [watchTuboId]);

  useEffect(() => {
    loadGridRecords({
      page,
      pageSize,
      tubo_id: watchTuboId,
      maquina_id: watchMaquinaId,
      fecha: watchFecha,
    });
  }, [watchFecha]);

  const calcularTolerancias = (tubo, calidadNombre) => {
    const tols = {};
    const esEstructural = tubo.espesor > 2;

    // A. Reglas para Dimensiones (Alto, Base, Diámetro)
    const dimensiones = ['alto', 'ancho', 'diametro'];
    dimensiones.forEach((dim) => {
      const nominal = tubo[dim] || 0;
      if (
        (nominal > 0 && tubo?.alto > 0 && dim !== 'diametro') ||
        (nominal > 0 && tubo?.alto === 0 && dim === 'diametro')
      ) {
        let margen = 0;
        if (tubo?.alto > 0) {
          if (esEstructural) {
            margen = nominal >= 100 ? nominal * 0.008 : nominal * 0.01;
          } else {
            if (nominal <= 20) margen = 0.2;
            else if (nominal <= 35) margen = 0.25;
            else if (nominal <= 50) margen = 0.3;
            else if (nominal <= 60) margen = 0.35;
            else if (nominal <= 70) margen = 0.4;
            else margen = 0.5;
          }
        } else {
          if (nominal <= 16) margen = 0.12;
          else if (nominal <= 30) margen = 0.15;
          else if (nominal <= 40) margen = 0.2;
          else if (nominal <= 50) margen = 0.25;
          else if (nominal <= 60) margen = 0.3;
          else margen = 0.5;
        }
        tols[dim] = { nominal, min: nominal - margen, max: nominal + margen };
      } else {
        tols[dim] = { nominal: 0, min: 0, max: 0 };
      }
    });

    // Espesor
    const espNominal = tubo.espesor || 0;
    let margenEsp = espNominal > 5 ? 0.5 : espNominal * 0.1;
    tols['espesor'] = {
      nominal: espNominal,
      min: espNominal - margenEsp,
      max: espNominal + margenEsp,
    };

    // Rectangularidad
    tols['rectangularidad'] = {
      nominal: tubo?.alto ? 90 : 0,
      min: tubo?.alto ? 89 : 0,
      max: tubo?.alto ? 91 : 0,
    };

    // Concavidad
    tols['concavidad'] = {
      nominal: 0,
      min: 0,
      max: tubo?.alto ? tubo?.alto * 0.08 : 0,
    };

    // Redondeo de los lados
    let redondeoMax = 0;
    let redondeoMin = 0;
    if (tubo?.alto > 0) {
      if (tubo.espesor > 2) {
        redondeoMax = tubo.espesor * 2.4;
        redondeoMin = tubo.espesor * 1.6;
      } else {
        redondeoMax = tubo.espesor * 1.5;
        redondeoMin = tubo.espesor * 0;
      }
    }
    tols['redondeo'] = {
      nominal: 0,
      min: redondeoMin,
      max: redondeoMax,
    };

    // Revirado Altura
    let reviradoAltMax = 0;
    if (tubo?.alto > 0) {
      if (tubo?.espesor > 2) {
        reviradoAltMax = 2 + (tubo?.longitud * 0.5) / 100;
      } else {
        reviradoAltMax = tubo?.alto <= 30 ? 3 : tubo?.alto * 0.1;
      }
    }
    tols['revirado_alt'] = { nominal: 0, min: 0, max: reviradoAltMax };

    // Revirado Base
    const reviradoBaseMax =
      tubo?.alto > 0 ? (tubo?.ancho <= 30 ? 3 : tubo?.ancho * 0.1) : 0;
    tols['revirado_base'] = { nominal: 0, min: 0, max: reviradoBaseMax };

    // Rectitud
    let maxrectitud = 0;
    if (tubo.espesor > 2) {
      maxrectitud = (tubo.longitud * 0.15) / 100;
    } else if (tubo.alto == 0) {
      maxrectitud = (tubo.longitud * 0.2) / 100;
    } else if (tubo.alto <= 30 && tubo.ancho <= 30) {
      maxrectitud = (tubo.longitud * 0.25) / 100;
    } else {
      maxrectitud = (tubo.longitud * 0.15) / 100;
    }
    tols['rectitud'] = { nominal: 0, min: 0, max: maxrectitud };

    // Longitud: Mínimo nominal, Máximo nominal + margen según espesor y si tiene longitud definida
    let longSum = tubo.longitud ? (tubo?.espesor > 2 ? 15 : 10) : 0;
    const lonNominal = tubo?.longitud || 0;
    tols['longitud'] = {
      nominal: lonNominal,
      min: lonNominal,
      max: lonNominal + longSum,
    };

    setTolerancias(tols);
  };

  // Paso 4: Validación Visual (Retorna estilo rojo si se sale de tolerancias)
  const getInputStyle = (fieldName, value) => {
    if (!value || value === '' || !tolerancias[fieldName]) return {};
    const val = Number(value);
    const { min, max } = tolerancias[fieldName];
    if (val < min || val > max) {
      return {
        backgroundColor: '#ffcdd2',
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'red' },
      };
    }
    return { backgroundColor: '#ffffff' };
  };

  // Paso 5: Inserción de Datos a la BD
  const formatFechaConHora = (fechaString) => {
    const hoy = new Date();
    const diaHoy = String(hoy.getDate()).padStart(2, '0');
    const mesHoy = String(hoy.getMonth() + 1).padStart(2, '0');
    const anoHoy = hoy.getFullYear();
    const fechaHoy = `${anoHoy}-${mesHoy}-${diaHoy}`;

    if (fechaString === fechaHoy) {
      // Es hoy, agregar hora y minutos actuales
      const horas = String(hoy.getHours()).padStart(2, '0');
      const minutos = String(hoy.getMinutes()).padStart(2, '0');
      return `${fechaString} ${horas}:${minutos}`;
    } else {
      // No es hoy, agregar 00:00
      return `${fechaString} 00:00`;
    }
  };

  const onSubmit = async (data) => {
    try {
      const findTubo = tubos.find((t) => t.id === data.tubo_id);
      const tipoId = findTubo?.tipo_id || 0;
      if (!tipoId || !findTubo) {
        toast.error('Tubo no encontrado o sin tipo definido');
        return;
      }

      const esRedondo = tipoId === 3 || tipoId === 4;
      const esEstructural = findTubo.espesor > 2;

      if (!data?.med_espesor || !data?.med_rectitud || !data?.med_longitud) {
        setError('Los campos de espesor, rectitud y longitud son obligatorios');
        return;
      }

      if (esRedondo) {
        if (!data?.med_diametro) {
          setError(
            'El campo diámetro es obligatorio para tubos redondos u otras formas',
          );
          return;
        }
      } else {
        if (
          !data?.med_alto ||
          !data?.med_ancho ||
          !data?.med_redondeo ||
          !data?.med_rectangularidad ||
          !data?.med_revirado_alt ||
          !data?.med_revirado_base
        ) {
          setError(
            'Todos los campos de medida son obligatorios para este tipo de tubo',
          );
          return;
        }
        if (esEstructural && !data?.med_concavidad) {
          setError(
            'El campo concavidad es obligatorio para tubos estructurales',
          );
          return;
        }
      }

      const payload = {
        fecha: formatFechaConHora(data.fecha),
        maquina_id: data.maquina_id,
        calidad_id: data.calidad_id,
        tubo_id: data.tubo_id,
        operario_id: data.operario_id,
        medida_hb: data?.med_ancho ? data.med_ancho : 0,
        medida_de: data?.med_diametro ? data.med_diametro : 0,
        medida_va: data?.med_alto ? data.med_alto : 0,
        medida_rectang: data?.med_rectangularidad
          ? data.med_rectangularidad
          : 0,
        medida_espesor: data?.med_espesor ? data.med_espesor : 0,
        medida_conv: data?.med_concavidad ? data.med_concavidad : 0,
        medida_redondeo: data?.med_redondeo ? data.med_redondeo : 0,
        medida_revirado_alt: data?.med_revirado_alt ? data.med_revirado_alt : 0,
        medida_revirado_base: data?.med_revirado_base
          ? data.med_revirado_base
          : 0,
        medida_rectitud: data?.med_rectitud ? data.med_rectitud : 0,
        medida_long: data?.med_longitud ? data.med_longitud : 0,
      };
      const result = await window.api.dimensiones.crear(payload);
      handleControlDID(result?.data?.id);

      if (!result?.success)
        throw new Error(result?.error || 'Error al guardar');
      toast.success('Control dimensional guardado con éxito');

      // Limpiar campos de medida e inspección
      const camposAMedir = [
        'med_diametro',
        'med_alto',
        'med_ancho',
        'med_espesor',
        'med_concavidad',
        'med_rectangularidad',
        'med_redondeo',
        'med_revirado_alt',
        'med_revirado_base',
        'med_rectitud',
        'med_longitud',
      ];
      camposAMedir.forEach((campo) => resetField(campo));

      setPage(1);
      setPageSize(10);
      await loadGridRecords({
        page: 1,
        pageSize: 10,
        tubo_id: watchTuboId,
        maquina_id: watchMaquinaId,
        fecha: watchFecha,
      });
    } catch (error) {
      toast.error(error.message || 'Error al conectar con SQL Server');
    }
  };

  // Mapeo de dimensiones a imágenes
  const imageAssets = {
    diametro: diametroImg,
    alto: altoImg,
    ancho: anchoImg,
    espesor: espesorImg,
    concavidad: concavidadImg,
    rectangularidad: rectangularidadImg,
    redondeo: redondeoImg,
    revirado_alt: reviradoAltImg,
    revirado_base: reviradoAltImg,
    rectitud: rectitudImg,
    longitud: '',
  };

  // Helper para renderizar las columnas de control dimensional idénticas al layout SCADA de Access
  const renderDimensionCol = (
    key,
    label,
    unit,
    error = false,
    isVisible = true,
  ) => {
    if (!isVisible) return null;
    const tol = tolerancias[key] || { nominal: '-', min: '-', max: '-' };
    const imgPath = imageAssets[key];

    return (
      <Box sx={{ textAlign: 'center', flex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 'bold',
            display: 'block',
            height: 27,
            lineHeight: '1.1',
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 'bold',
            display: 'block',
            lineHeight: '1.0',
            mb: 0.5,
          }}
        >
          {unit ? `(${unit})` : ''}
        </Typography>

        {/* Gráfico / Icono guía */}
        <Box
          sx={{
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            my: 0.5,
            border: '1px dashed #ccc',
            borderRadius: 1,
            bgcolor: '#fafafa',
          }}
        >
          {imgPath && (
            <img
              src={imgPath}
              alt={label}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
          )}
        </Box>

        {/* Input Medido */}
        <TextField
          size="small"
          name={`med_${key}`}
          type="number"
          inputProps={{ step: 'any' }}
          sx={getInputStyle(key, valoresMedidos[[`med_${key}`]])}
          error={error}
        />

        {/* Bloque Informativo de Tolerancias */}
        <Box
          sx={{
            mt: 1,
            bgcolor: '#f1f1f1',
            borderRadius: 1,
            p: 0.5,
            fontSize: '11px',
          }}
        >
          <Typography
            sx={{ fontSize: '12px', fontWeight: 'bold' }}
            color="blue"
          >
            Max:{' '}
            {typeof tol.max === 'number'
              ? key === 'longitud'
                ? tol.max.toFixed(0)
                : tol.max.toFixed(1)
              : tol.max}
          </Typography>
          <Typography color="red" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
            Min:{' '}
            {typeof tol.min === 'number'
              ? key === 'longitud'
                ? tol.min.toFixed(0)
                : tol.min.toFixed(1)
              : tol.min}
          </Typography>
        </Box>
      </Box>
    );
  };

  const esRedondo =
    tuboSeleccionado?.tipo_id === 3 || tuboSeleccionado?.tipo_id === 4;
  const esEstructural = tuboSeleccionado?.espesor > 2 && !esRedondo;

  const watchFields = watch([
    'med_diametro',
    'med_alto',
    'med_ancho',
    'med_espesor',
    'med_concavidad',
    'med_rectangularidad',
    'med_redondeo',
    'med_revirado_alt',
    'med_revirado_base',
    'med_rectitud',
    'med_longitud',
  ]);

  return (
    <FormProvider {...methods}>
      <Modal
        showCustom
        title={'Error de Validación'}
        open={error !== null && error !== ''}
        handleCustom={() => {
          setError(null);
        }}
      >
        <Typography>{error}</Typography>
      </Modal>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ minHeight: '100vh', p: 2 }}
      >
        {/* SECCIÓN 1: CABECERA Y BOTÓN DE RETORNO */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" gap={1} alignItems="center">
              <DesignServicesIcon color="primary" />
              <Typography variant="h6">Control dimensional</Typography>
            </Stack>
            <Stack direction="row" gap={1} alignItems="center">
              <TextField size="small" name="fecha" type="date" label="Fecha" />
              <Button
                sx={{ minWidth: '120px' }}
                variant="contained"
                color="primary"
                startIcon={<FactoryIcon />}
                onClick={handleBackMenu}
                size="small"
              >
                Producción
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* SECCIÓN 2: SELECTORES DE FILTRO (Máquina, Calidad, Tubo) */}
        <Stack gap={2}>
          <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2 }}
              alignItems="center"
            >
              <ArticleIcon color="primary" />
              <Typography variant="h6">Registro</Typography>
            </Stack>
            <Stack>
              <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Select
                    size="small"
                    name="maquina_id"
                    label="Máquina"
                    options={maquinas.map((m) => ({
                      value: m.id,
                      label: m.maquina,
                    }))}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Select
                    size="small"
                    name="calidad_id"
                    label="Calidad"
                    options={tiposCalidad.map((c) => ({
                      value: c.id,
                      label: c.nombre,
                    }))}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Select
                    size="small"
                    name="tubo_id"
                    label="Tubo"
                    loading={loadingTubos}
                    disabled={tubos.length === 0}
                    options={tubos.map((t) => ({
                      value: t.id,
                      label: t.medida,
                    }))}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Paper>
          <Paper
            variant="outlined"
            sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1 }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2 }}
              alignItems="center"
            >
              <StraightenIcon color="primary" />
              <Typography variant="h6">Medidas nominales</Typography>
            </Stack>
            <Stack sx={{ flex: 1 }}>
              <Grid
                sx={{ width: '100%' }}
                container
                spacing={2}
                alignItems="center"
              >
                {!esRedondo && (
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Stack flexDirection="column">
                      <Typography sx={nominalValuesStyle} textAlign={'center'}>
                        Altura (mm)
                      </Typography>
                      <Typography sx={nominalValuesStyle} textAlign={'center'}>
                        H
                      </Typography>
                      <Typography sx={nominalValuesStyle} textAlign={'center'}>
                        {tolerancias?.alto?.nominal
                          ? tolerancias?.alto?.nominal.toFixed(0)
                          : '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                )}

                <Grid size={{ xs: 12, sm: !esRedondo ? 3 : 4 }}>
                  <Stack flexDirection="column">
                    <Typography sx={nominalValuesStyle} textAlign={'center'}>
                      {esRedondo ? 'Diámetro (mm)' : 'Base (mm)'}
                    </Typography>
                    <Typography sx={nominalValuesStyle} textAlign={'center'}>
                      B
                    </Typography>
                    {esRedondo ? (
                      <Typography sx={nominalValuesStyle} textAlign={'center'}>
                        {tolerancias?.diametro?.nominal
                          ? tolerancias?.diametro?.nominal.toFixed(0)
                          : '-'}
                      </Typography>
                    ) : (
                      <Typography sx={nominalValuesStyle} textAlign={'center'}>
                        {tolerancias?.ancho?.nominal
                          ? tolerancias?.ancho?.nominal.toFixed(0)
                          : '-'}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: !esRedondo ? 3 : 4 }}>
                  <Stack flexDirection="column">
                    <Typography sx={nominalValuesStyle} textAlign={'center'}>
                      Espesor (mm)
                    </Typography>
                    <Typography sx={nominalValuesStyle} textAlign={'center'}>
                      T
                    </Typography>
                    <Typography sx={nominalValuesStyle} textAlign={'center'}>
                      {tolerancias?.espesor?.nominal
                        ? tolerancias?.espesor?.nominal.toFixed(0)
                        : '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: esRedondo ? 4 : 3 }}>
                  <Stack flexDirection="column">
                    <Typography sx={nominalValuesStyle} textAlign={'center'}>
                      Longitud (mm)
                    </Typography>
                    <Typography sx={nominalValuesStyle} textAlign={'center'}>
                      L
                    </Typography>
                    <Typography sx={nominalValuesStyle} textAlign={'center'}>
                      {tolerancias?.longitud?.nominal
                        ? tolerancias?.longitud?.nominal.toFixed(0)
                        : '-'}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Stack>

        {/* SECCIÓN 3 Y 4: CONTROL DIMENSIONAL DINÁMICO CON APOYO VISUAL Y COMPARADOR */}

        <Paper variant="outlined" sx={{ p: 2, mt: 2, overflowX: 'auto' }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <SquareFootIcon color="primary" />
            <Typography variant="h6">Medidas reales</Typography>
          </Stack>
          {!tuboSeleccionado && (
            <Stack justifyContent={'center'} alignItems={'center'}>
              <Typography
                sx={{ my: 5, fontWeight: 600 }}
                color="text.secondary"
              >
                Por favor, seleccione un tubo para ver sus dimensiones.
              </Typography>
            </Stack>
          )}

          {tuboSeleccionado && (
            <Box>
              <Stack gap={1}>
                {/* Renderizado condicional según tipo de geometría (Paso 1C) */}
                {renderDimensionCol(
                  'diametro',
                  'DIÁMETRO',
                  'mm',
                  watchFields[0] === '' ||
                    watchFields[0] > tolerancias?.diametro?.max ||
                    watchFields[0] < tolerancias?.diametro?.min,
                  esRedondo,
                )}
                {renderDimensionCol(
                  'alto',
                  'ALTURA',
                  'mm',
                  watchFields[1] === '' ||
                    watchFields[1] > tolerancias?.alto?.max ||
                    watchFields[1] < tolerancias?.alto?.min,
                  !esRedondo,
                )}
                {renderDimensionCol(
                  'ancho',
                  'BASE',
                  'mm',
                  watchFields[2] === '' ||
                    watchFields[2] > tolerancias?.ancho?.max ||
                    watchFields[2] < tolerancias?.ancho?.min,
                  !esRedondo,
                )}

                {renderDimensionCol(
                  'espesor',
                  'ESPESOR',
                  'mm',
                  watchFields[3] === '' ||
                    watchFields[3] > tolerancias?.espesor?.max ||
                    watchFields[3] < tolerancias?.espesor?.min,
                  !esRedondo,
                )}
                {renderDimensionCol(
                  'concavidad',
                  'CONCAVIDAD/CONVEXIDAD',
                  'mm',
                  watchFields[4] === '' ||
                    watchFields[4] > tolerancias?.concavidad?.max ||
                    watchFields[4] < tolerancias?.concavidad?.min,
                  esEstructural,
                )}
                {renderDimensionCol(
                  'rectangularidad',
                  'RECTANGULARIDAD DE LOS LADOS.',
                  '°',
                  watchFields[5] === '' ||
                    watchFields[5] > tolerancias?.rectangularidad?.max ||
                    watchFields[5] < tolerancias?.rectangularidad?.min,
                  !esRedondo,
                )}
                {renderDimensionCol(
                  'redondeo',
                  'REDONDEO ESQUINAS',
                  'mm',
                  watchFields[6] === '' ||
                    watchFields[6] > tolerancias?.redondeo?.max ||
                    watchFields[6] < tolerancias?.redondeo?.min,
                  !esRedondo,
                )}
                {renderDimensionCol(
                  'revirado_alt',
                  'REVIRADO ALTURA',
                  'mm',
                  watchFields[7] === '' ||
                    watchFields[7] > tolerancias?.revirado_alt?.max ||
                    watchFields[7] < tolerancias?.revirado_alt?.min,
                  !esRedondo,
                )}
                {renderDimensionCol(
                  'revirado_base',
                  'REVIRADO BASE',
                  'mm',
                  watchFields[8] === '' ||
                    watchFields[8] > tolerancias?.revirado_base?.max ||
                    watchFields[8] < tolerancias?.revirado_base?.min,
                  !esRedondo,
                )}
                {renderDimensionCol(
                  'rectitud',
                  'RECTITUD',
                  'mm',
                  watchFields[9] === '' ||
                    watchFields[9] > tolerancias?.rectitud?.max ||
                    watchFields[9] < tolerancias?.rectitud?.min,
                )}
                {renderDimensionCol(
                  'longitud',
                  'LONGITUD',
                  'mm',
                  watchFields[10] === '' ||
                    watchFields[10] > tolerancias?.longitud?.max ||
                    watchFields[10] < tolerancias?.longitud?.min,
                )}
              </Stack>
            </Box>
          )}
        </Paper>
        <Stack mt={1} justifyContent={'flex-end'}>
          <Button
            disabled={!tuboSeleccionado}
            type="submit"
            variant="contained"
            size="small"
            startIcon={<Add />}
          >
            Agregar
          </Button>
        </Stack>

        {/* SECCIÓN 5: GRID CON REGISTROS ANTERIORES DE LA MÁQUINA */}
        <Box sx={{ mt: 2 }}>
          <TableDimensions
            tubo={tuboSeleccionado}
            rows={records}
            total={totalRecords}
            page={page}
            rowsPerPage={pageSize}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handlePageSizeChange}
            fecha={watchFecha}
          />
        </Box>
      </Box>
    </FormProvider>
  );
};

export default ControlDimensionalForm;
