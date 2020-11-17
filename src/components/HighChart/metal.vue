<template>
    <div class="main">
        <el-row>
            <el-col :span="12">
                <div class="tit">栖霞各区土壤镉含量对比</div>
                <div class="mapDiv">
	                <el-image style="width: 100%; height: 100%" :src="metal_cd_url" fit="contain" :preview-src-list="[metal_cd_url]" />
                </div>
            </el-col>
            <el-col :span="12">
                <div class="tit">栖霞各区土壤铜含量对比</div>
                <div class="mapDiv">
	                <el-image style="width: 100%; height: 100%" :src="metal_cu_url" fit="contain" :preview-src-list="[metal_cu_url]" />
                </div>
            </el-col>
        </el-row>
        <el-row style="marigin-top:20px">
            <el-col :span="12">
                <div class="tit">栖霞各区土壤铬含量对比</div>
                <div class="mapDiv">
	                <el-image style="width: 100%; height: 100%" :src="metal_cr_url" fit="contain" :preview-src-list="[metal_cr_url]" />
                </div>
            </el-col>
            <el-col :span="12">
                <div class="tit">栖霞各区土壤铅含量对比</div>
                <div class="mapDiv">
	                <el-image style="width: 100%; height: 100%" :src="metal_pb_url" fit="contain" :preview-src-list="[metal_pb_url]" />
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import metal_cd_url from '@/assets/metal_cd.png'
import metal_cr_url from '@/assets/metal_cr.png'
import metal_cu_url from '@/assets/metal_cu.png'
import metal_pb_url from '@/assets/metal_pb.png'
export default {
    name: 'HighChart',
    props: ['type'],
    data() {
        return {
            metal_cd_url: metal_cd_url,
            metal_cr_url: metal_cr_url,
            metal_cu_url: metal_cu_url,
            metal_pb_url: metal_pb_url,
            chart: null
        }
    },
    mounted() {
        this.initChart()
    }
}
</script>
<style scoped>
.main {
    padding-top: 20px;
}

.tit {
    text-align: center;
    margin-bottom: 10px;
}

.map {
    width: 100%;
    display: block;
    margin: 0 auto;
}

.mapDiv {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    overflow: hidden;
}
.el-image{
    border-radius: 4px;
    overflow: hidden;
}
</style>