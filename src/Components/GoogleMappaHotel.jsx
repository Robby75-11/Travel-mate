import { useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

const GoogleMappaHotel = ({ latitudine, longitudine, nomeHotel }) => {
  if (latitudine == null || longitudine == null) {
    return <p>Coordinate non disponibili per questo hotel.</p>;
  }
  const posizione = {
    lat: latitudine,
    lng: longitudine,
  };
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const [showInfoWindow, setShowInfoWindow] = useState(false);

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={posizione} zoom={15}>
      <Marker position={posizione} onClick={() => setShowInfoWindow(true)} />
      {showInfoWindow && (
        <InfoWindow
          position={posizione}
          onCloseClick={() => setShowInfoWindow(false)}
        >
          <div>{nomeHotel}</div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default GoogleMappaHotel;
