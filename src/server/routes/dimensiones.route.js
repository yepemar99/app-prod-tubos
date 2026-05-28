import { ipcMain } from 'electron';
import dimensionesController from '../controllers/dimensiones.controller';

export default function dimensionesRoutes() {
  ipcMain.handle('dimensiones:getAll', dimensionesController.getDimensiones);
  ipcMain.handle('dimensiones:crear', dimensionesController.crearDimesion);
}
