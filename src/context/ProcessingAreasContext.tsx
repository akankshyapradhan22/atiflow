import { createContext, useContext, useState } from 'react';
import { mockProcessingAreas } from '../data/mock';
import type { ProcessingArea } from '../types';

export interface AreaMachine {
  id: string;
  machineName: string;
  pointType: string;
}

interface ProcessingAreasContextValue {
  areas: ProcessingArea[];
  machines: Record<string, AreaMachine[]>;   // areaId → machines
  renameArea: (id: string, newName: string) => void;
  deleteArea: (id: string) => void;
  addArea: (area: ProcessingArea, machines?: AreaMachine[]) => void;
  setAreaMachines: (areaId: string, machines: AreaMachine[]) => void;
  addAreaMachine: (areaId: string, machine: Omit<AreaMachine, 'id'>) => void;
  updateAreaMachine: (areaId: string, machineId: string, data: Omit<AreaMachine, 'id'>) => void;
  deleteAreaMachine: (areaId: string, machineId: string) => void;
}

const ProcessingAreasContext = createContext<ProcessingAreasContextValue | null>(null);

export function ProcessingAreasProvider({ children }: { children: React.ReactNode }) {
  const [areas, setAreas] = useState<ProcessingArea[]>(mockProcessingAreas);
  const [machines, setMachines] = useState<Record<string, AreaMachine[]>>({});

  const renameArea = (id: string, newName: string) =>
    setAreas((prev) => prev.map((a) => a.id === id ? { ...a, name: newName } : a));

  const deleteArea = (id: string) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
    setMachines((prev) => { const next = { ...prev }; delete next[id]; return next; });
  };

  const addArea = (area: ProcessingArea, initialMachines?: AreaMachine[]) => {
    setAreas((prev) => [...prev, area]);
    if (initialMachines?.length) {
      setMachines((prev) => ({ ...prev, [area.id]: initialMachines }));
    }
  };

  const setAreaMachines = (areaId: string, m: AreaMachine[]) =>
    setMachines((prev) => ({ ...prev, [areaId]: m }));

  const addAreaMachine = (areaId: string, machine: Omit<AreaMachine, 'id'>) =>
    setMachines((prev) => ({
      ...prev,
      [areaId]: [...(prev[areaId] ?? []), { ...machine, id: `mch-${Date.now()}` }],
    }));

  const updateAreaMachine = (areaId: string, machineId: string, data: Omit<AreaMachine, 'id'>) =>
    setMachines((prev) => ({
      ...prev,
      [areaId]: (prev[areaId] ?? []).map((m) => m.id === machineId ? { ...m, ...data } : m),
    }));

  const deleteAreaMachine = (areaId: string, machineId: string) =>
    setMachines((prev) => ({
      ...prev,
      [areaId]: (prev[areaId] ?? []).filter((m) => m.id !== machineId),
    }));

  return (
    <ProcessingAreasContext.Provider value={{
      areas, machines, renameArea, deleteArea, addArea,
      setAreaMachines, addAreaMachine, updateAreaMachine, deleteAreaMachine,
    }}>
      {children}
    </ProcessingAreasContext.Provider>
  );
}

export function useProcessingAreas() {
  const ctx = useContext(ProcessingAreasContext);
  if (!ctx) throw new Error('useProcessingAreas must be used within ProcessingAreasProvider');
  return ctx;
}
