<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:35:49
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-12 09:05:46
-->
<template>
  <div class="page-js1">

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
      scene:null
    };
  },
  methods: {
    init() {
      const renderer = new THREE.WebGLRenderer(
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
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      // camera.position.set(10, 0, 0);
      camera.position.set(-0.3, 0, 0);
      //轨道控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener("change", render);
      controls.minDistance = 1;
      // controls.maxDistance = 200;
      controls.maxDistance = 2;
      controls.enablePan = false;

      // const geometry = new THREE.SphereGeometry(1, 10, 10);
      // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      // const mesh = new THREE.Mesh(geometry, material);
      const mesh = this.addImg("/api/r/2019/07/01/L3D137S8ENDIADDWAYUI5L7GLUF3P3WS888_3000x4000.jpg?x-oss-process=image/resize,m_fill,w_1600,h_920/format,webp", scene, 1);
      scene.add(mesh);

      controls.update();
      controls.target.copy(mesh.position);

      function render() {
        renderer.render(scene, camera);
      }

      function r() {
        render();
        requestAnimationFrame(r)
      }
      scene.add(new THREE.AxisHelper(1000));
      r()
    },
    addImg(url, scene) {
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
