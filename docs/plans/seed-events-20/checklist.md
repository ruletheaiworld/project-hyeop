# checklist — seed-events-20

> 작업 진행하면서 AI 가 순차적으로 체크. `[x]` 로 표시한 항목은 완료된 것으로 간주.
> 새 항목이 발견되면 적절한 단계에 추가하고 체크리스트를 유지한다.

## 0. 준비

- [x] spec.md / context.md 다시 한 번 읽고 어긋난 곳 없는지 확인
- [x] 기존 `data.json` 의 비활성 2장(`ev_mpxgr2nm_t4qvf`, `ev_mpzidm0v_i0s0j`) id·이름·상태를 메모지에 보존 (touch 금지)
- [x] `direction.md` 3-3 카드 포맷 / 3-4-1 id 규칙 / 5장 지역 키워드 펼쳐두기
- [x] `system.md` §9 결과 표기 매핑 펼쳐두기
- [x] `dictionary.md` 능력치 SSOT 표기 펼쳐두기

## 1. 분포·뼈대 설계

- [x] 20장의 id 목록과 지역·타입·가중치 표 박기 (청운 8 / 흑풍 7 / 낙양 5, 일반 15 / 전투 3 / 엔딩 2 — spec 의 14/4/2 와 ±1 차이는 의도된 일탈)
- [x] 후속 체인 2쌍 결정 (`heukpung_bandit_ambush → chief`, `nakyang_tournament_match → final`)
- [x] 가중치 0 카드 4장 자리 결정 (`heukpung_bandit_chief`, `nakyang_tournament_final`, `ending_obit`, `ending_recluse`)

## 2. 카드 본문 작성

청운현(8):
- [x] cheongun_inn_arrival — 객잔 도입 (일반 / 8)
- [x] cheongun_clinic_treatment — 의원 (일반 / 5)
- [x] cheongun_carriers_escort — 표국 의뢰 (일반 / 3, 무예·학식 게이트)
- [x] cheongun_alley_thug — 뒷골목 (일반 / 2)
- [x] cheongun_road_old_man — 가도 노인 (일반 / 7, 인연)
- [x] cheongun_market_haggle — 시장 부적 (일반 / 5)
- [x] cheongun_rumor_jianghu — 강호 풍문 (일반 / 4, 마교 도입부 연계)
- [x] ending_obit — 객사 엔딩 (엔딩 / 0)

흑풍산(7):
- [x] heukpung_bandit_ambush — 산적 매복 (일반 / 5, → chief)
- [x] heukpung_bandit_chief — 흑풍채 두목 (전투 / 0, 후속 전용)
- [x] heukpung_cave_entrance — 동굴 입구 (일반 / 4)
- [x] heukpung_cave_treasure — 동굴 비급 (일반 / 1, 학식 게이트)
- [x] heukpung_recluse_master — 은거고수 (일반 / 3, 학식·내공 게이트)
- [x] heukpung_demonic_rumor — 마교 잔당 풍문 (일반 / 3)
- [x] ending_recluse — 은거기인 엔딩 (엔딩 / 0)

낙양성(5):
- [x] nakyang_info_broker — 정보상 (일반 / 4)
- [x] nakyang_sect_invite — 화산파 권유 (일반 / 3, 명성·무예 게이트)
- [x] nakyang_power_intrigue — 권력 암투 (일반 / 3, 도덕 분기)
- [x] nakyang_tournament_match — 비무대회 예선 (전투 / 3, → final)
- [x] nakyang_tournament_final — 비무대회 결승 (전투 / 0, 후속 전용)

## 3. data.json 반영

- [x] 기존 2장 위치·내용 유지 확인 (id·이름·활성상태 그대로)
- [x] 신규 20장을 배열 뒤에 append
- [x] JSON 문법 유효성 확인 (`node` require 통과, 총 22장)
- [x] id 중복 없음 확인 (`node` 로 unique check 통과)

## 4. 검증

- [x] 표기 위반 grep — `무공|내력|학력|지혜|평판|은전|은냥|동냥|엽전|진기|심성` 매칭 0건
- [x] `후속이벤트` 참조 무결성 — 3개 (기존 1 + 신규 2) 모두 OK
- [ ] 편집기 강제 새로고침 (`http://localhost:3700`, `⌘+Shift+R`) 후 22장 표시 확인 — **사용자 직접 확인 필요**
- [x] 비활성 2장이 여전히 비활성 + `[보관]` prefix 유지

## 5. 마무리

- [ ] 커밋 (`feat(events): 시드 카드 20장 추가`) — **사용자 승인 후 진행**
- [x] checklist 의 미체크 항목 사유 메모:
  - 4단계 마지막 — 브라우저 표시 확인은 사용자만 가능
  - 5단계 커밋 — 사용자 승인 후 진행
- [ ] 다음 세션이 픽업할 수 있도록 spec.md / context.md 의 변경분 반영 — 본 작업분만으론 spec/context 변경 없음 (분포 일탈 1장은 checklist 1단계에 메모됨)

## 후속 작업 큐 (별도 plan 으로 빠질 후보)

- `setting.md` 의 인물·문파 카탈로그에 본 카드에서 등장한 명칭 등록: 노인 / 흑풍채(두목) / 은거고수 / 화산파 / 마교 잔당 / 관아 / 떠돌이 도사 / 떠돌이 점쟁이 / 의원 / 표두 / 정보상
- `'마교 타락'` 엔딩 카드 추가 + 게이트 재설계 (현재 `demonic` 폐기로 비어있음)
- 엔딩 트리거를 엔진이 어떻게 강제 호출할지 결정 (`ending_obit`, `ending_recluse` 가 가중치 0 + 발생조건 게이트 형식 — 엔진이 매 턴 발생조건 평가해야)
