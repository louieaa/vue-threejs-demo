/*
 * @Description:
 * @Author: louiebb
 * @Date: 2020-08-24 17:04:50
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-25 11:05:37
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
    initDirectionalLight() {
      this.initScene();
      this.initGuiDL();
      this.initLightDL();
      this.initModelDL();
    },
    initModelDL() {
      //球体
      let sphereGeometry = new THREE.SphereGeometry(5, 24, 16);
      let sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff00ff });
      this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      this.sphere.castShadow = true; //开启阴影

      this.directionalLight.target = this.sphere; //平行光的焦点到球
      this.scene.add(this.sphere);

      //立方体
      let cubeGeometry = new THREE.CubeGeometry(10, 10, 10);

      let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff });

      this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      this.cube.position.x = 30;
      this.cube.position.z = -5;

      this.cube.castShadow = true; //开启阴影
      this.scene.add(this.cube);

      //底部平面
      var planeGeometry = new THREE.PlaneGeometry(100, 100);
      var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });

      this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
      this.plane.rotation.x = -0.5 * Math.PI;
      this.plane.position.y = -5;

      this.plane.receiveShadow = true; //可以接收阴影

      this.scene.add(this.plane);
    },
    initLightDL() {
      this.ambientLight = new THREE.AmbientLight('#111111');
      this.scene.add(this.ambientLight); //添加到场景

      this.directionalLight = new THREE.DirectionalLight('#ffffff');
      this.directionalLight.position.set(40, 60, 10);

      this.directionalLight.shadow.camera.near = this.gui.near; //产生阴影的最近距离
      this.directionalLight.shadow.camera.far = this.gui.far; //产生阴影的最远距离
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

      //添加灯光辅助
      this.debug = new THREE.CameraHelper(this.directionalLight.shadow.camera);
      this.debug.name = 'debug';
      this.scene.add(this.debug);
    },
    initGuiDL() {
      //保存相关数据的对象
      this.gui = {
        ambientLight: '#111111', //环境光源
        directionalLight: '#ffffff', //点光源
        intensity: 1, //灯光强度
        visible: true, //是否可见
        castShadow: true, //是否开启阴影
        debug: true, //开启关闭光照辅助
        targetX: 0, //朝向x轴坐标
        targetY: 0, //朝向y轴坐标
        targetZ: 0, //朝向z轴坐标
        near: 20, //阴影渲染的最近距离
        far: 100, //阴影渲染的最远距离
        left: -50, //阴影的最左边距离
        right: 50, //阴影的最右边距离
        top: 50, //阴影的最上边距离
        bottom: -50, //阴影的最下边距离
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
        .addColor(this.gui, 'directionalLight')
        .name('平行光颜色')
        .onChange((e) => {
          this.directionalLight.color.set(e);
        });
      this.datGui
        .add(this.gui, 'intensity', 0, 5)
        .name('光线强度')
        .onChange((e) => {
          this.directionalLight.intensity = e;
        });
      this.datGui
        .add(this.gui, 'visible')
        .name('显示平行光')
        .onChange((e) => {
          this.directionalLight.visible = e;
        });
      this.datGui
        .add(this.gui, 'castShadow')
        .name('显示阴影')
        .onChange((e) => {
          this.directionalLight.castShadow = e;
        });
      this.datGui
        .add(this.gui, 'debug')
        .name('开启光照辅助')
        .onChange((e) => {
          this.debug.visible = e;
        });

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
      let shadow = this.datGui.addFolder('阴影设置');
      shadow
        .add(this.gui, 'near', 0, 50)
        .name('最近距离')
        .onChange(this.updateShadow);
      shadow
        .add(this.gui, 'far', 50, 100)
        .name('最近距离')
        .onChange(this.updateShadow);
      shadow
        .add(this.gui, 'left', -200, 0)
        .name('最左距离')
        .onChange(this.updateShadow);
      shadow
        .add(this.gui, 'right', 0, 200)
        .name('最右距离')
        .onChange(this.updateShadow);
      shadow
        .add(this.gui, 'top', 0, 200)
        .name('最上距离')
        .onChange(this.updateShadow);
      shadow
        .add(this.gui, 'bottom', -200, 0)
        .name('最下距离')
        .onChange(this.updateShadow);
    },
    //修改球体位置的方法，平行光的target就是球
    changeSpherePosition() {
      this.sphere.position.set(
        this.gui.targetX,
        this.gui.targetY,
        this.gui.targetZ
      );
    },
    updateShadow() {
      this.directionalLight.shadow.camera.near = this.gui.near; //产生阴影的最近距离
      this.directionalLight.shadow.camera.far = this.gui.far; //产生阴影的最远距离
      this.directionalLight.shadow.camera.left = this.gui.left; //产生阴影距离位置的最左边位置
      this.directionalLight.shadow.camera.right = this.gui.right; //最右边
      this.directionalLight.shadow.camera.top = this.gui.top; //最上边
      this.directionalLight.shadow.camera.bottom = this.gui.bottom; //最下面

      this.directionalLight.shadow.camera.updateProjectionMatrix();
    },
  },
};
