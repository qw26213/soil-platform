<template>
  <div class="position_relate">
    <img src="../../assets/backImg.jpg" class="fill_w" />
    <img src="../../assets/loginlogo.png" class="position_absolute logo" />
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>
<style lang="scss" scoped>
.logo {
  top: 25px;
  left: 36px;
}
</style>
