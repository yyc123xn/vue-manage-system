<template>
    <div class="table">
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-file"></i> 数据源</el-breadcrumb-item>
                <el-breadcrumb-item>数据源列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="handle-box">
                <el-select v-model="queryColumn" placeholder="筛选项" class="handle-select mr10" filterable @change="queryColumnChange">
                    <el-option v-for="dataSourceFilterField in dataSourceFilterFields.filterFields"
                               :key="dataSourceFilterField.columnName" :label="dataSourceFilterField.columnComment"
                               :value="dataSourceFilterField.columnName">
                    </el-option>
                </el-select>
                <el-select v-if="querySelectVisible" v-model="queryCondition[0]" placeholder="筛选关键词" class="handle-input mr10" @change="getDataSources">
                    <el-option v-for="enumValue in dataSourceFilterFields.enumsValues[queryColumn]"
                               :key="enumValue.nameEn" :label="enumValue.nameCn"
                               :value="enumValue.nameEn">
                    </el-option>
                </el-select>
                <el-input v-if="!querySelectVisible" v-model="queryCondition[0]" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getDataSources">搜索</el-button>

                <el-button type="primary" icon="el-icon-lx-add" class="mr10" style="float: right" @click="redirect2DataSourceForm">新增数据源</el-button>
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
                                <el-button type="text" icon="el-icon-info" @click="handleInfo(scope.$index, scope.row)">详情</el-button>
                                <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
            <el-form ref="dataSource" :model="dataSource" label-width="10%">
                <el-form-item label="id">
                    {{dataSource.id}}
                </el-form-item>
                <el-form-item label="url">
                    {{dataSource.url}}
                </el-form-item>
                <el-form-item label="id">
                    {{dataSource.id}}
                </el-form-item>
                <el-form-item label="username">
                    {{dataSource.username}}
                </el-form-item>
                <el-form-item label="password">
                    {{dataSource.password}}
                </el-form-item>
                <el-form-item label="负责人">
                    {{dataSource.createDeveloper}}
                </el-form-item>
                <el-form-item label="数据源类型">
                    {{dataSource.dataSourceType}}
                </el-form-item>
                <el-form-item label="数据库">
                    {{dataSource.database}}
                </el-form-item>
                <el-form-item label="权限">
                    {{dataSourceHelper.privilege}}
                </el-form-item>
                <el-form-item label="表">
                    <el-table
                            :data="tables"
                            height="250"
                            border
                            style="width: 80%">
                        <el-table-column
                                label="数据库表"
                                prop="tableName"
                                align="center">
                        </el-table-column>
                    </el-table>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="infoVisible = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item.vue";

    export default {
        components: {ElFormItem},
        name: 'DataSourceTable',
        data: function () {
            return {
                dataSourceFilterFields: [],
                tableData: [],
                tableHeader: {},
                pageIndex: 1,
                pageSize: 10,
                total : 0,
                queryColumn: "",
                queryCondition: [],
                queryColumnExpType: "",
                dataSource : {
                    id : 0,
                    url : '',
                    username : '',
                    password : '',
                    createDeveloper : '',
                    dataSourceType : '',
                    database : '',
                    weight : 0,
                    privilege : [],
                },
                dataSourceHelper: {
                    privilege : []
                },
                dataSourceConstant: {
                    departments: []
                },
                tables: [],
                infoVisible: false,
                editVisible: false,
                delVisible: false,
                querySelectVisible: false,
                isMine: "false",
            }
        },
        created() {
            this.getFilterFields();
            this.getDataSources()
            this.getDepartments()
        },
        watch: {
            isMine(val) {
                this.isMine = val;
                this.pageIndex = 1
                this.getDataSources()
            }
        },
        methods: {

            queryColumnChange() {
                this.queryCondition[0] = ''
                this.querySelectVisible = "" !== this.queryColumn && -1 !== this.dataSourceFilterFields.enums.indexOf(this.queryColumn)
                if ("" !== this.queryColumn) {
                    this.queryColumnExpType = this.dataSourceFilterFields.enumsExp[this.queryColumn]
                }
            },

            // 获取tableHeaders
            getTableHeader() {
                let getParams = {
                    tableName: "data_source_table",
                    isMine: this.isMine
                }
                this.$api.REPORT_COMMON_API.get("GET_TABLE_HEADER" ,getParams).then(res => {
                    this.tableHeader = res.data
                })
            },

            // 获取票据的过滤字段
            getFilterFields() {
                this.$api.REPORT_DATA_SOURCE_API.get('GET_DATA_SOURCE_FILTER_FIELDS').then(res => {
                    this.dataSourceFilterFields = res.data;
                })
            },

            // 获取数据集列表
            getDataSources() {
                this.getTableHeader()
                let getParams = {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    queryColumn: this.queryColumn,
                    queryCondition: this.queryCondition,
                    queryColumnExpType: this.queryColumnExpType,
                    isMine: this.isMine
                }
                this.$api.REPORT_DATA_SOURCE_API.get('GET_DATA_SOURCES', getParams).then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
                })
            },

            // 获取数据源info
            async getDataSourceInfo(id) {
                let queryParams = {
                    id : id
                }
                await this.$api.REPORT_DATA_SOURCE_API.get('GET_DATA_SOURCE_INFO', queryParams).then(res => {
                    this.dataSource =  res.data
                    this.dataSourceHelper.privilege = this.$common.translateDepartmentsFromIds(this.dataSourceConstant.departments, this.dataSource.privilege)
                })
            },

            getDepartments() {
                this.$api.FINANCE_DEPARTMENT_API.get("GET_DEPARTMENTS").then(res => {
                    this.dataSourceConstant.departments = res.data
                })
            },

            // 获取数据库下的所有表
            async getDatabaseTables(database) {
                let getParams = {
                    database : database
                }
                await this.$api.REPORT_DATA_SOURCE_API.get('GET_DATABASE_TABLES', getParams).then(res => {
                    this.tables = res.data
                    this.infoVisible = true;
                })
            },

            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/ms/table/list';
                };
                this.$axios.post(this.url, {
                    page: this.cur_page
                }).then((res) => {
                    this.tableData = res.data.list;
                })
            },

            handleEdit(index, row) {
                let dataSourceId = this.tableData[index].id;
                this.$router.push({
                    path: '/data_source_form',
                    query: {
                        id: dataSourceId
                    }
                })
            },

            handleDelete(index, row) {
                this.$confirm('删除不可恢复，是否确定删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let dataSourceId = this.tableData[index].id;
                    let deleteParams = {
                        id: dataSourceId
                    }
                    this.$api.REPORT_DATA_SOURCE_API.delete('DELETE_DATA_SOURCE', deleteParams).then(res => {
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
                const item = this.tableData[index];
                let id = item.id
                this.getDataSourceInfo(id)
                let database = item.database
                this.getDatabaseTables(database)
            },

            dblhandleCurrentChange(row) {
                this.getDataSourceInfo(row.id)
                this.getDatabaseTables(row.database)
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            // 分页导航
            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
                this.getDataSources()
            },

            redirect2DataSourceForm() {
                this.$router.push("/data_source_form")
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
