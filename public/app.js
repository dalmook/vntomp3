const convertBtn = document.getElementById('convertBtn');
const textArea = document.getElementById('text');
const statusEl = document.getElementById('status');
const player = document.getElementById('player');
const downloadLink = document.getElementById('downloadLink');

convertBtn.addEventListener('click', async () => {
  const text = textArea.value.trim();

  if (!text) {
    statusEl.textContent = '텍스트를 입력해주세요.';
    return;
  }

  statusEl.textContent = 'MP3 생성 중...';
  convertBtn.disabled = true;

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '변환 실패');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    player.src = url;
    player.style.display = 'block';

    downloadLink.href = url;
    downloadLink.download = 'vietnamese-tts.mp3';
    downloadLink.style.display = 'inline-block';
    downloadLink.textContent = '다운로드';

    statusEl.textContent = '완료! 재생 또는 다운로드 하세요.';
  } catch (error) {
    statusEl.textContent = error.message;
  } finally {
    convertBtn.disabled = false;
  }
});
