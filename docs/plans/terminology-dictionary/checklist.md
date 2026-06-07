# checklist — terminology-dictionary

> 작업 진행하면서 AI 가 순차적으로 체크. `[x]` 로 표시한 항목은 완료된 것으로 간주.
> 새 항목이 발견되면 적절한 단계에 추가하고 체크리스트를 유지한다.

## 0. 준비

- [x] spec.md / context.md 작성
- [x] 작업 브랜치: `main` 직접 (소규모 문서 작업)

## 1. 구현 (1차: 능력치 7종)

- [x] `docs/concept/dictionary.md` 신규 생성
- [x] 능력치 표 7행 작성: 체력 / 내공 / 무예 / 학식 / 명성 / 도덕 / 은자
- [x] 각 행에 영문 키 추가 (`hp`, `qi`, `martial`, `knowledge`, `renown`, `morality`, `money`)
- [x] 각 행에 **사용 금지 표기** 컬럼 추가 (예: 무예 행에 `무공`, `무력`)
- [x] 각 행에 **한 줄 설명** 추가 (역할·판정 사용처)
- [x] 향후 확장 영역 헤더만 추가: `## 상태값`, `## 지역`, `## 이벤트 타입`, `## 아이템 카테고리`
- [x] 문서 상단에 "이 파일이 표기 SSOT" 임을 한 문단으로 명시

## 2. 검증

- [x] 영문 키 7개가 `docs/concept/system.md` 의 능력치 스키마와 정확히 일치하는지 확인
- [x] `docs/concept/direction.md` 의 2-1 표와 사전 표가 충돌하는지 확인 — **충돌 7건 발견** (아래 "발견된 추가 작업" 참고)
- [x] `docs/concept/events.md` 본문에 사용 금지 표기가 있는지 grep — 위반 없음
- [ ] `eventEditor/index.html` 안내·placeholder 에 사용 금지 표기가 있는지 grep — 미실시 (1차 범위 밖, 후속 작업으로)
- [x] `concept/claude.md` 인덱스에 `dictionary.md` 한 줄 추가

## 3. 마무리

- [x] 커밋 (`3b77917` — docs: dictionary.md SSOT 도입 및 능력치 표기 통일)
- [x] 본 checklist 의 미체크 항목이 남았으면 사유 메모 — eventEditor 표기 점검은 1차 범위 제외 항목이라 의도적으로 미실시
- [ ] 2차 작업(상태값 정리)·3차 작업(지역·이벤트 타입) 별도 plan 으로 큐잉할지 결정 — **사용자 결정 필요**

## 발견된 추가 작업 — 후속 처리 결과

### direction.md 표기 위반 7건 + dictionary.md 자기모순 + system.md 메모

사용자 지시 "이어서 작업해" 에 따라 본 작업에 흡수 처리 (별도 plan 폴더 생성 없이 진행).
처리 결과:

- [x] `direction.md` L20-21 한 줄 정의 본문 — `무공`→`무예`, `은전`→`은자`
- [x] `direction.md` L34 능력치 목록 — `무공`→`무예`, `은전`→`은자` + 사전 SSOT 참조 문단 추가
- [x] `direction.md` L39 내공 행 설명 — `내력`·`무공` 포함 문장 전체 재서술
- [x] `direction.md` L209 천하제일인 엔딩 — `무공`→`무예`
- [x] `direction.md` L211 은거기인 엔딩 — `지혜`→`학식`
- [x] `direction.md` L213 문파 재건 엔딩 — `무공`→`무예`, `은전`→`은자`
- [x] `dictionary.md` 내공 행 설명 자기모순 (`내력`·`무공`) — 문장 재서술
- [x] `dictionary.md` 명성 행 설명 자기모순 (`평판`) — 문장 재서술
- [x] `system.md` L9-10 임시 메모(direction 표기 분기 안내) — 사전 도입으로 해소되어 제거하고 SSOT 분담 명시로 교체
- [x] `system.md` L22 내공 행 비고 — `무공` → `무예 판정에 내공 실어 위력 ↑`
- [x] 최종 grep 검증: `direction.md` / `system.md` / `events.md` 모두 위반 0건. `dictionary.md` 의 남은 forbidden 단어는 전부 "사용 금지" 컬럼 또는 표기 메모 안의 의도적 인용.
