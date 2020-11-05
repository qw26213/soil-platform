<template>
  <div class="flex flex_dir_col ali_center">
    <el-form ref="form" :model="form" :rules="codeRules" :label-position="labelPosition" :label-width="'80px'" class="phone-code-form">
      <el-form-item label="手机：" prop="user_phone">
        <el-input v-model="form.user_phone" placeholder="请输入找回手机号码" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" tabindex="2" :maxlength="11" auto-complete="new-password" />
      </el-form-item>
      <el-form-item label="验证码：" prop="code" class="phone-code">
        <el-input :maxlength="5" v-model="form.code" placeholder="请输入验证码" />
        <el-button @click="getCode" type="primary" class="phone-code-button" :disabled="disabled">获取验证码</el-button>
      </el-form-item>
      <el-button @click="next" type="primary" class="nextButton">下一步</el-button>
    </el-form>
  </div>
</template>
<script>
import { userCheck, verify, verify_check } from '@/api/user'
export default {
  name: 'methodRetrieving',
  data() {
    const validateCode = (rule, value, callback) => {
      let code = /^\d{5}$/
      setTimeout(() => {
        if (!code.test(value)) {
          callback(new Error('请输入有效的验证码!'))
        } else {
          callback()
        }
      }, 200)
    }
    const validateUsername = (rule, value, callback) => {
      let phone = /^[1][3,4,5,7,8][0-9]{9}$/ //判断用户输入的是否为手机号
      setTimeout(() => {
        if (!phone.test(value)) {
          callback(new Error('请输入有效的手机号码!'))
        } else {
          callback()
        }
      }, 200)
    }
    return {
      form: {
        user_phone: '',
        code: ''
      },
      codeRules: {
        user_phone: [{ required: true, trigger: 'change', validator: validateUsername }],
        code: [{ required: true, trigger: 'change', validator: validateCode }]
      },
      labelPosition: 'left',
      time: 0,
      disabled: false //手机验证码是否可以点击
    }
  },
  methods: {
    getCode() {
      this.timeButton()
    },
    //用户输入完手机失去焦点触发校验
    async handBlurPhone() {
      let phone = /^[1][3,4,5,7,8][0-9]{9}$/ //判断用户输入的是否为手机号
      if (!phone.test(this.form.user_phone)) {
        this.$message({
          message: '请输入有效的手机号码!',
          type: 'error'
        })
        return
      }
      let data = await userCheck({
        register: this.form.user_phone,
        type: 3
      })
      if (data.code == 201) {
        this.$message({
          message: '此手机号可注册用户!',
          type: 'success'
        })
        this.isCheckPhone = true
      } else {
        this.isCheckPhone = false
      }
    },
    timeButton() {
      let phone = /^[1][3,4,5,7,8][0-9]{9}$/ //判断用户输入的是否为手机号
      if (!phone.test(this.form.user_phone)) {
        this.$message({
          message: '请输入有效的手机号码!',
          type: 'error'
        })
        return
      }
      this.disabled = true
      this.$notify({
        title: '已成功发送验证码到手机！',
        message: '如需获取新的验证码，请等待60s后再次点击!',
        type: 'success'
      })
      this.getVerify()
      const TIME_COUNT = 60
      if (!this.timer) {
        this.time = TIME_COUNT
        this.timer = setInterval(() => {
          if (this.time > 0 && this.time <= TIME_COUNT) {
            this.time--
          } else {
            clearInterval(this.timer)
            this.timer = null
            this.disabled = false
          }
        }, 1000)
      }
    },
    //获取验证码
    getVerify() {
      verify({
        phone_number: this.form.user_phone
      })
    },
    //用户输入完验证码触发校验
    next() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.verifyCheck()
        } else {
          return false
        }
      })
    },
    //验证码校验
    async verifyCheck() {
      let data = await verify_check({
        phone_number: this.form.user_phone,
        code: this.form.code
      })
      if (data.code == 201) {
        this.$parent.phone = this.form.user_phone
        this.$parent.activeIndex = 1
      } else {
        this.$message({
          message: data.msg,
          type: 'error'
        })
      }
    }
  }
}
</script>
<style scoped>
.formWidth {
  width: 360px;
}
</style>