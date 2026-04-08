const fetch = require('node-fetch');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { text } = req.body;
  const API_KEY = process.env.ELEVENLABS_API_KEY;
  // TÜRKÇE SES ID (Ahmet): pMsS7yD1nuQvSdfp6Mms
  const VOICE_ID = "pMsS7yD1nuQvSdfp6Mms"; 

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs Hatası:", errorText);
      return res.status(response.status).send(errorText);
    }

    const arrayBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(arrayBuffer));

  } catch (error) {
    console.error("Sistem Hatası:", error);
    res.status(500).send("Sunucu hatası oluştu.");
  }
}
