# 0004. 테스트·린트·포맷 도구

- 상태: 도구 선택 확정 · 환경 구성 미착수
- 날짜: 2026-09-25
- 관련 결정: [0002. Next.js·shadcn/ui·Vercel](0002-next-shadcn-vercel.md), [0003. npm](0003-package-manager.md)

## 배경

기존 앱에는 자동 테스트, 린트, 포맷 도구가 없다. 전환 과정에서는 SVG 계산의 회귀와 브라우저 내 조작·다운로드 오류를 확인해야 한다. 새 React·TypeScript 코드의 정적 검사와 서식 규칙도 필요하다.

## 결정

- **Vitest**: 색상·캔버스·도형 기하 및 SVG 생성 등 DOM 없이 실행 가능한 계산을 검증한다.
- **Playwright**: 도형 선택, 컨트롤 조작, 미리보기, SVG/PNG 다운로드의 브라우저 흐름을 검증한다.
- **ESLint**: Next.js의 권장 규칙과 TypeScript 규칙으로 새 코드를 검사한다. 타입 검사는 별도로 실행한다.
- **Prettier**: 코드와 설정 파일의 서식을 통일한다. 기존 단일 `index.html` 전체를 기계적으로 재포맷하지 않는다.

## 적용 범위

전환할 때 필요한 도구와 스크립트를 npm 개발 의존성에 추가한다. 먼저 핵심 계산 검증을 만들고, 새 화면의 흐름이 동작하면 브라우저 검증을 추가한다. 테스트는 구현을 그대로 되풀이하기보다 경계값과 사용자 결과를 확인한다. 검증 명령은 구성 후 README에 실제 이름으로 기록한다.

이 결정은 도구의 종류만 확정한다. 정확한 버전, ESLint·Prettier 세부 설정, 테스트 실행 환경과 CI 연결은 구현 단계에서 선택·검증한다. React 컴포넌트 단위 테스트 도구는 필요가 확인될 때 추가한다.

## 검증

전환 후 도형 계산 테스트와 주요 다운로드 흐름 테스트가 통과하는지 확인한다. 타입 검사, ESLint, Prettier 검사, 빌드는 각각 독립적으로 실행한다.

## 참고 문서

- [Vitest의 TypeScript 테스트](https://vitest.dev/guide/learn/writing-tests)
- [Playwright](https://playwright.dev/)
- [Next.js ESLint 설정](https://nextjs.org/docs/app/api-reference/config/eslint)
- [Prettier 설치](https://prettier.io/docs/install.html)
