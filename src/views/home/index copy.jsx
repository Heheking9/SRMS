// import Editor from "../../components/editor";

// const Com = () => {
//   return (
//     <div>
//       <Editor></Editor>
//     </div>
//   );
// };
// export default Com;

// 上传csv，txt文件
import React from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Papa from "papaparse"; // 解析文件插件 市面上使用较多的
import jschardet from "jschardet"; // 编码识别
import FileSaver from "file-saver";

export default class Csv extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadData: []
    };
  }
  // 检查编排
  checkEncoding = (base64Str) => {
    //这种方式得到的是一种二进制串
    const str = atob(base64Str.split(";base64,")[1]); // atob  方法 Window 对象 定义和用法 atob() 方法用于解码使用 base-64 编码的字符
    //要用二进制格式
    let encoding = jschardet.detect(str);
    encoding = encoding.encoding;
    // 有时候会识别错误
    if (encoding === "windows-1252") {
      encoding = "GB2312";
    }
    return encoding;
  };
  render() {
    const _this = this;
    const props = {
      beforeUpload: (file) => {
        const fReader = new FileReader();
        fReader.readAsDataURL(file); //  readAsDataURL 读取本地文件 得到的是一个base64值
        fReader.onload = function (evt) {
          // 读取文件成功
          const data = evt.target.result;
          // 获取文件的编码格式
          const encoding = _this.checkEncoding(data);
          // papaparse.js 用来解析转换成二维数组
          Papa.parse(file, {
            encoding: encoding,
            complete: function (results) {
              // UTF8 \r\n与\n混用时有可能会出问题
              const res = results.data;
              if (res[res.length - 1][0].replace(/\s/g, "").length === 0) {
                //去除最后的空行 有些解析数据尾部会多出空格
                res.pop();
              }
              // 当前res 就是二维数组的值 数据拿到了 那么在前端如何处理渲染 就根据需求再做进一步操作了
              _this.setState({ loadData: res });
            }
          });
        };
        return false;
      }
    };
    return (
      <>
        <Upload {...props}>
          <Button>
            <UploadOutlined /> 点击上传csv
          </Button>
        </Upload>
        <Button
          // 文件导出
          onClick={() => {
            //  需要导出的数据
            //  在excel中，\n转行，逗号转格
            let data = "哈哈,娃娃" + "\n" + "zyd,jds";
            // 类文件对象。它的数据可以按文本或二进制的格式进行读取
            let blob = new Blob(["\uFEFF" + data], {
              type: "text/plain;charset=utf-8"
            });
            // 设置文件后缀
            FileSaver.saveAs(blob, "List.txt");
          }}
        >
          导出
        </Button>
        {this.state.loadData}
      </>
    );
  }
}
