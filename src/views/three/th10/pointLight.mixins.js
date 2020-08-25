/*
 * @Description:
 * @Author: louiebb
 * @Date: 2020-08-24 17:04:50
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-25 11:20:32
 */
import * as THREE from 'three';
import * as dat from 'dat.gui';
export default {
  name: '',
  props: {},
  components: {},
  filter: {},
  computed: {},
  data() {
    return {};
  },
  watch: {},
  // life cycle start
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  // life cycle end
  methods: {
    initPointLight() {
      this.initScene();
      this.initLightPL();
      this.initModelPL();
      this.initGuiPL();
    },
    initModelPL() {
      //球体
      let sphereGeometry = new THREE.SphereGeometry(5, 24, 16);
      let sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff00ff });

      this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      this.sphere.castShadow = true; //开启阴影

      this.scene.add(this.sphere);

      //立方体
      var cubeGeometry = new THREE.CubeGeometry(10, 10, 10);

      var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff });

      this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      this.cube.position.x = 30;
      this.cube.position.z = -5;

      this.cube.castShadow = true; //开启阴影

      this.scene.add(this.cube);

      //底部平面
      var planeGeometry = new THREE.PlaneGeometry(100, 100);
      var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaabb });

      this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
      this.plane.rotation.x = -0.5 * Math.PI;
      this.plane.position.y = -5;

      this.plane.receiveShadow = true; //接收阴影

      this.scene.add(this.plane);
    },
    initLightPL() {
      this.ambientLight = new THREE.AmbientLight('#111111');
      this.scene.add(this.ambientLight); //添加到场景

      //添加户外光源
      this.pointLight = new THREE.PointLight("#ffffff");
      this.pointLight.position.set(40, 60, 10);
      //告诉平行光需要开启阴影投射
      this.pointLight.castShadow = true;

      this.scene.add(this.pointLight);

      //添加灯光辅助
      this.debug = new THREE.PointLightHelper(this.pointLight);
      this.debug.name = "debug";
      this.scene.add(this.debug);
    },
    initGuiPL() {
      //保存相关数据的对象
      this.gui = {
        ambientLight: '#111111', //环境光源
        pointLight: '#ffffff', //点光源
        intensity: 1, //灯光强度
        visible: true, //是否可见
        castShadow: true, //是否开启阴影
        debug: true, //开启关闭光照辅助
        x: 40, //朝向x轴坐标
        y: 60, //朝向y轴坐标
        z: 10, //朝向z轴坐标
      };
      // add GUI controls
      this.datGui = new dat.GUI();
      //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
      this.datGui
        .addColor(this.gui, 'ambientLight')
        .name('环境光颜色')
        .onChange(function(e) {
          this.ambientLight.color.set(e);
        });
      this.datGui
        .addColor(this.gui, 'pointLight')
        .name('点光源颜色')
        .onChange(function(e) {
          this.pointLight.color.set(e);
        });
      this.datGui
        .add(this.gui, 'intensity', 0, 5)
        .name('光线强度')
        .onChange(function(e) {
          this.pointLight.intensity = e;
        });
      this.datGui
        .add(this.gui, 'visible')
        .name('显示光')
        .onChange(function(e) {
          this.pointLight.visible = e;
        });
      this.datGui
        .add(this.gui, 'castShadow')
        .name('显示阴影')
        .onChange(function(e) {
          this.pointLight.castShadow = e;
        });
      this.datGui
        .add(this.gui, 'debug')
        .name('开启光照辅助')
        .onChange(function(e) {
          this.debug.visible = e;
        });

      this.datGui
        .add(this.gui, 'x', -50, 50)
        .name('X坐标位置')
        .onChange(this.changePositionPL);
      this.datGui
        .add(this.gui, 'y', 0, 200)
        .name('Y坐标位置')
        .onChange(this.changePositionPL);
      this.datGui
        .add(this.gui, 'z', -50, 50)
        .name('Z坐标位置')
        .onChange(this.changePositionPL);
    },
    changePositionPL() {
      this.pointLight.position.set(this.gui.x, this.gui.y, this.gui.z);
    },
  },
};
