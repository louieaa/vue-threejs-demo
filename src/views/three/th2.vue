<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:35:49
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-20 14:04:32
-->
<template>
  <div class="page-th2">
    <h3>画线</h3>
    <div class="tool">
      <el-button plain @click="createdLineBasicMaterial1">添加线1条</el-button>
      <el-button type="danger" plain @click="createdLineBasicMaterial2">添加线2条</el-button>
    </div>
    <div class="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';

export default {
  name: "th2",
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
      geometry:null,
      material:null,
      line:null,
      
    };
  },
  methods: {
    init(){
      this.scene = new THREE.Scene();
      this.cp={
        fov:45,// 角度
        aspect:this.inner.w/this.inner.h, // 宽高比
        near:1, // 近面
        far:500 // 远面
      }
      this.camera = new THREE.PerspectiveCamera(this.cp.fov,this.cp.aspect,this.cp.near,this.cp.far);
      this.camera.position.set( 0, 0, 100 )
      this.camera.lookAt( 0, 0, 0 )
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(this.inner.w,this.inner.h)
      document.querySelector('.container').appendChild(this.renderer.domElement)
    },
    createdLineBasicMaterial1(){
       // 几何
      this.geometry = new THREE.Geometry();
      // 添加几何点
      this.geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
      this.geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
      this.createdLineBasicMaterial3(); 
    },
    createdLineBasicMaterial2(){
      // 几何
      this.geometry = new THREE.Geometry();
      // 添加几何点
      this.geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
      this.geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );
      this.createdLineBasicMaterial3();
    },
    createdLineBasicMaterial3(){
      // 定义线条材质
      this.material = new THREE.LineBasicMaterial( { color: 0xccaaff } );
        // 将加点和线条材质连起来形成线
      this.line = new THREE.Line( this.geometry, this.material );
      // 把线条添加到场景里面
      this.scene.add( this.line );
      // 渲染场景和摄像机
      this.renderer.render( this.scene, this.camera );
    },
    createdLineBasicMaterial() {
      // 定义线条材质
      this.material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
      // 几何
      this.geometry = new THREE.Geometry();
      // 添加三个几何点
      this.geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
      this.geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
      this.geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );
      // 将加点和线条材质连起来形成线
      this.line = new THREE.Line( this.geometry, this.material );
      // 把线条添加到场景里面
      this.scene.add( this.line );
      // 渲染场景和摄像机
      this.renderer.render( this.scene, this.camera );
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
