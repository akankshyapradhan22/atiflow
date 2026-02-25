import { create } from 'zustand';
import type { Workflow } from '../types';

interface WorkflowState {
  activeWorkflow: Workflow | null;
  setActiveWorkflow: (workflow: Workflow | null) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  activeWorkflow: null,
  setActiveWorkflow: (workflow) => set({ activeWorkflow: workflow }),
}));
