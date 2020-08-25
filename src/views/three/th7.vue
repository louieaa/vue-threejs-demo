<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-20 17:25:16
-->
<template>
  <div class="page-th7">
    <h3>绘制多彩的立方体</h3>
    <el-row class="tool">
      <el-button type="primary" @click="initTrianglesBufferGeometry" round>TrianglesBufferGeometry</el-button>
      <el-button type="success" @click="initPointsBufferGeometry" round>PointsBufferGeometry</el-button>
    </el-row>
    <div class="container"></div>
  </div>
</template>
 
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js';

export default {
  name: 'th7',
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
      control:null,
      container:null,
      scene:null, // 场景
      camera:null, // 相机
      renderer:null, // 渲染
      cp:{
        fov:50 ,// 角度 最小值为0，最大值为180，默认值为50，实际项目中一般都定义45
        aspect:0, // 宽高比
        near:1, // 近面
        far:1000 // 远面
      },
      currentNum:20000,
      gap:200, // 缺口
      w:window.innerWidth,
      h:window.innerHeight,
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
    window.addEventListener( 'resize', this.onWindowResize, false );
  },
  beforeDestroy() {},
  destroyed() {},
  // life cycle end
  methods: {
    handleGetWindowInner(){
      this.w = window.innerWidth - this.gap
      this.h = window.innerHeight- this.gap
    },
    onWindowResize() {
      this.handleGetWindowInner()
      this.camera.aspect = this.w / this.h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( this.w, this.h );
    },
    render() {
      let time = Date.now() * 0.001;
      this.mesh.rotation.x = time * 0.25;
      this.mesh.rotation.y = time * 0.5;
      this.renderer.render( this.scene, this.camera );
		},
    init(){
      this.handleGetWindowInner();
      this.initRender();
      this.initScene();
      this.initAxis();
      this.initCamera();
      this.initTrianglesBufferGeometry();
      this.initStats();
      this.initControl();
      this.animate();
    },
    initControl() {
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
    },
    initAxis(){
      let axis = new THREE.AxisHelper(3);
      this.scene.add(axis);
    },
    //初始化渲染器
    initRender() {
      this.renderer = new THREE.WebGLRenderer(); //实例化渲染器
      this.renderer.setSize(this.w,this.h); //设置宽和高
      this.container = document.querySelector('.container')
      this.container.appendChild(this.renderer.domElement); //添加到dom
    },
    initLight(){
      let light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
      light1.position.set( 1, 1, 1 );
      this.scene.add( light1 );

      let light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
      light2.position.set( 0, - 1, 0 );
      this.scene.add( light2 );
    },
    //初始化场景
    initScene() {
      this.scene = new THREE.Scene(); //实例化场景
      this.scene.background = new THREE.Color( 0x050505 );
      this.scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );
      this.scene.add( new THREE.AmbientLight( 0x444444 ) );
      this.initLight();
    },
    // 三角形
    initTrianglesBufferGeometry(){
      let triangles = this.currentNum
      this.geometry = new THREE.BufferGeometry();
      let positions = [];
      let normals = [];
      let colors = [];

      let color = new THREE.Color();

      let n = 800, n2 = n / 2;	// triangles spread in the cube
      let d = 12, d2 = d / 2;	// individual triangle size

      let pA = new THREE.Vector3();
      let pB = new THREE.Vector3();
      let pC = new THREE.Vector3();

      let cb = new THREE.Vector3();
      let ab = new THREE.Vector3();

      for ( let i = 0; i < triangles; i ++ ) {
        // positionsx
        let x = Math.random() * n - n2;
        let y = Math.random() * n - n2;
        let z = Math.random() * n - n2;

        let ax = x + Math.random() * d - d2;
        let ay = y + Math.random() * d - d2;
        let az = z + Math.random() * d - d2;

        let bx = x + Math.random() * d - d2;
        let by = y + Math.random() * d - d2;
        let bz = z + Math.random() * d - d2;

        let cx = x + Math.random() * d - d2;
        let cy = y + Math.random() * d - d2;
        let cz = z + Math.random() * d - d2;

        positions.push( ax, ay, az );
        positions.push( bx, by, bz );
        positions.push( cx, cy, cz );

        // flat face normals

        pA.set( ax, ay, az );
        pB.set( bx, by, bz );
        pC.set( cx, cy, cz );

        cb.subVectors( pC, pB );
        ab.subVectors( pA, pB );
        cb.cross( ab );

        cb.normalize();

        let nx = cb.x;
        let ny = cb.y;
        let nz = cb.z;

        normals.push( nx, ny, nz );
        normals.push( nx, ny, nz );
        normals.push( nx, ny, nz );

        // colors

        let vx = ( x / n ) + 0.5;
        let vy = ( y / n ) + 0.5;
        let vz = ( z / n ) + 0.5;

        color.setRGB( vx, vy, vz );

        colors.push( color.r, color.g, color.b );
        colors.push( color.r, color.g, color.b );
        colors.push( color.r, color.g, color.b );

      }

      this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).onUpload( this.disposeArray ) );
      this.geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ).onUpload( this.disposeArray ) );
      this.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ).onUpload( this.disposeArray ) );

      this.geometry.computeBoundingSphere();

      let material = new THREE.MeshPhongMaterial( {
        color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
        side: THREE.DoubleSide, vertexColors: true
      } );
      if(this.mesh){
        this.scene.remove(this.mesh)
      }
      this.mesh = new THREE.Mesh( this.geometry, material );
      this.scene.add( this.mesh );
    },
    disposeArray(){
       this.array = null;
    },
    // 绘制点Geometery
    initPointsBufferGeometry(){
      let particles = this.currentNum;
      let positions = [];
      let colors = [];
      let n = 1000
      let n2 = n / 2; // particles spread in the cube
      this.geometry = new THREE.BufferGeometry();
      this.color = new THREE.Color();
      for ( let i = 0; i < particles; i ++ ) {
				// positions
				let x = Math.random() * n - n2;
				let y = Math.random() * n - n2;
				let z = Math.random() * n - n2;
        positions.push( x, y, z );
        
				// colors
				let vx = ( x / n ) + 0.5;
				let vy = ( y / n ) + 0.5;
				let vz = ( z / n ) + 0.5;
				this.color.setRGB( vx, vy, vz );
				colors.push( this.color.r, this.color.g, this.color.b );
			}
      this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
      this.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

      this.geometry.computeBoundingSphere();

      let material = new THREE.PointsMaterial( { size: 15, vertexColors: true } );
      if(this.mesh){
        this.scene.remove(this.mesh)
      }
			this.mesh = new THREE.Points( this.geometry, material );
			this.scene.add( this.mesh );
    },
    initStats(){
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
      this.stats.domElement.style.left = this.gap/2+'px';
      this.container.appendChild( this.stats.dom );
    },
    //初始化相机
    initCamera() {
      this.cp={
        fov:27,// 角度
        aspect:this.w/this.h, // 宽高比
        near:5, // 近面
        far:3500 // 远面
      }
      this.camera = new THREE.PerspectiveCamera(this.cp.fov,this.cp.aspect,this.cp.near,this.cp.far); //实例化相机
      this.camera.position.z = 2750;
    },
    animate() {
      requestAnimationFrame(this.animate); //循环调用函数
      this.stats.update(); //更新性能检测框
      this.render();				
    },
  },
};
</script>
 
<style lang="scss">
.tool{
  margin: 10px;
}
</style> 