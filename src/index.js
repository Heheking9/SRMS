import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { createStore } from "redux";
// import store from "./store";

const themeReducer = (state, action) => {
  if (!state)
    return {
      isLogin: localStorage.getItem("isLogin") === "true",
      // token
      token: localStorage.getItem("token") || "",
      // 用户名
      adminname: localStorage.getItem("adminname") || "",
      role: localStorage.getItem("role") || "",
      keys: localStorage.getItem("keys") || "",
    };
  console.log(action);

  switch (action.type) {
    case "CHANGE_LOGIN_STATE":
      console.log(action.payload);
      return { ...state, isLogin: action.payload };
    case "CHANGE_TOKEN":
      return state.set("token", action.payload);
    case "CHANGE_ADMIN_NAME":
      return { ...state, adminname: action.payload };
    case "CHANGE_ROLE":
      // return state.set("role", action.payload);
      return { ...state, role: action.payload };
    case "CHANGE_keys":
      console.log(action.payload);
      return { ...state, keys: action.payload };
    default:
      return state;
  }
};

const store = createStore(themeReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
reportWebVitals();
