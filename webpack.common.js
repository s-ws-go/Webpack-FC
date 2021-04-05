/*
webpack.common.js.
optimization 이나 최적화 관련된 부분은 삭제하고 가져옴
*/
/*
package.json 에서 개발 환경과 프로덕션 환경 명령어를 별도로 설정하여 나누어 실행할 수 있도록 함

디파인 플러그인 _ 웹팩에서 빌드를 진행할 때 특별한 상속값을 만들어 준다. 모듈들이 이 상속값을 어디서든 사용할 수 있도록 함
모듈 내부에 있는 플러그인이므로 npm 설치 필요없음. 플러그인 객체 안에서 불러와서 사용
모듈 전역에서 접근할 수 있는 상속값을 지정해 준다.
*/

const PATH = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WEBPACK = require("webpack");

// 내부 ENV로 접근 가능
const isProduction = process.env.NODE_ENV === "PRODUCTION";

const config = {
  entry: "./index.js",
  output: {
    path: PATH.resolve(__dirname, "dist"),
    filename: "[name].[chunkhash].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          //처리하는 css 파일별로 style 태그를 자동으로 만들어 줌. style 태그 하나에서 한번에 정보를 읽어올 수 있도록 옵션 설정(injectype을 singleton..)도 가능
          // {
          //   loader: "style-loader",
          //   options: {
          //     injectType: "singletonStyleTag",
          //   },
          // },
          //MiniCssExtractPlugin 과 스타일로더의 충돌 방지를 위해 기존 스타일 로더는 주석처리 함.
          { loader: MiniCssExtractPlugin.loader },
          {
            //클래스 이름을 직접 자바스크립트에 적용 가능(?)
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.hbs$/,
        use: ["handlebars-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[contenthash].css",
    }),
    new HTMLWebpackPlugin({
      title: "Webpack!",
      template: "./template.hbs",
      meta: {
        viewport: "width=device-width, initial-scale=1.0",
      },
      //개발 모드일 때는 압축 X, 프로덕션 모드일때 압축 ㄱㄱ
      minify: isProduction
        ? {
            collapseWhitespace: true,
            useShortDoctype: true,
            removeScriptTypeAttributes: true,
          }
        : false,
    }),
    new CleanWebpackPlugin(),
    new WEBPACK.DefinePlugin({
      IS_PRODUCTION: true,
    }),
  ],
};
