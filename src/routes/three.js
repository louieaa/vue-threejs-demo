/*
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:34:32
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-20 09:05:04
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
        path: "/th1",
        component: _import("three/th1")
      },
      {
        name: "th2",
        path: "/th2",
        component: _import("three/th2")
      },
      {
        name: "th3",
        path: "/th3",
        component: _import("three/th3")
      },
      {
        name: "th4",
        path: "/th4",
        component: _import("three/th4")
      }
    ]
  }
];
