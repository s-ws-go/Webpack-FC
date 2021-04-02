// https://medium.com/@shlee1353/%EC%9B%B9%ED%8C%A9-%EC%9E%85%EB%AC%B8-%EA%B0%80%EC%9D%B4%EB%93%9C%ED%8E%B8-html-css-%EC%82%AC%EC%9A%A9%EA%B8%B0-75d9fb6062e6

const PATH = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const config = {
  entry: "./index.js",
  output: {
    path: PATH.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      //test : 어떤 파일들이 웹팩 대상이 되는지 정규표현식으로 패턴매칭함
      //use : 사용하는 로더를 설정하는 로더 키와, 동작하는 방식을 설정하는 옵션 키를 사용
      // 노멀라이즈 css (reset.css 같은거) 적용하여 스타일링 할 예정
      {
        test: /\.css$/i,
        use: [
          //처리하는 css 파일별로 style 태그를 자동으로 만들어 줌. style 태그 하나에서 한번에 정보를 읽어올 수 있도록 옵션 설정(injectype을 singleton..)도 가능
          {
            loader: "style-loader",
            options: {
              injectType: "singletonStyleTag",
            },
          },
          {
            //클래스 이름을 직접 자바스크립트에 적용 가능(?)
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
    ],
  },
  //플러그인 반영 해 주면서 index.html 파일명을 template.html 로 이름 변경
  //실행하면, dist 폴더 안에 template.html 파일의 내용이 반영 된 index.html이라는 파일이 생성됨
  plugins: [
    new HTMLWebpackPlugin({
      template: "./template.html",
    }),
  ],
  ///
  target: "node",
  mode: "none",
};

module.exports = config;
