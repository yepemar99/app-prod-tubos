import {
  actualizarTuboService,
  crearTuboService,
  eliminarTuboService,
  listarProduccionAgrupadaPorTuboService,
  guardarProduccionTuboService,
  informeTubos,
  listarProduccionTubosPorTuboIdService,
  obtenerTuboPorIdService,
  listarTiposTubosService,
  listarTodosTubosService,
  listarTubosService,
} from '../services/tubos.service';

const tubosController = {
  async getAllForSelects(_, payload) {
    try {
      const { data, total } = await listarTodosTubosService(payload);
      return { success: true, data: data, total: total };
    } catch (error) {
      console.error('Error en tubosController.getAll:', error);
      return { success: false, error: error.message };
    }
  },

  async getById(_, payload) {
    try {
      const data = await obtenerTuboPorIdService(payload || {});
      return { success: true, data };
    } catch (error) {
      console.error('Error en tubosController.getById:', error);
      return { success: false, error: error.message };
    }
  },

  async saveProduccion(_, payload) {
    try {
      const data = await guardarProduccionTuboService(payload || {});
      return { success: true, data };
    } catch (error) {
      console.error('Error en tubosController.saveProduccion:', error);
      return { success: false, error: error.message };
    }
  },

  async getProduccionByTuboId(_, payload) {
    try {
      const data = await listarProduccionTubosPorTuboIdService(payload || {});
      return {
        success: true,
        data: data.data,
        total: data.total,
        page: data.page,
        pageSize: data.pageSize,
        totalPages: data.totalPages,
      };
    } catch (error) {
      console.error('Error en tubosController.getProduccionByTuboId:', error);
      return { success: false, error: error.message };
    }
  },

  async getProduccionAgrupadaPorTubo(_, payload) {
    try {
      const data = await listarProduccionAgrupadaPorTuboService(payload || {});
      return {
        success: true,
        data: data.data,
        total: data.total,
        page: data.page,
        pageSize: data.pageSize,
        totalPages: data.totalPages,
      };
    } catch (error) {
      console.error(
        'Error en tubosController.getProduccionAgrupadaPorTubo:',
        error,
      );
      return { success: false, error: error.message };
    }
  },
};

export default tubosController;
