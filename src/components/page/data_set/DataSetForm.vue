<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-text"></i> 数据集</el-breadcrumb-item>
                <el-breadcrumb-item v-if="isEdit">编辑数据集</el-breadcrumb-item>
                <el-breadcrumb-item v-if="!isEdit">新增数据集</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="form-box">
                <el-form :model="dataSet" :rules="rules" ref="dataSet" label-width="8%">
                    <el-form-item label="数据集名称" prop="name">
                        <el-input v-model="dataSet.name"></el-input>
                    </el-form-item>
                    <el-form-item label="数据集描述"  prop="description">
                        <el-input type="textarea" rows="5" v-model="dataSet.description"></el-input>
                    </el-form-item>
                    <el-form-item label="数据源"  prop="dataSourceType">
                        <el-select v-model="dataSet.dataSourceType" placeholder="数据源类型">
                            <template v-for="(dataSourceType, index) in dataSetConstant.dataSourceTypes">
                                <el-option :key="dataSourceType.nameEn" :label="dataSourceType.nameEn" :value="dataSourceType.nameEn"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="需要计算">
                        <el-switch v-model="dataSet.needCalculation" @change="changeNeedCalculation"></el-switch>
                        说明：不选择代表该数据集只能用来展示数据，选择该选项代表可以根据填写的维度进行计算数据
                    </el-form-item>
                    <el-form-item label="数据库&表" prop="databaseTable">
                        <el-cascader filterable v-model="dataSet.databaseTable" :options="dataSetConstant.databasesTables" @change="changeDataBaseTable"></el-cascader>
                        <el-collapse style=" margin-top: 17px">
                            <el-collapse-item :title="dataSet.databaseTable.length == 2 ?
                            (dataSet.databaseTable[0] + ' / ' + dataSet.databaseTable[1] + ' 下的字段') : '所选数据库表下的字段'" name="1">
                                <el-table height="230px" :data="dataSetConstant.databaseTableFields" border class="table">
                                    <el-table-column prop="columnName" label="字段名">
                                    </el-table-column>
                                    <el-table-column prop="dataType" label="字段数据类型">
                                    </el-table-column>
                                    <el-table-column prop="columnComment" label="字段备注">
                                    </el-table-column>
                                </el-table>
                            </el-collapse-item>
                        </el-collapse>
                    </el-form-item>
                    <el-form-item label="计算次数" prop="remainCalculateTimes">
                        <el-input-number v-model="dataSet.remainCalculateTimes" :min="-1" :max="dataSetHelper.remainCalculateTimesMax" :step="1"></el-input-number>
                        说明：-1代表按照选择的计算周期持续进行定时计算
                    </el-form-item>
                    <el-form-item label="计算周期" prop="period">
                        <el-select v-model="dataSet.period" placeholder="请选择">
                            <template v-for="(period, index) in dataSetConstant.periods">
                                <el-option :key="period.nameEn" :label="period.nameCn" :value="period.nameEn">
                                    <span style="float: left">{{ period.nameCn }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ period.nameEn }}</span>
                                </el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="字段详情">
                        <el-table :data="dataSet.dataSetFields">
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <el-form label-position="right" inline class="demo-table-expand">
                                        <el-form-item label="表达式">
                                            <el-input v-model="props.row.expression"></el-input>
                                        </el-form-item>
                                        <el-form-item label="名称">
                                            <el-input v-model="props.row.showName"></el-input>
                                        </el-form-item>
                                        <el-form-item label="数据类型">
                                            <el-select v-model="props.row.dataType" placeholder="请选择">
                                                <template v-for="(dataType, index) in dataSetConstant.dataSetFieldsConstant.dataTypes">
                                                    <el-option :key="dataType.nameEn" :label="dataType.nameEn" :value="dataType.nameEn"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="字段类型">
                                            <el-select v-model="props.row.fieldType" placeholder="请选择">
                                                <template v-for="(fieldType, index) in dataSetConstant.dataSetFieldsConstant.fieldTypes">
                                                    <el-option :key="fieldType.nameEn" :label="fieldType.nameEn" :value="fieldType.nameEn"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="计算方式">
                                            <el-select v-model="props.row.calculateType" placeholder="请选择">
                                                <template v-for="(calculateType, index) in dataSetConstant.dataSetFieldsConstant.calculateTypes">
                                                    <el-option :key="calculateType.nameEn" :label="calculateType.nameEn" :value="calculateType.nameEn"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="周期日期">
                                            <el-switch v-model="props.row.isDate"></el-switch>
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
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            @click="removeDataSetField(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="addDataSetField" type="primary">新增数据集字段</el-button>
                    </el-form-item>
                    <el-form-item label="过滤运算条件">
                        <el-input type="textarea" rows="5" v-model="dataSet.extraExpression" :disabled="dataSetHelper.extraExpressionDisabled"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addDataSet('dataSet')">表单提交</el-button>
                        <el-button @click="redirect2DataSetTable">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-col>

    </el-col>
</template>

<script>
    import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item.vue";

    export default {
        components: {ElFormItem},
        name: 'DataSetForm',
        data: function(){
            return {
                rules: {
                    name: [
                        {required: true, message: '请输入数据集名称', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入数据集描述', trigger: 'blur'}
                    ],
                    dataSourceType: [
                        {required: true, message: '请选择数据源类型', trigger: 'blur'}
                    ],
                    remainCalculateTimes: [
                        {required: true, message: '请输入计算次数', trigger: 'blur'}
                    ],
                    databaseTable: [
                        {required: true, message: '请选择数据库和表', trigger: 'blur'}
                    ],
                    period: [
                        {required: true, message: '请选择数据集计算周期', trigger: 'blur'}
                    ]
                },
                dataSet: {
                    name: '',
                    description: '',
                    database: '',
                    sourceTable: '',
                    databaseTable: [],
                    dataSourceType: "",
                    remainCalculateTimes: -1,
                    needCalculation: true,
                    dataSetFields: [
                        {
                            expression: 'expression1',
                            dataType: '',
                            showName: '名称1',
                            calculateType: 'CUSTOM',
                            fieldType: 'METRIC',
                            isDate: false
                        },
                        {
                            expression: 'expression2',
                            dataType: '',
                            showName: '名称2',
                            calculateType: 'CUSTOM',
                            fieldType: 'DIMENSION',
                            isDate: false
                        },
                    ],
                    period: "",
                    extraExpression: ''
                },
                dataSetHelper: {
                    remainCalculateTimesMax: 10000,
                    extraExpressionDisabled: false
                },
                dataSetConstant: {
                    databasesTables: [],
                    dataSourceTypes: [],
                    periods: [],
                    databaseTableFields: [],
                    dataSetFieldsConstant: {
                        dataTypes: [],
                        calculateTypes: [],
                        fieldTypes: []
                    }
                }
            }
        },
        methods: {

            changeNeedCalculation() {
                this.getPeriods()
                if (this.dataSet.needCalculation) {
                    this.dataSetHelper.remainCalculateTimesMax = 10000
                    this.dataSetHelper.extraExpressionDisabled = false
                    this.dataSet.period = ""
                } else {
                    this.dataSetHelper.remainCalculateTimesMax = -1
                    this.dataSetHelper.extraExpressionDisabled = true
                    this.dataSet.period = "DISPLAY"
                }
            },

            changeDataBaseTable() {
                let getParams = {
                    database: this.dataSet.databaseTable[0],
                    tableName : this.dataSet.databaseTable[1]
                }
                this.$api.REPORT_DATA_SOURCE_API.get("GET_DATABASE_TABLE_FIELDS", getParams).then(res => {
                    this.dataSetConstant.databaseTableFields = res.data
                })
            },

            addDataSet(dataSet) {
                this.$refs[dataSet].validate((valid) => {
                    if (valid) {
                        this.dataSet.database = this.dataSet.databaseTable[0]
                        this.dataSet.sourceTable = this.dataSet.databaseTable[1]
                        let dataSetId = this.$route.query.id
                        if (undefined !== dataSetId) {
                            // 编辑
                            this.$api.REPORT_DATA_SET_API.put('EDIT_DATA_SET', this.dataSet).then(res => {
                                this.$message.success("成功编辑数据集")
                            }).catch(error => {
                                this.$message.error ("提交失败", error)
                            })
                        } else {
                            // 添加
                            this.$api.REPORT_DATA_SET_API.post('ADD_DATA_SET', this.dataSet).then(res => {
                                this.$message.success("成功添加数据集")
                            }).catch(error => {
                                this.$message.error ("提交失败", error)
                            })
                        }
                        this.$router.push('/data_set_table')
                    } else {
                        this.$message.error("请将数据集信息填写完整")
                        return false;
                    }
                })
            },

            getDataSourceTypes() {
                this.$api.REPORT_DATA_SOURCE_API.get('GET_DATA_SOURCE_TYPES').then(res => {
                    this.dataSetConstant.dataSourceTypes = res.data;
                    this.dataSet.dataSourceType = this.dataSetConstant.dataSourceTypes[0].nameEn;
                })
            },

            getDatabasesTables() {
                this.$api.REPORT_DATA_SOURCE_API.get('GET_DATABASES_TABLES').then(res => {
                    this.dataSetConstant.databasesTables = res.data;
                })
            },

            getPeriods() {
                this.$api.REPORT_DATA_SET_API.get('GET_PERIODS').then(res => {
                    this.dataSetConstant.periods = res.data.filter(
                        period => period.needCalculation === this.dataSet.needCalculation);
                })
            },

            getDataTypes() {
                this.$api.REPORT_DATA_SET_API.get('GET_DATA_TYPES').then(res => {
                    this.dataSetConstant.dataSetFieldsConstant.dataTypes = res.data
                })
            },

            getCalculateTypes() {
                this.$api.REPORT_DATA_SET_API.get('GET_CALCULATE_TYPES').then(res => {
                    this.dataSetConstant.dataSetFieldsConstant.calculateTypes = res.data
                })
            },

            getFieldTypes() {
                this.$api.REPORT_DATA_SET_API.get('GET_FIELD_TYPES').then(res => {
                    this.dataSetConstant.dataSetFieldsConstant.fieldTypes = res.data
                })
            },

            removeDataSetField(index) {
                if (this.dataSet.dataSetFields.length > 2) {
                    this.dataSet.dataSetFields.splice(index, 1)
                } else {
                    this.$message.error("数据集至少有一个维度字段和一个指标字段")
                }
            },

            addDataSetField() {
                this.dataSet.dataSetFields.push({
                    expression: 'expression' + (this.dataSet.dataSetFields.length + 1),
                    dataType: '',
                    calculateType: '',
                    fieldType: '',
                    showName: '名称' + (this.dataSet.dataSetFields.length + 1),
                    isDate: false,
                    key: Date.now()
                })
            },

            // 获取数据集详情
            getDataSetInfo(dataSetId) {
                let getParams = {
                    id : dataSetId
                }
                this.$api.REPORT_DATA_SET_API.get('GET_DATA_SET_INFO', getParams).then(res => {
                    this.dataSet = res.data
                    this.dataSet.databaseTable = [this.dataSet.database, this.dataSet.sourceTable]
                    this.changeDataBaseTable()
                })
            },

            redirect2DataSetTable() {
                this.$router.push("/data_set_table")
            },
        },
        computed: {
            isEdit: function () {
                return undefined !== this.$route.query.id
            },
        },
        created() {
            let dataSetId = this.$route.query.id
            if (undefined !== dataSetId) {
                this.getDataSetInfo(dataSetId)
            }
            this.getDatabasesTables(),
            this.getDataTypes(),
            this.getCalculateTypes(),
            this.getFieldTypes(),
            this.getDataSourceTypes(),
            this.getPeriods()
        }
    }
</script>

<style>
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