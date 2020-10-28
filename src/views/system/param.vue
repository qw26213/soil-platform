<template>
    <div class="mainPage">
        <div class="filterDiv">
            <span class>选择区域：</span>
            <el-select v-model="province" size="mini" class="phoneWidth" @change="changeProvince()" placeholder="省(直辖市)：">
                <el-option v-for="e in provinceList" :key="e.code" :label="e.name" :value="e.code" />
            </el-select>
            <el-select v-model="city" size="mini" class="phoneWidth" @change="changeCity()" placeholder="市：">
                <el-option v-for="e in cityList" :key="e.code" :label="e.name" :value="e.code" />
            </el-select>
            <el-select v-model="county" size="mini" class="phoneWidth" @change="changeCounty()" placeholder="区(县)：">
                <el-option v-for="e in countyList" :key="e.code" :label="e.name" :value="e.code" />
            </el-select>
            <el-select v-model="town" size="mini" class="phoneWidth" @change="changeTown()" placeholder="镇乡：">
                <el-option v-for="e in townList" :key="e.code" :label="e.name" :value="e.code" />
            </el-select>
            <el-button type="primary" size="mini" @click="getList">查询</el-button>
        </div>
        <el-row :gutter="20">
            <el-col :span="4">
                <div style="padding: 20px;border-radius:4px;background:#fff">
                    <div style="font-size:14px;margin-bottom: 10px;font-weight: bold">地区参数配置</div>
                    <el-form ref="dataForm" :rules="rules" :model="form" label-width="70px" label-position="top">
                        <el-form-item label="规划采集半径(m)" prop="plan_rang">
                            <el-input size="small" v-model="form.plan_rang" />
                        </el-form-item>
                        <el-form-item label="关联采集半径(m)" prop="relat_rang">
                            <el-input size="small" v-model="form.relat_rang" />
                        </el-form-item>
                        <el-form-item label="飘移阈值(m)" prop="drift_value">
                            <el-input size="small" v-model="form.drift_value" />
                        </el-form-item>
                        <el-form-item label="初次发布半径(m)" prop="publish">
                            <el-input size="small" v-model="form.publish" />
                        </el-form-item>
                        <el-form-item label="再次发布半径(m)" prop="publish_increa">
                            <el-input size="small" v-model="form.publish_increa" />
                        </el-form-item>
                        <div style="text-align:center">
                            <el-button type="primary" @click="saveParam">确认修改</el-button>
                        </div>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="20">
                <div class="contentDiv">
                    <el-table :data="tableData" resize :header-cell-style="{color:'#333'}">
                        <el-table-column prop="area_code" label="地区" align="left" />
                        <el-table-column prop="plan_rang" label="规划采集半径" align="center" />
                        <el-table-column prop="relat_rang" label="关联采集半径" align="center" />
                        <el-table-column prop="drift_value" label="飘移阈值" align="center" />
                        <el-table-column prop="publish" label="初次发布半径" align="center" />
                        <el-table-column prop="publish_increa" label="再次发布半径" align="center" />
                        <el-table-column prop="creater" label="修改人" align="center" />
                        <el-table-column prop="user_date" label="修改日期" align="center" />
                    </el-table>
                    <pagination v-if="totalPage>10" :total="totalPage" :page.sync="page" :limit.sync="pageSize" @pagination="getList" />
                </div>
            </el-col>
        </el-row>
    </div>
    </div>
</template>
<script>
import { get_city } from '@/api/collect.js'
import { getParam, updateParam } from '@/api/system.js'
export default {
    data() {
        return {
            form: {
                area_code: '',
                plan_rang: '20',
                relat_rang: '50',
                drift_value: '10',
                publish: '',
                publish_increa: ''
            },
            rules: {
                plan_rang: [{ required: true, message: '规划采集半径不能为空', trigger: 'change' }],
                relat_rang: [{ required: true, message: '关联采集半径不能为空', trigger: 'change' }],
                drift_value: [{ required: true, message: '飘移阈值不能为空', trigger: 'change' }],
                publish: [{ required: true, message: '初次发布半径不能为空', trigger: 'change' }],
                publish_increa: [{ required: true, message: '再次发布半径不能为空', trigger: 'change' }]
            },
            tableData: [],
            // 分页
            page: 1,
            pageSize: 10,
            totalPage: 0,
            // 多级联动的参数
            // 省市级选择
            provinceList: [],
            province: '',
            // 市级
            cityList: [],
            city: '',
            // 县级
            countyList: [],
            county: '',
            // 镇
            townList: [],
            town: ''
        }
    },
    mounted() {
        this.getList()
        this.getProvince()
    },
    methods: {
        getList() {
            console.log("1111")
            this.page = 1
            getParam().then(res => {
                this.tableData = res.data
            })
        },
        saveParam() {
            this.$refs.dataForm.validate((valid) => {
                if (valid) {
                    updateParam(this.form).then(res => {
                        this.$message.success('参数已更新')
                    })
                }
            })
        },
        async getProvince() {
            let res = await get_city({})
            this.provinceList = res.data
        },
        // 改变了省级
        async changeProvince() {
            this.getdeport_name({ top_area: this.province })
            this.cityList = this.countyList = this.townList = this.villageList = []
            this.city = this.county = this.town = this.village = ''
            let res = await get_city({
                parent_id: this.province
            })
            this.cityList = res.data
        },
        // 改变了市级
        async changeCity() {
            this.countyList = this.townList = this.villageList = []
            this.county = this.town = this.village = ''
            let res = await get_city({
                parent_id: this.city
            })
            this.countyList = res.data
        },
        // 改变了县级
        async changeCounty() {
            this.townList = this.villageList = []
            this.town = this.village = ''
            let res = await get_city({
                parent_id: this.county
            })
            this.townList = res.data
        },
        // 改变了镇级
        async changeTown() {
            this.villageList = []
            this.village = ''
            let res = await get_city({
                parent_id: this.town
            })
            this.villageList = res.data
        },
        toPage(url) {
            this.$router.push(url)
        }
    }
}
</script>
<style lang="scss" scoped>
>>>.el-form-item--medium .el-form-item__label {
    line-height: 24px;
}

>>>.el-form--label-top .el-form-item__label {
    padding: 0
}

.maxHigh {
    min-height: calc(100vh - 120px);
}

.inputWidth {
    width: 120px;
}

.phoneWidth {
    width: 160px;
    margin-right: 10px;
}

.areaWidth {
    width: 200px;
}

.yellow {
    background-color: #ffca00;
    border: 1px solid #ffca00;
}
</style>