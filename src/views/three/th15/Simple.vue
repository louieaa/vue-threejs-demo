<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-31 15:28:10
-->
<template>
  <div class="page-points">
    <div class="container"></div>
  </div>
</template>
 
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";
import threeMixins from "@/mixins/three";
// import { TWEEN } from './jsm/libs/tween.module.min.js';
import * as dat from "dat.gui";

export default {
  name: "Points",
  mixins: [threeMixins],
  props: {
    prop: {
      type: String,
      default: ""
    }
  },
  components: {},
  filter: {},
  computed: {},
  data() {
    return {
      gap: 250
    };
  },
  watch: {},
  // life cycle start
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.datGui.destroy();
    this.control.dispose();
  },
  destroyed() {},
  // life cycle end
  methods: {
    init() {
      this.initGui();
      this.initRender();
      this.initScene();
      this.initCamera();
      this.initLight();
      this.initModel();

      this.initStats();
      this.initControl();
      this.animate();
    },
    initControl() {
      this.control = new OrbitControls(
        this.camera,
        this.renderer.domElement
      );

      // 是否开启当前的控制器 默认值为true
      this.control.enabled = true;

      // 设置当前控制器的焦点 默认为原点位置
      this.control.target = new THREE.Vector3();

      // 控制器控制相机可移动的距离焦点的最远距离和最近距离 默认值是0到无限远的距离 此属性适用于透视相机 PerspectiveCamera
      this.control.minDistance = 0;
      this.control.maxDistance = Infinity;

      // 控制器控制相机可移动的距离焦点的最远距离和最近距离 默认值是0到无限远的距离 此属性适用于正交相机 OrthographicCamera
      this.control.minZoom = 0;
      this.control.maxZoom = Infinity;

      // 相机垂直方向移动的弧度，默认从顶部九十度到底部九十度 默认值是0和Math.PI
      this.control.minPolarAngle = 0; // 弧度
      this.control.maxPolarAngle = Math.PI; // 弧度

      // 当前相机水平位置下在焦点的z轴正方向可以偏转的弧度，默认无限旋转。
      // 如果不可以无限旋转，只能够从左方和右方旋转180度，可以设置成minAzimuthAngle = - Math.PI maxAzimuthAngle = Math.PI
      this.control.minAzimuthAngle = -Infinity; // 弧度
      this.control.maxAzimuthAngle = Infinity; // 弧度

      // 是否开启拖拽后的惯性（停止拖拽后，相机会慢慢停下来），如果开启了当前的属性，还需要在动画循环中调用相机的update()更新位置
      this.control.enableDamping = false;
      this.control.dampingFactor = 0.25; //设置当前的惯性的阻力，值越小阻力越小

      // 设置控制器是否缩放以及缩放速度
      this.control.enableZoom = true;
      this.control.zoomSpeed = 1.0;

      // 设置控制器是否可以旋转以及旋转速度
      this.control.enableRotate = true;
      this.control.rotateSpeed = 1.0;

      // 是否开启改变视角焦点中心以及移动视角中心的速度
      this.control.enablePan = true;
      this.control.panSpeed = 1.0;
      this.control.screenSpacePanning = false; // 移动相机位置焦点默认是修改x轴和z轴方向，如果将此值修改为true，焦点位置将修改x轴和y轴方向
      this.control.keyPanSpeed = 7.0; // 修改焦点位置移动的速度

      // 设置当前是否自动旋转
      this.control.autoRotate = false;
      this.control.autoRotateSpeed = 2.0; // 默认速度为30秒旋转一周的速度，一秒60帧的情况下

      // 是否开启键盘控制
      this.control.enableKeys = true;

      // 控制焦点的位置偏移的键盘按键 默认是上下左右键的 keyCode
      this.control.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

      // 控制相机控制器的鼠标按键设置 默认左键旋转，中键缩放，右键移动焦点位置
      this.control.mouseButtons = {
        LEFT: THREE.MOUSE.LEFT,
        MIDDLE: THREE.MOUSE.MIDDLE,
        RIGHT: THREE.MOUSE.RIGHT
      };
    },
    //初始化渲染器
    initRender() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(this.w, this.h);
      //告诉渲染器需要阴影效果
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
      this.container = document.querySelector(".container");
      this.container.appendChild(this.renderer.domElement); //添加到dom
    },
    initLight() {
      this.ambientLight = new THREE.AmbientLight("#111111");
      this.scene.add(this.ambientLight);

      this.directionalLight = new THREE.DirectionalLight("#ffffff");
      this.directionalLight.position.set(40, 60, 10);

      this.directionalLight.shadow.camera.near = 1; //产生阴影的最近距离
      this.directionalLight.shadow.camera.far = 400; //产生阴影的最远距离
      this.directionalLight.shadow.camera.left = -50; //产生阴影距离位置的最左边位置
      this.directionalLight.shadow.camera.right = 50; //最右边
      this.directionalLight.shadow.camera.top = 50; //最上边
      this.directionalLight.shadow.camera.bottom = -50; //最下面

      //这两个值决定生成阴影密度 默认512
      this.directionalLight.shadow.mapSize.height = 1024;
      this.directionalLight.shadow.mapSize.width = 1024;

      //告诉平行光需要开启阴影投射
      this.directionalLight.castShadow = true;

      this.scene.add(this.directionalLight);
    },
    initModel() {
      //底部平面
      let planeGeometry = new THREE.PlaneGeometry(100, 100);
      let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xaaaaaa,
        side: THREE.DoubleSide
      });
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.y = -5.1;
      plane.receiveShadow = true; //可以接收阴影
      this.scene.add(plane);

      //立方体
      let cubeGeometry = new THREE.CubeGeometry(10, 10, 10);
      let cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff });
      let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.x = -40;
      cube.position.z = -30;
      cube.castShadow = true; //开启阴影
      this.scene.add(cube);

      //设置tween
      let position = { x: -40, y: 0, z: -30 };

      this.tween = new TWEEN.Tween(position);

      //设置移动的目标和移动时间
      this.tween.to({ x: 40, y: 30, z: 30 }, 2000);

      //设置每次更新的回调，然后修改几何体的位置
      this.tween.onUpdate(function(pos) {
        cube.position.set(pos.x, pos.y, pos.z);
      });
    },
    //初始化场景
    initScene() {
      this.scene = new THREE.Scene(); //实例化场景
    },
    initStats() {
      this.stats = new Stats();
      this.stats.domElement.style.position = "absolute";
      this.stats.domElement.style.top = "0px";
      this.stats.domElement.style.left = this.gap / 2 + "px";
      this.container.appendChild(this.stats.dom);
    },
    initGui() {
      //声明一个保存需求修改的相关数据的对象
      this.gui = {
        start: () =>{
          this.tween.start();
        }
      };
      // add GUI controls
      this.datGui = new dat.GUI();
      //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
      this.datGui.add(this.gui, "start").name("开始动画");
    },
    //初始化相机
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        this.cameraParams.fov,
        this.cameraParams.aspect,
        this.cameraParams.near,
        this.cameraParams.far
      ); //实例化相机
      this.camera.position.set(0, 100, 200);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
    render() {
      //更新Tween
      TWEEN.update();
      this.control.update();
      this.renderer.render(this.scene, this.camera);
    },
    animate() {
      //更新控制器
      this.render();
      //更新性能插件
      this.stats.update();
      requestAnimationFrame(this.animate);
    }
  }
};
</script>
 
<style lang="scss">
.tool {
  margin: 10px;
}
</style> 