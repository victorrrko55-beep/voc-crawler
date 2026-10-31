# Victor's VoC Crawler

- 생성 시각: 2026-10-31T01:43:13.699Z
- 분석 기간: 2025-10-31 ~ 2026-10-31 (최근 12개월)
- 최근 구간: 2026-07-31 ~ 2026-10-31 (최근 3개월) vs 이전 9개월
- 분석 대상 부정 VOC: 653건 (전체 수집 VOC 9368건 중)

## Top 10 Pain Points

### 1. Connectivity & Reliability

- 순위: 1
- 카테고리: Connectivity & Reliability
- 발생 빈도: 264건 (최근 3개월 149건 / 이전 9개월 115건)
- 증가율: +289%
- 대표 VOC: "Disconnects all the time. TV won't remain authenticated" — play, 2026-10-29 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +289% 증가하며, 'Connectivity & Reliability' 관련 부정 VOC가 총 264건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: 허브-클라우드 간 세션 유지 로직 취약, 다중 홉 메시 네트워크에서의 신호 간섭, 백그라운드 재연결 로직 미흡으로 오프라인 표시가 실제 상태와 어긋남.
- 개선 아이디어: 지수 백오프 기반 자동 재연결 로직 개선, 기기별 실시간 연결 품질 지표 제공, 오프라인 발생 시 원인(허브/기기/네트워크) 구분 진단 도구 제공.

### 2. Multi-brand Integration

- 순위: 2
- 카테고리: Multi-brand Integration
- 발생 빈도: 95건 (최근 3개월 51건 / 이전 9개월 44건)
- 증가율: +248%
- 대표 VOC: "Smartwings zigbee roller shade open/closed status reversed in SmartThings app ...same issue with my Shelly 2PM gen4 i Zigbee mode :frowning: State on ST is exactly the opposite of that in the Shelly app. On standard ST d…" — smartthings_community, 2026-10-30 ([원문](https://community.smartthings.com/t/smartwings-zigbee-roller-shade-open-closed-status-reversed-in-smartthings-app/265620/6))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +248% 증가하며, 'Multi-brand Integration' 관련 부정 VOC가 총 95건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: Matter 표준 지원이 기기/펌웨어별로 파편화되어 있고, 타 브랜드 기기와의 인증서/ 드라이버 호환성 검증이 SmartThings 릴리즈 주기와 어긋남.
- 개선 아이디어: Matter 인증 기기에 대한 호환성 매트릭스를 앱 내에서 공개하고, 주요 서드파티 브랜드와의 통합 테스트를 릴리즈 전 QA 파이프라인에 상시 포함.

### 3. Performance

- 순위: 3
- 카테고리: Performance
- 발생 빈도: 86건 (최근 3개월 55건 / 이전 9개월 31건)
- 증가율: +432%
- 대표 VOC: "Really disappointed and no improvements ever made! It crashes all the time and really doesn’t work on the iOS. It SUCKS!" — appstore, 2026-10-25 ([원문](https://apps.apple.com/us/app/id1222822904))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +432% 증가하며, 'Performance' 관련 부정 VOC가 총 86건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: 앱 초기 로딩 시 과도한 기기 상태 동기화, 메모리 누수로 인한 장시간 사용 시 느려짐, 백그라운드 폴링으로 인한 배터리 소모.
- 개선 아이디어: 초기 로딩을 지연 로딩(lazy load) 방식으로 전환, 캐시 계층 도입으로 반복 호출 감소, 배터리/성능 프로파일링을 정기 회귀 테스트에 포함.

### 4. Automation & Routine

- 순위: 4
- 카테고리: Automation & Routine
- 발생 빈도: 60건 (최근 3개월 29건 / 이전 9개월 31건)
- 증가율: +181%
- 대표 VOC: "What was the last automation that behaved differently than you expected? (Syntax was OK, logic/runtime failed) ...hing happened until I added a time_pattern trigger that checks the same condition every minute. The other …" — other_forum_home_assistant, 2026-10-29 ([원문](https://community.home-assistant.io/t/what-was-the-last-automation-that-behaved-differently-than-you-expected-syntax-was-ok-logic-runtime-failed/1030579/5))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +181% 증가하며, 'Automation & Routine' 관련 부정 VOC가 총 60건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: 루틴 실행 엔진의 조건 평가 지연, 클라우드 종속 자동화의 지연/타임아웃, 앱 업데이트 후 기존 루틴의 트리거-조건 매핑이 깨지는 회귀 버그.
- 개선 아이디어: 루틴 실행 로그/히스토리를 사용자에게 노출해 실패 시점을 즉시 확인 가능하게 하고, 로컬 실행(온디바이스) 비중을 늘려 클라우드 왕복 지연을 줄임.

### 5. Device Onboarding

- 순위: 5
- 카테고리: Device Onboarding
- 발생 빈도: 54건 (최근 3개월 31건 / 이전 9개월 23건)
- 증가율: +304%
- 대표 VOC: "[matter] add Dyson robot vacuum cleaner to smart things fail at last step but commissioning all complete ...ot vacuum cleaner https://www.dyson.com.sg/spot-scrub-ai-black Dyson Spot+Scrub™ Ai wet and dry robot vacuum cle…" — smartthings_community, 2026-10-29 ([원문](https://community.smartthings.com/t/matter-add-dyson-robot-vacuum-cleaner-to-smart-things-fail-at-last-step-but-commissioning-all-complete/311829/1))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +304% 증가하며, 'Device Onboarding' 관련 부정 VOC가 총 54건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: 기기 등록 과정에서 발생하는 프로토콜(Wi-Fi/Zigbee/Z-Wave/Matter) 핸드셰이크 실패, 펌웨어-앱 버전 불일치, 불명확한 오류 메시지로 사용자가 실패 원인을 파악하기 어려움.
- 개선 아이디어: 온보딩 단계별 진행률과 실패 시 구체적 원인(예: "라우터 2.4GHz 대역 확인 필요")을 보여주는 가이드형 UI 도입, 실패율이 높은 기기 유형에 대한 사전 호환성 체크 강화.

### 6. UX/UI

- 순위: 6
- 카테고리: UX/UI
- 발생 빈도: 43건 (최근 3개월 33건 / 이전 9개월 10건)
- 증가율: +890%
- 대표 VOC: "very difficult to use, the interface keeps pushing features i dont want. won't open the device i want to use" — play, 2026-10-28 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +890% 증가하며, 'UX/UI' 관련 부정 VOC가 총 43건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: 기능이 누적되며 정보 구조(IA)가 복잡해졌고, 기기 관리·자동화·모니터링 기능이 하나의 화면 계층에 혼재되어 사용자가 원하는 기능을 찾기 어려움.
- 개선 아이디어: 사용 빈도 기반 홈 화면 재구성, 핵심 태스크(기기 추가/루틴 생성/상태 확인) 중심의 단순화된 네비게이션 도입, 정기적 사용성 테스트 기반 반복 개선.

### 7. Security & Privacy

- 순위: 7
- 카테고리: Security & Privacy
- 발생 빈도: 29건 (최근 3개월 22건 / 이전 9개월 7건)
- 증가율: +843%
- 대표 VOC: "I made the mistake of buying a Samsung dryer and by default you can't delay a certain cycle from the physical interface and you need this horrible app, which requires ALL PERMISSIONS to run and offers absolutely nothing …" — play, 2026-10-27 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +843% 증가하며, 'Security & Privacy' 관련 부정 VOC가 총 29건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: 권한 요청 시점과 사유 설명이 불충분해 사용자가 과도한 권한 요구로 인식, 보안 관련 정책 변경 공지가 앱 내에서 충분히 전달되지 않음.
- 개선 아이디어: 권한별 사용 목적을 요청 시점에 명확히 안내(contextual permission), 보안/개인정보 설정을 별도 대시보드로 통합해 접근성 향상, 정기 보안 감사 결과 공개.

### 8. Energy Management

- 순위: 8
- 카테고리: Energy Management
- 발생 빈도: 9건 (최근 3개월 8건 / 이전 9개월 1건)
- 증가율: +2300%
- 대표 VOC: "Smartthings app no longer opens device cards This is a significant issue - 100+ devices and cannot control dimming, cannot see power usage, cannot see anything other than whether the device is on or off. All the function…" — smartthings_community, 2026-10-20 ([원문](https://community.smartthings.com/t/smartthings-app-no-longer-opens-device-cards/311686/5))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +2300% 증가하며, 'Energy Management' 관련 부정 VOC가 총 9건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: SmartThings Energy의 상세 에너지 데이터가 삼성 자체 기기 위주로만 제공되어 서드파티 기기(스마트 플러그 등)는 연동은 되어도 에너지 모니터링 항목이 누락되거나 Energy 화면에 기기 자체가 표시되지 않는 경우가 있음.
- 개선 아이디어: Matter/서드파티 에너지 리포팅 표준(예: Matter Electrical Energy Measurement 클러스터) 지원 기기 목록을 앱 내에 명시하고, 연동은 되지만 에너지 데이터가 없는 기기는 그 사유를 명확히 안내. AI Energy Mode 추천의 절감 효과를 실측 데이터로 검증해 신뢰도 제고.

### 9. AI / Voice

- 순위: 9
- 카테고리: AI / Voice
- 발생 빈도: 7건 (최근 3개월 5건 / 이전 9개월 2건)
- 증가율: +650%
- 대표 VOC: "Trash app. Bixby sucks. Can't login. Makes me regret buying the TV. Gets one star because sometimes it does work. Just not most of the time." — play, 2026-10-14 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +650% 증가하며, 'AI / Voice' 관련 부정 VOC가 총 7건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: AI/음성 기능이 특정 지역·기기에서만 제공되어 기대와 실제 지원 범위 간 괴리가 크고, Bixby 등 음성 인식 정확도가 낮아 명령 실패가 반복됨.
- 개선 아이디어: AI/음성 기능의 지원 범위를 앱 내에서 명확히 안내, 음성 명령 실패 시 대체 텍스트 명령 제공, 사용자 피드백 기반 인식률 개선 루프 구축.

### 10. Notification & Alert

- 순위: 10
- 카테고리: Notification & Alert
- 발생 빈도: 3건 (최근 3개월 2건 / 이전 9개월 1건)
- 증가율: +500%
- 대표 VOC: "Ads in Notofications All of a sudden it started sending me push notifications that are just ads for the new Samsung phone. These notifications are supposed to alert me to issues like water leaks. Ads are annoying and wil…" — appstore, 2026-08-05 ([원문](https://apps.apple.com/us/app/id1222822904))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +500% 증가하며, 'Notification & Alert' 관련 부정 VOC가 총 3건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: 푸시 알림 파이프라인(클라우드→FCM/APNs)의 지연, 사용자별 알림 설정과 기기 이벤트 트리거 간 매핑 오류로 알림 누락/중복 발생.
- 개선 아이디어: 중요 알림(보안·누수·화재 등)에 대한 우선순위 큐 분리, 알림 전달 성공률 모니터링 대시보드 구축, 사용자가 알림 지연을 직접 진단할 수 있는 테스트 알림 기능 제공.

## Spotlight

순위와 무관하게 항상 추적하는 관심 카테고리입니다.

### Energy Management

- 발생 빈도: 9건 (최근 3개월 8건 / 이전 9개월 1건)
- 증가율: +2300%
- 대표 VOC: "Smartthings app no longer opens device cards This is a significant issue - 100+ devices and cannot control dimming, cannot see power usage, cannot see anything other than whether the device is on or off. All the function…" — smartthings_community, 2026-10-20 ([원문](https://community.smartthings.com/t/smartthings-app-no-longer-opens-device-cards/311686/5))
- Root Cause 추정: SmartThings Energy의 상세 에너지 데이터가 삼성 자체 기기 위주로만 제공되어 서드파티 기기(스마트 플러그 등)는 연동은 되어도 에너지 모니터링 항목이 누락되거나 Energy 화면에 기기 자체가 표시되지 않는 경우가 있음.
- 개선 아이디어: Matter/서드파티 에너지 리포팅 표준(예: Matter Electrical Energy Measurement 클러스터) 지원 기기 목록을 앱 내에 명시하고, 연동은 되지만 에너지 데이터가 없는 기기는 그 사유를 명확히 안내. AI Energy Mode 추천의 절감 효과를 실측 데이터로 검증해 신뢰도 제고.
- 현재 Top 10 8위에도 랭크되어 있습니다.


## 신규 증가 이슈

최근 6개월간 증가한 VOC:

- **Connectivity & Reliability**: 최근 6개월 234건 vs 이전 6개월 30건 (+289%)
- **Performance**: 최근 6개월 78건 vs 이전 6개월 8건 (+432%)
- **Multi-brand Integration**: 최근 6개월 80건 vs 이전 6개월 15건 (+248%)
- **Automation & Routine**: 최근 6개월 50건 vs 이전 6개월 10건 (+181%)
- **UX/UI**: 최근 6개월 40건 vs 이전 6개월 3건 (+890%)
- **Device Onboarding**: 최근 6개월 44건 vs 이전 6개월 10건 (+304%)
- **Security & Privacy**: 최근 6개월 28건 vs 이전 6개월 1건 (+843%)
- **Energy Management**: 최근 6개월 9건 vs 이전 6개월 0건 (+2300%)

## 감소 이슈

최근 감소한 VOC:

- **Ecosystem Management**: 최근 6개월 1건 vs 이전 6개월 2건 (+50%)

## PM Insight

### 가장 시급한 개선 과제

**Connectivity & Reliability** — 최근 3개월 149건(+289%), 12개월 누적 264건으로 전체 부정 VOC의 40%를 차지, 2위(Multi-brand Integration, 최근 3개월 51건)보다 98건 더 많음.

Root Cause 추정: 허브-클라우드 간 세션 유지 로직 취약, 다중 홉 메시 네트워크에서의 신호 간섭, 백그라운드 재연결 로직 미흡으로 오프라인 표시가 실제 상태와 어긋남.

### 사용자 이탈 위험 요소

대체 솔루션으로의 전환·삭제 의사를 직접 언급한 VOC 5건 확인. 건수는 많지 않지만 자발적 이탈 의사 표현은 일반 불만보다 드물게 나타나는 강한 신호이므로 주시가 필요합니다. 주로 **Automation & Routine** 관련 맥락에서 언급됨.

- "absolutely horrendous, it is offline or unavailable more than it is. you have to keep uninstalling it and reinstalling your ring cameras, it keeps saying it's p…" — play, 2026-10-21 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- "Trying to set up the map view for the house is the worst thing I used in a long time. Drawing the rooms is more difficult than the beta version of SketchUp. Whe…" — play, 2026-10-21 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- "[ST Edge] Z-Wave Lock BP Beta — Schlage BE468 / BE469 I switched to this driver from the Z-Wave Lock PH driver from philh30 to try it out. This is just informat…" — smartthings_community, 2026-10-18 ([원문](https://community.smartthings.com/t/st-edge-z-wave-lock-bp-beta-schlage-be468-be469/311019/45))
- "Since the latest update I can no longer click on a device and see details or remove it from smartthings etc if the device is no longer around. I have uninstalle…" — play, 2026-10-16 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- "Always used to run a little clunky but lately the app just won't acknowledge the default browser I have set to sign in. It keeps opening the OS browser; which I…" — play, 2026-10-16 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))

### SmartThings 경쟁력 저하 요소

Home Assistant, Apple Home, Aqara 등 경쟁/대체 플랫폼과 비교하며 SmartThings의 열위를 지적한 VOC 5건 확인. 주로 **Automation & Routine** 카테고리에서 함께 언급됨.

- "Ultraloq Bolt Z-Wave codes only lock, won't unlock I had the same problem last summer when I migrated my Ultraloq Bolt Z-Wave lock from SmartThings to Home Assi…" — other_forum_home_assistant, 2026-10-21 ([원문](https://community.home-assistant.io/t/ultraloq-bolt-z-wave-codes-only-lock-wont-unlock/1029674/2))
- "Trying to set up the map view for the house is the worst thing I used in a long time. Drawing the rooms is more difficult than the beta version of SketchUp. Whe…" — play, 2026-10-21 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- "Home Assistant Core 2026.10.0 / 2026.10.2 — Severe bootstrap timeouts, 115 automations unavailable, integrations failing, possible automatic rollback to 2026.9.…" — other_forum_home_assistant, 2026-10-17 ([원문](https://community.home-assistant.io/t/home-assistant-core-2026-10-0-2026-10-2-severe-bootstrap-timeouts-115-automations-unavailable-integrations-failing-possible-automatic-rollback-to-2026-9-4/1029277/1))
- "Add Matter Bridge support to SmartThings +1 for this. I own several Samsung devices (a Smart Monitor, a refrigerator and a kimchi refrigerator) and use an Apple…" — smartthings_community, 2026-10-15 ([원문](https://community.smartthings.com/t/add-matter-bridge-support-to-smartthings/310005/8))
- "Aqara G350 and SmartThings: Matter Cameras Have Come a Long Way My forked, fixed and enhanced (see below) Matter Camera driver now exposes mechanical PTZ preset…" — smartthings_community, 2026-10-10 ([원문](https://community.smartthings.com/t/aqara-g350-and-smartthings-matter-cameras-have-come-a-long-way/310676/9))

### 차기 릴리즈 우선 검토 항목

증가율 기준 상위 카테고리를 차기 릴리즈 검토 우선순위로 제안합니다:

1. **Energy Management** (+2300%) — SmartThings Energy의 상세 에너지 데이터가 삼성 자체 기기 위주로만 제공되어 서드파티 기기(스마트 플러그 등)는 연동은 되어도 에너지 모니터링 항목이 누락되거나 Energy 화면에 기기 자체가 표시되지 않는 경우가 있음.
2. **UX/UI** (+890%) — 기능이 누적되며 정보 구조(IA)가 복잡해졌고, 기기 관리·자동화·모니터링 기능이 하나의 화면 계층에 혼재되어 사용자가 원하는 기능을 찾기 어려움.
3. **Security & Privacy** (+843%) — 권한 요청 시점과 사유 설명이 불충분해 사용자가 과도한 권한 요구로 인식, 보안 관련 정책 변경 공지가 앱 내에서 충분히 전달되지 않음.

## Executive Summary

- 최근 12개월간 SmartThings 앱 관련 부정 VOC 653건을 분석한 결과, 가장 시급한 Pain Point는 "Connectivity & Reliability"이며 최근 3개월 발생 빈도가 149건(+289%)으로 나타났다.
- "Multi-brand Integration" 역시 상위 Pain Point로, 사용자 경험 저하가 지속되고 있어 함께 우선 대응이 필요하다.
- 일부 사용자는 대체 솔루션으로의 이탈 의사를 직접 언급(5건)하여 이탈 위험 신호가 관측된다.
- Home Assistant, Apple Home, Aqara 등 경쟁/대체 플랫폼 대비 열위가 언급된 VOC가 5건 확인되어 경쟁력 저하 신호로 관리가 필요하다.
- 차기 릴리즈에서는 Energy Management, UX/UI, Security & Privacy 항목을 우선 검토 대상으로 제안한다.

## Sources

- Reddit r/smartthings — [https://www.reddit.com/r/smartthings/](https://www.reddit.com/r/smartthings/)
- SmartThings Community — [https://community.smartthings.com](https://community.smartthings.com)
- Home Assistant Community (기타 스마트홈 포럼) — [https://community.home-assistant.io](https://community.home-assistant.io)
- Apple App Store (SmartThings) — [https://apps.apple.com/us/app/id1222822904](https://apps.apple.com/us/app/id1222822904)
- Google Play Store (SmartThings) — [https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect)
- Trustpilot — [https://www.trustpilot.com/review/www.smartthings.com](https://www.trustpilot.com/review/www.smartthings.com) _(현재 비활성 소스)_
- Samsung Community — [https://community.samsung.com](https://community.samsung.com) _(현재 비활성 소스)_
