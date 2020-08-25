"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _env = require("@/config/env");

/*
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:34:32
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-25 10:33:10
 */
var _default = [{
  name: "three",
  path: "/three",
  icon: "icon",
  component: (0, _env._import)("three/index"),
  meta: {},
  children: [{
    name: "th1",
    mate: {
      label: "创建一个立方体"
    },
    path: "/th1",
    component: (0, _env._import)("three/th1")
  }, {
    name: "th2",
    mate: {
      label: "画线"
    },
    path: "/th2",
    component: (0, _env._import)("three/th2")
  }, {
    name: "th3",
    mate: {
      label: "画3d文字"
    },
    path: "/th3",
    component: (0, _env._import)("three/th3")
  }, {
    name: "th4",
    mate: {
      label: "加载模型"
    },
    path: "/th4",
    component: (0, _env._import)("three/th4")
  }, {
    name: "th5",
    mate: {
      label: "绘制几何"
    },
    path: "/th5",
    component: (0, _env._import)("three/th5")
  }, {
    name: "th6",
    mate: {
      label: "2d图片渲染成3d效果"
    },
    path: "/th6",
    component: (0, _env._import)("three/th6")
  }, {
    name: "th7",
    mate: {
      label: "绘制多彩的立方体"
    },
    path: "/th7",
    component: (0, _env._import)("three/th7")
  }, {
    name: "th8",
    mate: {
      label: "绘制街景动画"
    },
    path: "/th8",
    component: (0, _env._import)("three/th8")
  }, {
    name: "th9",
    mate: {
      label: "Material材质"
    },
    path: "/th9",
    component: (0, _env._import)("three/th9")
  }, {
    name: "th10",
    mate: {
      label: "Light光照"
    },
    path: "/th10",
    component: (0, _env._import)("three/th10/index")
  }]
}];
exports["default"] = _default;