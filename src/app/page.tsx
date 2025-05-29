'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, FormEvent } from 'react';
import { FaUser, FaRobot, FaSpinner } from 'react-icons/fa';

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
    if (!msg) 
      return;

    setLoading(true);

    // Guardamos el mensaje del usuario en una variable antes de limpiar el input
    const textoUsuario = msg;

    // 1) Añadimos al chat el mensaje del usuario y un placeholder “Generando respuesta”
    setChat((c) => [
      ...c,
      { de: 'usuario', texto: textoUsuario },
      { de: 'bot', texto: 'Generando la respuesta, por favor espere…' }
    ]);

    // Limpiamos el input inmediatamente
    setMsg('');

    // 2) Ejecutamos la petición al backend
    const userEmail = session.user?.email ?? '';
    const res = await fetch(
      `/api/agent?idagente=${encodeURIComponent(userEmail)}&msg=${encodeURIComponent(textoUsuario)}`
    );
    const textoReal = await res.text();

    // 3) Reemplazamos el mensaje “Generando respuesta” por la respuesta real
    setChat((c) => {
      const nuevoChat = [...c];
      // El placeholder siempre será el último elemento
      nuevoChat[nuevoChat.length - 1] = { de: 'bot', texto: textoReal };
      return nuevoChat;
    });

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
          className="bg-black text-white text-sm px-3 py-1 rounded hover:opacity-80"
        >
          Cerrar sesión
        </button>
      </header>

      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {chat.map((m, i) => {
          // Detectamos si este mensaje de 'bot' es el placeholder en loading
          const esPlaceholderBot =
            m.de === 'bot' &&
            loading &&
            i === chat.length - 1 &&
            m.texto.includes('Generando');

          return (
            <div
              key={i}
              className={`p-3 rounded max-w-[70%] whitespace-pre-wrap flex items-start gap-2 ${
                m.de === 'usuario'
                  ? 'ml-auto bg-blue-100 text-black'
                  : 'mr-auto bg-gray-100 text-black'
              }`}
            >
              {/* Icono de persona o robot */}
              {m.de === 'usuario' ? (
                <FaUser className="w-5 h-5 text-blue-600" />
              ) : (
                <FaRobot className="w-5 h-5 text-gray-600" />
              )}

              {/* Si es placeholderBot en loading, mostramos el spinner */}
              {esPlaceholderBot && (
                <FaSpinner className="w-4 h-4 text-gray-600 animate-spin" />
              )}

              {/* Texto del mensaje */}
              <span>{m.texto}</span>
            </div>
          );
        })}
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
