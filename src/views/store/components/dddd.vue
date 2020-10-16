<template>
    <div class="back_9b9b9b maxHigh pad_lef_30 pad_top_30">
        <div class="back_ffffff pad_lef_14 pad_top_8 pad_bot_20 bor_rad_8">
            <el-tabs v-model="activeTab" @tab-click="tabClick">
                <el-tab-pane label="仓库查询" name="0">
                    <!-- <City @change="changeCity"></City> -->
                    <div class="col_333333 fon_14">
                        <span>仓库选择：</span>
                        <el-select v-model="depotCurrent" size="mini" class="phoneWidth" placeholder="请选择仓库">
                            <el-option v-for="e in depotList" :key="e.code" :label="e.name" :value="e.code" />
                        </el-select>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="货架查询" name="1">
                    <div class="col_333333 fon_14">
                        <span>仓库选择：</span>
                        <el-select v-model="depotCurrent" size="mini" class="phoneWidth" placeholder="请选择仓库">
                            <el-option v-for="e in depotList" :key="e.code" :label="e.name" :value="e.code" />
                        </el-select>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="容器查询" name="2 ">
                    <div class="col_333333 fon_14">
                        <span>仓库选择：</span>
                        <el-select v-model="depotCurrent" size="mini" class="phoneWidth" placeholder="请选择仓库">
                            <el-option v-for="e in depotList" :key="e.code" :label="e.name" :value="e.code" />
                        </el-select>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="样本查询" name="3">
                    <div class="col_333333 fon_14">
                        <div class="flex">
                            <span>仓库选择：</span>
                            <el-select v-model="depotCurrent" size="mini" class="phoneWidth" placeholder="请选择仓库">
                                <el-option v-for="e in depotList" :key="e.code" :label="e.name" :value="e.code" />
                            </el-select>
                            <span class="flex1"></span>
                            <el-button type="normal" size="mini" @click="clearSelect()">重置</el-button>
                        </div>
                        <div class="mar_top_10 mar_bot_0 flex">
                            <div class="flex1">
                                <span class=""> 采土年份：</span>
                                <el-select v-model="yearCurrent" size="mini" class="phoneWidth" @change="changeFilterKey()" placeholder="全部类型">
                                    <el-option v-for="e in yearList" :key="e" :label="e" :value="e">
                                    </el-option>
                                </el-select>
                                <span class=""> 批次：</span>
                                <el-select v-model="batchCurrent" size="mini" class="phoneWidth" @change="changeFilterKey()" placeholder="全部时间">
                                    <el-option v-for="e in batchList" :key="e" :label="e" :value="e">
                                    </el-option>
                                </el-select>
                                <span class=""> 采土地址：</span>
                                <el-select v-model="areaCurrent" size="mini" class="phoneWidth" @change="changeFilterKey()" placeholder="全部人员">
                                    <el-option v-for="e in areaList" :key="e.code" :label="e.name" :value="e.code">
                                    </el-option>
                                </el-select>
                                <span class=""> 采集人：</span>
                                <el-select v-model="collectorCurrent" size="mini" class="phoneWidth" @change="changeFilterKey()" placeholder="全部人员">
                                    <el-option v-for="e in collectorList" :key="e.code" :label="e.name" :value="e.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <el-radio-group v-model="radio1" :border="true" size="mini" @change="changeFilterKey()">
                                <el-radio-button :label="0">送检</el-radio-button>
                                <el-radio-button :label="1">已检</el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 仓库查询 -->
        <div v-show="activeTab == 0">
            <div class="back_ffffff bor_rad_8 pad_top_14 pad_lef_14 mar_top_10">
                <div class="pad_top_8">
                    <el-table :data="tableData" style="width: 100%" :header-cell-style="headerCellStyle">
                        <el-table-column prop="deport_name" label="仓库名称" />
                        <el-table-column prop="counts" label="总容量" />
                        <el-table-column prop="reserve" label="当前库存" />
                        <el-table-column prop="on_shelf" label="架上" />
                        <el-table-column prop="un_shelf" label="未上架" />
                        <el-table-column prop="sample" label="分样" />
                        <el-table-column prop="lave" label="余量" />
                    </el-table>
                </div>
            </div>
            <div class="block mar_top_10 mar_bot_0 flex ali_center">
                <el-pagination layout="total,prev, pager, next" :page-size="pageSize" :total="totalPage" :current-page="page" @prev-click="prevClick" @next-click="nextClick" @current-change="currentChange">
                </el-pagination>
                <div class="col_333333 fon_14 pad_lef_14">全国仓库总容量100000，入库39000，架上XXX，未上架，分样中，余量</div>
            </div>
        </div>
        <!-- 货架查询 -->
        <div v-show="activeTab == 1">
            <div class="back_ffffff bor_rad_8 pad_top_14 pad_lef_14 mar_top_10">
                <div class="pad_top_8">
                    <el-table :data="tableData" style="width: 100%" :header-cell-style="headerCellStyle">
                        <el-table-column prop="name" label="货架名称" />
                        <el-table-column prop="free" label="空闲" />
                        <el-table-column prop="used" label="占用" />
                        <el-table-column prop="detecting" label="送检" />
                        <el-table-column prop="detected" label="已检" />
                        <el-table-column prop="counts" label="总架位" />
                        <el-table-column prop="update_time" label="最新上架时间" width="120" />
                        <el-table-column width="80">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="toPage(`./searchManagementDetails?shelf_code=${row.name}&deport_code=${row.deport_code}`)">查看详情</el-button>
                            </template />
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="block mar_top_10 mar_bot_0 flex ali_center">
                <el-pagination layout="total,prev, pager, next" :page-size="pageSize" :total="totalPage" :current-page="page" @prev-click="prevClick" @next-click="nextClick" @current-change="currentChange">
                </el-pagination>
                <div class="col_333333 fon_14 pad_lef_14">本仓库共有 {{use_shelf.shelf_counts}} 个货架，空闲 {{use_shelf.shelf_free}} 个，占用
                    {{use_shelf.shelf_used}} 个，弃用 {{use_shelf.shelf_trashed}} 个</div>
            </div>
        </div>
        <!-- 样本查询 -->
        <div v-show="activeTab == 3">
            <div class="back_ffffff bor_rad_8 pad_top_14 pad_lef_14 mar_top_10">
                <div class="pad_top_8">
                    <el-table :data="tableData" style="width: 100%" :header-cell-style="headerCellStyle">
                        <el-table-column prop="user_name" label="采集人" />
                        <el-table-column prop="bag_code" label="采土袋编码" show-overflow-tooltip />
                        <el-table-column prop="batch_code" label="批次ID" show-overflow-tooltip />
                        <el-table-column prop="shelf_code" label="货架" />
                        <el-table-column prop="place_code" label="架位" />
                        <el-table-column prop="box_code" label="盒(格子)" />
                        <el-table-column prop="task_count" label="送检" />
                        <el-table-column prop="user_address" label="已检" />
                        <el-table-column prop="area_name" label="采土地址" show-overflow-tooltip />
                        <el-table-column prop="task_count" label="采土年份" />
                    </el-table>
                </div>
            </div>
            <div class="block mar_top_10 mar_bot_0 flex ali_center">
                <el-pagination layout="total,prev, pager, next" :page-size="pageSize" :total="totalPage" :current-page.sync="page" @prev-click="prevClick" @next-click="nextClick" @current-change="currentChange">
                </el-pagination>
                <div class="col_333333 fon_14 pad_lef_14">本仓库土壤样品总计 {{use_sample.sample}} 个，上架 {{use_sample.shelfed}} 个，送检总计
                    {{use_sample.detecting}} 个，已检 {{use_sample.detected}} 个，破损 {{use_sample.breakage}} 个</div>
            </div>
        </div>
        <!-- 容器查询 -->
        <div v-show="activeTab == 2">
            <div class="back_ffffff bor_rad_8 pad_top_14 pad_lef_14 mar_top_10">
                <div class="pad_top_8">
                    <el-table :data="tableData" style="width: 100%" :header-cell-style="headerCellStyle">
                        <el-table-column prop="name" label="容器类别" />
                        <el-table-column prop="counts" label="总数" />
                        <el-table-column prop="used" label="占用" />
                        <el-table-column prop="free" label="空闲" />
                        <el-table-column prop="trashed" label="弃用" />
                    </el-table>
                </div>
            </div>
            <div class="col_333333 fon_14 pad_lef_14">本仓库总计使用盒子总数 {{use_container.box}} 个，采样瓶 {{use_container.bottle}} 个，土壤密封袋
                {{use_container.bag}} 个，其他（暂定）{{use_container.other}} 个</div>
        </div>
    </div>
</template>
<script>
import { depotList, searchShelf, searchContainer, searchSample, batch_years, batch_query, area_query, collector_query, deport_container, deport_sample, deport_shelf, deport_v2 } from "@/api/collect.js"
export default {
    data() {
        return {
            radio1: 1,
            tableData: [],
            activeTab: '0',
            //  仓库列表
            depotList: [],
            depotCurrent: '',
            //分页
            page: 1,
            pageSize: 8,
            totalPage: 0,
            // 采土年份
            yearList: [],
            yearCurrent: '',
            // 批次列表
            batchList: [],
            batchCurrent: '',
            // 采土地址
            areaList: [],
            areaCurrent: '',
            // 采集人
            collectorList: [],
            collectorCurrent: '',
            // 分页类型
            pageType: 1,
            // 货架使用情况
            use_shelf: '',
            // 样本使用情况
            use_container: '',
            // 容器使用情况
            use_sample: '',
            // 城市筛选
            cityCode: ''
        }
    },
    mounted() {
        this.getDepotList()
    },
    methods: {
        //  改变城市
        changeCity(code) {
            this.cityCode = code
        },
        // 货架使用情况
        async getShelfUseDetails() {
            let shelf = await deport_shelf({
                deport_code: this.depotCurrent
            })
            if (shelf.code == 201) {
                this.use_shelf = shelf.data
            }
        },
        // 容器使用情况
        async getContainerUseDetails() {
            let container = await deport_container({
                deport_code: this.depotCurrent
            })
            if (container.code == 201) {
                this.use_container = container.data
            }
        },
        // 样本使用情况
        async getSampleUseDetails() {
            let sample = await deport_sample({
                deport_code: this.depotCurrent
            })
            if (sample.code == 201) {
                this.use_sample = sample.data
            }
        },
        //tabClick
        tabClick(e) {
            console.log(e.name);
            this.pageType = e.name
            this.page = 1
            if (e.name == 1) {
                this.getSearchShelf() //货架查询
                this.getShelfUseDetails() //货架使用情况
            } else if (e.name == 2) {
                this.getSearchContainer()
                this.getContainerUseDetails() //容器使用情况
            } else if (e.name == 3) {
                this.getSearchSample() // table
                this.getBatch_years() //采土年份
                this.getBatch_query() //批次列表
                this.getArea_query() //采土地址
                this.getCollector_query() //  采集人
                this.getSampleUseDetails() // 样本使用情况
            } else if (e.name == 0) {
                this.getDeport_v2() //仓库查询
                // 仓库使用情况 未出接口
            }
        },
        // 获取仓库列表
        async getDepotList() {
            let res = await depotList({
                area_code: this.cityCode
            })
            this.depotList = res.data;
            // this.depotCurrent = res.data[0].code
            this.getDeport_v2() //获取仓库查询table 
        },
        // 仓库查询
        async getDeport_v2() {
            let res = await deport_v2({
                deport_code: this.depotCurrent,
                area_code: '',
                start: this.page - 1,
                page_rows: this.pageSize
            })
            this.tableData = res.data;
            this.totalPage = res.count;
        },
        //货架查询
        async getSearchShelf() {
            let res = await searchShelf({
                deport_code: this.depotCurrent,
                area_code: '',
                start: this.page - 1,
                page_rows: this.pageSize
            })
            this.tableData = res.data;
            this.totalPage = res.count;
        },
        //容器查询
        async getSearchContainer() {
            let res = await searchContainer({
                deport_code: this.depotCurrent,
                area_code: '',
            })
            this.tableData = res.data;
        },
        // 样本查询
        async getSearchSample() {
            let res = await searchSample({
                deport_code: this.depotCurrent,
                area_code: '',
                year: this.yearCurrent,
                batch_code: this.batchCurrent,
                mining_area: this.areaCurrent,
                collector: this.collectorCurrent,
                status: this.radio1, // 0-送检 1-已检
                start: this.page - 1,
                page_rows: this.pageSize
            })
            this.tableData = res.data;
            this.totalPage = res.count;
        },
        //  采土年份
        async getBatch_years() {
            let res = await batch_years({
                deport_code: this.depotCurrent,
                area_code: '',
            })
            this.yearList = res.data;
        },
        //  批次列表
        async getBatch_query() {
            let res = await batch_query({
                deport_code: this.depotCurrent,
                area_code: '',
            })
            this.batchList = res.data;
        },
        //  采土地址
        async getArea_query() {
            let res = await area_query({
                deport_code: this.depotCurrent,
                area_code: '',
            })
            this.areaList = res.data;
        },
        //  采集人
        async getCollector_query() {
            let res = await collector_query({
                deport_code: this.depotCurrent,
                area_code: '',
            })
            this.collectorList = res.data;
        },
        // key条件有更改
        changeFilterKey() {
            this.page = 1
            this.getSearchSample()
        },
        //重置
        clearSelect() {
            this.yearCurrent = this.batchCurrent = this.areaCurrent = this.collectorCurrent = ''
            this.radio1 = 0
            this.page = 1
            this.getSearchSample()
        },

        // 上一页
        prevClick() {
            console.log('上一页')
            this.page--;
            if (this.pageType == 1) {
                this.getSearchShelf()
            } else if (this.pageType == 3) {
                this.getSearchSample()
            }
        },
        // 下一页
        nextClick() {
            console.log('下一页')
            this.page++;
            if (this.pageType == 1) {
                this.getSearchShelf()
            } else if (this.pageType == 3) {
                this.getSearchSample()
            }
        },
        // 当前页面被点击
        currentChange(index) {
            console.log('当前页面被点击')
            this.page = index;
            if (this.pageType == 1) {
                this.getSearchShelf()
            } else if (this.pageType == 3) {
                this.getSearchSample()
            }
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
    min-height: calc(100vh - 120px);
}


.el-tabs--border-card {
    background: #FFF;
    border: 1px solid #DCDFE6;
    box-shadow: none !important;
    border-radius: 10px;
}
</style>