<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-25 11:37:03
-->
<template>
  <div class="page-th10">
    <h3>Light光照</h3>
    <el-row class="tool">
      <el-button size="mini" type="primary" @click="initDirectionalLight" round>平行光</el-button>
      <el-button size="mini" type="success" @click="initHemisphereLight" round>户外光</el-button>
      <el-button size="mini" type="info" @click="initPointLight" round>点光源</el-button>
      <el-button size="mini" type="warning" @click="initSpotLight" round>聚光灯光源</el-button>
    </el-row>
    <div class="container"></div>
  </div>
</template>
 
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import threeMixins from "@/mixins/three";
import dl from "./directionalLight.mixins";
import hl from "./hemisphereLight.mixins";
import pl from "./pointLight.mixins";
import sl from "./spotLight.mixins";

export default {
  name: "th10",
  mixins: [threeMixins, dl, hl, pl,sl],
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
      ambientLight: null,
      directionalLight: null,
      debug: null,
      sphere: null, // 球体
      cube: null, //立方体
      plane: null, // 底部平面
      gui: null
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
  },
  destroyed() {},
  // life cycle end
  methods: {
    // clearAll() {
    //   if (this.sphere) {
    //     this.scene.remove(this.sphere);
    //   }

    //   if (this.cube) {
    //     this.scene.remove(this.cube);
    //   }

    //   if (this.plane) {
    //     this.scene.remove(this.plane);
    //   }

    //   if (this.datGui) {
    //     this.datGui.destroy();
    //   }

    //   if (this.ambientLight) {
    //     this.scene.remove(this.ambientLight);
    //   }
    // },
    init() {
      this.initRender();
      this.initCamera();
      this.initDirectionalLight();

      this.initControl();
      this.animate();
    },
    initControl() {
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
      this.control.target.set(0, 0.5, 0);
      this.control.update();
      this.control.enablePan = false;
      this.control.enableDamping = true;
    },
    //初始化渲染器
    initRender() {
      // alpha true透明背景
      this.renderer = new THREE.WebGLRenderer({ antialias: true }); //实例化渲染器
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.w, this.h); //设置宽和高
      //告诉渲染器需要阴影效果
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
      this.container = document.querySelector(".container");
      this.container.appendChild(this.renderer.domElement); //添加到dom
    },
    //初始化场景
    initScene() {
      this.scene = new THREE.Scene(); //实例化场景
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 0.4));
      if (this.datGui) {
        this.datGui.destroy();
      }
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