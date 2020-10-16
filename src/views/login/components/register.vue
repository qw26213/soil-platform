<template>
  <div class="login_pos position_absolute flex flex_dir_col ali_center">
    <div class="login_pos-main flex jus_center">
      <div class="main-left flex flex_dir_col ali_center">
        <img src="../../../assets/loginImg/zhuce-copy.png" class="main-left-img" />
        <p>申请注册:</p>
      </div>

      <!-- 填写注册信息 -->
      <div v-if="pageCurrent == 1" class="login-main">
        <div class="flex">
          <p class="flex1"></p>
          <p class="return" style="cursor:pointer" @click="$router.replace('/login')">返回</p>
        </div>
        <el-form ref="dataForm" :model="dataForm" :rules="registeredRules" :label-position="labelPosition" :label-width="'100px'" class="login-form">
          <el-form-item label="用户名：" prop="user_name">
            <el-input v-model="dataForm.user_name" placeholder="请输入用户名" :maxlength="12" />
          </el-form-item>
          <el-form-item label="邮箱：" prop="user_email">
            <el-input v-model="dataForm.user_email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="手机号：" prop="user_phone">
            <el-input v-model="dataForm.user_phone" placeholder="请输入手机号" :maxlength="11" />
          </el-form-item>
          <el-form-item label="验证码：" prop="user_code" class="code-main">
            <el-input v-model="dataForm.user_code" placeholder="请输入验证码" :maxlength="5">
              <el-button v-if="isButton" slot="append" type="mini" style="width:112px" @click="getCode">发送验证码</el-button>
              <el-button v-else slot="append" type="mini" style="width:112px;cursor:default;">{{ time }}秒</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="设置密码：" prop="user_password">
            <el-input show-password v-model="dataForm.user_password" type="password" placeholder="请输入密码" auto-complete="new-password" />
          </el-form-item>
          <!-- <el-form-item label="">
						<el-radio-group v-model="dataForm.role_id">
							<el-radio :label="item.role_id" v-for="(item,i) in  roleList" :key="i" @change="radioChange(item.role_name)">{{item.role_name}}
							</el-radio>
						</el-radio-group>
          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" style="margin-top: 10px;width:330px;" @click="registeredButton">下一步</el-button>
          </el-form-item>
        </el-form>
        <p class="login-button">
          已有账号？
          <span @click="$router.replace('/login')">返回登录</span>
        </p>
      </div>

      <!-- 选择行政区 -->
      <div v-if="pageCurrent == 2" class="login-main flex_dir_row">
        <div class="flex ali_end">
          <p class="col_9B9B9B fon_14 flex1">请选择注册地</p>
          <p class="return" style="cursor:pointer" @click="pageCurrent = 1">返回</p>
        </div>

        <!-- 选择省市 -->
        <div class="cityBox">
          <span class="pad_top_8 fon_14">省（直辖市）：</span>
          <el-select v-model="province" size="medium" class="provinceSelectWidth" @change="changeProvince()">
            <el-option v-for="e in provinceList" :key="e.code" :label="e.name" :value="e.code" />
          </el-select>
          <br />
          <span class="pad_top_8 fon_14">市 ：</span>
          <el-select v-model="city" size="medium" class="provinceSelectWidth" @change="changeCity()">
            <el-option v-for="e in cityList" :key="e.code" :label="e.name" :value="e.code" />
          </el-select>
          <br />
          <span class="pad_top_8 fon_14">城区（县）：</span>
          <el-select v-model="county" size="medium" class="provinceSelectWidth" @change="changeCounty()">
            <el-option v-for="e in countyList" :key="e.code" :label="e.name" :value="e.code" />
          </el-select>
          <br />
          <span class="pad_top_8 fon_14">镇乡 ：</span>
          <el-select v-model="town" size="medium" class="provinceSelectWidth" @change="changeTown()">
            <el-option v-for="e in townList" :key="e.code" :label="e.name" :value="e.code" />
          </el-select>
          <br />
          <span class="pad_top_8 fon_14">村 ：</span>
          <el-select v-model="village" size="medium" class="provinceSelectWidth" @change="changeVillage()">
            <el-option v-for="e in villageList" :key="e.code" :label="e.name" :value="e.code" />
          </el-select>
        </div>
        <el-button type="primary" style="margin-left: 24%; margin-top: 10px;width:260px;" @click="register">注册</el-button>
        <p class="login-button">已有账号？
          <span @click="$router.replace('/login')">返回登录</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { verify, verify_check, regist, userCheck } from '@/api/user'
import { get_city } from '@/api/collect'

export default {
  name: 'register',
  data() {
    const validatePhone = (rule, value, callback) => {
      let phone = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/ //判断用户输入的是否为手机号
      if (!phone.test(value)) {
        callback(new Error('手机号码不合法!'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, cb)=>{
      const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if(reg.test(value)||''===value){
        return cb()
      } else{
        cb(new Error('请输入正确的邮箱'))
      }
    }
    const validateCode = (rule, value, callback) => {
      let code = /^\d{5}$/
      if (!code.test(value)) {
        callback(new Error('验证码不能为空!'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位!'))
      } else {
        callback()
      }
    }
    return {
      pageCurrent: 1,
      labelPosition: 'right',
      dataForm: {
        user_name: '',
        user_email: '',
        user_phone: '',
        user_code: '',
        user_password: '',
        role_id: '001',
        role_name: '普通用户'
      },
      registeredRules: {
        user_name: [{ required: true, trigger: 'change', message: '请输入用户名' }],
        user_email: [{ required: false, trigger: 'change', validator: validateEmail }],
        user_phone: [{ required: true, trigger: 'change', validator: validatePhone }],
        user_code: [{ required: true, trigger: 'change', validator: validateCode }],
        user_password: [{ required: true, trigger: 'change', validator: validatePassword }]
      },
      time: 0,
      isButton: true,
      radio: '001',
      isCode: false,
      isCheckEmail: true,
      isCheckPhone: false,
      // 省市级选择
      provinceList: [],
      province: '',
      provinceName: '',
      // 市级
      cityList: [],
      city: '',
      cityName: '',
      // 县级
      countyList: [],
      county: '',
      countyName: '',
      // 镇
      townList: [],
      town: '',
      townName: '',
      // 村
      villageList: [],
      village: '',
      villageName: ''
    }
  },
  created() {
    // getRole()
  },
  methods: {
    getCode() {
      this.$refs.dataForm.validateField('user_phone', err => {
        if (err) {
          console.log('手机号码不合法')
        } else {
          this.isButton = false
          this.getVerify()
          if (!this.timer) {
            this.time = 60
            this.timer = setInterval(() => {
              if (this.time > 1 && this.time <= 60) {
                this.time--
              } else {
                clearInterval(this.timer)
                this.isButton = true
                this.timer = null
              }
            }, 1000)
          }
        }
      })
    },
    //获取验证码
    getVerify() {
      verify({
        'phone_number': this.dataForm.user_phone
      }).then(res => {
        this.$message.success('验证码已发送到手机！')
      })
    },
    radioChange(v) {
      this.dataForm.role_name = v
    },
    //验证码校验
    async verifyCheck() {
      let res = await verify_check({
        phone_number: this.dataForm.user_phone,
        code: this.dataForm.user_code
      })
      if (res.code == 201) {
          this.pageCurrent = 2
          this.getProvince()
      } else {
        this.$message.error(res.msg)
      }
    },
    //注册
    registeredButton() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.verifyCheck()
        } else {
          return false
        }
      })
    },
    register() {
      regist({
        roles: [
          {
            role_id: this.dataForm.role_id,
            role_name: this.dataForm.role_name
          }
        ],
        status: true,
        email: this.dataForm.user_email,
        password: this.dataForm.user_password,
        phone: this.dataForm.user_phone,
        username: this.dataForm.user_phone, //传手机号码
        nickName: this.dataForm.user_name, //传用户名
        address:
          this.village || this.town || this.county || this.city || this.province // 五级联动的code
      }).then(res => {
      if (res.code == 201) {
        this.$message.success('注册成功!')
        setTimeout(() => {
          this.$router.replace('/login')
        }, 1800)
      }
      })
    },
    // 获取省市级
    async getProvince() {
      console.log('获取省市级')
      let res = await get_city({})
      this.provinceList = res.data
    },
    // 改变了省级
    async changeProvince() {
      this.cityList = this.countyList = this.townList = this.villageList = []
      this.city = this.county = this.town = this.village = ''
      let res = await get_city({
        parent_id: this.province
      })
      this.cityList = res.data

      // 根据code找name
      this.provinceList.map(value => {
        if (value.code == this.province) {
          this.provinceName = value.name
          // 根据名称飞行
        }
      })
    },
    // 改变了市级
    async changeCity() {
      this.countyList = this.townList = this.villageList = []
      this.county = this.town = this.village = ''
      let res = await get_city({
        parent_id: this.city
      })
      this.countyList = res.data

      // 根据code找name
      this.cityList.map(value => {
        if (value.code == this.city) {
          this.cityName = value.name
        }
      })
    },
    // 改变了县级
    async changeCounty() {
      this.townList = this.villageList = []
      this.town = this.village = ''
      let res = await get_city({
        parent_id: this.county
      })
      this.townList = res.data

      // 根据code找name
      this.countyList.map(value => {
        if (value.code == this.county) {
          this.countyName = value.name
          // 根据名称飞行
        }
      })
    },
    // 改变了镇级
    async changeTown() {
      this.villageList = []
      this.village = ''
      let res = await get_city({
        parent_id: this.town
      })
      this.villageList = res.data

      // 根据code找name
      this.townList.map(value => {
        if (value.code == this.town) {
          this.townName = value.name
          // 根据名称飞行
        }
      })
    },
    // 改变了村级
    async changeVillage() {
      // 根据code找name
      this.villageList.map(value => {
        if (value.code == this.village) {
          this.villageName = value.name
          // 根据名称飞行
        }
      })
    }
  }
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
  // width: 70%;
  width: 900px;
  // height: 570px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0px 10px 27px 0px rgba(17, 34, 66, 0.17);
}

.main-left {
  width: 350px;
  background: #528eff;
  border-radius: 4px;
  font-size: 18px;
  color: #fff;

  .main-left-img {
    margin-top: 198px;
  }
}

.login-main {
  width: 650px;
  background-color: #fff;
  padding: 20px 50px;
  position: relative;
}
>>>.el-input-group__prepend{padding: 0}
/deep/ .login-form {
  margin-top: 40px;

  .el-input {
    width: 85%;
  }

  .el-radio__input.is-checked + .el-radio__label {
  }

  .el-radio {
    color: #a8a8a8;
  }

  .el-radio {
    margin-bottom: 10px;
  }

  .el-radio.is-bordered + .el-radio.is-bordered {
    margin-left: 0;
  }
}

.return {
  color: #528eff;
}

.button1 {
  color: #528eff;
  cursor: pointer;
}

.login-button {
  text-align: center;
  font-size: 14px;
  span {
    color: #73a3ff;
    cursor: pointer;
  }
}

.cityBox {
  width: 400px;
  text-align: end;
  margin: 10px 0 30px 0;
  padding: 0 auto;
}

.provinceSelectWidth {
  width: 240px;
  margin: 8px auto;
}
</style>
