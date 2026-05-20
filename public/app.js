const convertBtn = document.getElementById('convertBtn');
const textArea = document.getElementById('text');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');

const API_BASE_URL = window.VNTOMP3_API_BASE_URL || ''; // 예: https://us-central1-<project>.cloudfunctions.net

const splitSentences = (input) =>
  input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const makeItem = (line, index, blobUrl) => {
  const wrapper = document.createElement('article');
  wrapper.className = 'item';

  const title = document.createElement('h3');
  title.textContent = `문장 ${index + 1}`;

  const text = document.createElement('p');
  text.textContent = line;

  const audio = document.createElement('audio');
  audio.controls = true;
  audio.src = blobUrl;

  const download = document.createElement('a');
  download.href = blobUrl;
  download.download = `vi-tts-${index + 1}.mp3`;
  download.textContent = '이 문장 MP3 다운로드';

  wrapper.append(title, text, audio, download);
  return wrapper;
};

const fetchTTS = async (line) => {
  if (!API_BASE_URL) {
    throw new Error('API 주소가 설정되지 않았습니다. README의 Firebase Functions 설정을 확인하세요.');
  }

  const response = await fetch(`${API_BASE_URL}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: line })
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `TTS 실패 (${response.status})`);
  }

  return response.blob();
};

convertBtn.addEventListener('click', async () => {
  const text = textArea.value.trim();

  if (!text) {
    statusEl.textContent = '텍스트를 입력해주세요.';
    return;
  }

  const lines = splitSentences(text);
  resultsEl.innerHTML = '';
  convertBtn.disabled = true;
  statusEl.textContent = '오디오 생성 중...';

  try {
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const blob = await fetchTTS(line);
      const url = URL.createObjectURL(blob);
      resultsEl.appendChild(makeItem(line, i, url));
    }

    statusEl.textContent = `${lines.length}개 문장 MP3를 생성했습니다.`;
  } catch (error) {
    statusEl.textContent = error.message;
  } finally {
    convertBtn.disabled = false;
  }
});
