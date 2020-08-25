<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-25 14:56:46
-->
<template>
  <div class="page-th11">
    <h3>Camera相机</h3>
    <el-row class="tool">
      <tab-bar  v-model="tabBar" :tabBarData="tabBarData"></tab-bar>
    </el-row>
    <!-- 动态组件 -->
    <component :is="tabBar"></component>
  </div>
</template>
 
<script>
import Camera from './Camera'
import TabBar from './TabBar'
import Control from './Control'

export default {
  name: "th11",
  mixins: [],
  props: {
    prop: {
      type: String,
      default: ""
    }
  },
  components: {
    Camera,
    TabBar,
    Control
  },
  filter: {},
  computed: {
  },
  data() {
    return {
      tabBar: 'Control',
      tabBarData: [
        {
          label: '正交相机和透视相机的对比',
          value: 'Camera'
        }, {
          label: '控制相机移动案例',
          value: 'Control'
        }
      ]
    };
  },
  watch: {},
  // life cycle start
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
  },
  beforeDestroy() {

  },
  destroyed() {},
  // life cycle end
  methods: {
    
  }
};
</script>
 
<style lang="scss">
.tool {
  margin: 10px;
}
</style> 