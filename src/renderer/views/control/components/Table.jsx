import { Inventory } from '@mui/icons-material';
import {
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';

const formatFechaHora = (value) => {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

const TableDimensions = ({
  tubo,
  rows = [],
  total = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  fecha,
}) => {
  const esRedondo = tubo?.tipo_id === 3 || tubo?.tipo_id === 4;
  const esEstructural = tubo?.espesor > 2 && !esRedondo;
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <TableContainer variant="outlined" sx={{ overflowX: 'auto' }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Inventory color="primary" />
              <Typography variant="h6">
                {fecha
                  ? 'Mediciones del ' + new Date(fecha).toLocaleDateString()
                  : 'Selecciona una fecha'}
              </Typography>
            </Stack>

            <Table stickyHeader size="small" sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: '#eee',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Fecha
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: '#eee',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Maq
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: '#eee',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Tubo
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: '#eee',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Dimensiones Exteriores (mm)
                  </TableCell>
                  {!esRedondo && (
                    <TableCell
                      align="center"
                      sx={{
                        bgcolor: '#eee',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Altura (mm)
                    </TableCell>
                  )}
                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: '#eee',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Espesor (mm)
                  </TableCell>
                  {esEstructural && (
                    <TableCell
                      align="center"
                      sx={{
                        bgcolor: '#eee',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Concav/Concex (mm)
                    </TableCell>
                  )}
                  {!esRedondo && (
                    <TableCell
                      align="center"
                      sx={{
                        bgcolor: '#eee',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Rectang (mm)
                    </TableCell>
                  )}
                  {!esRedondo && (
                    <TableCell
                      align="center"
                      sx={{
                        bgcolor: '#eee',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Red (°)
                    </TableCell>
                  )}
                  {!esRedondo && (
                    <TableCell
                      align="center"
                      sx={{
                        bgcolor: '#eee',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Rev (mm)
                    </TableCell>
                  )}
                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: '#eee',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Rectitud (mm)
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: '#eee',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Longitud (mm)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {formatFechaHora(item.creado)}
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      {item?.maquina || '-'}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {item?.tubo || '-'}
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      {item?.alto == 0
                        ? item?.medida_de
                          ? item?.medida_de.toFixed(1) || '-'
                          : item?.medida_hb
                            ? item?.medida_hb.toFixed(1) || '-'
                            : '-'
                        : item?.medida_hb
                          ? item?.medida_hb.toFixed(1) || '-'
                          : item?.medida_de
                            ? item?.medida_de.toFixed(1) || '-'
                            : '-'}
                    </TableCell>
                    {!esRedondo && (
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                        {item?.medida_va
                          ? item?.medida_va.toFixed(1) || '-'
                          : '-'}
                      </TableCell>
                    )}

                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      {item?.medida_espesor
                        ? item?.medida_espesor.toFixed(1) || '-'
                        : '-'}
                    </TableCell>
                    {esEstructural && (
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                        {item?.medida_conv
                          ? item?.medida_conv.toFixed(1) || '-'
                          : '-'}
                      </TableCell>
                    )}
                    {!esRedondo && (
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                        {item?.medida_rectang
                          ? item?.medida_rectang.toFixed(1) || '-'
                          : '-'}
                      </TableCell>
                    )}
                    {!esRedondo && (
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                        {item?.medida_redondeo
                          ? item?.medida_redondeo.toFixed(1) || '-'
                          : '-'}
                      </TableCell>
                    )}
                    {!esRedondo && (
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                        {item?.medida_revirado_alt > item?.medida_revirado_base
                          ? item?.medida_revirado_alt
                            ? item?.medida_revirado_alt.toFixed(1) || '-'
                            : '-'
                          : item?.medida_revirado_base
                            ? item?.medida_revirado_base.toFixed(1) || '-'
                            : '-'}
                      </TableCell>
                    )}
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      {item?.medida_rectitud
                        ? item?.medida_rectitud.toFixed(1) || '-'
                        : '-'}
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      {item?.medida_long
                        ? item?.medida_long.toFixed(0) || '-'
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={esRedondo ? 8 : esEstructural ? 12 : 11}
                      align="center"
                      sx={{ py: 3, color: 'gray' }}
                    >
                      No hay tubos registrados para esta fecha
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 20, 50]}
            labelRowsPerPage="Filas por página"
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TableDimensions;
