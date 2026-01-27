import React from 'react';
import { X, Thermometer, Wind, CloudSun } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getStatusSolda } from '../../lib/rules';
import { Card } from '../ui/Card';

export const DetailsPanel = ({ station, onClose }) => {
  if (!station) return null;

  const status = getStatusSolda(station.estimated_rail_temp);
  const Icon = status.icon;

  const chartData = [
    { time: '08:00', temp: station.estimated_rail_temp - 8 },
    { time: '09:00', temp: station.estimated_rail_temp - 4 },
    { time: '10:00', temp: station.estimated_rail_temp }, // Atual
    { time: '11:00', temp: station.estimated_rail_temp + 3 },
    { time: '12:00', temp: station.estimated_rail_temp + 5 },
  ];

  return (
    <div className="absolute right-0 top-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-[1000] flex flex-col border-l border-slate-200 transition-transform duration-300">
      
      <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{station.SB}</h2>
          <p className="text-sm text-slate-500">KM {station.km_inicio} - {station.km_fim}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <X size={20} className="text-slate-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        <div className={`p-4 rounded-xl border flex items-center gap-4 ${status.bgClass}`}>
          <Icon size={32} />
          <div>
            <p className="text-xs font-bold uppercase opacity-70">Status Operacional</p>
            <p className="font-bold text-lg leading-tight">{status.label}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-slate-50 border-none">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <Thermometer size={16} /> <span className="text-xs font-bold uppercase">Trilho</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{station.estimated_rail_temp}°C</p>
          </Card>
          
          <Card className="p-4 bg-slate-50 border-none">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <CloudSun size={16} /> <span className="text-xs font-bold uppercase">Ambiente</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{station.temperature_celsius}°C</p>
          </Card>

          <Card className="p-4 bg-slate-50 border-none col-span-2 flex justify-between items-center">
             <div>
                <div className="flex items-center gap-2 mb-1 text-slate-500">
                  <Wind size={16} /> <span className="text-xs font-bold uppercase">Vento</span>
                </div>
                <p className="text-xl font-bold text-slate-800">{station.wind_speed_kmh} km/h</p>
             </div>
             <div className="text-right">
                <span className="text-xs font-bold uppercase text-slate-500 block mb-1">Condição</span>
                <span className="inline-block px-2 py-1 bg-white rounded text-sm font-semibold shadow-sm text-slate-700">
                  {station.sky_condition}
                </span>
             </div>
          </Card>
        </div>

        <div className="h-64">
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Tendência (5 Horas)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                cursor={{stroke: '#cbd5e1', strokeWidth: 2}}
              />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke={status.color} 
                strokeWidth={3} 
                dot={{r: 4, fill: status.color, strokeWidth: 2, stroke: '#fff'}} 
                activeDot={{r: 6}}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};