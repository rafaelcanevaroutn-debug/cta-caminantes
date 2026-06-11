import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  const body = await request.json();
  const { salida, formato, tono, cantidad } = body;

  const formatoTexto: Record<string, string> = {
    comenta_info: 'CTA de "Comenta INFO" (el usuario comenta INFO en el post para recibir detalles)',
    link_bio: 'CTA de "Link en bio" (el usuario entra al link en la bio para inscribirse)',
    whatsapp: 'CTA de WhatsApp (el usuario escribe por WhatsApp)',
    pregunta: 'CTA de pregunta interactiva (se hace una pregunta para generar interacción en los comentarios)',
  };

  const tonoTexto: Record<string, string> = {
    aventura: "Aventura: energético, emocionante, sensación de épica y descubrimiento",
    urgencia: "Urgencia: plazas limitadas, últimos cupos, no te lo pierdas",
    inspiracion: "Inspiración: contemplativo, conexión con la naturaleza, bienestar y desconexión",
  };

  const prompt = `Sos un experto en marketing digital para empresas de turismo de montaña y trekking en Argentina.
Generás CTAs (llamadas a la acción) optimizados para Instagram y TikTok, que generan engagement real y conversiones.

## SALIDA / VIAJE:
- **Destino:** ${salida.nombre}
- **Fecha:** ${salida.fecha}
- **Precio:** USD ${salida.precio}
- **Seña:** USD ${salida.sena}
- **Link de inscripción:** ${salida.link || "link en bio"}

## DESCRIPCIÓN COMPLETA DE LA SALIDA:
${salida.descripcion}

## INSTRUCCIONES DE GENERACIÓN:
- **Formato de CTA:** ${formatoTexto[formato]}
- **Tono:** ${tonoTexto[tono]}
- **Cantidad de variantes:** ${cantidad}

## ESTRUCTURA DE CADA CTA:
Cada CTA debe tener exactamente esta estructura:

**[GANCHO]**
Una frase de apertura impactante (1-2 líneas) que detiene el scroll. Usá emojis relevantes. Que sea específica al destino y lo que ofrece.

**[CUERPO]**
2-4 líneas con info clave del viaje: fecha, precio, qué lo hace especial. Menciona detalles del itinerario o la experiencia si los hay.

**[CTA PRINCIPAL]**
La llamada a la acción con el mecanismo indicado (${formatoTexto[formato]}). Clara y directa.

**[HASHTAGS]**
8-12 hashtags relevantes mezclando: hashtags de Argentina (#argentina #patagonia #tucuman etc según el destino), hashtags de trekking/outdoor (#trekking #senderismo #montaña #hiking #outdoor #naturaleza), hashtags de comunidad (#caminantes #aventura #viajes), y 1-2 hashtags del destino específico. NO uses hashtags genéricos de motivación. SÍ usá hashtags que usen los trekkers argentinos.

## IMPORTANTE:
- Escribí en español argentino natural (vos, che, dale)
- Sé específico: mencioná detalles reales del viaje (fechas, precio, lugares, actividades)
- Cada variante debe ser notablemente diferente en tono y enfoque, no solo parafrasear
- Los CTAs deben funcionar como caption de Instagram/TikTok, listos para copiar y pegar
- Usá saltos de línea estratégicos para que sea legible en mobile

Generá exactamente ${cantidad} variante${cantidad > 1 ? "s" : ""}, separadas con "---" entre cada una. No incluyas numeración ni títulos externos, solo el contenido del CTA.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 2000,
      }
    });

    const text = response.text;
    if (!text) {
      return Response.json({ error: "Respuesta inválida de la IA" }, { status: 500 });
    }

    const variantes = text
      .split("---")
      .map((v: string) => v.trim())
      .filter((v: string) => v.length > 0);

    return Response.json({ variantes });
  } catch (error) {
    console.error("Error llamando a Gemini:", error);
    return Response.json({ error: "Error al generar los CTAs. Verificá tu API key." }, { status: 500 });
  }
}
