<template>
    <div class="table">
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-apps"></i> 公司固定资产</el-breadcrumb-item>
                <el-breadcrumb-item>固定资产列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="handle-box">
                <el-select v-model="queryColumn" placeholder="筛选项" class="handle-select mr10" filterable @change="queryColumnChange">
                    <el-option v-for="fixedAssetsFilterField in fixedAssetsFilterFields.filterFields"
                               :key="fixedAssetsFilterField.columnName" :label="fixedAssetsFilterField.columnComment"
                               :value="fixedAssetsFilterField.columnName">
                    </el-option>
                </el-select>
                <el-select v-if="querySelectVisible" v-model="queryCondition[0]" placeholder="筛选关键词" class="handle-input mr10" @change="getFixedAssets">
                    <el-option v-for="enumValue in fixedAssetsFilterFields.enumsValues[queryColumn]"
                               :key="enumValue.nameEn" :label="enumValue.nameCn"
                               :value="enumValue.nameEn">
                    </el-option>
                </el-select>
                <el-input v-if="!querySelectVisible" v-model="queryCondition[0]" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getFixedAssets">搜索</el-button>
                <el-tag style="margin-left: 1%" size="medium">共{{total}}个固定资产</el-tag>
                <el-button type="primary" icon="el-icon-lx-add" class="mr10" style="float: right" @click="redirect2FixedAssetsForm">新增固定资产</el-button>
            </el-col>
            <el-table :data="tableData" border class="table" ref="tableData" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column v-for="tableHeader in tableHeader.tableHeaders" :prop="tableHeader.prop" :label="tableHeader.label" :sortable="tableHeader.sortable">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
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
    </div>
</template>

<script>
    export default {
        name: 'DeveloperTable',
        data: function () {
            return {
                fixedAssetsFilterFields: [],
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
                querySelectVisible: false,
                form: {
                    name: '',
                    date: '',
                    address: ''
                }
            }
        },
        created() {
            this.getFilterFields()
            this.getFixedAssets()
        },
        computed: {
        },
        methods: {

            queryColumnChange() {
                this.queryCondition[0] = ''
                this.querySelectVisible = "" !== this.queryColumn && -1 !== this.fixedAssetsFilterFields.enums.indexOf(this.queryColumn)
                if ("" !== this.queryColumn) {
                    this.queryColumnExpType = this.fixedAssetsFilterFields.enumsExp[this.queryColumn]
                }
            },

            // 获取票据的过滤字段
            getFilterFields() {
                this.$api.FINANCE_FIXED_ASSETS_API.get('GET_FIXED_ASSETS_FILTER_FIELDS').then(res => {
                    this.fixedAssetsFilterFields = res.data;
                })
            },

            // 获取固定资产列表
            getFixedAssets() {
                this.getTableHeader()
                let getParams = {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    queryColumn: this.queryColumn,
                    queryCondition: this.queryCondition,
                    queryColumnExpType: this.queryColumnExpType,
                }
                this.$api.FINANCE_FIXED_ASSETS_API.get('GET_FIXED_ASSETS', getParams).then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
                })
            },

            // 获取tableHeaders
            getTableHeader() {
                let getParams = {
                    tableName: "fixed_assets_table",
                    isMine: 0
                }
                this.$api.FINANCE_COMMON_API.get("GET_TABLE_HEADER" ,getParams).then(res => {
                    this.tableHeader = res.data
                })
            },

            handleEdit(index, row) {
                let fixedAssetsId = this.tableData[index].id;
                this.$router.push({
                    path: '/fixed_assets_form',
                    query: {
                        id: fixedAssetsId
                    }
                })
            },

            handleDelete(index, row) {
                this.$confirm('删除不可恢复，是否确定删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let fixedAssetsId = this.tableData[index].id;
                    let deleteParams = {
                        id: fixedAssetsId
                    }
                    this.$api.FINANCE_FIXED_ASSETS_API.delete('DELETE_FIXED_ASSETS', deleteParams).then(res => {
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

            redirect2FixedAssetsForm() {
                this.$router.push("/fixed_assets_form")
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
