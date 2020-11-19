<template>
  <div class="main">
    <img src="../../assets/loginlogo.png" class="logo" />
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>
<style scoped>
.main{width: 100%;min-height: 700px;background:url(../../assets/backImg.jpg);background-size: cover;position: relative;}
.logo {
  position: absolute;
  top: 25px;
  left: 36px;
}
</style>
