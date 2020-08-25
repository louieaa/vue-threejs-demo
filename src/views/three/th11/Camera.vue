<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-25 14:35:01
-->
<template>
  <div class="page-camera">
    <div class="container"></div>
  </div>
</template>
 
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from 'three/examples/jsm/libs/stats.module.js';


export default {
  name: "Camera",
  mixins: [],
  props: {
    prop: {
      type: String,
      default: ""
    }
  },
  components: {},
  filter: {},
  computed: {
    cameraParams() {
      // 相机参数
      return {
        fov: 45, // 角度 最小值为0，最大值为180，默认值为50，实际项目中一般都定义45
        aspect: this.w / this.h, // 宽高比
        near: 0.1, // 近面
        far: 1000 // 远面
      };
    }
  },
  data() {
    return {
      scene: null, // 场景
      camera: null, // 相机
      renderer: null, // 渲染
      control: null, // 控制器
      container: null, // dom节点
      gap: 200, // 缺口
      w: window.innerWidth,
      h: window.innerHeight,
      ambientLight: null,
      directionalLight: null,
      debug: null,
      sphere: null, // 球体
      cube: null, //立方体
      plane: null, // 底部平面
      gui: null
    };
  },
  watch: {},
  // life cycle start
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.handleGetWindowInner();
    window.addEventListener("resize", this.onWindowResize, false);
    this.init();
  },
  beforeDestroy() {
  },
  destroyed() {},
  // life cycle end
  methods: {
    clearAll() {},
    init() {
      this.initRender();
      this.initScene();
      this.initCamera();
      this.initLight();
      this.initModel();
      this.initControl();
      this.initStats();
      this.animate();
    },
    initStats(){
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
      this.stats.domElement.style.left = this.gap/2+'px';
      this.container.appendChild( this.stats.dom );
    },
    initControl() {
      //透视相机
      this.ctlPerspective = new OrbitControls(
        this.perspectiveCamera,
        this.renderer.domElement
      );
      this.ctlPerspective.target.set(0, 0.5, 0);
      this.ctlPerspective.update();
      this.ctlPerspective.enablePan = false;
      this.ctlPerspective.enableDamping = true;
      //正交相机
      this.ctlOrthographic = new OrbitControls(
        this.orthographicCamera,
        this.renderer.domElement
      );
      this.ctlOrthographic.target.set(0, 0.5, 0);
      this.ctlOrthographic.update();
      this.ctlOrthographic.enablePan = false;
      this.ctlOrthographic.enableDamping = true;
    },
    initModel() {
      this.group = new THREE.Group(); //创建一个模型组

      //球体
      var sphereGeometry = new THREE.SphereGeometry(5, 24, 16);
      var sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff00ff });

      var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      sphere.position.x = -10;
      sphere.position.z = -10;

      sphere.castShadow = true; //开启阴影

      this.group.add(sphere);

      //立方体
      var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);

      var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff });

      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.x = 20;
      cube.position.z = 20;

      cube.castShadow = true; //开启阴影

      this.group.add(cube);

      //底部平面
      var planeGeometry = new THREE.PlaneGeometry(100, 100);
      var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });

      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.y = -5;

      plane.receiveShadow = true; //可以接收阴影

      this.group.add(plane);

      this.scene.add(this.group);
    },
    initLight() {
      let ambientLight = new THREE.AmbientLight("#111111");
      this.scene.add(ambientLight);

      let directionalLight = new THREE.DirectionalLight("#ffffff");
      directionalLight.position.set(40, 60, 10);

      directionalLight.shadow.camera.near = 0; //产生阴影的最近距离
      directionalLight.shadow.camera.far = 200; //产生阴影的最远距离
      directionalLight.shadow.camera.left = -50; //产生阴影距离位置的最左边位置
      directionalLight.shadow.camera.right = 50; //最右边
      directionalLight.shadow.camera.top = 50; //最上边
      directionalLight.shadow.camera.bottom = -50; //最下面

      //这两个值决定生成阴影密度 默认512
      directionalLight.shadow.mapSize.height = 1024;
      directionalLight.shadow.mapSize.width = 1024;

      //告诉平行光需要开启阴影投射
      directionalLight.castShadow = true;

      this.scene.add(directionalLight);
    },
    //初始化渲染器
    initRender() {
      // alpha true透明背景
      this.renderer = new THREE.WebGLRenderer({ antialias: true }); //实例化渲染器
      // this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.w, this.h); //设置宽和高
      this.renderer.autoClear = false; //设置场景不自动清除内容，才能够让两个相机同时渲染页面
      //告诉渲染器需要阴影效果
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
      this.container = document.querySelector(".container");
      this.container.appendChild(this.renderer.domElement); //添加到dom
    },
    //初始化场景
    initScene() {
      this.scene = new THREE.Scene(); //实例化场景
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 0.4));
    },
    //初始化相机
    initCamera() {
      let aspect = this.cameraParams.aspect / 2;
      //创建透视相机
      this.perspectiveCamera = new THREE.PerspectiveCamera(
        this.cameraParams.fov,
        aspect,
        this.cameraParams.near,
        this.cameraParams.far
      ); //实例化相机

      //创建正交相机
      let size = 200;
      this.orthographicCamera = new THREE.OrthographicCamera(
        (size * aspect) / -2,
        (size * aspect) / 2,
        size / 2,
        size / -2,
        0.1,
        1000
      );
      //两个相机设置相同的位置
      this.perspectiveCamera.position.set(0, 100, 200);
      this.orthographicCamera.position.set(0, 100, 200);
      //设置两个相机焦点都为原点
      this.perspectiveCamera.lookAt(new THREE.Vector3());
      this.orthographicCamera.lookAt(new THREE.Vector3());
      //添加到场景
      this.scene.add(this.perspectiveCamera);
      this.scene.add(this.orthographicCamera);
    },
    render() {
      this.renderer.clear(true, true, true); //手动清除场景

      var size = this.renderer.getSize(new THREE.Vector2()); //获取到当前的显示区域的宽高
      this.renderer.setViewport(0, 0, size.width / 2, size.height); //设置视口，从 (x, y) 到 (x + width, y + height)。
      this.renderer.render(this.scene, this.perspectiveCamera);

      this.renderer.setViewport(size.width / 2, 0, size.width / 2, size.height);
      this.renderer.render(this.scene, this.orthographicCamera);
    },
    animate() {
      this.render();
      this.ctlPerspective.update();
      this.ctlOrthographic.update();
      //更新性能插件
      this.stats.update();
      requestAnimationFrame(this.animate); //循环调用函数
    },
    handleGetWindowInner() {
      this.w = window.innerWidth - this.gap;
      this.h = window.innerHeight - this.gap;
    },
    onWindowResize() {
      this.handleGetWindowInner();
      let aspect = this.w / this.h / 2;
      //更新透视相机
      this.perspectiveCamera.aspect = aspect;
      this.perspectiveCamera.updateProjectionMatrix();

      //更新正交相机
      let size = 200;
      this.orthographicCamera.left = (size * aspect) / -2;
      this.orthographicCamera.right = (size * aspect) / 2;
      this.orthographicCamera.top = size / 2;
      this.orthographicCamera.bottom = size / -2;
      this.orthographicCamera.updateProjectionMatrix();
      this.renderer.setSize(this.w, this.h);
    }
  }
};
</script>
 
<style lang="scss">
.tool {
  margin: 10px;
}
</style> 