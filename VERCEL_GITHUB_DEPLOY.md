# 사회범 v17 — GitHub + Vercel 배포 안내

대상 저장소(확인됨): `SeoJunwhynat/Social`, 기본 브랜치 `main`. 기존 MUNBUB, Render는 변경하지 않는다.

## 배포 전에
1. 이 저장소에 `index.html`, `vercel.json`, `assets/audio/*.mp3` 전체를 업로드한다. 오디오가 누락되면 화면은 뜨지만 음악은 재생되지 않는다.
2. Vercel 계정에서 위 GitHub Social 저장소를 임포트한 프로젝트에 연결한다.
3. Framework Preset: `Other`, Root Directory: `.`, Build Command: 빈 값, Output Directory: 빈 값(정적 루트).
4. Vercel의 Production Branch를 `main`으로 설정하고 배포 결과를 확인한다.
5. PC·모바일에서 외부효과 문제의 수치 숨김, 기회비용 5대안 실험, 음원 재생과 터치 반응을 확인한다.

## 주의
- 현재 이 대화에 연결된 Vercel 도구에서는 프로젝트가 0개로 보여, 기존 Vercel 프로젝트로 자동 배포하거나 배포 성공을 검증하지 못했다.
- 온라인 계정과 멀티플레이는 별도 서버가 생긴 후 연결한다. Render는 사용하지 않는다.
- 공개 배포 전에 MP3 음원의 사용·배포 허가를 확인한다.
