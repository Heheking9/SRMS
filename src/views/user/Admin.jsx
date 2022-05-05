import {
  Table,
  Space,
  Button,
  Tag,
  Drawer,
  Form,
  Input,
  Select,
  Tree,
  message,
  Popconfirm,
} from "antd";
import { useState, useCallback } from "react";
import { getAdminList, addAdmin, deleteAdmin } from "./../../api/user";
import { useEffect } from "react";
import menus from "../../router/menu";
const Com = () => {
  // 请求列表的数据
  const [adminList, setAdminList] = useState([]);
  useEffect(() => {
    getAdminList().then((res) => {
      setAdminList(res.data.data);
    });
  }, []);
  const [page, setPage] = useState(1);
  // 添加管理员
  const [addVisible, setAddVisible] = useState(false);
  const [adminname, setAdminname] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(1);
  const [checkedKeys, setCheckedKeys] = useState(["0-0"]);
  // 更新抽屉状态
  const onAddOpen = useCallback(() => {
    setAddVisible(true);
  }, []);
  const onAddClose = useCallback(() => {
    setAddVisible(false);
  }, []);
  const onCheck = useCallback((checkedKeys) => {
    // 参数为选中的树形参数数组
    setCheckedKeys(checkedKeys);
  }, []);
  const addAdminFn = useCallback(() => {
    // 获取所有数据
    const data = {
      adminname,
      password,
      role,
      checkedKeys,
    };
    addAdmin(data).then((res) => {
      console.log(res);
      if (res.data.code === "10004") {
        message.error("该管理员已存在");
      } else {
        // 添加成功
        // 清空表单的数据，方便下次添加
        message.success("添加成功");
        setAdminname("");
        setPassword("");
        setRole(1);
        setCheckedKeys(["0-0"]);
        // 抽屉消失
        setAddVisible(false);
        //重新请求数据 刷新管理员列表
        getAdminList().then((res) => {
          setAdminList(res.data.data);
        });
      }
    });
  }, [adminname, password, role, checkedKeys]);
  const columns = [
    {
      align: "center",
      title: "序号",
      render(text, record, index) {
        return <span>{(page - 1) * 10 + index + 1}</span>;
      },
    },
    {
      align: "center",
      title: "账号",
      dataIndex: "adminname",
    },
    {
      align: "center",
      title: "权限",
      dataIndex: "role",
      render(text) {
        return (
          <>
            {text === 2 ? (
              <Tag color="green">超级管理员</Tag>
            ) : (
              <Tag>管理员</Tag>
            )}
          </>
        );
      },
    },
    {
      align: "center",
      title: "操作",
      render(text, record, index) {
        return (
          <Space>
            <Button type="ghost">编辑</Button>
            <Popconfirm
              cancelText="取消"
              okText="确认"
              title="确认删除吗?"
              onConfirm={() => {
                deleteAdmin({
                  adminname: record.adminname,
                }).then((res) => {
                  getAdminList().then((res) => {
                    setAdminList(res.data.data);
                  });
                });
              }}
              onCancel={() => {}}
            >
              <Button danger>删除</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button type="primary" onClick={onAddOpen}>
        添加管理员
      </Button>
      <Table
        dataSource={adminList}
        columns={columns}
        rowKey="_id"
        scroll={{ x: false, y: window.innerHeight - 340 }}
        pagination={{
          onChange: (_) => {
            setPage(_);
          },
        }}
      />
      {/* 抽屉 */}
      <Drawer
        width="500"
        title="添加管理员"
        placement="right"
        // 在失焦和点击关闭button时触发函数
        onClose={onAddClose}
        visible={addVisible}
      >
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
        >
          <Form.Item>
            <Input
              placeholder="管理员账户"
              value={adminname}
              onChange={(e) => setAdminname(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          {/* 下拉 */}
          <Form.Item>
            <Select
              defaultValue={1}
              value={role}
              onChange={(value) => setRole(value)}
            >
              <Select.Option value={1}>管理员</Select.Option>
              <Select.Option value={2}>超级管理员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Tree
              checkable
              onCheck={onCheck}
              treeData={menus}
              // 可以设置初始值
              // checkedKeys={checkedKeys}
            />
          </Form.Item>
          {checkedKeys}
          <Form.Item
            labelCol={{
              offset: 4,
              span: 4,
            }}
          >
            <Button type="primary" onClick={addAdminFn}>
              添加管理员
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </Space>
  );
};
export default Com;
