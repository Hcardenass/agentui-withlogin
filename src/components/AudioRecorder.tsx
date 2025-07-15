'use client';

import { useReactMediaRecorder } from 'react-media-recorder';
import { FaMicrophone, FaSpinner } from 'react-icons/fa';
import { useEffect } from 'react';

// Definimos los tipos para las props del componente
interface AudioRecorderProps {
  onTranscription: (blob: Blob) => void;
  onStatusChange: (status: string) => void;
  isTranscribing: boolean;
  isLoading: boolean;
}

// Este es un componente cliente que encapsula la lógica de grabación
export default function AudioRecorder({
  onTranscription,
  onStatusChange,
  isTranscribing,
  isLoading,
}: AudioRecorderProps) {
  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    onStop: (blobUrl: string, blob: Blob) => onTranscription(blob),
  });

  // Usamos useEffect para notificar al componente padre sobre los cambios de estado
  useEffect(() => {
    onStatusChange(status);
  }, [status, onStatusChange]);

  const handleRecordClick = () => {
    if (status === 'recording') {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      type="button"
      onClick={handleRecordClick}
      className={`flex items-center justify-center w-11 h-11 rounded-full border transition-colors ${
        status === 'recording'
          ? 'bg-red-500 text-white border-red-600 animate-pulse'
          : 'bg-white text-blue-600 border-gray-300 hover:bg-gray-50'
      }`}
      title={status === 'recording' ? 'Detener grabación' : 'Grabar audio'}
      aria-label="Grabar audio"
      disabled={isLoading || isTranscribing}
    >
      {isTranscribing ? (
        <FaSpinner className="w-5 h-5 animate-spin" />
      ) : (
        <FaMicrophone className="w-5 h-5" />
      )}
    </button>
  );
}
