import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import mockEmployees from '../data/mockEmployees.json';

const useEmployeeStore = create(
    persist(
        (set, get) => ({
            employees: mockEmployees,
            subscriptionLimit: 5,
            loading: false,

            fetchEmployees: async () => {
                set({ loading: true });
                await new Promise((resolve) => setTimeout(resolve, 500));
                set({ loading: false });
            },

            addEmployee: (employee) => {
                const { employees, subscriptionLimit } = get();
                if (employees.length >= subscriptionLimit) {
                    throw new Error('Subscription limit reached. Cannot add more employees.');
                }

                set((state) => ({
                    employees: [
                        ...state.employees,
                        {
                            ...employee,
                            id: Date.now().toString(),
                            status: 'active',
                            joinedDate: new Date().toISOString().split('T')[0],
                            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`,
                        },
                    ],
                }));
            },

            updateEmployee: (id, updatedData) => {
                set((state) => ({
                    employees: state.employees.map((emp) =>
                        emp.id === id ? { ...emp, ...updatedData } : emp
                    ),
                }));
            },

            deleteEmployee: (id) => {
                set((state) => ({
                    employees: state.employees.filter((emp) => emp.id !== id),
                }));
            },

            getEmployeesByManager: (managerId) => {
                return get().employees.filter(emp => emp.managerId === managerId);
            },

            assignManagerToEmployee: (employeeId, managerId) => {
                set((state) => ({
                    employees: state.employees.map((emp) =>
                        emp.id === employeeId ? { ...emp, managerId } : emp
                    ),
                }));
            },
        }),
        {
            name: 'dintask-employees-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export default useEmployeeStore;
