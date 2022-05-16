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
} from "antd";
import { connect } from "react-redux";
import Echart from "../../components/echarts";
import { useRef, useCallback, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import ExportJsonExcel from "js-export-excel";

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
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
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
              message: `Please Input ${title}!`,
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

const Com = (props) => {
  const { keys, role } = props;
  const lineData = props.location.state?.lineData[0];
  const Userkeys = keys.split(",");
  const canfilter = Userkeys.indexOf("11") !== -1 || role === "admin";
  const canDelete = Userkeys.indexOf("12") !== -1 || role === "admin";
  const canEdit = Userkeys.indexOf("13") !== -1 || role === "admin";
  const canExport = Userkeys.indexOf("14") !== -1 || role === "admin";
  const canMap = Userkeys.indexOf("2") !== -1 || role === "admin";
  const { TabPane } = Tabs;
  const fileRef = useRef();
  const selectExcel = useCallback(() => {
    fileRef.current.input.click();
  }, []);
  const [form] = Form.useForm();
  const [proList, setProList] = useState();
  const [data, setData] = useState([]);
  // const [columns, setColumns] = useState([]);
  const [rowKey, setRowKey] = useState("");
  const [editingKey, setEditingKey] = useState("");
  const [update, setUpdate] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const isEditing = (record) => record.key === editingKey;

  const cancel = () => {
    setEditingKey("");
  };
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  useEffect(() => {
    console.log(lineData);
    if (lineData) {
      console.log(lineData);
      setFileName(lineData.fileName);
      // const keys = Object.keys(lineData.fileData[0]);
      console.log(Object.keys(lineData.fileData[0]));
      const header = Object.keys(lineData.fileData[0]);
      setHeaders(header);
      setRowKey("key");
      const data = header.map((el) => ({
        align: "center",
        title: el,
        dataIndex: el,
        editable: true,
        // width: 400,
      }));
      console.log(data);
      setData(data);
      console.log(lineData.fileData);
      setProList(lineData.fileData);
      setUpdate(true);

      // let headers = keys.filter((el) => {
      //   return el.length === 2 && el.indexOf(1) === 1;
      // });
    }
  }, [lineData]);
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...proList];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setProList(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setProList(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  // {
  //   align: "center",
  //   title: "图片",
  //   dataIndex: "img1",
  //   width: 400,
  //   render(text, record, index) {
  //     return <Image src={text} style={{ width: 80, height: 80 }} />;
  //   },
  // },
  // {
  //   align: "center",
  //   title: "价格",
  //   dataIndex: "originprice",
  //   sorter: (a, b) => a.originprice - b.originprice,
  // },

  const exportPro = (isPart) => {
    console.log(isPart, selectedRowKeys);
    console.log(update);
    if (!update) {
      message.error("您还未上传表格！请先导入数据");
      return;
    }
    let list = [];
    if (isPart) {
      console.log(proList);
      list = proList.filter((el) => {
        return selectedRowKeys.indexOf(el[rowKey]) !== -1;
      });
      console.log(list);
      if (list.length === 0) {
        message.error("您还未选中任何行数据");
        return false;
      }
    }

    var option = {};
    option.fileName = fileName;
    //配置表格内容
    option.datas = [
      {
        sheetData: list.length > 0 ? list : proList,
        sheetName: "sheet",
        sheetFilter: headers,
        sheetHeader: headers,
        // columnWidths: [20, 20],
      },
    ];

    var toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel(); //保存
  };

  // 上传文件
  const uploadFile = () => {
    const file = fileRef.current.input.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function () {
      const workbook = XLSX.read(this.result, { type: "binary" });
      //注意xlsx表格的工作表名称
      const t = workbook.Sheets["Sheet1"];
      let r = XLSX.utils.sheet_to_json(t);
      r = r.map((el, ind) => {
        return { key: ind, ...el };
      });
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
      const data = headers.map((el) => ({
        align: "center",
        title: el,
        dataIndex: el,
        editable: true,
        // width: 400,
      }));
      var cols = [
        {
          align: "center",
          title: "序号",
          width: 200,
          render: (text, record, index) => {
            return <span>{index + 1}</span>;
          },
        },
      ].concat(data);
      console.log(cols);
      setData(cols);
      setProList(r);
      setUpdate(true);
    };
  };
  const handleDelete = (key, isPartDelete) => {
    // const dataSource = [...this.state.dataSource];
    // this.setState({
    //   dataSource: dataSource.filter((item) => item.key !== key),
    // });
    if (isPartDelete) {
      const list = proList.filter((el) => {
        return selectedRowKeys.indexOf(el[rowKey]) === -1;
      });
      setProList(list);
      return;
    }
    setProList(proList.filter((item) => item.key !== key));
  };
  const columns = update
    ? canEdit || canDelete
      ? data.concat([
          {
            title: "操作",
            dataIndex: "operation",
            render: (_, record) => {
              const editable = isEditing(record);
              return editable ? (
                <span>
                  <Typography.Link
                    onClick={() => save(record.key)}
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
                  {canEdit && (
                    <Typography.Link
                      disabled={editingKey !== ""}
                      onClick={() => edit(record)}
                    >
                      编辑
                    </Typography.Link>
                  )}
                  {canDelete && (
                    <Popconfirm
                      title="确定要删除吗"
                      onConfirm={() => handleDelete(record.key)}
                    >
                      <a>删除</a>
                    </Popconfirm>
                  )}
                </Space>
              );
            },
          },
        ])
      : data
    : [];
  const callback = (e) => {
    console.log(e);
  };
  const mergedColumns = update
    ? columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record) => ({
            record,
            inputType: "text",
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        };
      })
    : [];
  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    // selectedRowKeys: ["北京大学"],
    onChange: onSelectChange,
  };
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row gutter={16}>
        <Col className="gutter-row" span={2}>
          <Button type="primary" onClick={selectExcel}>
            导入数据
          </Button>
        </Col>
        <Col className="gutter-row" span={2}>
          {canExport && (
            <Button
              onClick={() => {
                exportPro(false);
              }}
            >
              导出数据
            </Button>
          )}
        </Col>
        <Col className="gutter-row" span={2}>
          <Button type="primary" onClick={selectExcel}>
            管理员上传数据
          </Button>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={2}>
          {canExport && (
            <Button
              onClick={() => {
                exportPro(true);
              }}
            >
              导出选中数据
            </Button>
          )}
        </Col>
        <Col className="gutter-row" span={3}>
          {canDelete && (
            <Button
              danger
              onClick={() => {
                handleDelete(1, true);
              }}
            >
              删除选中数据
            </Button>
          )}
        </Col>
      </Row>
      <Input ref={fileRef} hidden type="file" onChange={uploadFile} />
      {update && (
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="表格" key="1">
            <Form form={form} component={false}>
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
            </Form>
          </TabPane>
          {canMap && (
            <TabPane tab="可视化" key="2">
              <Echart xdata={headers} data={proList}></Echart>
            </TabPane>
          )}
        </Tabs>
      )}
    </Space>
  );
};
export default connect((state) => ({
  isLogin: state.isLogin,
  keys: state.keys,
  role: state.role,
}))(Com);
