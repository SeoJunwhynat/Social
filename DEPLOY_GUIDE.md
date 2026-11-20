# 한국사·통합사회 배포 오류 수정본 v2

## 무엇을 고쳤나
- 저장소 루트의 `index.html`이 항상 한국사/사회범 과목 선택 홈이 되도록 확인.
- `vercel.json`에서 `/`만 통합 홈으로 라우팅. 이미지·음악·개별 페이지에 대한 catch-all 재작성 없음.
- 한국사 이미지 주소 730곳을 `/history/assets/media/...` 절대 경로로 교체하여 URL 기준 위치가 달라져도 올바른 이미지 폴더를 보게 함.
- `/verify.html`에 파일 검사 추가: 루트 홈/한국사/사회범 HTML 확인, 416개 이미지·음악 파일의 누락 경로 검사.
- 한국사 이미지를 서버가 제공하지 못할 경우 포털에 누락 안내 표시.
- 기존 한국사 스토리/학습 내용과 사회범 문제은행/정심/음악 제어 로직은 유지.

## 필수 배포 (Social 저장소)
1. **저장소를 먼저 백업**해 둡니다.
2. `index.html`(약 10KB), `vercel.json`, `verify.html`을 저장소 **최상위**에 추가/교체합니다. `history/index.html`(약 1.9MB)과 혼동하면 홈에서 한국사가 바로 열립니다.
3. `history/index.html`, `history/assets/MEDIA_MANIFEST.json`, `history/assets/media/` 전체 416개, `social/index.html`, `social/assets/`, `social/data/`를 **동일한 상대 경로**로 올립니다.
4. 기존 루트의 `assets/audio/` 45개 MP3는 그대로 유지하세요. 없다면 별도 SOCIAL_AUDIO_45 ZIP을 함께 해제합니다.
5. Vercel **Settings → Build and Deployment → Root Directory**를 저장소 루트(설정 없음 또는 `./`)로 둡니다. Output Directory는 빈칸, Framework Preset은 Other로 설정합니다.
6. GitHub main에 모든 파일을 커밋하고 재배포합니다.
7. `/verify.html`에서 전부 검사하고, `/`, `/history/index.html`, `/social/index.html`을 직접 열어 봅니다.

## 업로드가 왜 실패했을까?
- 원본 ZIP의 루트 `index.html`은 통합 홈이었습니다. 화면이 한국사로 바로 켜졌다면 잘못된 index 파일을 루트에 업로드했거나 Vercel Root Directory가 `history`로 설정됐을 가능성이 있습니다.
- 원본에는 한국사 이미지 416개가 들어 있었지만 GitHub 웹 업로드에 일부만 올라갔거나 폴더 구조가 바뀌면 이미지가 사라집니다. 단순히 `history/index.html`만 올리면 안 됩니다.
- 연결된 GitHub/Vercel 프로젝트에 지금 접근할 수 없어 **실제 서버 설정이 어느 쪽인지는 확인하지 못했습니다.**

## 경로 확인
- `/` : 통합 홈
- `/history/index.html` : 한국사
- `/social/index.html` : 통합사회
- `/history/assets/media/0069abce75f5d0ec0afa.webp` : 샘플 한국사 이미지
- `/verify.html` : 전체 미디어 누락 검사

## 권장 업로드 방법
416개 파일이므로 GitHub Desktop을 이용해 압축 해제 폴더 전체를 커밋하는 게 편합니다. ZIP 자체를 GitHub에 올려도 배포 시 자동 압축 해제되지 않습니다.
