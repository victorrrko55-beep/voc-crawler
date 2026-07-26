# SmartThings VOC Pain Point Radar — Crawler

매일 07:30(KST)에 SmartThings 앱 관련 VOC를 수집·분석해 `reports/latest.md`에
"SmartThings Pain Point Radar" 리포트를 생성하는 파이프라인입니다.

## 구조

```
crawler/
  src/
    config.js          # 카테고리, 소스별 앱ID/쿼리, 분석 기간 상수
    categorize.js       # 10개 카테고리 규칙 기반 분류 + 감성/Pain 신호 판별
    dedupe.js            # 동일 유형 VOC 통합(정규화 후 중복 제거)
    sources/             # 소스별 수집기
      reddit.js
      discourseForum.js  # SmartThings Community / Home Assistant Community(기타 포럼)
      appStore.js         # Apple RSS 리뷰 피드
      playStore.js         # google-play-scraper 기반 Google Play 리뷰
      experimental.js       # Trustpilot / Samsung Community (best-effort, 기본 비활성)
    collect.js            # 전체 소스 수집 → 분류 → 통합 → data/voc-store.json 저장
    rootCause.js            # 카테고리별 Root Cause·개선 아이디어 템플릿
    insights.js               # PM Insight / Executive Summary 생성
    analyze.js                 # 빈도·최근3개월 vs 이전9개월 트렌드 계산, 리포트 생성
    report.js                   # Markdown 리포트 렌더러
    selftest.js                  # 네트워크 없이 픽스처 데이터로 파이프라인 검증 (`npm test`)
data/voc-store.json             # 누적 VOC 데이터셋(최근 13개월 보관, 매일 갱신)
reports/latest.md               # 최신 리포트
reports/archive/YYYY-MM-DD.md   # 일자별 리포트 아카이브
```

## 실행

```bash
cd crawler
npm install
npm test        # 네트워크 없이 로직 검증
npm run collect # 전체 소스 수집 → data/voc-store.json 갱신
npm run analyze # reports/latest.md, reports/archive/*.md 생성
```

## 자동화 (GitHub Actions)

`.github/workflows/daily-voc-radar.yml`이 매일 22:30 UTC(=07:30 KST)에
`collect` → `analyze`를 실행하고 결과를 리포지토리(`main` 브랜치, 기본 브랜치)에
커밋합니다. 2026-07-26 첫 수동 실행(`workflow_dispatch`)으로 정상 동작 확인됨.

GitHub Actions가 리포지토리에 커밋을 push하려면 저장소 설정에서
**Settings → Actions → General → Workflow permissions**을
"Read and write permissions"으로 설정해야 합니다.

## 이메일로 리포트 받기

`collect` → `analyze` 이후 `reports/latest.md`를 이메일로 보내는 단계가
워크플로우에 포함되어 있습니다([dawidd6/action-send-mail](https://github.com/dawidd6/action-send-mail)
사용). 아래 3개의 **리포지토리 시크릿**이 설정되기 전까지는 이 단계가 자동으로
건너뛰어지고(파이프라인은 정상 진행), 시크릿을 등록하면 다음 실행부터 메일이 발송됩니다.

1. Google 계정에 2단계 인증이 켜져 있어야 앱 비밀번호를 만들 수 있습니다.
   https://myaccount.google.com/apppasswords 에서 앱 비밀번호(16자리) 생성
2. 저장소 **Settings → Secrets and variables → Actions → New repository secret**에서
   아래 3개를 등록 (시크릿 값은 GitHub에만 저장되며 이 대화창에는 입력하지 마세요):
   - `MAIL_USERNAME` — 발신용 Gmail 주소
   - `MAIL_PASSWORD` — 위에서 만든 앱 비밀번호 (일반 로그인 비밀번호 아님)
   - `MAIL_TO` — 리포트를 받을 이메일 주소
3. 다음 실행(수동 `workflow_dispatch` 또는 다음 날 07:30)부터 자동 발송됩니다.

Gmail이 아닌 다른 SMTP(회사 메일 등)를 쓰려면 워크플로우의 `server_address`/`server_port`를
해당 SMTP 정보로 바꾸면 됩니다.

## 수집 소스 현황

| 소스 | 방식 | 안정성 |
|---|---|---|
| Reddit r/smartthings | 공개 JSON 리스팅 API | 안정적 (User-Agent 필수) |
| SmartThings Community | Discourse `search.json` API | 안정적 |
| Home Assistant Community ("기타 포럼") | Discourse `search.json` API | 안정적 |
| Apple App Store | 공식 RSS 리뷰 피드(JSON) | 안정적, 최근 ~500건 제한 |
| Google Play Store | `google-play-scraper` 패키지 | 비교적 안정적, 마크업 변경 시 깨질 수 있음 |
| Trustpilot | JSON-LD 스크래핑 | **실험적** — 기본 비활성 |
| Samsung Community | HTML 셀렉터 스크래핑 | **실험적** — 기본 비활성, JS 렌더링 페이지라 셀렉터 조정 필요 가능 |

Trustpilot·Samsung Community는 `ENABLE_EXPERIMENTAL_SOURCES=true` 환경변수로
활성화할 수 있습니다. 두 소스는 마크업 변경/봇 차단에 취약하므로 정기적으로
검증이 필요합니다. 실패해도 `collect.js`가 해당 소스만 건너뛰고 나머지
파이프라인은 정상 동작합니다.

## 분류 카테고리

Device Onboarding · Connectivity & Reliability · Automation & Routine · UX/UI ·
Multi-brand Integration · Notification & Alert · Performance · AI / Voice ·
Security & Privacy · Ecosystem Management

`Root Cause 추정`/`개선 아이디어`는 카테고리별 사전 정의 템플릿(`rootCause.js`)을
사용합니다(LLM API 키 불필요, GitHub Actions에서 완전 자동 실행). 실제 VOC 내용이
바뀌면 템플릿을 주기적으로 검토·갱신하세요.

## 알려진 한계

- Reddit/Discourse/Apple RSS/Play Store는 2026-07-26 GitHub Actions 실행에서
  실제 데이터 수집(전체 3,244건, 부정 VOC 241건)이 확인되었습니다.
- 카테고리 분류와 감성 판별은 키워드 규칙 기반입니다. 오분류가 발견되면
  `categorize.js`의 키워드 테이블을 보강하세요.
- "발생 빈도"는 부정(pain) 신호로 판별된 VOC만 집계합니다.
