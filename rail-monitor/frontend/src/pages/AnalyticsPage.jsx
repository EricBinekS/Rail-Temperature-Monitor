import React, { useMemo } from 'react';
import { useRailData } from '../hooks/useRailData';
import { 
  PieChart, Pie, Cell, ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Card } from '../components/ui/Card';
import { getStatusSolda } from '../lib/rules';
import { Thermometer, AlertTriangle, Wind, Activity } from 'lucide-react';

export const AnalyticsPage = ({ theme }) => { 
  const { data, loading } = useRailData();
  const isDark = theme === 'dark';

  const chartTextColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderColor: isDark ? '#334155' : '#e2e8f0',
    color: isDark ? '#f8fafc' : '#0f172a',
    borderRadius: '8px'
  };

  const stats = useMemo(() => {
    if (!data.length) return null;
    let maxTemp = -Infinity;
    let sumTemp = 0;
    const counts = { Ideal: 0, Atencao: 0, Critico: 0 };
    const correlation = [];
    const windEffect = [];

    data.forEach(d => {
      if (d.estimated_rail_temp > maxTemp) maxTemp = d.estimated_rail_temp;
      sumTemp += d.estimated_rail_temp;
      const status = getStatusSolda(d.estimated_rail_temp);
      const key = status.status === "Atenção" ? "Atencao" : status.status === "Crítico" ? "Critico" : "Ideal";
      counts[key]++;
      if (Math.random() > 0.6) {
        correlation.push({ ar: d.temperature_celsius, trilho: d.estimated_rail_temp });
        windEffect.push({ vento: d.wind_speed_kmh, trilho: d.estimated_rail_temp });
      }
    });

    const statusCount = [
      { name: 'Ideal', value: counts.Ideal, color: '#10B981' },
      { name: 'Atenção', value: counts.Atencao, color: '#F59E0B' },
      { name: 'Crítico', value: counts.Critico, color: '#EF4444' },
    ];
    const topHot = [...data].sort((a, b) => b.estimated_rail_temp - a.estimated_rail_temp).slice(0, 5)
      .map(d => ({ ...d, status: getStatusSolda(d.estimated_rail_temp) }));

    return { maxTemp, avgTemp: sumTemp / data.length, counts, statusCount, topHot, correlation, windEffect };
  }, [data]);

  if (loading || !stats) return <div className="p-10 text-slate-500 animate-pulse">Carregando dados...</div>;

  return (
    <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 md:pb-8 transition-colors">
      
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Relatório Operacional</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Análise técnica da temperatura da via permanente.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border-l-4 border-rose-500 shadow-sm bg-white dark:bg-slate-800 dark:border-slate-700">
           <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-1"><Thermometer size={18}/><span className="text-xs font-bold uppercase">Máxima</span></div>
           <p className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.maxTemp.toFixed(1)}°C</p>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500 shadow-sm bg-white dark:bg-slate-800 dark:border-slate-700">
           <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1"><Activity size={18}/><span className="text-xs font-bold uppercase">Média Geral</span></div>
           <p className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.avgTemp.toFixed(1)}°C</p>
        </Card>
        <Card className="p-4 border-l-4 border-amber-500 shadow-sm bg-white dark:bg-slate-800 dark:border-slate-700">
           <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1"><AlertTriangle size={18}/><span className="text-xs font-bold uppercase">Alertas</span></div>
           <p className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.counts.Atencao + stats.counts.Critico}</p>
        </Card>
        <Card className="p-4 border-l-4 border-slate-500 shadow-sm bg-white dark:bg-slate-800 dark:border-slate-700">
           <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1"><Wind size={18}/><span className="text-xs font-bold uppercase">Monitorados</span></div>
           <p className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">{data.length}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        <Card className="p-6 col-span-1 shadow-sm border-none bg-white dark:bg-slate-800">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 text-sm uppercase tracking-wide">Status da Malha</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.statusCount} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                  {stats.statusCount.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend verticalAlign="bottom" wrapperStyle={{ color: chartTextColor }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-0 col-span-1 lg:col-span-2 overflow-hidden flex flex-col shadow-sm border-none bg-white dark:bg-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-500"/> Top 5 Pontos Críticos
            </h3>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3">Estação</th>
                  <th className="px-6 py-3">KM</th>
                  <th className="px-6 py-3 text-right">Temp.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {stats.topHot.map((station, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-700 dark:text-slate-200">{station.sb}</td>
                    <td className="px-6 py-3 text-slate-500 dark:text-slate-400">{station.km_inicio}</td>
                    <td className="px-6 py-3 text-right font-bold text-rose-600 dark:text-rose-400">{station.estimated_rail_temp.toFixed(1)}°C</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-sm border-none bg-white dark:bg-slate-800">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 text-sm uppercase">Ambiente vs Trilho</h3>
            <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis type="number" dataKey="ar" name="Ar" unit="°C" tick={{fontSize:12, fill: chartTextColor}} />
                <YAxis type="number" dataKey="trilho" name="Trilho" unit="°C" tick={{fontSize:12, fill: chartTextColor}} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={tooltipStyle} />
                <Scatter name="Pontos" data={stats.correlation} fill="#3b82f6" fillOpacity={0.5} />
                </ScatterChart>
            </ResponsiveContainer>
            </div>
        </Card>

        <Card className="p-6 shadow-sm border-none bg-white dark:bg-slate-800">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 text-sm uppercase">Efeito do Vento</h3>
            <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis type="number" dataKey="vento" name="Vento" unit="km/h" tick={{fontSize:12, fill: chartTextColor}} />
                <YAxis type="number" dataKey="trilho" name="Trilho" unit="°C" tick={{fontSize:12, fill: chartTextColor}} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={tooltipStyle} />
                <Scatter name="Pontos" data={stats.windEffect} fill="#10B981" fillOpacity={0.5} />
                </ScatterChart>
            </ResponsiveContainer>
            </div>
        </Card>
      </div>

    </div>
  );
};