import create from 'zustand'
import {LatLngExpression} from "leaflet";

import {MarkerType} from "@Types";

interface MarkersState {
  markers: MarkerType[]
  addMarker: (marker: MarkerType) => void
  updateMarker: (id: number, position: LatLngExpression) => void
  removeMarker: (marker: MarkerType) => void
}

const useMarkerStore = create<MarkersState>((set) => ({
  markers: [],
  addMarker: (marker) => set((state) => ({markers: [...state.markers, marker]})),
  updateMarker: (id, position) => set((state) => ({
    markers: state.markers.map((marker, index) => {
      if (index === id) {
        return {...marker, position: position} as MarkerType
      }
      return marker
    })
  })),
  removeMarker: (selectedMarker) => set((state) => ({
    markers: state.markers.filter((marker) => selectedMarker.position !== marker.position)
  }))
}))

export default useMarkerStore
