import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useNotificationStore = create(
    persist(
        (set, get) => ({
            notifications: [
                {
                    id: '1',
                    title: 'New Task Assigned',
                    description: 'You have been assigned to "Frontend Dashboard Redesign"',
                    time: '2 mins ago',
                    isRead: false,
                    category: 'task'
                },
                {
                    id: '2',
                    title: 'Deadline Approaching',
                    description: 'The task "API Integration" is due in 2 hours',
                    time: '45 mins ago',
                    isRead: false,
                    category: 'deadline'
                },
                {
                    id: '3',
                    title: 'Comment on Task',
                    description: 'Sarah left a comment on your task "Landing Page Fixes"',
                    time: '1 hour ago',
                    isRead: true,
                    category: 'comment'
                },
                {
                    id: '4',
                    title: 'Project Update',
                    description: 'The Q1 Planning project has been completed successfully',
                    time: '5 hours ago',
                    isRead: true,
                    category: 'system'
                },
            ],

            markAsRead: (id) => {
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, isRead: true } : n
                    ),
                }));
            },

            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                }));
            },

            deleteNotification: (id) => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id),
                }));
            },

            addNotification: (notification) => {
                set((state) => ({
                    notifications: [
                        { ...notification, id: Date.now().toString(), isRead: false, time: 'Just now' },
                        ...state.notifications
                    ],
                }));
            },
        }),
        {
            name: 'dintask-notifications-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export default useNotificationStore;
