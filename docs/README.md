# 프로젝트 문서

프로젝트 목적, 전환 계획, 개발 규약을 이 폴더에서 관리한다.

## 읽는 순서

1. [프로젝트 목표](project-goals.md): 대상 사용자와 제품 범위.
2. [전환 계획](migration-plan.md): 현재 상태, 목표 구조, 단계별 완료 조건.
3. [개발·문서 규약](conventions.md): 구현, 검증, 문서 관리 방법.
4. [결정 기록](decisions/0001-project-direction.md): 최초 방향, [기술·배포 선택](decisions/0002-next-shadcn-vercel.md), [npm 선택](decisions/0003-package-manager.md), [품질 도구 선택](decisions/0004-quality-tooling.md), [URL 구조](decisions/0005-url-structure.md).
5. [전환 전 출력 기준](legacy-baseline.md): 기존 SVG와 새 생성기의 비교 방법.

## 현재 진행 상태

- 완료: 프로젝트 방향, Next.js·shadcn/ui·Vercel, npm, 품질 도구, URL 구조 선택 문서화.
- 완료: Next.js 프로젝트 구성, 기존 세 도형 전환, SVG 회귀 및 브라우저 흐름 검증.
- 미착수: Vercel 프로젝트·도메인 결정과 공개 배포.
- 이후: 실용 도형 확장과 공개 웹사이트 사용성 개선.

새 앱의 로컬 실행 방법은 루트 [README.md](../README.md)를 따른다. GitHub Pages 데모는 배포 전까지 기존 `index.html`을 제공한다.

## 문서별 책임

[화면 디자인 규약](design-system.md)은 색상, 배치, 미리보기 상호작용과 변경 전후 화면을 관리한다.

목표는 `project-goals.md`, 작업 순서는 `migration-plan.md`, 공통 규약은 `conventions.md`를 기준으로 삼는다. 중요한 기술 선택은 `decisions/`에 기록한다. 같은 설명을 복사하기보다 기준 문서에 상대 링크를 건다.
