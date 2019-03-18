<template>
    <div class="table">
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 数据集</el-breadcrumb-item>
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
            <el-table :data="tableData" border class="table" ref="tableData" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55%" align="center"></el-table-column>
                <el-table-column prop="id" label="id" sortable></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="developer" label="创建人"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
                <el-table-column prop="lastCalculateTime" label="上次运算时间" sortable></el-table-column>
                <el-table-column prop="period" label="周期"></el-table-column>
                <!--<el-table-column prop="address" label="地址" :formatter="formatter">-->
                <!--</el-table-column>-->
                <el-table-column label="操作" width="180" align="center" :formatter="formatter">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-circle-plus-outline" @click="handleBackfill(scope.$index, scope.row)">补数据</el-button>
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
            <el-form ref="form" label-width="20%">
                <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 补数据弹出框 -->
        <el-dialog title="补数据" :visible.sync="backfillVisible" width="35%">
            <el-form ref="form" :model="backfillForm" label-width="10%">
                <el-form-item label="名称">
                    <el-col> {{backfillForm.name}} </el-col>
                </el-form-item>
                <el-form-item label="日期">
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
                <el-button type="primary" @click="saveBackfill">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="30%" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteDataSet">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'DataSetTable',
        data: function () {
            return {
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
                backfillVisible: false,
                backfillForm :{
                    id : 0,
                    name : "",
                    beginTime : '',
                    endTime: '',
                    beginAndEndTime: []
                },
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
                }
                this.$api.REPORT_DATA_SET_API.get('GET_DATA_SET', queryParams).then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
                })
            },

            // 编辑数据集
            editDataSet(id) {
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

            // 获取数据集详情
            getDataSetInfo(id) {
                let queryParams = {
                    id : id
                }
                this.$api.REPORT_DATA_SET_API.get('GET_DATA_SET_INFO', queryParams).then(res => {
//                    console.log(res.data)
                })
            },


            handleBackfill(index, row) {
                let dataSet = this.tableData[index];
                let id = dataSet.id
                this.getDataSetInfo(id)
                this.backfillForm = {
                    id : dataSet.id,
                    name : dataSet.name,
                    beginTime : '',
                    endTime: '',
                    beginAndEndTime: []
                }
                this.backfillVisible = true;
            },

            handleEdit(index, row) {
                const dataSet = this.tableData[index];
                let id = dataSet.id
                this.getDataSetInfo(id)
                this.form = {
                    name: dataSet.name,
                    date: dataSet.date,
                    address: dataSet.address
                }
                this.editVisible = true;
            },

            handleDelete(index, row) {
                this.handleDeleteIndex = index;
                this.delVisible = true;
            },

            // 确定删除
            deleteDataSet(){
                let deleteParams = {
                    id : this.tableData[this.handleDeleteIndex].id
                }
                this.tableData.splice(this.handleDeleteIndex, 1);
                this.$api.REPORT_DATA_SET_API.delete('DELETE_DATA_SET', deleteParams).then(res => {
                    this.$message.success("删除成功")
                    this.delVisible = false;
                })
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
                this.$message.success(`页面下标 ${pageIndex}`);
                this.getDataSets()
            },

            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },

            // 保存补数据
            saveBackfill() {
                console.log(this.backfillForm)
                this.backfillForm.beginTime = this.backfillForm.beginAndEndTime[0]
                this.backfillForm.endTime = this.backfillForm.beginAndEndTime[1]
                this.$api.REPORT_DATA_SET_API.get('BACKFILL', this.backfillForm).then(res => {
                    this.$message.success(`成功开始补数据`);
                    this.backfillVisible = false;
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
</style>
