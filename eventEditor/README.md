# eventEditor

이벤트 카드 편집기. 카드 구조는 `docs/concept/direction.md` 3장 참고.

## 실행

```bash
cd eventEditor
node server.mjs
```

→ http://localhost:3700 (포트 바꾸기: `PORT=4000 node server.mjs`)

## 사용

- **＋ 카드 추가** — 새 카드 생성
- **📁 파일 불러오기** — `data.json`에서 불러오기 (현재 편집본 덮어씀)
- **? (파일 불러오기 옆)** — `data.json` 경로·존재 여부·크기 확인
- **💾 파일 저장** — 현재 편집본을 `data.json`에 덮어쓰기
- **JSON 복사 / 내보내기** — 클립보드 복사 또는 `.json` 다운로드
- 편집 내용은 브라우저 `localStorage`에 자동 저장 (서버 파일과는 별개)

## 파일

```
eventEditor/
├── index.html    편집기 UI
├── server.mjs    zero-dep Node 서버 (정적 + /data GET/POST + /data/info)
├── data.json     카드 데이터 (첫 저장 시 생성)
└── README.md
```
