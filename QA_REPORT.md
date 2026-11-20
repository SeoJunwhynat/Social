# 시대와 사회 v2 — 배포 오류 수정 검증

## 수정 사항
- 저장소 루트 통합 포털 `index.html` 유지 (과목선택 홈).
- 루트만 `/index.html`로 매핑한 Vercel `vercel.json`.
- 한국사 내 미디어 경로 730곳 `/history/assets/media/`로 변경.
- 누락 파일 전수 검사 페이지 `/verify.html` 추가.
- 한국사 진입 시 대표 미디어 파일 누락을 감지하여 경고하는 기능 추가.

## 검사 결과
- 한국사 미디어 참조 730곳에서 고유 파일 416개 추출, ZIP의 `history/assets/media` 416개와 완전 일치. 누락 0개.
- 로컬 HTTP 웹서버에서 `/` HTML 및 샘플 `/history/assets/media/*.webp` 요청 200 및 올바른 Content-Type 확인.
- 루트 포털 JavaScript와 verify JavaScript Node 구문 검사 통과.
- Chromium `set_content()` 기반 UI 전환 테스트: PC 1440px, 모바일 390px 모두 초기 홈/한국사/통합사회/홈 전환 정상, JS 오류 없음.
- Vercel 실제 배포 환경에는 현재 연결된 계정으로 접근 불가능하여 운영 서버에서 확인하지 못함.
- Chromium 파일·localhost 직접 탐색은 런타임 보안 정책(ERR_BLOCKED_BY_ADMINISTRATOR)으로 테스트 불가. 따라서 iframe 내부 전체 플레이, 모든 이미지의 실제 렌더링은 확인하지 못함.

## 남은 배포 필수 확인
- Vercel Root Directory가 `history`가 아니라 저장소 루트인지.
- Github에 **history/assets/media/** 416개와 **history/assets/MEDIA_MANIFEST.json**이 실제 커밋돼 있는지.
- 업로드 후 `/verify.html`에서 416개 모두 검사하고 실제 기기로 정상 표시를 확인할 것.
