import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useNotesStore = create(
    persist(
        (set, get) => ({
            // ... (store logic)
            notes: [
                {
                    id: '1',
                    title: 'Daily Checklist',
                    content: 'Check upcoming tasks, update status of yesterday tasks, sync with manager.',
                    category: 'Work',
                    createdAt: new Date().toISOString(),
                    color: 'bg-blue-50'
                },
                {
                    id: '2',
                    title: 'Meeting Notes: Frontend Review',
                    content: 'Need to improve the sidebar animation and add dark mode support.',
                    category: 'Meetings',
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    color: 'bg-emerald-50'
                }
            ],
            loading: false,

            addNote: (note) => {
                set((state) => ({
                    notes: [
                        {
                            ...note,
                            id: Date.now().toString(),
                            createdAt: new Date().toISOString(),
                            color: note.color || 'bg-white'
                        },
                        ...state.notes,
                    ],
                }));
            },

            updateNote: (id, updatedData) => {
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === id ? { ...note, ...updatedData } : note
                    ),
                }));
            },

            deleteNote: (id) => {
                set((state) => ({
                    notes: state.notes.filter((note) => note.id !== id),
                }));
            },
        }),
        {
            name: 'dintask-notes-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export default useNotesStore;
