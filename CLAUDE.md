# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 방향과 문서

- 목표·전환 계획·규약은 [docs/README.md](docs/README.md)에서 관리한다. 작업 전에 해당 문서와 [AGENTS.md](AGENTS.md)를 읽는다.
- Next.js App Router·TypeScript·shadcn/ui 구조로 전환하고 Vercel에 배포할 예정이다. 코드 전환과 배포 구성은 미착수다.
- 아래 단일 파일·IIFE 규칙은 현재 구현 지침이다. 전환한 모듈에는 [개발·문서 규약](docs/conventions.md)을 적용하고 이 문서도 갱신한다.

## 프로젝트 개요

Asset Tools는 브라우저에서 파라미터를 조절해 SVG/PNG 에셋(3D 피라미드, 원형 화살표 다이어그램 등)을 생성·다운로드하는 단일 페이지 웹 앱이다. 빌드 단계·프레임워크·외부 의존성·서버 통신이 전혀 없는 바닐라 HTML/CSS/JS다.

## 실행 / 개발

- 빌드·번들·설치 과정 없음. `index.html`을 브라우저에서 직접 열면 그대로 동작한다.
- 정적 서버가 필요하면(해시 라우팅 확인 등) 아무 정적 서버나 사용: 예 `python -m http.server` → http://localhost:8000.
- 테스트·린트·포매터 도구 없음(`package.json`·설정 파일 자체가 없음). 검증은 브라우저에서 직접 조작하고 SVG/PNG 내보내기 결과를 확인하는 방식.
- 현재 데모는 GitHub Pages에 있다. 목표 배포처는 Vercel이며 아직 전환하지 않았다. 현행 데모 URL은 `README.md` 참고.

## 아키텍처 (전체 그림)

앱 전체가 `index.html` **한 파일**에 들어 있다: `<style>`(CSS) + 마크업 + 단일 `<script>`(JS). `legacy/`는 통합 이전의 개별 도구 원본으로, 참고용 보관일 뿐 앱에서 로드하지 않는다.

### 탭/페이지 구조
- 상단 바 `.topnav` 안의 `.nav-tab` 버튼이 각각 `data-target="page-xxx"`를 가진다.
- 각 도구는 `<main class="tool-page" id="page-xxx">`이며, 활성 페이지에만 `.active`(display:block)가 붙는다.
- `initTabs()` IIFE가 탭 클릭 → `.active` 토글 + `location.hash` 동기화를 담당한다. URL 해시로 특정 도구에 딥링크 가능.

### 도구 모듈 패턴 (핵심)
- 각 도구는 독립 IIFE다: `initPyramid()`, `initStairs()`, `initArrows()`. 자체 상태(`layerCount`, `arrowCount`, `thickness` 등), 자체 `PRESETS`, `buildSvg()`, `render()`, 이벤트 핸들러를 모두 캡슐화한다.
- 같은 DOM을 공유하므로 **DOM id는 도구별 접두사로 네임스페이스 분리**한다: 피라미드 `pyr-*`, 계단 `str-*`, 화살표 `arr-*`. 지역 `$ = id => document.getElementById(id)`로 참조한다.

### 공유 유틸 (IIFE 바깥, `<script>` 최상단)
- 색상: `_hexToRgb`, `_rgbToHex`, `_distributePalette(palette, n, fallback)` — 임의 길이 팔레트를 N개 항목에 보간 분배한다(항목 개수를 바꾸지 않고 프리셋 적용).
- 내보내기: `_downloadSvgAsFile`(SVG blob 다운로드), `_downloadSvgAsPng`(SVG→canvas→PNG, 긴 변을 `PNG_LONG_EDGE = 2048`px로 고정).
- 비율: `RATIO_PRESETS`, `_populateRatioSelect`, `_computeCanvas(artW, artH, padding, ratio)` — 아트웍 바운딩 박스+패딩을 선택한 종횡비 캔버스에 맞춰 중앙 배치한다.

### SVG 생성 불변식
- 각 도구의 `buildSvg()`는 SVG **문자열**을 반환하고, 이 동일 출력이 미리보기(`svgContainer.innerHTML`)와 다운로드 양쪽에 쓰인다 — 단일 소스.
- SVG의 `width`/`height` 속성값 = `viewBox` 크기. 따라서 내보내기 기준 **1 user unit = 1px**이며, 코드의 좌표·두께 수치가 곧 픽셀이다.
- 색상은 **hex만** 사용한다(`hsl()`/`rgba()` 금지). 일부 PowerPoint SVG 렌더러 호환 때문.
- 아트웍은 "자연 단위"로 계산한 뒤 `_computeCanvas`로 캔버스 중앙(`cx`, `cy`)에 배치한다.

### 미리보기 렌더링
- `scheduleRender(rebuildPickers?)`가 `requestAnimationFrame`으로 슬라이더 input 이벤트를 합쳐(coalesce) 과도한 재렌더를 막는다.
- `.svg-bg`는 CSS 변수 `--preview-ratio` / `--preview-w` / `--preview-h`로 선택 비율에 맞게 크기를 잡고, 체커보드 배경으로 투명 영역을 표시한다.

## 새 도구/메뉴 추가 규칙

**메뉴를 추가할 때는 현재 상단 바 방식을 그대로 따른다:**
1. `#navTabs`에 `data-target="page-xxx"`를 가진 `.nav-tab` 버튼을 추가한다.
2. 표준 2단 레이아웃으로 `<main class="tool-page" id="page-xxx">`를 추가한다 — `.container` 안에 좌측 컨트롤 `.panel` + 우측 `.right-stack`(download-panel + preview-panel).
3. 모든 DOM id에 고유 접두사를 부여한다.
4. 로직은 기존 모듈과 동일하게 `initXxx()` IIFE로 감싸고, 색상/내보내기/비율은 공유 유틸을 **재사용**한다(재구현 금지).

**UI 통일성을 유지한다:** 새 컨트롤은 기존 CSS 클래스를 재사용한다 — `.control-group`, `.slider-label`/`.slider-value`, `.item-row`, `.preset`/`.preset-swatches`, `.toggle-btn`, `.download-btn`(+`.secondary`), `.preview-header`, `.ratio-select` 등. 임의로 새 스타일을 만들지 말고 기존 디자인 토큰(강조색 `#4338ca`, 라운드, 간격, 타이포)을 따른다.

## 도메인 메모 (비자명한 단위/기하)

- 원형 화살표 `Head Size %`는 **그 화살표 자신의 호 길이(`usable = segment − gap`)에 대한 비율**이지 전체 둘레 기준이 아니다. 화살표 개수가 적을수록 같은 %라도 절대 각도가 커진다.
- 원형 화살표 `Thickness`는 링의 반경 방향 띠 폭(px)이다. `baseR = 180` 기준 `thickness × 1.05`가 180을 넘는 지점(약 171)부터 화살촉 안쪽 점이 중심을 지나 도형이 깨지므로, 슬라이더 최대값은 그 아래로 둔다.
