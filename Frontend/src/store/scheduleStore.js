import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useScheduleStore = create(
    persist(
        (set, get) => ({
            schedules: [],
            loading: false,
            error: null,

            addScheduleEvent: (event) => {
                set((state) => ({
                    schedules: [
                        ...state.schedules,
                        {
                            ...event,
                            id: Date.now().toString(),
                            createdAt: new Date().toISOString()
                        },
                    ],
                }));
            },

            updateScheduleEvent: (eventId, updatedData) => {
                set((state) => ({
                    schedules: state.schedules.map((event) =>
                        event.id === eventId ? { ...event, ...updatedData } : event
                    ),
                }));
            },

            deleteScheduleEvent: (eventId) => {
                set((state) => ({
                    schedules: state.schedules.filter((event) => event.id !== eventId),
                }));
            },

            getSchedulesByUser: (userId) => {
                return get().schedules.filter(s => s.userId === userId || s.targetUserId === userId);
            },

            getTeamSchedules: (managerId, teamMemberIds) => {
                return get().schedules.filter(s =>
                    s.managerId === managerId || (teamMemberIds && teamMemberIds.includes(s.targetUserId))
                );
            }
        }),
        {
            name: 'dintask-schedules-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export default useScheduleStore;
