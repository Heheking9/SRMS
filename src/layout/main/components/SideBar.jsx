import React, { Component } from "react";
import { Layout, Menu } from "antd";
import { withRouter } from "react-router-dom";
import { getAdminDetail } from "../../../api/user";
import { connect } from "react-redux";
import logo from "../../../logo.svg";
import routes from "../../../router/menu";

const { Sider } = Layout;
const { SubMenu } = Menu;
const rootSubmenuKeys = [];
routes.forEach((item) => {
  if (item.children) {
    rootSubmenuKeys.push(item.path);
  }
});
@connect((state) => {
  return {
    collapsed: state.getIn(["app", "collapsed"]),
    adminname: state.getIn(["user", "adminname"]),
  };
})
@withRouter
class SideBar extends Component {
  // 2.展开的二级菜单的数据
  state = {
    openKeys: [],
    selectedKeys: [],
    Tree: [],
  };
  componentDidMount() {
    // 挂载时获取路径，利用路径传入菜单组件的openkeys和selectkeys
    const pathname = this.props.location.pathname;
    this.setState({
      openKeys: ["/" + pathname.split("/")[1]],
      selectedKeys: [pathname],
    });
    // getAdminDetail({
    //   adminname: this.props.adminname
    // }).then((_) => {
    //   this.setState({
    //     Tree: _.data.data[0].checkedKeys
    //   });
    // });
  }
  onOpenChange = (keys) => {
    // 遍历keys数组，找出第一个不在openKeys数组的元素
    const latestOpenKey = keys.find((key) => {
      return this.state.openKeys.indexOf(key) === -1;
    });
    // 如果路由中没有该元素
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      // 更新状态
      this.setState({
        openKeys: keys,
      });
    } else {
      // 只打开一个菜单
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };
  componentDidUpdate(prevProps) {
    // 点击面包屑时监听路由的变化，设计选中状态
    // 如果路由发生变化时，进行状态改变，注意在update钩子函数需要加if的限制条件，
    // 否则会进行死循环，因为setState事件会在此触发update
    if (prevProps.location.pathname !== this.props.location.pathname) {
      const pathname = this.props.location.pathname;
      this.setState({
        selectedKeys: [pathname],
      });
    }
  }
  // 3.渲染左侧菜单栏数据，注意return的书写
  // 参数为路由数组
  renderSideBar = (routes) => {
    // item为单个路由
    // 拷贝数组
    let arr = [...this.state.Tree];
    // 遍历加入父级menu
    arr.forEach((it) => {
      let itArr = it.split("-");
      for (let i = itArr.length; i > 2; i--) {
        itArr.pop();
        arr.push(itArr.join("-"));
      }
    });
    // 数组去重
    arr = Array.from(new Set(arr));
    if (this.props.adminname !== "admin") {
      return routes.map((item) => {
        // 如果存在子路由
        // 遍历arr为权限keys的数组，在该数组中查询是否存在route的key
        const index = arr.indexOf(item.key);
        // 若存在，进行menu的渲染，并删除权限数组的该项，不存在则不执行操作
        if (index !== -1) {
          arr.splice(index, 1);
          if (item.children) {
            return (
              <SubMenu key={item.path} icon={item.icon} title={item.title}>
                {/* 继续递归 */}
                {this.renderSideBar(item.children)}
              </SubMenu>
            );
          } else {
            // 不存在子路由
            return item.hidden ? null : (
              <Menu.Item key={item.path} icon={item.icon}>
                {item.title}
              </Menu.Item>
            );
          }
        }
        return null;
      });
    } else {
      return routes.map((item) => {
        if (item.children) {
          return (
            <SubMenu key={item.path} icon={item.icon} title={item.title}>
              {/* 继续递归 */}
              {this.renderSideBar(item.children)}
            </SubMenu>
          );
        } else {
          // 不存在子路由

          return item.hidden ? null : (
            <Menu.Item key={item.path} icon={item.icon}>
              {item.title}
            </Menu.Item>
          );
        }
      });
    }
  };
  changeUrl = ({ key }) => {
    this.setState({
      selectedKeys: [key],
    });
    this.props.history.push(key);
  };
  render() {
    return (
      <Sider trigger={null} collapsible collapsed={this.props.collapsed}>
        <div className="logo">
          <img
            src={logo}
            style={{ width: "32px", height: "32px", margin: "0 10px 0 0" }}
            alt=""
          />
          {this.props.collapsed ? null : <span>JD_ADMIN_PRO</span>}
        </div>
        <Menu
          onClick={this.changeUrl}
          theme="dark"
          mode="inline"
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
          selectedKeys={this.state.selectedKeys}
        >
          {
            // 3.调用递归函数渲染左侧的菜单栏
            this.renderSideBar(routes)
          }
        </Menu>
      </Sider>
    );
  }
}
export default SideBar;
