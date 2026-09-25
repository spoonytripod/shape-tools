# 전환 전 출력 기준

기존 루트 `index.html`의 JavaScript를 DOM 모형에서 실행해 생성된 SVG를 [`tests/fixtures/legacy-svg.json`](../tests/fixtures/legacy-svg.json)에 보관한다. 수집 스크립트는 [`scripts/capture-legacy-baseline.mjs`](../scripts/capture-legacy-baseline.mjs)이다.

피라미드, 계단, 원형 화살표 각각에 대해 기본 출력, 다섯 화면 비율, 각 슬라이더의 최솟값·최댓값을 기록했다. 화살표의 반시계 방향도 포함한다. `npm test`는 새 TypeScript 생성기의 결과를 이 기준과 비교한다. 출력 변경이 의도된 경우에만 기준 파일을 갱신하고 변경 이유를 기록한다.

브라우저에서는 세 도형의 직접 링크, 컨트롤·팔레트·방향 변경, SVG/PNG 다운로드, 기존 해시 링크를 Chromium에서 확인한다. PNG의 긴 변이 2048px인지 검사한다. 이는 특정 문서 프로그램 전용 호환성 보증을 뜻하지 않는다.
