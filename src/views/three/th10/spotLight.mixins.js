/*
 * @Description:
 * @Author: louiebb
 * @Date: 2020-08-24 17:04:50
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-25 11:20:47
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
    initSpotLight() {
      this.initScene();
      this.initLightSL();
      this.initModelSL();
      this.initGuiSL();
    },
    initModelSL() {
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
    initLightSL() {
      this.ambientLight = new THREE.AmbientLight('#111111');
      this.scene.add(this.ambientLight); //添加到场景

      //添加户外光源
      this.spotLight = new THREE.SpotLight('#ffffff');
      this.spotLight.position.set(40, 80, 10);
      this.spotLight.angle = Math.PI / 4;
      this.spotLight.distance = 400;

      //告诉平行光需要开启阴影投射
      this.spotLight.castShadow = true;

      this.scene.add(this.spotLight);

      //添加灯光辅助
      this.debug = new THREE.CameraHelper(this.spotLight.shadow.camera);
      this.debug.name = 'debug';
      this.scene.add(this.debug);

      this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
      this.scene.add(this.spotLightHelper);
    },
    initGuiSL() {
      //保存相关数据的对象
      this.gui = {
        ambientLight: '#111111', //环境光源
        spotLight: '#ffffff', //点光源
        intensity: 1, //灯光强度
        distance: 400, //照射范围
        angle: Math.PI / 4, //照射角度
        penumbra: 0, //交界过渡
        decay: 1, //衰减度
        visible: true, //是否可见
        castShadow: true, //是否开启阴影
        debug: true, //开启关闭光照辅助
        x: 40, //朝向x轴坐标
        y: 80, //朝向y轴坐标
        z: 10, //朝向z轴坐标
        targetX: 0, //朝向x轴坐标
        targetY: 0, //朝向y轴坐标
        targetZ: 0, //朝向z轴坐标
      };
      // add GUI controls
      this.datGui = new dat.GUI();
      //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
      this.datGui
        .addColor(this.gui, 'ambientLight')
        .name('环境光颜色')
        .onChange((e) => {
          this.ambientLight.color.set(e);
        });
      this.datGui
        .addColor(this.gui, 'spotLight')
        .name('光源颜色')
        .onChange((e) => {
          this.spotLight.color.set(e);
        });
      this.datGui
        .add(this.gui, 'intensity', 0, 5)
        .name('光线强度')
        .onChange((e) => {
          this.spotLight.intensity = e;
        });
      this.datGui
        .add(this.gui, 'distance', 0, 300)
        .name('照射范围')
        .onChange((e) => {
          this.spotLight.distance = e;
        });
      this.datGui
        .add(this.gui, 'angle', 0, Math.PI / 2)
        .name('照射角度')
        .onChange((e) => {
          this.spotLight.angle = e;
        });
      this.datGui
        .add(this.gui, 'penumbra', 0, 1)
        .name('交界过渡')
        .onChange((e) => {
          this.spotLight.penumbra = e;
        });
      this.datGui
        .add(this.gui, 'decay', 0, 5)
        .name('衰减度')
        .onChange((e) => {
          this.spotLight.decay = e;
        });
      this.datGui
        .add(this.gui, 'visible')
        .name('显示光')
        .onChange((e) => {
          this.spotLight.visible = e;
        });
      this.datGui
        .add(this.gui, 'castShadow')
        .name('显示阴影')
        .onChange((e) => {
          this.spotLight.castShadow = e;
        });
      this.datGui
        .add(this.gui, 'debug')
        .name('开启光照辅助')
        .onChange((e) => {
          this.debug.visible = e;
        });

      this.datGui
        .add(this.gui, 'x', -50, 50)
        .name('X坐标位置')
        .onChange(this.changePositionSL);
      this.datGui
        .add(this.gui, 'y', 0, 200)
        .name('Y坐标位置')
        .onChange(this.changePositionSL);
      this.datGui
        .add(this.gui, 'z', -50, 50)
        .name('Z坐标位置')
        .onChange(this.changePositionSL);

      this.datGui
        .add(this.gui, 'targetX', -20, 20)
        .name('焦点X坐标位置')
        .onChange(this.changeSpherePosition);
      this.datGui
        .add(this.gui, 'targetY', 0, 20)
        .name('焦点Y坐标位置')
        .onChange(this.changeSpherePosition);
      this.datGui
        .add(this.gui, 'targetZ', -20, 20)
        .name('焦点Z坐标位置')
        .onChange(this.changeSpherePosition);
    },
    changePositionSL() {
      this.spotLight.position.set(this.gui.x, this.gui.y, this.gui.z);
    },
    //修改球体位置的方法，平行光的target就是球
    changeSpherePosition() {
      this.sphere.position.set(
        this.gui.targetX,
        this.gui.targetY,
        this.gui.targetZ
      );
    },
  },
};
