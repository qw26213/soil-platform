<template>
    <div class="mainPage">
        <div class="filterDiv">
            <span>志愿者:</span>
            <el-input size="mini" placeholder="志愿者姓名" v-model="vName" class="phoneWidth" />
            <!-- <span>手机号：</span> -->
            <!-- <el-input size="mini" placeholder="手机号码" v-model="vPhone" class="phoneWidth" /> -->
            <span style="margin-left:10px">所在区域:</span>
            <el-select v-model="province" size="mini" class="phoneWidth" @change="changeProvince()" placeholder="省(直辖市)：">
                <el-option v-for="e in provinceList" :key="e.code" :label="e.name" :value="e.code" />
            </el-select>
            <el-select v-model="city" size="mini" class="phoneWidth" @change="changeCity()" placeholder="市：">
                <el-option v-for="e in cityList" :key="e.code" :label="e.name" :value="e.code" />
            </el-select>
            <el-select v-model="county" size="mini" class="phoneWidth" @change="changeCounty()" placeholder="县(区)：">
                <el-option v-for="e in countyList" :key="e.code" :label="e.name" :value="e.code" />
            </el-select>
            <el-select v-model="town" size="mini" class="phoneWidth" @change="changeTown()" placeholder="镇/乡：">
                <el-option v-for="e in townList" :key="e.code" :label="e.name" :value="e.code" />
            </el-select>
            <el-select v-model="village" size="mini" class="phoneWidth" @change="changeVillage()" placeholder="村：">
                <el-option v-for="e in villageList" :key="e.code" :label="e.name" :value="e.code" />
            </el-select>
            <el-button type="primary" size="mini" @click="clickSearch">查询</el-button>
        </div>
        <div class="back_ffffff bor_rad_8 pad_top_14 pad_lef_14 mar_top_10">
            <el-table :cell-style="cellStyle" :data="tableData" style="width: 100%" :header-cell-style="headerCellStyle">
                <el-table-column prop="user_name" label="姓名" width="150" />
                <el-table-column prop="user_phone" label="联系电话" align="center" />
                <el-table-column prop="id" label="ID" align="center" />
                <el-table-column prop="user_address" label="地址" show-overflow-tooltip />
                <el-table-column prop="task_count" label="任务总数" align="center" />
                <el-table-column prop="task_perform_count" label="完成数量" align="center" />
                <el-table-column label="操作" align="center" width="120">
                    <template slot-scope="{row}">
                        <el-button type="text" @click="toPage(`./peopledetail?id=${row.id}&user_name=${row.user_name}&user_address=${row.user_address}`)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-if="totalPage>10" :total="totalPage" :page.sync="page" :limit.sync="pageSize" @pagination="getVolunteerList" />
        </div>
    </div>
</template>
<script>
import { volunteerList, get_city } from "@/api/collect.js"
import Pagination from '@/components/Pagination'
export default {
    components: {
        Pagination
    },
    data() {
        return {
            // 筛选变量 志愿者姓名
            vName: '',
            // 志愿者手机号码
            vPhone: '',
            // 志愿者所在地址
            vAddress: '',
            tableData: [],
            // 分页
            page: 1,
            pageSize: 50,
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
            town: '',
            // 村
            villageList: [],
            village: '',
        }
    },
    mounted() {
        this.getVolunteerList()
        this.getProvince();
    },
    methods: {
        // 清空筛选条件
        clearSelect() {
            this.vName = this.vPhone = this.village = this.town = this.county = this.city = this.province = ''
            this.villageList = this.townList = this.countyList = this.cityList = []
            this.getVolunteerList()
        },
        //  点击了查询 page == 1
        clickSearch() {
            this.page = 1
            this.getVolunteerList()
        },
        // 获取任务管理列表
        async getVolunteerList() {
            let res = await volunteerList({
                volunteer_name: this.vName,
                user_phone: this.vPhone,
                user_address: this.village || this.town.slice(0, 9) || this.county.slice(0, 7) || this.city.slice(0, 5) || this
                    .province.slice(0, 3),
                start: this.page - 1,
                page_rows: this.pageSize
            })
            this.tableData = res.data;
            this.totalPage = res.count
        },

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
        // 改变了村级
        async changeVillage() {
            // 确认了村级 可以进行地图飞行了
        },
        cellStyle(row, column, rowIndex, columnIndex) {
            return row.columnIndex == '5' ? "color: #7BDD92;" : '';
        },
        headerCellStyle() {
            return "color:#333333;"
        },
        toPage(url) {
            this.$router.push(url);
        }
    },
}
</script>
<style lang="scss" scoped>
.maxHigh {
    min-height: calc(100vh - 60px);
}

.inputWidth {
    width: 120px;
}

.phoneWidth {
    width: 140px;
}

.areaWidth {
    width: 200px;
}

.yellow {
    background-color: #ffca00;
    border: 1px solid #ffca00;
}
</style>