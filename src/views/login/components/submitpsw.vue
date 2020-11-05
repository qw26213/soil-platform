<template>
  <div class>
    <div class="inputPosition">
      <el-form ref="form" :model="form" :rules="passwordRules" label-position="left" :label-width="'106px'">
        <el-form-item label="输入新密码：" prop="pass">
          <el-input v-model="form.pass" type="password" />
        </el-form-item>
        <el-form-item label="确认新密码：" prop="repass">
          <el-input v-model="form.repass" type="password" />
        </el-form-item>
      </el-form>
    </div>
    <el-button @click="submit" type="primary" class="nextButton">确认修改</el-button>
  </div>
</template>
<script>
import { submitPassword } from '@/api/user'
export default {
  name: 'newPassword',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入6位数以上的密码'))
      } else {
        if (this.form.repass !== '') {
          this.$refs.form.validateField('repass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        pass: '',
        repass: ''
      },
      passwordRules: {
        pass: [
          {
            required: true,
            validator: validatePass,
            trigger: 'change'
          }
        ],
        repass: [
          {
            required: true,
            validator: validatePass2,
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save()
        } else {
          return false
        }
      })
    },
    save() {
      const obj = {
        phone: this.$parent.phone,
        password: this.form.pass
      }
      submitPassword(obj).then(res => {
        if (res.code == 201) {
          this.$message.success('密码找回成功!')
          setTimeout(() => {
            this.$router.replace('/login')
          }, 1800)
        } else {
          this.$message.error(res.msg)
        }
      })
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
