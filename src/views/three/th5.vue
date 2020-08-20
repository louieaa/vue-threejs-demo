<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 09:38:40
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-20 14:05:34
-->
<template>
  <div class="page-th5">
    <h3>绘制几何</h3>
    <span>小项目，可以使用Geometry实现，中大型的项目，还是推荐BufferGeometry</span>
    <el-row class="tool">
      <el-button type="primary" @click="initBoxGeometry" round>BoxGeometry</el-button>
      <el-button type="success" @click="initCircleGeometry" round>CircleGeometry</el-button>
      <el-button type="info" @click="initCone" round>ConeGeometry</el-button>
      <el-button type="warning" @click="initCylinder" round>CylinderGeometry</el-button>
      <el-button type="danger" @click="initSphere" round>SphereGeometry</el-button>
      <el-button type="warning" @click="initTorus" round>TorusGeometry</el-button>
      <el-button type="danger" @click="initPlane" round>PlaneGeometry</el-button>
    </el-row>
    <div class="container"></div>
  </div>
</template>
 
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export default {
  name: 'th5',
  mixins: [],
  props: {
    prop: {
      type: String,
      default: '',
    }
  },
  components: {
  },
  filter: {
  },
  computed: {
  },
  data() {
    return {
      geo: null,
      bufferGeo: null,
      control:null,
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
        far:1000 // 远面
      },
      geometry:null,
      material:null,
      cube:null,
      mesh:null,
    };
  },
  watch: {
  },
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
    init(){
      this.initRenderer();
      this.initScene();
      this.initAxis();
      this.initCamera();
      this.initMesh();
      this.initControl();
      this.animate();
    },
    initMesh(){
      this.material = new THREE.MeshNormalMaterial();
      this.initBoxGeometry();
    },
     //创建圆环
    initTorus(){
      if (this.mesh) {
        this.scene.remove( this.mesh ); 
      }
      this.mesh = new THREE.Mesh(new THREE.TorusGeometry(10, 3, 16, 100), this.material);
      // this.mesh.position.set(35, -20, 0);
      this.scene.add(this.mesh);
    },
    //创建平面
    initPlane(){
      if (this.mesh) {
        this.scene.remove( this.mesh ); 
      }
      this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), this.material);
      // this.mesh.position.set(0, -20, 0);
      this.scene.add(this.mesh);
    },
    //创建球
    initSphere(){
      if (this.mesh) {
        this.scene.remove( this.mesh ); 
      }
      this.mesh = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), this.material);
      // sphere.position.set(-35, -20, 0);
      this.scene.add(this.mesh);
    },
    //创建圆柱
    initCylinder(){
       if (this.mesh) {
        this.scene.remove( this.mesh ); 
      }
      this.mesh = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 20, 32), this.material);
      // this.mesh.position.set(50, 20, 0);
      this.scene.add(this.mesh);
    },
     //创建圆锥
    initCone(){
      if (this.mesh) {
        this.scene.remove( this.mesh ); 
      }
      this.mesh = new THREE.Mesh(new THREE.ConeGeometry(5, 20, 32), this.material);
      // this.mesh.position.set(20, 20, 0);
      this.scene.add(this.mesh);
    },
    //创建圆
    initCircleGeometry(){
      if (this.mesh) {
        this.scene.remove( this.mesh ); 
      }
      this.mesh = new THREE.Mesh(new THREE.CircleGeometry(4, 16), this.material);
      // this.circle.position.set(-20, 20, 0);
      this.scene.add( this.mesh ); //将网格添加到场景
    },
    //创建立方体
    initBoxGeometry(){
      // BoxGeometry(width : 浮点类型, height : 浮点类型, depth : 浮点类型, widthSegments : 整数类型, heightSegments : 整数类型, depthSegments : 整数类型)
      // width — 沿x轴的宽度，默认值为1
      // height — 沿y轴的高度，默认值为1
      // depth — 沿z轴的深度，默认值为1
      // widthSegments — 可选，沿着边的宽度的分割面的数量。默认值为1
      // heightSegments — 可选，沿着边的高度的分割面的数量。默认值为1
      // depthSegments — 可选，沿着边的深度的分割面的数量。缺省值是1
      this.geometry = new THREE.BoxGeometry( 3, 6, 9); //创建几何体
      this.material= [];
      // 创建不同颜色的材质
      for(var i = 0;i<this.geometry.faces.length;i++){
        let material = new THREE.MeshBasicMaterial({ color: new THREE.Color(Math.random() * 0xffffff)});//创建材质
        this.material.push(material);
      }
      if (this.mesh) {
        this.scene.remove( this.mesh ); 
      }
      this.mesh = new THREE.Mesh( this.geometry, this.material ); //创建网格
      this.scene.add( this.mesh ); //将网格添加到场景
    },
    // Geometry2BufferGeometry(){
    //   this.bufferGeo = new THREE.BufferGeometry(3,6,9)
    //   //实例化一个Geometry对象
    //   this.geo = new THREE.Geometry(); 
    //   //调用对象的fromBufferGeometry方法，并将需要转换的bufferGeometry传入
    //   this.geo.fromBufferGeometry(this.bufferGeo);
    //   //geo为转换转换成的Geometry
    // },
    // BufferGeometry2Geometry(){
    //   this.geo = new THREE.Geometry(3,6,9)
    //   //实例化一个BufferGeometry对象
    //   this.bufferGeo = new THREE.BufferGeometry(); 
    //   //调用对象的fromGeometry方法，并将需要转换的geometry传入
    //   this.bufferGeo.fromGeometry(this.geo);
    //   //bufferGeo为geometry转换成的BufferGeometry
    // },
    initControl() {
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
    },
    initAxis(){
      var axis = new THREE.AxisHelper(3);
      this.scene.add(axis);
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
        near:1, // 近面
        far:1000 // 远面
      }
      this.camera = new THREE.PerspectiveCamera(this.cp.fov,this.cp.aspect,this.cp.near,this.cp.far); //实例化相机
      this.camera.position.set(1,1,100);
    },
    animate() {
      requestAnimationFrame(this.animate); //循环调用函数
      this.renderer.render(this.scene, this.camera ); //渲染界面
    },
  },
};
</script>
 
<style lang="scss">
 .tool{
  margin: 10px;
}
</style> 