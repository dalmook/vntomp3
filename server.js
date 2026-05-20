const express = require('express');
const textToSpeech = require('@google-cloud/text-to-speech');

const app = express();
const port = process.env.PORT || 3000;

const client = new textToSpeech.TextToSpeechClient();

app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

const splitSentences = (input) =>
  input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;

    if (typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: '텍스트를 입력해주세요.' });
    }

    const lines = splitSentences(text);
    const requests = lines.map((line) => ({
      input: { text: line },
      voice: {
        languageCode: 'vi-VN',
        name: process.env.GOOGLE_TTS_VOICE || 'vi-VN-Chirp3-HD-Achernar'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: Number(process.env.GOOGLE_TTS_SPEAKING_RATE || 1.0),
        pitch: Number(process.env.GOOGLE_TTS_PITCH || 0)
      }
    }));

    const audioBuffers = [];

    for (const request of requests) {
      const [response] = await client.synthesizeSpeech(request);
      if (!response.audioContent) {
        throw new Error('오디오 생성에 실패했습니다.');
      }
      audioBuffers.push(Buffer.from(response.audioContent, 'base64'));
    }

    const merged = Buffer.concat(audioBuffers);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="vietnamese-tts.mp3"');
    return res.send(merged);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error:
        'TTS 생성 실패. Google Cloud 인증 키(GOOGLE_APPLICATION_CREDENTIALS)와 음성 이름을 확인해주세요.'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
