# 0002. Next.js·shadcn/ui·Vercel 선택

- 상태: Next.js·shadcn/ui 로컬 구현 완료 · Vercel 배포 미착수
- 날짜: 2026-09-25
- 근거: 프로젝트 소유자의 기술·배포 방향 지정
- 구체화한 결정: [0001. 프로젝트 방향](0001-project-direction.md)

## 배경

[최초 결정](0001-project-direction.md)은 HTML·CSS·TypeScript 전환과 공개 웹사이트 제공을 정하고 프레임워크와 배포처는 남겨뒀다. 프로젝트 소유자는 Next.js와 shadcn/ui 적용, Vercel 배포를 원한다.

## 결정

- Next.js App Router와 React·TypeScript를 새 앱의 기반으로 사용한다.
- shadcn/ui를 공통 컨트롤과 레이아웃에 필요한 만큼 적용한다. 도형 기하·SVG 생성은 별도 TypeScript 모듈로 둔다.
- Vercel을 목표 배포처로 사용한다. 현재 GitHub Pages 주소는 새 사이트 배포 전까지 현행 데모로 표시한다.
- SVG/PNG 생성과 다운로드는 브라우저에서 처리한다. 서버 기능은 현재 요구사항에 포함하지 않는다.

## 구현 영향

Next.js의 Client Component에서 슬라이더, 색상 선택, SVG 미리보기, 다운로드를 처리한다. 정적 안내와 레이아웃은 필요한 범위에서 서버 렌더링할 수 있다. `window`, `document`, `canvas` 같은 브라우저 API는 서버 렌더링 중 접근하지 않는다.

shadcn/ui의 기본 스타일 체계와 프로젝트의 기존 디자인을 맞춰야 한다. 기존 도형의 기능과 출력은 전환 기준에 따라 비교한다. Vercel의 Preview 환경에서 변경을 확인한 뒤 Production 배포를 검증한다. 외부 서비스 연결과 실제 배포는 별도 구현 단계다.

## 남은 선택

패키지 관리자는 [0003](0003-package-manager.md)에서 npm으로 정했다. 테스트·린트·포맷 도구는 [0004](0004-quality-tooling.md)에서 정했다. URL 구조는 [0005](0005-url-structure.md)에서 정했다. 설치된 도구 버전은 `package-lock.json`에 기록된다. 첫 신규 도형은 아직 결정하지 않았다. Vercel 프로젝트·도메인 설정과 정적 내보내기 사용 여부는 배포 단계에서 판단한다.

## 검증

[전환 계획](../migration-plan.md)의 단계별 완료 조건을 적용한다. 타입 검사·빌드, 기존 세 도형의 출력 비교, 브라우저에서의 미리보기·다운로드, Vercel Preview·Production URL 동작을 확인한다.

## 참고 문서

- [Next.js 설치](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js Client Component](https://nextjs.org/docs/app/api-reference/directives/use-client)
- [shadcn/ui의 Next.js 설치](https://ui.shadcn.com/docs/installation/next)
- [Vercel의 Git 배포](https://vercel.com/docs/git)
