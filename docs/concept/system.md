# system — 능력치 · 상태값 · 진행 · 데이터 구조

본 문서는 게임 한 판이 굴러가는 동안 들고 다니는 **런타임 데이터 구조**를 정의한다.
이벤트 카드(정적 카탈로그) 구조는 `direction.md` 3장 참조.

## 0. 표기 약속

- 시작값 / 범위는 MVP 초안. 밸런싱 단계에서 조정한다.
- 한글 표기는 `dictionary.md` 가 SSOT. 영문 키는 본 문서가 SSOT (둘은 항상 동기화).
- 주사위 표기는 `direction.md` 용어 사전의 `{n}d{m}`을 따른다.

---

## 1. 능력치 (Stats)

7개 정량 스탯. 모두 정수.

| 키 | 표기 | 시작 | 범위 | 비고 |
|---|---|---|---|---|
| `hp` | 체력 | 10 | 0 ~ 20 | 0이 되면 즉시 객사 엔딩 |
| `qi` | 내공 | 0 | 0 ~ 20 | 일정 수치 이상에서 기연/깨달음 게이트, 무예 판정에 내공 실어 위력 ↑ |
| `martial` | 무예 | 1 | 0 ~ 20 | 전투 판정 본체. 추후 도검/권법/암기 등으로 세분 가능 |
| `knowledge` | 학식 | 1 | 0 ~ 20 | 통찰·식별·언변 선택지 게이트 |
| `renown` | 명성 | 0 | −20 ~ +20 | 양수 = 정파 명성, 음수 = 사파 악명 |
| `morality` | 도덕 | 0 | −20 ~ +20 | 양수 = 선함, 음수 = 악함. 내적 도덕축 |
| `money` | 은자 | 5 | 0 ~ 999 | 화폐 |

범위를 벗어나면 경계값으로 clamp.

---

## 2. 상태값 (Status)

비정량적 플래그·리스트. 조건 여부 판단용.

### 2-1. 일시적 상태

| 키 | 표기 | 타입 | 의미 |
|---|---|---|---|
| `injury` | 부상 | `'none' \| 'minor' \| 'major'` | 경상: 전투 판정 −1 / 중상: −3, 매 이벤트 체력 −1 |
| `poison` | 중독 | `0` ~ `3` (int) | 단계당 매 이벤트 체력 −1. 3단계 방치 시 객사 |

### 2-2. 장기 플래그

| 키 | 표기 | 타입 | 의미 |
|---|---|---|---|
| `sect` | 문파 소속 | `string \| null` | 소속 문파명 (예: `'화산파'`). 없으면 `null` |
| `master` | 사부 | `string \| null` | 사부 이름. 성장 보너스/특수 이벤트 게이트 |
| `wanted` | 현상수배 | `boolean` | 자동 — `renown ≤ −8` 이면 활성 |
| `kills` | 살업 | int (≥0) | 살인 누적. |
| `bonds` | 인연 | `string[]` | 이름 있는 NPC와의 관계 (예: `'노인'`, `'소연'`) |
| `grudges` | 원한 관계 | `string[]` | 원한 맺은 NPC (예: `'노인'`, `'흑풍채 두목'`) |
| `fortunes` | 기연 | `string[]` | 획득한 비급·보물·깨달음 식별자 |

`bonds` / `grudges` / `fortunes` 는 누적 리스트. 중복 추가는 무시한다.

---

## 3. 인벤토리

| 키 | 타입 | 의미 |
|---|---|---|
| `items` | `Item[]` | 보유 아이템 목록 |

```ts
type Item = {
  id: string;          // 'sword_iron', 'pill_healing' 등 고유 id
  name: string;        // 화면 표기명
  type: 'weapon' | 'consumable' | 'manual' | 'misc';
  effect?: string;     // 자유 텍스트, 뭐 보유 효과나 이벤트 메모나 이런거.
  equipped?: boolean;  // 무기/심법 등에 해당
};
```

구체 아이템 카탈로그는 MVP에서 추후 정의(10개 이하 — `direction.md` 4-1).

---

## 4. 위치

| 키 | 타입 | 시작값 | 의미 |
|---|---|---|---|
| `region` | `'청운현' \| '흑풍산' \| '낙양성'` | `'청운현'` | 현재 머무는 지역 |
| `subRegion` | `string \| null` | `'외곽'` | 세부 위치 (예: `'가도'`, `'객잔'`) |

---

## 5. 진행 상태 (Run state)

| 키 | 타입 | 시작값 | 의미 |
|---|---|---|---|
| `turn` | int | `0` | 이벤트 카운터 — 몇 번째 이벤트인가 |
| `currentEventId` | `string \| null` | `null` | 지금 표시 중인 이벤트 id |
| `seenEvents` | `string[]` | `[]` | 이미 발생한 이벤트 id. 1회성 카드 중복 방지 |
| `choiceHistory` | `Choice[]` | `[]` | 선택 이력 |
| `rngSeed` | int | 랜덤 | 재현 가능한 RNG 시드 |

```ts
type Choice = {
  eventId: string;     // 어느 이벤트에서
  choiceIndex: number; // 0-based, 몇 번째 선택지를
  ts: number;          // unix millis
};
```

---

## 6. 캐릭터 메타

| 키 | 타입 | 의미 |
|---|---|---|
| `name` | `string` | 플레이어가 정한 이름. 빈 문자열이면 `'이름 없는 강호인'`으로 표기 |
| `origin` | `'낭인' \| '후기지수' \| '살수'` | 출신. 시작 능력치 보너스 결정 |
| `motive` | `'복수' \| '생존' \| '명성' \| '자유' \| '진실'` | 강호에 나온 동기. 엔딩 분기·평가 텍스트에 영향. 게임 중 불변 |
| `startedAt` | int | 게임 시작 unix millis |

---

## 7. 전체 GameState 스키마

```ts
type GameState = {
  // 캐릭터 메타
  name: string;
  origin: '낭인' | '후기지수' | '살수';
  motive: '복수' | '생존' | '명성' | '자유' | '진실';
  startedAt: number;

  // 능력치
  stats: {
    hp: number;
    qi: number;
    martial: number;
    knowledge: number;
    renown: number;
    morality: number;
    money: number;
  };

  // 상태값
  status: {
    injury: 'none' | 'minor' | 'major';
    poison: number;        // 0~3
    sect: string | null;
    master: string | null;
    wanted: boolean;
    kills: number;
    bonds: string[];
    grudges: string[];
    fortunes: string[];
  };

  // 인벤토리
  items: Item[];

  // 위치
  region: '청운현' | '흑풍산' | '낙양성';
  subRegion: string | null;

  // 진행
  turn: number;
  currentEventId: string | null;
  seenEvents: string[];
  choiceHistory: Choice[];
  rngSeed: number;

  // 엔딩 (게임 종료 시 채워짐)
  ending: null | {
    id: '천하제일인' | '마교 타락' | '은거기인' | '객사' | '문파 재건';
    reachedAt: number;
  };
};
```

---

## 8. 시작 상태 (캐릭터 생성 직후) 예시 JSON

```json
{
  "name": "",
  "origin": "낭인",
  "motive": "생존",
  "startedAt": 1717200000000,

  "stats": {
    "hp": 10, "qi": 0,
    "martial": 1, "knowledge": 1,
    "renown": 0, "morality": 0,
    "money": 5
  },
  "status": {
    "injury": "none",
    "poison": 0,
    "sect": null,
    "master": null,
    "wanted": false,
    "kills": 0,
    "bonds": [],
    "grudges": [],
    "fortunes": []
  },
  "items": [],

  "region": "청운현",
  "subRegion": "외곽",

  "turn": 0,
  "currentEventId": "prologue_first_step",
  "seenEvents": [],
  "choiceHistory": [],
  "rngSeed": 8675309,

  "ending": null
}
```

---

## 9. 이벤트 결과 표기 → 상태 변경 매핑

이벤트 카드의 `결과` 필드는 자유 한국어 텍스트로 적힌다.
엔진은 이를 파싱해 `GameState`에 적용한다.

| 표기 예시 | 적용 |
|---|---|
| `체력 +1` | `stats.hp += 1` (clamp 0~20) |
| `체력 -2, 도덕 +1` | 두 변경을 순차 적용 |
| `은자 +3` | `stats.money += 3` |
| `상태값: 인연(노인) 획득` | `status.bonds.push('노인')` (중복 무시) |
| `상태값: 원한 관계(흑풍채 두목) 획득` | `status.grudges.push('흑풍채 두목')` |
| `상태값: 부상 = 경상` | `status.injury = 'minor'` |
| `상태값: 중독 +1` | `status.poison = clamp(poison + 1, 0, 3)` |
| `엔딩 — 객사` | `ending = { id: '객사', reachedAt: now }` |
| `전투 발생` | 전투 판정 루틴 호출 (`2d6 + 무예 + 상태값` — `direction.md` 4-1) |

자유 표기를 안정적으로 파싱하려면 표기 규약을 점차 좁혀야 한다.
MVP에선 위 표 정도만 인식하도록 한다.

---

## 10. 영속화 (Persistence) — 후순위

- 저장 기능은 `direction.md` 4-1에 따라 **나중으로 미룸**.
- 단, `GameState` 자체는 시작부터 **JSON 직렬화 가능한 평탄 구조**로 설계 — 추후 저장 추가 시 그대로 `JSON.stringify` 하면 끝나도록.