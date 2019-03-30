<template>
    <div class="table">
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-text"></i> 数据集</el-breadcrumb-item>
                <el-breadcrumb-item>数据集列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10">批量删除</el-button>
                <el-select v-model="queryColumn" placeholder="筛选项" class="handle-select mr10">
                    <el-option v-for="dataSetFilterField in dataSetFilterFields"
                               :key="dataSetFilterField.columnName" :label="dataSetFilterField.columnComment"
                               :value="dataSetFilterField.columnName">
                    </el-option>
                </el-select>
                <el-input v-model="queryCondition[0]" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getDataSets">搜索</el-button>
            </el-col>
            <el-col>
                <el-tabs type="border-card" v-model="isMine">
                    <el-tab-pane name="false" label="全部">
                    </el-tab-pane>
                    <el-tab-pane name="true" label="我的">
                    </el-tab-pane>
                    <el-table :data="tableData" border class="table" ref="tableData" @selection-change="handleSelectionChange" @cell-dblclick="dblhandleCurrentChange">
                        <el-table-column type="selection" width="55%" align="center"></el-table-column>
                        <el-table-column prop="id" label="id" sortable></el-table-column>
                        <el-table-column prop="name" label="名称"></el-table-column>
                        <el-table-column prop="createDeveloper" label="创建人"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
                        <el-table-column prop="lastCalculateTime" label="上次运算时间" sortable></el-table-column>
                        <el-table-column prop="period" label="周期"></el-table-column>
                        <el-table-column label="操作" width="180" align="center">
                            <template slot-scope="scope">
                                <el-button v-if="tableData[scope.$index].infoVisible" type="text" icon="el-icon-info" @click="handleInfo(scope.$index, scope.row)">详情</el-button>
                                <el-button v-if="tableData[scope.$index].editVisible" type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button v-if="tableData[scope.$index].backfillVisible" type="text" icon="el-icon-circle-plus-outline" @click="handleBackfill(scope.$index, scope.row)">补数据</el-button>
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
            <el-form ref="dataSet" :model="dataSet" label-width="10%">
                <el-form-item label="id">
                    {{dataSet.id}}
                </el-form-item>
                <el-form-item label="名称">
                    {{dataSet.name}}
                </el-form-item>
                <el-form-item label="描述">
                    {{dataSet.description}}
                </el-form-item>
                <el-form-item label="数据库">
                    {{dataSet.database}}
                </el-form-item>
                <el-form-item label="源表">
                    {{dataSet.sourceTable}}
                </el-form-item>
                <el-form-item label="数据源类型">
                    {{dataSet.dataSourceType}}
                </el-form-item>
                <el-form-item label="周期">
                    {{dataSet.period}}
                </el-form-item>
                <el-form-item label="额外运算条件">
                    {{dataSet.extraExpression}}
                </el-form-item>
                <el-form-item label="已有数据">
                    {{dataSet.beginDate}} 至 {{dataSet.endDate}}
                </el-form-item>
                <el-form-item label="字段详情">
                    <el-table :data="dataSet.dataSetFields">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="right" inline class="demo-table-expand">
                                    <el-form-item label="表达式">{{props.row.expression}}
                                    </el-form-item>
                                    <el-form-item label="名称">{{props.row.showName}}
                                    </el-form-item>
                                    <el-form-item label="数据类型">{{props.row.dataType}}
                                    </el-form-item>
                                    <el-form-item label="字段类型">{{props.row.fieldType}}
                                    </el-form-item>
                                    <el-form-item label="计算方式">{{props.row.calculateType}}
                                    </el-form-item>
                                    <el-form-item label="周期日期">
                                        {{props.row.isDate ? '是' : '否'}}
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="表达式"
                                prop="expression">
                        </el-table-column>
                        <el-table-column
                                label="名称"
                                prop="showName">
                        </el-table-column>
                        <el-table-column
                                label="数据类型"
                                prop="dataType">
                        </el-table-column>
                        <el-table-column
                                label="字段类型"
                                prop="fieldType">
                        </el-table-column>
                        <el-table-column
                                label="计算方式"
                                prop="calculateType">
                        </el-table-column>
                        <el-table-column label="周期日期">
                            <template slot-scope="scope">
                                {{dataSet.dataSetFields[scope.$index].isDate ? '是' : '否'}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 补数据弹出框 -->
        <el-dialog title="补数据" :visible.sync="backfillVisible" width="45%">
            <el-form ref="backfillForm" :model="backfillForm" :rules="rules" label-width="20%">
                <el-form-item label="名称">
                    {{backfillForm.name}}
                </el-form-item>
                <el-form-item label="已有数据">
                    {{backfillForm.beginDate}} 至 {{backfillForm.endDate}}
                </el-form-item>
                <el-form-item label="日期" prop="beginAndEndTime">
                    <el-date-picker
                            v-model="backfillForm.beginAndEndTime"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right"
                            value-format="yyyyMMddHH">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveBackfill('backfillForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="30%" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'DataSetTable',
        data: function () {
            return {
                rules: {
                    beginAndEndTime: [
                        {required: true, message: '请选择开始和结束时间', trigger: 'blur'}
                    ]
                },
                dataSetFilterField: "",
                dataSetFilterFields: [],
                tableData: [],
                pageIndex: 1,
                pageSize: 10,
                total : 0,
                queryColumn: "",
                queryCondition: [],
                editVisible: false,
                delVisible: false,
                infoVisible: false,
                backfillVisible: false,
                backfillForm :{
                    id : 0,
                    name : "",
                    beginTime : '',
                    endTime: '',
                    beginAndEndTime: [],
                    /**
                     * 已有数据日期范围
                     */
                    beginDate: '',
                    endDate: ''
                },
                dataSet: {
                    id: 0,
                    name: '',
                    description: '',
                    database: '',
                    sourceTable: '',
                    databaseTable: [],
                    dataSourceType: "",
                    dataSetFields: [{
                        expression: 'expression1',
                        dataType: '',
                        showName: '名称1',
                        calculateType: '',
                        fieldType: '',
                        isDate: false
                    }],
                    period: "",
                    extraExpression: '',
                    beginDate: '',
                    endDate: ''
                },
                isMine: "false",
                handleDeleteIndex: -1,
                idx: -1,
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        created() {
            this.getFilterFields();
            this.getDataSets();
        },
        watch: {
            isMine(val) {
                this.isMine = val;
                this.getDataSets()
            }
        },
        methods: {
            // 获取数据集的过滤字段
            getFilterFields() {
                this.$api.REPORT_DATA_SET_API.get('GET_DATA_SET_FILTER_FIELDS').then(res => {
                    this.dataSetFilterFields = res.data;
                })
            },

            // 获取数据集列表
            getDataSets() {
                let queryParams = {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    queryColumn: this.queryColumn,
                    queryCondition: this.queryCondition,
                    isMine: this.isMine
                }
                this.$api.REPORT_DATA_SET_API.get('GET_DATA_SET', queryParams).then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
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

            handleBackfill(index, row) {
                let dataSet = this.tableData[index];
                let id = dataSet.id
                this.getDataSetInfo(id)
                this.backfillVisible = true;
            },

            handleEdit(index, row) {
                let dataSetId = this.tableData[index].id;
                this.$router.push({
                    path: '/data_set_form',
                    query: {
                        id: dataSetId
                    }
                })
            },

            handleInfo(index, row) {
                let dataSetId = this.tableData[index].id;
                this.getDataSetInfo(dataSetId)
                this.infoVisible = true
            },

            // 获取数据集详情
            getDataSetInfo(dataSetId) {
                let queryParams = {
                    id : dataSetId
                }
                this.$api.REPORT_DATA_SET_API.get('GET_DATA_SET_INFO', queryParams).then(res => {
                    this.dataSet = res.data
                    this.dataSet.databaseTable = [this.dataSet.database, this.dataSet.sourceTable]
                    this.backfillForm = {
                        id : this.dataSet.id,
                        name : this.dataSet.name,
                        beginTime : '',
                        endTime: '',
                        beginAndEndTime: [],
                        beginDate: this.dataSet.beginDate,
                        endDate: this.dataSet.endDate
                    }
                })
            },

            dblhandleCurrentChange(row) {
                this.getDataSetInfo(row.id)
                this.infoVisible = true
            },

            handleDelete(index, row) {
                this.$confirm('删除不可恢复，是否确定删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let dataSetId = this.tableData[index].id;
                    let deleteParams = {
                        id: dataSetId
                    }
                    this.$api.REPORT_DATA_SET_API.delete('DELETE_DATA_SET', deleteParams).then(res => {
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

            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
                this.getDataSets()
            },

            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },

            /**
             * yyyy-MM-dd HH
             * @param string
             * @returns {Date}
             */
            string2Date1(string) {
                let arr = string.split(" ")
                let arr1 = arr[0].split("-")
                return new Date(arr1[0], arr1[1], arr1[2], arr[1])
            },

            /**
             * yyyyMMddHH
             * @param string
             * @returns {Date}
             */
            string2Date2(string) {
                return new Date(string.substring(0, 4), string.substring(4, 6), string.substring(6, 8), string.substring(8, 10))
            },

            // 保存补数据
            saveBackfill(backfillForm) {
                this.$refs[backfillForm].validate((valid) => {
                    if (valid) {
                        this.backfillForm.beginTime = this.backfillForm.beginAndEndTime[0]
                        this.backfillForm.endTime = this.backfillForm.beginAndEndTime[1]
                        /**
                         * 用户选择的开始和结束时间
                         * @type {Date}
                         */
                        let beginTime = this.string2Date2(this.backfillForm.beginTime)
                        let endTime = this.string2Date2(this.backfillForm.endTime)
                        /**
                         * 已有数据的开始和结束时间
                         * @type {Date}
                         */
                        let beginDate = this.string2Date1(this.backfillForm.beginDate)
                        let endDate = this.string2Date1(this.backfillForm.endDate)
                        if (beginTime >= beginDate && endTime <= endDate) {
                            this.$confirm('已选时间在已有数据的时间范围内，可能会导致重复补数据，是否继续？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.$api.REPORT_DATA_SET_API.get('BACKFILL', this.backfillForm).then(res => {
                                    this.$message.success(`成功开始补数据`);
                                    this.backfillVisible = false;
                                })
                            }).catch(() => {
                                this.$message.error('已取消补数据')
                            })
                        } else {
                            this.$api.REPORT_DATA_SET_API.get('BACKFILL', this.backfillForm).then(res => {
                                this.$message.success(`成功开始补数据`);
                                this.backfillVisible = false;
                            })
                        }
                    } else {
                        this.$message.error("请选择正确的开始和结束时间")
                        return false;
                    }
                })
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
