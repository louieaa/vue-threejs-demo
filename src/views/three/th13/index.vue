<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-28 11:47:41
-->
<template>
  <div class="page-th13">
    <h3>controls控制器</h3>
    <el-row class="tool">
      <tab-bar  v-model="tabBar" :tabBarData="tabBarData"></tab-bar>
    </el-row>
    <!-- 动态组件 -->
    <component :is="tabBar"></component>
  </div>
</template>
 
<script>
import OrbitControls from './OrbitControls'
import TabBar from '../components/TabBar'
import DeviceOrientationControls from './DeviceOrientationControls'

export default {
  name: "th13",
  mixins: [],
  props: {
    prop: {
      type: String,
      default: ""
    }
  },
  components: {
    OrbitControls,
    TabBar,
    DeviceOrientationControls
  },
  filter: {},
  computed: {
  },
  data() {
    return {
      tabBar: 'OrbitControls',
      tabBarData: [
        {
          label: 'OrbitControls',
          value: 'OrbitControls'
        }, {
          label: '陀螺仪控制器案例',
          value: 'DeviceOrientationControls'
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