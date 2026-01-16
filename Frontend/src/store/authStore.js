import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import mockUsers from '../data/mockUsers.json';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            role: null,
            isAuthenticated: false,
            loading: false,
            error: null,

            login: async (email, password, selectedRole) => {
                set({ loading: true, error: null });

                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 800));

                const user = mockUsers[selectedRole];

                if (user && user.email === email && user.password === password) {
                    const userData = {
                        id: selectedRole === 'employee' ? '1' : selectedRole,
                        name: user.name,
                        email: user.email,
                    };

                    set({
                        user: userData,
                        role: selectedRole,
                        isAuthenticated: true,
                        loading: false,
                    });
                    return true;
                } else {
                    set({
                        loading: false,
                        error: 'Invalid credentials for chosen role',
                    });
                    return false;
                }
            },

            logout: () => {
                set({
                    user: null,
                    role: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'dintask-auth-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export default useAuthStore;
