import React, { createContext, useEffect, useState } from 'react';

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [maquinas, setMaquinas] = useState([]);
  const [tiposCalidad, setTiposCalidad] = useState([]);
  const [operarios, setOperarios] = useState([]);
  const [turnos, setTurnos] = useState([]);

  const loadTiposCalidad = async () => {
    const result = await window.api.tiposCalidad.getAll();

    return {
      ...result,
      data: result.data.map((row) => ({
        ...row,
      })),
      total: result.data.length,
    };
  };

  const loadOperarios = async () => {
    const result = await window.api.operarios.getAll();

    return {
      ...result,
      data: result.data.map((row) => ({
        ...row,
        nombre_completo: `${row.nombre} ${row.apellido1} ${row.apellido2}`,
      })),
      total: result.data.length,
    };
  };

  const loadMaquinas = async () => {
    const result = await window.api.maquinas.getAll();
    console.log('reasulta maq', result);
    return {
      ...result,
      data: result.data.map((row) => ({
        ...row,
      })),
      total: result.data.length,
    };
  };

  const loadTurnos = async () => {
    const result = await window.api.turnos.getAll();
    return {
      ...result,
      data: result.data.map((row) => ({
        ...row,
      })),
      total: result.data.length,
    };
  };

  const loadData = async () => {
    try {
      const resultTiposCalidad = await loadTiposCalidad();
      setTiposCalidad(resultTiposCalidad.data);
      const resultMaquinas = await loadMaquinas();
      setMaquinas(resultMaquinas.data);
      const resultOperarios = await loadOperarios();
      setOperarios(resultOperarios.data);
      const resultTurnos = await loadTurnos();
      setTurnos(resultTurnos.data);
    } catch (err) {
      console.log(`Error: ${err?.message ? err?.message : err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        loading,
        tiposCalidad,
        setTiposCalidad,
        maquinas,
        setMaquinas,
        operarios,
        setOperarios,
        turnos,
        setTurnos,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
