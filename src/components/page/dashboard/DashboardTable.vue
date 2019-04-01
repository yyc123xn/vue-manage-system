<template>
    <div class="table">
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-rank"></i> 数据看板</el-breadcrumb-item>
                <el-breadcrumb-item>看板列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-select v-model="queryColumn" placeholder="筛选项" class="handle-select mr10">
                    <el-option v-for="dashboardFilterField in dashboardFilterFields"
                               :key="dashboardFilterField.columnName" :label="dashboardFilterField.columnComment"
                               :value="dashboardFilterField.columnName">
                    </el-option>
                </el-select>
                <el-input v-model="queryCondition[0]" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getDashboards">搜索</el-button>
            </el-col>
            <el-col>
                <el-tabs type="border-card" v-model="isMine">
                    <el-tab-pane name="false" label="全部">
                    </el-tab-pane>
                    <el-tab-pane name="true" label="我的">
                    </el-tab-pane>
                    <el-table :data="tableData" border class="table" ref="tableData" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column v-for="tableHeader in tableHeader.tableHeaders" :prop="tableHeader.prop" :label="tableHeader.label" :sortable="tableHeader.sortable">
                        </el-table-column>
                        <el-table-column label="操作" width="180" align="center">
                            <template slot-scope="scope">
                                <el-button v-if="tableData[scope.$index].dataVisible" type="text" icon="el-icon-info" @click="handleData(scope.$index, scope.row)">数据</el-button>
                                <el-button v-if="tableData[scope.$index].editVisible" type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button v-if="tableData[scope.$index].deleteVisible" type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tabs>
            </el-col>
            <el-col class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="pageSize" :total="total">
                </el-pagination>
            </el-col>
        </el-col>
    </div>
</template>

<script>
    export default {
        name: 'DashboardTable',
        data: function () {
            return {
                dashboardFilterFields: [
                    {
                        columnName: "name1",
                        columnComment: "comment1"
                    },
                    {
                        columnName: "name2",
                        columnComment: "comment2"
                    }
                ],
                tableHeader: {},
                tableData: [],
                pageIndex: 1,
                pageSize: 10,
                total : 0,
                queryColumn: "",
                queryCondition: [],
                editVisible: false,
                delVisible: false,
                isMine: "false",
                form: {
                    name: '',
                    date: '',
                    address: ''
                }
            }
        },
        created() {
            this.getFilterFields();
            this.getDashboards();
        },
        computed: {
        },
        watch: {
            isMine(val) {
                this.isMine = val;
                this.getDashboards()
            }
        },
        methods: {
            // 获取看板的过滤字段
            getFilterFields() {
                this.$api.REPORT_DASHBOARD_API.get('GET_DASHBOARD_FILTER_FIELDS').then(res => {
                    this.dashboardFilterFields = res.data;
                })
            },

            // 获取看板列表
            getDashboards() {
                this.getTableHeader()
                let getParams = {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    queryColumn: this.queryColumn,
                    queryCondition: this.queryCondition,
                    isMine: this.isMine
                }
                this.$api.REPORT_DASHBOARD_API.get('GET_DASHBOARD', getParams).then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
                })
            },

            // 获取tableHeaders
            getTableHeader() {
                let getParams = {
                    tableName: "dashboard_table",
                    isMine: this.isMine
                }
                this.$api.REPORT_COMMON_API.get("GET_TABLE_HEADER" ,getParams).then(res => {
                    this.tableHeader = res.data
                })
            },

            // 分页导航
            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
                this.$message.success(`页面下标 ${pageIndex}`);
                this.getDataSets()
            },

            handleEdit(index, row) {
                let dashboardId = this.tableData[index].id;
                this.$router.push({
                    path: '/dashboard_form',
                    query: {
                        id: dashboardId
                    }
                })
            },

            handleDelete(index, row) {
                this.$confirm('删除不可恢复，是否确定删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let dashboardId = this.tableData[index].id;
                    let deleteParams = {
                        id: dashboardId
                    }
                    this.$api.REPORT_DASHBOARD_API.delete('DELETE_DASHBOARD', deleteParams).then(res => {
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

            handleData(index, row) {
                let dashboardId = this.tableData[index].id
                this.$router.replace({
                    path: '/dashboard_info',
                    query: {
                        id: dashboardId
                    }
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
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
</style>
