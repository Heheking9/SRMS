import React, { useEffect, useState } from "react";
import { editUser } from "./../../api/user";
import { connect } from "react-redux";
import { Form, Input, Button, message, Upload } from "antd";
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const getAdminname = () => {
  return localStorage.getItem("adminname");
};
const RegistrationForm = (p) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    p.editAction(values);
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: ["zhejiang", "hangzhou", "xihu"],
        prefix: "86",
      }}
      scrollToFirstError
      id="userEdit"
    >
      <Form.Item name="oldAdminName" label="当前用户名称">
        <Input disabled placeholder={getAdminname()} />
      </Form.Item>
      <Form.Item
        name="adminName"
        label="修改用户名称"
        rules={[
          {
            required: true,
            message: "Please input your adminName",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="修改密码"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="再次输入密码"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          修改
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect(
  () => ({}),
  (dispatch) => {
    return {
      editAction(values) {
        editUser({
          ...values,
          Oldadminname: localStorage.getItem("adminname"),
        }).then((res) => {
          console.log(res);
          if (res.data.status === 200) {
            message.success(res.data.message);
            localStorage.setItem("adminname", values.adminName);
            dispatch({
              type: "CHANGE_ADMIN_NAME",
              payload: res.data.adminName,
            });
            setTimeout(() => {
              // 登录成功之后跳转到系统首页
              window.location.href = "/";
            }, 1000);
          } else {
            message.error(res.data.message);
          }
        });
      },
    };
  }
)(RegistrationForm);
