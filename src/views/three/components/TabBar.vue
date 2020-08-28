<!-- 
 * 服务接口侧边栏
 * @Author: louiebb 
 * @Date: 2020-08-04 11:10:55 
 * @Last Modified by: louiebb
 * @Last Modified time: 2020-08-04 11:11:18
-->
<template>
<transition>
  <div class="tab-bar-components">
    <el-tabs 
      v-model="activeName"
      tab-position="top" 
      style="height: 100%;">
      <el-tab-pane
      v-for="side in tabBarData"
      :label="side.label" 
      :name="side.value" 
      :key="side.value"></el-tab-pane>
    </el-tabs>
  </div>
</transition>
</template>
<script>
export default {
  name: 'TabBar',
  props: {
    tabBarData: {
      type: Array,
      default: ()=>{
        return [];
      }
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: this.value
    };
  },
  watch: {
    activeName(v) {
      this.$emit('input', v);
    }
  },
  mounted() {
  },
  methods: {
  }
};
</script>

