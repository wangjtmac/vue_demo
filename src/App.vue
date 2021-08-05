<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/directive">directive</router-link> |
      <router-link to="/charts">charts</router-link> |
      <router-link to="/highchart">highchart</router-link> |
      <router-link to="/relation">relation</router-link> |
      <router-link to="/jsplumb">jsplumb</router-link> |
      <router-link to="/echarts">echarts</router-link> |
      <router-link to="/editor">editor</router-link> |
    </div>
    <router-view/>
  </div>
</template>
<script>
  export default {
    created() {

    }
  }
</script>
<style scoped>
@import "../public/css/reset.css";
@import "../public/css/zxx.lib.css";
</style>
