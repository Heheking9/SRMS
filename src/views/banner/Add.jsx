// src/views/banner/Add.jsx
import { Form, Button, Input, Upload } from "antd";
import { addBanner } from "./../../api/list";
import { UploadOutlined } from "@ant-design/icons";

const Com = (p) => {
  // Form.useForm 对表单数据域进行交互。
  // form可以看做useform Hooks的状态管理，
  // 当form的监听事件发生时，可以调用form的方法，获得或修改表单的数据
  const [form] = Form.useForm();
  // const [img, setImg] = useState();
  // 引用dom
  // 链接
  // // 描述
  // const altRef = useRef();
  // // 文件dom
  // const fileRef = useRef();
  // // 图片地址
  // const imgPutRef = useRef();
  // 缩略图
  // const imgRef = useRef();

  // const getFile = (e) => {
  //   // 拿到文件
  //   const file = e.target.files[0];
  //   // 实例一个文件读取器
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = function () {
  //     // 给缩略图的src传值
  //     console.log(this.result);
  //     setPath(this.result);
  //     // imgRef.current.src = this.result;
  //     // imgPutRef.current.value = this.result;
  //   };
  // };

  // const submitBanner = () => {
  //   console.log(alt);
  //   console.log(link);
  //   const data = {
  //     link,
  //     alt,
  //     img: path
  //   };
  //   addBanner(data).then((res) => {
  //     p.history.push("/banner/list");
  //   });
  // };
  const formItemLayout = {
    labelCol: {
      span: 4
    },
    wrapperCol: {
      span: 14
    }
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const buttonItemLayout = {
    wrapperCol: {
      span: 14,
      offset: 4
    }
  };
  const onFinish = (_) => {
    console.log(_);
    const data = {
      link: _.link,
      alt: _.alt,
      img: _.upload[0].thumbUrl
    };
    addBanner(data).then((res) => {
      p.history.push("/banner/list");
    });
  };
  return (
    <>
      <Form
        {...formItemLayout}
        layout="horizontal"
        form={form}
        onFinish={onFinish}
        initialValues={{
          layout: "horizontal"
        }}
      >
        <Form.Item label="链接" name="link">
          <Input />
        </Form.Item>
        <Form.Item label="描述" name="alt">
          <Input />
        </Form.Item>
        <Form.Item
          name="upload"
          label="上传"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="logo"
            action="/upload.do"
            listType="picture"
            onChange={(e) => {
              form.setFieldsValue({
                path: e.file.name
              });
            }}
          >
            <Button icon={<UploadOutlined />}>点击上传</Button>
          </Upload>
        </Form.Item>
        <Form.Item {...buttonItemLayout}>
          <Button type="primary" htmlType="submit">
            添加
          </Button>
        </Form.Item>
      </Form>
    </>
    // <div>
    //   <input type="text" ref={linkRef} name="link" placeholder="链接" /> <br />
    //   <br />
    //   <br />
    //   <input type="text" ref={imgPutRef} name="img" />
    //   <br />
    //   <img ref={imgRef} src="" alt="" />
    //   <br />
    //   <button onClick={submitBanner}>提交</button>
    // </div>
  );
};
export default Com;
