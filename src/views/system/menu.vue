<template>
  <div class="mainPage">
    <div class="filterDiv">
      <span class>角色:</span>
      <el-select v-model="role" size="mini" style="width: 200px" @change="changeProvince()" placeholder="选择角色">
        <el-option v-for="e in roleList" :key="e.code" :label="e.name" :value="e.code"></el-option>
      </el-select>
      <el-button size="mini" class="filter-item" style="float:right" type="primary" @click="handleSave">保存</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" size="mini" empty-text="暂无权限" border fit highlight-current-row row-key="id" style="width: 100%;">
        <el-table-column label="选择" type="selection" width="100" align="center" />
        <el-table-column label="权限代码">
          <template slot-scope="{row}">
            <span>{{ row.funcCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限名称">
          <template slot-scope="{row}">
            <span>{{ row.funcName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getParam } from '@/api/system'
export default {
  name: 'FuncList',
  data() {
    return {
      tableKey: 0,
      role: '',
      roleList: [],
      tableData: [
        {
          funcCode: '100',
          funcName: '权限名称'
        },
        {
          funcCode: '100',
          funcName: '权限名称'
        },
        {
          funcCode: '100',
          funcName: '权限名称'
        },
        {
          funcCode: '100',
          funcName: '权限名称'
        }
      ],
      list: [],
      listLoading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    handleSave() {},
    getData() {
      getFuncs().then(res => {
        this.tableData = data.data
        this.listLoading = false
      })
    }
  }
}
</script>
<style scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>