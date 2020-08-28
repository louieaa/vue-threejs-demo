<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-28 10:09:16
-->
<template>
  <div class="page-camera">
    <div class="container"></div>
  </div>
</template>
 
<script>
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import threeMixins from "@/mixins/three";

export default {
  name: "Camera",
  mixins: [threeMixins],
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
      gap:200
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
    move(e) {
      let moveX = e.clientX;
      let moveY = e.clientY;

      //计算鼠标的偏移量当前相机的pan和tilt
      let offsetX = moveX - this.downX;
      let offsetY = moveY - this.downY;

      let movePan = this.pan - offsetX / 3;
      let moveTilt = this.tilt - offsetY;

      //tilt的移动范围是90到-90度
      if (moveTilt >= 90) {
        moveTilt = 89.99;
      }

      if (moveTilt <= -90) {
        moveTilt = -89.99;
      }

      //根据pan和tilt计算出当前的相机应该所在的位置
      let p = this.computePosition(this.distance, movePan, moveTilt);
      this.camera.position.set(p.x, p.y, p.z);
      this.camera.updateProjectionMatrix();

      this.camera.lookAt(new THREE.Vector3());
    },
    up() {
      //清除绑定事件
      document.removeEventListener("mousemove", this.move);
      document.removeEventListener("mouseup", this.up);
    },
    initControl() {
      let dom = this.renderer.domElement;
      //鼠标按下时获取到当前相机的位置，并求出当前相机距离原点的位置
      this.matrix = new THREE.Matrix4(); //声明一个旋转矩阵

      //绑定按下事件
      dom.addEventListener("mousedown", e => {
        this.distance = this.computeDistance(
          this.camera.position,
          new THREE.Vector3()
        );
        this.computePanTilt(this.camera.position);

        this.downX = e.clientX;
        this.downY = e.clientY;

        //绑定移动事件
        document.addEventListener("mousemove", this.move);

        //绑定鼠标抬起事件
        document.addEventListener("mouseup", this.up);
      });
    },
    computePanTilt(position) {
      //首先计算水平的偏移角度
      this.pan = new THREE.Vector3(position.x, 0, position.z).angleTo(
        new THREE.Vector3(0, 0, 1)
      );

      this.pan = (this.pan / Math.PI) * 180;
      if (position.x < 0) {
        this.pan = 360 - this.pan;
      }

      //计算垂直的偏移角度
      this.tilt = new THREE.Vector3(position.x, 0, position.z).angleTo(
        position
      );

      this.tilt = (this.tilt / Math.PI) * 180;
      if (position.y > 0) {
        this.tilt = -this.tilt;
      }
    },
    //根据pan和tilt 相机到原点的距离计算出相机当前所在的位置
    computePosition(distance, pan, tilt) {
      //重置旋转矩阵
      this.matrix.identity();

      let v = new THREE.Vector3(0, 0, distance);

      //根据pan和tilt修改旋转矩阵，注意顶点旋转计算需要按照xyz的顺序旋转

      this.matrix.makeRotationX((tilt / 180) * Math.PI);
      v.applyMatrix4(this.matrix);

      this.matrix.makeRotationY((pan / 180) * Math.PI);
      v.applyMatrix4(this.matrix);

      //计算出当前相机的位置
      return v;
    },
    //计算两点位置的距离
    computeDistance(vec1, vec2) {
      return vec1.distanceTo(vec2);
    },
    initStats() {
      this.stats = new Stats();
      this.stats.domElement.style.position = "absolute";
      this.stats.domElement.style.top = "0px";
      this.stats.domElement.style.left = this.gap / 2 + "px";
      this.container.appendChild(this.stats.dom);
    },
    initModel() {
      //球体
      let sphereGeometry = new THREE.SphereGeometry(5, 24, 16);
      let sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });

      let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      sphere.castShadow = true; //开启阴影

      this.directionalLight.target = sphere; //平行光的焦点到球

      this.scene.add(sphere);

      //立方体
      let cubeGeometry = new THREE.CubeGeometry(10, 10, 10);

      let cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff });

      let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.x = 30;
      cube.position.z = -5;

      cube.castShadow = true; //开启阴影

      this.scene.add(cube);
      //底部平面
      let planeGeometry = new THREE.PlaneGeometry(100, 100);
      let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xaaaaaa,
        side: THREE.DoubleSide
      });

      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.y = -5.1;

      plane.receiveShadow = true; //可以接收阴影
      this.scene.add(plane);
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
    //初始化渲染器
    initRender() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(this.w, this.h);
      //告诉渲染器需要阴影效果
      this.renderer.shadowMap.enabled = true;
      // THREE.PCFShadowMap比较清晰
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.container = document.querySelector(".container");
      this.container.appendChild(this.renderer.domElement); //添加到dom
    },
    //初始化场景
    initScene() {
      this.scene = new THREE.Scene(); //实例化场景
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
    animate() {
       //更新性能插件
      this.stats.update();
      this.renderer.render(this.scene, this.camera);
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