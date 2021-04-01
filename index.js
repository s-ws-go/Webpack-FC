import "normalize.css";
// import "./index.css";
import styles from "./index.css";

function component() {
  const element = document.createElement("div");
  element.innerHTML = "Hello Webpack!";

  console.log(styles);

  //클래스 이름을 직접 자바스크립트에 적용 가능
  element.classList = styles.helloWebpack;

  return element;
}

document.body.appendChild(component());
