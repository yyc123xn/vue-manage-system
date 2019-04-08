<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-punch"></i> 公司票据</el-breadcrumb-item>
                <el-breadcrumb-item>票据表单</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="form-box">
                <el-form ref="developer" :rules="rules" :model="menuPrivilege" label-width="7%">
                    <el-form-item label="菜单" prop="menus">
                        <el-select v-model="menu" placeholder="请选择">
                            <template v-for="(menu, index) in menus">
                                <el-option :key="index" :label="menu.name" :value="menu.id">
                                </el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item labelWidth="35%" style="width: 20%" label="权限" prop="privilege">
                        <multiCascader placeholder="请选择" :options="configOptions" @on-selected="getSelected" :inputValue="configTips"></multiCascader>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addDeveloper('developer')">表单提交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-col>
    </el-col>
</template>

<script>
    export default {
        data() {
            return {
                menus: [],
            };
        },

        methods: {
            getMenus() {
                this.$api.FINANCE_MENU_API.get("GET_MENUS").then(res => {
                    this.menus = res.data
                })
            }
        },

        created() {
            this.getMenus()
        }
    };
</script>

<style>

</style>