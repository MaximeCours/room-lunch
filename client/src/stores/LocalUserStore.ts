import create from 'zustand'
import User from "../types/UserType";

interface LocalUserState {
  localUser: User
  setLocalUser: (user: User) => void
}

const useLocalUserStore = create<LocalUserState>((set) => ({
  localUser: {
    id: "",
    name: "",
    room: ""
  },
  setLocalUser: (user: User) => set(() => ({localUser: user})),
}))

export default useLocalUserStore
