// AppBreadcrumb.jsx
import React, { Component } from "react";
import routes from "../../../router/menu";
import { withRouter, Link } from "react-router-dom";
// 面包屑导航
// 1、根据当前路由拆分为当前路由和父级路由
// 2、建立路由字典的对象，路由对应title，当路由发生改变时，发生状态改变，渲染的title发生改变
// 3、link作为跳转，视图关键字用字典渲染
const breadcrumbNameMap = {};
function getData(routes) {
  // 将所有路由路径和title存入空对象中
  routes.forEach((item) => {
    //   存在子路由，进行递归
    if (item.children) {
      getData(item.children);
    }
    breadcrumbNameMap[item.path] = item.title;
  });
}
getData(routes);
// 装饰器，可以传入router相关的参数给组件中props
@withRouter
class AppBreadcrumb extends Component {
  state = {
    // 展示标题
    title: "/banner",
    subTitle: "/banner/add"
  };
  componentDidMount() {
    // 初次渲染
    const pathname = this.props.location.pathname;
    console.log(pathname);
    this.setState({
      title: "/" + pathname.split("/")[1],
      subTitle: pathname
    });
  }
  componentDidUpdate(prevprops) {
    // 监听路由的变化
    if (prevprops.location.pathname !== this.props.location.pathname) {
      const pathname = this.props.location.pathname;
      this.setState({
        title: "/" + pathname.split("/")[1],
        subTitle: pathname
      });
    }
  }
  render() {
    return (
      <div
        style={{
          margin: "10px 16px"
        }}
      >
        系统管理 /<Link to="/"> 系统首页 </Link>
        {this.state.title === this.state.subTitle ? (
          this.state.title === "/" ? null : (
            <>
              /
              <Link to={this.state.title}>
                &nbsp;{breadcrumbNameMap[this.state.title]} &nbsp;
              </Link>
            </>
          )
        ) : (
          <>
            /
            <Link to={this.state.title}>
              &nbsp;{breadcrumbNameMap[this.state.title]} &nbsp;
            </Link>
            /
            <Link to={this.state.subTitle}>
              &nbsp;{breadcrumbNameMap[this.state.subTitle]} &nbsp;
            </Link>
          </>
        )}
      </div>
    );
  }
}
export default AppBreadcrumb;
