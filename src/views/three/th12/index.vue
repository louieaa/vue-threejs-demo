<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-28 10:28:14
-->
<template>
  <div class="page-th12">
    <h3>Sprite精灵和Points粒子</h3>
    <el-row class="tool">
      <tab-bar  v-model="tabBar" :tabBarData="tabBarData"></tab-bar>
    </el-row>
    <!-- 动态组件 -->
    <component :is="tabBar"></component>
  </div>
</template>
 
<script>
import Sprite from './Sprite'
import TabBar from '../components/TabBar'
import Points from './Points'

export default {
  name: "th12",
  mixins: [],
  props: {
    prop: {
      type: String,
      default: ""
    }
  },
  components: {
    Sprite,
    TabBar,
    Points
  },
  filter: {},
  computed: {
  },
  data() {
    return {
      tabBar: 'Sprite',
      tabBarData: [
        {
          label: 'Sprite精灵',
          value: 'Sprite'
        }, {
          label: 'Points粒子',
          value: 'Points'
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