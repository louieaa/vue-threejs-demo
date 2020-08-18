/*
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:34:32
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-14 10:53:11
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
      }
    ]
  }
];
