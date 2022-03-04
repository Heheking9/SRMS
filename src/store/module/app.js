import { Map } from "immutable";
// 组件状态
const app = (
  // 设置组件的状态初始值
  state = Map({
    collapsed: localStorage.getItem("collapsed") === "true"
  }),
  action
) => {
  switch (action.type) {
    case "CHANGE_COLLAPSED":
      // 改变后存入localStorage
      localStorage.setItem("collapsed", !state.get("collapsed"));
      //   返回新状态
      return state.set("collapsed", !state.get("collapsed"));
    default:
      return state;
  }
};
export default app;
