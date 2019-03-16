<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>数据集</el-breadcrumb-item>
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
                    <el-form-item label="数据库&表" prop="databaseTable">
                        <el-cascader filterable v-model="dataSet.databaseTable" :options="dataSetConstant.databasesTables"
                                change-on-select></el-cascader>
                    </el-form-item>
                    <el-form-item label="计算周期" prop="period">
                        <el-select v-model="dataSet.period" placeholder="请选择">
                            <template v-for="(period, index) in dataSetConstant.periods">
                                <el-option :key="period.nameEn" :label="period.nameCn" :value="period.nameEn"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        v-for="(dataSetField, index) in dataSet.dataSetFields"
                        :label="'字段' + (index + 1)"
                        :key="dataSetField.key"
                        :prop="'dataSetFields.' + index + '.value'">
                        <el-col class="line" :span="1">表达式</el-col>
                        <el-col :span="3"><el-input v-model="dataSetField.expression"></el-input></el-col>
                        <el-col class="line" :span="1">名称</el-col>
                        <el-col :span="2"><el-input v-model="dataSetField.showName"></el-input></el-col>
                        <el-col class="line" :span="2">数据类型</el-col>
                        <el-col :span="2">
                            <el-select v-model="dataSetField.dataType" placeholder="请选择">
                                <template v-for="(dataType, index) in dataSetConstant.dataSetFieldsConstant.dataTypes">
                                    <el-option :key="dataType.nameEn" :label="dataType.nameEn" :value="dataType.nameEn"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                        <el-col class="line" :span="2">字段类型</el-col>
                        <el-col :span="2">
                            <el-select v-model="dataSetField.fieldType" placeholder="请选择">
                                <template v-for="(fieldType, index) in dataSetConstant.dataSetFieldsConstant.fieldTypes">
                                    <el-option :key="fieldType.nameEn" :label="fieldType.nameEn" :value="fieldType.nameEn"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                        <el-col class="line" :span="2">计算方式</el-col>
                        <el-col :span="2">
                            <el-select v-model="dataSetField.calculateType" placeholder="请选择">
                                <template v-for="(calculateType, index) in dataSetConstant.dataSetFieldsConstant.calculateTypes">
                                    <el-option :key="calculateType.nameEn" :label="calculateType.nameEn" :value="calculateType.nameEn"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                        <el-col class="line" :span="2">周期日期</el-col>
                        <el-col :span="1">
                            <el-checkbox v-model="dataSetHelper.dataSetFieldsHelper[index].isDate"></el-checkbox>
                        </el-col>
                        <el-col class="line" :span="1">操作</el-col>
                        <el-col :span="1"><el-button @click.prevent="removeDataSetField(dataSetField)" type="danger">删除</el-button></el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="addDataSetField" type="primary">新增数据集字段</el-button>
                    </el-form-item>
                    <el-form-item label="过滤运算条件">
                        <el-input type="textarea" rows="5" v-model="dataSet.extraExpression"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addDataSet('dataSet')">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-col>

    </el-col>
</template>

<script>
    export default {
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
                    dataSetFields: [{
                        expression: '',
                        dataType: '',
                        showName: '',
                        calculateType: '',
                        fieldType: '',
                        isDate: 0
                    }],
                    period: "",
                    extraExpression: ''
                },
                dataSetHelper: {
                    dataSetFieldsHelper: [{
                        isDate: false
                    }]
                },
                dataSetConstant: {
                    databasesTables: [],
                    dataSourceTypes: [],
                    periods: [],
                    dataSetFieldsConstant: {
                        dataTypes: [],
                        calculateTypes: [],
                        fieldTypes: []
                    }
                }
            }
        },
        methods: {
            addDataSet(dataSet) {
                this.$refs[dataSet].validate((valid) => {
                    if (valid) {
                        this.dataSet.database = this.dataSet.databaseTable[0]
                        this.dataSet.sourceTable = this.dataSet.databaseTable[1]
                        for (let index = 0; index < this.dataSet.dataSetFields.length; index++) {
                            this.dataSet.dataSetFields[index].isDate = this.dataSetHelper.dataSetFieldsHelper[index].isDate ? 1 : 0;
                        }
                        console.log(this.dataSet)
                        this.$api.REPORT_DATA_SET_API.post('ADD_DATA_SET', this.dataSet).then(res => {
                            this.$router.push('/data_set_table')
                        }).catch(error => {
                            console.log(error)
                            this.$message.error ("提交失败", error)
                        })
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
                    this.dataSetConstant.periods = res.data;
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

            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            removeDataSetField(item) {
                var index = this.dataSet.dataSetFields.indexOf(item)
                if (index !== -1) {
                    this.dataSet.dataSetFields.splice(index, 1)
                    this.dataSetInit.dataSetFields.splice(index, 1)
                }
            },

            addDataSetField() {
                this.dataSet.dataSetFields.push({
                    expression: '',
                    dataType: '',
                    calculateType: '',
                    fieldType: '',
                    showName: '',
                    isDate: false,
                    key: Date.now()
                })
                this.dataSetHelper.dataSetFieldsHelper.push({
                    isDate: false
                })
            }
        },
        created() {
            this.getDatabasesTables(),
            this.getPeriods(),
            this.getDataTypes(),
            this.getCalculateTypes(),
            this.getFieldTypes(),
            this.getDataSourceTypes()
        }
    }
</script>