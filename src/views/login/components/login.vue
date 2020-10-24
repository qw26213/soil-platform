<template>
  <div class="login_pos position_absolute flex flex_dir_col ali_center">
    <div class="fon_24 col_ffffff">欢迎登录土壤采集管理系统</div>
    <el-card shadow="hover" class="login-main" :body-style="{ padding: '30px' }">
      <p class="login-main-title">系统登入</p>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item label prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input ref="username" v-model="loginForm.username" placeholder="登录手机号/邮箱" tabindex="1" autocomplete="on" />
        </el-form-item>
        <el-form-item label prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input ref="password" v-model="loginForm.password" type="password" placeholder="登录密码" tabindex="2" autocomplete="on" @keyup.enter.native="handleLogin" />
        </el-form-item>
      </el-form>
      <div class="login-main-remember-password flex">
        <div style="opacity:0;flex:1">记住密码</div>
        <!-- <el-checkbox v-model="checked" style="margin-right:8px"></el-checkbox> -->
        <!-- <span class="fon_16 flex1 cursor" @click="checked = !checked">记住密码</span> -->
        <div class="forget" @click="toPath('/forgetpsw')">忘记密码？</div>
      </div>
      <el-button type="primary" @click="handleLogin" :loading="loading">登录</el-button>
      <div class="login-main-registered flex jus_center">
        <div>没有账号？</div>
        <div class="registered" @click="toPath('/register')">申请注册</div>
      </div>
    </el-card>
    <div class="botomTxt">Copyright@2018 北京山水云图科技有限公司 All Rights Reserved  ——试用版2.0.1</div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data() {
    const validateUser = (rule, value, callback) => {
      const rep = new RegExp(
        '(^[\\w.\\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\\.)+[a-z]{2,3}$)|(^1[3|4|5|8]\\d{9}$)'
      )
      if (value === '') {
        callback(new Error('请输入登录手机号或邮箱!'))
      } else if (!rep.test(value)) {
        callback(new Error('手机号或邮箱格式不正确！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入登录密码!'))
      } else if (value.length < 6) {
        callback(new Error('登录密码不能少于6位!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        remember: ''
        // type: '2' //用户登陆名称类型（2、手机号登录 ；3、邮箱登录）
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            validator: validateUser
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }
        ]
      },
      loading: false,
      checked: false
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // 是否选择了记住密码
          this.loginForm.remember = this.checked
          this.$store.dispatch('user/login', this.loginForm).then(() => {
              this.$router.replace('/')
              this.loading = false
            }).catch(err => {
              console.log(err)
              this.loading = false
              this.$message.warning(err)
            })
        } else {
          this.loading = false
          return false
        }
      })
    },
    toPath(str) {
      this.$router.push(str)
    }
  }
}
</script>
<style lang="scss" scoped>
.login_pos {
  width: 100%;
  top: 130px;
  left: 0;
  z-index: 4;
}

.svg-container {
  padding: 6px 5px 6px 15px;
  color: #666;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

.login-main {
  font-size: 16px;
  margin-top: 30px;
  width: 480px;
  .login-main-title {
    font-size: 18px;
    color: #a8a8a9;
    margin-bottom: 40px;
  }
}
/deep/.el-form-item {
  position: realtive;
}
/deep/ .login-form {
  margin-bottom: 40px;

  .el-form-item:first-child {
    margin-bottom: 30px;
  }

  .el-input__prefix {
    left: 25px;

    .el-input__icon {
      color: #c2c2c2;
    }
  }

  input {
    padding-left: 50px;
    height: 50px;
    line-height: 60px;
  }
}

/deep/ .login-main-remember-password {
  color: #c2c2c2;
  margin-bottom: 14px;

  .el-checkbox {
    line-height: 22px;

    .el-checkbox__input {
      vertical-align: sub;
    }

    .el-checkbox__inner {
      width: 18px;
      height: 18px;

      &:after {
        height: 12px;
        left: 4px;
        top: 0px;
        width: 6px;
      }
    }

    .el-checkbox__label {
      color: #c2c2c2;
    }
  }

  .forget {
    cursor: pointer;

    &:hover {
      color: #528dff;
    }
  }
}

/deep/ .el-button {
  margin-bottom: 40px;
  width: 100%;
  height: 50px;
  background-color: #3c7fff;
  border-color: #3c7fff;
  font-size: 18px;

  &:hover,
  &:focus {
    background-color: #90b6ff;
    border-color: #90b6ff;
  }
}

.login-main-registered {
  color: #c2c2c2;

  .registered {
    color: #528dff;
    cursor: pointer;
  }
}
</style>
<style>
  .botomTxt{font-size: 12px;color: #666;position: fixed;bottom: 5px;line-height: 24px;text-align: center; width: 100%;left: 0;}
</style>