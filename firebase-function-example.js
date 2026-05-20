/**
 * Firebase Cloud Functions 예시 (Node.js)
 * 이 파일은 참고용입니다. 실제 배포는 Firebase 프로젝트 내부 functions/ 에서 진행하세요.
 */
const functions = require('firebase-functions');
const textToSpeech = require('@google-cloud/text-to-speech');

const client = new textToSpeech.TextToSpeechClient();

exports.tts = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const text = String(req.body?.text || '').trim();
    if (!text) return res.status(400).json({ error: 'text is required' });

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode: 'vi-VN', name: 'vi-VN-Chirp3-HD-Achernar' },
      audioConfig: { audioEncoding: 'MP3' }
    });

    res.set('Content-Type', 'audio/mpeg');
    return res.status(200).send(Buffer.from(response.audioContent, 'base64'));
  } catch (e) {
    return res.status(500).json({ error: 'TTS failed' });
  }
});
