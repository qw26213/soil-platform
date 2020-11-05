<template>
    <div class="mainPage">
        <div class="filterDiv clearfix">
            <span>批次号:</span>
            <el-select v-model="selectedBatch" size="mini" class="inputWidth" @change="changeVal()">
                <el-option v-for="item in taskInfo.batches" :key="item" :label="item" :value="item" />
            </el-select>
            <span style="margin-left:10px;">采样人:</span>
            <el-select v-model="selectedUser" size="mini" class="inputWidth" @change="changeVal()">
                <el-option label="全部" value="" />
                <el-option v-for="item in taskInfo.users" :key="item[0]" :label="item[1]" :value="item[0]" />
            </el-select>
            <span style="float:right;display:inline-block;line-height:28px">任务截止日期:{{taskInfo.date || '0000-00-00' }}</span>
        </div>
        <div class="contentDiv">
            <el-table :data="tableData" style="width: 100%;margin-top:5px" :header-cell-style="headerCellStyle">
                <el-table-column prop="task_code" label="任务编码" show-overflow-tooltip />
                <el-table-column prop="samplePoint_code" label="采集点编码" show-overflow-tooltip />
                <el-table-column prop="collector" label="采样人" show-overflow-tooltip width="120">
                    <template slot-scope="{row}">
                        <span>{{ row.collector || '——' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="bag_code" label="样本编号" align="center" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <span>{{ row.bag_code || '——' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="task_attr" label="任务类型" align="center" width="120" />
                <el-table-column prop="mining_time" label="采样日期" align="center" width="120">
                    <template slot-scope="{row}">
                        <span>{{ row.mining_time || '未进行' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="submit_time" label="提交日期" align="center" width="120">
                    <template slot-scope="{row}">
                        <span>{{ row.submit_time || '未进行' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="incoming_time" label="入库日期" align="center" width="120">
                    <template slot-scope="{row}">
                        <span>{{ row.submit_time || '未进行' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="detect_time" label="检测日期" align="center" width="120">
                    <template slot-scope="{row}">
                        <span>{{ row.submit_time || '未进行' }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-if="totalPage>10" :total="totalPage" :page.sync="page" :limit.sync="pageSize" @pagination="getTaskList" />
        </div>
    </div>
</template>
<script>
import { taskList, taskListHeader, volunteerList } from '@/api/collect.js'
import Pagination from '@/components/Pagination'
export default {
    components: {
        Pagination
    },
    data() {
        return {
            tableData: [],
            selectedBatch: '',
            selectedUser: '',
            page: 1,
            pageSize: 8,
            totalPage: 0,
            taskInfo: {
                code: '',
                date: '',
                batches: [],
                users: [],
            }
        }
    },
    mounted() {
        this.selectedBatch = this.$route.query.id || ''
        this.getTaskList()
        this.getTaskListHeader()
    },
    methods: {
        // 获取头信息
        async getTaskListHeader() {
            let res = await taskListHeader({
                batch_code: this.selectedBatch
            })
            this.taskInfo = res.data
            this.selectedBatch = res.data.code
        },
        // 更改了筛选条件
        changeVal() {
            this.page = 1
            this.getTaskListHeader()
            this.getTaskList()
        },
        // 获取任务管理列表
        async getTaskList() {
            let res = await taskList({
                batch_code: this.selectedBatch,
                collector: this.selectedUser,
                start: this.page - 1,
                page_rows: this.pageSize
            })
            this.tableData = res.data
            this.totalPage = res.count
        },
        headerCellStyle() {
            return 'color:#333333;'
        }
    }
}
</script>
<style scoped>
.filterDiv span {
    font-size: 14px;
    color: #333;
}

.topInfo span {
    font-size: 12px
}

.maxHigh {
    min-height: calc(100vh - 60px);
}

.inputWidth {
    width: 200px;
}
</style>