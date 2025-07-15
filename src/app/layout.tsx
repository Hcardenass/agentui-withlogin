// src/app/layout.tsx
import './globals.css';
import './glassmorphism.css';
import FeatureTooltip from './FeatureTooltip';

// Estilos para el logo circular gradiente

import type { ReactNode } from 'react';
import AuthProvider from './AuthProvider';

export const metadata = {
  title: '🤖 TecnoAIgent',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" data-kantu="1">
      <body className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <AuthProvider>
          {/* Sidebar: hidden on mobile, shown on md+ */}
          <aside className="hidden md:block w-64 bg-neutral-900 text-white p-6 flex-shrink-0">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span role="img" aria-label="robot">🤖</span>
              <span
                style={{
                  background: 'linear-gradient(45deg, #00f5ff, #7c3aed, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 30px rgba(0,245,255,0.3)'
                }}
              >
                TecnoAIgent
              </span>
            </h1>
            <p className="text-sm leading-relaxed">
              Este asistente puede:
            </p>
            <ul className="mt-3 text-sm flex flex-col gap-3">
              {[
                { icon: '🔍', text: 'Buscar información del modelo de datos que selecciones', tooltip: 'info' },
                { icon: '📊', text: 'Generar gráficas', tooltip: 'chart' },
                { icon: '🔈', text: 'Responder con audios', tooltip: 'audio' },
                { icon: '🧠', text: 'Recordar tu conversación', description: 'El asistente recuerda el hilo de tu conversación, pero solo durante el día actual.' }
              ].map((item, idx) => {
                if (item.tooltip === 'info') {
                  return (
                    <FeatureTooltip
                      key={idx}
                      title="Ejemplos para consultas de modelos de datos"
                      examples={[
                        '1. ¿Cuáles son los 3 clientes con mayor cantidad de colocado en el 2025?',
                        '2. Dame las ventas por mes del 2025.',
                        '3. ¿Cuáles son los 3 principales clientes con mayor diferencia entre presupuesto y facturado en el año 2025?',
                        '4. Muéstrame el detalle de ventas por producto para el primer trimestre.'
                      ]}
                    >
                      <li
                        className="feature-glass px-4 py-2 flex items-center gap-2 cursor-pointer transition-all duration-400"
                        tabIndex={0}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.text}</span>
                      </li>
                    </FeatureTooltip>
                  );
                } else if (item.tooltip === 'chart') {
                  return (
                    <FeatureTooltip
                      key={idx}
                      title="Ejemplos para gráficas"
                      examples={[
                        '1. Genera un gráfico de barras del top 3 de clientes del año actual.',
                        '2. Graficar la tendencia mensual de facturación en 2024.',
                        '3. Graficar el resultado de la última consulta.',
                        '4. Hazme un gráfico de torta con la participación de ventas por región.'
                      ]}
                    >
                      <li
                        className="feature-glass px-4 py-2 flex items-center gap-2 cursor-pointer transition-all duration-400"
                        tabIndex={0}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.text}</span>
                      </li>
                    </FeatureTooltip>
                  );
                } else if (item.tooltip === 'audio') {
                  return (
                    <FeatureTooltip
                      key={idx}
                      title="Ejemplos para audios"
                      examples={[
                        '1. Genera un audio con la respuesta anterior.',
                        '2. Genera un audio explicando la tendencia del facturado en TM del 2025.',
                        '3. Hazme un audio con el resumen de los principales clientes del mes.',
                        '4. Dame un audio explicando la gráfica generada.'
                      ]}
                    >
                      <li
                        className="feature-glass px-4 py-2 flex items-center gap-2 cursor-pointer transition-all duration-400"
                        tabIndex={0}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.text}</span>
                      </li>
                    </FeatureTooltip>
                  );
                } else if (item.icon === '🧠') {
                  return (
                    <FeatureTooltip
                      key={idx}
                      title="Memoria de la conversación"
                      examples={[
                        'El asistente recuerda el hilo de tu conversación, pero solo durante el día actual.'
                      ]}
                    >
                      <li
                        className="feature-glass px-4 py-2 flex items-center gap-2 cursor-pointer transition-all duration-400"
                        tabIndex={0}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.text}</span>
                      </li>
                    </FeatureTooltip>
                  );
                } else {
                  return (
                    <li
                      key={idx}
                      className="feature-glass px-4 py-2 flex items-center gap-2 cursor-pointer transition-all duration-400"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.text}</span>
                    </li>
                  );
                }
              })}
            </ul>
          </aside>
          {/* Banner/top bar on mobile */}
          <div className="md:hidden w-full bg-neutral-900 text-white px-4 py-3 flex items-center">
            <span role="img" aria-label="robot" className="text-lg font-bold mr-1">🤖</span>
            <span
              className="text-lg font-bold mr-2"
              style={{
                background: 'linear-gradient(45deg, #00f5ff, #7c3aed, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(0,245,255,0.3)'
              }}
            >
              TecnoAIgent
            </span>
            <span className="text-xs">Tu asistente inteligente</span>
          </div>
          <main className="flex-1 overflow-auto bg-gray-100 p-4 md:p-6 flex flex-col">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}