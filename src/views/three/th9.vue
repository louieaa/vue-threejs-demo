<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-21 17:32:11
-->
<template>
  <div class="page-th9">
    <h3>Material材质</h3>
    <el-row class="tool">
      <el-button size="mini" type="primary" @click="initLineBasicMaterial" round>直线</el-button>
      <el-button size="mini" type="success" @click="initCurveLine" round>曲线</el-button>
      <el-button size="mini" type="info" @click="initTorusGeometry" round>圆环</el-button>
      <el-button size="mini" type="warning" @click="initPlaneGeometry" round>平面</el-button>
      <el-button size="mini" type="danger" @click="initSphereGeometry" round>球</el-button>
      <el-button size="mini" type="primary" @click="initCylinderGeometry" round>圆柱</el-button>
      <el-button size="mini" type="success" @click="initConeGeometry" round>圆锥</el-button>
      <el-button size="mini" type="info" @click="initCircleGeometry" round>圆</el-button>
      <el-button size="mini" type="warning" @click="initBox" round>立方体</el-button>
    </el-row>
    <div class="container"></div>
  </div>
</template>
 
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import threeMixins from "@/mixins/three";

export default {
  name: "th9",
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
      gap: 200, // 缺口
      line: null,
      curveLine: null
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
  beforeDestroy() {},
  destroyed() {},
  // life cycle end
  methods: {
    init() {
      this.initRenderer();
      this.initScene();
      this.initCamera();

      this.initControl();
      this.animate();
    },
    //创建圆环
    initTorusGeometry() {
      this.torus = new THREE.Mesh(
        new THREE.TorusGeometry(10, 3, 16, 100),
        new THREE.MeshPhongMaterial({ color: 0x00ffff })
      );
      this.torus.position.set(50, -20, 0);
      this.scene.add(this.torus);
    },
    //创建平面
    initPlaneGeometry() {
      this.plane = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 5),
        new THREE.MeshBasicMaterial({ color: 0x00ffff })
      );
      this.plane.position.set(20, -20, 0);
      this.scene.add(this.plane);
    },
    //创建球
    initSphereGeometry() {
      this.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(5, 32, 32),
        new THREE.MeshPhongMaterial({ color: 0x00ffff })
      );
      this.sphere.position.set(-20, -20, 0);
      this.scene.add(this.sphere);
    },
    //创建圆柱
    initCylinderGeometry() {
      this.cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(5, 5, 20, 32),
        new THREE.MeshPhongMaterial({ color: 0x00ffff })
      );
      this.cylinder.position.set(50, 20, 0);
      this.scene.add(this.cylinder);
    },
    //创建圆锥
    initConeGeometry() {
      this.cone = new THREE.Mesh(
        new THREE.ConeGeometry(5, 20, 32),
        new THREE.MeshPhongMaterial({ color: 0x00ffff })
      );
      this.cone.position.set(20, 20, 0);
      this.scene.add(this.cone);
    },
    //创建圆
    initCircleGeometry() {
      this.circle = new THREE.Mesh(
        new THREE.CircleGeometry(5, 32),
        new THREE.MeshNormalMaterial()
      );
      this.circle.position.set(-20, 20, 0);
      this.scene.add(this.circle);
    },
    //创建立方体
    initBox() {
      this.box = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshLambertMaterial({ color: 0x00ffff })
      );
      this.box.position.set(-50, 20, 0);
      this.scene.add(this.box);
    },
    //添加曲线
    initCurveLine() {
      var pointsArr = [
        new THREE.Vector3(-10, 0, -5),
        new THREE.Vector3(-5, 15, 5),
        new THREE.Vector3(20, 15, -5),
        new THREE.Vector3(10, 0, 5)
      ];
      //指定一些用于生成曲线线的三维顶点
      var curve = new THREE.CatmullRomCurve3(pointsArr);

      var points = curve.getPoints(50); //使用getPoints获取当前曲线分成50段后的所有顶点
      var curveGeometry = new THREE.BufferGeometry().setFromPoints(points); //使用顶点生成几何体

      var curveMaterial = new THREE.LineDashedMaterial({ color: 0xff0000 }); //创建一条红色的线材质

      // 使用THREE.Line创建线
      this.curveLine = new THREE.Line(curveGeometry, curveMaterial);
      this.curveLine.computeLineDistances(); //需要重新计算位置才能显示出虚线
      this.curveLine.position.set(-65, -30, 0);
      this.scene.add(this.curveLine);
    },
    //添加直线
    initLineBasicMaterial() {
      var pointsArr = [
        new THREE.Vector3(-10, 0, -5),
        new THREE.Vector3(-5, 15, 5),
        new THREE.Vector3(20, 15, -5),
        new THREE.Vector3(10, 0, 5)
      ];

      var lineGeometry = new THREE.Geometry(); //实例化几何体
      lineGeometry.setFromPoints(pointsArr); //使用当前点的属性配置几何体
      var lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
      this.line = new THREE.Line(lineGeometry, lineMaterial);
      this.line.position.set(0, 0, 0);
      this.scene.add(this.line);
    },
    initControl() {
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
      this.control.target.set(0, 0.5, 0);
      this.control.update();
      this.control.enablePan = false;
      this.control.enableDamping = true;
    },
    //初始化渲染器
    initRenderer() {
      // alpha true透明背景
      this.renderer = new THREE.WebGLRenderer({ alpha: true }); //实例化渲染器
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.w, this.h); //设置宽和高
      this.container = document.querySelector(".container");
      this.container.appendChild(this.renderer.domElement); //添加到dom
    },
    initLight() {
      var light = new THREE.DirectionalLight(0xffffff); //添加了一个白色的平行光
      light.position.set(20, 50, 50); //设置光的方向
      this.scene.add(light); //添加到场景
      //添加一个全局环境光
      this.scene.add(new THREE.AmbientLight(0x222222));
    },
    //初始化场景
    initScene() {
      this.scene = new THREE.Scene(); //实例化场景
      this.scene.background = new THREE.Color("rgba(230, 162, 61)");
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 0.4));
      this.initLight();
    },
    //初始化相机
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        this.cameraParams.fov,
        this.cameraParams.aspect,
        this.cameraParams.near,
        this.cameraParams.far
      ); //实例化相机
      this.camera.position.set(5, 2, 8);
    },
    animate() {
      requestAnimationFrame(this.animate); //循环调用函数
      this.control.update();
      this.renderer.render(this.scene, this.camera);
    }
  }
};
</script>
 
<style lang="scss">
.tool {
  margin: 10px;
}
</style> 