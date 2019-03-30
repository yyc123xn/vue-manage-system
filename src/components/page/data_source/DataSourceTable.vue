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
                <el-button type="primary" icon="delete" class="handle-del mr10">批量删除</el-button>
                <el-select v-model="queryColumn" placeholder="筛选项" class="handle-select mr10">
                    <el-option v-for="dataSourceFilterField in dataSourceFilterFields"
                               :key="dataSourceFilterField.columnName" :label="dataSourceFilterField.columnComment"
                               :value="dataSourceFilterField.columnName">
                    </el-option>
                </el-select>
                <el-input v-model="queryCondition[0]" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getDataSources">搜索</el-button>
            </el-col>
            <el-col>
                <el-tabs type="border-card" v-model="isMine">
                    <el-tab-pane name="false" label="全部">
                    </el-tab-pane>
                    <el-tab-pane name="true" label="我的">
                    </el-tab-pane>
                    <el-table :data="tableData" border class="table" ref="tableData" @selection-change="handleSelectionChange" @cell-dblclick="dblhandleCurrentChange">
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column prop="id" label="id" sortable></el-table-column>
                        <el-table-column prop="createDeveloper" label="负责人"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
                        <el-table-column prop="dataSourceType" label="数据源类型"></el-table-column>
                        <el-table-column prop="database" label="数据库"></el-table-column>
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
    import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item.vue";

    export default {
        components: {ElFormItem},
        name: 'DataSourceTable',
        data: function () {
            return {
                dataSourceFilterFields: [],
                tableData: [],
                pageIndex: 1,
                pageSize: 10,
                total : 0,
                queryColumn: "",
                queryCondition: [],
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
                isMine: "false",
                form: {
                    name: '',
                    date: '',
                    address: ''
                },
                idx: -1,
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
                this.getDataSources()
            }
        },
        methods: {
            // 获取票据的过滤字段
            getFilterFields() {
                this.$api.REPORT_DATA_SOURCE_API.get('GET_DATA_SOURCE_FILTER_FIELDS').then(res => {
                    console.log(res.data)
                    this.dataSourceFilterFields = res.data;
                })
            },

            // 获取数据集列表
            getDataSources() {
                let queryParams = {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    queryColumn: this.queryColumn,
                    queryCondition: this.queryCondition,
                    isMine: this.isMine
                }
                this.$api.REPORT_DATA_SOURCE_API.get('GET_DATA_SOURCES' ,queryParams).then(res => {
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
                let queryParams = {
                    database : database
                }
                await this.$api.REPORT_DATA_SOURCE_API.get('GET_DATABASE_TABLES', queryParams).then(res => {
                    console.log(res)
                    this.tables = res.data
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
                this.infoVisible = true;
            },

            dblhandleCurrentChange(row) {
                this.getDataSourceInfo(row.id)
                this.getDatabaseTables(row.database)
                this.infoVisible = true;
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            // 分页导航
            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
                this.getDataSources()
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
