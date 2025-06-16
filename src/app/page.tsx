'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, FormEvent } from 'react';
import { FaUser, FaRobot, FaSpinner } from 'react-icons/fa';

type Mensaje = { de: 'usuario' | 'bot'; texto: string; url_mp3?: string };

export default function Page() {
  const { data: session } = useSession();
  const [chat, setChat] = useState<Mensaje[]>([]);
  const [msg, setMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Estado para el modelo seleccionado
  const [selectedModel, setSelectedModel] = useState<string>('Analytic_Model_Comercial');

  // Si no hay sesión, mostramos botón de login
  if (!session) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50">
        <button
          onClick={() => signIn('google')}
          className="bg-black text-white text-sm px-3 py-1 rounded 
             hover:bg-gray-800 hover:shadow-md hover:scale-105 
             active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
      `/api/agent?idagente=${encodeURIComponent(userEmail)}&msg=${encodeURIComponent(textoUsuario)}&view_name=${encodeURIComponent(selectedModel)}`
    );
    //const textoReal = await res.text();
    const data = await res.json();
    // 3) Reemplazamos el mensaje “Generando respuesta” por la respuesta real
    setChat((c) => {
      const nuevoChat = [...c];
      // El placeholder siempre será el último elemento
      nuevoChat[nuevoChat.length - 1] = { de: 'bot', texto: data.respuesta, url_mp3: data.url_mp3 || undefined };
      return nuevoChat;
    });

    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col p-4">
      <header className="mb-4 flex justify-between items-center">
        <div>
          <span className="font-medium">¡Hola, {session.user?.name?.split(' ')[0] || 'Usuario'}!</span>
        </div>
        <button
          onClick={() => signOut()}
          className="bg-black text-white text-sm px-3 py-1 rounded 
             hover:bg-gray-800 hover:shadow-md 
             active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Select para elegir modelo */}
      <div className="mb-4">
        <label htmlFor="modelo-select" className="block mb-1 font-semibold text-black dark:text-gray-500">
          Selecciona el modelo analítico:
        </label>
        <select
          id="modelo-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full rounded border px-3 py-2 bg-white text-black dark:bg-zinc-800 dark:text-white"
          disabled={loading}
        >
          <option value="Analytic_Model_Comercial">Modelo Comercial</option>
          <option value="Model_Detalle_Pedido">Detalle de Pedidos</option>
        </select>
      </div>

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
                  ? 'ml-auto bg-gray-200 text-gray-800'
                  : 'mr-auto bg-amber-100 text-black'
              }`}
            >
              {/* Icono de persona o robot */}
              {m.de === 'usuario' ? (
                <div className="flex-shrink-0">
                  <FaUser className="w-5 h-5 text-blue-600" />
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <FaRobot className="w-5 h-5 text-gray-600" />
                </div>
              )}
            
              {/* Si es placeholderBot en loading, mostramos el spinner */}
              {esPlaceholderBot && (
                <FaSpinner className="w-4 h-4 text-gray-600 animate-spin" />
              )}
              <div>
                <span>{m.texto}</span>              
                {m.url_mp3 && (
                  <audio controls className="mt-2 max-w-full">
                    <source src={m.url_mp3} type="audio/mp3" />
                    Tu navegador no soporta audio.
                  </audio>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={enviar} className="mt-2 flex gap-2 sticky bottom-0 bg-gray-100 py-2 z-10">
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
