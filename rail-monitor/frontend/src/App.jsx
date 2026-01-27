import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRailData } from './hooks/useRailData';
import { Sidebar } from './components/layout/Sidebar';
import { RailMap } from './components/dashboard/RailMap';
import { StatCards } from './components/dashboard/StatCards';
import { DetailsPanel } from './components/dashboard/DetailsPanel';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { TrainFront, Moon, Sun, Filter, Download, Flame } from 'lucide-react';
import { getStatusSolda } from './lib/rules';

const MapPage = ({ data, theme, setTheme }) => {
  const [selectedStation, setSelectedStation] = useState(null);
  const [filter, setFilter] = useState('all');
  const [heatmapMode, setHeatmapMode] = useState(false);

  const filteredData = useMemo(() => {
    if (filter === 'all') return data;
    return data.filter(d => {
      const status = getStatusSolda(d.estimated_rail_temp);
      if (filter === 'Critical') return status.status === 'Crítico';
      if (filter === 'Attention') return status.status === 'Atenção';
      return true;
    });
  }, [data, filter]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "SB,KM Inicio,Latitude,Longitude,Temperatura Trilho,Status\n"
      + filteredData.map(d => `${d.sb},${d.km_inicio},${d.lat},${d.lng},${d.estimated_rail_temp},${getStatusSolda(d.estimated_rail_temp).status}`).join("\n");
    
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `relatorio_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] md:h-screen overflow-hidden bg-slate-200 dark:bg-slate-900 transition-colors">
      
      <div className="hidden md:block absolute top-4 left-4 z-[400] w-[calc(100%-400px)] pointer-events-none">
        <div className="pointer-events-auto origin-top-left scale-90">
           <StatCards data={filteredData} />
        </div>
      </div>

      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-3">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-2 rounded-xl shadow-xl border border-white/20 dark:border-slate-700 flex flex-col gap-2 w-48 transition-all">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mt-1">Visualização</div>
          
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm transition-colors">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
          </button>

          <button onClick={() => setHeatmapMode(!heatmapMode)} className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${heatmapMode ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
            <Flame size={16} className={heatmapMode ? "text-rose-500" : ""} /> Visual Térmico
          </button>

          <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Filtros</div>

          <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
            {['all', 'Critical', 'Attention'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`flex-1 text-[10px] py-1.5 rounded-md font-bold transition-all ${filter === f ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                {f === 'all' ? 'Todos' : f === 'Critical' ? 'Crítico' : 'Atenção'}
              </button>
            ))}
          </div>
          
          <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
          <button onClick={handleExport} className="flex items-center justify-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/30 active:scale-95">
            <Download size={16} /> Exportar CSV
          </button>
        </div>
      </div>

      <RailMap data={filteredData} selectedStation={selectedStation} onSelectStation={setSelectedStation} theme={theme} showHeatmap={heatmapMode} />

      {selectedStation && <DetailsPanel station={selectedStation} onClose={() => setSelectedStation(null)} />}
    </div>
  );
};

function App() {
  const { data, loading } = useRailData();
  const [theme, setTheme] = useState('light');

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500">
        <div className="flex flex-col items-center gap-3 animate-pulse">
           <TrainFront size={48} className="text-blue-600" />
           <p className="text-sm font-bold tracking-widest uppercase">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className={`${theme === 'dark' ? 'dark' : ''} flex flex-col md:flex-row h-screen font-sans text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
        
        <Sidebar />

        <main className="flex-1 md:ml-20 transition-all duration-300 relative">
          <Routes>
            <Route path="/" element={<MapPage data={data} theme={theme} setTheme={setTheme} />} />
            <Route path="/analytics" element={<AnalyticsPage theme={theme} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;