//dev쪽 설정(개발환경)

const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const config = {
  mode: "development",
  devServer: {
    //true값을 넣으면 .. 지정하지 않은 route 주소로 이동했을 때
    //callback 처리 가능(기본 index.html 페이지가 나옴)
    historyApiFallback:
      //rewrites .. 특정 route로 접근 시 어떤 페이지를 띄울지 설정 가능
      //from 은 페이지명(정규표현식), to에는 페이지이름
      {
        rewites: [
          { from: /^\/subpage$/, to: "subpage.html" },
          // /./ : 특정 경로(윗줄의 subpage)를 제외한 모든 경로를 의미
          { from: /./, to: "404.html" },
        ],
      },
    //최초 웹팩 관련 설정 지정시 기본 브라우저가 자동 실행됨
    open: true,
    //에러 발생 시 에러메세지 자체가 브라우저에 나타남
    overlay: true,
    //port 값 수정 가능
    port: 3333,
  },
};

module.exports = merge(common, config);
