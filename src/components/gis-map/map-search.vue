<template>
  <div class="map-search">
    <el-input 
      v-model="keywords" 
      placeholder="请输入内容" 
      class="input-with-select"
      clearable
      @keyup.enter.native="search()">
      <el-button 
        slot="append" 
        icon="el-icon-search"
        @click="search()"/>
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    map: {
      type: Object,
      default: () => {
        return window.map;
      }
    }
  },
  data() {
    return {
      keywords: ''
    };
  },
  computed: {},
  watch: {},
  mounted() {
    const that = this;
    setTimeout(function() {
      that.init();
    }, 1000);
  },
  methods: {
    init() {
      // this.initMap();
    },
    search() {
      const that = this;
      console.log(that.keywords);
    }
  }
};
</script>

<style scoped lang="scss">
$main-color: #409eff;
$padding: 20px;
$border-radius: 4px;
.map-search {
  position: absolute;
  top: $padding * 1.5;
  left: $padding * 1.5;
  z-index: 99;
  width: 350px;
}
</style>

<style lang="scss">
$main-color: #409eff;
.el-input-group__append {
  background-color: $main-color;
  border: 1px solid $main-color;
  color: white;
}
</style>
