import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('versions', {
  chrome: process.versions['chrome'],
  node: process.versions['node'],
  electron: process.versions['electron'],
});

contextBridge.exposeInMainWorld('api', {
  operarios: {
    getAll: () => ipcRenderer.invoke('operarios:getAll'),
  },
  maquinas: {
    getAll: () => ipcRenderer.invoke('maquinas:getAll'),
  },
  tiposCalidad: {
    getAll: () => ipcRenderer.invoke('tiposCalidad:getAll'),
  },
  turnos: {
    getAll: () => ipcRenderer.invoke('turnos:getAll'),
  },
  tubos: {
    getProduccionByTuboId: (payload) =>
      ipcRenderer.invoke('tubos:getProduccionByTuboId', payload),
    getProduccionAgrupadaPorTubo: (payload) =>
      ipcRenderer.invoke('tubos:getProduccionAgrupadaPorTubo', payload),
    getAllForSelects: (payload) =>
      ipcRenderer.invoke('tubos:getAllForSelects', payload),
    getById: (payload) => ipcRenderer.invoke('tubos:getById', payload),
    saveProduccion: (payload) =>
      ipcRenderer.invoke('tubos:saveProduccion', payload),
  },
  dimensiones: {
    getAll: (payload) => ipcRenderer.invoke('dimensiones:getAll', payload),
    crear: (payload) => ipcRenderer.invoke('dimensiones:crear', payload),
  },
});
