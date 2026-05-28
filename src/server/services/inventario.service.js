import database from '../../db/database';

function escapeSqlString(value = '') {
  return String(value).replace(/'/g, "''");
}

export async function actualizarInventarioPorProduccion(payload = {}) {
  try {
    const tubo_id = Number(payload.tubo_id);
    const fleje_id = Number(payload.fleje_id);
    const buenos = Number(payload.cant_tubos_buenos || 0);
    const malos = Number(payload.cant_tubos_malos || 0);
    const peso_unitario = Number(payload.peso_unitario);

    if (!Number.isInteger(tubo_id) || tubo_id <= 0) {
      throw new Error('tubo_id invalido');
    }
    if (!Number.isInteger(fleje_id) || fleje_id <= 0) {
      throw new Error('fleje_id invalido');
    }
    if (Number.isNaN(buenos) || buenos < 0) {
      throw new Error('cantidad buenos invalida');
    }
    if (Number.isNaN(malos) || malos < 0) {
      throw new Error('cantidad malos invalida');
    }
    if (Number.isNaN(peso_unitario) || peso_unitario <= 0) {
      throw new Error('peso_unitario invalido');
    }

    const conn = database.getConnection();

    // Obtener fila del tubo
    const tuboRows = await conn.query(
      `SELECT TOP 1 * FROM Tubos WHERE id = ${tubo_id}`,
    );
    const tuboRow = tuboRows?.[0];
    if (!tuboRow) throw new Error('Tubo no encontrado');

    const currentUnidades = Number(tuboRow.unidades || 0);
    const num_por_paq = Number(tuboRow.num_por_paq || 0);

    if (!num_por_paq || num_por_paq <= 0) {
      throw new Error('num_por_paq invalido en tabla Tubos');
    }

    const nuevasUnidades = currentUnidades + buenos;
    const num_paquetes = Math.floor(nuevasUnidades / num_por_paq);
    const unidades_sueltas = nuevasUnidades % num_por_paq;
    const peso_total_tn = (peso_unitario * nuevasUnidades) / 1000.0;

    // Construir UPDATE dinámico para Tubos según columnas disponibles
    const tuboUpdateFields = [];
    const tuboColumns = Object.keys(tuboRow).map((c) => c.toLowerCase());

    if (tuboColumns.includes('unidades')) {
      tuboUpdateFields.push(`unidades = ${nuevasUnidades}`);
    }
    if (tuboColumns.includes('num_paquetes')) {
      tuboUpdateFields.push(`num_paquetes = ${num_paquetes}`);
    }
    // soporte nombres alternativos
    if (tuboColumns.includes('num_por_paq')) {
      // nothing to set
    }
    if (tuboColumns.includes('unidades_sueltas')) {
      tuboUpdateFields.push(`unidades_sueltas = ${unidades_sueltas}`);
    }
    // peso total campo posible: peso_total o peso
    if (tuboColumns.includes('peso_total')) {
      tuboUpdateFields.push(`peso_total = ${peso_total_tn}`);
    }

    if (tuboUpdateFields.length > 0) {
      const updateQuery = `UPDATE Tubos SET ${tuboUpdateFields.join(', ')} WHERE id = ${tubo_id}`;
      await conn.query(updateQuery);
    }

    // Actualizar Flejes
    const flejeRows = await conn.query(
      `SELECT TOP 1 * FROM Flejes WHERE id = ${fleje_id}`,
    );
    const flejeRow = flejeRows?.[0];
    if (!flejeRow) throw new Error('Fleje no encontrado');

    // detectar nombres de columnas para peso total y peso medio
    const flejeCols = Object.keys(flejeRow).map((c) => c.toLowerCase());
    const pesoTotalCol = flejeCols.includes('peso_total')
      ? 'peso_total'
      : flejeCols.includes('peso')
        ? 'peso'
        : null;
    const pesoMedioCol = flejeCols.includes('peso_medio')
      ? 'peso_medio'
      : flejeCols.includes('peso_por_paquete')
        ? 'peso_por_paquete'
        : null;
    const unidadesActualesCol = flejeCols.includes('unidades')
      ? 'unidades'
      : flejeCols.includes('unidades_actuales')
        ? 'unidades_actuales'
        : null;

    const currentFlejePesoTotal = pesoTotalCol
      ? Number(flejeRow[pesoTotalCol] || 0)
      : null;
    const pesoMedio = pesoMedioCol ? Number(flejeRow[pesoMedioCol] || 0) : null;

    const consumedWeightTn = ((buenos + malos) * peso_unitario) / 1000.0;
    let newFlejePesoTotal = currentFlejePesoTotal;
    let newFlejeUnidades = null;

    const flejeUpdateFields = [];

    if (currentFlejePesoTotal !== null) {
      newFlejePesoTotal =
        currentFlejePesoTotal - consumedWeightTn < 0
          ? 0
          : currentFlejePesoTotal - consumedWeightTn;
      if (Number.isNaN(newFlejePesoTotal)) newFlejePesoTotal = 0;
      if (pesoTotalCol)
        flejeUpdateFields.push(`${pesoTotalCol} = ${newFlejePesoTotal}`);
    }

    if (pesoMedio && pesoMedio > 0) {
      newFlejeUnidades = newFlejePesoTotal / pesoMedio;
      if (Number.isNaN(newFlejeUnidades)) newFlejeUnidades = 0;
      if (unidadesActualesCol)
        flejeUpdateFields.push(`${unidadesActualesCol} = ${newFlejeUnidades}`);
    }

    if (flejeUpdateFields.length > 0) {
      const flejeUpdateQuery = `UPDATE Flejes SET ${flejeUpdateFields.join(', ')} WHERE id = ${fleje_id}`;
      await conn.query(flejeUpdateQuery);
    }

    return {
      success: true,
      tubo: {
        id: tubo_id,
        nuevasUnidades,
        num_paquetes,
        unidades_sueltas,
        peso_total_tn,
      },
      fleje: {
        id: fleje_id,
        newFlejePesoTotal,
        newFlejeUnidades,
      },
    };
  } catch (error) {
    console.error(
      'Error actualizando inventario por produccion:',
      error.message,
    );
    throw error;
  }
}
