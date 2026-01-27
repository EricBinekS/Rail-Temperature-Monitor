import { CheckCircle, AlertTriangle, XCircle, ThermometerSnowflake, Flame } from 'lucide-react';

export const getStatusSolda = (temp) => {
  const Tn = 35; 
  
  const LIMIT_BUCKLING = 40; // Acima disso, risco alto de flambagem 
  const LIMIT_FRACTURE = 20; // Abaixo disso, risco de ruptura 
  
  // Faixa Ideal para Fechamento (Onde a tensão residual é mínima)
  const CLOSURE_MIN = 30;
  const CLOSURE_MAX = 40;

  // É o momento perfeito: o trilho está no tamanho "natural" dele.
  if (temp >= CLOSURE_MIN && temp <= CLOSURE_MAX) {
    return {
      status: "Ideal",
      label: "Liberado: Fechamento",
      desc: "Tensão nula. Ideal para fixação definitiva.",
      color: "#10B981", 
      bgClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: CheckCircle
    };
  }

  // 2. FAIXA OPERACIONAL: Solda Comum (Amarelo)
  // Pode soldar, mas o trilho está levemente expandido ou contraído.
  // Requer uso de tensores para garantir a Tn.
  if (temp >= LIMIT_FRACTURE && temp <= LIMIT_BUCKLING) {
    // Sub-lógica: Diferenciar se está "meio frio" ou "meio quente"
    const isHot = temp > Tn;
    
    return {
      status: "Atenção",
      label: "Restrição: Solda Comum",
      desc: isHot ? "Risco leve de compressão." : "Risco leve de tração.",
      color: "#F59E0B", 
      bgClass: "bg-amber-100 text-amber-800 border-amber-200",
      icon: AlertTriangle
    };
  }

  // 3. CRÍTICO: Risco de Flambagem (Vermelho Quente)
  if (temp > LIMIT_BUCKLING) {
    return {
      status: "Crítico",
      label: "Proibido: Risco de Flambagem",
      desc: "Dilatação excessiva. Via instável.",
      color: "#EF4444", 
      bgClass: "bg-rose-100 text-rose-800 border-rose-200",
      icon: Flame 
    };
  }

  // 4. CRÍTICO: Risco de Ruptura (Azul/Vermelho Frio)
  return {
    status: "Crítico",
    label: "Proibido: Risco de Ruptura",
    desc: "Contração excessiva. Solda pode trincar.",
    color: "#3B82F6", 
    bgClass: "bg-blue-100 text-blue-800 border-blue-200",
    icon: ThermometerSnowflake 
  };
};