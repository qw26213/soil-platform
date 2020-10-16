<template>
  <div class="mainPage">
    <div class="filterDiv" style="padding-top:20px">
      <span class>角色搜索：</span>
      <el-input v-model="roleTxt" size="small" style="width:200px" label="角色名称" />
      <el-button type="primary" style="margin-left:20px" size="small" @click="handleSearch">查询</el-button>
      <el-button type="primary" style="margin-left:20px" size="small" @click="handleAdd">新增角色</el-button>
    </div>
    <div class="contentDiv">
      <el-table :data="tableData" resize>
        <el-table-column prop="user_code" label="角色编号" align="left" />
        <el-table-column prop="user_role" label="角色名称" align="left" />
        <el-table-column prop="user_code" label="角色描述(小程序)" align="left" />
        <el-table-column prop="user_addr" label="角色描述(PC)" align="left" />
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
export default {
  data() {
    return {
      roleTxt: '',
      tableData: [
        {
          user_role: '系统管理员',
          user_code: '150115322730',
          user_time: '2020-09-26',
          user_addr: '北京市朝阳区',
          task_count: 1000
        },
        {
          user_role: '系统管理员',
          user_code: '150115322730',
          user_time: '2020-09-26',
          user_addr: '北京市朝阳区',
          task_count: 1000
        },
        {
          user_role: '系统管理员',
          user_code: '150115322730',
          user_time: '2020-09-26',
          user_addr: '北京市朝阳区',
          task_count: 1000
        },
        {
          user_role: '系统管理员',
          user_code: '150115322730',
          user_time: '2020-09-26',
          user_addr: '北京市朝阳区',
          task_count: 1000
        },
        {
          user_role: '系统管理员',
          user_code: '150115322730',
          user_time: '2020-09-26',
          user_addr: '北京市朝阳区',
          task_count: 1000
        }
      ]
    }
  },
  mounted() {},
  methods: {
    handleSearch() {},
    handleAdd() {},
    handleCompile() {},
    handleDel() {}
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