/*
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:34:32
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-20 14:02:25
 */
import { _import } from "@/config/env";

export default [
  {
    name: "js",
    path: "/js",
    icon: "icon",
    component: _import("js/index"),
    meta: {},
    children: [
      {
        name: "js1",
        path: "/js1",
        component: _import("js/js1")
      }
    ]
  }
];
