import React from "react";
import { Layout } from "antd";
import { SideBar, AppMain, AppHeader, AppBread } from "./components/index";
class App extends React.Component {
  state = {
    collapsed: false
  };

  render() {
    return (
      <Layout>
        <SideBar></SideBar>
        <Layout className="site-layout">
          <AppHeader></AppHeader>
          <AppBread></AppBread>
          <AppMain></AppMain>
        </Layout>
      </Layout>
    );
  }
}

export default App;
