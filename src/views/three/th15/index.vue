<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-31 15:34:54
-->
<template>
  <div class="page-th15">
    <h3>Tween补间动画</h3>
    <el-row class="tool">
      <tab-bar  v-model="tabBar" :tabBarData="tabBarData"></tab-bar>
    </el-row>
    <!-- 动态组件 -->
    <component :is="tabBar"></component>
  </div>
</template>
 
<script>
import Simple from './Simple'
import Chain from './Chain'
import Repeat from './Repeat'
import TabBar from '../components/TabBar'

export default {
  name: "th15",
  mixins: [],
  props: {
    prop: {
      type: String,
      default: ""
    }
  },
  components: {
    Simple,
    TabBar,
    Chain,
    Repeat
  },
  filter: {},
  computed: {
  },
  data() {
    return {
      tabBar: 'Simple',
      tabBarData: [
        {
          label: 'Tween简单应用案例',
          value: 'Simple'
        }, {
          label: 'Tween链式调用案例',
          value: 'Chain'
        }, {
          label: 'Tween循环案例',
          value: 'Repeat'
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