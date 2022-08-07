> For Node.js server Practice (Sequelize(MySQL), JWT, bcrypt...)

### 📝 API Reference
## [home]

GET / - 홈화면 랜더링

GET /about - 홈페이지에 대한 설명페이지 랜더링

## [user]

GET /user/login - 로그인 페이지 랜더링

POST /user/login - 로그인 post 요청

GET /user/register - 회원가입 페이지 랜더링

POST /user/register - 회원가입 post 요청

GET /user/profile - 현재 로그인된 유저 인증후, 해당 유저정보 전달
(프론트는 해당 정보 받은후, 주소의 파라미터를 통해 링크이동)

GET /user/profile/output - views폴더안 profile html보내줌
(profile html은 주소의 파라미터를 파싱해서 해당유저의 profile 랜더링)

GET /user/token/refresh - refresh토큰받아서, access token 재발급

## [board]

GET /board - 글 데이터 전체 전달

POST /board - 글 생성

GET /board/new - 생성페이지 랜더링

GET /board/:id - id번호의 글 페이지 랜더링

POST(delete) /board/:id - id번호의 글 삭제

GET /board/:id/edit - id번호의 글 edit페이지 랜더링

POST /board/:id/edit - id번호의 글 edit후 post

GET /board/:id/auth - 해당 글작성자와 로그인중인 사용자 일치 확인(인증)
(해당 글 접근시 [back] or [back,edit,delete] button 출력여부결정)
