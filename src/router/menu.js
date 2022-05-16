import { lazy } from "react";
import { HomeOutlined, PictureOutlined, MenuOutlined } from "@ant-design/icons";
const routes = [
  {
    key: "0-0",
    path: "/",
    title: "系统首页",
    icon: <HomeOutlined />,
    component: lazy(() => import("./../views/home/index.jsx")),
  },
  {
    key: "0-2",
    path: "/control",
    title: "管理员控制",
    icon: <HomeOutlined />,
    component: lazy(() => import("./../views/home/control.jsx")),
  },
  // {
  //   key: "0-1",
  //   path: "/banner",
  //   title: "轮播图管理",
  //   icon: <PictureOutlined />,
  //   redirect: "/banner/list",
  //   children: [
  //     {
  //       key: "0-1-0",
  //       path: "/banner/list",
  //       title: "轮播图列表",
  //       icon: <MenuOutlined />,
  //       component: lazy(() => import("./../views/banner/index.jsx")),
  //     },
  //     {
  //       key: "0-1-1",
  //       path: "/banner/add",
  //       title: "添加轮播图",
  //       icon: <MenuOutlined />,
  //       component: lazy(() => import("./../views/banner/Add.jsx")),
  //     },
  //   ],
  // },
  // {
  //   key: "0-2",
  //   path: "/pro",
  //   title: "产品管理",
  //   icon: <PictureOutlined />,
  //   redirect: "/pro/list",
  //   children: [
  //     {
  //       key: "0-2-0",
  //       path: "/pro/list",
  //       title: "产品列表",
  //       icon: <MenuOutlined />,
  //       component: lazy(() => import("./../views/pro/index.jsx")),
  //     },
  //     {
  //       key: "0-2-1",
  //       path: "/pro/seckill",
  //       title: "秒杀列表",
  //       icon: <MenuOutlined />,
  //       component: lazy(() => import("./../views/pro/Seckill.jsx")),
  //     },
  //     {
  //       key: "0-2-2",
  //       path: "/pro/recommend",
  //       title: "推荐列表",
  //       icon: <MenuOutlined />,
  //       component: lazy(() => import("./../views/pro/Recommend.jsx")),
  //     },
  //     {
  //       key: "0-2-3",
  //       path: "/pro/search",
  //       title: "筛选列表",
  //       icon: <MenuOutlined />,
  //       component: lazy(() => import("./../views/pro/Search.jsx")),
  //     },
  //   ],
  // },
  {
    key: "0-3",
    path: "/user",
    title: "账户管理",
    icon: <PictureOutlined />,
    component: lazy(() => import("./../views/user/Admin.jsx")),
    // redirect: "/user/list",
    // children: [
    //   {
    //     key: "0-3-0",
    //     path: "/user/list",
    //     title: "用户列表",
    //     icon: <MenuOutlined />,
    //     component: lazy(() => import("./../views/user/index.jsx")),
    //   },
    //   {
    //     key: "0-3-1",
    //     path: "/user/admin",
    //     title: "管理员列表",
    //     icon: <MenuOutlined />,
    //     component: lazy(() => import("./../views/user/Admin.jsx")),
    //   },
    // ],
  },
  {
    key: "0-4",
    path: "/setting",
    title: "用户设置",
    icon: <HomeOutlined />,
    component: lazy(() => import("./../views/user/edit.jsx")),
  },
];

export default routes;
