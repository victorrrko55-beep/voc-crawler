# Victor's VoC Crawler

- 생성 시각: 2026-10-15T00:42:20.305Z
- 분석 기간: 2025-10-15 ~ 2026-10-15 (최근 12개월)
- 최근 구간: 2026-07-15 ~ 2026-10-15 (최근 3개월) vs 이전 9개월
- 분석 대상 부정 VOC: 592건 (전체 수집 VOC 8428건 중)

## Top 10 Pain Points

### 1. Connectivity & Reliability

- 순위: 1
- 카테고리: Connectivity & Reliability
- 발생 빈도: 244건 (최근 3개월 149건 / 이전 9개월 95건)
- 증가율: +371%
- 대표 VOC: "Custom Component: Lock Code Manager - an integration to manage lock credentials across multiple integrations (Z-Wave, Matter, Zigbee2mqtt via mqtt, ZHA) ...HA several times. Entered all codes at lock keypad. No Issues. I…" — other_forum_home_assistant, 2026-10-14 ([원문](https://community.home-assistant.io/t/custom-component-lock-code-manager-an-integration-to-manage-lock-credentials-across-multiple-integrations-z-wave-matter-zigbee2mqtt-via-mqtt-zha/695681/97))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +371% 증가하며, 'Connectivity & Reliability' 관련 부정 VOC가 총 244건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: 허브-클라우드 간 세션 유지 로직 취약, 다중 홉 메시 네트워크에서의 신호 간섭, 백그라운드 재연결 로직 미흡으로 오프라인 표시가 실제 상태와 어긋남.
- 개선 아이디어: 지수 백오프 기반 자동 재연결 로직 개선, 기기별 실시간 연결 품질 지표 제공, 오프라인 발생 시 원인(허브/기기/네트워크) 구분 진단 도구 제공.

### 2. Multi-brand Integration

- 순위: 2
- 카테고리: Multi-brand Integration
- 발생 빈도: 83건 (최근 3개월 47건 / 이전 9개월 36건)
- 증가율: +292%
- 대표 VOC: "Got better and now I can see all my plugs. The issue is, if you are going to say I can track my energy. Then access the plugs energy for all plugs. Even matter you don't do that." — play, 2026-10-13 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +292% 증가하며, 'Multi-brand Integration' 관련 부정 VOC가 총 83건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: Matter 표준 지원이 기기/펌웨어별로 파편화되어 있고, 타 브랜드 기기와의 인증서/ 드라이버 호환성 검증이 SmartThings 릴리즈 주기와 어긋남.
- 개선 아이디어: Matter 인증 기기에 대한 호환성 매트릭스를 앱 내에서 공개하고, 주요 서드파티 브랜드와의 통합 테스트를 릴리즈 전 QA 파이프라인에 상시 포함.

### 3. Performance

- 순위: 3
- 카테고리: Performance
- 발생 빈도: 81건 (최근 3개월 60건 / 이전 9개월 21건)
- 증가율: +757%
- 대표 VOC: "app won't open all settings and just freezes constantly" — play, 2026-10-12 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +757% 증가하며, 'Performance' 관련 부정 VOC가 총 81건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: 앱 초기 로딩 시 과도한 기기 상태 동기화, 메모리 누수로 인한 장시간 사용 시 느려짐, 백그라운드 폴링으로 인한 배터리 소모.
- 개선 아이디어: 초기 로딩을 지연 로딩(lazy load) 방식으로 전환, 캐시 계층 도입으로 반복 호출 감소, 배터리/성능 프로파일링을 정기 회귀 테스트에 포함.

### 4. Automation & Routine

- 순위: 4
- 카테고리: Automation & Routine
- 발생 빈도: 52건 (최근 3개월 28건 / 이전 9개월 24건)
- 증가율: +250%
- 대표 VOC: "Home Care Service Stopped Working (26 April 2024) Went down again (28 April 2024) The service apps are a good example of what I dislike most about the app. It wants to live your life for you, deciding what it thinks you …" — smartthings_community, 2026-10-12 ([원문](https://community.smartthings.com/t/home-care-service-stopped-working-26-april-2024-went-down-again-28-april-2024/281266/11))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +250% 증가하며, 'Automation & Routine' 관련 부정 VOC가 총 52건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: 루틴 실행 엔진의 조건 평가 지연, 클라우드 종속 자동화의 지연/타임아웃, 앱 업데이트 후 기존 루틴의 트리거-조건 매핑이 깨지는 회귀 버그.
- 개선 아이디어: 루틴 실행 로그/히스토리를 사용자에게 노출해 실패 시점을 즉시 확인 가능하게 하고, 로컬 실행(온디바이스) 비중을 늘려 클라우드 왕복 지연을 줄임.

### 5. Device Onboarding

- 순위: 5
- 카테고리: Device Onboarding
- 발생 빈도: 50건 (최근 3개월 33건 / 이전 9개월 17건)
- 증가율: +482%
- 대표 VOC: "pressing login button, nothing happens. pressing add device button, also nothing happens. I have cleared the cache, uninstalled and reinstalled the app, same problem." — play, 2026-10-08 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +482% 증가하며, 'Device Onboarding' 관련 부정 VOC가 총 50건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: 기기 등록 과정에서 발생하는 프로토콜(Wi-Fi/Zigbee/Z-Wave/Matter) 핸드셰이크 실패, 펌웨어-앱 버전 불일치, 불명확한 오류 메시지로 사용자가 실패 원인을 파악하기 어려움.
- 개선 아이디어: 온보딩 단계별 진행률과 실패 시 구체적 원인(예: "라우터 2.4GHz 대역 확인 필요")을 보여주는 가이드형 UI 도입, 실패율이 높은 기기 유형에 대한 사전 호환성 체크 강화.

### 6. UX/UI

- 순위: 6
- 카테고리: UX/UI
- 발생 빈도: 36건 (최근 3개월 27건 / 이전 9개월 9건)
- 증가율: +800%
- 대표 VOC: "bad interface." — play, 2026-10-13 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +800% 증가하며, 'UX/UI' 관련 부정 VOC가 총 36건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: 기능이 누적되며 정보 구조(IA)가 복잡해졌고, 기기 관리·자동화·모니터링 기능이 하나의 화면 계층에 혼재되어 사용자가 원하는 기능을 찾기 어려움.
- 개선 아이디어: 사용 빈도 기반 홈 화면 재구성, 핵심 태스크(기기 추가/루틴 생성/상태 확인) 중심의 단순화된 네비게이션 도입, 정기적 사용성 테스트 기반 반복 개선.

### 7. Security & Privacy

- 순위: 7
- 카테고리: Security & Privacy
- 발생 빈도: 27건 (최근 3개월 21건 / 이전 9개월 6건)
- 증가율: +950%
- 대표 VOC: "Helpful, but does not update automatically. I find myself spending more time asking it to update than using it for what it's for... tracking. The "Search nearby" for the Smart Tag is HORRIBLE!! I can be right over the ta…" — play, 2026-10-13 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- Pain Point 요약: 최근 3개월 발생 빈도가 이전 대비 +950% 증가하며, 'Security & Privacy' 관련 부정 VOC가 총 27건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: 권한 요청 시점과 사유 설명이 불충분해 사용자가 과도한 권한 요구로 인식, 보안 관련 정책 변경 공지가 앱 내에서 충분히 전달되지 않음.
- 개선 아이디어: 권한별 사용 목적을 요청 시점에 명확히 안내(contextual permission), 보안/개인정보 설정을 별도 대시보드로 통합해 접근성 향상, 정기 보안 감사 결과 공개.

### 8. AI / Voice

- 순위: 8
- 카테고리: AI / Voice
- 발생 빈도: 7건 (최근 3개월 7건 / 이전 9개월 0건)
- 증가율: 신규
- 대표 VOC: "Trash app. Bixby sucks. Can't login. Makes me regret buying the TV. Gets one star because sometimes it does work. Just not most of the time." — play, 2026-10-14 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- Pain Point 요약: 최근 3개월 내 새롭게 부각된 이슈로, 'AI / Voice' 관련 부정 VOC가 총 7건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: AI/음성 기능이 특정 지역·기기에서만 제공되어 기대와 실제 지원 범위 간 괴리가 크고, Bixby 등 음성 인식 정확도가 낮아 명령 실패가 반복됨.
- 개선 아이디어: AI/음성 기능의 지원 범위를 앱 내에서 명확히 안내, 음성 명령 실패 시 대체 텍스트 명령 제공, 사용자 피드백 기반 인식률 개선 루프 구축.

### 9. Energy Management

- 순위: 9
- 카테고리: Energy Management
- 발생 빈도: 6건 (최근 3개월 6건 / 이전 9개월 0건)
- 증가율: 신규
- 대표 VOC: "Samsung TV energy in the Energy dashboard when SmartThings shows "unavailable" (workaround, validated) I just noticed this had stopped working on mine. The log showed the sensor failed to read a non-numeric value of "non…" — other_forum_home_assistant, 2026-10-09 ([원문](https://community.home-assistant.io/t/samsung-tv-energy-in-the-energy-dashboard-when-smartthings-shows-unavailable-workaround-validated/1027262/2))
- Pain Point 요약: 최근 3개월 내 새롭게 부각된 이슈로, 'Energy Management' 관련 부정 VOC가 총 6건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: SmartThings Energy의 상세 에너지 데이터가 삼성 자체 기기 위주로만 제공되어 서드파티 기기(스마트 플러그 등)는 연동은 되어도 에너지 모니터링 항목이 누락되거나 Energy 화면에 기기 자체가 표시되지 않는 경우가 있음.
- 개선 아이디어: Matter/서드파티 에너지 리포팅 표준(예: Matter Electrical Energy Measurement 클러스터) 지원 기기 목록을 앱 내에 명시하고, 연동은 되지만 에너지 데이터가 없는 기기는 그 사유를 명확히 안내. AI Energy Mode 추천의 절감 효과를 실측 데이터로 검증해 신뢰도 제고.

### 10. Notification & Alert

- 순위: 10
- 카테고리: Notification & Alert
- 발생 빈도: 3건 (최근 3개월 3건 / 이전 9개월 0건)
- 증가율: 신규
- 대표 VOC: "Ads in Notofications All of a sudden it started sending me push notifications that are just ads for the new Samsung phone. These notifications are supposed to alert me to issues like water leaks. Ads are annoying and wil…" — appstore, 2026-08-05 ([원문](https://apps.apple.com/us/app/id1222822904))
- Pain Point 요약: 최근 3개월 내 새롭게 부각된 이슈로, 'Notification & Alert' 관련 부정 VOC가 총 3건 누적되어 상위 Pain Point로 식별됨.
- Root Cause 추정: 푸시 알림 파이프라인(클라우드→FCM/APNs)의 지연, 사용자별 알림 설정과 기기 이벤트 트리거 간 매핑 오류로 알림 누락/중복 발생.
- 개선 아이디어: 중요 알림(보안·누수·화재 등)에 대한 우선순위 큐 분리, 알림 전달 성공률 모니터링 대시보드 구축, 사용자가 알림 지연을 직접 진단할 수 있는 테스트 알림 기능 제공.

## Spotlight

순위와 무관하게 항상 추적하는 관심 카테고리입니다.

### Energy Management

- 발생 빈도: 6건 (최근 3개월 6건 / 이전 9개월 0건)
- 증가율: 신규
- 대표 VOC: "Samsung TV energy in the Energy dashboard when SmartThings shows "unavailable" (workaround, validated) I just noticed this had stopped working on mine. The log showed the sensor failed to read a non-numeric value of "non…" — other_forum_home_assistant, 2026-10-09 ([원문](https://community.home-assistant.io/t/samsung-tv-energy-in-the-energy-dashboard-when-smartthings-shows-unavailable-workaround-validated/1027262/2))
- Root Cause 추정: SmartThings Energy의 상세 에너지 데이터가 삼성 자체 기기 위주로만 제공되어 서드파티 기기(스마트 플러그 등)는 연동은 되어도 에너지 모니터링 항목이 누락되거나 Energy 화면에 기기 자체가 표시되지 않는 경우가 있음.
- 개선 아이디어: Matter/서드파티 에너지 리포팅 표준(예: Matter Electrical Energy Measurement 클러스터) 지원 기기 목록을 앱 내에 명시하고, 연동은 되지만 에너지 데이터가 없는 기기는 그 사유를 명확히 안내. AI Energy Mode 추천의 절감 효과를 실측 데이터로 검증해 신뢰도 제고.
- 현재 Top 10 9위에도 랭크되어 있습니다.


## 신규 증가 이슈

최근 6개월간 증가한 VOC:

- **Connectivity & Reliability**: 최근 6개월 219건 vs 이전 6개월 25건 (+371%)
- **Performance**: 최근 6개월 74건 vs 이전 6개월 7건 (+757%)
- **Multi-brand Integration**: 최근 6개월 68건 vs 이전 6개월 15건 (+292%)
- **Device Onboarding**: 최근 6개월 42건 vs 이전 6개월 8건 (+482%)
- **Automation & Routine**: 최근 6개월 42건 vs 이전 6개월 10건 (+250%)
- **UX/UI**: 최근 6개월 33건 vs 이전 6개월 3건 (+800%)
- **Security & Privacy**: 최근 6개월 25건 vs 이전 6개월 2건 (+950%)
- **AI / Voice**: 최근 6개월 7건 vs 이전 6개월 0건 (신규)

## 감소 이슈

최근 감소한 VOC:

- **Ecosystem Management**: 최근 6개월 1건 vs 이전 6개월 2건 (+50%)

## PM Insight

### 가장 시급한 개선 과제

**Connectivity & Reliability** — 최근 3개월 149건(+371%), 12개월 누적 244건으로 전체 부정 VOC의 41%를 차지, 2위(Multi-brand Integration, 최근 3개월 47건)보다 102건 더 많음.

Root Cause 추정: 허브-클라우드 간 세션 유지 로직 취약, 다중 홉 메시 네트워크에서의 신호 간섭, 백그라운드 재연결 로직 미흡으로 오프라인 표시가 실제 상태와 어긋남.

### 사용자 이탈 위험 요소

대체 솔루션으로의 전환·삭제 의사를 직접 언급한 VOC 5건 확인. 건수는 많지 않지만 자발적 이탈 의사 표현은 일반 불만보다 드물게 나타나는 강한 신호이므로 주시가 필요합니다. 주로 **Performance** 관련 맥락에서 언급됨.

- "A completely non functional mess. And the developer assumes it's an issue on my end, even though I've already done everything they suggested in their response.…" — play, 2026-10-12 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- "the update in OCT 26 just turn the app from bad to even more bad. The latest update requires sign in to Samsung website before using it. This raise serious priv…" — play, 2026-10-11 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- "pressing login button, nothing happens. pressing add device button, also nothing happens. I have cleared the cache, uninstalled and reinstalled the app, same pr…" — play, 2026-10-08 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))
- "SmartThings iOS App Version 1.7.51.30 (September 2026) Since updating SmartThings to 1.7.51 , the iOS app has become completely unusable for me because it crash…" — smartthings_community, 2026-10-08 ([원문](https://community.smartthings.com/t/smartthings-ios-app-version-1-7-51-30-september-2026/311188/30))
- "** Update Sep '26** Don't buy Samsung sound bars. App is a disaster. Now it can't control my sound bar - it inexplicably tries to download a controller, which f…" — play, 2026-10-05 ([원문](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))

### SmartThings 경쟁력 저하 요소

Aqara, Google Home 등 경쟁/대체 플랫폼과 비교하며 SmartThings의 열위를 지적한 VOC 5건 확인. 주로 **Multi-brand Integration** 카테고리에서 함께 언급됨.

- "Aqara G350 and SmartThings: Matter Cameras Have Come a Long Way My forked, fixed and enhanced (see below) Matter Camera driver now exposes mechanical PTZ preset…" — smartthings_community, 2026-10-10 ([원문](https://community.smartthings.com/t/aqara-g350-and-smartthings-matter-cameras-have-come-a-long-way/310676/9))
- "WiFi It’s a nice refrigerator, but the tech stuff is not working right. It keeps dropping off the home smart network and I kept thinking that it was Google Home…" — appstore, 2026-10-10 ([원문](https://apps.apple.com/us/app/id1222822904))
- "Google Home & Smarrthings integration broken? ...my side was disabling the Public preview. I did that on Sunday night and Monday morning all was good. So I gues…" — smartthings_community, 2026-10-08 ([원문](https://community.smartthings.com/t/google-home-smarrthings-integration-broken/311262/7))
- "SmartThings Android App Version 1.8.51.30 (September 2026) ...seless. I had created a Camera Group to display all 8 cams in one view. Never worked. Now it does…" — smartthings_community, 2026-10-08 ([원문](https://community.smartthings.com/t/smartthings-android-app-version-1-8-51-30-september-2026/311187/75))
- "[ST Edge] Aqara FP300 (Zigbee) TOMillr: I'm still trying to disable the light and temperature sensors to possibly extend the battery life a bit. Unfortunately,…" — smartthings_community, 2026-10-07 ([원문](https://community.smartthings.com/t/st-edge-aqara-fp300-zigbee/306507/87))

### 차기 릴리즈 우선 검토 항목

증가율 기준 상위 카테고리를 차기 릴리즈 검토 우선순위로 제안합니다:

1. **AI / Voice** (신규) — AI/음성 기능이 특정 지역·기기에서만 제공되어 기대와 실제 지원 범위 간 괴리가 크고, Bixby 등 음성 인식 정확도가 낮아 명령 실패가 반복됨.
2. **Energy Management** (신규) — SmartThings Energy의 상세 에너지 데이터가 삼성 자체 기기 위주로만 제공되어 서드파티 기기(스마트 플러그 등)는 연동은 되어도 에너지 모니터링 항목이 누락되거나 Energy 화면에 기기 자체가 표시되지 않는 경우가 있음.
3. **Notification & Alert** (신규) — 푸시 알림 파이프라인(클라우드→FCM/APNs)의 지연, 사용자별 알림 설정과 기기 이벤트 트리거 간 매핑 오류로 알림 누락/중복 발생.

## Executive Summary

- 최근 12개월간 SmartThings 앱 관련 부정 VOC 592건을 분석한 결과, 가장 시급한 Pain Point는 "Connectivity & Reliability"이며 최근 3개월 발생 빈도가 149건(+371%)으로 나타났다.
- "Multi-brand Integration" 역시 상위 Pain Point로, 사용자 경험 저하가 지속되고 있어 함께 우선 대응이 필요하다.
- 일부 사용자는 대체 솔루션으로의 이탈 의사를 직접 언급(5건)하여 이탈 위험 신호가 관측된다.
- Aqara, Google Home 등 경쟁/대체 플랫폼 대비 열위가 언급된 VOC가 5건 확인되어 경쟁력 저하 신호로 관리가 필요하다.
- 차기 릴리즈에서는 AI / Voice, Energy Management, Notification & Alert 항목을 우선 검토 대상으로 제안한다.

## Sources

- Reddit r/smartthings — [https://www.reddit.com/r/smartthings/](https://www.reddit.com/r/smartthings/)
- SmartThings Community — [https://community.smartthings.com](https://community.smartthings.com)
- Home Assistant Community (기타 스마트홈 포럼) — [https://community.home-assistant.io](https://community.home-assistant.io)
- Apple App Store (SmartThings) — [https://apps.apple.com/us/app/id1222822904](https://apps.apple.com/us/app/id1222822904)
- Google Play Store (SmartThings) — [https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect)
- Trustpilot — [https://www.trustpilot.com/review/www.smartthings.com](https://www.trustpilot.com/review/www.smartthings.com) _(현재 비활성 소스)_
- Samsung Community — [https://community.samsung.com](https://community.samsung.com) _(현재 비활성 소스)_
