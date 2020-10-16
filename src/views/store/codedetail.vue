<template>
	<div class="back_9b9b9b maxHigh pad_lef_30 pad_top_30">
		<div v-if="info" class="back_ffffff bor_rad_8 pad_top_14 pad_lef_14 flex ali_center">
			<div class="col_333333 fon_14">赋码类型名称：<span class="col_656565">{{info.name}}</span> </div>
			<div class="col_333333 fon_14 flex1 pad_lef_30">{{info.name}}赋码数量：<span class="col_656565 ">{{totalPage}}</span>
			</div>
			<el-button type="primary" size="mini" class="gray" @click="$router.back()">返回</el-button>
		</div>
		<div class="back_ffffff bor_rad_8 pad_top_14 pad_lef_14 mar_top_10">
			<div class="pad_top_8">
				<el-table :data="tableData" style="width: 100%" :header-cell-style="headerCellStyle" stripe>
					<el-table-column prop="index" label="索引" width="100px">
					</el-table-column>
					<el-table-column prop="val" label="容器编码">
						<template slot-scope="scope">
							<div class="flex">
								<div v-for="(e,k) of scope.row.val" class="codeWidth">{{e}}</div>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="block mar_top_10 mar_bot_0">
			<el-pagination layout="total,prev, pager, next" :page-size="pageSize" :total="totalPage" @prev-click="prevClick"
			 @next-click="nextClick" @current-change="currentChange">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import {
		depotCodeDetail
	} from "../../api/collect.js"
	export default {
		data() {
			return {
				tableData: [],
				page: 0,
				pageSize: 100,
				totalPage: 0,
				info: {}, //本志愿者的info
			}
		},
		mounted() {
			this.info = this.$route.query
			this.getDepotCodeDetail()
		},
		methods: {
			// 获取赋码列表详情
			async getDepotCodeDetail() {
				let res = await depotCodeDetail({
					batch_number: this.info.id,
					type: this.info.type,
					start: this.page,
					page_rows: this.pageSize
				})
				this.tableData.length = 0
				let p = 0
				let page = this.page
				while (res.data.length > 0) {
					let arr = res.data.splice(0, 10)
					this.tableData.push({
						index: `${(p * 10 + 1)+(page)*100} - ${(p * 10 + arr.length)+(page)*100}`,
						val: arr
					})
					p++
				}
				console.log(this.tableData);
				this.totalPage = res.count
			},
			// 上一页
			prevClick() {
				console.log('上一页')
				this.page--;
				this.getDepotCodeDetail();
			},
			// 下一页
			nextClick() {
				console.log('下一页')
				this.page++;
				this.getDepotCodeDetail();
			},
			// 当前页面被点击
			currentChange(index) {
				console.log('当前页面被点击')
				this.page = --index;
				this.getDepotCodeDetail();
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

	.codeWidth {
		width: 100px;
	}
</style>
