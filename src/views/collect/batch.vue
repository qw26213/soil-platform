<template>
    <div class="mainPage">
        <div class="contentDiv">
            <div class="col_656565 fon_16">
                批次列表
                <span class="col_a9a9a9 fon_14" style="margin-top:5px">(批次列表信息实时更新)</span>
            </div>
            <el-table :data="tableData" style="width: 100%;margin-top:10px" :default-sort="{prop: this.order_prop, order: this.order=='desc'?'descending': 'ascending'}" :header-cell-style="headerCellStyle" @sort-change="sortChange">
                <el-table-column prop="code" label="批次编号" show-overflow-tooltip width="200" />
                <el-table-column prop="area_name" label="地块信息" show-overflow-tooltip min-width="260" />
                <el-table-column prop="plot_code" label="地块ID" align="center" show-overflow-tooltip width="200" />
                <el-table-column prop="create_time" label="生成日期" sortable align="center" width="160" />
                <el-table-column prop="end_time" label="截止日期" sortable align="center" width="120" />
                <el-table-column prop="creater" label="创建人" align="center" width="100" />
                <el-table-column width="100" label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-badge :value="row.task_required" class="item">
                            <el-button type="primary" plain size="mini" @click="toPage(`./batchdetail?code=${row.code}`)">查看详情</el-button>
                        </el-badge>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-if="totalPage>10" :total="totalPage" :page.sync="page" :limit.sync="pageSize" @pagination="getBatchList" />
        </div>
    </div>
</template>
<script>
import { batchList } from '@/api/collect.js'
import Pagination from '@/components/Pagination'
export default {
    components: {
        Pagination
    },
    data() {
        return {
            order_prop: '',
            order: '',
            tableData: [],
            page: 1,
            pageSize: 10,
            totalPage: 0
        }
    },
    mounted() {
        this.getBatchList()
    },
    methods: {
        // 排序监听  实现排序功能
        sortChange(e) {
           this.order_prop = e.prop
           this.order = e.order === 'ascending' ? 'asc' : 'desc'
           this.getBatchList()
        },
        // 获取批次列表
        async getBatchList() {
            let res = await batchList({
                start: this.page - 1,
                page_rows: this.pageSize,
                order_prop: this.order_prop,
                order: this.order
            })
            this.tableData = res.data
            this.totalPage = res.count
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
<style lang="scss" scoped>
.maxHigh {
    min-height: calc(100vh - 60px);
}

.item {
    margin-top: 10px;
    margin-right: 10px;
}
</style>