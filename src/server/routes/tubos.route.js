import { ipcMain } from 'electron';
import tubosController from '../controllers/tubos.controller';

export default function tubosRoutes() {
  ipcMain.handle('tubos:getAllForSelects', tubosController.getAllForSelects);
  ipcMain.handle('tubos:getById', tubosController.getById);
  ipcMain.handle('tubos:saveProduccion', tubosController.saveProduccion);
  ipcMain.handle(
    'tubos:getProduccionByTuboId',
    tubosController.getProduccionByTuboId,
  );
  ipcMain.handle(
    'tubos:getProduccionAgrupadaPorTubo',
    tubosController.getProduccionAgrupadaPorTubo,
  );
}
