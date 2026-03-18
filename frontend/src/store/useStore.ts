import { create } from 'zustand';

interface StoreState {
  socketStatus: 'connected' | 'disconnected';
  setSocketStatus: (status: 'connected' | 'disconnected') => void;
  assignments: Record<string, any>;
  setAssignment: (id: string, assignment: any) => void;
}

export const useStore = create<StoreState>((set) => ({
  socketStatus: 'disconnected',
  setSocketStatus: (status) => set({ socketStatus: status }),
  assignments: {},
  setAssignment: (id, assignment) => set((state) => ({ 
      assignments: { ...state.assignments, [id]: assignment } 
  })),
}));
