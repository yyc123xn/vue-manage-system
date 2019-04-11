<template>
    <div class="table">
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-sort"></i> 菜单管理</el-breadcrumb-item>
                <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10">批量删除</el-button>
                <el-select v-model="queryColumn" placeholder="筛选项" class="handle-select mr10" filterable>
                    <el-option v-for="menuFilterField in menuFilterFields"
                               :key="menuFilterField.columnName" :label="menuFilterField.columnComment"
                               :value="menuFilterField.columnName">
                    </el-option>
                </el-select>
                <el-input v-model="queryCondition[0]" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getMenus">搜索</el-button>
            </el-col>
            <el-col>
                <el-table :data="tableData" border class="table" ref="tableData" @selection-change="handleSelectionChange" @cell-dblclick="dblhandleCurrentChange">
                    <el-table-column type="selection" width="55%" align="center"></el-table-column>
                    <el-table-column v-for="tableHeader in tableHeader.tableHeaders" :prop="tableHeader.prop" :label="tableHeader.label" :sortable="tableHeader.sortable">
                    </el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button v-if="tableData[scope.$index].infoVisible" type="text" icon="el-icon-info" @click="handleInfo(scope.$index, scope.row)">详情</el-button>
                            <el-button v-if="tableData[scope.$index].editVisible" type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button v-if="tableData[scope.$index].deleteVisible" type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>

            <el-col class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="pageSize" :total="total">
                </el-pagination>
            </el-col>
        </el-col>

        <!-- 详情弹出框 -->
        <el-dialog title="详情" :visible.sync="infoVisible" width="70%">
            <el-form ref="menu" :model="menu" label-width="10%">
                <el-form-item label="id">
                    {{menu.id}}
                </el-form-item>
                <el-form-item label="英文名称">
                    {{menu.name}}
                </el-form-item>
                <el-form-item label="前端路径">
                    {{menu.path}}
                </el-form-item>
                <el-form-item label="前端组件名">
                    {{menu.component}}
                </el-form-item>
                <el-form-item label="父菜单名称">
                    {{menu.meta.title}}
                </el-form-item>
                <el-form-item label="父菜单icon">
                    {{menu.meta.icon}}
                </el-form-item>
                <el-form-item label="重定向url">
                    {{menu.redirect}}
                </el-form-item>
                <el-form-item label="菜单权重">
                    {{menu.weight}}
                </el-form-item>
                <el-form-item label="权限">
                    {{menu.privilege}}
                </el-form-item>
                <el-form-item label="字段详情">
                    <el-table :data="menu.children">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="right" inline class="demo-table-expand">
                                    <el-form-item label="前端路径">{{props.row.path}}
                                    </el-form-item>
                                    <el-form-item label="前端组件">{{props.row.component}}
                                    </el-form-item>
                                    <el-form-item label="英文名称">{{props.row.name}}
                                    </el-form-item>
                                    <el-form-item label="菜单名称">{{props.row.meta.title}}
                                    </el-form-item>
                                    <el-form-item label="菜单icon">{{props.row.meta.icon}}
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="前端路径"
                                prop="path">
                        </el-table-column>
                        <el-table-column
                                label="前端组件"
                                prop="component">
                        </el-table-column>
                        <el-table-column
                                label="英文名称"
                                prop="name">
                        </el-table-column>
                        <el-table-column
                                label="菜单名称"
                                prop="meta.title">
                        </el-table-column>
                        <el-table-column
                                label="菜单icon"
                                prop="meta.icon">
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'MenuTable',
        data: function () {
            return {
                rules: {
                    beginAndEndTime: [
                        {required: true, message: '请选择开始和结束时间', trigger: 'blur'}
                    ]
                },
                menuSetFilterField: "",
                menuFilterFields: [],
                tableHeader: {},
                tableData: [],
                pageIndex: 1,
                pageSize: 10,
                total : 0,
                queryColumn: "",
                queryCondition: [],
                editVisible: false,
                infoVisible: false,
                menu: {
                    id: 0,
                    name: '',
                    path: '/',
                    component: '',
                    meta: {
                        title: "",
                        icon: ""
                    },
                    redirect: '',
                    children: [
                        {
                            name: 'sub_menu_name1',
                            path: 'sub_menu_path1',
                            component: 'sub_menu_component1',
                            meta: {
                                title: "",
                                icon: ""
                            },
                            redirect: '',
                        }
                    ],
                    weight: 0,
                    privilege: []
                }
            }
        },
        created() {
            this.getFilterFields();
            this.getMenus();
        },
        methods: {

            // 获取tableHeaders
            getTableHeader() {
                let getParams = {
                    tableName: "menu_table",
                    isMine: false
                }
                this.$api.REPORT_COMMON_API.get("GET_TABLE_HEADER" ,getParams).then(res => {
                    this.tableHeader = res.data
                })
            },

            // 获取数据集的过滤字段
            getFilterFields() {
                this.$api.FINANCE_MENU_API.get('GET_MENU_FILTER_FIELDS').then(res => {
                    this.menuFilterFields = res.data;
                })
            },

            // 获取数据集列表
            getMenus() {
                this.getTableHeader()
                let queryParams = {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    queryColumn: this.queryColumn,
                    queryCondition: this.queryCondition,
                    isMine: false
                }
                this.$api.FINANCE_MENU_API.get('GET_MENU', queryParams).then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
                })
            },

            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },


            handleEdit(index, row) {
                let menuId = this.tableData[index].id;
                this.$router.push({
                    path: '/menu_form',
                    query: {
                        id: menuId
                    }
                })
            },

            handleDelete(index, row) {
                this.$confirm('删除不可恢复，是否确定删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let menuId = this.tableData[index].id;
                    let deleteParams = {
                        id: menuId
                    }
                    this.$api.FINANCE_MENU_API.delete('DELETE_MENU', deleteParams).then(res => {
                        this.tableData.splice(index, 1);
                        this.$message.success("删除成功")
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            handleInfo(index, row) {
                let menuId = this.tableData[index].id;
                this.getMenuInfo(menuId)
                this.infoVisible = true
            },

            // 获取数据集详情
            getMenuInfo(menuId) {
                let queryParams = {
                    id : menuId
                }
                this.$api.FINANCE_MENU_API.get('GET_MENU_INFO', queryParams).then(res => {
                    this.menu = res.data
                })
            },

            dblhandleCurrentChange(row) {
                this.getMenuInfo(row.id)
                this.infoVisible = true
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
                this.getMenus()
            },
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
    .demo-table-expand {
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        width: 50%;
    }
</style>
