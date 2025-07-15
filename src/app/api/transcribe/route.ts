// src/app/api/transcribe/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return NextResponse.json({ error: 'No se encontró el archivo de audio.' }, { status: 400 });
    }

    // Para reenviar el archivo, necesitamos crear un nuevo FormData.
    const backendFormData = new FormData();
    backendFormData.append('audio', audioFile);

    // La URL de tu backend de Flask. Asegúrate de que sea accesible.
    // Si ejecutas Docker o estás en un entorno de producción, esto podría cambiar.
    const flaskUrl = 'http://127.0.0.1:5000/transcribe';

    const flaskResponse = await fetch(flaskUrl, {
      method: 'POST',
      body: backendFormData,
      // No establezcas 'Content-Type': 'multipart/form-data' aquí.
      // fetch lo hace automáticamente con el boundary correcto cuando usas FormData.
    });

    const responseData = await flaskResponse.json();

    if (!flaskResponse.ok) {
      // Reenvía el error desde el backend de Flask
      return NextResponse.json({ error: responseData.error || 'El backend de Flask falló.' }, { status: flaskResponse.status });
    }

    // Reenvía la respuesta exitosa desde Flask al cliente
    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('Error en el proxy de transcripción:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
