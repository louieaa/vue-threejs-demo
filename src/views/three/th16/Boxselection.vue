<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-09-07 11:08:24
-->
<template>
  <div class="page-boxselection">
    <div class="container" ref="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import threeMixins from '@/mixins/three';
// import * as dat from 'dat.gui';

export default {
  name: 'Boxselection',
  mixins: [threeMixins],
  props: {
    prop: {
      type: String,
      default: '',
    },
  },
  components: {},
  filter: {},
  computed: {},
  data() {
    return {
      gap: 300,
      modelsList: [],
      domClient: {}, //获取一下当前的dom的距离左上角的偏移量
      down: {},
      move: {},
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
    // this.datGui.destroy();
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
      this.initStats();
      this.initMesh();
      // this.initGui();

      this.initControl();
      this.addTouch();
      this.animate();
    },
    initControl() {
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
      this.control.enabled = false;
    },
    //初始化渲染器
    initRender() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(this.w, this.h);
      //告诉渲染器需要阴影效果
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
      this.container = document.querySelector('.container');
      this.container.appendChild(this.renderer.domElement); //添加到dom
    },
    initLight() {
      this.ambientLight = new THREE.AmbientLight('#111111');
      this.scene.add(this.ambientLight);

      this.directionalLight = new THREE.DirectionalLight('#ffffff');
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
    //初始化场景
    initScene() {
      this.scene = new THREE.Scene(); //实例化场景
    },
    initStats() {
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
      this.stats.domElement.style.left = this.gap / 2 + 'px';
      this.container.appendChild(this.stats.dom);
    },
    initMesh() {
      //首先先删除掉当前场景所含有的立方体
      this.deleteGroup('group');
      //创建一个新的模型组
      let group = new THREE.Group();
      group.name = 'group';
      let geometry = new THREE.BoxGeometry(10, 10, 10);
      for (let i = 0; i < 300; i++) {
        let material = new THREE.MeshLambertMaterial({
          color: this.randomColor(),
        });
        let mesh = new THREE.Mesh(geometry, material);
        //随机位置
        mesh.position.set(
          THREE.Math.randFloatSpread(200),
          THREE.Math.randFloatSpread(200),
          THREE.Math.randFloatSpread(200)
        );
        group.add(mesh);
      }

      this.scene.add(group);
    },
    initGui() {
      let that = this;
      //声明一个保存需求修改的相关数据的对象
      this.gui = {
        createScene: function() {
          that.initMesh();
        },
        exporterScene: function() {
          //首先将场景转成json对象
          let group = that.scene.getObjectByName('group');
          if (!group) return;
          let obj = group.toJSON();
          //将json对象转成json字符串并存储
          that.download('file.json', JSON.stringify(obj));
        },
        importerScene: function() {
          //创建一个input来获取json数据
          let input = document.createElement('input');
          input.type = 'file';
          input.addEventListener('change', function() {
            let file = input.files[0];
            //判断是否是json格式的文件
            if (file.type.indexOf('json') >= 0) {
              //首先先删除掉当前场景所含有的立方体
              that.deleteGroup('group');

              //读取文件内的内容
              let reader = new FileReader();
              reader.readAsText(file);
              reader.onloadend = function() {
                //使用three.js的JSONLoader将模型导入到场景
                let loader = new THREE.ObjectLoader();
                let group = loader.parse(JSON.parse(this.result));
                that.scene.add(group);
              };
            }
          });
          input.click();
        },
        loaderScene: function() {
          //首先先删除掉当前场景所含有的立方体
          that.deleteGroup('group');

          //使用JSONLoader加载json格式文件
          let loader = new THREE.ObjectLoader();

          loader.load('../js/models/json/file.json', function(group) {
            console.log(group);
            that.scene.add(group);
          });
        },
      };

      //var datGui = new dat.GUI();
      //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
      /*datGui.add(gui, "createScene").name("添加模型");
        datGui.add(gui, "exporterScene").name("导出模型");
        datGui.add(gui, "importerScene").name("导入模型");
        datGui.add(gui, "loaderScene").name("加载模型");*/

      this.gui.createScene();
    },
    //随机颜色
    randomColor() {
      let arrHex = [
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
        ],
        strHex = '#',
        index;

      for (let i = 0; i < 6; i++) {
        index = Math.round(Math.random() * 15);
        strHex += arrHex[index];
      }

      return strHex;
    },
    //保存文件
    download(filename, text) {
      let pom = document.createElement('a');
      pom.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
      );
      pom.setAttribute('download', filename);
      if (document.createEvent) {
        let event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
      } else {
        pom.click();
      }
    },
    deleteGroup(name) {
      let group = this.scene.getObjectByName(name);
      if (!group) return;
      //删除掉所有的模型组内的mesh
      group.traverse(function(item) {
        if (item instanceof THREE.Mesh) {
          item.geometry.dispose(); //删除几何体
          item.material.dispose(); //删除材质
        }
      });
      this.scene.remove(group);
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
      this.control.update();
      this.renderer.render(this.scene, this.camera);
    },
    animate() {
      //更新控制器
      this.render();
      //更新性能插件
      this.stats.update();
      requestAnimationFrame(this.animate);
    },
    addTouch() {
      //获取显示区域一半的大小
      var half = {};

      //获取一下当前的dom的距离左上角的偏移量
      this.domClient = {};

      //鼠标按下距离左上角的距离
      this.down = {};
      this.move = {};

      this.max = {};
      this.min = {};

      this.modelsList = [];

      var group;

      this.material = new THREE.MeshPhongMaterial({ color: 0xffffff });

      //声明一个显示的拖拽框的div
      this.div = document.createElement('div');
      this.div.style.cssText =
        'position:fixed; box-sizing:border-box; border:1px solid #ccc;';
      let that = this;
      this.renderer.domElement.addEventListener(
        'mousedown',
        function(e) {
          if (e.button !== 0) {
            return;
          }

          group = that.scene.getObjectByName('group');
          half.height = that.renderer.domElement.offsetHeight / 2;
          half.width = that.renderer.domElement.offsetWidth / 2;

          that.domClient.x = that.renderer.domElement.getBoundingClientRect().left;
          that.domClient.y = that.renderer.domElement.getBoundingClientRect().top;

          that.down.x = e.clientX - that.domClient.x;
          that.down.y = e.clientY - that.domClient.y;
          console.log(
            {
              domElement: that.renderer.domElement,
              offsetHeight: that.renderer.domElement.offsetHeight,
              offsetWidth: that.renderer.domElement.offsetWidth,
              half: half,
              domClient: that.domClient,
              down: that.down,
            },
            7888
          );
          for (let i = 0; i < group.children.length; i++) {
            let box = new THREE.Box3();
            box.expandByObject(group.children[i]);

            //获取到平面的坐标
            let vec3 = new THREE.Vector3();
            box.getCenter(vec3);
            let vec = vec3.project(that.camera);

            that.modelsList.push({
              component: group.children[i],
              position: {
                x: vec.x * half.width + half.width,
                y: -vec.y * half.height + half.height,
              },
              normalMaterial: group.children[i].material,
            });
          }

          //重置样式
          that.div.style.left =  e.clientX   + 'px';
          that.div.style.top =  e.clientY  + 'px'
          that.div.style.width = 0;
          that.div.style.height = 0;
          document.body.appendChild(that.div);

          //绑定鼠标按下移动事件和抬起事件
          document.addEventListener('mousemove', that.movefun, false);
          document.addEventListener('mouseup', that.upfun, false);
        },
        false
      );
    },
    movefun(e) {
      // console.log({
      //   clientX: e.clientX,
      //   clientY: e.clientY,
      //   domClientX: this.domClient.x,
      //   domClientY: this.domClient.y,
      // });

      this.move.x = e.clientX - this.domClient.x;
      this.move.y = e.clientY - this.domClient.y;

      //计算出来大小来设置拖拽框
      this.min.x = Math.min(this.move.x, this.down.x);
      this.min.y = Math.min(this.move.y, this.down.y);
      this.max.x = Math.max(this.move.x, this.down.x);
      this.max.y = Math.max(this.move.y, this.down.y);
      // let halfGap = this.gap / 2;
      // //设置div框
      // this.div.style.left = this.min.x + halfGap + 'px';
      // this.div.style.top = this.min.y + halfGap + 8 + 'px';
      this.div.style.width = this.max.x - this.min.x + 'px';
      this.div.style.height = this.max.y - this.min.y + 'px';

      //判断修改哪些构件
      for (let i = 0; i < this.modelsList.length; i++) {
        let position = this.modelsList[i].position;
        if (
          position.x > this.min.x &&
          position.x < this.max.x &&
          position.y > this.min.y &&
          position.y < this.max.y
        ) {
          this.modelsList[i].component.material = this.material;
        } else {
          this.modelsList[i].component.material = this.modelsList[
            i
          ].normalMaterial;
        }
      }
    },
    upfun() {
      //清除事件
      document.body.removeChild(this.div);
      document.removeEventListener('mousemove', this.movefun, false);
      document.removeEventListener('mouseup', this.upfun, false);

      //将所有的模型修改为当前默认的模型
      for (let i = 0; i < this.modelsList.length; i++) {
        this.modelsList[i].component.material = this.modelsList[
          i
        ].normalMaterial;
      }
    },
  },
};
</script>

<style lang="scss">
.tool {
  margin: 10px;
}
</style>
