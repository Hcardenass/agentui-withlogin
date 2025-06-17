// src/app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import AuthProvider from './AuthProvider';

export const metadata = {
  title: '🤖 TecnoAIgent',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <AuthProvider>
          {/* Sidebar: hidden on mobile, shown on md+ */}
          <aside className="hidden md:block w-64 bg-neutral-900 text-white p-6 flex-shrink-0">
            <h1 className="text-2xl font-bold mb-4">🤖 TecnoAIgent</h1>
            <p className="text-sm leading-relaxed">
              Este agente inteligente puede:
            </p>
            <ul className="mt-3 text-sm space-y-2">
              <li>🔍 Buscar información de datos comerciales y pedidos</li>
              <li>📊 Generar gráficas</li>
              <li>🔈 Responder con audios</li>
              <li>🧠 Recordar tu conversación</li>
            </ul>
          </aside>
          {/* Banner/top bar on mobile */}
          <div className="md:hidden w-full bg-neutral-900 text-white px-4 py-3 flex items-center">
            <span className="text-lg font-bold mr-2">🤖 TecnoAIgent</span>
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
