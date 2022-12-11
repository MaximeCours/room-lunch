import {Icon, LatLngExpression, LeafletEventHandlerFnMap} from "leaflet";
import {Marker} from "react-leaflet";

import {MarkerTypeType} from "@Types";

interface IProps {
  position: LatLngExpression
  eventHandlers: LeafletEventHandlerFnMap
  type: MarkerTypeType
  draggable?: boolean
  username?: string
}

const CustomMarker = ({position, eventHandlers, type, draggable = true, username = "?"}: IProps) => {

  const iconList = {
    restaurant: new Icon({
      iconUrl: "https://img.icons8.com/ios-filled/512/restaurant--v1.png",
      iconSize: [30, 30]
    }),
    user: new Icon({
      iconUrl: `https://ui-avatars.com/api/?color=d5d5d5&background=28555D&length=2&rounded=true&size=128&font-size=0.35&bold=true&name=${username}`,
      iconSize: [40, 40]
    }),
    finish: new Icon({
      iconUrl: "https://img.icons8.com/ios-filled/512/flag.png",
      iconSize: [30, 30]
    }),
  }

  let icon
  switch (type) {
    case "restaurant":
      icon = iconList.restaurant
      break
    case "finish":
      icon = iconList.finish
      break
    default:
      icon = iconList.user
  }

  return <Marker
    position={position}
    draggable={draggable}
    eventHandlers={eventHandlers}
    icon={icon}
  />
}

export default CustomMarker
