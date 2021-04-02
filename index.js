import "normalize.css";
// import "./index.css";
import styles from "./index.css";
import $ from "jquery";

function component() {
  const element = document.createElement("div");
  element.innerHTML = "Hello Webpack!!, Why isnt this work????????";

  console.log(styles);

  //클래스 이름을 직접 자바스크립트에 적용 가능
  element.classList = styles.helloWebpack;

  return element;
}

document.body.appendChild(component());
console.log($(`.${styles.helloWebpack}`).length);
//vendor chunk 확인작업. webpack.config.js 파일의 optimization 객체에 splitChunks 추가(파일 참고)
