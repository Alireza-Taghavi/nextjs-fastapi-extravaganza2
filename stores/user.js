import {create} from 'zustand'

export const useUserStore = create((set, get) => ({
    user: null,
    setUser: (user) => set((state) => ({user: user})),
    logout: () => set((state) => ({user: null})),
}))

export const useLoginStore = create((set) => ({
    phone: null,
    emojis: [],
    setPhone: (phone) => set((state) => ({phone: phone})),
    setEmojis: (data) => set((state) => ({emojis: [...data]})),
    clearLogin: () => set({phone: null}),
}))
