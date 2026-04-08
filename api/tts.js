export default async function handler(req, res) {
  // CORS Ayarları
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { text } = req.body;
  const API_KEY = process.env.ELEVENLABS_API_KEY;
  // Ses ID (Ahmet - Türkçe): pMsS7yD1nuQvSdfp6Mms
  const VOICE_ID = "pMsS7yD1nuQvSdfp6Mms";

  if (!API_KEY) {
    console.error("HATA: Vercel üzerinde ELEVENLABS_API_KEY tanımlanmamış!");
    return res.status(500).json({ error: "API Key eksik" });
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error("ElevenLabs Rejeksiyonu:", errorDetail);
      return res.status(response.status).send(errorDetail);
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    return res.send(Buffer.from(audioBuffer));

  } catch (error) {
    console.error("Vercel Runtime Hatası:", error);
    return res.status(500).send("Sunucu hatası");
  }
}
