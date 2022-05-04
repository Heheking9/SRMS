import React, { Component, Suspense } from "react";
import { Layout, Spin } from "antd";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import routes from "../../../router/menu";
import NotMatch from "./../../../views/error/404.jsx";
import { getAdminDetail } from "../../../api/user";
import format from "../../../utils/formateTree";
const { Content } = Layout;

@connect((state) => {
  return {
    collapsed: state.getIn(["app", "collapsed"]),
    adminname: state.getIn(["user", "adminname"]),
  };
})
@withRouter
// Main组件：根据请求的url渲染对应路由的组件
class AppMain extends Component {
  state = {
    Tree: [],
  };
  componentDidMount() {
    console.log(this.props.adminname);
    // getAdminDetail({
    //   // 获取管理员信息
    //   adminname: this.props.adminname,
    // }).then((_) => {
    //   let Arr = format(_.data.data[0].checkedKeys);
    //   this.setState({
    //     Arr,
    //   });
    // });
  }
  renderRoute = (routes, name) => {
    // if (this.state.Arr) {
    if (this.props.adminname === "admin") {
      return routes.map((item) => {
        if (item.children) {
          return this.renderRoute(item.children);
        } else {
          // 若不存在子路由
          return (
            // 参数：key；精确查找（路径必须完全一致）；路由的路径；渲染的组件
            <Route
              key={item.path}
              exact
              path={item.path}
              component={item.component}
            />
          );
        }
      });
    } else {
      const copy = [...this.state.Arr];
      return routes.map((item) => {
        const index = copy.indexOf(item.key);
        if (index !== -1) {
          copy.splice(index, 1);
          // 如果存在子路由，返回递归的结果
          if (item.children) {
            return this.renderRoute(item.children);
          } else {
            // 若不存在子路由
            return (
              // 参数：key；精确查找（路径必须完全一致）；路由的路径；渲染的组件
              <Route
                key={item.path}
                exact
                path={item.path}
                component={item.component}
              />
            );
          }
        }
        return null;
      });
    }
    // }
  };
  checkPath = (route, path) => {
    return route.some((i) => {
      if (i.children) return this.checkPath(i.children, path);
      return i.path === path;
    });
  };

  redirectRoute = (routes) => {
    const redirectR = routes.filter((_) => _.redirect);
    return redirectR.map((_) => (
      <Redirect key={_.path} path={_.path} exact to={_.redirect} />
    ));
  };
  render() {
    return (
      <Content
        className="site-layout-background"
        style={{
          margin: "0 16px 24px 16px",
          padding: 24,
        }}
      >
        {/* 异步请求 */}
        {/* fallback 属性接受任何在组件加载过程中你想展示的 React 元素。
        你可以将 Suspense 组件置于懒加载组件之上的任何位置。
        你甚至可以用一个 Suspense 组件包裹多个懒加载组件。 */}
        <Suspense fallback={<Spin size="large" />}>
          {/* <Switch>将会开始寻找相匹配的<Route>。直到匹配到第一个，
          紧接着 <Switch>会停止继续匹配并且渲染匹配的路由 */}
          <Switch>
            {/* 函数返回数组，包含所有路由跳转，根据浏览器请求路径来渲染样式 */}
            {this.redirectRoute(routes)}
            {this.renderRoute(routes)}
            <Route path="*">
              {this.checkPath(routes, this.props.location.pathname) ? (
                <span>无权限</span>
              ) : (
                <NotMatch></NotMatch>
              )}
            </Route>
          </Switch>
        </Suspense>
      </Content>
    );
  }
}
export default AppMain;
