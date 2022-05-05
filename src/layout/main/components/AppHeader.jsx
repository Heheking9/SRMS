import React, { Component } from "react";
import { Layout, Avatar, Menu, Dropdown } from "antd";
import { Link } from "react-router-dom";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
const { Header } = Layout;
@connect(
  (state) => {
    //   传入store的collapd状态到组件中
    return {
      adminname: state.getIn(["user", "adminname"]),
      collapsed: state.getIn(["app", "collapsed"]),
    };
  },
  (dispatch) => {
    //   自定义dispatch函数，该函数可以传入组件中，用于改变store的状态
    return {
      changeCollapsed() {
        dispatch({
          type: "CHANGE_COLLAPSED",
        });
      },
    };
  }
)
class AppHeader extends Component {
  toggle = () => {
    this.props.changeCollapsed();
  };
  // 点击出现下拉菜单
  menu = (
    <Menu style={{ width: 100 }}>
      <Menu.Item>
        <Link to="/setting">设置</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>退出</Menu.Item>
    </Menu>
  );
  render() {
    return (
      <Header className="site-layout-background" style={{ padding: 0 }}>
        {React.createElement(
          this.props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: "trigger",
            onClick: this.toggle,
          }
        )}
        <div className="userSet">
          欢迎您:{this.props.adminname} &nbsp;&nbsp;&nbsp;&nbsp;
          <Dropdown overlay={this.menu} trigger={["click"]}>
            <Avatar size="small" icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>
    );
  }
}

export default AppHeader;
