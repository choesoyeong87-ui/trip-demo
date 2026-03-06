# TripZone Demo

TripZone는 숙소 탐색/예약/문의 흐름을 빠르게 시연할 수 있도록 만든 여행 숙소 예약 데모 프로젝트입니다.  
사용자/판매자/관리자 역할 기반 화면과 지도 중심 숙소 탐색 UI를 포함합니다.

## Demo Scope

- 사용자: 숙소 검색, 상세 조회, 예약, 내 예약/내 문의
- 판매자: 숙소 관리, 예약 현황, 문의 확인
- 관리자: 사용자/판매자/문의 목록 확인
- 인증: 이메일 로그인/회원가입 + 소셜 버튼 UI(데모 동작)

## Tech Stack

- Frontend: React + Vite + React Router + Axios + Leaflet
- Mock API: json-server
- Backend (준비/구현): Spring Boot (Maven, Java 17)

## Project Structure

```text
tripzone/
  frontend/                # React demo app
  backend/tripzone-backend # Spring Boot API
  frontend/mock/           # json-server db/routes
  doc/                     # tasks/context/workflow docs
```

## Quick Start (Demo)

### 1) Frontend install

```bash
cd frontend
npm install
```

### 2) Mock API run (json-server)

```bash
npm run mock
```

### 3) Frontend run

```bash
npm run dev
```

기본적으로 Vite proxy를 통해 `/api` 요청이 mock 서버로 전달됩니다.

## Build Check

```bash
cd frontend
npm run build
```

## Demo Accounts

- User: `user@test.com` / `1234`
- Seller: `seller@test.com` / `1234`
- Admin: `admin@test.com` / `1234`

## Notes

- 소셜 로그인 버튼은 현재 **실제 OAuth 연동이 아닌 데모 UI/동작**입니다.
- 데이터 저장/수정/삭제는 json-server 기준으로 동작합니다.
- 운영 배포 전에는 실제 인증/권한/백엔드 API 정합성 점검이 필요합니다.
