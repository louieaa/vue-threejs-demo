<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-31 10:22:15
-->
<template>
  <div class="page-th14">
    <h3>动画案例</h3>
    <el-row class="tool">
      <tab-bar  v-model="tabBar" :tabBarData="tabBarData"></tab-bar>
    </el-row>
    <!-- 动态组件 -->
    <component :is="tabBar"></component>
  </div>
</template>
 
<script>
import MorphTargets from './MorphTargets'
import TabBar from '../components/TabBar'
import Skeleton from './Skeleton'
import SkeletonAnimation from './SkeletonAnimation'
import MorphAnimation from './MorphAnimation'

export default {
  name: "th14",
  mixins: [],
  props: {
    prop: {
      type: String,
      default: ""
    }
  },
  components: {
    SkeletonAnimation,
    MorphAnimation,
    MorphTargets,
    TabBar,
    Skeleton
  },
  filter: {},
  computed: {
  },
  data() {
    return {
      tabBar: 'MorphAnimation',
      tabBarData: [
        {
          label: '变形动画案例',
          value: 'MorphTargets'
        }, {
          label: '骨骼动画实现案例',
          value: 'Skeleton'
        }, {
          label: 'GLTF模型动画案例',
          value: 'SkeletonAnimation'
        }, {
          label: 'JSON模型动画案例',
          value: 'MorphAnimation'
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