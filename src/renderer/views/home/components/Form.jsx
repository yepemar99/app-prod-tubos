import React, { useState, useEffect, useContext } from 'react';
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
  Alert,
} from '@mui/material';
import {
  Save,
  PrecisionManufacturing,
  Straighten,
  SettingsInputComponent,
  Info,
  Person,
  RemoveRedEye,
} from '@mui/icons-material';
import TextField from '../../../components/common/Textfield';
import Select from '../../../components/common/Select';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import TableTubos from './Table';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import { DataContext } from '../../../contexts/DataContext';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import Modal from '../../../components/common/Modal';
import { formatDateForInput } from '../../../utils/functions';

// Esquema de validación
const produccionSchema = z.object({
  operario_id: z.number().min(1, 'Requerido'),
  turno_id: z.number().min(1, 'Requerido'),
  maquina_id: z.number().min(1, 'Requerido'),
  fecha: z.string().min(1, 'Requerido'),
  calidad_id: z.number().min(1, 'Requerido'),
  tubo_id: z.number().min(1, 'Requerido'),
  tubos_buenos: z.coerce.number().min(1, 'Requerido'),
  tubos_rechazo: z.coerce.number().min(1, 'Requerido'),
  concentracion: z.coerce.number().min(0, 'Requerido'),
  observaciones: z.string().optional(),
});

const ProduccionTuboForm = ({
  handleToggleControl = () => {},
  handleControlDID = () => {},
  contolDID = '',
}) => {
  const { operarios, maquinas, tiposCalidad, turnos, loading } =
    useContext(DataContext);
  const [tubos, setTubos] = useState([]);
  const [loadingTubos, setLoadingTubos] = useState([]);
  const [loadigTuboSeleccionado, setLoadingTuboSeleccionado] = useState([]);
  const [tuboSeleccionado, setTuboSeleccionado] = useState(null);
  const [flejeSeleccionado, setFlejeSeleccionado] = useState(null);
  const [produccionRows, setProduccionRows] = useState([]);
  const [produccionTotal, setProduccionTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  console.log('contolDID', contolDID);

  const methods = useForm({
    resolver: zodResolver(produccionSchema),
    defaultValues: {
      fecha: new Date().toISOString().split('T')[0],
      operario_id: 0,
      turno_id: 1,
      maquina_id: 0,
      calidad_id: 0,
      tubo_id: 0,
      tubos_buenos: 0,
      tubos_rechazo: 0,
      concentracion: 7,
      observaciones: '',
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  const watchCalidadId = watch('calidad_id');
  const watchTuboId = watch('tubo_id');
  const watchFecha = watch('fecha');
  const watchBuenos = watch('tubos_buenos');
  const watchRechazo = watch('tubos_rechazo');
  const watchConcentracion = watch('concentracion');

  const loadProduccionAgrupada = async ({
    fecha,
    pageValue,
    pageSizeValue,
  }) => {
    if (!fecha) {
      setProduccionRows([]);
      setProduccionTotal(0);
      return;
    }

    try {
      const result = await window.api.tubos.getProduccionAgrupadaPorTubo({
        fecha,
        page: pageValue,
        pageSize: pageSizeValue,
      });

      if (!result?.success) {
        throw new Error(result?.error || 'No se pudo cargar la produccion');
      }

      setProduccionRows(result?.data || []);
      setProduccionTotal(Number(result?.total || 0));
    } catch (error) {
      setProduccionRows([]);
      setProduccionTotal(0);
      toast.error(error?.message || 'Error cargando produccion agrupada');
    }
  };

  const loadTubos = async (calidadId) => {
    if (!calidadId) return;
    try {
      setLoadingTubos(true);
      const result = await window.api.tubos.getAllForSelects({
        calidad_id: calidadId,
      });
      console.log('result', result);
      setTubos(result?.data || []);
    } catch (err) {
      toast.error('Error al cargar tubos');
    } finally {
      setLoadingTubos(false);
    }
  };

  const loadTuboById = async (tuboId) => {
    if (!tuboId) return;
    try {
      setLoadingTuboSeleccionado(true);
      const result = await window.api.tubos.getById({ id: tuboId });
      console.log('result tubo', result);
      setTuboSeleccionado(result?.data || null);
      setLoadingTuboSeleccionado(false);
    } catch (err) {
      toast.error('Error al cargar detalles del tubo');
    }
  };

  useEffect(() => {
    loadTubos(watchCalidadId);
    setValue('tubo_id', 0);
  }, [watchCalidadId, setValue]);

  useEffect(() => {
    loadTuboById(watchTuboId);
  }, [watchTuboId]);

  useEffect(() => {
    setPage(0);
  }, [watchFecha]);

  useEffect(() => {
    loadProduccionAgrupada({
      fecha: watchFecha,
      pageValue: page + 1,
      pageSizeValue: rowsPerPage,
    });
  }, [watchFecha, page, rowsPerPage]);

  const totalTubos = Number(watchBuenos) + Number(watchRechazo);
  const pesoTotalProducidoTn = tuboSeleccionado
    ? ((tuboSeleccionado.peso_unitario * watchBuenos) / 1000).toFixed(2)
    : '0.00';
  const paquetesRealizados = tuboSeleccionado?.num_por_paq
    ? (Number(watchBuenos) / Number(tuboSeleccionado.num_por_paq)).toFixed(1)
    : '0.0';
  const pesoMedioPorPaqueteKg =
    tuboSeleccionado && parseFloat(paquetesRealizados) > 0
      ? (
          Number(pesoTotalProducidoTn * 1000) / parseFloat(paquetesRealizados)
        ).toFixed(2)
      : '0.00';
  const flejeConsumidoTn = tuboSeleccionado
    ? ((tuboSeleccionado.peso_unitario * totalTubos) / 1000).toFixed(2)
    : '0.00';

  const onSubmit = async (data) => {
    try {
      // Conformar el lote
      const dateData = formatDateForInput(data);
      const fechaLote = `${dateData?.dd || ''}${dateData?.mm || ''}${dateData?.aa || ''}`;
      const maquina = maquinas.find((m) => m.id === data.maquina_id);
      const turno = turnos.find((t) => t.id === data.turno_id);

      const payload = {
        control_dimensional_id: Number(contolDID),
        operario_id: Number(data.operario_id),
        turno_id: Number(data.turno_id),
        maquina_id: Number(data.maquina_id),
        tubo_id: Number(data.tubo_id),
        cant_tubos_buenos: Number(data.tubos_buenos),
        cant_tubos_malos: Number(data.tubos_rechazo),
        concentracion_taladrina: Number(data.concentracion),
        observacion: data.observaciones || '',
        lote: `L${maquina?.maquina}${fechaLote}${turno?.prefijo}`,
        creado: data.fecha,
      };

      const resultDimension = await window.api.dimensiones.getAll({
        page: 1,
        pageSize: 1,
        id: Number(contolDID || -1),
        tubo_id: Number(data.tubo_id),
        fecha: data.fecha,
      });

      if (
        !resultDimension?.success ||
        resultDimension?.data?.length === 0 ||
        !contolDID
      ) {
        setError(
          'No se han realizado las medidas para esta producción. Por favor, ingresa un control dimensional antes de guardar.',
        );
        setShowErrorModal(true);
        return;
      }

      const result = await window.api.tubos.saveProduccion(payload);

      if (!result?.success) {
        throw new Error(result?.error || 'No se pudo guardar el registro');
      }

      handleControlDID('');

      toast.success('Registro guardado correctamente');
      loadProduccionAgrupada({
        fecha: data.fecha,
        pageValue: page + 1,
        pageSizeValue: rowsPerPage,
      });
    } catch (error) {
      toast.error(error?.message || 'Error al guardar la produccion');
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* CABECERA */}
          <Grid size={{ xs: 12 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent={'space-between'}
                sx={{ mb: 2 }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 2, my: 'auto' }}
                >
                  <Person color="primary" />
                  <Typography variant="h6">Control de Producción</Typography>
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent={'flex-end'}
                >
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<DesignServicesIcon />}
                    onClick={handleToggleControl}
                  >
                    Control Dimensional
                  </Button>
                </Stack>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Select
                    size="small"
                    name="operario_id"
                    label="Operario"
                    options={operarios.map((o) => ({
                      value: o.id,
                      label: o.nombre + ' ' + o.apellido1 + ' ' + o.apellido2,
                    }))}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Select
                    size="small"
                    name="turno_id"
                    label="Turno"
                    options={turnos.map((t) => ({
                      value: t.id,
                      label: t.horario,
                    }))}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
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
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    size="small"
                    name="fecha"
                    type="date"
                    label="Fecha"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* DATOS DEL TUBO */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <PanoramaFishEyeIcon color="primary" />
                <Typography variant="h6">Especificaciones del Tubo</Typography>
              </Stack>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Select
                    size="small"
                    name="calidad_id"
                    label="Calidad del Acero"
                    options={tiposCalidad.map((c) => ({
                      value: c.id,
                      label: c.nombre,
                    }))}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Select
                    size="small"
                    name="tubo_id"
                    label="Medida del Tubo"
                    loading={loadingTubos}
                    disabled={tubos?.length === 0 || !watchCalidadId}
                    options={
                      tubos?.map((t) => ({
                        value: t.id,
                        label: t.medida,
                      })) || []
                    }
                  />
                </Grid>

                {/* Campos dinámicos según tipo de tubo */}
                <Grid size={{ xs: tuboSeleccionado?.tipo_id === 3 ? 4 : 3 }}>
                  <TF
                    disabled
                    size="small"
                    value={tuboSeleccionado?.espesor || ''}
                    type="number"
                    label="Espesor (mm)"
                    fullWidth
                  />
                </Grid>

                {tuboSeleccionado?.tipo_id === 3 ? (
                  <Grid size={{ xs: 4 }}>
                    <TF
                      size="small"
                      label="Diámetro (mm)"
                      value={tuboSeleccionado?.diametro || 0}
                      type="number"
                      disabled
                      fullWidth
                    />
                  </Grid>
                ) : (
                  <>
                    <Grid size={{ xs: 3 }}>
                      <TF
                        label="Alto (mm)"
                        size="small"
                        value={tuboSeleccionado?.alto || ''}
                        type="number"
                        disabled
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                      <TF
                        label="Ancho (mm)"
                        size="small"
                        value={tuboSeleccionado?.ancho || ''}
                        type="number"
                        disabled
                        fullWidth
                      />
                    </Grid>
                  </>
                )}

                <Grid size={{ xs: tuboSeleccionado?.tipo_id === 3 ? 4 : 3 }}>
                  <TF
                    label="Peso por Tubo (kg)"
                    size="small"
                    type="number"
                    value={tuboSeleccionado?.peso_unitario || ''}
                    disabled
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                Contadores de Producción
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    size="small"
                    name="tubos_buenos"
                    label="Tubos Buenos (Uds)"
                    type="number"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    size="small"
                    name="tubos_rechazo"
                    label="Tubos Rechazo (Uds)"
                    type="number"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    size="small"
                    name="concentracion"
                    label="% Taladrina (entre 6 y 8)"
                    type="number"
                    error={
                      Number(watchConcentracion) < 6 ||
                      Number(watchConcentracion) > 8
                    }
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* DATOS DEL FLEJE Y RESULTADOS */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack sx={{ height: '100%' }} flexDirection={'column'} gap={2}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <ViewColumnIcon color="primary" />
                  <Typography variant="h6">
                    Especificaciones del Fleje
                  </Typography>
                </Stack>
                <Grid spacing={2} container>
                  <Grid size={{ xs: 6 }}>
                    <TF
                      size="small"
                      label="Fleje Asociado"
                      value={tuboSeleccionado?.fleje?.concepto || ''}
                      disabled
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 3 }}>
                    <TF
                      size="small"
                      label="Ancho (mm)"
                      value={tuboSeleccionado?.fleje?.ancho || '0'}
                      disabled
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 3 }}>
                    <TF
                      size="small"
                      label="Espesor (mm)"
                      value={tuboSeleccionado?.fleje?.espesor || '0'}
                      disabled
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Paper>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  bgcolor: '#e3f2fd',
                }}
              >
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack
                      flexDirection={'column'}
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{ fontWeight: 'bold' }}
                        color="textSecondary"
                      >
                        Peso Total Producido
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 'bold', color: '#1565c0' }}
                      >
                        {pesoTotalProducidoTn}{' '}
                        <span style={{ fontSize: '1rem' }}>Tn</span>
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack
                      flexDirection={'column'}
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{ fontWeight: 'bold' }}
                        color="textSecondary"
                      >
                        Paquetes realizados
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 'bold', color: '#1565c0' }}
                      >
                        {paquetesRealizados}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack
                      flexDirection={'column'}
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{ fontWeight: 'bold' }}
                        color="textSecondary"
                      >
                        Peso medio por paquete
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 'bold', color: '#1565c0' }}
                      >
                        {pesoMedioPorPaqueteKg}{' '}
                        <span style={{ fontSize: '1rem' }}>Kg</span>
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack
                      flexDirection={'column'}
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{ fontWeight: 'bold' }}
                        color="textSecondary"
                      >
                        Total de peso en flejes gastados
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 'bold', color: '#1565c0' }}
                      >
                        {flejeConsumidoTn}{' '}
                        <span style={{ fontSize: '1rem' }}>Tn</span>
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <RemoveRedEye color="primary" />
                <Typography variant="h6">Observación</Typography>
              </Stack>
              <TextField
                size="small"
                name="observaciones"
                label="Incidencias del Turno"
                multiline
                rows={3}
                fullWidth
              />
            </Paper>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Stack justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                size={'small'}
                type="submit"
                startIcon={<Save />}
              >
                Guardar Registro
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Modal
          showCustom
          title={'Error al guardar producción'}
          open={error !== null && error !== ''}
          handleCustom={() => {
            setError(null);
          }}
        >
          <Typography>{error}</Typography>
        </Modal>
        <TableTubos
          rows={produccionRows}
          total={produccionTotal}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          fecha={watchFecha}
        />
      </Box>
    </FormProvider>
  );
};

export default ProduccionTuboForm;
