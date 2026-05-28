import { id } from 'zod/v4/locales';
import database from '../../db/database';

export const listarTodosMaquinasService = async () => {
  try {
    const conn = database.getConnection();
    const query = `
      SELECT id, nombre, maquina
      FROM Maquinas
      ORDER BY nombre ASC
    `;
    const rows = await conn.query(query);
    return {
      data: rows.map((m) => ({
        id: Number(m.id),
        nombre: m.nombre,
        maquina: m.maquina,
      })),
      total: rows.length,
    };
  } catch (error) {
    console.error('Error listando maquinas:', error.message);
    throw error;
  }
};
