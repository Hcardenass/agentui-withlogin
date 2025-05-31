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
      <body className="flex h-screen bg-gray-50">
        <AuthProvider>
          <aside className="w-64 bg-neutral-900 text-white p-6">
            <h1 className="text-2xl font-bold mb-4">🤖 TecnoAIgent</h1>
            <p className="text-sm leading-relaxed">
              Este agente inteligente puede:
            </p>
            <ul className="mt-3 text-sm space-y-2">
              <li>🔍 Buscar información de datos comerciales</li>
              <li>🔈 Enviar audios de los resultados por WhatsApp</li>
            </ul>
          </aside>
          <main className="flex-1 overflow-auto bg-gray-100 p-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
