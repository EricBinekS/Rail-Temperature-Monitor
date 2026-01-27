import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getStatusSolda } from '../../lib/rules';

export const RailMap = ({ data, selectedStation, onSelectStation, theme = 'light', showHeatmap = false }) => {
  
  const mapTheme = {
    light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  };

  return (
    <MapContainer 
      center={[-23.55, -46.63]} 
      zoom={6} 
      className="w-full h-full z-0"
      style={{ background: theme === 'dark' ? '#1e1e1e' : '#e2e8f0' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.carto.com/">CartoDB</a>'
        url={theme === 'dark' ? mapTheme.dark : mapTheme.light}
      />
      
      {data.map((station) => {
        const status = getStatusSolda(station.estimated_rail_temp);
        const isSelected = selectedStation?.sb === station.sb;
        const isCritical = status.status === "Crítico";

        let radius = 6;
        let fillOpacity = 0.8;
        let stroke = true;

        if (showHeatmap) {
          radius = 15;
          fillOpacity = 0.3;
          stroke = false;
        } else if (isSelected) {
          radius = 12;
          fillOpacity = 1;
        } else if (isCritical) {
           radius = 8;
        }

        return (
          <CircleMarker
            key={station.sb}
            center={[station.lat, station.lng]}
            radius={radius}
            pathOptions={{ 
              color: isSelected ? '#fff' : status.color, 
              fillColor: status.color, 
              fillOpacity: fillOpacity,
              weight: isSelected ? 3 : 1,
              stroke: stroke
            }}
            eventHandlers={{
              click: () => onSelectStation(station),
            }}
            className={(!showHeatmap && isCritical) ? "marker-critical" : ""}
          >
            {!showHeatmap && (
              <Tooltip direction="top" offset={[0, -10]} opacity={1} className="font-bold">
                <span>{station.sb}</span><br/>
                <span className={status.status === "Crítico" ? "text-red-600" : ""}>
                  {station.estimated_rail_temp.toFixed(1)}°C
                </span>
              </Tooltip>
            )}
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};