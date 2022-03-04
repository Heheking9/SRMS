import { Table, Space, Input, Button, Image } from "antd";
import { useRef, useCallback, useState } from "react";
import * as XLSX from "xlsx";
import ExportJsonExcel from "js-export-excel";
const Com = () => {
  const fileRef = useRef();
  const selectExcel = useCallback(() => {
    // console.log(fileRef.current)
    fileRef.current.input.click();
  }, []);

  const [proList, setProList] = useState();
  const columns = [
    {
      align: "center",
      title: "序号",
      width: 200,
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      }
    },
    {
      align: "center",
      title: "产品名称",
      dataIndex: "proname",
      width: 400
    },
    {
      align: "center",
      title: "图片",
      dataIndex: "img1",
      width: 400,
      render(text, record, index) {
        return <Image src={text} style={{ width: 80, height: 80 }} />;
      }
    },
    {
      align: "center",
      title: "价格",
      dataIndex: "originprice"
    }
  ];
  const exportPro = useCallback(() => {
    var option = {};
    option.fileName = "产品列表";
    //配置表格内容
    option.datas = [
      {
        sheetData: proList,
        sheetName: "sheet",
        sheetFilter: ["category", "proname", "img1", "originprice"],
        sheetHeader: ["序号", "产品名称", "图片", "价格"],
        columnWidths: [20, 20]
      }
    ];

    var toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel(); //保存
  }, [proList]);
  const uploadFile = () => {
    const file = fileRef.current.input.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    console.log(file);
    reader.onload = function () {
      const workbook = XLSX.read(this.result, { type: "binary" });
      //注意xlsx表格的工作表名称
      const t = workbook.Sheets["工作表1"];
      const r = XLSX.utils.sheet_to_json(t);
      setProList(r);
    };
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button type="primary" onClick={selectExcel}>
        导入数据
      </Button>
      <Button onClick={exportPro}>导出数据</Button>
      <Input ref={fileRef} hidden type="file" onChange={uploadFile} />
      <Table dataSource={proList} columns={columns} rowKey="proname"></Table>
    </Space>
  );
};
export default Com;
