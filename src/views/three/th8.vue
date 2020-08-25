<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-21 09:56:05
-->
<template>
  <div class="page-th8">
    <h3>绘制街景动画</h3>
    <!-- <el-row class="tool">
      <el-button type="primary" @click="initTrianglesBufferGeometry" round>TrianglesBufferGeometry</el-button>
      <el-button type="success" @click="initPointsBufferGeometry" round>PointsBufferGeometry</el-button>
    </el-row> -->
    <div class="container"></div>
  </div>
</template>
 
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import threeMixins from '@/mixins/three' 

export default {
  name: 'th8',
  mixins: [threeMixins],
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
      clock: new THREE.Clock(),
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
      
      this.initStats();
      this.initControl();

      this.initEnvMap();
      this.initDracoLoaderAndGLTFLoader();
    },
    initControl() {
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
      this.control.target.set( 0, 0.5, 0 );
			this.control.update();
			this.control.enablePan = false;
			this.control.enableDamping = true;
    },
      //初始化渲染器
    initRenderer() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true }); //实例化渲染器
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize(this.w,this.h); //设置宽和高
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.container = document.querySelector('.container')
      this.container.appendChild(this.renderer.domElement); //添加到dom
    },
    initLight(){
      let dirLight = new THREE.DirectionalLight( 0xffffff, 1 ); //添加了一个白色的平行光
			dirLight.position.set( 5, 2, 8 ); //设置光的方向
			this.scene.add( dirLight ); //添加到场景
    },
    //初始化场景
    initScene() {
      this.scene = new THREE.Scene(); //实例化场景
      this.scene.background = new THREE.Color( 0xbfe3dd );
      // this.scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );
      // this.scene.add( new THREE.AmbientLight( 0x444444 ) );
      this.scene.add( new THREE.HemisphereLight( 0xffffff, 0x000000, 0.4 ) );
      this.initLight();
    },
    initDracoLoaderAndGLTFLoader(){
      var dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath( '/server/loader/gltf/littlestTokyo/draco/gltf/' );

			var loader = new GLTFLoader();
			loader.setDRACOLoader( dracoLoader );
			loader.load( '/server/loader/gltf/littlestTokyo/model/LittlestTokyo.glb',  ( gltf )=> {
				var model = gltf.scene;
				model.position.set( 1, 1, 0 );
				model.scale.set( 0.01, 0.01, 0.01 );
				model.traverse(  ( child )=> {
          if ( child.isMesh ) {
            child.material.envMap = this.envMap;
          }
				} );
				this.scene.add( model );

				this.mixer = new THREE.AnimationMixer( model );
				this.mixer.clipAction( gltf.animations[ 0 ] ).play();
				this.animate();

			}, undefined, function ( e ) {

				console.error( e );
			} );
    },
    initEnvMap(){
      // envmap
			var path = '/server/loader/gltf/littlestTokyo/textures/cube/Park2/';
			var format = '.jpg';
			this.envMap = new THREE.CubeTextureLoader().load( [
				path + 'posx' + format, path + 'negx' + format,
				path + 'posy' + format, path + 'negy' + format,
				path + 'posz' + format, path + 'negz' + format
			] );
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
      this.camera = new THREE.PerspectiveCamera(this.cameraParams.fov,this.cameraParams.aspect,this.cameraParams.near,this.cameraParams.far); //实例化相机
      this.camera.position.set( 5, 2, 8 );
    },
    animate() {
      requestAnimationFrame(this.animate); //循环调用函数
      var delta = this.clock.getDelta();
      this.mixer.update( delta );
      this.control.update();
      this.stats.update(); //更新性能检测框
      this.renderer.render( this.scene, this.camera );			
    },
  },
};
</script>
 
<style lang="scss">
.tool{
  margin: 10px;
}
</style> 