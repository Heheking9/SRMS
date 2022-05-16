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
  Row,
  Popconfirm,
  Col,
} from "antd";
import { useState, useCallback } from "react";
import { getAdminList, regFn, deleteAdmin, editAcess } from "./../../api/user";
import { useEffect } from "react";
import menus from "./acess";
const { Search } = Input;
const { Option } = Select;
const Com = () => {
  // 请求列表的数据
  const [adminList, setAdminList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [level, setLevel] = useState([]);
  const [lineName, setLineName] = useState("");
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
  const [editRole, setEditRole] = useState("");
  const [role, setRole] = useState("user");
  const [checkedKeys, setCheckedKeys] = useState([]);
  // 更新抽屉状态
  const onAddOpen = useCallback(() => {
    setAddVisible(true);
    setEditRole("user");
  }, []);
  const onAddClose = useCallback(() => {
    setAddVisible(false);
  }, []);
  const onCheck = useCallback((checkedKeys) => {
    // 参数为选中的树形参数数组
    setCheckedKeys(checkedKeys);
  }, []);

  const onSearch = (value) => {
    console.log(adminList);
    if (!value) {
      getAdminList().then((res) => {
        setAdminList(res.data.data);
      });
      return;
    }
    const list = adminList.filter((el) => {
      return el.adminname.indexOf(value) !== -1;
    });
    setAdminList(list);
  };
  const edit = (e) => {
    console.log(e);
    setIsEdit(true);
    setRole(e.role);
    if (e.role === "user") {
      setEditRole("user");
    } else {
      setEditRole("admin");
    }
    setAddVisible(true);
    console.log(level);
    console.log(e.level);
    setLevel(e.level);
    setLineName(e.adminname);
  };
  console.log(level);
  const addAdminFn = useCallback(
    (values) => {
      console.log(values);
      // 获取所有数据
      const data = {
        adminname,
        password,
        role,
        checkedKeys,
      };
      data.level = values.level;
      console.log(isEdit);
      if (isEdit) {
        data.adminname = lineName;
        console.log(data);
        editAcess(data).then((res) => {
          message.success("修改成功");
          setAdminname("");
          setPassword("");
          setRole("user");
          setCheckedKeys([]);
          // 抽屉消失
          setAddVisible(false);
          getAdminList().then((res) => {
            setAdminList(res.data.data);
          });
        });
        return;
      }
      regFn(data).then((res) => {
        console.log(res);
        if (res.data.status === 400) {
          message.error(res.data.message);
        } else {
          // 添加成功
          // 清空表单的数据，方便下次添加
          message.success("添加成功");
          setAdminname("");
          setPassword("");
          setRole("user");
          // 抽屉消失
          setAddVisible(false);
          //重新请求数据 刷新管理员列表
          getAdminList().then((res) => {
            setAdminList(res.data.data);
          });
        }
      });
    },
    [adminname, password, role, checkedKeys, isEdit]
  );
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
      title: "身份",
      dataIndex: "role",
      render(text) {
        return (
          <>
            {text === "admin" ? (
              <Tag color="green">管理员</Tag>
            ) : (
              <Tag>用户</Tag>
            )}
          </>
        );
      },
    },
    {
      title: "权限集",
      dataIndex: "level",
      render: (text, { role }) => {
        // console.log(text, e);
        // console.log(isAdmin);
        if (!text.length && role === "user") {
          return <Tag>无</Tag>;
        } else {
          return text.map((el, ind) => {
            return <Tag key={ind}>{el}</Tag>;
          });
        }
      },
      align: "center",
      width: "300px",
      editable: true,
    },
    {
      align: "center",
      title: "操作",
      render(text, record, index) {
        return (
          <Space>
            <Button
              type="ghost"
              onClick={() => {
                edit(record);
              }}
            >
              修改
            </Button>
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

  const children1 = [];
  for (let i = 10; i < 18; i++) {
    children1.push(
      <Option value={i.toString(36)} key={i.toString(36)}>
        {i.toString(36)}
      </Option>
    );
  }
  children1.push(
    <Option key="无" value="无">
      无
    </Option>
  );
  const handleChange = (value, opt) => {
    if (value.indexOf("0") !== -1) {
      value = "0";
    }
  };
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row gutter={16}>
        <Col span={6}>
          <Button type="primary" onClick={onAddOpen}>
            添加用户或管理员
          </Button>
        </Col>
        <Col span={8} offset={8}>
          <Search
            placeholder="搜索用户名"
            allowClear
            enterButton="搜索"
            onSearch={onSearch}
            style={{ width: 300 }}
          />
        </Col>
      </Row>

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
        title={isEdit ? "修改" : "添加用户或管理员"}
        placement="right"
        // 在失焦和点击关闭button时触发函数
        onClose={onAddClose}
        visible={addVisible}
      >
        <Form
          onFinish={addAdminFn}
          labelCol={{
            span: 4,
          }}
          initialValues={{
            level2: level.length > 0 ? level : "无",
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
        >
          {isEdit ? (
            <Form.Item name="adminname">
              <Input
                placeholder={isEdit ? lineName : "账号"}
                value={adminname}
                onChange={(e) => setAdminname(e.target.value)}
                disabled={isEdit}
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="adminname"
              rules={[
                {
                  required: true,
                  message: "请输入账号!",
                },
              ]}
            >
              <Input
                placeholder={isEdit ? lineName : "账号"}
                value={adminname}
                onChange={(e) => setAdminname(e.target.value)}
                disabled={isEdit}
              />
            </Form.Item>
          )}
          {/* <Form.Item
            name="adminname"
             rules={[
              {
                required: true,
                message: "请输入账号!",
              },
            ]}
          >
            <Input
              placeholder={isEdit ? lineName : "账号"}
              value={adminname}
              onChange={(e) => setAdminname(e.target.value)}
              disabled={isEdit}
            />
          </Form.Item> */}
          {!isEdit && (
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "请输入密码!",
                },
              ]}
            >
              <Input
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
          )}

          {/* 下拉 */}
          <Form.Item>
            <Select
              // defaultValue={"user"}
              value={role}
              onChange={(value) => {
                setRole(value);
                if (value === "admin") {
                  setEditRole("admin");
                } else {
                  setEditRole("user");
                }
              }}
            >
              <Select.Option value={"user"}>用户</Select.Option>
              <Select.Option value={"admin"}>管理员</Select.Option>
            </Select>
          </Form.Item>
          {editRole === "user" && (
            <>
              <Form.Item id="acessManage">权限集设置:</Form.Item>
              <Form.Item name="level">
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  onChange={handleChange}
                  tokenSeparators={[","]}
                  // value=""
                >
                  {children1}
                </Select>
              </Form.Item>
            </>
          )}

          {/* <Form.Item>
            <Tree
              checkable
              onCheck={onCheck}
              treeData={menus}
              // 可以设置初始值
              checkedKeys={checkedKeys}
            />
          </Form.Item> */}
          <Form.Item
            labelCol={{
              offset: 4,
              span: 4,
            }}
          >
            <Button type="primary" htmlType="submit">
              {isEdit ? "修改" : "添加"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </Space>
  );
};
export default Com;
