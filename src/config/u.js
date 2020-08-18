const _imp_ = f => "@/routes/" + f + ".js";
import { reducer } from "./reducer";
/**
 * 图片下载
 * @export
 * @param {String} imgsrc 图片地址
 * @param {String} name 图片名
 */
export function downloadIamge(imgsrc, name) {
  let image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute("crossOrigin", "anonymous");
  image.onload = function() {
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    let url = canvas.toDataURL("image/png"); // 得到图片的base64编码数据
    let a = document.createElement("a"); // 生成一个a元素
    let event = new MouseEvent("click"); // 创建一个单击事件
    a.download = name || "photo"; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
  image.src = imgsrc;
}
/**
 * 图片下载(base64)
 * @export
 * @param {String} img 图片base64
 * @param {String} name 图片名
 */
export function dowBase64Image(img, name) {
  let a = document.createElement("a"); // 生成一个a元素
  let event = new MouseEvent("click"); // 创建一个单击事件
  a.download = name || "photo"; // 设置图片名称
  a.href = img; // 图片base64设置为a.href属性
  a.dispatchEvent(event); // 触发a的单击事件
}

export const createStore = () => {
  let currentState = {}; // 公共状态
  let observers = []; //观察者队列
  function getState() {
    return currentState;
  } // getter
  function dispatch(action) {
    currentState = reducer(currentState, action);
    observers.forEach(fn => fn());
  } // setter
  function subscribe(fn) {
    observers.push(fn);
  } // 发布订阅
  dispatch({ type: "@@REDUX_INIT" }); //初始化store数据
  return { getState, dispatch, subscribe };
};

export function throttle(fn, interval = 500) {
  console.log(interval);
  // last:上一次触发回调的时间
  let last = +new Date();
  // 处理结果以函数返回（闭包）
  return function() {
    // 保留调用的this上下文
    let context = this;
    // 保留传入参数
    let args = arguments;
    // 记录本次触发回调时间
    let now = +new Date();
    //判断本次回调时间与上次回调时间的差值是否小于时间阀值
    if (now - last >= interval) {
      //时间差大于或等于时间阀值，执行回调
      last = now;
      fn.apply(context, args);
    }
  };
}

export function throttleB(fn, interval) {
  let timer;
  return function(...args) {
    // 如果有定时任务，就等待执行掉再处理
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      clearTimeout(timer);
      timer = null;
    }, interval);
  };
}
let _toString = Object.prototype.toString;
let typeMap = {
  array: "Array",
  object: "Object",
  function: "Function",
  string: "String",
  null: "Null",
  undefined: "Undefined",
  boolean: "Boolean",
  number: "Number"
  // symbol
};
let getType = item => {
  return _toString.call(item).slice(8, -1);
};
let isTypeOf = (item, type) => {
  return typeMap[type] && typeMap[type] === getType(item);
};

// 深拷贝
export function DFSdeepClone(obj, visitedArr = []) {
  let _obj = {};
  if (isTypeOf(obj, "array") || isTypeOf(obj, "object")) {
    let index = visitedArr.indexOf(obj);
    _obj = isTypeOf(obj, "array") ? [] : {};
    if (~index) {
      _obj = visitedArr[index];
      console.log(_obj, visitedArr, index, ~index, "1111");
    } else {
      visitedArr.push(obj);
      for (const item in obj) {
        _obj[item] = DFSdeepClone(obj[item], visitedArr);
      }
    }
  } else if (isTypeOf(obj, "function")) {
    _obj = eval("(" + obj.toString() + ")");
  } else {
    _obj = obj;
  }
  return _obj;
}

export function BFSdeepClone(obj) {
  let origin = [obj],
    copyObj = {},
    copy = [copyObj];
  // 去除环状数据
  let visitedQueue = [],
    visitedCopyQueue = [];
  while (origin.length > 0) {
    let items = origin.shift(),
      _obj = copy.shift();
    visitedQueue.push(items);
    if (isTypeOf(items, "object") || isTypeOf(items, "array")) {
      for (let item in items) {
        let val = items[item];
        if (isTypeOf(val, "object")) {
          let index = visitedQueue.indexOf(val);
          if (!~index) {
            _obj[item] = {};
            //下次while循环使用给空对象提供数据
            origin.push(val);
            // 推入引用对象
            copy.push(_obj[item]);
          } else {
            _obj[item] = visitedCopyQueue[index];
            visitedQueue.push(_obj);
          }
        } else if (isTypeOf(val, "array")) {
          // 数组类型在这里创建了一个空数组
          _obj[item] = [];
          origin.push(val);
          copy.push(_obj[item]);
        } else if (isTypeOf(val, "function")) {
          _obj[item] = eval("(" + val.toString() + ")");
        } else {
          _obj[item] = val;
        }
      }
      // 将已经处理过的对象数据推入数组 给环状数据使用
      visitedCopyQueue.push(_obj);
    } else if (isTypeOf(items, "function")) {
      copyObj = eval("(" + items.toString() + ")");
    } else {
      copyObj = obj;
    }
  }
  return copyObj;
}
export { _imp_ };
