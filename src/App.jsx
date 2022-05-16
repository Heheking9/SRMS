import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { connect } from "react-redux";
// layou 为布局框架
import Main from "./layout/main/index";
// view 为视图组件
import Login from "./views/login/index";
const App = ({ isLogin }) => {
  return (
    <Router>
      <Switch>
        <Route path="/login" exact component={Login} />
        {/* 判断登录状态，再显示下方路由*/}
        {isLogin ? (
          <Route path="/" component={Main} />
        ) : (
          <Redirect to="/login" />
        )}
      </Switch>
    </Router>
  );
};

export default connect((state) => ({
  isLogin: state.isLogin,
}))(App);
