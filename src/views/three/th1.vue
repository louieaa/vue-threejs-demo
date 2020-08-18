<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:35:49
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-13 14:55:05
-->
<template>
  <div class="page-th1">
    <h1>Creating a scene</h1>
    <h4>创建一个场景</h4>
    <div class="tool">
      <el-button plain @click="createdCube">添加立方体</el-button>
      <el-button type="primary" plain @click="animate">渲染场景</el-button>
      <el-button type="success" plain @click="cameraPosition('x')">摄像头x</el-button>
      <el-button type="info" plain @click="cameraPosition('y')">摄像头y</el-button>
      <el-button type="warning" plain @click="cameraPosition('z')">摄像头z</el-button>
      <el-button type="danger" plain>危险按钮</el-button>
    </div>
    <div class="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: "th1",
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
        fov:0 ,// 角度
        aspect:0, // 宽高比
        near:0, // 近面
        far:0 // 远面
      },
      // 创建体形
      geometry:null,
      material:null,
      cube:null,
      
    };
  },
  methods: {
    init(){
      this.scene = new THREE.Scene();
      this.cp={
        fov:75,// 角度
        aspect:this.inner.w/this.inner.h, // 宽高比
        near:0.1, // 近面
        far:1000 // 远面
      }
      this.camera = new THREE.PerspectiveCamera(this.cp.fov,this.cp.aspect,this.cp.near,this.cp.far);
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(this.inner.w,this.inner.h)
      document.querySelector('.container').appendChild(this.renderer.domElement)
    },
    animate() {
      requestAnimationFrame( this.animate );
      // console.log(this.cube.rotation)
      this.renderer.render( this.scene, this.camera );
    },
    cameraPosition(v){
      this.camera.position[v] += 5;
      console.log(this.camera.position,8888)
    },
    createdCube(){
      this.geometry = new THREE.BoxGeometry(1,1,1);
      this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      this.cube = new THREE.Mesh(this.geometry,this.material);
      this.scene.add(this.cube);
      this.camera.position.z = 5;
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
.tool{
  margin: 10px 0;
}
</style>
