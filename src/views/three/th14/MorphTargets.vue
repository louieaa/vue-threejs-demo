
<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-28 15:24:50
-->
<template>
  <div class="page-morph-targets">
    <div class="container"></div>
  </div>
</template>
 
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import threeMixins from "@/mixins/three";
import * as dat from "dat.gui";

export default {
  name: "MorphTargets",
  mixins: [threeMixins],
  props: {
    prop: {
      type: String,
      default: ""
    }
  },
  components: {},
  filter: {},
  computed: {},
  data() {
    return {
      gap: 250
    };
  },
  watch: {},
  // life cycle start
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.datGui.destroy();
    this.control.dispose();
  },
  destroyed() {},
  // life cycle end
  methods: {
    init() {
      this.initRender();
      this.initScene();
      this.initCamera();
      this.initLight();
      this.initModel();

      this.initStats();
      this.initControl();
      this.initGui();
      this.animate();
    },
    initControl() {
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
    },
    initGui() {
      //声明一个保存需求修改的相关数据的对象
      this.gui = {
        influence1: 0.01,
        influence2: 0.01,
        update: function() {
          this.cube.morphTargetInfluences[0] = this.gui.influence1;
          this.cube.morphTargetInfluences[1] = this.gui.influence2;
        }
      };

      this.datGui = new dat.GUI();
      //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
      this.datGui.add(this.gui, "influence1", 0, 1).onChange(this.gui.update.bind(this));
      this.datGui.add(this.gui, "influence2", 0, 1).onChange(this.gui.update.bind(this));
    },
    //初始化渲染器
    initRender() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(this.w, this.h);
      //告诉渲染器需要阴影效果
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
      this.container = document.querySelector(".container");
      this.container.appendChild(this.renderer.domElement); //添加到dom
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
    initModel() {
      //底部平面
      var planeGeometry = new THREE.PlaneGeometry(100, 100);
      var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xaaaaaa,
        side: THREE.DoubleSide
      });
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.y = -0.1;
      plane.receiveShadow = true; //可以接收阴影
      this.scene.add(plane);

      // 创建显示的立方体

      var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
      var cubeMaterial = new THREE.MeshLambertMaterial({
        morphTargets: true,
        color: 0x00ffff
      });

      // 创建两个影响立方体的变形目标
      var cubeTarget1 = new THREE.BoxGeometry(2, 10, 2);
      var cubeTarget2 = new THREE.BoxGeometry(8, 2, 8);

      // 将两个geometry的顶点放入到立方体的morphTargets里面
      cubeGeometry.morphTargets[0] = {
        name: "target1",
        vertices: cubeTarget1.vertices
      };
      cubeGeometry.morphTargets[1] = {
        name: "target2",
        vertices: cubeTarget2.vertices
      };
      cubeGeometry.computeMorphNormals();

      //实例化一个BufferGeometry对象
      var bufferGeo = new THREE.BufferGeometry();
      //调用对象的fromGeometry方法，并将需要转换的geometry传入
      bufferGeo.fromGeometry(cubeGeometry);
      //bufferGeo为geometry转换成的BufferGeometry

      this.cube = new THREE.Mesh(bufferGeo, cubeMaterial);
      this.cube.position.set(0, 10, 0);

      // // 将立方体添加到顶点当中
      this.scene.add(this.cube);
    },
    //初始化场景
    initScene() {
      this.scene = new THREE.Scene(); //实例化场景
    },
    initStats() {
      this.stats = new Stats();
      this.stats.domElement.style.position = "absolute";
      this.stats.domElement.style.top = "0px";
      this.stats.domElement.style.left = this.gap / 2 + "px";
      this.container.appendChild(this.stats.dom);
    },
    //初始化相机
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        this.cameraParams.fov,
        this.cameraParams.aspect,
        this.cameraParams.near,
        this.cameraParams.far
      ); //实例化相机
      this.camera.position.set(0, 100, 200);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
    render() {
      this.renderer.render(this.scene, this.camera);
    },
    animate() {
      //更新控制器
      this.render();
      //更新性能插件
      this.stats.update();
      requestAnimationFrame(this.animate);
    }
  }
};
</script>
 
<style lang="scss">
.tool {
  margin: 10px;
}
</style> 