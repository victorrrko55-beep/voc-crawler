// Per-category root-cause hypotheses and improvement ideas. These are
// domain-knowledge templates (no LLM call, no API key needed) so the daily
// GitHub Actions run stays fully self-contained. Revisit/refine periodically
// as the actual VOC content shifts.
export const ROOT_CAUSE_TEMPLATES = {
  'Device Onboarding': {
    rootCause:
      '기기 등록 과정에서 발생하는 프로토콜(Wi-Fi/Zigbee/Z-Wave/Matter) 핸드셰이크 실패, ' +
      '펌웨어-앱 버전 불일치, 불명확한 오류 메시지로 사용자가 실패 원인을 파악하기 어려움.',
    improvementIdea:
      '온보딩 단계별 진행률과 실패 시 구체적 원인(예: "라우터 2.4GHz 대역 확인 필요")을 보여주는 ' +
      '가이드형 UI 도입, 실패율이 높은 기기 유형에 대한 사전 호환성 체크 강화.',
  },
  'Connectivity & Reliability': {
    rootCause:
      '허브-클라우드 간 세션 유지 로직 취약, 다중 홉 메시 네트워크에서의 신호 간섭, ' +
      '백그라운드 재연결 로직 미흡으로 오프라인 표시가 실제 상태와 어긋남.',
    improvementIdea:
      '지수 백오프 기반 자동 재연결 로직 개선, 기기별 실시간 연결 품질 지표 제공, ' +
      '오프라인 발생 시 원인(허브/기기/네트워크) 구분 진단 도구 제공.',
  },
  'Automation & Routine': {
    rootCause:
      '루틴 실행 엔진의 조건 평가 지연, 클라우드 종속 자동화의 지연/타임아웃, ' +
      '앱 업데이트 후 기존 루틴의 트리거-조건 매핑이 깨지는 회귀 버그.',
    improvementIdea:
      '루틴 실행 로그/히스토리를 사용자에게 노출해 실패 시점을 즉시 확인 가능하게 하고, ' +
      '로컬 실행(온디바이스) 비중을 늘려 클라우드 왕복 지연을 줄임.',
  },
  'UX/UI': {
    rootCause:
      '기능이 누적되며 정보 구조(IA)가 복잡해졌고, 기기 관리·자동화·모니터링 기능이 ' +
      '하나의 화면 계층에 혼재되어 사용자가 원하는 기능을 찾기 어려움.',
    improvementIdea:
      '사용 빈도 기반 홈 화면 재구성, 핵심 태스크(기기 추가/루틴 생성/상태 확인) 중심의 ' +
      '단순화된 네비게이션 도입, 정기적 사용성 테스트 기반 반복 개선.',
  },
  'Multi-brand Integration': {
    rootCause:
      'Matter 표준 지원이 기기/펌웨어별로 파편화되어 있고, 타 브랜드 기기와의 인증서/ ' +
      '드라이버 호환성 검증이 SmartThings 릴리즈 주기와 어긋남.',
    improvementIdea:
      'Matter 인증 기기에 대한 호환성 매트릭스를 앱 내에서 공개하고, 주요 서드파티 ' +
      '브랜드와의 통합 테스트를 릴리즈 전 QA 파이프라인에 상시 포함.',
  },
  'Notification & Alert': {
    rootCause:
      '푸시 알림 파이프라인(클라우드→FCM/APNs)의 지연, 사용자별 알림 설정과 ' +
      '기기 이벤트 트리거 간 매핑 오류로 알림 누락/중복 발생.',
    improvementIdea:
      '중요 알림(보안·누수·화재 등)에 대한 우선순위 큐 분리, 알림 전달 성공률 모니터링 ' +
      '대시보드 구축, 사용자가 알림 지연을 직접 진단할 수 있는 테스트 알림 기능 제공.',
  },
  Performance: {
    rootCause:
      '앱 초기 로딩 시 과도한 기기 상태 동기화, 메모리 누수로 인한 장시간 사용 시 ' +
      '느려짐, 백그라운드 폴링으로 인한 배터리 소모.',
    improvementIdea:
      '초기 로딩을 지연 로딩(lazy load) 방식으로 전환, 캐시 계층 도입으로 반복 호출 감소, ' +
      '배터리/성능 프로파일링을 정기 회귀 테스트에 포함.',
  },
  'AI / Voice': {
    rootCause:
      'AI/음성 기능이 특정 지역·기기에서만 제공되어 기대와 실제 지원 범위 간 괴리가 크고, ' +
      'Bixby 등 음성 인식 정확도가 낮아 명령 실패가 반복됨.',
    improvementIdea:
      'AI/음성 기능의 지원 범위를 앱 내에서 명확히 안내, 음성 명령 실패 시 대체 텍스트 ' +
      '명령 제공, 사용자 피드백 기반 인식률 개선 루프 구축.',
  },
  'Security & Privacy': {
    rootCause:
      '권한 요청 시점과 사유 설명이 불충분해 사용자가 과도한 권한 요구로 인식, ' +
      '보안 관련 정책 변경 공지가 앱 내에서 충분히 전달되지 않음.',
    improvementIdea:
      '권한별 사용 목적을 요청 시점에 명확히 안내(contextual permission), 보안/개인정보 ' +
      '설정을 별도 대시보드로 통합해 접근성 향상, 정기 보안 감사 결과 공개.',
  },
  'Ecosystem Management': {
    rootCause:
      '다중 위치(Location)·다중 허브 환경에서 기기/자동화 관리 UI가 단일 가구 기준으로 ' +
      '설계되어 있어 확장 시 관리 복잡도가 급증.',
    improvementIdea:
      '위치·허브 간 일괄 관리(bulk actions) 기능 제공, 계층적 그룹/태그 기반 기기 관리 ' +
      'UI 도입, 공유 사용자 권한 관리 세분화.',
  },
  'Energy Management': {
    rootCause:
      'SmartThings Energy의 상세 에너지 데이터가 삼성 자체 기기 위주로만 제공되어 서드파티 ' +
      '기기(스마트 플러그 등)는 연동은 되어도 에너지 모니터링 항목이 누락되거나 Energy 화면에 ' +
      '기기 자체가 표시되지 않는 경우가 있음.',
    improvementIdea:
      'Matter/서드파티 에너지 리포팅 표준(예: Matter Electrical Energy Measurement 클러스터) ' +
      '지원 기기 목록을 앱 내에 명시하고, 연동은 되지만 에너지 데이터가 없는 기기는 그 사유를 ' +
      '명확히 안내. AI Energy Mode 추천의 절감 효과를 실측 데이터로 검증해 신뢰도 제고.',
  },
};

export function getRootCause(category) {
  return (
    ROOT_CAUSE_TEMPLATES[category] || {
      rootCause: '추가 조사 필요 (해당 카테고리의 대표 원인 패턴이 아직 정의되지 않음).',
      improvementIdea: '대표 VOC를 정성 리뷰하여 근본 원인 가설과 개선안을 수립할 것.',
    }
  );
}
