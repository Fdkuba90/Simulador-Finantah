// pages/api/simulador.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Falta el prompt.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Eres un simulador financiero especializado en créditos. Calcula la utilidad de acuerdo con el modelo interno de FINANTAH. Asegúrate de aplicar las validaciones y política internas correctamente.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Error desconocido' });
    }

    return res.status(200).json({ result: data.choices[0].message.content });
  } catch (err) {
    return res.status(500).json({ error: 'Error al conectarse con OpenAI.' });
  }
}
