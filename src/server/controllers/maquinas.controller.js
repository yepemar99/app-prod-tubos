import { listarTodosMaquinasService } from '../services/maquina.service';

const maquinasController = {
  getMaquinas: async (_, payload) => {
    try {
      const maquinas = await listarTodosMaquinasService();
      return { success: true, data: maquinas.data, total: maquinas.total };
    } catch (error) {
      console.error('Error en maquinasController.getOperarios:', error);
      return { success: false, error: error.message };
    }
  },
};

export default maquinasController;
