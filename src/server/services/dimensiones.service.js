import database from '../../db/database';

export async function obtenerDimensionesService(payload = {}) {
  try {
    const conn = database.getConnection();
    const safePage = Math.max(1, Number(payload.page) || 1);
    const safePageSize = Math.max(1, Number(payload.pageSize) || 20);
    const offset = (safePage - 1) * safePageSize;
    const tubo_id = Number(payload?.tubo_id || 0);
    const id = Number(payload?.id || 0);
    const maquina_id = Number(payload?.maquina_id || 0);
    const fecha = payload.fecha;

    const allowedOrderBy = {
      creado: 'cd.creado',
      id: 'cd.id',
    };

    const whereClauses = ['1=1'];

    if (tubo_id && tubo_id > 0) {
      whereClauses.push(`cd.tubo_id = ${tubo_id}`);
    }
    if (id && id > 0) {
      whereClauses.push(`cd.id = ${id}`);
    }
    if (maquina_id && maquina_id > 0) {
      whereClauses.push(`cd.maquina_id = ${maquina_id}`);
    }
    if (fecha) {
      const parsedFecha = new Date(fecha);
      if (Number.isNaN(parsedFecha.getTime())) {
        throw new Error('fecha invalida');
      }

      const dateOnly = parsedFecha.toISOString().slice(0, 10);
      whereClauses.push(`CAST(cd.creado AS DATE) = '${dateOnly}'`);
    }

    const whereSQL = whereClauses.join(' AND ');

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM Control_Dimensional cd
      WHERE ${whereSQL}
    `;

    const countResult = await conn.query(countQuery);
    const total = countResult[0]?.total ? Number(countResult[0].total) : 0;

    const selectQuery = `
      SELECT cd.*, m.maquina AS maquina, t.art_concepto AS tubo
      FROM Control_Dimensional cd
      LEFT JOIN Maquinas m ON cd.maquina_id = m.id
      LEFT JOIN Tubos t ON cd.tubo_id = t.id
      WHERE ${whereSQL}
      ORDER BY cd.creado DESC
      OFFSET ${offset} ROWS FETCH NEXT ${safePageSize} ROWS ONLY
    `;

    const rows = await conn.query(selectQuery);
    return {
      data: rows.map((row) => ({
        id: Number(row.id),
        tubo_id: Number(row.tubo_id),
        tubo: row.tubo,
        maquina_id: Number(row.maquina_id),
        maquina: row.maquina,
        medida: Number(row.medida_va),
        medida_de: Number(row.medida_de),
        medida_hb: Number(row.medida_hb),
        medida_espesor: Number(row.medida_espesor),
        medida_conv: Number(row.medida_conv),
        medida_rectang: Number(row.medida_rectang),
        medida_redondeo: Number(row.medida_redondeo),
        medida_revirado_alt: Number(row.medida_revirado_alt),
        medida_revirado_base: Number(row.medida_revirado_base),
        medida_rectitud: Number(row.medida_rectitud),
        medida_long: Number(row.medida_long),
        medida_va: Number(row.medida_va),
        creado: row.creado,
      })),
      total,
    };
  } catch (error) {
    console.error(
      'Error listando produccion de tubos por tubo_id:',
      error.message,
    );
    throw error;
  }
}

export async function crearControlDimensionalService(payload = {}) {
  try {
    const conn = database.getConnection();
    const {
      tubo_id,
      maquina_id,
      medida_de,
      medida_hb,
      medida_espesor,
      medida_conv,
      medida_rectang,
      medida_redondeo,
      medida_revirado_alt,
      medida_revirado_base,
      medida_rectitud,
      medida_long,
      medida_va,
      fecha,
    } = payload;

    const insertQuery = `
      INSERT INTO Control_Dimensional (
        tubo_id, maquina_id, medida_de, medida_hb, medida_espesor,
        medida_conv, medida_rectang, medida_redondeo, medida_revirado_alt,
        medida_revirado_base, medida_rectitud, medida_long, medida_va, creado
      )
      OUTPUT INSERTED.id 
      VALUES (${tubo_id}, ${maquina_id}, ${medida_de}, ${medida_hb}, ${medida_espesor},
        ${medida_conv}, ${medida_rectang}, ${medida_redondeo}, ${medida_revirado_alt},
        ${medida_revirado_base}, ${medida_rectitud}, ${medida_long}, ${medida_va}, '${fecha}')
    `;

    const result = await conn.query(insertQuery);
    return { data: { id: Number(result[0]?.id) } };
  } catch (error) {
    console.error('Error creando control dimensional:', error.message);
    throw error;
  }
}
