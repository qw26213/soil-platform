<template>
  <div class="login_pos position_absolute flex flex_dir_col ali_center">
    <div class="login_pos-main">
      <p class="return" @click="$router.replace('/login')">返回></p>
      <el-steps :active="valueId" align-center class="steps" size="mini">
        <el-step title="验证手机号"></el-step>
        <el-step title="设置新密码"></el-step>
        <!-- <el-step title="完成"></el-step> -->
      </el-steps>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: 'password',
  data() {
    return {
      valueId: 0
    }
  },
  methods: {}
}
</script>
<style scoped lang="scss">
.login_pos {
  width: 100%;
  top: 130px;
  left: 0;
  z-index: 4;
}

.login_pos-main {
  width: 60%;
  height: 530px;
  padding: 80px;
  transition: 0.3s;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
  position: relative;
  box-sizing: border-box;
  text-align: center;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

.return {
  position: absolute;
  right: 30px;
  top: 0;
  cursor: pointer;
  color: #528eff;
}

/deep/ .steps {
  width: 100%;
  margin-bottom: 80px;

  .el-step__icon-inner {
    display: none;
  }

  .el-step__line {
    background-color: #528dff;
    width: 80%;
    left: 60%;
  }

  .el-step__title.is-process {
    font-weight: 400;
    font-size: 16px;
  }

  .el-step__head.is-process {
    .el-step__icon {
      background-color: #528dff;
      border-color: #528dff;
    }
  }

  .el-step__main {
    .el-step__title.is-process {
      color: #333;
    }
  }

  .el-step__head.is-wait {
    .el-step__icon.is-text {
      border-color: #528dff;
    }
  }
}

/deep/ .nextButton {
  width: 360px;
  height: 50px;
  font-size: 18px;
  background-color: #3c7fff;
  border-color: #3c7fff;
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translate(-50%, 0);

  &:hover {
    background-color: #90b6ff;
    border-color: #90b6ff;
  }

  &:focus {
    background-color: #3c7fff;
    border-color: #3c7fff;
  }
}

/deep/ .login-form {
  width: 60%;

  .code-main {
    width: 66%;

    img {
      position: absolute;
      right: -100px;
      height: 100%;
      width: 80px;
    }

    .handButtonCode {
      position: absolute;
      right: -165px;
      top: 0;
      cursor: pointer;
      font-size: 16px;
      color: #9f9f9f;

      &:hover {
        color: #3c7fff;
      }
    }
  }
}

/deep/ .password-form {
  width: 50%;
  margin-left: 10%;
}

/deep/ .phone-code-form {
  width: 360px;

  .phone-top {
    width: 100%;
    text-align: left;
    margin-bottom: 20px;

    span:nth-child(1) {
      width: 80px;
    }
  }

  .phone-code {
    width: 210px;

    .phone-code-button {
      position: absolute;
      position: absolute;
      right: -150px;
    }
  }
}
</style>