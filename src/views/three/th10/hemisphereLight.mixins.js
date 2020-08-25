/*
 * @Description:
 * @Author: louiebb
 * @Date: 2020-08-24 17:04:50
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-25 10:56:28
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
    initHemisphereLight() {
      this.initScene();
      this.initLightHL();
      this.initModelHL();
      this.initGuiHL();
    },
    initModelHL() {
      //球体
      let sphereGeometry = new THREE.SphereGeometry(15, 24, 16);
      let sphereMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});

      this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      this.sphere.position.set(0, 50, 0);

      this.sphere.castShadow = true; //开启阴影

      this.scene.add(this.sphere);

      //立方体
      var cubeGeometry = new THREE.CubeGeometry(10, 10, 10);

      var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ffff});

      this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      this.cube.position.x = 30;
      this.cube.position.z = -5;

      this.cube.castShadow = true; //开启阴影

      this.scene.add(this.cube);

      //底部平面
      var planeGeometry = new THREE.PlaneGeometry(100, 100);
      var planeMaterial = new THREE.MeshLambertMaterial({color: 0xaaaaaa});

      this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
      this.plane.rotation.x = -0.5 * Math.PI;
      this.plane.position.y = -5;

      this.plane.receiveShadow = true; //可以接收阴影

      this.scene.add(this.plane);
    },
    initLightHL() {
      this.ambientLight = new THREE.AmbientLight('#111111');
      this.scene.add(this.ambientLight); //添加到场景

      //添加户外光源
      this.hemisphereLight = new THREE.HemisphereLight(0x00ffff, 0xff0000, 1);
      this.scene.add(this.hemisphereLight);
    },
    initGuiHL() {
      //保存相关数据的对象
      this.gui = {
        skyColor: '#00ffff', //环境光源
        groundColor: '#ff0000', //点光源
        intensity: 1, //灯光强度
        visible: true, //显示户外光
      };
      // add GUI controls
      this.datGui = new dat.GUI();
      //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
      this.datGui
        .addColor(this.gui, 'skyColor')
        .name('天空颜色')
        .onChange((e) => {
          this.hemisphereLight.color.set(e);
        });
      this.datGui
        .addColor(this.gui, 'groundColor')
        .name('地面颜色')
        .onChange((e) => {
          this.hemisphereLight.groundColor.set(e);
        });
      this.datGui
        .add(this.gui, 'intensity', 0, 5)
        .name('光线强度')
        .onChange((e) => {
          this.hemisphereLight.intensity = e;
        });
      this.datGui
        .add(this.gui, 'visible')
        .name('显示户外光')
        .onChange((e) => {
          this.hemisphereLight.visible = e;
        });
    },
  },
};
