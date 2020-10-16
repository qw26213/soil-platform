<template>
	<div class="aside">
		<!-- 只保持一个菜单开启  unique-opened -->
		<el-menu :default-active="defaultActive" class="el-menu-vertical-demo" background-color="#303133" text-color="#fff"
		 active-text-color="#409eff" unique-opened>
			<el-submenu index="1">
				<template slot="title">
					<img src="../../static/img/img_product@2x.png" class="navIcon mar_rig_20" />
					<span>采集管理</span>
				</template>
				<el-menu-item index="1-1" @click="toPage('/','1-1')">采集规划</el-menu-item>
				<el-menu-item index="1-2" @click="toPage('/batchManagement', '1-2')">批次管理</el-menu-item>
				<el-menu-item index="1-3" @click="toPage('/taskManagement', '1-3')">任务管理</el-menu-item>
				<el-menu-item index="1-4" @click="toPage('/volunteerManagement', '1-4')">志愿者管理</el-menu-item>
				<el-menu-item index="1-5" @click="toPage('/resultDisplay', '1-5')">结果展示</el-menu-item>
			</el-submenu>
			<el-submenu index="2">
				<template slot="title">
					<img src="../../static/img/img_Logistics@2x.png" class="navIcon mar_rig_20" />
					<span slot="title">仓库管理</span>
				</template>
				<el-menu-item index="2-1" @click="toPage('/codeManagement', '2-1')">赋码管理</el-menu-item>
				<el-menu-item index="2-2" @click="toPage('/wareHouseManagement', '2-2')">入库管理</el-menu-item>
				<el-menu-item index="2-3" @click="toPage('/searchManagement', '2-3')">查询管理</el-menu-item>
			</el-submenu>
			<el-submenu index="3">
				<template slot="title">
					<img src="../../static/img/img_Data@2x.png" class="navIcon mar_rig_20" />
					<span slot="title">检测管理</span>
				</template>
				<el-menu-item index="3-1" @click="toPage('/detectManagement', '3-1')">送检管理</el-menu-item>
				<el-menu-item index="3-2" @click="toPage('/resultEntry', '3-2')">结果录入</el-menu-item>
				<el-menu-item index="3-3" @click="toPage('/resultQuery', '3-3')">结果查询</el-menu-item>
			</el-submenu>
			<el-submenu index="4">
				<template slot="title">
					<img src="../../static/img/img_Settlement@2x.png" class="navIcon mar_rig_20" />
					<span slot="title">数据分析</span>
				</template>
			</el-submenu>
			<el-submenu index="5">
				<template slot="title">
					<img src="../../static/img/img_Coo@2x.png" class="navIcon mar_rig_20" />
					<span slot="title">字典管理</span>
				</template>
			</el-submenu>
			<el-submenu index="6">
				<template slot="title">
					<img src="../../static/img/img_Download@2x.png" class="navIcon mar_rig_20" />
					<span slot="title">系统管理</span>
				</template>
				<el-menu-item index="6-1" @click="toPage('/system/warehouse', '6-1')">创建仓库</el-menu-item>
				<el-menu-item index="6-2" @click="toPage('/system/bag', '6-2')">创建土袋</el-menu-item>
				<el-menu-item index="6-3" @click="toPage('/system/purchase', '6-3')">订购记录</el-menu-item>
				<el-menu-item index="6-4" @click="toPage('/system/module', '6-4')">模块管理</el-menu-item>
				<el-menu-item index="6-5" @click="toPage('/system/role', '6-5')">角色管理</el-menu-item>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				defaultActive: '1-1'
			}
		},
		created() {
			this.defaultActive = sessionStorage.getItem('defaultActive') || '1-1'
			console.log(this.defaultActive)
		},
		methods: {
			// toPage
			toPage(url, index) {
				sessionStorage.setItem('defaultActive', index)
				if (this.$route.path == url) {
					// console.log('不能跳转当前页面');
				} else {
					this.$router.push(url)
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.el-submenu__title {
		font-size: 16px !important;
	}

	.el-menu-item {
		font-size: 16px !important;
		padding-left: 80px !important;
	}

	.navIcon {
		width: 26px;
		height: 26px;
	}

	.el-menu {
		/* 取消右边 */
		border-right: solid 1px #303133 !important;
	}

	.aside {
		width: 100%;
	}

	/deep/ .el-menu-item {
		font-size: 14px !important;
		padding-left: 80px !important;
	}
</style>
