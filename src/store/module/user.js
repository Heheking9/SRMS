import { Map } from "immutable";
// 用户状态
const user = (
  // 设置用户的状态初始值
  state = {
    //   登录状态
    isLogin: localStorage.getItem("isLogin") === "true",
    // token
    token: localStorage.getItem("token") || "",
    // 用户名
    adminname: localStorage.getItem("adminname") || "",
    role: localStorage.getItem("role") || "",
    keys: [],
  },
  action
) => {
  switch (action.type) {
    case "CHANGE_LOGIN_STATE":
      console.log(action.payload);
      return { ...state, isLogin: action.payload };
    case "CHANGE_TOKEN":
      return state.set("token", action.payload);
    case "CHANGE_ADMIN_NAME":
      return state.set("adminname", action.payload);
    case "CHANGE_ROLE":
      return state.set("role", action.payload);
    case "CHANGE_keys":
      // console.log(action.payload);
      // console.log(state.set("keys", action.payload));
      // console.log(state.getIn("keys"));
      return state.set("keys", action.payload);
    default:
      return state;
  }
};

export default user;
