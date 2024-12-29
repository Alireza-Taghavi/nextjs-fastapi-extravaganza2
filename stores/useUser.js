import {create} from 'zustand'
import {persist} from "zustand/middleware";

export const useUserStore = create(persist((set, get) => ({
    user: null,
    setUser: (user) => set((state) => ({user: user})),
    logout: () => set((state) => ({user: null})),
}),
    {
        name: 'user-storage',
    }))

export const useLoginStore = create((set) => ({
    phone: null,
    emojis: [],
    setPhone: (phone) => set((state) => ({phone: phone})),
    setEmojis: (data) => set((state) => ({emojis: [...data]})),
    clearLogin: () => set({phone: null}),
}))
