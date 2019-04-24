<template>
    <div class="table">
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-profile"></i> 公司客户</el-breadcrumb-item>
                <el-breadcrumb-item>客户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="handle-box">
                <el-select v-model="queryColumn" placeholder="筛选项" class="handle-select mr10" filterable>
                    <el-option v-for="clientFilterField in clientFilterFields"
                               :key="clientFilterField.columnName" :label="clientFilterField.columnComment"
                               :value="clientFilterField.columnName">
                    </el-option>
                </el-select>
                <el-input v-model="queryCondition[0]" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getClients">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" class="mr10" style="float: right" @click="redirect2ClientForm">新增客户</el-button>
            </el-col>
            <el-col>
                <el-tabs type="border-card" v-model="isMine">
                    <el-tab-pane name="false" label="全部">
                    </el-tab-pane>
                    <el-tab-pane name="true" label="我的">
                    </el-tab-pane>
                    <el-table :data="tableData" border class="table" ref="tableData" @selection-change="handleSelectionChange" @cell-dblclick="dblhandleCurrentChange">
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column v-for="tableHeader in tableHeader.tableHeaders" :prop="tableHeader.prop" :label="tableHeader.label" :sortable="tableHeader.sortable">
                        </el-table-column>
                        <el-table-column label="操作" width="180" align="center">
                            <template slot-scope="scope">
                                <el-button v-if="tableData[scope.$index].infoVisible "type="text" icon="el-icon-info" @click="handleInfo(scope.$index, scope.row)">详情</el-button>
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

        <!-- 详情弹出框 -->
        <el-dialog title="详情" :visible.sync="infoVisible" width="70%">
            <el-form ref="client" :model="client" label-width="10%">
                <el-form-item label="id">
                    {{client.id}}
                </el-form-item>
                <el-form-item label="中文名">
                    {{client.nameCn}}
                </el-form-item>
                <el-form-item label="英文名">
                    {{client.nameEn}}
                </el-form-item>
                <el-form-item label="性别">
                    {{client.sex}}
                </el-form-item>
                <el-form-item label="email">
                    {{client.email}}
                </el-form-item>
                <el-form-item label="公司名称">
                    {{client.company}}
                </el-form-item>
                <el-form-item label="电话号码">
                    {{client.phoneNumber}}
                </el-form-item>
                <el-form-item label="仍欠款">
                    {{client.debt}}
                </el-form-item>
                <el-form-item label="已回款">
                    {{client.receivedPayments}}
                </el-form-item>
                <el-form-item label="地址">
                    {{clientHelper.address}}
                </el-form-item>
                <el-form-item label="行业">
                    {{client.business}}
                </el-form-item>
                <el-form-item label="描述">
                    {{client.description}}
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="infoVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'ClientTable',
        data: function () {
            return {
                clientFilterFields: [],
                tableHeader: {},
                tableData: [],
                pageIndex: 1,
                pageSize: 10,
                total : 0,
                queryColumn: "",
                queryCondition: [],
                editVisible: false,
                delVisible: false,
                infoVisible: false,
                isMine: "false",
                client: {
                    id : 0,
                    nameCn : '',
                    nameEn : '',
                    sex : 0,
                    email : '',
                    status : 1,
                    company : '',
                    phoneNumber : '',
                    debt: 0,
                    receivedPayments: 0,
                    address: [{}, {}, {}],
                    business: '',
                    description: ''
                },

                clientHelper: {
                    address: []
                }
            }
        },
        created() {
            this.getFilterFields();
            this.getClients()
        },
        computed: {
        },
        watch: {
            isMine(val) {
                this.isMine = val;
                this.getClients()
            }
        },
        methods: {
            // 获取票据的过滤字段
            getFilterFields() {
                this.$api.FINANCE_CLIENT_API.get('GET_CLIENT_FILTER_FIELDS').then(res => {
                    this.clientFilterFields = res.data;
                })
            },

            // 获取数据集列表
            getClients() {
                this.getTableHeader()
                let queryParams = {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    queryColumn: this.queryColumn,
                    queryCondition: this.queryCondition,
                    isMine: this.isMine
                }
                this.$api.FINANCE_CLIENT_API.get('GET_CLIENTS' ,queryParams).then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
                })
            },

            // 获取tableHeaders
            getTableHeader() {
                let getParams = {
                    tableName: "client_table",
                    isMine: this.isMine
                }
                this.$api.FINANCE_COMMON_API.get("GET_TABLE_HEADER" ,getParams).then(res => {
                    this.tableHeader = res.data
                })
            },

            handleEdit(index, row) {
                let clientId = this.tableData[index].id;
                this.$router.push({
                    path: '/client_form',
                    query: {
                        id: clientId
                    }
                })
            },

            dblhandleCurrentChange(row) {
                this.getClientInfo(row.id)
                this.infoVisible = true;
            },

            handleInfo(index, row) {
                const item = this.tableData[index];
                let id = item.id
                this.getClientInfo(id)
                this.infoVisible = true;
            },

            getClientInfo(clientId) {
                let getParams = {
                    id : clientId
                }
                this.$api.FINANCE_CLIENT_API.get("GET_CLIENT_INFO", getParams).then(res => {
                    this.client = res.data
                    this.client.address.forEach(inner => {
                        this.clientHelper.address.push(inner.value)
                    })
                })
            },

            handleDelete(index, row) {
                this.$confirm('删除不可恢复，是否确定删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let clientId = this.tableData[index].id;
                    let deleteParams = {
                        id: clientId
                    }
                    this.$api.FINANCE_CLIENT_API.delete('DELETE_CLIENT', deleteParams).then(res => {
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

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            // 分页导航
            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
                this.getClients()
            },

            redirect2ClientForm() {
                this.$router.push("/client_form")
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
</style>
