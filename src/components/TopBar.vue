<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:34:17
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-11 17:42:41
-->
<template>
  <div class="component-top-bar">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      @open="handleOpen"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item @click="x => this.$router.push({ path: '/' })" index="0"
        >home</el-menu-item
      >
      <el-submenu :index="ix + 1 + ''" v-for="(i, ix) in topData" :key="ix">
        <template slot="title">{{ i.name }}</template>
        <el-menu-item
          :index="`${ix + 1}-${idx}`"
          v-for="(x, idx) in i.children"
          @click="hfun1(x)"
          :key="idx"
          >{{ x.name }}</el-menu-item
        >
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { concat } from "@/routes/src/routes";
export default {
  name: "TopBar",
  props: {},
  data() {
    return {
      topData: concat,
      activeIndex: "2-1"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    hfun1(x) {
      this.$router.push({ path: x.path });
    },
    handleOpen() {}
  },
  created() {
    // this.$router.push({ path: "/" });
    this.handleOpen();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
