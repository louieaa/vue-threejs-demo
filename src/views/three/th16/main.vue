<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-20 14:45:11
 * @LastEditors: loueibb
 * @LastEditTime: 2020-09-04 10:26:08
-->
<template>
  <div class="page-th14">
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


export default {
  name: 'th14',
  mixins: [],
  props: {
    prop: {
      type: String,
      default: '',
    },
  },
  components: {
    TabBar,
    Raycaster
  },
  filter: {},
  computed: {},
  data() {
    return {
      tabBar: 'Raycaster',
      tabBarData: [
        {
          label: '点击事件案例',
          value: 'Raycaster',
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
