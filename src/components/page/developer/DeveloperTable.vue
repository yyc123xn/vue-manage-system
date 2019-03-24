<template>
    <div class="table">
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-profile"></i> 公司员工</el-breadcrumb-item>
                <el-breadcrumb-item>员工列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10">批量删除</el-button>
                <el-select v-model="queryColumn" placeholder="筛选项" class="handle-select mr10">
                    <el-option v-for="developerFilterField in developerFilterFields"
                               :key="developerFilterField.columnName" :label="developerFilterField.columnComment"
                               :value="developerFilterField.columnName">
                    </el-option>
                </el-select>
                <el-input v-model="queryCondition[0]" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getDevelopers">搜索</el-button>
            </el-col>
            <el-table :data="tableData" border class="table" ref="tableData" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="id" sortable></el-table-column>
                <el-table-column prop="nameCn" label="中文名"></el-table-column>
                <el-table-column prop="nameEn" label="英文名" sortable></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-info" @click="handleInfo(scope.$index, scope.row)">详情</el-button>
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

        <!-- 详情弹出框 -->
        <el-dialog title="详情" :visible.sync="infoVisible" width="70%">
            <el-form ref="developer" :model="developer" label-width="10%">
                <el-form-item label="id">
                    {{developer.id}}
                </el-form-item>
                <el-form-item label="中文名">
                    {{developer.nameCn}}
                </el-form-item>
                <el-form-item label="英文名">
                    {{developer.nameEn}}
                </el-form-item>
                <el-form-item label="性别">
                    {{developer.sex}}
                </el-form-item>
                <el-form-item label="email">
                    {{developer.email}}
                </el-form-item>
                <el-form-item label="权限">
                    {{developer.privilege}}
                </el-form-item>
                <el-form-item label="电话号码">
                    {{developer.phoneNumber}}
                </el-form-item>
                <el-form-item label="学历">
                    {{developer.academicDegree}}
                </el-form-item>
                <el-form-item label="基础工资">
                    {{developer.baseWages}}
                </el-form-item>
                <el-form-item label="职务工资">
                    {{developer.dutyWages}}
                </el-form-item>
                <el-form-item label="房屋补贴">
                    {{developer.housingWages}}
                </el-form-item>
                <el-form-item label="养老金">
                    {{developer.pension}}
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="infoVisible = false">确 定</el-button>
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
                developerFilterFields: [],
                tableData: [],
                pageIndex: 1,
                pageSize: 10,
                total : 0,
                queryColumn: "",
                queryCondition: [],
                editVisible: false,
                delVisible: false,
                infoVisible: false,
                developer: {
                    id : 0,
                    nameCn : '',
                    nameEn : '',
                    sex : 0,
                    email : '',
                    privilege : '',
                    status : 1,
                    password : '',
                    group : '',
                    academicDegree : '',
                    baseWages : 0,
                    dutyWages : 0,
                    housingWages : 0,
                    pension : 0,
                    phoneNumber : ''
                },
                idx: -1
            }
        },
        created() {
            this.getFilterFields();
            this.getDevelopers()
        },
        computed: {
        },
        methods: {
            // 获取票据的过滤字段
            getFilterFields() {
                this.$api.FINANCE_DEVELOPER_API.get('GET_DEVELOPER_FILTER_FIELDS').then(res => {
                    this.developerFilterFields = res.data;
                })
            },

            // 获取数据集列表
            getDevelopers() {
                let queryParams = {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    queryColumn: this.queryColumn,
                    queryCondition: this.queryCondition,
                }
                this.$api.FINANCE_DEVELOPER_API.get('GET_DEVELOPERS' ,queryParams).then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
                })
            },

            handleInfo(index, row) {
                const item = this.tableData[index];
                let id = item.id
                this.getDeveloperInfo(id)
                this.infoVisible = true;
            },

            getDeveloperInfo(developerId) {
                let getParams = {
                    id : developerId
                }
                this.$api.FINANCE_DEVELOPER_API.get("GET_DEVELOPER_INFO", getParams).then(res => {
                    this.developer = res.data
                })
            },

            handleEdit(index, row) {
                let developerId = this.tableData[index].id;
                this.$router.push({
                    path: '/developer_form',
                    query: {
                        id: developerId
                    }
                })
            },

            handleDelete(index, row) {
                this.$confirm('删除不可恢复，是否确定删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let developerId = this.tableData[index].id;
                    let deleteParams = {
                        id: developerId
                    }
                    this.$api.FINANCE_DEVELOPER_API.delete('DELETE_DEVELOPER', deleteParams).then(res => {
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
