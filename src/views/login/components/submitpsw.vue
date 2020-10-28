<template>
  <div class>
    <div class="inputPosition">
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" label-position="left" :label-width="'106px'">
        <el-form-item label="输入新密码：" prop="pass">
          <el-input v-model="passwordForm.pass" type="password" />
        </el-form-item>
        <el-form-item label="确认新密码：" prop="checkPass">
          <el-input v-model="passwordForm.checkPass" type="password" />
        </el-form-item>
      </el-form>
    </div>
    <el-button @click="submit" type="primary" class="nextButton">确认修改</el-button>
  </div>
</template>
<script>
import { userPassword } from '@/api/user'
export default {
  name: 'newPassword',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入6位数以上的密码'))
      } else {
        if (this.passwordForm.checkPass !== '') {
          this.$refs.passwordForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passwordForm: {
        pass: '',
        checkPass: ''
      },
      passwordRules: {
        pass: [
          {
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        checkPass: [
          {
            required: true,
            validator: validatePass2,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          this.userPassword()
        } else {
          return false
        }
      })
    },
    async userPassword() {
      let res = await userPassword({
        user_method: this.$route.query.phone,
        user_password: this.passwordForm.pass
      })
      if (res.code == 201) {
        this.$message.success('密码修改成功!')
        setTimeout(() => {
          this.$router.replace('/login')
        }, 1800)
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>
<style scoped>
.nextButton {
  width: 400px;
}

.inputPosition {
  width: 400px;
  margin: 0px auto;
}
</style>
