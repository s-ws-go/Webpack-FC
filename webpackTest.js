const path = require("path");

console.log(__dirname);

const newPath = path.resolve(__dirname, "123", "asd");
console.log(newPath);

// const path = require("path");

// const config = {
//   //bundling 에 들어갈 초기 모듈 이름. 기본값은 /src/index.js 임.
//   entry: "/src/index.js",
//   output: {
//     //현재 경로 다음에 dist라는 경로를 만들어서(폴더) 저장해라
//     path: path.resolve(__dirname, "dist"),
//     //이 파일 이름으로 저장해라.
//     filename: "bundle.js",
//   },
//   //환경은 node환경에서 진행한다.
//   target: "node",
// };

// module.exports = config;
