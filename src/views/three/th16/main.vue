<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-09-07 11:07:14
-->
<template>
  <div class="page-th16">
    <h3>场景交互</h3>
    <el-row class="tool">
      <tab-bar v-model="tabBar" :tabBarData="tabBarData"></tab-bar>
    </el-row>
    <!-- 动态组件 -->
    <component :is="tabBar"></component>
  </div>
</template>

<script>
import TabBar from '../components/TabBar';
import Raycaster from './Raycaster'
import Boxselection from './Boxselection'


export default {
  name: 'th16',
  mixins: [],
  props: {
    prop: {
      type: String,
      default: '',
    },
  },
  components: {
    TabBar,
    Raycaster,
    Boxselection
  },
  filter: {},
  computed: {},
  data() {
    return {
      tabBar: 'Boxselection',
      tabBarData: [
        {
          label: '点击事件案例',
          value: 'Raycaster',
        },
        {
          label: '框选案例',
          value: 'Boxselection',
        }
      ],
    };
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
  methods: {},
};
</script>

<style lang="scss">
.tool {
  margin: 10px;
}
</style>
