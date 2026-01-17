import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import mockManagers from '../data/mockManagers.json';

const useManagerStore = create(
    persist(
        (set, get) => ({
            managers: mockManagers,
            loading: false,
            error: null,

            fetchManagers: async () => {
                set({ loading: true });
                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 500));
                set({ loading: false });
            },

            addManager: (manager) => {
                set((state) => ({
                    managers: [
                        ...state.managers,
                        {
                            ...manager,
                            id: `M${Date.now()}`,
                            status: 'active',
                            teamMembers: manager.teamMembers || []
                        },
                    ],
                }));
            },

            updateManager: (managerId, updatedData) => {
                set((state) => ({
                    managers: state.managers.map((manager) =>
                        manager.id === managerId ? { ...manager, ...updatedData } : manager
                    ),
                }));
            },

            deleteManager: (managerId) => {
                set((state) => ({
                    managers: state.managers.filter((manager) => manager.id !== managerId),
                }));
            },

            getManagerByEmail: (email) => {
                return get().managers.find(m => m.email === email);
            }
        }),
        {
            name: 'dintask-managers-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export default useManagerStore;
