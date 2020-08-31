<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-28 13:54:52
-->
<template>
  <div class="page-sprite">
    <div class="container"></div>
  </div>
</template>
 
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import threeMixins from "@/mixins/three";

export default {
  name: "Sprite",
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
      gap:250
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
  beforeDestroy() {},
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
      this.animate();
    },
    initControl() {
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
      this.control.target.set(0, 0.5, 0);
      this.control.update();
      this.control.enablePan = false;
      this.control.enableDamping = true;
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
      //创建一个最普通的精灵
      var spriteMaterialNormal = new THREE.SpriteMaterial({ color: 0x00ffff });
      var spriteNormal = new THREE.Sprite(spriteMaterialNormal);
      spriteNormal.position.set(-30, 10, 0); //设置位置
      spriteNormal.scale.set(5, 5, 1); //设置scale进行大小设置
      this.scene.add(spriteNormal);

      //球体
      var sphereGeometry = new THREE.SphereGeometry(5, 24, 16);
      var sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });
      var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.castShadow = true; //开启阴影
      this.directionalLight.target = sphere; //平行光的焦点到球
      this.scene.add(sphere);

      //添加一个精灵 使用了将canvas生成img的src导入的方式
      var spriteMap = new THREE.TextureLoader().load(
        this.drawCanvas({ text: "球", width: 64, height: 64 }).toDataURL()
      );
      var spriteMaterial = new THREE.SpriteMaterial({
        map: spriteMap,
        color: 0xffffff
      });
      var sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(0, 10, 0); //设置位置
      sprite.scale.set(5, 5, 1); //设置scale进行大小设置
      this.scene.add(sprite);

      //立方体
      var cubeGeometry = new THREE.CubeGeometry(10, 10, 10);
      var cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff });
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.x = 30;
      cube.position.z = -5;
      cube.castShadow = true; //开启阴影
      this.scene.add(cube);

      //添加一个精灵
      var canvas = this.drawCanvas({ text: "立方体", width: 256, height: 64 });
      var spriteMapCube = new THREE.Texture(canvas);
      spriteMapCube.wrapS = THREE.RepeatWrapping;
      spriteMapCube.wrapT = THREE.RepeatWrapping;
      spriteMapCube.needsUpdate = true;

      var spriteCube = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: spriteMapCube, color: 0xffffff })
      );
      spriteCube.position.set(30, 10, -5); //设置位置
      spriteCube.scale.set(20, 5, 1); //设置scale进行大小设置
      spriteCube.center.set(0.5, 0); //设置位置点处于精灵的最下方中间位置
      this.scene.add(spriteCube);

      //底部平面
      var planeGeometry = new THREE.PlaneGeometry(100, 100);
      var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xaaaaaa,
        side: THREE.DoubleSide
      });
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.y = -5.1;
      plane.receiveShadow = true; //可以接收阴影
      this.scene.add(plane);
    },
    drawCanvas(options) {
      let canvas = document.createElement("canvas");
      canvas.width = options.width;
      canvas.height = options.height;

      let ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "60px Verdana";
      ctx.fillStyle = "#fff";
      ctx.fillText(options.text, 0, 56, options.width);
      return canvas;
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