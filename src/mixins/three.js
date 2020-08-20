/*
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 17:26:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-20 18:29:12
 */
// import { xxx } from '@/xxx';
export default {
  name: '',
  mixins: [],
  props: {
  },
  components: {
  },
  filter: {
  },
  computed: {
    cameraParams(){ // 相机参数
      return {
        fov:45,// 角度 最小值为0，最大值为180，默认值为50，实际项目中一般都定义45
        aspect: this.w / this.h, // 宽高比
        near:1, // 近面
        far:1000 // 远面
      }
    }
  },
  data() {
    return {
      test:2,
      scene:null, // 场景
      camera:null, // 相机
      renderer:null, // 渲染
      control:null, // 控制器
      container:null, // dom节点
      gap:100, // 缺口
      w:window.innerWidth,
      h:window.innerHeight,
    };
  },
  watch: {
  },
  // life cycle start
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.handleGetWindowInner();
    window.addEventListener( 'resize', this.onWindowResize, false );
  },
  beforeDestroy() {},
  destroyed() {},
  // life cycle end
  methods: {
    handleGetWindowInner(){
      this.w = window.innerWidth - this.gap
      this.h = window.innerHeight- this.gap
    },
    onWindowResize() {
      this.handleGetWindowInner();
      this.camera.aspect = this.w / this.h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( this.w, this.h );
    },
  },
};