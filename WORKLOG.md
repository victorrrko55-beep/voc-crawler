# VOC 분석기 개발 작업 로그

## 2026-07-10 — SmartThings Pain Point Radar 자동화 파이프라인 추가

**브랜치:** claude/smartthings-pain-point-radar-p0hndj

### 배경
"매일 07:30 SmartThings VOC 자동 수집·분석" 요구사항 구현 시도. 이 세션(샌드박스)은
조직 네트워크 정책상 Reddit/Play Store/App Store/Samsung Community/Trustpilot 등
외부 사이트로의 outbound 접속이 차단되어 있고, `WebFetch` 도구도 이 세션에서는
거의 모든 외부 URL에 403을 반환해 사용 불가함을 확인. 세션 내부에서 도는 크롤러는
근본적으로 불가능하다고 판단하여, 실제 인터넷 접속이 가능한 **GitHub Actions**
러너에서 매일 크론으로 수집·분석하고 결과를 리포지토리에 커밋하는 방식으로 설계.

### 구현
- `crawler/` — Node.js 파이프라인 (수집 → 분류 → 통합 → 트렌드 분석 → 리포트 생성)
  - 소스: Reddit, SmartThings Community, Home Assistant Community(기타 포럼),
    Apple App Store RSS, Google Play(`google-play-scraper`) — 공개 API/패키지 기반
  - Trustpilot, Samsung Community는 마크업 변경/봇 차단에 취약해 실험적 소스로
    분리, 기본 비활성(`ENABLE_EXPERIMENTAL_SOURCES=true`로 옵트인)
  - 10개 카테고리 키워드 기반 자동 분류, 중복 VOC 통합, 최근 3개월 vs 이전
    9개월 발생 빈도·증가율 계산, Top 10 Pain Point / 신규 증가·감소 이슈 /
    PM Insight / Executive Summary 자동 생성
  - Root Cause·개선 아이디어는 카테고리별 사전 정의 템플릿 사용 (API 키 불필요)
- `.github/workflows/daily-voc-radar.yml` — 매일 22:30 UTC(07:30 KST) 크론
  - **주의:** GitHub는 기본 브랜치의 워크플로우 파일만 스케줄 실행하므로, 이
    브랜치가 기본 브랜치에 병합되기 전까지는 수동 실행(`workflow_dispatch`)만 가능
- `crawler/src/selftest.js` — 네트워크 없이 분류·중복통합·트렌드·리포트 렌더링
  로직을 픽스처 데이터로 검증 (`npm test`, 전체 통과 확인)

### 한계 / 후속 작업
- [ ] 이 세션에서는 실제 라이브 네트워크 호출 검증 불가 → 병합 후 GitHub Actions에서
      `workflow_dispatch`로 1회 수동 실행하여 소스별 수집 결과 점검 필요
- [ ] 저장소 Settings → Actions → Workflow permissions를 "Read and write"로 설정 필요
- [ ] Trustpilot/Samsung Community 셀렉터는 미검증 (실험적 소스)
- [ ] 카테고리 분류 키워드 규칙은 실제 VOC 누적 후 오분류 사례 기반으로 보강 필요

---

# VOC 분석기 개발 작업 로그 (초기)

**날짜:** 2026-06-24  
**저장소:** victorrrko55-beep/voc-crawler  
**브랜치:** claude/fervent-goodall-lgiey7

---

## 목표
Google Play Store와 Reddit에서 관심 키워드의 소비자 VOC를 수집·분석하고, 결과와 링크를 보여주는 앱 개발

---

## 작업 내역

### 1. 웹 앱 개발 (voc-analyzer.html)
- 단일 HTML 파일로 VOC 분석기 구현
- **검색 기능:** 키워드 입력 → Google Play Store + Reddit 동시 수집
- **감성 분석:** 한국어/영어 키워드 기반 긍정/중립/부정 자동 분류
- **감성 비율 바:** 시각적 비율 표시
- **키워드 클라우드:** 빈도수 기반 핵심 단어 추출
- **VOC 카드 목록:** 소스 뱃지, 감성 뱃지, 작성자, 날짜, 원문 링크
- **탭 필터:** 전체 / 긍정 / 중립 / 부정 / Play Store / Reddit
- **페이지네이션:** 12개씩 표시

### 2. 연도 필터 추가
- 검색 시작 연도 선택 기능 추가 (최저 2020년)
- 소스 버튼 아래 드롭다운으로 배치
- Reddit API `t` 파라미터 + 클라이언트 날짜 필터 이중 적용

### 3. 저장소 이동
- 최초 푸시: `victorrrko55-beep/load-balancer` (잘못된 저장소)
- GitHub에서 저장소 이름을 `voc-crawler`로 변경
- 이후 모든 작업은 `voc-crawler`에서 진행

### 4. GitHub Pages 배포 시도
- 저장소가 Private 상태 → Pages 사용 불가
- 저장소를 Public으로 변경 후 Pages 활성화
- 배포 URL: `https://victorrrko55-beep.github.io/voc-crawler/voc-analyzer.html`
- Pages 반영 시간: 약 5~10분 소요

### 5. Reddit API 차단 문제 발견
- 한국 가정용 인터넷에서 Reddit JSON API 403 Forbidden
- CORS 프록시(corsproxy.io, allorigins.win) 우회 시도 → 실패
- Reddit 2023년 이후 API 정책 강화로 인한 차단 확인

### 6. 크롬 익스텐션 개발
- CORS 제한 없이 데이터 수집을 위해 크롬 익스텐션으로 전환
- **파일 구성:**
  - `manifest.json` — Manifest V3, host_permissions 설정
  - `background.js` — Service Worker, CORS 없이 직접 fetch
  - `popup.html` — 팝업 UI
  - `popup.js` — 검색·분석 로직
  - `icon.png` — 익스텐션 아이콘

### 7. 익스텐션 오류 수정
| 오류 | 원인 | 해결 |
|------|------|------|
| `toggleSource is not defined` | background.js 콘솔에서 실행 | popup.html 콘솔로 전환 |
| `SyntaxError: missing )` | fetchPlayStore 내 복잡한 문자열 | 불필요한 코드 제거 |
| `Content Security Policy` 위반 | HTML 내 `onclick=""` 인라인 핸들러 | popup.js에서 addEventListener로 교체 |
| Play Store CORS 차단 | 구글 로그인 페이지로 리다이렉트 | background.js 통한 직접 호출로 우회 |

### 8. 최종 상태
- **Play Store:** background.js 통한 앱 검색 및 리뷰 수집 작동
- **Reddit:** 403 차단으로 수집 불가 (추후 Hacker News 등 대안 소스 교체 예정)
- **익스텐션 설치 완료:** 크롬 개발자 모드로 로컬 설치

---

## 미완료 / 향후 과제
- [ ] Reddit 대신 Hacker News API 연동
- [ ] App Store 리뷰 RSS 피드 수집 추가
- [ ] Play Store 리뷰 파싱 정확도 개선
- [ ] 크롬 웹 스토어 정식 배포

---

## 파일 구조
```
voc-crawler/
├── voc-analyzer.html       # 웹 앱 (GitHub Pages 배포)
├── WORKLOG.md              # 작업 로그
└── extension/              # 크롬 익스텐션
    ├── manifest.json
    ├── background.js
    ├── popup.html
    ├── popup.js
    └── icon.png
```

---

## 커밋 히스토리
| 커밋 | 내용 |
|------|------|
| fbc3d02 | Add VOC analyzer HTML app for Google Play Store & Reddit |
| a10452d | Add year filter (2020~) to VOC search |
| df57996 | Fix year filter layout to show below source buttons |
| f151496 | Apply inline styles to year filter for guaranteed visibility |
| fe87375 | Fix Reddit year filter: use correct t param and client-side date filter |
| 5deb0aa | Fix Reddit CORS: add proxy fallback chain for blocked environments |
| ba6447d | Add Chrome extension for VOC analysis (CORS-free) |
| cc4ab27 | Fix Play Store CORS: use direct app search URL with proper headers |
| 29fb862 | Fix syntax error in popup.js fetchPlayStore |
| 7675137 | Fix CSP: remove inline onclick handlers, use event listeners |
