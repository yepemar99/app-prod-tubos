import {
  crearControlDimensionalService,
  obtenerDimensionesService,
} from '../services/dimensiones.service';

const dimensionesController = {
  getDimensiones: async (_, payload) => {
    try {
      const dimensiones = await obtenerDimensionesService(payload || {});
      return {
        success: true,
        data: dimensiones.data,
        total: dimensiones.total,
      };
    } catch (error) {
      console.error('Error en dimensionesController.getAll:', error);
      return { success: false, error: error.message };
    }
  },
  crearDimesion: async (_, payload) => {
    try {
      const dimension = await crearControlDimensionalService(payload || {});
      return {
        success: true,
        data: dimension.data,
      };
    } catch (error) {
      console.error('Error en dimensionesController.crearDimesion:', error);
      return { success: false, error: error.message };
    }
  },
};

export default dimensionesController;
