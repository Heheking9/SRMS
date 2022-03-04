import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { loginFn } from "./../../api/user";
const login = (p) => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    p.loginAction(values);
  };

  return (
    <div className="loginBox">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="adminname"
          rules={[
            {
              required: true,
              message: "请输入管理员账户!"
            }
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="管理员账户"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "请输入正确的密码!"
            }
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="密码"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登 录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default connect(
  // 传入自定义的属性，最外层必须为对象，这里传入空对象
  () => ({}),
  //  第二个函数，会传入组件的自定义的方法，并把store.dispatch设为参数，
  //   当dispatch执行时，会作为action，并修改store.state
  (dispatch) => {
    return {
      // 自定义函数，组件可以使用
      loginAction(params) {
        //   发送请求
        loginFn(params).then(({ data: { ...res } }) => {
          if (res.code === "10003") {
            message.error("密码错误");
          } else if (res.code === "10005") {
            message.error("该管理员账户不存在");
          } else {
            message.success("登录成功，即将跳转");
            // 保存状态到本地
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("adminname", res.data.adminname);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("isLogin", true);
            // 更新状态管理器
            dispatch({
              type: "CHANGE_ADMIN_NAME",
              payload: res.data.adminname
            });
            dispatch({ type: "CHANGE_TOKEN", payload: res.data.token });
            dispatch({ type: "CHANGE_ROLE", payload: res.data.role });
            dispatch({ type: "CHANGE_LOGIN_STATE", payload: "true" });
            setTimeout(() => {
              // 登录成功之后跳转到系统首页
              window.location.href = "/";
            }, 1000);
          }
        });
      }
    };
  }
)(login);
