# vntomp3

네, 가능합니다. **GitHub Pages(프론트) + Firebase Functions(백엔드 API)** 구조로 쓰면 됩니다.

## 구조

- GitHub Pages: 화면(UI), 텍스트 입력, 결과 재생/다운로드
- Firebase Functions: Google Cloud TTS API 호출 (서비스 계정 키는 서버 측에서만 사용)

즉, 키는 Firebase 쪽에만 두고, GitHub에서는 API만 호출합니다.

## 1) Firebase Functions 쪽 준비

1. Firebase 프로젝트 생성
2. Functions 활성화
3. Functions 런타임에서 Google Cloud TTS 사용
4. `tts` HTTPS 함수 배포

참고용 함수 코드는 `firebase-function-example.js` 파일에 포함했습니다.

## 2) GitHub Pages 쪽 설정

`public/config.example.js`를 `public/config.js`로 복사하고 API URL 입력:

```js
window.VNTOMP3_API_BASE_URL = 'https://us-central1-<your-project>.cloudfunctions.net';
```

그 다음 `public/index.html` + `public/app.js`를 GitHub Pages로 배포하면 됩니다.

## 3) 동작 방식

- 여러 줄 입력하면 줄 단위로 `POST {API_BASE_URL}/tts` 호출
- 각 응답 MP3를 브라우저에서 재생/다운로드 링크로 표시

## 주의사항

- 완전 무서버(GitHub Pages only)로는 공식 Google Cloud TTS 키 보호가 불가능합니다.
- 따라서 **Firebase Functions 같은 서버리스 백엔드가 필수**입니다.
