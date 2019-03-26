<template>
    <div class="table">
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-punch"></i> 公司票据</el-breadcrumb-item>
                <el-breadcrumb-item>票据列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10">批量删除</el-button>
                <el-select v-model="queryColumn" placeholder="筛选项" class="handle-select mr10">
                    <el-option v-for="voucherFilterField in voucherFilterFields"
                               :key="voucherFilterField.columnName" :label="voucherFilterField.columnComment"
                               :value="voucherFilterField.columnName">
                    </el-option>
                </el-select>
                <el-input v-model="queryCondition[0]" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getVouchers">搜索</el-button>
            </el-col>
            <el-col>
                <el-tabs type="border-card" v-model="isMine">
                    <el-tab-pane name="false" label="全部">
                    </el-tab-pane>
                    <el-tab-pane name="true" label="我的">
                        <el-tabs type="border-card" v-model="status">
                            <el-tab-pane v-for="(status, index) in constant.voucherStatuses" :name="status.nameEn" :key="status.nameEn" :label="status.nameCn">
                            </el-tab-pane>
                        </el-tabs>
                    </el-tab-pane>
                    <el-table :data="tableData" border class="table" ref="tableData" @selection-change="handleSelectionChange" @cell-dblclick="dblhandleCurrentChange">
                        <el-table-column type="selection" :selectable="selectable" width="55" align="center"></el-table-column>
                        <el-table-column prop="id" label="id" sortable></el-table-column>
                        <el-table-column prop="name" label="名称"></el-table-column>
                        <el-table-column prop="status" label="票据状态"></el-table-column>
                        <el-table-column prop="type" label="票据类型"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
                        <el-table-column label="操作" width="180" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" icon="el-icon-info" @click="handleInfo(scope.$index, scope.row)">详情</el-button>
                                <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tabs>
            </el-col>
            <el-col style="margin-top: 20px" v-if="isMine === 'true' && -1 !== ['REJECTED', 'UNCOMMITTED'].indexOf(status)">
                <el-button type="primary" @click="commitVouchers">提交</el-button>
            </el-col>
            <el-col style="margin-top: 20px" v-if="isMine === 'true' && status === 'UNAUDITED' ">
                <el-button type="primary" @click="auditVouchers">通过</el-button>
                <el-button type="warning" @click="rejectVouchers">回绝</el-button>
            </el-col>
            <el-col class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="pageSize" :total="total">
                </el-pagination>
            </el-col>
        </el-col>

        <!-- 详情弹出框 -->
        <el-dialog title="详情" :visible.sync="infoVisible" width="70%">
            <el-form ref="voucher" :model="voucher" label-width="10%">
                <el-form-item label="id">
                    {{voucher.id}}
                </el-form-item>
                <el-form-item label="名称">
                    {{voucher.name}}
                </el-form-item>
                <el-form-item label="描述">
                    {{voucher.description}}
                </el-form-item>
                <el-form-item label="日期">
                    {{voucher.date}}
                </el-form-item>
                <el-form-item label="状态">
                    {{voucher.status}}
                </el-form-item>
                <el-form-item label="类型">
                    {{voucher.type}}
                </el-form-item>
                <el-form-item label="电话号码">
                    {{voucher.phoneNumber}}
                </el-form-item>
                <el-form-item label="审核人">
                    {{voucher.auditDeveloper}}
                </el-form-item>
                <el-form-item label="回绝理由">
                    {{voucher.reason}}
                </el-form-item>
                <el-form-item label="票据详情">
                    <el-table
                            :data="voucher.voucherDetails"
                            style="width: 100%">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" class="demo-table-expand">
                                    <el-form-item label="名称">{{props.row.name}}</el-form-item>
                                    <el-form-item label="描述" style="width: 100%" >{{props.row.description}}</el-form-item>
                                    <el-form-item label="合计">{{props.row.sum}}</el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="名称"
                                prop="name">
                        </el-table-column>
                        <el-table-column
                                label="描述"
                                prop="description">
                        </el-table-column>
                        <el-table-column
                                label="合计"
                                prop="sum">
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="infoVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 提交弹出框 -->
        <el-dialog title="提交审核" :visible.sync="commitVisible" width="30%">
            <el-form label-width="50px" :model="commitForm" ref="commitForm" :rules="rules">
                <el-form-item label="姓名" prop="auditDeveloper">
                    <el-select v-model="commitForm.auditDeveloper" placeholder="筛选项" class="handle-select mr10" filterable>
                        <el-option v-for="developer in constant.developers"
                                   :key="developer.nameEn" :label="developer.nameCn"
                                   :value="developer.nameEn">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="commitVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveCommit('commitForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 回绝弹出框 -->
        <el-dialog title="回绝票据" :visible.sync="rejectVisible" width="30%">
            <el-form label-width="20%" :model="rejectForm" ref="rejectForm" :rules="rules">
                <el-form-item label="回绝理由" prop="reason">
                    <el-input type="textarea" rows="5" v-model="rejectForm.reason"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rejectVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveReject('rejectForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ElCol from "element-ui/packages/col/src/col";
    import ElInput from "../../../../node_modules/element-ui/packages/input/src/input.vue";

    export default {
        components: {
            ElInput,
            ElCol},
        name: 'DeveloperTable',
        data: function () {
            return {
                voucherFilterFields: [],
                tableData: [],
                pageIndex: 1,
                pageSize: 10,
                total : 0,
                queryColumn: "",
                queryCondition: [],
                editVisible: false,
                delVisible: false,
                infoVisible: false,
                commitVisible: false,
                rejectVisible: false,
                selectedVoucherIds: [],
                commitForm: {
                    auditDeveloper: ""
                },
                rejectForm: {
                    reason: ""
                },
                mapping: {},
                isMine: "false",
                status: "UNCOMMITTED",
                voucher: {
                    id : 0,
                    name : '',
                    description : '',
                    date: '',
                    status: '',
                    type: '',
                    voucherDetails: [{
                        id: 0,
                        name: '票据详情1',
                        description: '票据描述1',
                        sum: 0
                    }]
                },
                rules: {
                    auditDeveloper: [
                        { required: true, message: '请选择审核人', trigger: 'blur' }
                    ],
                    reason: [
                        { required: true, message: '请填写回绝理由', trigger: 'blur' }
                    ]
                },
                constant: {
                    developers: [],
                    voucherStatuses: []
                }
            }
        },
        created() {
            this.getFilterFields()
            this.getVouchers()
            this.getDevelopers()
            this.getVoucherStatuses()
        },
        watch: {
            isMine(val) {
                this.isMine = val;
                this.getVouchers()
            },

            status(val) {
                this.status = val;
                this.getVouchers()
            }
        },
        methods: {
            // 获取票据的过滤字段
            getFilterFields() {
                this.$api.FINANCE_VOUCHER_API.get('GET_VOUCHER_FILTER_FIELDS').then(res => {
                    this.voucherFilterFields = res.data;
                })
            },

            getVoucherStatuses() {
                this.$api.FINANCE_VOUCHER_API.get('GET_VOUCHER_STATUSES').then(res => {
                    this.constant.voucherStatuses = res.data
                })
            },

            // 获取员工列表
            getDevelopers() {
                let queryParams = {
                    pageIndex: 0,
                    pageSize: 1000
                }
                this.$api.FINANCE_DEVELOPER_API.get('GET_DEVELOPERS' ,queryParams).then(res => {
                    this.constant.developers = res.data.list
                })
            },

            selectable(row) {
                console.log(row.createDeveloper)
                console.log(row.updateDeveloper)
                return -1 !== ['', row.createDeveloper, row.updateDeveloper].indexOf(row.auditDeveloper)
            },

            // 获取固定资产列表
            getVouchers() {
                let queryParams = {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    queryColumn: this.queryColumn,
                    queryCondition: this.queryCondition,
                    isMine: this.isMine
                }
                if ('true' === this.isMine) {
                    queryParams.status = this.status
                }
                this.$api.FINANCE_VOUCHER_API.get('GET_VOUCHERS' ,queryParams).then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
                    this.mapping = res.data.mapping
                    this.tableData.forEach(voucher => {
                        this.mapping.status.forEach(voucherStatus => {
                            if (voucher.status === voucherStatus.nameEn) {
                                voucher.status = voucherStatus.nameCn
                            }
                        })
                        this.mapping.type.forEach(voucherType => {
                            if (voucher.type === voucherType.nameEn) {
                                voucher.type = voucherType.nameCn
                            }
                        })
                    })
                })
            },

            saveCommit(commitForm) {
                this.$refs[commitForm].validate((valid) => {
                    if (valid) {
                        let putParams = {
                            voucherIds : this.selectedVoucherIds,
                            auditDeveloper: this.commitForm.auditDeveloper
                        }
                        this.$api.FINANCE_VOUCHER_API.put("COMMIT_VOUCHERS", putParams).then(res => {
                            this.$message.success("提交成功")
                            this.getVouchers()
                            this.$forceUpdate()
                        })
                        this.commitVisible = false;
                    } else {
                        this.$message.error("请选择审核人")
                        return false;
                    }
                })
            },

            saveReject(rejectForm) {
                this.$refs[rejectForm].validate((valid) => {
                    if (valid) {
                        let putParams = {
                            voucherIds : this.selectedVoucherIds,
                            reason: this.rejectForm.reason
                        }
                        this.$api.FINANCE_VOUCHER_API.put("REJECT_VOUCHERS", putParams).then(res => {
                            this.$message.success("提交成功")
                            this.getVouchers()
                            this.$forceUpdate()
                        })
                        this.rejectVisible = false;
                    } else {
                        this.$message.error("请填写回绝理由")
                        return false;
                    }
                })
            },

            commitVouchers() {
                if (0 === this.selectedVoucherIds.length) {
                    this.$message.error("请选择至少一个票据")
                } else {
                    this.commitVisible = true;
                }
            },

            auditVouchers() {
                if (0 === this.selectedVoucherIds.length) {
                    this.$message.error("请选择至少一个票据")
                } else {
                    let putParams = {
                        voucherIds : this.selectedVoucherIds
                    }
                    this.$api.FINANCE_VOUCHER_API.put("AUDIT_VOUCHERS", putParams).then(res => {
                        this.$message.success("提交成功")
                        this.getVouchers()
                        this.$forceUpdate()
                    })
                }
            },

            rejectVouchers() {
                if (0 === this.selectedVoucherIds.length) {
                    this.$message.error("请选择至少一个票据")
                } else {
                    this.rejectVisible = true;
                }
            },

            handleEdit(index, row) {
                let voucherId = this.tableData[index].id;
                this.$router.push({
                    path: '/voucher_form',
                    query: {
                        id: voucherId
                    }
                })
            },

            handleInfo(index, row) {
                let voucherId = this.tableData[index].id;
                this.getVoucherInfo(voucherId)
                this.infoVisible = true
            },

            getVoucherInfo(voucherId) {
                let getParams = {
                    id : voucherId
                }
                this.$api.FINANCE_VOUCHER_API.get("GET_VOUCHER_INFO", getParams).then(res => {
                    this.voucher = res.data
                    this.voucher.date = new Date(this.voucher.date)
                })
            },

            dblhandleCurrentChange(row) {
                this.getVoucherInfo(row.id)
                this.infoVisible = true
            },

            handleDelete(index, row) {
                this.$confirm('删除不可恢复，是否确定删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let voucherId = this.tableData[index].id;
                    let deleteParams = {
                        id: voucherId
                    }
                    this.$api.FINANCE_VOUCHER_API.delete('DELETE_VOUCHER', deleteParams).then(res => {
                        this.tableData.splice(index, 1);
                        this.$message.success("删除成功")
                    })
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            handleSelectionChange(vouchers) {
                this.selectedVoucherIds = [];
                vouchers.forEach(voucher => {
                    this.selectedVoucherIds.push(voucher.id)
                })
            },

            // 分页导航
            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
                this.getDevelopers()
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
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand {
        width: 100%;
    }
</style>
