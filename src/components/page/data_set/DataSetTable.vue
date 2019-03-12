<template>
    <div class="table">
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 数据集</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-select v-model="queryColumn" placeholder="筛选项" class="handle-select mr10">
                    <el-option v-for="dataSetFilterField in dataSetFilterFields"
                               :key="dataSetFilterField.columnName" :label="dataSetFilterField.columnComment"
                               :value="dataSetFilterField.columnComment">
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

        <!-- 补数据弹出框 -->
        <el-dialog title="补数据" :visible.sync="backfillVisible" width="30%">
            <el-form ref="form" :model="backfillForm" label-width="50px">
                <el-form-item label="名称">
                    <el-col> {{backfillForm.name}} </el-col>
                </el-form-item>
                <el-form-item label="开始日期">
                    <el-date-picker type="date" placeholder="请选择日期" v-model="backfillForm.beginDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期">
                    <el-date-picker type="date" placeholder="请选择日期" v-model="backfillForm.endDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
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
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ElCol from "element-ui/packages/col/src/col";

    export default {
        components: {ElCol},
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
                url: './vuetable.json',
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                backfillVisible: false,
                backfillForm :{
                    id : 0,
                    name : "",
                    beginDate : '',
                    endDate: ''
                },
                form: {
                    id: "",
                    name: '',
                    date: '',
                    address: ''
                },
                idx: -1
            }
        },
        created() {
            this.getFilterFields();
//            this.getData();
            this.getDataSets();
        },
        computed: {

            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            // 获取数据集的过滤字段
            getFilterFields() {
                this.$api.REPORT_DATA_SET_API.get('GET_DATA_SET_FILTER_FIELDS').then(res => {
                    console.log(res.data)
                    this.dataSetFilterFields = res.data.data;
                })
            },

            // 获取数据集列表
            getDataSets() {
                let queryColumnName = this.queryColumn
                if (this.queryColumn !== '') {
                    this.dataSetFilterFields.forEach(dataSetFilterField => {
                        if (dataSetFilterField.columnComment === this.queryColumn) {
                            queryColumnName = dataSetFilterField.columnName
                        }
                    })
                }
                let queryParams = {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    queryColumn: queryColumnName,
                    queryCondition: this.queryCondition,
                }
                this.$api.REPORT_DATA_SET_API.get('DATA_SET', queryParams).then(res => {
                    console.log(res.data)
                    this.tableData = res.data.data.list
                    this.total = res.data.data.total
                })
            },

            // 编辑数据集
            editDataSet(id) {

            },

            // 获取数据集详情
            getDataSetInfo(id) {
                let queryParams = {
                    id : id
                }
                this.$api.REPORT_DATA_SET_API.get('GET_DATA_SET_INFO', queryParams).then(res => {
                    console.log(res.data)
                })
            },

            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
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

            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },

            handleBackfill(index, row) {
                const dataSet = this.tableData[index];
                let id = dataSet.id
                this.getDataSetInfo(id)
                this.backfillForm = {
                    id : dataSet.id,
                    name : dataSet.name,
                    beginDate : dataSet.date,
                    endDate: dataSet.date
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
                this.idx = index;
                this.delVisible = true;
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
                this.backfillVisible = false;
                this.$message.success(`保存成功`);
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
