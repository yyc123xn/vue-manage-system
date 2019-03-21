<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
                 text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="(item, index) in items">
                <template v-if="item.children">
                    <el-submenu :index="item.name" :key="item.name">
                        <template slot="title">
                            <i :class="item.meta.icon"></i><span slot="title">{{ item.meta.title }}</span>
                        </template>
                        <template v-for="(subItem, index) in item.children">
                            <!--
                            <el-submenu v-if="subItem.children" :index="subItem.name" :key="subItem.name">
                                <template slot="title">{{ subItem.meta.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.children" :key="i" :index="threeItem.name">
                                    {{ threeItem.meta.title }}
                                </el-menu-item>
                            </el-submenu>
                            -->
                            <el-menu-item :index="subItem.name" :key="subItem.name">
                                {{ subItem.meta.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.name" :key="item.name">
                        <i :class="item.meta.icon"></i><span slot="title">{{ item.meta.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import items from '../common/items'
    export default {
        data() {
            return {
                collapse: false,
                items: []
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })

            // todo 用户直接输入url所以会导航到相关页面
            this.getMenus()
        },

        methods: {
            getMenus() {
                this.$api.FINANCE_COMMON_API.get("GET_MENUS").then(res => {
                    this.items = res.data
                })
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
