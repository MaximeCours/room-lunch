import create from 'zustand'

import {PathType} from "@Types";

interface PathsState {
  paths: PathType[]
  addPath: (path: PathType) => void
  updatePath: (path: PathType) => void
}

const usePathStore = create<PathsState>((set) => ({
  paths: [],
  addPath: (path) => set((state) => ({paths: [...state.paths, path]})),
  updatePath: (newPath) => set((state) => ({
    paths: state.paths.map((path) => {
      if (path.username === newPath.username) {
        return newPath
      }
      return path
    })
  }))
}))

export default usePathStore
