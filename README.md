# vntomp3

베트남어 문장을 입력하면 Google Cloud Text-to-Speech API로 MP3를 생성하는 웹앱입니다.

## 기능

- 베트남어 문장 1개 또는 여러 문장(줄바꿈 기준) 한 번에 변환
- 고품질 음성 기본값: `vi-VN-Chirp3-HD-Achernar`
- 브라우저 내 재생 + MP3 다운로드

## 준비사항

1. Google Cloud 프로젝트 생성
2. Text-to-Speech API 활성화
3. 서비스 계정 키(JSON) 발급
4. 환경변수 설정

```bash
cp .env.example .env
# .env 파일의 GOOGLE_APPLICATION_CREDENTIALS를 실제 키 파일 경로로 변경
```

## 실행

```bash
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
