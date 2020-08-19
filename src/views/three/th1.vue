<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:35:49
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-19 14:30:11
-->
<template>
  <div class="page-th1">
    <h1>Creating a cube</h1>
    <h4>创建一个立方体</h4>
    <div class="tool">
      <!-- <el-button plain @click="createdCube">添加立方体</el-button> -->
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
      mesh:null
      
    };
  },
  methods: {
    init(){
      this.initRenderer();
      this.initScene();
      this.initCamera();
      this.initMesh();
      this.animate();
    },
    cameraPosition(v){
      this.camera.position[v] += 5;
    },
     //初始化渲染器
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer(); //实例化渲染器
        this.renderer.setSize(this.inner.w,this.inner.h); //设置宽和高
        document.querySelector('.container').appendChild(this.renderer.domElement); //添加到dom
    },
    //初始化场景
    initScene() {
        this.scene = new THREE.Scene(); //实例化场景
    },
    //初始化相机
    initCamera() {
      this.cp={
        fov:45,// 角度
        aspect:this.inner.w/this.inner.h, // 宽高比
        near:0.1, // 近面
        far:200 // 远面
      }
      this.camera = new THREE.PerspectiveCamera(this.cp.fov,this.cp.aspect,this.cp.near,this.cp.far); //实例化相机
      this.camera.position.set(0, 0, 15);
    },
    //创建模型
    initMesh() {
        this.geometry = new THREE.BoxGeometry( 2, 2, 2 ); //创建几何体
        this.material= [];
        // 创建不同颜色的材质
        for(var i = 0;i<this.geometry.faces.length;i++){
          let material = new THREE.MeshBasicMaterial({ color: new THREE.Color(Math.random() * 0xffffff)});//创建材质
          this.material.push(material);
        }
        // 创建一个材质
        // this.material = new THREE.MeshBasicMaterial({ color: '#f60' });//创建材质
        // this.material = new THREE.MeshNormalMaterial(); //创建材质
        this.mesh = new THREE.Mesh( this.geometry, this.material ); //创建网格
        this.scene.add( this.mesh ); //将网格添加到场景
    },
    animate() {
        requestAnimationFrame(this.animate); //循环调用函数
        this.mesh.rotation.x += 0.01; //每帧网格模型的沿x轴旋转0.01弧度
        this.mesh.rotation.y += 0.02; //每帧网格模型的沿y轴旋转0.02弧度
        this.renderer.render(this. scene, this.camera ); //渲染界面
    },
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
