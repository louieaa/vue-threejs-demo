<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-19 18:12:47
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-20 16:51:16
-->
<template>
  <div class="page-th4">
  <h3>加载模型</h3>
  <el-tabs v-model="activeName" type="border-card">
    <el-tab-pane label="案例" name="first">
      <el-row class="tool">
        <el-button type="primary" @click="initCarGltf" round>小车</el-button>
        <el-button type="success" @click="initWuGltf" round>小屋</el-button>
        <el-button type="info" round>信息按钮</el-button>
        <el-button type="warning" round>警告按钮</el-button>
        <el-button type="danger" round>危险按钮</el-button>
      </el-row>
      <div class="container"></div>
    </el-tab-pane>
    <el-tab-pane label="说明" name="second">
      <el-card class="box-card">
        <el-collapse>
          <el-collapse-item title="ObjectLoader加载JSON模型" name="1">
            <pre>
            <code>
              // 内部
              var obj = scene.toJSON(); //将整个场景的内容转换成为json对象
              let loader = new THREE.ObjectLoader(); //实例化ObjectLoader对象
              let scene = loader.parse(obj); //将json对象再转换成3D对象

              //外部
              let loader = new THREE.ObjectLoader(); //实例化ObjectLoader对象
              //加载模型，并在回调中将生成的模型对象添加到场景中
              loader.load("../js/models/json/file.json", function (group) {
                  scene.add(group);
              });
            </code>
          </pre>
          </el-collapse-item>
          <el-collapse-item title="GLTFLoader加载glTF模型" name="2">
            <pre>
            <code>
              import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

              this.loader = new GLTFLoader();
              this.loader.load('/loader/gltf/wu/scene.gltf',  (gltf) =>{
                gltf.scene.scale.set(.5,.5,.5);
                this.gltfModel = gltf.scene;
                this.scene.add(gltf.scene);
              });
            </code>
          </pre>
          </el-collapse-item>
          <el-collapse-item title="FBXLoader加载FBX模型" name="3">
            <pre>
              <code>
              import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
              this.loader = new FBXLoader();
              this.loader.load('/loader/gltf/wu/scene.gltf',  (fbx) =>{
                //修改模型大小，并设置每个模型网格可以投射阴影：
                fbx.scale.set(.1,.1,.1);
                fbx.traverse(function (item) {
                  if(item instanceof THREE.Mesh){
                      item.castShadow = true;
                      item.receiveShadow = true;
                  }
                });
                this.scene.add(fbx);
              });
              </code>
            </pre>
          </el-collapse-item>
          <el-collapse-item title="OBJLoader和MTLLoader加载OBJ模型" name="4">
            <pre>
              <code>
              import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
              import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
              //创建MTL加载器
              var mtlLoader = new MTLLoader();
              //设置文件路径
              mtlLoader.setPath('../js/models/obj/');
              //设置纹理文件路径
              mtlLoader.setTexturePath('../js/models/obj/');

              //加载mtl文件
              mtlLoader.load('female02.mtl', function (material) {
                  //创建OBJ加载器
                  var objLoader = new THREE.OBJLoader();
                  //设置当前加载的纹理
                  objLoader.setMaterials(material);
                  objLoader.setPath('../js/models/obj/');
                  objLoader.load('female02.obj', function (object) {
                      //添加阴影
                      object.traverse(function (item) {
                          if(item instanceof THREE.Mesh){
                              item.castShadow = true;
                              item.receiveShadow = true;
                          }
                      });
                      //缩放
                      object.scale.set(.3,.3,.3);
                      scene.add(object);
                  })
              });
              </code>
            </pre>
          </el-collapse-item>
          <el-collapse-item title="ColladaLoader加载COLLADA模型" name="5">
            <pre>
              <code>
              import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'
              var loader = new THREE.ColladaLoader();
              loader.load('../js/models/collada/elf.dae', function (collada) {
                //添加阴影
                collada.scene.traverse(function (item) {
                    if(item instanceof THREE.Mesh){
                        item.castShadow = true;
                        item.receiveShadow = true;
                    }
                });
                //缩放
                collada.scene.scale.set(5,5,5);
                scene.add(collada.scene);
              });
              </code>
            </pre>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-tab-pane>
  </el-tabs>
    
  </div>
</template>
 
<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'th4',
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
      activeName:'first',
      
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
      this.initRender();
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
    initRender() {
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
      this.loader.load('/server/loader/gltf/wu/scene.gltf',  (gltf) =>{
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
      this.loader.load('/server/loader/gltf/car/scene.gltf',  (gltf) =>{
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
      this.initCarGltf();
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
.page-th4{
  padding: 0 32px;
}
.el-tabs__header{
  padding: 0 24px;
}
pre{
  background-color: #282c34;
  text-align: left;
}
code{
  background-color: #282c34;
  color: #abb2bf;
}
</style> 