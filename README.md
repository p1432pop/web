# 2023 고급웹프로그래밍 프로젝트

## 이터널 리턴 전적 검색 및 통계 사이트

### 주요 기능

-   플레이어 전적 검색
-   최근 패치 노트 바로가기
-   상위 랭킹 정보 제공
-   인게임 아이템 정보 제공
-   커뮤니티 기능

### Stacks

<div>
  <div>
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white"> 
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white">
    <img src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white">
    <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">
    <img src="https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=MUI&logoColor=white">
  </div>
  <div>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white">
    <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
    <img src="https://img.shields.io/badge/EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white">
    <img src="https://img.shields.io/badge/RDS-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white">
  </div>
</div>

## 기간

-   2023/09/16 ~ 2023/12/15

## 배포

-   [Lumia.kr](https://lumia.kr)
-   회원가입을 위한 인증 코드 : seoultech
-   테스트용 계정 - 1
-   ID : test123
-   PASSWORD : test1234@
-   테스트용 계정 - 2
-   ID : test1231
-   PASSWORD : test1234@

## 디렉터리 구조

```bash
├── public
│   ├── image/
│   └── index.html
├── src
│   ├── app // redux 상태 관리
│   │   ├── store.js
│   │   ├── rankSlice.js // 랭킹 데이터 관리
│   │   ├── playerSlice.js // 전적 데이터 관리
│   │   └── registerSlice.js // 로그인 상태 관리
│   ├── assets // 배경 이미지 및 게임 데이터
│   ├── components // 재사용 가능한 컴포넌트
│   │   ├── Footer.js
│   │   ├── Header.js
│   │   └── SignIn.js
│   ├── pages // 페이지 컴포넌트
│   │   ├── Community.js
│   │   ├── Guide.js
│   │   ├── Main.js
│   │   ├── Player.js
│   │   ├── Ranking.js
│   │   └── SignUp.js
│   ├── style // 개별 컴포넌트에서 사용할 css 파일
│   ├── utils // 재사용 가능한 함수 ex) image 파일 src 등..
│   ├── App.css // global css
│   └── App.js // 라우터 설정
└── server.js // 서버 관리 코드
```

## Reference

-   [인게임 데이터 리소스](https://developer.eternalreturn.io/static/media/Docs_KR_20230722.pdf)
-   [이미지 리소스](https://drive.google.com/drive/folders/1bgW32L09YPpRgQKtH4C_TAd3Kr0N9Y90)
-   Eternal Return and all related logos are trademarks of Nimble Neuron, inc. or its affiliates.
