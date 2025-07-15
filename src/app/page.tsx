'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, FormEvent } from 'react';
import { FaUser, FaRobot, FaSpinner, FaArrowUp } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const AudioRecorder = dynamic(() => import('../components/AudioRecorder'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-11 h-11 rounded-full border">
      <FaSpinner className="w-5 h-5 animate-spin" />
    </div>
  ),
});

type Mensaje = { de: 'usuario' | 'bot'; texto: string; url_mp3?: string; url_png?: string };

export default function Page() {
  const { data: session } = useSession();
  const [chat, setChat] = useState<Mensaje[]>([]);
  const [msg, setMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [recordingStatus, setRecordingStatus] = useState('idle');

  // Estado para el modelo seleccionado
  const [selectedModel, setSelectedModel] = useState<string>('Analytic_Model_Comercial');

  const handleTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    const formData = new FormData();
    formData.append('audio', blob, 'recording.wav');

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'La transcripción falló');
      }

      const data = await response.json();
      setMsg(data.transcription); // Ponemos el texto en el input
    } catch (error) {
      console.error('Error al transcribir:', error);
      // Opcional: mostrar un error al usuario con un toast o similar
    } finally {
      setIsTranscribing(false);
    }
  };

  // Si no hay sesión, mostramos botón de login
  if (!session) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 z-50 gap-4">
        <button
          onClick={() => signIn('google')}
          className="bg-black text-white text-sm px-3 py-1 rounded hover:bg-gray-800 hover:shadow-md hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-500 w-56"
        >
          Login con Google
        </button>
        <button
          onClick={() => signIn('azure-ad')}
          className="bg-blue-700 text-white text-sm px-3 py-1 rounded hover:bg-blue-800 hover:shadow-md hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
        >
          Iniciar sesión con Microsoft
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
      nuevoChat[nuevoChat.length - 1] = { de: 'bot', texto: data.respuesta, url_mp3: data.url_mp3 || undefined, url_png: data.url_png || undefined };
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
          Selecciona el modelo de datos:
        </label>
        <select
          id="modelo-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full rounded border px-3 py-2 bg-white text-black dark:bg-zinc-800 dark:text-white"
          disabled={loading}
        >
          <option value="Analytic_Model_Comercial">Modelo Comercial</option>
          <option value="Model_Detalle_Pedido">Detalle Pedidos</option>
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
              className={`p-3 rounded whitespace-pre-wrap flex items-start gap-2 ${
                m.de === 'usuario'
                  ? 'ml-auto bg-gray-200 text-gray-800 max-w-[70%]'
                  : 'mr-auto bg-amber-100 text-black max-w-[90%]'
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
                {(!m.url_png || (m.texto.trim() !== m.url_png.trim())) && (
                   <span>{m.texto}</span>
                )}            
                {m.url_mp3 && (
                  <audio controls className="mt-2 max-w-full">
                    <source src={m.url_mp3} type="audio/mp3" />
                    Tu navegador no soporta audio.
                  </audio>
                )}
                {m.url_png && (
                  <div className="mt-2">
                    <img
                      src={m.url_png}
                      alt="Gráfico generado"
                      className="rounded border shadow max-w-xs sm:max-w-sm"
                      style={{ maxHeight: '320px', objectFit: 'contain' }}
                    />
                  </div>
               )}
            </div>
          </div>
         );   
        })}
      </div>
      {/* Área de entrada tipo ChatGPT mejorada */}
      <form onSubmit={enviar} className="mt-2 sticky bottom-0 bg-gray-100 py-3 z-10 px-2">
        <div className="relative w-full">
          <textarea
            className="w-full rounded-xl border pr-32 px-3 py-3 bg-white text-black placeholder-gray-500 dark:bg-zinc-800 dark:text-white dark:placeholder-gray-400 resize-none focus:outline-none shadow-md"
            placeholder="Escribe tu mensaje o usa el micrófono..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            disabled={loading || isTranscribing || recordingStatus === 'recording'}
            required
            rows={2}
            style={{ minHeight: 48, maxHeight: 120, paddingRight: 120 }}
          />
          {/* Botones sobrepuestos a la derecha inferior dentro de la caja */}
          <div className="absolute bottom-4 right-3 flex flex-row gap-2 pb-1">
            <AudioRecorder
              onTranscription={handleTranscription}
              onStatusChange={setRecordingStatus}
              isTranscribing={isTranscribing}
              isLoading={loading}
            />
            <button
              type="submit"
              disabled={loading || isTranscribing || recordingStatus === 'recording' || !msg}
              className="flex items-center justify-center bg-blue-600 text-white w-11 h-11 rounded-full disabled:opacity-50 disabled:cursor-not-allowed shadow hover:bg-blue-700 hover:shadow-lg transition-all cursor-pointer"
              aria-label="Enviar"
              title="Enviar mensaje"
            >
              {loading ? (
                <FaSpinner className="w-5 h-5 animate-spin" />
              ) : (
                <FaArrowUp className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </form>
      <div className="w-full flex justify-center mt-1">
        <span className="text-xs text-gray-500 text-center">Siempre comprueba la veracidad de la información.</span>
      </div>
    </div>
  );
}
