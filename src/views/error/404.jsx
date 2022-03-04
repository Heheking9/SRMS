import "../../style/404.css";
import React from "react";
import img from "../../style/404.png";

class NotFound extends React.Component {
  render() {
    return (
      <div className="system">
        <img src={img} alt="404" />
        <div className="title">
          <h2>页面走丢了...</h2>
          <h4>远方的朋友你好！非常抱歉，您所请求的页面不存在！</h4>
          <h4>请仔细检查您输入的网址是否正确。</h4>
        </div>
      </div>
    );
  }
}

export default NotFound;
