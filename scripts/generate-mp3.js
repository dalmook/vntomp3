const fs = require('fs');
const path = require('path');
const textToSpeech = require('@google-cloud/text-to-speech');

async function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3] || 'public/audio/output.mp3';

  if (!inputPath) {
    throw new Error('Usage: node scripts/generate-mp3.js <input.txt> [output.mp3]');
  }

  const text = fs.readFileSync(inputPath, 'utf8').trim();
  if (!text) throw new Error('Input text is empty');

  const client = new textToSpeech.TextToSpeechClient();
  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: { languageCode: 'vi-VN', name: 'vi-VN-Chirp3-HD-Achernar' },
    audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0, pitch: 0 }
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, response.audioContent, 'base64');
  console.log(`Saved: ${outputPath}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
