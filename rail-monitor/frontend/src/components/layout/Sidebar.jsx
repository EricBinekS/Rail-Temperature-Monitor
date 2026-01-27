import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Map, BarChart3, TrainFront, Settings, RefreshCw } from 'lucide-react';

export const Sidebar = () => {
  const [updating, setUpdating] = useState(false);

  const handleRefresh = async () => {
    setUpdating(true);
    try {
      const response = await fetch('http://localhost:8000/refresh', { 
        method: 'POST' 
      });
      const data = await response.json();
      
      if (data.success) {
        console.log("Atualização concluída!");
        setTimeout(() => {
          window.location.reload(); 
        }, 1000);
      } else {
        alert("Erro ao atualizar: " + data.message);
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert("Erro: O servidor Python está rodando?");
    } finally {
      setUpdating(false);
    }
  };

  const navItems = [
    { to: "/", icon: Map, label: "Mapa" },
    { to: "/analytics", icon: BarChart3, label: "Dados" },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col items-center w-20 bg-slate-900 border-r border-slate-800 h-screen py-6 z-50 fixed left-0 top-0 shadow-xl transition-all">
        
        <div className="bg-blue-600 p-2.5 rounded-xl mb-10 shadow-lg shadow-blue-500/20">
          <TrainFront size={24} className="text-white" />
        </div>

        <nav className="flex flex-col gap-6 w-full px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <item.icon size={24} strokeWidth={2} />
            </NavLink>
          ))}
          
          <button
            onClick={handleRefresh}
            disabled={updating}
            title="Atualizar Dados Agora"
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 group mt-4 border border-slate-700
              ${updating 
                ? "bg-slate-800 cursor-wait text-blue-400" 
                : "text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/50"
              }`}
          >
            <RefreshCw size={24} className={updating ? "animate-spin" : ""} />
          </button>
        </nav>

        <div className="mt-auto mb-4 text-slate-500 hover:text-white cursor-pointer transition-colors p-3">
            <Settings size={20} />
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-slate-900 border-t border-slate-800 z-50 flex justify-around items-center px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-2 rounded-lg transition-colors
              ${isActive ? "text-blue-400" : "text-slate-500"}`
            }
          >
            <item.icon size={24} />
          </NavLink>
        ))}
         <button onClick={handleRefresh} disabled={updating} className="text-emerald-500 p-2">
            <RefreshCw size={24} className={updating ? "animate-spin" : ""} />
         </button>
      </nav>
    </>
  );
};