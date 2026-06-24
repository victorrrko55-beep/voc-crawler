# VOC 분석기 개발 작업 로그

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
