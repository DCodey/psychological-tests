import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface TemperamentChartProps {
  eScore: number;
  nScore: number;
}

const TemperamentChart: React.FC<TemperamentChartProps> = ({ eScore, nScore }) => {
  // Datos para el punto del usuario
  const userPoint = [{ x: eScore, y: nScore }];

  // Límites del gráfico
  const min = 0;
  const max = 24;
  const mid = 12;

  // Estilos para los cuadrantes
  const quadrantStyles = {
    fontFamily: 'sans-serif',
    fontSize: '14px',
    fontWeight: 'bold',
    textAnchor: 'middle' as const,
  };

  return (
    <div className="w-full min-h-[300px] bg-white p-2 sm:p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 sm:mb-4 text-center sm:text-left">Plano de Temperamentos</h3>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[500px] h-[300px] sm:h-[400px] md:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 10,
              right: 10,
              bottom: 30,
              left: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            
            {/* Eje X - Extraversión */}
            <XAxis
              type="number"
              dataKey="x"
              name="Extraversión"
              domain={[min, max]}
              ticks={[0, 6, 12, 18, 24]}
              tick={{ fontSize: '0.75rem' }}
              label={{
                value: 'Extraversión (E)',
                position: 'bottom',
                offset: 10,
                style: { fontSize: '0.75rem' }
              }}
            />
            
            {/* Eje Y - Neuroticismo */}
            <YAxis
              type="number"
              dataKey="y"
              name="Neuroticismo"
              domain={[min, max]}
              ticks={[0, 6, 12, 18, 24]}
              tick={{ fontSize: '0.75rem' }}
              label={{
                value: 'Neuroticismo aaaa(N)',
                angle: -90,
                position: 'left',
                offset: 15,
                style: { fontSize: '0.75rem' }
              }}
            />
            
            {/* Líneas de referencia para dividir los cuadrantes */}
            <ReferenceLine x={mid} stroke="#666" strokeDasharray="3 3" />
            <ReferenceLine y={mid} stroke="#666" strokeDasharray="3 3" />
            
            {/* Punto del usuario */}
            <Scatter
              name="Tú"
              data={userPoint}
              fill="#4f46e5"
              shape="circle"
              r={6}
              isAnimationActive={false}
            />
            
            {/* Etiquetas de los cuadrantes */}
            <text x="25%" y="25%" {...quadrantStyles} fill="#ef4444" fontSize="0.75rem">
              Melancólico
            </text>
            <text x="75%" y="25%" {...quadrantStyles} fill="#f59e0b" fontSize="0.75rem">
              Colérico
            </text>
            <text x="25%" y="75%" {...quadrantStyles} fill="#10b981" fontSize="0.75rem">
              Flemático
            </text>
            <text x="75%" y="75%" {...quadrantStyles} fill="#3b82f6" fontSize="0.75rem">
              Sanguíneo
            </text>
            
            <Tooltip
              formatter={(value, name) => {
                // name es el dataKey del punto de datos
                if (name === 'x') return [value, 'Extraversión'];
                if (name === 'y') return [value, 'Neuroticismo'];
                return [value, name];
              }}
              contentStyle={{
                fontSize: '0.875rem',
                padding: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ padding: '0.25rem 0' }}
            />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Leyenda */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>Tu puntuación: E = {eScore}, N = {nScore}</p>
      </div>
    </div>
  );
};

export default TemperamentChart;
