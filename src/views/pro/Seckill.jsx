import { Table, Space, Image, Button, Switch } from "antd";
import { useState } from "react";
import { getProList, getCategoryList, updateFlag } from "../../api/list";
import { useEffect } from "react";

const Com = () => {
  // 分类数据
  const [cateList, setCateList] = useState([]);
  useEffect(() => {
    getCategoryList().then((res) => {
      console.log(res);
      const arr = [];
      res.data.data.forEach((item) => {
        arr.push({
          text: item,
          value: item
        });
      });
      setCateList(arr);
    });
  }, []);
  // 分页器
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 表格高度
  const [height, setHeight] = useState(0);
  useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  const [proList, setProList] = useState([]);
  useEffect(() => {
    getProList().then((res) => {
      setProList(res.data.data);
    });
  }, []);
  // 参数分别为当前行的值(与dataIndex绑定)，当前行数据，行索引
  // render一般用来获取参数渲染复杂样式
  const columns = [
    {
      align: "center",
      title: "序号",
      width: 60,
      fixed: "left",
      render: (text, record, index) => (
        <span>{(page - 1) * pageSize + index + 1}</span>
      )
    },
    {
      align: "center",
      title: "图片",
      width: 120,
      fixed: "left",
      dataIndex: "img1",
      render: (text, record, index) => (
        <Image src={text} style={{ width: 80, height: 80 }} />
      )
    },
    {
      align: "center",
      title: "名称",
      width: 200,
      fixed: "left",
      dataIndex: "proname"
    },
    {
      align: "center",
      title: "品牌",
      width: 110,
      dataIndex: "brand"
    },
    {
      align: "center",
      title: "分类",
      width: 110,
      // 用于渲染筛选框
      filters: cateList,
      onFilter: (value, record) => {
        return record.category === value;
      }, // 筛选核心
      dataIndex: "category"
    },
    {
      align: "center",
      title: "原价",
      sorter: (a, b) => a.originprice - b.originprice,
      width: 101,
      dataIndex: "originprice"
    },
    {
      align: "center",
      title: "折扣",
      sorter: (a, b) => a.discount - b.discount,
      width: 100,
      dataIndex: "discount"
    },
    {
      align: "center",
      title: "销量",
      sorter: (a, b) => a.sales - b.sales,
      width: 100,
      dataIndex: "sales"
    },

    {
      align: "center",
      title: "是否秒杀",
      width: 60,
      fixed: "right",
      dataIndex: "isseckill",
      render: (text, record, index) => {
        return (
          <Switch
            checked={text === 1}
            onChange={(checked) => {
              updateFlag({
                proid: record.proid,
                type: "isseckill",
                flag: checked
              }).then(() => {
                getProList().then((res) => {
                  setProList(res.data.data);
                });
              });
            }}
          />
        );
      }
    },

    {
      align: "center",
      title: "操作",
      width: 320,
      fixed: "right",
      render: (text, record, index) => (
        <Space>
          <Button>编辑</Button>｜<Button>删除</Button>
        </Space>
      )
    }
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Table
        dataSource={proList}
        columns={columns}
        rowKey="proid"
        scroll={{ x: false, y: height - 300 }}
        pagination={{
          position: ["bottomRight"],
          page,
          pageSize,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
          pageSizeOptions: ["5", "10", "15", "20"],
          // 输入页码直接跳转
          showQuickJumper: true,
          showTotal: (total) => <span>共有{total}条数据</span>
        }}
      ></Table>
    </Space>
  );
};
export default Com;
