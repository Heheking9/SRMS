import { createStore, applyMiddleware } from "redux";
import { combineReducers } from "redux-immutable";
import thunk from "redux-thunk";
import app from "./module/app";
import user from "./module/user";
// 合并reducer函数
const reducer = combineReducers({
  app,
  user
});
// 创建store，集成中间件
const store = createStore(reducer, applyMiddleware(thunk));
export default store;
