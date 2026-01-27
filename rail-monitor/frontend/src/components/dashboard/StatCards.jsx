import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { CheckCircle, AlertTriangle, Flame, Activity } from 'lucide-react';
import { getStatusSolda } from '../../lib/rules';

export const StatCards = ({ data }) => {
  const stats = useMemo(() => {
    const counts = { total: data.length, ideal: 0, atencao: 0, critico: 0 };
    data.forEach(station => {
      const status = getStatusSolda(station.estimated_rail_temp);
      if (status.status === 'Ideal') counts.ideal++;
      else if (status.status === 'Atenção') counts.atencao++;
      else counts.critico++;
    });
    return counts;
  }, [data]);

  const iconBase = "p-2 rounded-full backdrop-blur-sm";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 p-2 md:p-4 z-10 relative max-w-7xl mx-auto">
      
      <Card className="p-3 md:p-4 flex items-center gap-3 border-l-4 border-l-blue-500 shadow-lg bg-white/90 dark:bg-slate-800/90 dark:border-slate-700 backdrop-blur transition-colors">
        <div className={`${iconBase} bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400`}>
          <Activity size={20} />
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Monitorados</p>
          <p className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.total}</p>
        </div>
      </Card>

      <Card className="p-3 md:p-4 flex items-center gap-3 border-l-4 border-l-emerald-500 shadow-lg bg-white/90 dark:bg-slate-800/90 dark:border-slate-700 backdrop-blur transition-colors">
        <div className={`${iconBase} bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400`}>
          <CheckCircle size={20} />
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Fechamento</p>
          <p className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.ideal}</p>
        </div>
      </Card>

      <Card className="p-3 md:p-4 flex items-center gap-3 border-l-4 border-l-amber-500 shadow-lg bg-white/90 dark:bg-slate-800/90 dark:border-slate-700 backdrop-blur transition-colors">
        <div className={`${iconBase} bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400`}>
          <AlertTriangle size={20} />
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Solda Comum</p>
          <p className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.atencao}</p>
        </div>
      </Card>

      <Card className="p-3 md:p-4 flex items-center gap-3 border-l-4 border-l-rose-500 shadow-lg bg-white/90 dark:bg-slate-800/90 dark:border-slate-700 backdrop-blur transition-colors">
        <div className={`${iconBase} bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400 animate-pulse`}>
          <Flame size={20} />
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Risco Crítico</p>
          <p className="text-xl md:text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.critico}</p>
        </div>
      </Card>

    </div>
  );
};