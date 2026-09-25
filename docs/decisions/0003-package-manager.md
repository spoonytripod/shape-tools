# 0003. 패키지 관리자로 npm 사용

- 상태: 확정 · 프로젝트 구성 미착수
- 날짜: 2026-09-25
- 관련 결정: [0002. Next.js·shadcn/ui·Vercel](0002-next-shadcn-vercel.md)

## 배경

새 Next.js 프로젝트에는 의존성과 실행 명령을 관리할 도구가 필요하다. 현재 저장소에는 `package.json`이나 잠금 파일이 없고, 로컬 환경에는 Node와 npm이 설치되어 있다.

## 결정

- 패키지 관리자로 npm을 사용한다.
- 프로젝트 구성 시 생성되는 `package.json`과 `package-lock.json`을 함께 Git으로 관리한다.
- 개발 중 의존성 추가·갱신에는 npm 명령을 사용하고, CI와 Vercel의 재현 가능한 설치에는 `npm ci`를 기준으로 한다.
- 다른 패키지 관리자의 잠금 파일은 이 저장소에 혼용하지 않는다.

## 이유와 영향

npm은 현재 환경에서 바로 사용할 수 있다. 잠금 파일은 설치된 의존성 트리를 기록하며, `npm ci`는 `package.json`과 잠금 파일이 맞지 않으면 실패한다. 이는 전환 과정과 배포에서 설치 차이를 발견하는 데 도움이 된다.

이 결정은 npm과 파일 관리 규칙만 확정한다. Next.js·shadcn/ui의 정확한 버전은 구현 시 선택한다. 테스트·린트·포맷 도구는 [0004](0004-quality-tooling.md)에서 정했다.

## 검증

프로젝트 구성 후 잠금 파일이 생성·추적되는지 확인한다. 깨끗한 환경에서 `npm ci`와 빌드가 성공하는지 검증한다.

## 참고 문서

- [npm의 package-lock.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/)
- [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/)
