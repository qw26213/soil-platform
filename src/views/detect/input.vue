<template>
  <div class="mainPage">
    <div class="filterDiv clearfix">
      <span class="label">土壤密封袋：</span>
      <el-input v-model.trim="sample_code" size="mini" style="width:240px" placeholder="土壤密封袋ID" />
      <span class="label" style="margin-left:12px">实验室：</span>
      <el-select v-model="dected_org" filterable size="mini" class="phoneWidth" placeholder="全部">
        <el-option v-for="item in org_list" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <span class="label" style="margin-left:12px">检测日期：</span>
      <el-select v-model="dected_org" filterable size="mini" class="phoneWidth" placeholder="全部">
        <el-option v-for="item in org_list" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-button type="primary" style="float:right" size="small" @click="save">保存</el-button>
    </div>
    <div class="contentDiv">
      <table style="width:100%">
        <tr>
          <td>全氮(%)</td>
          <td>
            <input class="inputcell" v-model="form.TN" />
          </td>
          <td>cec(me/100g)</td>
          <td>
            <input class="inputcell" v-model="form.CEC" />
          </td>
          <td>苯并[α]芘</td>
          <td>
            <input class="inputcell" v-model="form.BAP" />
          </td>
          <td>有效铜</td>
          <td>
            <input class="inputcell" v-model="form.ECU" />
          </td>
        </tr>
        <tr>
          <td>碱解氮(mg/kg)</td>
          <td>
            <input class="inputcell" v-model="form.ALN" />
          </td>
          <td>PH(mg/kg)</td>
          <td>
            <input class="inputcell" v-model="form.PH" />
          </td>
          <td>镉</td>
          <td>
            <input class="inputcell" v-model="form.CD" />
          </td>
          <td>有效锌</td>
          <td>
            <input class="inputcell" v-model="form.EZN" />
          </td>
        </tr>
        <tr>
          <td>速效氮(mg/kg)</td>
          <td>
            <input class="inputcell" v-model="form.EN" />
          </td>
          <td>有机质(mg/kg)</td>
          <td>
            <input class="inputcell" v-model="form.Organic" />
          </td>
          <td>汞</td>
          <td>
            <input class="inputcell" v-model="form.HG" />
          </td>
          <td>有效铁</td>
          <td>
            <input class="inputcell" v-model="form.EFE" />
          </td>
        </tr>
        <tr>
          <td>全磷(%)</td>
          <td>
            <input class="inputcell" v-model="form.TP" />
          </td>
          <td>铵态氮(mg/kg)</td>
          <td>
            <input class="inputcell" v-model="form.AMN" />
          </td>
          <td>砷</td>
          <td>
            <input class="inputcell" v-model="form.AS" />
          </td>
          <td>有效锰</td>
          <td>
            <input class="inputcell" v-model="form.EM" />
          </td>
        </tr>
        <tr>
          <td>速效磷(mg/kg)</td>
          <td>
            <input class="inputcell" v-model="form.SP" />
          </td>
          <td>硝态氮(mg/kg)</td>
          <td>
            <input class="inputcell" v-model="form.Nitrate" />
          </td>
          <td>铅</td>
          <td>
            <input class="inputcell" v-model="form.PB" />
          </td>
          <td>有效硼</td>
          <td>
            <input class="inputcell" v-model="form.EB" />
          </td>
        </tr>
        <tr>
          <td>有效磷(mg/kg)</td>
          <td>
            <input class="inputcell" v-model="form.EP" />
          </td>
          <td>亚硝酸盐氮(mg/kg)</td>
          <td>
            <input class="inputcell" v-model="form.NN" />
          </td>
          <td>铬</td>
          <td>
            <input class="inputcell" v-model="form.CR" />
          </td>
          <td>有效硅</td>
          <td>
            <input class="inputcell" v-model="form.ESI" />
          </td>
        </tr>
        <tr>
          <td>全钾(mg/kg)</td>
          <td>
            <input class="inputcell" v-model="form.TK" />
          </td>
          <td>氨氮(mg/kg)</td>
          <td>
            <input class="inputcell" v-model="form.AN" />
          </td>
          <td>铜</td>
          <td>
            <input class="inputcell" v-model="form.CU" />
          </td>
          <td>有效硫</td>
          <td>
            <input class="inputcell" v-model="form.ES" />
          </td>
        </tr>
        <tr>
          <td>缓效钾(mg/kg)</td>
          <td>
            <input class="inputcell" v-model="form.SK" />
          </td>
          <td>六六六总量</td>
          <td>
            <input class="inputcell" v-model="form.BHC" />
          </td>
          <td>锌</td>
          <td>
            <input class="inputcell" v-model="form.ZN" />
          </td>
          <td>有效钼</td>
          <td>
            <input class="inputcell" v-model="form.EMO" />
          </td>
        </tr>
        <tr>
          <td>速效钾(mg/kg)</td>
          <td>
            <input class="inputcell" v-model="form.RK" />
          </td>
          <td>滴滴涕总量(mg/kg)</td>
          <td>
            <input class="inputcell" v-model="form.DDT" />
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import { detect_result_entry, detect_org } from '@/api/detect'
export default {
  data() {
    return {
      org_list: [],
      sample_code: '',
      dected_org: '',
      form: {
        TN: '',
        CEC: '',
        BAP: '',
        ECU: '',
        ALN: '',
        PH: '',
        CD: '',
        EZN: '',
        EN: '',
        Organic: '',
        HG: '',
        EFE: '',
        TP: '',
        AMN: '',
        AS: '',
        EM: '',
        SP: '',
        Nitrate: '',
        PB: '',
        EB: '',
        EP: '',
        NN: '',
        CR: '',
        ESI: '',
        TK: '',
        AN: '',
        CU: '',
        ES: '',
        SK: '',
        BHC: '',
        ZN: '',
        EMO: '',
        RK: '',
        DDT: ''
      }
    }
  },
  mounted() {
    detect_org().then(res => {
      this.org_list = res.data
    })
  },
  methods: {
    cellStyle(row, column, rowIndex, columnIndex) {
      return row.columnIndex == '5' ? 'color: #7BDD92;' : ''
    },
    headerCellStyle() {
      return 'color:#333333;'
    },
    isAllRequire() {
      var flag = false
      for (const key in this.form) {
        if (this.form[key]) {
          flag = true
        }
      }
      return flag
    },
    save() {
      if (this.sample_code == '') {
        this.$message.warning('土壤密封袋ID必须录入！')
        return
      }
      if (this.dected_org == '') {
        this.$message.warning('请选择实验室！')
        return
      }
      const result = this.isAllRequire()
      if (!result) {
        this.$message.warning('请至少录入一项检测数据！')
        return
      }
      detect_result_entry(this.form).then(res => {
        if (res.code === 201) {
          this.dected_org = ''
          this.sample_code = ''
          for (const key in this.form) {
            this.form[key] = ''
          }
          this.$message.success('结果录入成功！')
        } else {
          this.$message.warning(res.msg)
        }
      })
    }
  }
}
</script>
<style scoped>
table tr td {
  padding: 5px 0;
}

.maxHigh {
  min-height: calc(100vh - 120px);
}

.inputcell {
  display: block;
  width: 120px;
  border: 1px #ccc solid;
  padding-left: 5px;
  height: 32px;
  border-radius: 4px;
}
</style>