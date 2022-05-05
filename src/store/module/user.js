import { Map } from "immutable";
// 用户状态
const user = (
  // 设置用户的状态初始值
  state = Map({
    //   登录状态
    isLogin: localStorage.getItem("isLogin") === "true",
    // token
    token: localStorage.getItem("token") || "",
    // 用户名
    adminname: localStorage.getItem("adminname") || "",
    role: localStorage.getItem("role") || "",
  }),
  action
) => {
  switch (action.type) {
    case "CHANGE_LOGIN_STATE":
      return state.set("isLogin", action.payload);
    case "CHANGE_TOKEN":
      return state.set("token", action.payload);
    case "CHANGE_ADMIN_NAME":
      return state.set("adminname", action.payload);
    case "CHANGE_ROLE":
      return state.set("role", action.payload);
    default:
      return state;
  }
};

export default user;
