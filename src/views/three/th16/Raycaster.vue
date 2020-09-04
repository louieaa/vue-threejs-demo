<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-09-04 11:40:07
-->
<template>
  <div class="page-points">
    <div class="container" ref="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import threeMixins from '@/mixins/three';
import * as dat from 'dat.gui';

export default {
  name: 'Points',
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
      this.initStats();
      this.initGui();

      this.initControl();
      this.addTouch();
      this.animate();
    },
    initControl() {
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
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
    initGui() {
      //声明一个保存需求修改的相关数据的对象
      // 指向vue
      let that = this;
      this.gui = {
        createScene: function() {
          //首先先删除掉当前场景所含有的立方体
          that.deleteGroup('group');
          //创建一个新的模型组
          let group = new THREE.Group();
          group.name = 'group';
          let geometry = new THREE.BoxGeometry(10, 10, 10);
          for (let i = 0; i < 30; i++) {
            let material = new THREE.MeshLambertMaterial({
              color: that.randomColor(),
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
          that.scene.add(group);
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

          loader.load('/server/loader/json/file.json', function(group) {
            console.log(group);
            that.scene.add(group);
          });
        },
      };
      // add GUI controls
      this.datGui = new dat.GUI();
      //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
      this.datGui.add(this.gui, 'createScene').name('添加模型');
      this.datGui.add(this.gui, 'exporterScene').name('导出模型');
      this.datGui.add(this.gui, 'importerScene').name('导入模型');
      this.datGui.add(this.gui, 'loaderScene').name('加载模型');
      this.gui.loaderScene();
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
    onMouseClick(event) {
      //声明射线和mouse变量
      let raycaster = new THREE.Raycaster();
      let mouse = new THREE.Vector2();
      console.log({
        x:event.clientX,
        y:event.clientY,
        w:this.w,
        h:this.h,
        gap:this.gap,
        halfGap: this.gap / 2,
        container:this.$refs.container.getBoundingClientRect()
      },788);
      
      //通过鼠标点击的位置计算出射线所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
      // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      // 点击计算两边留白
      let X = 0 // 当前真正的x
      let halfGap =  this.gap / 2
      let maximumX = this.w + halfGap // 鼠标不能超出的范围 即x必须在(halfGap ～ maximumX)
      if (event.clientX>maximumX) {
        return;
      }
      if(event.clientX >= halfGap){ // 大于左边留白
        X = event.clientX - halfGap
      }
      let Y = 0  //当前真正的y
      let topY = this.$refs.container.getBoundingClientRect().y
      let maximumY = this.h + topY 
      if (event.clientY>maximumY) {
        return;
      }

      if(event.clientY >= topY){ // 大于上部留白
        Y = event.clientY - topY
      }
      mouse.x = (X / this.w) * 2 - 1;
      mouse.y = -(Y / this.h) * 2 + 1;

      //根据在屏幕的二维位置以及相机的矩阵更新射线的位置
      raycaster.setFromCamera(mouse, this.camera);

      // 获取射线直线和所有模型相交的数组集合
      let intersects = raycaster.intersectObjects(this.scene.children, true); //增加第二个参数，可以遍历子子孙孙对象

      //intersects是返回的一个数组，如果当前位置没有可选中的对象，那这个数组为空，否则为多个对象组成的数组，排列顺序为距离屏幕的距离从近到远的顺序排列
      //数组的每一个子对象内包含：
      // distance：距离屏幕的距离
      // face：与射线相交的模型的面
      // faceIndex：与射线相交的模型的面的下标
      // object：与射线相交的模型对象
      // point：射线与模型相交的点的位置坐标
      // uv：与射线相交的模型的面的uv映射位置

      console.log(intersects);
      //将所有的相交的模型的颜色设置为红色，如果只需要将第一个触发事件，那就数组的第一个模型改变颜色即可
      /*for (let i = 0; i < intersects.length; i++) {
                intersects[i].object.material.color.set(0xff0000);
            }*/

      //判断当前数组是否为空,不为空则获取最近的的模型，将其颜色修改为红色
      if (intersects.length > 0) {
        intersects[0].object.material.color.set(0xff0000);
      }
    },
    addTouch(){
      this.$refs.container.addEventListener("click", this.onMouseClick, false)
      // document.addEventListener("click", this.onMouseClick, false);
    },
  },
};
</script>

<style lang="scss">
.tool {
  margin: 10px;
}
</style>
