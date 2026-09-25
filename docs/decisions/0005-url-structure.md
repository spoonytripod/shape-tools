# 0005. 도형별 URL 경로

- 상태: 확정 · 로컬 앱에 구현
- 날짜: 2026-09-25
- 근거: 프로젝트 소유자가 권장 URL 구조 채택
- 관련 결정: [0002. Next.js·shadcn/ui·Vercel](0002-next-shadcn-vercel.md)

## 결정

- `/`에 사용 가능한 도형 목록을 둔다.
- 기존 도형의 기본 경로는 `/tools/pyramid`, `/tools/stairs`, `/tools/circular-arrows`로 한다.
- 새 사이트의 `/#page-pyramid`, `/#page-stairs`, `/#page-arrows` 접근은 각각 새 경로로 연결한다.
- 신규 도형도 `/tools/<descriptive-slug>` 패턴을 따른다.

## 이유와 영향

도형마다 공유하고 다시 열 수 있는 주소가 생긴다. Next.js App Router에서 각 경로를 페이지로 만들고 공통 레이아웃과 도형 UI를 재사용한다. URL에 드러나는 슬러그는 임의로 변경하지 않고, 변경 시 이전 경로의 연결 방안을 마련한다.

기존 해시 링크의 경로 연결은 새 사이트 내부에서 구현한다. 공개 URL은 Vercel 배포 단계에서 정하고 문서에 반영한다. 브라우저 해시는 서버 요청에 포함되지 않으므로 새 사이트에서 클라이언트 측으로 해석한다.

## 검증

도형 목록에서 각 페이지로 이동하고 각 경로를 직접 열거나 새로고침해도 같은 도형이 표시되는지 확인한다. 새 사이트의 기존 해시 링크 세 개도 대응 경로로 연결되는지 확인한다.

## 참고 문서

- [Next.js 페이지와 경로](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
