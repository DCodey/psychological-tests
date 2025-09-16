import React, { useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Tooltip,
  Label,
} from "recharts";

// Colores para los cuadrantes
const quadrantColors = {
  melancholic: "#6366f1",    // Índigo
  choleric: "#f59e0b",      // Ámbar
  phlegmatic: "#10b981",    // Esmeralda
  sanguine: "#ef4444"       // Rojo
};

interface TemperamentChartProps {
  eScore: number;
  nScore: number;
}

const TemperamentChart: React.FC<TemperamentChartProps> = ({ eScore, nScore }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const userPoint = [{ x: eScore, y: nScore }];
  const min = 0;
  const max = 24;
  const mid = 12;
  const numbers = Array.from({ length: 25 }, (_, i) => i);

  useEffect(() => {
    // Pequeño retraso para la animación inicial
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const quadrantStyles = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "14px",
    fontWeight: "600",
    textAnchor: "middle" as const,
    opacity: isAnimated ? 1 : 0,
    transition: 'opacity 0.8s ease-in-out'
  };

  return (
    <div className="w-full min-h-[300px] bg-gradient-to-br from-gray-50 to-white p-2 sm:p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl">
      <h3 className="text-xl font-bold mb-2 sm:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
        Plano de Temperamentos
      </h3>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[400px] h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              {/* Fondo de cuadrantes con opacidad */}
              <ReferenceArea x1={min} x2={mid} y1={mid} y2={max} fill={quadrantColors.melancholic} fillOpacity={0.08} />
              <ReferenceArea x1={mid} x2={max} y1={mid} y2={max} fill={quadrantColors.choleric} fillOpacity={0.08} />
              <ReferenceArea x1={min} x2={mid} y1={min} y2={mid} fill={quadrantColors.phlegmatic} fillOpacity={0.08} />
              <ReferenceArea x1={mid} x2={max} y1={min} y2={mid} fill={quadrantColors.sanguine} fillOpacity={0.08} />

              {/* Ejes invisibles (necesarios para ReferenceLine) */}
              <XAxis type="number" dataKey="x" domain={[min, max]} hide />
              <YAxis type="number" dataKey="y" domain={[min, max]} hide />

              {/* Cruz central con animación */}
              <ReferenceLine 
                x={mid} 
                stroke="#4b5563" 
                strokeWidth={1.5}
                strokeDasharray={isAnimated ? '0' : '100%'}
                style={{ transition: 'stroke-dasharray 1.2s ease-out' }}
              >
                <Label value="0" position="insideBottom" offset={15} style={{ fill: '#4b5563', fontSize: '12px' }} />
              </ReferenceLine>
              <ReferenceLine 
                y={mid} 
                stroke="#4b5563" 
                strokeWidth={1.5}
                strokeDasharray={isAnimated ? '0' : '100%'}
                style={{ transition: 'stroke-dasharray 1.2s ease-out 0.3s' }}
              >
                <Label value="0" position="left" offset={10} style={{ fill: '#4b5563', fontSize: '12px' }} />
              </ReferenceLine>

              {/* Cuadrado central con animación */}
              <ReferenceArea
                x1={8.5}
                x2={15.5}
                y1={6}
                y2={18}
                fill="none"
                stroke="#6b7280"
                strokeWidth={1.5}
                strokeDasharray="3 2"
                opacity={isAnimated ? 1 : 0}
                style={{ transition: 'opacity 0.8s ease-out 0.6s' }}
              />

              {/* Punto del usuario con animación */}
              <Scatter 
                data={userPoint} 
                fill="#4f46e5" 
                shape="circle" 
                className="animate-pulse"  
                style={{ 
                  filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))'
                }}              
              />
              

              {/* Numeración en eje X (con hueco en el centro) */}
              {numbers.map((n) => {
                 let offset = 0;

                 if (n <= mid) offset = -0.9;   // todos los números de la izquierda
                 if (n > mid) offset = 0;    // todos los números de la derecha
               
                 return (
                   <text
                     key={`x-${n}`}
                     x={`${((n + offset) / max) * 100}%`}
                     y="53%"
                     textAnchor="middle"
                     fontSize="10"
                     fill="#000"
                   >
                     {n}
                   </text>
                );
              })}

              {/* Numeración en eje Y (con hueco en el centro) */}
              {numbers.map((n) => {
                 let offset = 0;

                 if (n <= mid) offset = -1,5;   // todos los números de abajo
                 if (n > mid) offset = 0;    // todos los números de arriba
               
                 return (
                   <text
                     key={`y-${n}`}
                     x="53%"
                     y={`${100 - ((n + offset) / max) * 100}%`}
                     textAnchor="end"
                     fontSize="10"
                     fill="#000"
                   >
                     {n}
                   </text>
                 );
              })}

              {/* Etiquetas cuadrantes con colores y animación */}
              <text 
                x="25%" 
                y="8%" 
                {...quadrantStyles}
                fill={quadrantColors.melancholic}
                style={{
                  ...quadrantStyles,
                  transform: isAnimated ? 'translateY(0)' : 'translateY(-20px)',
                  transition: 'opacity 0.5s ease-out 0.4s, transform 0.5s ease-out 0.4s'
                }}
              >
                MELANCÓLICO
              </text>
              <text 
                x="75%" 
                y="8%" 
                {...quadrantStyles}
                fill={quadrantColors.choleric}
                style={{
                  ...quadrantStyles,
                  transform: isAnimated ? 'translateY(0)' : 'translateY(-20px)',
                  transition: 'opacity 0.5s ease-out 0.5s, transform 0.5s ease-out 0.5s'
                }}
              >
                COLÉRICO
              </text>
              <text 
                x="25%" 
                y="94%" 
                {...quadrantStyles}
                fill={quadrantColors.phlegmatic}
                style={{
                  ...quadrantStyles,
                  transform: isAnimated ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease-out 0.6s, transform 0.5s ease-out 0.6s'
                }}
              >
                FLEMÁTICO
              </text>
              <text 
                x="75%" 
                y="94%" 
                {...quadrantStyles}
                fill={quadrantColors.sanguine}
                style={{
                  ...quadrantStyles,
                  transform: isAnimated ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease-out 0.7s, transform 0.5s ease-out 0.7s'
                }}
              >
                SANGUÍNEO
              </text>

              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value, name) => {
                  if (name === "x") return [value, "Extraversión"];
                  if (name === "y") return [value, "Neuroticismo"];
                  return [value, name];
                }}
                contentStyle={{
                  fontSize: "0.875rem",
                  padding: "0.5rem 0.75rem",
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  border: "none",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
                itemStyle={{
                  padding: "0.125rem 0",
                  textTransform: "capitalize",
                  color: "#1f2937"
                }}
                labelStyle={{
                  fontWeight: 600,
                  color: "#4f46e5",
                  marginBottom: "0.25rem"
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 text-sm text-center">
        <div className="inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full">
          <span className="text-indigo-700 font-medium">
            Tu puntuación: <span className="font-bold">E = {eScore}</span>, <span className="font-bold">N = {nScore}</span>
          </span>          
        </div>
      </div>
    </div>
  );
};

export default TemperamentChart;
