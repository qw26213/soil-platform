<template>
	<div class="back_9b9b9b maxHigh pad_lef_30 pad_top_30">
		<div v-if="info" class="back_ffffff bor_rad_8 pad_top_14 pad_lef_14 flex jus_between ali_center">
			<div class="col_333333 fon_14">采样志愿者：<span class="col_656565">{{info.user_name}}</span> </div>
			<div class="col_333333 fon_14">编号：<span class="col_656565">{{info.id}}</span> </div>
			<div class="col_333333 fon_14">所属行政区：<span class="col_656565">{{info.user_address}}</span> </div>
			<el-button type="primary" size="mini" class="gray" @click="$router.back()">返回</el-button>
		</div>
		<div class="back_ffffff bor_rad_8 pad_top_14 pad_lef_14 mar_top_10">
			<div class="pad_top_8">
				<el-table :data="tableData" style="width: 100%" :header-cell-style="headerCellStyle">
					<el-table-column prop="batch_code" label="批次编号" min-width="120" show-overflow-tooltip />
					<el-table-column prop="code" label="任务编号" show-overflow-tooltip />
					<el-table-column prop="plot_code" label="地块编号" show-overflow-tooltip />
					<el-table-column prop="samplePoint.bag_code" label="采土袋ID" show-overflow-tooltip />
					<el-table-column prop="samplePoint.code" label="采集点编号" show-overflow-tooltip />
					<el-table-column prop="task_attr" label="任务属性" />
					<el-table-column prop="mining_time" label="采土日期" show-overflow-tooltip>
						<template slot-scope="scope">
							<div v-if="scope.row.mining_time">{{scope.row.mining_time}}</div>
							<el-tag v-else size="medium" type="danger">未完成</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="submit_time" label="提交日期" show-overflow-tooltip>
						<template slot-scope="scope">
							<div v-if="scope.row.submit_time">{{scope.row.submit_time}}</div>
							<el-tag v-else size="medium" type="danger">未提交</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="incoming_time" label="入库日期" show-overflow-tooltip>
						<template slot-scope="scope">
							<div v-if="scope.row.incoming_time">{{scope.row.incoming_time}}</div>
							<el-tag v-else size="medium" type="danger">未入库</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="incoming_time" label="检测次数">
						<template slot-scope="scope">
							<div v-if="scope.row.startTime">{{scope.row.startTime}}</div>
							<el-tag v-else size="medium" type="danger">未检测</el-tag>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="block mar_top_10 mar_bot_0">
            <pagination v-if="totalPage>10" :total="totalPage" :page.sync="page" :limit.sync="pageSize" @pagination="getVolunteerDetails" />
		</div>
	</div>
</template>

<script>
	import { volunteerDetails } from "../../api/collect.js"
	export default {
	    components: {
	        Pagination
	    },
		data() {
			return {
				tableData: [],
				page: 0,
				pageSize: 8,
				totalPage: 0,
				info: {}, //本志愿者的info
			}
		},
		mounted() {
			this.info = this.$route.query
			this.getVolunteerDetails()
		},
		methods: {
			// 获取志愿者详情
			async getVolunteerDetails() {
				let res = await volunteerDetails({
					id: this.info.id,
					start: this.page,
					page_rows: this.pageSize
				})
				this.tableData = res.data;
				this.totalPage = res.count
			},
			headerCellStyle() {
				return "color:#333333;"
			},
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
		width: 160px;
	}

	.areaWidth {
		width: 200px;
	}

	.gray {
		background-color: #aeaeae;
		border: 1px solid #aeaeae;
	}
</style>
