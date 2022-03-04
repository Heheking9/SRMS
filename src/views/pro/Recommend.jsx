import React from "react";
import { Map, Marker, NavigationControl, InfoWindow } from "react-bmapgl";

class App extends React.Component {
  render() {
    return (
      <Map
        style={{ width: "100%", height: "100%" }}
        center={{ lng: 116.402544, lat: 39.928216 }}
        zoom="11"
      >
        <Marker position={{ lng: 116.402544, lat: 39.928216 }} />
        <NavigationControl />
        <InfoWindow
          position={{ lng: 116.402544, lat: 39.928216 }}
          text="内容"
          title="标题"
        />
      </Map>
    );
  }
}
export default App;
