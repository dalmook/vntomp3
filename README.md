# vntomp3

베트남어 문장을 입력하면 Google Cloud Text-to-Speech API로 MP3를 생성하는 웹앱입니다.

## 먼저 중요한 점 (GitHub에 키 노출된 경우)

서비스 계정 JSON 키가 GitHub에 한 번이라도 올라갔다면, **해당 키는 폐기(삭제) 후 새로 발급**해야 합니다.

1. Google Cloud Console → IAM & Admin → Service Accounts
2. 노출된 키 **Delete**
3. 새 키 생성(JSON)
4. 저장 위치를 서버 내부 경로로 변경 (예: `/home/app/keys/tts-key.json`)

> 절대 키 파일(JSON)이나 `.env`를 GitHub에 올리면 안 됩니다.

## 절대경로 설정 방법

`.env` 파일에 아래처럼 **서버의 실제 파일 절대경로**를 넣습니다.

```bash
GOOGLE_APPLICATION_CREDENTIALS=/home/app/keys/tts-key.json
GOOGLE_TTS_VOICE=vi-VN-Chirp3-HD-Achernar
GOOGLE_TTS_SPEAKING_RATE=1.0
GOOGLE_TTS_PITCH=0
```

Linux/macOS에서 절대경로 확인:

```bash
realpath /home/app/keys/tts-key.json
```

Windows PowerShell 예시:

```powershell
Resolve-Path C:\keys\tts-key.json
```

## GitHub Pages만으로는 불가능한 이유

질문하신 것처럼 **서버 없이 GitHub Pages에서만** 처리하고 싶어도,
Google Cloud TTS 호출에 필요한 인증 키를 브라우저에 둘 수 없어서 보안상 불가능합니다.

- GitHub Pages = 정적 호스팅(HTML/CSS/JS만)
- 서비스 계정 키를 브라우저에 넣는 순간 키가 유출됨
- 따라서 TTS 호출은 반드시 **서버(백엔드)** 또는 **서버리스 함수**에서 해야 함

## 권장 배포 구조 (서버 최소화)

### 옵션 A) GitHub Pages + Cloud Run API (추천)

- 프론트: GitHub Pages (`public/`)
- 백엔드: Cloud Run (현재 `server.js`)
- 키는 Cloud Run의 Secret/서비스계정으로 관리
- 프론트는 Cloud Run URL로 `/api/tts` 호출

### 옵션 B) GitHub Pages + Firebase Functions / Cloud Functions

- 프론트: GitHub Pages
- 백엔드: 서버리스 함수에서 TTS 호출

## 로컬 실행

1. 키 파일을 로컬 안전한 경로에 저장
2. `.env` 생성 및 `GOOGLE_APPLICATION_CREDENTIALS` 설정

```bash
cp .env.example .env
npm install
npm start
```

브라우저에서 `http://localhost:3000` 접속.

## API

### `POST /api/tts`

요청:

```json
{ "text": "Xin chào\nTôi tên là Nam" }
```

응답:

- `audio/mpeg` (MP3 바이너리)

## 참고

- 긴 문장을 대량으로 처리할 때는 요청 길이 및 요금 정책을 Google Cloud 콘솔에서 확인하세요.
- 기본 음성은 시점에 따라 제공 여부가 달라질 수 있어 `GOOGLE_TTS_VOICE`로 다른 `vi-VN-*` 음성을 지정할 수 있습니다.
