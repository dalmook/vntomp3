const express = require('express');
const textToSpeech = require('@google-cloud/text-to-speech');

const app = express();
const port = Number(process.env.PORT || 3000);

const client = new textToSpeech.TextToSpeechClient();

app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  const allowedOrigin = process.env.CORS_ALLOW_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).send('');
  return next();
});

app.get('/healthz', (_req, res) => res.json({ ok: true }));

app.post('/tts', async (req, res) => {
  try {
    const text = String(req.body?.text || '').trim();
    if (!text) return res.status(400).json({ error: 'text is required' });

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: process.env.GOOGLE_TTS_LANGUAGE || 'vi-VN',
        name: process.env.GOOGLE_TTS_VOICE || 'vi-VN-Chirp3-HD-Achernar'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: Number(process.env.GOOGLE_TTS_SPEAKING_RATE || 1.0),
        pitch: Number(process.env.GOOGLE_TTS_PITCH || 0)
      }
    });

    if (!response.audioContent) {
      return res.status(500).json({ error: 'empty audio content' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    return res.send(Buffer.from(response.audioContent, 'base64'));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'TTS failed' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`vntomp3 api listening on :${port}`);
});
