import {
  Table,
  Space,
  Input,
  Button,
  Image,
  Form,
  Typography,
  Col,
  Popconfirm,
  Row,
  Tabs,
  InputNumber,
  message,
  Select,
  Divider,
  Tag,
} from "antd";
// import { history } from "react-router";
import {
  upload,
  getAdminData,
  deleteData,
  updateData,
  getLineData,
} from "./../../api/user";
import Com from "./index";
import { connect } from "react-redux";
import Echart from "../../components/echarts";
import { useRef, useCallback, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import ExportJsonExcel from "js-export-excel";
const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;

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
let index = 0;
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

const Control = (props) => {
  console.log(props);

  const fileRef = useRef();
  const { keys, role, history } = props;
  const [fileName, setFileName] = useState("");
  const [rowKey, setRowKey] = useState("");

  const [update, setUpdate] = useState(false);
  const [proList, setProList] = useState();
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [tabChange, setTabChange] = useState("");
  const [zero, setZero] = useState("");
  const [form] = Form.useForm();
  const selectExcel = useCallback(() => {
    fileRef.current.input.click();
  }, []);
  const isEditing = (record) => record.creatTime === editingKey;

  const callback = (e) => {
    setTabChange(e);
    // if(e.)
  };
  const handleChange = (value, opt) => {
    if (value.indexOf("0") !== -1) {
      value = "0";
    }
  };
  useEffect(() => {
    const adminname = localStorage.getItem("adminname");
    const role = localStorage.getItem("role");
    // if(role === 'admin'){
    //   column
    // }
    getAdminData({ adminname }).then((res) => {
      console.log(res.data.data);
      setData(res.data.data);
    });
    console.log(123);
  }, [tabChange]);
  const uploadFile = () => {
    const file = fileRef.current.input.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function () {
      const workbook = XLSX.read(this.result, { type: "binary" });
      //注意xlsx表格的工作表名称
      const t = workbook.Sheets["Sheet1"];
      let r = XLSX.utils.sheet_to_json(t);
      // r = r.map((el, ind) => {
      //   return { key: ind, ...el };
      // });
      console.log(file, t, r);
      setFileName(file.name.split(".")[0]);
      const keys = Object.keys(t);
      // for (const key of heanders) {
      //     const element = t[key];
      // }
      let headers = keys.filter((el) => {
        return el.length === 2 && el.indexOf(1) === 1;
      });
      headers = headers.map((el) => t[el].w);
      setHeaders(headers);

      setRowKey(t.A1.w);
      // const data = headers.map((el) => ({
      //   align: "center",
      //   title: el,
      //   dataIndex: el,
      //   editable: true,
      //   // width: 400,
      // }));
      // var cols = [
      //   {
      //     align: "center",
      //     title: "序号",
      //     width: 200,
      //     render: (text, record, index) => {
      //       return <span>{index + 1}</span>;
      //     },
      //   },
      // ].concat(data);
      // console.log(cols);
      // setData(cols);
      setProList(r);
      setUpdate(true);
    };
  };
  const onFinish = (values) => {
    // p.editAction(values);
    if (!values.fileName) values.fileName = fileName;
    console.log(values);
    console.log(123123);
    values.fileData = proList;
    values.author = localStorage.getItem("adminname");
    upload(values).then((res) => {
      console.log(res);
      message.success(res.data.msg);
      setUpdate(false);
    });
  };
  const handleDelete = (creatTime, isPartDelete) => {
    // const dataSource = [...this.state.dataSource];
    // this.setState({
    //   dataSource: dataSource.filter((item) => item.key !== key),
    // });
    // if (isPartDelete) {
    //   const list = proList.filter((el) => {
    //     return selectedRowKeys.indexOf(el[rowKey]) === -1;
    //   });
    //   setProList(list);
    //   return;
    // }
    deleteData({ creatTime }).then((res) => {
      console.log(res);
    });
    setData(data.filter((item) => item.creatTime !== creatTime));
  };
  const columns =
    role === "admin"
      ? [
          {
            title: "文件名",
            dataIndex: "fileName",
            key: "createTime",
            align: "center",
            width: "300px",
            editable: true,
            render: (text) => <span>{text}</span>,
          },
          {
            title: "上传者",
            dataIndex: "author",
            align: "center",
            width: "200px",
            render: (text) => <span>{text}</span>,
          },
          {
            title: "文件权限等级",
            dataIndex: "level",
            render: (text) => {
              if (!text) {
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
            title: "创建时间",
            dataIndex: "creatTime",
            width: "300px",
            align: "center",
            render: (text) => <span>{text}</span>,
          },
          {
            title: "操作",
            dataIndex: "operation",
            width: "300px",
            render: (_, record) => {
              const editable = isEditing(record);
              return editable ? (
                <span>
                  <Typography.Link
                    onClick={() => save(record.creatTime)}
                    style={{
                      marginRight: 8,
                    }}
                  >
                    保存
                  </Typography.Link>
                  <Popconfirm title="确定要取消吗?" onConfirm={cancel}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <Space size="middle">
                  <Typography.Link
                    disabled={editingKey !== ""}
                    onClick={() => edit(record)}
                  >
                    编辑
                  </Typography.Link>

                  <Popconfirm
                    title="确定要删除吗"
                    onConfirm={() => handleDelete(record.creatTime)}
                  >
                    <a>删除</a>
                  </Popconfirm>
                  <Typography.Link onClick={() => look(record)}>
                    查看
                  </Typography.Link>
                </Space>
              );
            },
          },
        ]
      : [
          {
            title: "文件名",
            dataIndex: "fileName",
            key: "createTime",
            align: "center",
            width: "350px",
            editable: true,
            render: (text) => <span>{text}</span>,
          },
          {
            title: "上传者",
            dataIndex: "author",
            align: "center",
            width: "250px",
            render: (text) => <span>{text}</span>,
          },
          {
            title: "创建时间",
            dataIndex: "creatTime",
            width: "350px",
            align: "center",
            render: (text) => <span>{text}</span>,
          },
          {
            title: "操作",
            dataIndex: "operation",
            width: "350px",
            render: (_, record) => {
              const editable = isEditing(record);
              return editable ? (
                <span>
                  <Typography.Link
                    onClick={() => save(record.creatTime)}
                    style={{
                      marginRight: 8,
                    }}
                  >
                    保存
                  </Typography.Link>
                  <Popconfirm title="确定要取消吗?" onConfirm={cancel}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : record.author === localStorage.getItem("adminname") ? (
                <Space size="middle">
                  <Typography.Link
                    disabled={editingKey !== ""}
                    onClick={() => edit(record)}
                  >
                    编辑
                  </Typography.Link>

                  <Popconfirm
                    title="确定要删除吗"
                    onConfirm={() => handleDelete(record.creatTime)}
                  >
                    <a>删除</a>
                  </Popconfirm>
                  <Typography.Link onClick={() => look(record)}>
                    查看
                  </Typography.Link>
                </Space>
              ) : (
                <Space size="middle">
                  <Typography.Link onClick={() => look(record)}>
                    查看
                  </Typography.Link>
                </Space>
              );
            },
          },
        ];

  const [items, setItems] = useState(["jack", "lucy"]);
  const [name, setName] = useState("");

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName("");
  };
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "level" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode =
      inputType === "number" ? (
        <Select
          mode="tags"
          style={{ width: "100%" }}
          onChange={handleChange}
          tokenSeparators={[","]}
          // value=""
        >
          {children1}
        </Select>
      ) : (
        <Input />
      );
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `请填写 ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const cancel = () => {
    setEditingKey("");
  };
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    console.log(record.creatTime);
    setEditingKey(record.creatTime);
  };
  const look = (record) => {
    console.log(record);
    const { creatTime } = record;
    console.log(creatTime);
    getLineData({ creatTime }).then((res) => {
      console.log(res);
      history.push({ pathname: "/", state: { lineData: res.data.data } });
    });
  };
  const onSearch = (value) => {
    console.log(data);
    if (!value) {
      getAdminData().then((res) => {
        console.log(res);
        setData(res.data.data);
      });
      return;
    }
    const list = data.filter((el) => {
      return (
        el.fileName.indexOf(value) !== -1 || el.author.indexOf(value) !== -1
      );
    });
    setData(list);
  };
  const save = async (creatTime) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => creatTime === item.creatTime);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }

      console.log(123123, newData);
      updateData(newData).then((res) => {
        console.log(res);
      });
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  return (
    <Tabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab="上传文件" key="1">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row gutter={16}>
            <Col className="gutter-row" span={2}>
              <Button type="primary" onClick={selectExcel}>
                上传数据
              </Button>
            </Col>
          </Row>
          {update && (
            <Form
              {...formItemLayout}
              form={form}
              name="register"
              onFinish={onFinish}
              id="userEdit"
            >
              <Form.Item name="fileName" label="当前文件名称">
                <Input placeholder={fileName} />
              </Form.Item>
              <Form.Item name="level" label="文件权限等级">
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  onChange={handleChange}
                  tokenSeparators={[","]}
                  defaultValue="无"
                  // value=""
                >
                  {children1}
                </Select>
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  确认上传
                </Button>
              </Form.Item>
            </Form>
          )}

          <Input ref={fileRef} hidden type="file" onChange={uploadFile} />
          {/* <Form form={form} component={false}>
              <Table
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                rowSelection={rowSelection}
                dataSource={proList}
                columns={mergedColumns}
                rowKey={rowKey}
              ></Table>
            </Form> */}
        </Space>
      </TabPane>
      <TabPane tab="已上传数据" key="2">
        <Search
          placeholder="搜索文件名或上传者"
          allowClear
          enterButton="搜索"
          onSearch={onSearch}
          style={{ width: 300 }}
        />
        <Form component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            columns={mergedColumns}
            dataSource={data}
            rowKey="creatTime"
            pagination={{ pageSize: 8 }}
          />
        </Form>
      </TabPane>
    </Tabs>
  );
};
export default connect((state) => ({
  isLogin: state.isLogin,
  keys: state.keys,
  role: state.role,
}))(Control);
