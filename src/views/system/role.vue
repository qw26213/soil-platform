<template>
  <div class="mainPage">
    <div class="filterDiv" style="padding-top:20px">
      <span class>角色搜索：</span>
      <el-input v-model="roleTxt" size="small" style="width:200px" label="角色名称" />
      <el-button type="primary" style="margin-left:20px" size="small" @click="getList">查询</el-button>
      <el-button type="primary" style="margin-left:20px" size="small" @click="handleAdd">新增角色</el-button>
    </div>
    <div class="contentDiv">
      <el-table :data="tableData" resize>
        <el-table-column prop="id" label="角色编号" align="left" />
        <el-table-column prop="name" label="角色名称" align="left" />
        <el-table-column prop="adminCount" label="创建用户数量" align="left" />
        <el-table-column prop="createTime" label="创建时间" align="left" />
        <el-table-column prop="description" label="描述" align="left" />
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="{row}">
            <span>{{ row.status ? '启用' : '禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" label="操作" align="center">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getRoles } from '@/api/system'
export default {
  data() {
    return {
      roleTxt: '',
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getRoles().then(res => {
        this.tableData = res.data || []
      })
    },
    handleAdd() {

    },
    handleCompile() {

    },
    handleDel() {
      
    }
  }
}
</script>
<style scoped>
.maxHigh {
  min-height: calc(100vh - 120px);
}

.inputWidth {
  width: 120px;
}

.phoneWidth {
  width: 160px;
  margin-right: 10px;
}

.areaWidth {
  width: 200px;
}

.yellow {
  background-color: #ffca00;
  border: 1px solid #ffca00;
}
</style>