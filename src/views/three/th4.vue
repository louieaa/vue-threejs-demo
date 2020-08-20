<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-19 18:12:47
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-20 09:20:43
-->
<template>
  <div class="page-th4">
  <h1>Creating a CAR</h1>
    <h4>加载glt模型</h4>
    <el-row class="tool">
      <el-button type="primary" @click="initCarGltf" round>小车</el-button>
      <el-button type="success" @click="initWuGltf" round>小屋</el-button>
      <el-button type="info" round>信息按钮</el-button>
      <el-button type="warning" round>警告按钮</el-button>
      <el-button type="danger" round>危险按钮</el-button>
    </el-row>
    <div class="container"></div>
  </div>
</template>
 
<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: '',
  mixins: [],
  props: {
  },
  components: {
  },
  filter: {
  },
  computed: {
  },
  data() {
    return {
      control:null,
      loader: null,
      scene:null, // 场景
      camera:null, // 相机
      renderer:null, // 渲染
      inner:{
        w:window.innerWidth - 300,
        h:window.innerHeight - 300
      },
      ambientLight:null,
      directionalLight:null,
      gltfModel:null
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
      this.initCamera();
      this.initLight();
      this.initGLTFLoader();

      this.initControl();
      
      this.animate();
    },
    initControl() {
        this.control = new OrbitControls(this.camera, this.renderer.domElement);
    },
     //初始化渲染器
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({antialias: true}); //实例化渲染器
        this.renderer.setSize(this.inner.w,this.inner.h); //设置宽和高
        //告诉渲染器需要阴影效果
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
        document.querySelector('.container').appendChild(this.renderer.domElement); //添加到dom
    },
    initWuGltf(){
      if (this.gltfModel) {
        this.scene.remove(this.gltfModel);
      }
      this.loader = new GLTFLoader();
      this.loader.load('/loader/gltf/wu/scene.gltf',  (gltf) =>{
        gltf.scene.scale.set(.5,.5,.5);
        this.gltfModel = gltf.scene;
        this.scene.add(gltf.scene);
      });
    },
    initCarGltf(){
      if (this.gltfModel) {
        this.scene.remove(this.gltfModel);
      }
      this.loader = new GLTFLoader();
      this.loader.load('/loader/gltf/car/scene.gltf',  (gltf) =>{
        gltf.scene.scale.set(.03,.03,.03);
        this.gltfModel = gltf.scene;
        this.scene.add(gltf.scene);
      });
    },
    initGLTFLoader(){
       //底部平面
      var planeGeometry = new THREE.PlaneGeometry(100, 100);
      var planeMaterial = new THREE.MeshLambertMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.y = -.1;
      plane.receiveShadow = true; //可以接收阴影
      this.scene.add(plane);
      this.initWuGltf();
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
        far:1000 // 远面
      }
      this.camera = new THREE.PerspectiveCamera(this.cp.fov,this.cp.aspect,this.cp.near,this.cp.far);
      this.camera.position.set(0, 100, 200);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
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
    render() {
      this.control.update();
      this.renderer.render(this.scene, this.camera);
    },
    animate() {
         //更新控制器
        this.render();
        requestAnimationFrame(this.animate);
    },
  },
};
</script>
 
<style lang="scss" scop>
 .tool{
   margin-bottom: 10px;
 }
</style> 