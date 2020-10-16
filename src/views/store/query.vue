<template>
    <div class="mainPage">
        <div class="filterDiv">
            <el-tabs v-model="activeTab">
                <el-tab-pane label="仓库查询" name="0" />
                <el-tab-pane label="货架查询" name="1" />
                <el-tab-pane label="容器查询" name="2" />
                <el-tab-pane label="样本查询" name="3" />
            </el-tabs>
        </div>

        <!-- 仓库查询 -->
        <div v-if="activeTab == 0">
            <warehouse />
        </div>

        <!-- 货架查询 -->
        <div v-if="activeTab == 1">
            <shelf />
        </div>

        <!-- 容器查询 -->
        <div v-if="activeTab == 2">
            <container />
        </div>

        <!-- 样本查询 -->
        <div v-if="activeTab == 3">
            <sample />
        </div>
    </div>
</template>

<script>
import warehouse from './components/warehouse'
import sample from './components/sample'
import shelf from './components/shelf'
import container from './components/container'
export default {
    components: { warehouse, sample, container, shelf },
    data() {
        return {
            activeTab: '0'
        }
    },
    methods: {
        
    }
}
</script>
