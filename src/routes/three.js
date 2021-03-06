/*
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:34:32
 * @LastEditors: loueibb
 * @LastEditTime: 2020-09-04 10:02:34
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
      },
      {
        name: "th8",
        mate:{
          label: "绘制街景动画"
        },
        path: "/th8",
        component: _import("three/th8")
      },
      {
        name: "th9",
        mate:{
          label: "Material材质"
        },
        path: "/th9",
        component: _import("three/th9")
      },
      {
        name: "th10",
        mate:{
          label: "Light光照"
        },
        path: "/th10",
        component: _import("three/th10/index")
      },
      {
        name: "th11",
        mate:{
          label: "Camera相机"
        },
        path: "/th11",
        component: _import("three/th11/index")
      },
      {
        name: "th12",
        mate:{
          label: "Sprite精灵和Points粒子"
        },
        path: "/th12",
        component: _import("three/th12/index")
      },
      {
        name: "th13",
        mate:{
          label: "controls控制器"
        },
        path: "/th13",
        component: _import("three/th13/index")
      },
      {
        name: "th14",
        mate:{
          label: "动画案例"
        },
        path: "/th14",
        component: _import("three/th14/index")
      },
      {
        name: "th15",
        mate:{
          label: "补间动画"
        },
        path: "/th15",
        component: _import("three/th15/index")
      },
      {
        name: "th16",
        mate:{
          label: "场景交互"
        },
        path: "/th16",
        component: _import("three/th16/main")
      }
    ]
  }
];
