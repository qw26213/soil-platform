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
                    <el-form ref="form" :model="form" label-width="70px">
                        <el-form-item label="活动名称">
                            <el-input size="small" v-model="form.name" />
                        </el-form-item>
                        <el-form-item label="活动名称">
                            <el-input size="small" v-model="form.name" />
                        </el-form-item>
                        <el-form-item label="活动名称">
                            <el-input size="small" v-model="form.name" />
                        </el-form-item>
                        <el-form-item label="活动名称">
                            <el-input size="small" v-model="form.name" />
                        </el-form-item>
                        <el-form-item label="活动名称">
                            <el-input size="small" v-model="form.name" />
                        </el-form-item>
                        <div style="text-align:center">
                            <el-button type="primary" @click="saveParam">确认修改</el-button>
                        </div>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="20">
                <div class="contentDiv">
                    <el-table :data="tableData" resize :header-cell-style="headerCellStyle">
                        <el-table-column prop="user_addr" label="地区" align="left" />
                        <el-table-column prop="user_name" label="规划采集半径" align="center" />
                        <el-table-column prop="user_phone" label="关联采集半径" align="center" />
                        <el-table-column prop="user_name" label="飘移阈值" align="center" />
                        <el-table-column prop="user_role" label="初次发布半径" align="center" />
                        <el-table-column prop="task_count" label="再次发布半径" align="center" />
                        <el-table-column prop="user_date" label="修改人" align="center" />
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
                name: ''
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
            this.page = 1
            getParam().then(res => {
                this.tableData = res.data
            })
        },
        saveParam() {
            updateParam(this.form).then(res => {
                this.$message.success('参数已更新')
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
        headerCellStyle() {
            return 'color:#333333;'
        },
        toPage(url) {
            this.$router.push(url)
        }
    }
}
</script>
<style scoped>
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