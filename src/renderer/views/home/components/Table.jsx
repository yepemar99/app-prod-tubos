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

const TableTubos = ({
  rows = [],
  total = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  fecha,
}) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <TableContainer variant="outlined">
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Inventory color="primary" />
              <Typography variant="h6">
                Producciones registradas hoy{' '}
                {fecha
                  ? new Date(fecha).toLocaleDateString()
                  : 'Selecciona una fecha'}
              </Typography>
            </Stack>

            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#eee', fontWeight: 'bold' }}>
                    Medida / Tubo
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ bgcolor: '#eee', fontWeight: 'bold' }}
                  >
                    Cant. Tubos ({' '}
                    <Typography component={'span'} color={'success.main'}>
                      Buenos
                    </Typography>{' '}
                    /{' '}
                    <Typography component={'span'} color={'error.main'}>
                      Malos
                    </Typography>{' '}
                    )
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ bgcolor: '#eee', fontWeight: 'bold' }}
                  >
                    Peso Total (Tn)
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ bgcolor: '#eee', fontWeight: 'bold' }}
                  >
                    Num. Producciones
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ bgcolor: '#eee', fontWeight: 'bold' }}
                  >
                    % Taladrina
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.medida}</TableCell>

                    <TableCell align="center">
                      {item.cant_tubos_buenos} / {item.cant_tubos_malos}
                    </TableCell>
                    <TableCell align="center">
                      {Number(item.peso_total_tn || 0).toFixed(3)}
                    </TableCell>
                    <TableCell align="center">
                      {item.num_producciones}
                    </TableCell>
                    <TableCell align="center">
                      {Number(item.concentracion_taladrina || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
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

export default TableTubos;
