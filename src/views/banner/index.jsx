import { Table, Image, Button, Space, Popconfirm } from "antd";
import { useState, useEffect } from "react";
import { getBannerList, deleteBanner } from "./../../api/list";
const Com = (props) => {
  // 给函数设置状态
  // 注意在调用set方法时，里边的参数格式必须与初始值一致
  const [bannerList, setBannerList] = useState([]);
  const [Page, setPage] = useState(1);
  // 设置异步
  useEffect(() => {
    getBannerList().then((res) => {
      // 改变状态
      setBannerList(res.data.data);
    });
  }, []);
  // 若有render ，则dataIndex的值作为key，它的value传递给text
  // 若只需要value值，不需要render
  const columns = [
    {
      title: "序号",
      render(text, record, index) {
        return <span>{(Page - 1) * 10 + index + 1}</span>;
      }
    },
    {
      title: "图片",
      dataIndex: "img",
      render(text, record, index) {
        return <Image src={text} width={100} />;
      }
    },
    {
      title: "链接",
      dataIndex: "link"
    },
    {
      title: "提示",
      dataIndex: "alt"
    },
    {
      title: "操作",
      render(text, record, index) {
        return (
          <Popconfirm
            title="确定删除吗?"
            onConfirm={(e) => {
              deleteBanner({ bannerid: record.bannerid }).then((res) => {
                console.log("删除成功");
                getBannerList().then((res) => {
                  setBannerList(res.data.data);
                });
              });
            }}
            onCancel={(e) => {}}
            okText="确定"
            cancelText="取消"
          >
            <Button danger>删除</Button>
          </Popconfirm>
        );
      }
    }
  ];
  // 设置分页器，当切换页面时，修改序列值
  const pagination = {
    onChange: function (e) {
      setPage(e);
    }
  };
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button
        type="primary"
        style={{ marginBottom: "10px" }}
        onClick={() => {
          props.history.push("/banner/add");
        }}
      >
        添加轮播图
      </Button>
      <Table
        dataSource={bannerList}
        columns={columns}
        rowKey="bannerid"
        pagination={pagination}
      />
    </Space>
  );
};
export default Com;
