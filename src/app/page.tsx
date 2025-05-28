// src/app/page.tsx
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, FormEvent } from 'react';

type Mensaje = { de: 'usuario' | 'bot'; texto: string };

export default function Page() {
  const { data: session } = useSession();
  const [chat, setChat] = useState<Mensaje[]>([]);
  const [msg, setMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Si no hay sesión, mostramos botón de login
  if (!session) {
    return (
      <div className="h-full flex items-center justify-center">
         <button
          onClick={() => signIn('google')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
        >
          
          Login con Google
        </button>
      </div>
    );
  }

  // Función para enviar mensaje
  const enviar = async (e: FormEvent) => {
      e.preventDefault();
      if (!msg) return;
    
      setLoading(true);
    
      const userEmail = session.user?.email ?? '';
    
      // Añadir mensaje temporal del bot
      setChat((c) => [
        ...c,
        { de: 'usuario', texto: msg },
        { de: 'bot', texto: 'Generando la respuesta, por favor esperes...' }
      ]);
    
      try {
        const res = await fetch(
          `/api/agent?idagente=${encodeURIComponent(userEmail)}&msg=${encodeURIComponent(msg)}`
        );
        const texto = await res.text();
    
        // Reemplazar el mensaje temporal del bot con la respuesta real
        setChat((c) => [
          ...c.slice(0, -1), // eliminar el último mensaje ("espera...")
          { de: 'bot', texto }
        ]);
      } catch (err) {
        setChat((c) => [
          ...c.slice(0, -1),
          { de: 'bot', texto: '❌ Ocurrió un error al obtener la respuesta.' }
        ]);
      }
    
      setMsg('');
      setLoading(false);
  };


  return (
    <div className="h-full flex flex-col p-4">
      <header className="mb-4 flex justify-between items-center">
        <div>
          <span className="font-medium">¡Hola, {session.user?.email}!</span>
        </div>
        <button
          onClick={() => signOut()}
          className="text-sm text-gray-600 hover:underline"
        >
          Cerrar sesión
        </button>
      </header>

      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {chat.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded max-w-[70%] ${
              m.de === 'usuario'
                ? 'ml-auto bg-blue-100 text-black'
                : 'mr-auto bg-gray-100 text-black'
            }`}
          >
            {m.texto}
          </div>
        ))}
      </div>

      <form onSubmit={enviar} className="mt-2 flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2 bg-white text-black placeholder-gray-500
             dark:bg-zinc-800 dark:text-white dark:placeholder-gray-400"
          placeholder="Escribe tu mensaje…"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          disabled={loading}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? '…' : 'Enviar'}
        </button>
      </form>
    </div>
);
}
