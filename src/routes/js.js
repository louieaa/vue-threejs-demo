/*
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:34:32
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-13 11:03:38
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
      },{
        name: "js2",
        path: "/js2",
        component: _import("js/js2")
      }
    ]
  }
];
