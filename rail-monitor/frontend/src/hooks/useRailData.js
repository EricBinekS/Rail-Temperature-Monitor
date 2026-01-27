import { useState, useEffect } from 'react';
import dashboardData from '../data/dashboard_data.json';

export const useRailData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const formattedData = dashboardData.map(item => ({
        ...item,
        
        sb: item.SB,
        km_inicio: item["Km início"],
        km_fim: item["Km fim"],
        
        lat: item["Lat Decimal"] ?? item.lat ?? item["Mediana Latitude"],
        lng: item["Long Decimal"] ?? item.lng ?? item.lon ?? item["Mediana Longitude"], 
        
        estimated_rail_temp: item.estimated_rail_temp ?? 0,
        temperature_celsius: item.temperature_celsius ?? 0,
        sky_condition: item.sky_condition || "Sem dados",
        wind_speed_kmh: item.wind_speed_kmh ?? 0,
        datetime: item.datetime
      }));

      const validData = formattedData.filter(d => 
        d.lat !== undefined && d.lat !== null &&
        d.lng !== undefined && d.lng !== null
      );

      setData(validData);
    } catch (error) {
      console.error("Erro crítico ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading };
};