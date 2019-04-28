<template>
    <div class="table">
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-sort"></i> 文件转表</el-breadcrumb-item>
                <el-breadcrumb-item>文件列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="handle-box">
                <el-select v-model="queryColumn" placeholder="筛选项" class="handle-select mr10" filterable @change="queryColumnChange">
                    <el-option v-for="fileTableFilterField in fileTableFilterFields.filterFields"
                               :key="fileTableFilterField.columnName" :label="fileTableFilterField.columnComment"
                               :value="fileTableFilterField.columnName">
                    </el-option>
                </el-select>
                <el-select v-if="querySelectVisible" v-model="queryCondition[0]" placeholder="筛选关键词" class="handle-input mr10" @change="getFileTables">
                    <el-option v-for="enumValue in fileTableFilterFields.enumsValues[queryColumn]"
                               :key="enumValue.nameEn" :label="enumValue.nameEn"
                               :value="enumValue.nameEn">
                    </el-option>
                </el-select>
                <el-input v-if="!querySelectVisible" v-model="queryCondition[0]" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getFileTables">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" class="mr10" style="float: right" @click="redirect2FileTableForm">上传文件</el-button>
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
                            <el-button v-if="tableData[scope.$index].file2TableVisible" type="text" icon="el-icon-circle-plus-outline" @click="handleFile2Table(scope.$index, scope.row)">file2Table</el-button>
                            <el-button v-if="tableData[scope.$index].downloadFileVisible" type="text" icon="el-icon-lx-down" @click="handleDownloadFile(scope.$index, scope.row)">下载源文件</el-button>
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
            <el-form ref="fileTable" :model="fileTable" label-width="10%">
                <el-form-item label="id">
                    {{fileTable.id}}
                </el-form-item>
                <el-form-item label="文件原名">
                    {{fileTable.fileOriginalName}}
                </el-form-item>
                <el-form-item label="文件路径">
                    {{fileTable.filePath}}
                </el-form-item>

                <el-form-item label="文件类型">
                    {{fileTable.fileType}}
                </el-form-item>
                <el-form-item label="数据库">
                    {{fileTable.database}}
                </el-form-item>
                <el-form-item label="表名">
                    {{fileTable.tableName}}
                </el-form-item>
                <el-form-item label="字段详情">
                    <el-table :data="fileTable.fileTableFields">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="right" inline class="demo-table-expand">
                                    <el-form-item label="字段类型">{{props.row.dataType}}
                                    </el-form-item>
                                    <el-form-item label="字段名">{{props.row.fieldName}}
                                    </el-form-item>
                                    <el-form-item label="字段备注">{{props.row.fieldComment}}
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="字段类型"
                                prop="dataType">
                        </el-table-column>
                        <el-table-column
                                label="字段名"
                                prop="fieldName">
                        </el-table-column>
                        <el-table-column
                                label="字段备注"
                                prop="fieldComment">
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'FileTableTable',
        data: function () {
            return {
                rules: {
                    beginAndEndTime: [
                        {required: true, message: '请选择开始和结束时间', trigger: 'blur'}
                    ]
                },
                fileTableFilterFields: [],
                tableHeader: {},
                tableData: [],
                pageIndex: 1,
                pageSize: 10,
                total : 0,
                queryColumn: "",
                queryCondition: [],
                queryColumnExpType: "",
                editVisible: false,
                infoVisible: false,
                querySelectVisible: false,
                fileTable: {
                    id: 0,
                    filePresentName: '',
                    fileOriginalName: '',
                    filePath: '',
                    database: '',
                    fileType: '',
                    tableName: '',
                    createTime: '',
                    updateTime: '',
                    createDeveloper: '',
                    updateDeveloper: '',
                    file_table_fields: []
                }
            }
        },
        created() {
            this.getFilterFields();
            this.getFileTables();
        },
        methods: {

            queryColumnChange() {
                this.queryCondition[0] = ''
                this.querySelectVisible = "" !== this.queryColumn && -1 !== this.fileTableFilterFields.enums.indexOf(this.queryColumn)
                if ("" !== this.queryColumn) {
                    this.queryColumnExpType = this.fileTableFilterFields.enumsExp[this.queryColumn]
                }
            },

            // 获取tableHeaders
            getTableHeader() {
                let getParams = {
                    tableName: "file_table_table",
                    isMine: false
                }
                this.$api.REPORT_COMMON_API.get("GET_TABLE_HEADER" ,getParams).then(res => {
                    this.tableHeader = res.data
                })
            },

            // 获取数据集的过滤字段
            getFilterFields() {
                this.$api.REPORT_FILE_TABLE_API.get('GET_FILE_TABLE_FILTER_FIELDS').then(res => {
                    this.fileTableFilterFields = res.data;
                })
            },

            // 获取数据集列表
            getFileTables() {
                this.getTableHeader()
                let queryParams = {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    queryColumn: this.queryColumn,
                    queryCondition: this.queryCondition,
                    queryColumnExpType: this.queryColumnExpType,
                    isMine: false
                }
                this.$api.REPORT_FILE_TABLE_API.get('GET_FILE_TABLE', queryParams).then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
                })
            },

            handleEdit(index, row) {
                let fileTableId = this.tableData[index].id;
                this.$router.push({
                    path: '/file_table_form',
                    query: {
                        id: fileTableId
                    }
                })
            },

            handleDelete(index, row) {
                this.$confirm('删除不可恢复，是否确定删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let fileTableId = this.tableData[index].id;
                    let deleteParams = {
                        id: fileTableId
                    }
                    this.$api.REPORT_FILE_TABLE_API.delete('DELETE_FILE_TABLE', deleteParams).then(res => {
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
                let fileTableId = this.tableData[index].id;
                this.getFileTableInfo(fileTableId)
            },

            handleFile2Table(index, row) {
                let fileTableId = this.tableData[index].id;
                let getParams = {
                    id : fileTableId
                }
                this.$api.REPORT_FILE_TABLE_API.get("FILE_2_TABLE", getParams).then(res => {
                    this.$message.success("开始将文件中数据导入到数据库表")
                })
            },

            handleDownloadFile(index, row) {
                let fileTableId = this.tableData[index].id
                window.location.href = "http://localhost:7777/report/file_table/download_file?id=" + fileTableId
            },

            // 获取数据集详情
            getFileTableInfo(fileTableId) {
                let queryParams = {
                    id : fileTableId
                }
                this.$api.REPORT_FILE_TABLE_API.get('GET_FILE_TABLE_INFO', queryParams).then(res => {
                    this.fileTable = res.data
                    this.infoVisible = true
                })
            },

            dblhandleCurrentChange(row) {
                this.getFileTableInfo(row.id)
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
                this.getFileTables()
            },

            redirect2FileTableForm() {
                this.$router.push("/file_table_form")
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
