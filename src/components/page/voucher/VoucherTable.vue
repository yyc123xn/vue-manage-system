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
            <el-table :data="tableData" border class="table" ref="tableData" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="id" sortable></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="status" label="票据状态" sortable></el-table-column>
                <el-table-column prop="type" label="票据类型" sortable></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-col class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="pageSize" :total="total">
                </el-pagination>
            </el-col>
        </el-col>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
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
                mapping: {},
                form: {
                    name: '',
                    date: '',
                    address: ''
                },
                idx: -1
            }
        },
        created() {
            this.getFilterFields()
            this.getVouchers()
        },
        computed: {
        },
        methods: {
            // 获取票据的过滤字段
            getFilterFields() {
                this.$api.FINANCE_VOUCHER_API.get('GET_VOUCHER_FILTER_FIELDS').then(res => {
                    this.voucherFilterFields = res.data;
                })
            },

            // 获取固定资产列表
            getVouchers() {
                let queryParams = {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    queryColumn: this.queryColumn,
                    queryCondition: this.queryCondition,
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

            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                }
                this.editVisible = true;
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            // 分页导航
            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
                this.getDevelopers()
            },

            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
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
