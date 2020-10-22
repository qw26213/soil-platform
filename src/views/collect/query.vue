<template>
    <div class="mainPage">
        <div class="contentDiv">
            <el-table :data="tableData" v-loading="loading" style="width: 100%;margin-top:10px" :header-cell-style="headerCellStyle">
                <el-table-column prop="code" label="采土编号" show-overflow-tooltip width="200">
                    <template slot-scope="{row}">
                        <span>{{ row.properties.code }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="area_name" label="采集人" width="120">
                    <template slot-scope="{row}">
                        <span>{{ row.properties.results.collector }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="end_time" label="农户姓名" align="center" width="120">
                    <template slot-scope="{row}">
                        <span>{{ row.properties.farmer }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="creater" label="经度" align="center" width="150">
                    <template slot-scope="{row}">
                        <span>{{ row.geometry.coordinates[0] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="creater" label="纬度" align="center" width="150">
                    <template slot-scope="{row}">
                        <span>{{ row.geometry.coordinates[1] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="采土地址" align="left" min-width="160" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <span>{{ row.properties.detail_address }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="采土备注" align="left" min-width="120" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <span>{{ row.properties.remark }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="area_name" label="提交时间" width="150" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.properties.results.submit_time }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-if="totalPage>10" :total="totalPage" :page.sync="page" :limit.sync="pageSize" @pagination="getBatchList" />
        </div>
    </div>
</template>
<script>
import { batchResult } from '@/api/collect.js'
import Pagination from '@/components/Pagination'
export default {
    components: {
        Pagination
    },
    data() {
        return {
            order_prop: '',
            order: '',
            loading: false,
            tableData: [],
            page: 1,
            pageSize: 10,
            totalPage: 0
        }
    },
    mounted() {
        this.getBatchResult()
    },
    methods: {
        headerCellStyle() {
            return 'color:#333333;'
        },
        getBatchResult() {
            this.loading = true
            batchResult({
                task_status: -1
            }).then(res => {
                this.loading = false
                console.log(res.free)
                this.tableData = res.free.points || []
            }).catch(() => {
                this.loading = false
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.maxHigh {
    min-height: calc(100vh - 60px);
}

.item {
    margin-top: 10px;
    margin-right: 10px;
}
</style>