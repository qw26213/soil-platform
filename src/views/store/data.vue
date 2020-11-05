<template>
    <div class="mainPage">
        <div class="filterDiv">
            <div class="flex ali_center fon_14">
                <span class="label">仓库选择：</span>
                <el-select v-model="depotCurrent" size="mini" class="phoneWidth" placeholder="请选择仓库" @change="getDeportManger()">
                    <el-option v-for="e in depotList" :key="e.code" :label="e.name" :value="e.code" />
                </el-select>
                <span class="label" style="margin-left:20px">查询选择：</span>
                <el-radio-group v-model="queryType" size="small" @change="changeType">
                    <el-radio-button label="1">样本接收</el-radio-button>
                    <el-radio-button label="2">样本装盒</el-radio-button>
                    <el-radio-button label="3">样本上架</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <!-- 采样袋 -->
        <div v-show="queryType == '1'" class="contentDiv">
            <el-table :data="tableData" style="width: 100%" :header-cell-style="headerCellStyle">
                <el-table-column prop="operator" label="接收人员" align="center" />
                <el-table-column prop="counts" label="接收数量" align="center" />
                <el-table-column label="接收日期" align="center">
                    <template slot-scope="{row}">
                        <span v-if="row && row.operate_time">{{ row.operate_time | parseTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="batch_numbers" label="批次数量" align="center" />
                <el-table-column prop="collectors" label="采样人数量" align="center" />
                <el-table-column prop="areas" label="行政村数量" align="center" />
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="{row}">
                        <el-button type="text" size="small" @click="showDetail(row, 1)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-if="totalPage>10" :total="totalPage" :page.sync="page" :limit.sync="pageSize" @pagination="getDeportManger" />
        </div>
        <!-- 装盒 -->
        <div v-show="queryType == '2'" class="contentDiv">
            <el-table :data="tableData" style="width: 100%" :header-cell-style="headerCellStyle">
                <el-table-column prop="bager" label="装盒人员" />
                <el-table-column prop="count" label="样本装盒数量" align="center" />
                <el-table-column prop="bag_time" label="装盒日期" align="center" />
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="{row}">
                        <el-button type="text" size="small" @click="showDetail(row, 2)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-if="totalPage>10" :total="totalPage" :page.sync="page" :limit.sync="pageSize" @pagination="getDeportManger" />
        </div>
        <!--  上架 -->
        <div v-show="queryType == '3'" class="contentDiv">
            <el-table :data="tableData" style="width: 100%" :header-cell-style="headerCellStyle">
                <el-table-column prop="shelfer" label="上架人员" />
                <el-table-column prop="count" label="上架数量" align="center" />
                <el-table-column prop="shelf_time" label="上架日期" align="center" />
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="{row}">
                        <el-button type="text" size="small" @click="showDetail(row, 3)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-if="totalPage>10" :total="totalPage" :page.sync="page" :limit.sync="pageSize" @pagination="getDeportManger" />
        </div>
        <!-- 上架详情 -->
        <el-dialog :visible.sync="dialogVisible" :title="queryType == '1'?'样本详情':queryType == 2 ? '盒子详情' : queryType == 3 ? '架子详情':''" top="15%" :width="queryType == '1'?'500px': '800px'">
            <Details v-if="dialogVisible" :info="info" />
        </el-dialog>
    </div>
</template>
<script>
import { depotList, deportManger, deportDetail } from "../../api/collect.js"
import Details from './components/wareHouseInputDteails.vue'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
export default {
    components: {
        Details,
        Pagination
    },
    data() {
        return {
            tableData: [],
            // 仓库列表
            depotList: [],
            depotCurrent: '',
            //分页
            page: 1,
            pageSize: 10,
            totalPage: 0,
            queryType: '1',
            dialogVisible: false,
            info: ''
        }
    },
    mounted() {
        this.getDepotList() // 仓库列表
    },
    methods: {
        // 获取仓库列表
        async getDepotList() {
            let res = await depotList({})
            this.depotList = res.data;
            this.depotCurrent = res.data[0].code
            this.getDeportManger() //table
        },
        //入库管理list
        async getDeportManger() {
            let res = await deportManger({
                type: this.queryType,
                deport_code: this.depotCurrent,
                start: this.page - 1,
                page_rows: this.pageSize
            })
            this.tableData = res.data
            this.totalPage = res.count
        },
        //入库管理详情
        showDetail(info, type) {
            let obj = {}
            if (type == 1) {
                obj = {
                    type: 1,
                    name: info.operator,
                    operator: info.operator_code || '',
                    operate_time: info.operate_time && info.operate_time.slice(0, 10)
                }
            }
            if (type == 2) {
                obj = {
                    type: 2,
                    name: info.bager,
                    operator: info.bager_code,
                    operate_time: info.bag_time
                }
            }
            if (type == 3) {
                obj = {
                    type: 3,
                    name: info.shelfer,
                    operator: info.shelfer_code,
                    operate_time: info.shelf_time
                }
            }
            this.info = obj
            this.dialogVisible = true
        },
        //更改radio
        changeType() {
            this.page = 1
            this.tableData = []
            this.getDeportManger()
        },
        headerCellStyle() {
            return "color:#333333;"
        },
    },
}
</script>
<style lang="scss" scoped>
.maxHigh {
    min-height: calc(100vh - 120px);
}

.inputWidth {
    width: 120px;
}

.phoneWidth {
    width: 160px;
}

.areaWidth {
    width: 200px;
}

.gray {
    background-color: #aeaeae;
    border: 1px solid #aeaeae;
}

.yellow {
    background-color: #ffca00;
}

.red {
    background-color: #ff555a;
}

.green {
    background-color: #68f58e;
}

.blue {
    background-color: #509bfc;
}
</style>