/*
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:34:32
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-20 14:54:15
 */
import { _import } from "@/config/env";

export default [
  {
    name: "three",
    path: "/three",
    icon: "icon",
    component: _import("three/index"),
    meta: {},
    children: [
      {
        name: "th1",
        mate:{
          label: "创建一个立方体"
        },
        path: "/th1",
        component: _import("three/th1")
      },
      {
        name: "th2",
        mate:{
          label: "画线"
        },
        path: "/th2",
        component: _import("three/th2")
      },
      {
        name: "th3",
        mate:{
          label: "画3d文字"
        },
        path: "/th3",
        component: _import("three/th3")
      },
      {
        name: "th4",
        mate:{
          label: "加载模型"
        },
        path: "/th4",
        component: _import("three/th4")
      },
      {
        name: "th5",
        mate:{
          label: "绘制几何"
        },
        path: "/th5",
        component: _import("three/th5")
      },
      {
        name: "th6",
        mate:{
          label: "2d图片渲染成3d效果"
        },
        path: "/th6",
        component: _import("three/th6")
      },
      {
        name: "th7",
        mate:{
          label: "绘制多彩的立方体"
        },
        path: "/th7",
        component: _import("three/th7")
      }
    ]
  }
];
