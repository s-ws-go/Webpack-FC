// https://medium.com/@shlee1353/%EC%9B%B9%ED%8C%A9-%EC%9E%85%EB%AC%B8-%EA%B0%80%EC%9D%B4%EB%93%9C%ED%8E%B8-html-css-%EC%82%AC%EC%9A%A9%EA%B8%B0-75d9fb6062e6

const PATH = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const config = {
  entry: "./index.js",
  output: {
    path: PATH.resolve(__dirname, "dist"),
    filename: "[name].[chunkhash].js", // hash의 종류 __ hash, contenthash, chunkhash
    /*
    1. hash : 파일이 변경될때마다(빌드될떄마다) 보여지는 값
    bundle.[hash].js 로 파일명 지정시 파일이 수정될 때 마다 다른 파일명을 가진(hash) 번들js파일이 계속 생기게 됨 -> 플러그인 필요 _ clean-webpack-plugin
     -------------------------------------------
    2. contenthash __ 개념 확인 전 npm i mini-css-extract-plugin 로 설치
    MiniCssExtractPlugin 으로 로더, 플러그인 지정 하여 webpack 실행하면 main.css 파일 생성됨(자바스크립트 모듈에서). 이 때 index.html 파일 보면 main.css 참고하는 link태그가 새로 생김.
    이렇게 별도로 css 파일이 분리되어 생성되면 css 자원도 캐싱되어 활용될 수 있는 형태가 되고 html문서 크기는 줄어드는 효과가 있다. 별도 리소스 취급이 되니까 재사용도 가능하게 됨.
    이름이 main.css 로 고정되어 있어서 내용이 변경되어도 이전 파일명 main.css 를 참고해서 불러오는 문제가 생길 수 있다 __ 이름에 hash값을 넣어줘서 막아줘야 함. __ 플러그인의 옵션 활용
    플러그인에 fliename 키로 하는 객체로 옵션 설정하여 '[hash].css' 와 같이 파일명 수정할 수 있음.
     -------------------------------------------
     여기서 또 하나 문제는.... JS 파일과 CSS파일의 처리 시점이 다르다는 문제가 있다. (JS파일만 수정됨에도 다시 빌드하면 CSS파일까지 파일명이 변경된 해쉬값으로 리빌딩됨)
     해쉬값은 기본적으로 파일이 수정이 되고 빌드됨에 따라 바뀌기 때문
     -> contents 에 따라 hash값을 부여하는 contenthash라는걸 사용하게 된다. -- '[hash].css' 를 '[contenthash].css' 로 변경
     css 파일에 부여된 contenthash 값은 JS 파일이 변경되어도 그대로 유지된다. (CSS 파일과 JS 파일이 서로 다른 hash 값(다른 파일명)을 가지게 되고, 서로 수정사항이 영향을 미치지 않는다)
     -----------------------------------------------
     여기서 궁금해서 실험한 것.
     * 지금 JS파일명에는 hash가, CSS 파일명에는 contenthash가 반영되어 있는 상태
     1) JS파일 변경 시 CSS 파일 변경 안 됨. 근데, CSS 변경시엔 JS 파일명은 변경되지 않나? : 변경된다. css의 contenthash가 바뀌는건 전체 hash를 변경시키는 것처럼 보임
     2) JS파일명에도 bundle.[contenthash].js 와 같이 반영할 수 있지 않나? : 반영 가능하다! 이 경우 css와 js 는 각각 고유의 contenthash로 파일명을 갖게 되므로 서로의 변경사항이 파일명에 영향을 미치지 않는다!
     ------------------------------------------------
     3. chunkhash __ chunk란 bundling 한 js 파일을 나누어서 관리하기 위한 덩어리 단위이고, runtime chunk(기본값 모듈), vendor chunk(제이쿼리 등 외부 프로그램) 으로 크게 구분
     chunkhash 확인을 위해 js 파일명을 'bundle.[hash].js' 에서 '[name].[chunkhash].js' 로 변경 해 보자.([name]은 엔트리파일이나 웹팩 내부에서 name 프로퍼티에 할당한 값이 들어감)

    1) runtime chunk
    optimization _ 번들링 최적화 담당 (청크 단위로 쪼개는 것도 여기 해당)
    runtimeChunk를 runtime 이라는 이름으로 따로 떼어 보자.(plugin 아래 optimization 객체 참고)
    --->> dist 폴더 안에 
    main.aaa111.js
    runtime.bbb222.js 파일 별도 생성됨. 가운데 이름은 각 chunk 별 hash 값이므로 서로 다름
 
    2) vendor chunk
    jquery 설치 후 chunkhash 잘 조회되나 확인코자 함.
    npm i jquery -S
    index.js .... 설정파일에서 css 모듈을 사용하고 있기 때문에 css 모듈값을 통해 클래스 정보를 얻어야 DOM을 검색할 수 있다 (??????)
                  --> 템플릿 문자열로 console.log 작성하여 jquery 확인

    

     */
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
  //플러그인 반영 해 주면서 index.html 파일명을 template.html 로 이름 변경
  //실행하면, dist 폴더 안에 template.html 파일의 내용이 반영 된 index.html이라는 파일이 생성됨
  plugins: [
    new HTMLWebpackPlugin({
      title: "Webpack!",
      template: "./template.hbs",
      meta: {
        viewport: "width=device-width, initial-scale=1.0",
      },
      minify: {
        collapseWhitespace: true,
        useShortDoctype: true,
        removeScriptTypeAttributes: true,
      },
    }),
    //이 플러그인 넣어줌으로써 hash 들어간 번들js는 데이터가 수정되더라도 계속 한 파일로만 만들어 지게 됨
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[contenthash].css",
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorPluginOptions: {
        preset: ["default", { discardComments: { removeAll: true } }],
      },
      canPrint: true,
    }),
  ],
  optimization: {
    runtimeChunk: {
      name: "runtime",
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          //모든 chunk 들은 node_modules 폴더 안에 있는것들이라고 정의
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        //이렇게 옵션 적용하면 처리속도가 빨라짐(빌드 진행될때 파일 변화가 없으면 캐싱된 예전파일을 그대로 사용하여 빌드 시간을 줄여줌) but 작동안해서 주석처리
        // cache: true,
      }),
    ],
  },
  ///
  target: "node",
  mode: "none",
};
