<template>
	<div class="header flex ali_center">
		<img src="../../static/img/logo.png" class="logo mar_rig_20" />
		<div class="col_ffffff bold fon_18 mar_rig_20 flex1">土壤采集管理系统</div>

		<!-- <el-breadcrumb separator-class="el-icon-arrow-right" class="flex1">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>活动管理</el-breadcrumb-item>
			<el-breadcrumb-item>活动列表</el-breadcrumb-item>
			<el-breadcrumb-item>活动详情</el-breadcrumb-item>
		</el-breadcrumb> -->

		<img src="../../static/img/userAvater.png" class="userLogo mar_rig_20" />
		<div class="col_ffffff fon_14 cursor"><span>帮助</span> | <span @click="logout()">退出</span></div>
	</div>
</template>

<script>
	import {
		mapActions
	} from 'vuex'

	export default {
		data() {
			return {}
		},
		methods: {
			...mapActions({
				handleLogOut: 'user/handleLogOut',
			}),
			//退出
			logout() {
				this.$confirm('是否退出当前用户?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '退出成功!'
					});
					// 清除登录记录
					sessionStorage.removeItem('ACCESS_TOKEN')
					localStorage.removeItem('ACCESS_TOKEN')
					// 跳转到登录页面
					this.$router.push({
						name: 'Login'
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消退出'
					});

				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.header {
		height: 60px;
	}

	.logo {
		width: 38px;
		height: 38px;
	}

	.userLogo {
		width: 20px;
		height: 20px;
	}

	.el-breadcrumb {
		font-size: 14px;
		line-height: 1;
	}
</style>
