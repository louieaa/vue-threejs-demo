<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:35:49
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-28 11:06:21
-->
<template>
  <div class="page-th1">
    <h3>创建一个立方体</h3>
    <div class="tool">
      <el-button type="danger" plain>危险按钮</el-button>
    </div>
    <div class="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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
        fov:50 ,// 角度 最小值为0，最大值为180，默认值为50，实际项目中一般都定义45
        aspect:0, // 宽高比
        near:1, // 近面
        far:100 // 远面
      },
      // 创建体形
      geometry:null,
      material:null,
      cube:null,
      mesh:null,
      // 控制器
      controls:null,
      gui:null,
      cm:{
        ps:{
          x:0,
          y:0,
          z:15
        },
        la:{
          x:0,
          y:0,
          z:0
        },
        us:{
          x:0,
          y:0,
          z:0
        }
      }
      
    };
  },
  methods: {
    init(){
      this.initRender();
      this.initScene();
      this.initAxis();
      this.initCamera();
      this.initMesh();
      this.initGui();
      this.initControl();
      this.animate();
    },
    initControl() {
        this.control = new OrbitControls(this.camera, this.renderer.domElement);
        this.control.addEventListener('change', function(a){
        console.log("卧槽，666，动了动了，相机控制器动了！",a);
    });
    },
    initAxis(){
      var axis = new THREE.AxisHelper(3);
      this.scene.add(axis);
    },
    //初始化渲染器
    initRender() {
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
        far:200 // 远面
      }
      this.camera = new THREE.PerspectiveCamera(this.cp.fov,this.cp.aspect,this.cp.near,this.cp.far); //实例化相机
      // this.camera.up.x=0 决定哪个面朝上
      // this.camera.up.y=0
      // this.camera.up.z=1
      this.cameraPosition();
      // this.cameraUp();
      this.cameraLookAt();
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
    initGui() {
      this.controls = {
        positionX:0,
        positionY:0,
        positionZ:0
      };

      // add GUI controls
      this.gui = new dat.GUI();
      var f = this.gui.addFolder('Camera');
      f.add(this.cp, "fov").min(5).max(175).onChange(()=>{this.cameraP('fov')});
      f.add(this.cp, "near").min(-10).max(10).onChange(()=>{this.cameraP('near')});
      f.add(this.cp, "far").min(1).max(1000).onChange(()=>{this.cameraP('far')});
      
      f = this.gui.addFolder('Camera LookAt');
      f.add(this.cm.la, "x").min(-100).max(100).onChange(this.cameraLookAt);
      f.add(this.cm.la, "y").min(-100).max(100).onChange(this.cameraLookAt);
      f.add(this.cm.la, "z").min(-100).max(100).onChange(this.cameraLookAt);
      
      f = this.gui.addFolder('Camera Position');
      f.add(this.cm.ps, "x").min(-100).max(100).onChange(this.cameraPosition);
      f.add(this.cm.ps, "y").min(-100).max(100).onChange(this.cameraPosition);
      f.add(this.cm.ps, "z").min(-100).max(100).onChange(this.cameraPosition);
      f = this.gui.addFolder('Camera Up');
      f.add(this.cm.us, "x").min(-10).max(10).step(0.1).onChange(this.cameraUp);
      f.add(this.cm.us, "y").min(-10).max(10).step(0.1).onChange(this.cameraUp);
      f.add(this.cm.us, "z").min(-10).max(10).step(0.1).onChange(this.cameraUp);
      f.open();

      // f = this.gui.addFolder('Rendering');
      // f.add(this.cube.style, "drawmode", ["point", "wireframe", "solid"]);
      // f.add(this.cube.style, "shademode", ["plain", "lightsource"]);
      // f.add(this.cube.style, "fillmode", ["fill", "filltwice", "inflate", "fillstroke", "hiddenline"]);
      // f.open();

      f = this.gui.addFolder('Mesh Position');
      f.add(this.controls, "positionX", -10, 10).onChange(this.updatePosition);
      f.add(this.controls, "positionY", -10, 10).onChange(this.updatePosition);
      f.add(this.controls, "positionZ", -10, 10).onChange(this.updatePosition);


      // this.gui = new dat.GUI({ autoPlace: false });
      // this.gui.domElement.id = 'gui';
      // this.gui.add(this.controls, "positionX", -10, 10).onChange(this.updatePosition);
      // this.gui.add(this.controls, "positionY", -10, 10).onChange(this.updatePosition);
      // this.gui.add(this.controls, "positionZ", -10, 10).onChange(this.updatePosition);
    },
    fovFun(){
      this.cp.fov +=10
      console.log(this.cp.fov)
      this.camera.setFocalLength(this.cp.fov)
    },
    animate() {
        requestAnimationFrame(this.animate); //循环调用函数
        // this.mesh.rotation.x += 0.005; //每帧网格模型的沿x轴旋转0.005弧度
        // this.mesh.rotation.y += 0.015; //每帧网格模型的沿y轴旋转0.015弧度
        this.renderer.render(this.scene, this.camera ); //渲染界面
    },
    cameraPosition(){
       let {x,y,z}  = this.cm.ps
      this.camera.position.set(x,y,z);
    },
    cameraUp(){
        let {x,y,z} = this.cm.us
        // this.camera.up = new THREE.Vector3( x,y,z );
        this.camera.up.x = x
        this.camera.up.y = y
        this.camera.up.z = z
        console.log(this.camera.up)
    },
    cameraLookAt(){
      // 相机对象指向坐标原点，scene.position的默认是new THREE.Vector3(0,0,0)
      // camera.lookAt(scene.position);
      // 相机对象指向一个网格模型对象Mesh，渲染后Mesh会显示到Canvas画布的正中间
      // camera.lookAt(Mesh.position);
      // 直接设置具体的坐标值
      // camera.lookAt(0,0,0);
      // 通过三维向量直接设置坐标值
      // camera.lookAt(new THREE.Vector3(10,0,20));
       let {x,y,z}  = this.cm.la
      this.camera.lookAt(x,y,z);
    },
    cameraP(v){
      // this.camera.setFocalLength(this.cp.fov)
      this.camera[v] = this.cp[v]
      this.camera.updateProjectionMatrix()
    },
    updatePosition() {
      this.mesh.position.set(this.controls.positionX, this.controls.positionY, this.controls.positionZ);
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy(){
    this.gui.destroy()
    this.control.dispose()
  }
};
</script>
<style lang="scss" scoped>
.tool{
  margin: 10px 0;
}
#gui { position: absolute; top: 2px; left: 2px }
</style>
