# vntomp3

시놀로지 **Container Manager**에서 `yml`로 한 번에 실행하는 방식입니다.  
구성은 `GitHub Pages(프론트) + Synology Docker API(백엔드)` 입니다.

## 1) 준비 파일

- `docker-compose.synology.yml`
- `Dockerfile`
- `server.js`
- `public/config.js` (직접 생성)
- `secrets/gcp-sa.json` (Google 서비스 계정 키 JSON)

> 주의: `gcp-sa.json`은 절대 GitHub에 커밋하지 마세요.

## 2) 시놀로지에서 한방 실행 (Container Manager)

1. 프로젝트 폴더 업로드 (예: `/volume1/docker/vntomp3`)
2. 같은 폴더에 키 파일 배치: `/volume1/docker/vntomp3/secrets/gcp-sa.json`
3. Container Manager → **프로젝트** → **생성**
4. 소스: `docker-compose.synology.yml` 선택
5. 배포

`docker-compose.synology.yml`은 아래 항목을 포함합니다.

- 포트 `3000:3000`
- 키 파일 마운트: `./secrets/gcp-sa.json:/run/secrets/gcp-sa.json:ro`
- 환경변수 `GOOGLE_APPLICATION_CREDENTIALS=/run/secrets/gcp-sa.json`
- CORS 허용 도메인 `CORS_ALLOW_ORIGIN=https://<your-github-username>.github.io`

## 3) GitHub Pages 연결

`public/config.js` 생성:

```js
window.VNTOMP3_API_BASE_URL = 'https://<your-nas-domain-or-ddns>:3000';
```

그다음 `public/`를 GitHub Pages로 배포하면, 프론트가 NAS API `/tts`를 호출합니다.

## 4) API 테스트

헬스체크:

```bash
curl http://<nas-ip>:3000/healthz
```

TTS 테스트:

```bash
curl -X POST "http://<nas-ip>:3000/tts" \
  -H "Content-Type: application/json" \
  -d '{"text":"Xin chào"}' \
  --output sample.mp3
```

## 5) 보안 권장

- 키는 `secrets/`에만 두고 GitHub 업로드 금지
- `CORS_ALLOW_ORIGIN`을 본인 GitHub Pages 도메인으로 제한
- 가능하면 시놀로지 리버스 프록시 + HTTPS 인증서 적용
