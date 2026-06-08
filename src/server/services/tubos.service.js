import database from '../../db/database';
import { app, BrowserWindow } from 'electron';
import fs from 'fs';
import pathModule from 'path';
import { ROWS_PER_PAGE_TEMPLATE } from '../utils/constants';
import { actualizarInventarioPorProduccion } from './inventario.service';
import { orderQuery } from '../utils/functions';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatPeso(value = 0) {
  return `${Number(value).toFixed(2)} Tn`;
}

function escapeSqlString(value = '') {
  return String(value).replace(/'/g, "''");
}

function resolveTemplatePath() {
  const candidates = [
    pathModule.join(
      app.getAppPath(),
      'src',
      'server',
      'plantillas',
      'informe_tubos.html',
    ),
    pathModule.join(
      app.getAppPath(),
      'server',
      'plantillas',
      'informe_tubos.html',
    ),
    pathModule.join(__dirname, '..', 'plantillas', 'informe_tubos.html'),
  ];

  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    throw new Error('No se encontro la plantilla informe_tubos.html');
  }

  return found;
}

function resolveOutputFilePath(destinationPath = '') {
  const resolvedDestination = destinationPath?.trim()
    ? pathModule.resolve(destinationPath)
    : app.getAppPath();

  const extension = pathModule.extname(resolvedDestination).toLowerCase();
  if (extension === '.pdf') {
    return resolvedDestination;
  }

  const stamp = new Date().toISOString().replace(/[.:]/g, '-');
  return pathModule.join(resolvedDestination, `informe-tubos-${stamp}.pdf`);
}

export async function listarTodosTubosService({ calidad_id = null }) {
  try {
    const conn = database.getConnection();

    let whereClauses = ['1=1'];

    if (calidad_id && calidad_id !== 0) {
      whereClauses.push(`t.calidad_id = ${calidad_id}`);
    }
    const whereSQL = whereClauses.join(' AND ');
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM Tubos as t
      LEFT JOIN Tipos_Calidad AS tc ON t.calidad_id = tc.id
      LEFT JOIN Tipos_Tubos AS tt ON t.tipo_id = tt.id
      LEFT JOIN Tubos_Maquinas AS tm ON t.id = tm.tubo_id
      WHERE ${whereSQL}
    `;
    const countResult = await conn.query(countQuery);
    const total = countResult[0]?.total ? Number(countResult[0].total) : 0;

    let orderBySQL = orderQuery({
      secondaryOrderCols: [
        'tc.nombre',
        't.espesor',
        'tt.nombre',
        't.ancho',
        't.alto',
        't.diametro',
        't.id',
      ],
      safeOrderBy: '',
      safeOrderDir: 'ASC',
    });

    const selectQuery = `
      SELECT
        t.id,
        t.medida,
        t.calidad_id,
        t.tipo_id
      FROM Tubos as t
      LEFT JOIN Tipos_Calidad AS tc ON t.calidad_id = tc.id
      LEFT JOIN Tipos_Tubos AS tt ON t.tipo_id = tt.id
      WHERE ${whereSQL}
      ${orderBySQL ? `ORDER BY ${orderBySQL}` : 'ORDER BY creado DESC'}
    `;

    const rows = await conn.query(selectQuery);

    return {
      data: rows.map((row) => ({
        id: Number(row.id),
        medida: row.medida,
        calidad_id: row.calidad_id ? Number(row.calidad_id) : null,
        tipo_id: row.tipo_id ? Number(row.tipo_id) : null,
      })),
      total,
    };
  } catch (error) {
    console.error('Error listando tubos:', error.message);
    throw error;
  }
}

export async function obtenerTuboPorIdService({ id }) {
  try {
    const tubeId = Number(id);

    if (!Number.isInteger(tubeId) || tubeId <= 0) {
      throw new Error('ID de tubo invalido');
    }

    const conn = database.getConnection();
    const query = `
      SELECT TOP 1
        t.id AS tubo_id,
        t.*,
        f.concepto AS fleje_concepto,
        f.espesor AS fleje_espesor,
        f.ancho AS fleje_ancho
      FROM Tubos t
      LEFT JOIN Flejes f ON f.id = t.fleje_id
      WHERE t.id = ${tubeId}
    `;

    const rows = await conn.query(query);
    const row = rows?.[0];

    if (!row) {
      return null;
    }

    return {
      id: Number(row.tubo_id),
      calidad_id: row.calidad_id ? Number(row.calidad_id) : null,
      tipo_id: row.tipo_id ? Number(row.tipo_id) : null,
      espesor: row.espesor !== undefined ? Number(row.espesor) : row.espesor,
      diametro:
        row.diametro !== undefined ? Number(row.diametro) : row.diametro,
      alto: row.alto !== undefined ? Number(row.alto) : row.alto,
      ancho: row.ancho !== undefined ? Number(row.ancho) : row.ancho,
      longitud:
        row.longitud !== undefined ? Number(row.longitud) : row.longitud,
      peso_unitario:
        row.peso_unitario !== undefined
          ? Number(row.peso_unitario)
          : row.peso_unitario,
      num_paquetes:
        row.num_paquetes !== undefined
          ? Number(row.num_paquetes)
          : row.num_paquetes,
      num_por_paq:
        row.num_por_paq !== undefined
          ? Number(row.num_por_paq)
          : row.num_por_paq,
      unidades:
        row.unidades !== undefined ? Number(row.unidades) : row.unidades,
      fleje: {
        concepto: row.fleje_concepto || null,
        espesor:
          row.fleje_espesor !== undefined
            ? Number(row.fleje_espesor)
            : row.fleje_espesor,
        ancho:
          row.fleje_ancho !== undefined
            ? Number(row.fleje_ancho)
            : row.fleje_ancho,
      },
    };
  } catch (error) {
    console.error('Error obteniendo tubo por id:', error.message);
    throw error;
  }
}

export async function guardarProduccionTuboService(payload = {}) {
  try {
    const operario_id = Number(payload.operario_id);
    const control_dimensional_id = Number(payload.control_dimensional_id);
    const turno_id = Number(payload.turno_id);
    const maquina_id = Number(payload.maquina_id);
    const tubo_id = Number(payload.tubo_id);
    const cant_tubos_buenos = Number(payload.cant_tubos_buenos);
    const cant_tubos_malos = Number(payload.cant_tubos_malos);
    const concentracion_taladrina = Number(payload.concentracion_taladrina);
    const observacion = escapeSqlString(payload.observacion || '');
    const paquetes = Number(payload.paquetes) || 0;
    const creado = payload.creado;

    if (!Number.isInteger(operario_id) || operario_id <= 0) {
      throw new Error('operario_id invalido');
    }

    if (
      !Number.isInteger(control_dimensional_id) ||
      control_dimensional_id <= 0
    ) {
      throw new Error('control_dimensional_id invalido');
    }

    if (!Number.isInteger(turno_id) || turno_id <= 0) {
      throw new Error('turno_id invalido');
    }

    if (!Number.isInteger(maquina_id) || maquina_id <= 0) {
      throw new Error('maquina_id invalido');
    }

    if (!Number.isInteger(tubo_id) || tubo_id <= 0) {
      throw new Error('tubo_id invalido');
    }

    if (Number.isNaN(cant_tubos_buenos) || cant_tubos_buenos < 0) {
      throw new Error('cant_tubos_buenos invalido');
    }

    if (Number.isNaN(cant_tubos_malos) || cant_tubos_malos < 0) {
      throw new Error('cant_tubos_malos invalido');
    }

    if (Number.isNaN(concentracion_taladrina) || concentracion_taladrina < 0) {
      throw new Error('concentracion_taladrina invalido');
    }

    if (!creado || Number.isNaN(Date.parse(creado))) {
      throw new Error('creado invalido');
    }

    const conn = database.getConnection();

    // Buscar lote y actualizar cantidad final
    const loteQuery = `
      SELECT TOP 1 * FROM Lotes_Tubos 
      WHERE tubo_id = ${tubo_id} 
      AND CAST(creado AS DATE) = '${creado}'
      ORDER BY id DESC
    `;

    const loteResult = await database.getConnection().query(loteQuery);
    const ultimoLote = loteResult?.[0] || '';

    if (!ultimoLote) {
      throw new Error(
        'No se encontro lote para la produccion el tubo y fecha indicados',
      );
    }

    if (ultimoLote?.num_paq_final == 0) {
      const updateLoteQuery = `
        UPDATE Lotes_Tubos
        SET num_paq_final = ${Math.trunc(paquetes)}
        WHERE id = ${ultimoLote.id}
      `;
      console.log('Ejecutando updateLoteQuery:', updateLoteQuery);
      await conn.query(updateLoteQuery);
    }

    const nuevoLote = ultimoLote?.id ? Number(ultimoLote.id) : null;

    const query = `
      INSERT INTO Prod_Tubos (
        lote_tubo_id,
        operario_id,
        control_dimensional_id,
        turno_id,
        maquina_id,
        tubo_id,
        cant_tubos_buenos,
        cant_tubos_malos,
        concentracion_taladrina,
        paquetes,
        observacion,
        creado
      )
      VALUES (
        ${nuevoLote},
        ${operario_id},
        ${control_dimensional_id},
        ${turno_id},
        ${maquina_id},
        ${tubo_id},
        ${cant_tubos_buenos},
        ${cant_tubos_malos},
        ${concentracion_taladrina},
        ${paquetes},
        '${observacion}',
        '${creado}'
      );

      SELECT CAST(SCOPE_IDENTITY() AS INT) AS id;
    `;

    const result = await conn.query(query);
    const insertedId = result?.[0]?.id ? Number(result[0].id) : null;

    // Intentar actualizar inventario (Tubos + Flejes)
    try {
      const tuboInfoRows = await conn.query(
        `SELECT TOP 1 peso_unitario, fleje_id FROM Tubos WHERE id = ${tubo_id}`,
      );
      const tuboInfo = tuboInfoRows?.[0];
      const peso_unitario_db = tuboInfo
        ? Number(tuboInfo.peso_unitario || 0)
        : 0;
      const fleje_id_db = tuboInfo ? Number(tuboInfo.fleje_id || 0) : 0;

      if (peso_unitario_db > 0 && fleje_id_db > 0) {
        try {
          await actualizarInventarioPorProduccion({
            tubo_id,
            fleje_id: fleje_id_db,
            cant_tubos_buenos,
            cant_tubos_malos,
            peso_unitario: peso_unitario_db,
          });
        } catch (invErr) {
          console.error('Error actualizando inventario:', invErr.message);
        }
      } else {
        console.warn(
          'No se actualiza inventario: peso_unitario o fleje_id invalidos',
        );
      }
    } catch (err) {
      console.error(
        'Error obteniendo datos de tubo para inventario:',
        err.message,
      );
    }

    return {
      id: insertedId,
      operario_id,
      turno_id,
      maquina_id,
      tubo_id,
      cant_tubos_buenos,
      cant_tubos_malos,
      concentracion_taladrina,
      control_dimensional_id,
      lote: payload.lote || '',
      observacion: payload.observacion || '',
      creado,
    };
  } catch (error) {
    console.error('Error guardando produccion de tubos:', error.message);
    throw error;
  }
}

export async function listarProduccionTubosPorTuboIdService(payload = {}) {
  try {
    const tubo_id = Number(payload.tubo_id);
    const page = Math.max(Number(payload.page) || 1, 1);
    const pageSize = Math.max(Number(payload.pageSize) || 10, 1);
    const fecha = payload.fecha;

    if (!Number.isInteger(tubo_id) || tubo_id <= 0) {
      throw new Error('tubo_id invalido');
    }

    const whereClauses = [`tubo_id = ${tubo_id}`];

    if (fecha) {
      const parsedFecha = new Date(fecha);
      if (Number.isNaN(parsedFecha.getTime())) {
        throw new Error('fecha invalida');
      }

      const dateOnly = parsedFecha.toISOString().slice(0, 10);
      whereClauses.push(`CAST(creado AS DATE) = '${dateOnly}'`);
    }

    const whereSQL = whereClauses.join(' AND ');
    const conn = database.getConnection();

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM Prod_Tubos
      WHERE ${whereSQL}
    `;
    const countResult = await conn.query(countQuery);
    const total = countResult?.[0]?.total ? Number(countResult[0].total) : 0;

    const offset = (page - 1) * pageSize;
    const startRow = offset + 1;
    const endRow = offset + pageSize;

    const selectQuery = `
      WITH ProduccionCTE AS (
        SELECT
          id,
          operario_id,
          turno_id,
          maquina_id,
          tubo_id,
          cant_tubos_buenos,
          cant_tubos_malos,
          concentracion_taladrina,
          observacion,
          creado,
          ROW_NUMBER() OVER (ORDER BY creado DESC, id DESC) AS rn
        FROM Prod_Tubos
        WHERE ${whereSQL}
      )
      SELECT *
      FROM ProduccionCTE
      WHERE rn BETWEEN ${startRow} AND ${endRow}
      ORDER BY rn ASC
    `;

    const rows = await conn.query(selectQuery);

    return {
      data: rows.map((row) => ({
        id: Number(row.id),
        operario_id: Number(row.operario_id),
        turno_id: Number(row.turno_id),
        maquina_id: Number(row.maquina_id),
        tubo_id: Number(row.tubo_id),
        cant_tubos_buenos: Number(row.cant_tubos_buenos),
        cant_tubos_malos: Number(row.cant_tubos_malos),
        concentracion_taladrina: Number(row.concentracion_taladrina),
        observacion: row.observacion || '',
        creado: row.creado,
      })),
      total,
      page,
      pageSize,
      totalPages: total > 0 ? Math.ceil(total / pageSize) : 0,
    };
  } catch (error) {
    console.error(
      'Error listando produccion de tubos por tubo_id:',
      error.message,
    );
    throw error;
  }
}

export async function listarProduccionAgrupadaPorTuboService(payload = {}) {
  try {
    const page = Math.max(Number(payload.page) || 1, 1);
    const pageSize = Math.max(Number(payload.pageSize) || 10, 1);
    const fecha = payload.fecha;

    if (!fecha) {
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }

    const parsedFecha = new Date(fecha);
    if (Number.isNaN(parsedFecha.getTime())) {
      throw new Error('fecha invalida');
    }

    const dateOnly = parsedFecha.toISOString().slice(0, 10);
    const conn = database.getConnection();

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM Prod_Tubos
      WHERE CAST(creado AS DATE) = '${dateOnly}'
    `;
    const countResult = await conn.query(countQuery);
    const total = countResult?.[0]?.total ? Number(countResult[0].total) : 0;

    const offset = (page - 1) * pageSize;
    const startRow = offset + 1;
    const endRow = offset + pageSize;

    const selectQuery = `
      WITH Produccion AS (
        SELECT
          pt.id,
          pt.tubo_id,
          t.medida,
          ISNULL(pt.cant_tubos_buenos, 0) AS cant_tubos_buenos,
          ISNULL(pt.cant_tubos_malos, 0) AS cant_tubos_malos,
          (ISNULL(pt.cant_tubos_buenos, 0) + ISNULL(pt.cant_tubos_malos, 0))
            * ISNULL(t.peso_unitario, 0) / 1000.0 AS peso_total_tn,
          ISNULL(pt.concentracion_taladrina, 0) AS concentracion_taladrina,
          pt.creado,
          lt.lote AS lote
        FROM Prod_Tubos pt
        LEFT JOIN Tubos t ON t.id = pt.tubo_id
        LEFT JOIN Lotes_Tubos lt ON lt.id = pt.lote_tubo_id
        WHERE CAST(pt.creado AS DATE) = '${dateOnly}'
      ),
      Paginado AS (
        SELECT
          *,
          ROW_NUMBER() OVER (ORDER BY creado DESC, id DESC) AS rn
        FROM Produccion
      )
      SELECT *
      FROM Paginado
      WHERE rn BETWEEN ${startRow} AND ${endRow}
      ORDER BY rn ASC
    `;

    const rows = await conn.query(selectQuery);

    return {
      data: rows.map((row) => ({
        id: Number(row.id),
        tubo_id: Number(row.tubo_id),
        medida: row.medida || '',
        cant_tubos_buenos: Number(row.cant_tubos_buenos || 0),
        cant_tubos_malos: Number(row.cant_tubos_malos || 0),
        peso_total_tn: Number(row.peso_total_tn || 0),
        num_producciones: 1,
        concentracion_taladrina: Number(row.concentracion_taladrina || 0),
        creado: row.creado,
        lote: row.lote || '',
      })),
      total,
      page,
      pageSize,
      totalPages: total > 0 ? Math.ceil(total / pageSize) : 0,
    };
  } catch (error) {
    console.error(
      'Error listando produccion agrupada de tubos:',
      error.message,
    );
    throw error;
  }
}
