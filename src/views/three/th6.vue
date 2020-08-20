<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:35:49
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-20 14:05:54
-->
<template>
  <div class="page-th6">
    <h3>图片渲染成3d效果</h3>
    <div class="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: "js1",
  components: {},
  data() {
    return {
      scene:null, // 场景
      camera:null, // 相机
      renderer:null, // 渲染
      inner:{
        w:window.innerWidth - 300,
        h:window.innerHeight - 300
      },
      cp:{
        fov:50 ,// 角度 最小值为0，最大值为180，默认值为50，实际项目中一般都定义45
        aspect:0, // 宽高比
        near:1, // 近面
        far:100 // 远面
      },
      control:null,// 控制器
    };
  },
  methods: {
    init(){
      this.initRenderer();
      this.initScene();
      this.initCamera();
      this.initControl();
      this.initMesh();
      this.animate();
    },
     //初始化渲染器
    initRenderer() {
      //实例化渲染器
      this.renderer = new THREE.WebGLRenderer(
        {
          antialias: true, // true/false表示是否开启反锯齿
          alpha: true, // true/false 表示是否可以设置背景色透明
          precision: 'lowp', // highp/mediump/lowp 表示着色精度选择
          premultipliedAlpha: false, // true/false 表示是否可以设置像素深度（用来度量图像的分辨率）
          preserveDrawingBuffer: true, // true/false 表示是否保存绘图缓冲
          maxLights: 0, // 最大灯光数
          stencil: true // false/true 表示是否使用模板字体或图案
        }
      );
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.inner.w,this.inner.h); //设置宽和高
      document.querySelector('.container').appendChild(this.renderer.domElement);
    },
    //初始化场景
    initScene() {
        this.scene = new THREE.Scene(); //实例化场景
    },
    initControl() {
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
      this.control.addEventListener("change", this.render);
      this.control.minDistance = 1;
      this.control.maxDistance = 200;
      // this.control.maxDistance = 2;
      this.control.enablePan = false;
    },
    //初始化相机
    initCamera() {
      this.cp={
        fov:90,// 角度
        aspect:this.inner.w/this.inner.h, // 宽高比
        near:0.1, // 近面
        far:200 // 远面
      }
      this.camera = new THREE.PerspectiveCamera(this.cp.fov,this.cp.aspect,this.cp.near,this.cp.far); //实例化相机
      // this.camera.up.x=0 决定哪个面朝上
      // this.camera.up.y=0
      // this.camera.up.z=1
      this.camera.position.set(-0.3, 0, 0);
    },
    initMesh() {
      this.mesh = this.loadTextureImage("/api/r/2019/07/01/L3D137S8ENDIADDWAYUI5L7GLUF3P3WS888_3000x4000.jpg?x-oss-process=image/resize,m_fill,w_1600,h_920/format,webp", this.scene, 1);
      this.scene.add(this.mesh);
      
      this.control.update();
      this.control.target.copy(this.mesh.position);
      this.scene.add(new THREE.AxisHelper(1000));
    },
    animate() {
      this.render();
      requestAnimationFrame(this.animate)
    },
    render() {
        this.renderer.render(this.scene, this.camera);
    },
    loadTextureImage(url, scene) {
      const texture = THREE.ImageUtils.loadTexture(url);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      // const geometry = new THREE.SphereGeometry(1, 10, 10);
      const geometry = new THREE.SphereGeometry(50, 256, 256);
      const mesh = new THREE.Mesh(geometry, material);
      material.side = THREE.DoubleSide;
      scene.add(mesh);
      return mesh;
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss" scoped></style>
