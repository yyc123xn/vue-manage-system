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
                <el-select v-model="queryColumn" placeholder="筛选项" class="handle-select mr10" filterable @change="queryColumnChange">
                    <el-option v-for="developerFilterField in developerFilterFields.filterFields"
                               :key="developerFilterField.columnName" :label="developerFilterField.columnComment"
                               :value="developerFilterField.columnName">
                    </el-option>
                </el-select>
                <el-select v-if="querySelectVisible" v-model="queryCondition[0]" placeholder="筛选关键词" class="handle-input mr10" @change="getDevelopers">
                    <el-option v-for="enumValue in developerFilterFields.enumsValues[queryColumn]"
                               :key="enumValue.nameEn" :label="enumValue.nameCn"
                               :value="enumValue.nameEn">
                    </el-option>
                </el-select>
                <el-input v-if="!querySelectVisible" v-model="queryCondition[0]" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getDevelopers">搜索</el-button>
                <el-tag style="margin-left: 1%" size="medium">共{{total}}名员工</el-tag>
                <el-button type="primary" icon="el-icon-lx-add" class="mr10" style="float: right" @click="redirect2DeveloperForm">新增员工</el-button>
            </el-col>
            <el-table :data="tableData" border class="table" ref="tableData" @selection-change="handleSelectionChange" @cell-dblclick="dblhandleCurrentChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
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
            <el-col class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="total">
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
                <el-form-item v-if="undefined !== developer.password && '' !== developer.password" label="密码">
                    {{developer.password}}
                </el-form-item>
                <el-form-item label="权限">
                    {{developerHelper.privilege}}
                </el-form-item>
                <el-form-item label="部门">
                    {{developerHelper.departmentId}}
                </el-form-item>
                <el-form-item label="电话号码">
                    {{developer.phoneNumber}}
                </el-form-item>
                <el-form-item label="学历">
                    {{developerHelper.academicDegree}}
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
    </div>
</template>

<script>
    export default {
        name: 'DeveloperTable',
        data: function () {
            return {
                developerFilterFields: [],
                tableHeader: {},
                tableData: [],
                pageIndex: 1,
                pageSize: 10,
                total : 0,
                queryColumn: "",
                queryCondition: [],
                queryColumnExpType: "",
                editVisible: false,
                delVisible: false,
                infoVisible: false,
                querySelectVisible: false,
                loading: false,
                developer: {
                    id : 0,
                    nameCn : '',
                    nameEn : '',
                    sex : 0,
                    email : '',
                    privilege : [],
                    status : 1,
                    password : '',
                    departmentId : '',
                    academicDegree : '',
                    baseWages : 0,
                    dutyWages : 0,
                    housingWages : 0,
                    pension : 0,
                    phoneNumber : ''
                },

                developerHelper : {
                    privilege: [],
                    academicDegree : '',
                    departmentId : '',
                },

                developerConstant: {
                    departments : [],
                    academicDegrees: []
                }
            }
        },
        created() {
            this.getFilterFields()
            this.getDevelopers()
            this.getAcademicDegrees()
            this.getDepartments()
        },

        methods: {

            queryColumnChange() {
                this.queryCondition[0] = ''
                this.querySelectVisible = "" !== this.queryColumn && -1 !== this.developerFilterFields.enums.indexOf(this.queryColumn)
                if ("" !== this.queryColumn) {
                    this.queryColumnExpType = this.developerFilterFields.enumsExp[this.queryColumn]
                }
            },

            getAcademicDegrees() {
                this.$api.FINANCE_DEVELOPER_API.get('GET_ACADEMIC_DEGREES').then(res => {
                    this.developerConstant.academicDegrees = res.data
                })
            },

            // 获取票据的过滤字段
            getFilterFields() {
                this.$api.FINANCE_DEVELOPER_API.get('GET_DEVELOPER_FILTER_FIELDS').then(res => {
                    this.developerFilterFields = res.data;
                })
            },

            // 获取tableHeaders
            getTableHeader() {
                let getParams = {
                    tableName: "developer_table",
                    isMine: 0
                }
                this.$api.FINANCE_COMMON_API.get("GET_TABLE_HEADER" ,getParams).then(res => {
                    this.tableHeader = res.data
                })
            },

            // 获取员工列表
            getDevelopers() {
                this.getTableHeader()
                let queryParams = {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    queryColumn: this.queryColumn,
                    queryCondition: this.queryCondition,
                    queryColumnExpType: this.queryColumnExpType,
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
            },

            dblhandleCurrentChange(row) {
                this.getDeveloperInfo(row.id)
            },

            getDeveloperInfo(developerId) {
                let getParams = {
                    id : developerId
                }
                this.$api.FINANCE_DEVELOPER_API.get("GET_DEVELOPER_INFO", getParams).then(res => {
                    this.developer = res.data
                    this.developerHelper.departmentId = this.translateDepartmentFromId(this.developerConstant.departments, this.developer.departmentId)
                    this.developerHelper.privilege = this.$common.translateDepartmentsFromIds(this.developerConstant.departments, this.developer.privilege);
                    this.developerHelper.academicDegree = this.$common.translateNameEn(this.developerConstant.academicDegrees, this.developer.academicDegree)
                    this.infoVisible = true;
                })
            },

            translateDepartmentFromId(departments, id) {
                let res = ''
                departments.forEach(department => {
                    if (department.value === id) {
                        res = department.label
                    }
                    if (0 !== department.children.length) {
                        let inner = this.translateDepartmentFromId(department.children, id)
                        if('' !== inner) {
                            res = inner
                        }
                    }
                })
                return res
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

            getDepartments() {
                this.$api.FINANCE_DEPARTMENT_API.get("GET_DEPARTMENTS").then(res => {
                    this.developerConstant.departments = res.data
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

            redirect2DeveloperForm() {
                this.$router.push("/developer_form")
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
