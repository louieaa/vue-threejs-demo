
<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-28 15:30:51
-->
<template>
  <div class="page-skeleton">
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
  name: "Skeleton",
  mixins: [threeMixins],
  props: {},
  components: {},
  filter: {},
  computed: {},
  data() {
    return {
      gap: 250,
      state: {
        animateBones: false
      }
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
      this.datGui = new dat.GUI();
      let folder = this.datGui.addFolder("动画配置");

      folder.add(this.state, "animateBones").name("开启骨骼动画");

      folder.add(this.mesh, "pose").name("重置");

      let bones = this.mesh.skeleton.bones;

      for (let i = 0; i < bones.length; i++) {
        let bone = bones[i];

        folder = this.datGui.addFolder("骨骼 " + i);

        folder
          .add(bone.position, "x", -10 + bone.position.x, 10 + bone.position.x)
          .name("position.x");
        folder
          .add(bone.position, "y", -10 + bone.position.y, 10 + bone.position.y)
          .name("position.y");
        folder
          .add(bone.position, "z", -10 + bone.position.z, 10 + bone.position.z)
          .name("position.z");

        folder
          .add(bone.rotation, "x", -Math.PI * 0.5, Math.PI * 0.5)
          .name("rotation.x");
        folder
          .add(bone.rotation, "y", -Math.PI * 0.5, Math.PI * 0.5)
          .name("rotation.y");
        folder
          .add(bone.rotation, "z", -Math.PI * 0.5, Math.PI * 0.5)
          .name("rotation.z");

        folder.add(bone.scale, "x", 0, 2).name("scale.x");
        folder.add(bone.scale, "y", 0, 2).name("scale.y");
        folder.add(bone.scale, "z", 0, 2).name("scale.z");
      }
    },
    //初始化渲染器
    initRender() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.w, this.h);
      this.renderer.setClearColor(0xeeeeee);
      //告诉渲染器需要阴影效果
      this.renderer.shadowMap.enabled = true;
      // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
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
      //辅助工具
      let helper = new THREE.AxesHelper(50);
      this.scene.add(helper);

      //制作模型
      let segmentHeight = 6; //每一节骨骼的的高度
      let segmentCount = 4; //总节数
      let height = segmentHeight * segmentCount; //总高度
      let halfHeight = height * 0.5; //总高度一半的高度

      let sizing = {
        segmentHeight: segmentHeight,
        segmentCount: segmentCount,
        height: height,
        halfHeight: halfHeight
      };

      let geometry = this.createGeometry(sizing); //创建几何体
      let bones = this.createBones(sizing); //创建骨骼
      this.mesh = this.createMesh(geometry, bones); //创建网格模型

      this.scene.add(this.mesh);
    },
    //创建几何体
    createGeometry(sizing) {
      let geometry = new THREE.CylinderGeometry(
        5, // 顶部圆柱体的半径
        5, // 底部圆柱体的半径
        sizing.height, // 圆柱体的高度
        8, // 圆柱周围的分段面数
        sizing.segmentCount * 3, // 沿圆柱体高度的面的行数
        true // 圆柱体的末端是打开
      );

      //添加绘制第二个纹理的面
      let len = geometry.faces.length;

      for (let i = 0; i < len; i++) {
        let face = geometry.faces[i].clone();
        face.materialIndex = 1;
        geometry.faces.push(face);
      }

      //删除掉几何体的uv映射，解决报错问题
      geometry.faceVertexUvs = [];

      //遍历几何体所有的顶点
      for (let i = 0; i < geometry.vertices.length; i++) {
        //根据顶点的位置计算出骨骼影响下标和权重

        let vertex = geometry.vertices[i];
        let y = vertex.y + sizing.halfHeight;

        let skinIndex = Math.floor(y / sizing.segmentHeight);
        let skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight;

        geometry.skinIndices.push(
          new THREE.Vector4(skinIndex, skinIndex + 1, 0, 0)
        );
        geometry.skinWeights.push(
          new THREE.Vector4(1 - skinWeight, skinWeight, 0, 0)
        );
      }

      //实例化一个BufferGeometry对象
      var bufferGeo = new THREE.BufferGeometry();
      //调用对象的fromGeometry方法，并将需要转换的geometry传入
      bufferGeo.fromGeometry(geometry);
      //bufferGeo为geometry转换成的BufferGeometry

      return bufferGeo;
    },
    //创建骨骼
    createBones(sizing) {
      let bones = [];

      let prevBone = new THREE.Bone();
      bones.push(prevBone);
      prevBone.position.y = -sizing.halfHeight;

      for (let i = 0; i < sizing.segmentCount; i++) {
        let bone = new THREE.Bone();
        bone.position.y = sizing.segmentHeight;
        bones.push(bone); //添加到骨骼数组
        prevBone.add(bone); //上一个骨骼定义为父级
        prevBone = bone;
      }

      return bones;
    },
    createMesh(geometry, bones) {
      let material = new THREE.MeshPhongMaterial({
        skinning: true,
        color: 0x156289,
        emissive: 0x072534,
        side: THREE.DoubleSide
      });

      let lineMaterial = new THREE.MeshBasicMaterial({
        skinning: true,
        wireframe: true
      });

      let mesh = new THREE.SkinnedMesh(geometry, [material, lineMaterial]);
      let skeleton = new THREE.Skeleton(bones); //创建骨架

      mesh.add(bones[0]); //将骨骼添加到模型里面

      mesh.bind(skeleton); //模型绑定骨架

      //添加骨骼辅助标记
      let skeletonHelper = new THREE.SkeletonHelper(mesh);
      skeletonHelper.material.linewidth = 2;
      this.scene.add(skeletonHelper);

      return mesh;
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
      this.camera.position.set(0, 40, 50);
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