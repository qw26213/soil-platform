<template>
    <div class="navbar">
        <logo style="width:300px;float:left" :collapse="false" />
        <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
        <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
        <div class="right-menu">
            <div class="avatar-container right-menu-item hover-effect">
                <div class="avatar-wrapper">
                    <img :src="avatar" class="user-avatar" />
                    <span class="user-name" style="color:#fff">{{ userName }}</span>
                    <i style="vertical-align: middle;transform:rotate(90deg);color:#fff" class="el-icon-minus" />
                    <el-button type="text" style="color:#fff" size="small" @click="logout">退出登录</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import userImg from "@/assets/user.png";
import { mapGetters } from "vuex";
import logo from "./Sidebar/Logo";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { setToken, getToken } from "@/utils/auth";
import Cookies from "js-cookie";
import { getAdminInfo } from '@/api/user'
export default {
    components: {
        logo,
        Breadcrumb,
        Hamburger
    },
    data() {
        return {
            avatar: userImg,
            userName: '*******'
        }
    },
    computed: {
        ...mapGetters(["sidebar", "device" ])
    },
    created() {
        getAdminInfo().then(res => {
            this.userName = res.data.username
        })
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch("app/toggleSideBar")
        },
        logout() {
            this.$confirm('确定要退出吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                sessionStorage.clear()
                this.$router.replace({ path: "/login" })
            })
        }
    }
};
</script>
<style lang="scss" scoped>
.navbar {
    height: 60px;
    width: 100%;
    z-index: 11;
    overflow: hidden;
    position: fixed;
    background: #5381ff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }
    .breadcrumb-container {
        float: left;
    }
    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }
    .right-menu {
        float: right;
        height: 100%;
        line-height: 60px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 10px;

            .avatar-wrapper {
                position: relative;
                .user-avatar {
                    width: 16px;
                    height: 16px;
                    vertical-align: middle;
                }
                .user-name {
                    font-size: 14px;
                }
            }
        }
    }
}

.msgDiv {
    max-height: 500px;
    overflow: auto;
    padding-bottom: 15px;
}

.msgDiv .tit {
    color: #333;
    font-size: 14px;
    text-align: left;
    font-weight: bold;
}

.msgDiv .con {
    color: #333;
    font-size: 14px;
    text-align: justify;
    line-height:22px;
    margin-top: 10px;
}

.msgDiv .time {
    float:right;
    color: #999;
    font-size: 13px;
    text-align: right;
    padding-top:3px
}
</style>