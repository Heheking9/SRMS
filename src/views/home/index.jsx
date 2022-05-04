import {
  Table,
  Space,
  Input,
  Button,
  Image,
  Form,
  Typography,
  Popconfirm,
  InputNumber,
  message,
} from "antd";
import { useRef, useCallback, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import ExportJsonExcel from "js-export-excel";
import { set } from "immutable";

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

const Com = () => {
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

  const exportPro = useCallback(() => {
    if (!update) {
      message.error("您还未上传表格！请先导入数据");
      return;
    }
    var option = {};
    option.fileName = fileName;
    //配置表格内容
    option.datas = [
      {
        sheetData: proList,
        sheetName: "sheet",
        sheetFilter: headers,
        sheetHeader: headers,
        // columnWidths: [20, 20],
      },
    ];

    var toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel(); //保存
  }, [proList]);

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
      setData(cols);
      setData(data);
      setProList(r);
      setUpdate(true);
    };
  };
  const handleDelete = (key) => {
    // const dataSource = [...this.state.dataSource];
    console.log(proList, key);
    // this.setState({
    //   dataSource: dataSource.filter((item) => item.key !== key),
    // });
    setProList(proList.filter((item) => item.key !== key));
  };
  const columns = update
    ? data.concat([
        {
          title: "operation",
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
                  Save
                </Typography.Link>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <Space size="middle">
                <Typography.Link
                  disabled={editingKey !== ""}
                  onClick={() => edit(record)}
                >
                  Edit
                </Typography.Link>
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => handleDelete(record.key)}
                >
                  <a>Delete</a>
                </Popconfirm>{" "}
              </Space>
            );
          },
        },
      ])
    : [];
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
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button type="primary" onClick={selectExcel}>
        导入数据
      </Button>
      <Button onClick={exportPro}>导出数据</Button>
      <Input ref={fileRef} hidden type="file" onChange={uploadFile} />
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={proList}
          columns={mergedColumns}
          rowKey={rowKey}
        ></Table>
      </Form>
    </Space>
  );
};
export default Com;
