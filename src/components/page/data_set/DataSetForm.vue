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
                    <el-form-item label="数据集名称" :rules="rules.username" prop="username">
                        <el-input v-model="dataSet.name"></el-input>
                    </el-form-item>
                    <el-form-item label="数据集描述"  prop="description">
                        <el-input type="textarea" rows="5" v-model="dataSet.description"></el-input>
                    </el-form-item>
                    <el-form-item label="数据源"  prop="dataSourceType">
                        <el-select v-model="dataSet.dataSourceType" placeholder="数据源类型">
                            <template v-for="(dataSourceType, index) in dataSetInit.dataSourceTypes">
                                <el-option :key="dataSourceType.nameEn" :label="dataSourceType.nameEn" :value="dataSourceType.nameEn"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据库&表" prop="databaseTable">
                        <el-cascader
                                :options="dataSet.databasesTables"
                                change-on-select></el-cascader>
                    </el-form-item>
                    <el-form-item label="计算周期" prop="period">
                        <el-select v-model="dataSet.period" placeholder="请选择">
                            <template v-for="(period, index) in dataSet.periods">
                                <el-option :key="period.nameEn" :label="period.nameCn" :value="period.nameCn"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        v-for="(dataSetField, index) in dataSet.dataSetFields"
                        :label="'字段' + (index + 1)"
                        :key="dataSetField.key"
                        :prop="'dataSetFields.' + index + '.value'">
                        <el-col class="line" :span="2">表达式</el-col>
                        <el-col :span="3"><el-input v-model="dataSetField.expression"></el-input></el-col>
                        <el-col class="line" :span="2">数据类型</el-col>
                        <el-col :span="3">
                            <el-select v-model="dataSetField.dataType" placeholder="请选择">
                                <template v-for="(dataType, index) in dataSetInit.dataSetFields[index].dataTypes">
                                    <el-option :key="dataType.nameEn" :label="dataType.nameEn" :value="dataType.nameEn"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                        <el-col class="line" :span="2">字段类型</el-col>
                        <el-col :span="3">
                            <el-select v-model="dataSetField.fieldType" placeholder="请选择">
                                <template v-for="(fieldType, index) in dataSetInit.dataSetFields[index].fieldTypes">
                                    <el-option :key="fieldType.nameEn" :label="fieldType.nameEn" :value="fieldType.nameEn"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                        <el-col class="line" :span="2">计算方式</el-col>
                        <el-col :span="3">
                            <el-select v-model="dataSetField.calculateType" placeholder="请选择">
                                <template v-for="(calculateType, index) in dataSetInit.dataSetFields[index].calculateTypes">
                                    <el-option :key="calculateType.nameEn" :label="calculateType.nameEn" :value="calculateType.nameEn"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                        <el-col class="line" :span="2">操作</el-col>
                        <el-col :span="2"><el-button @click.prevent="removeDataSetField(dataSetField)" type="danger">删除</el-button></el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="addDataSetField" type="primary">新增数据集字段</el-button>
                    </el-form-item>
                    <el-form-item label="过滤运算条件" prop="extraExpression">
                        <el-input type="textarea" rows="5" v-model="dataSet.extraExpression"></el-input>
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
                    username: [
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
                    ],
                    extraExpression: [
                        {required: true, message: '请输入额外运算条件', trigger: 'blur'}
                    ],

                },
                dataSet: {
                    name: '',
                    description: '',
                    // 数据从后端获取
                    dataSourceType: "",
                    databasesTables: [],
                    dataSetFields: [{
                        expression: '',
                        dataType: '',
                        calculateType: '',
                        fieldType: '',
                    }],
                    period: "",
                    extraExpression: ''
                },
                dataSetInit: {
                    dataSourceTypes: [],
                    dataTypes: [],
                    calculateTypes: [],
                    fieldTypes: [],
                    periods: [],
                    dataSetFields: [{
                        dataTypes: [],
                        calculateTypes: [],
                        fieldTypes: []
                    }]
                },
            }
        },
        methods: {
            addDataSet() {
                this.$message.success("提交成功")
                console.log(this.dataSet)
                this.$api.REPORT_DATA_SET_API.post('DATA_SET', this.dataSet).then(res => {
                    console.log("添加数据集成功")
                }).catch(error => {
                    console.log(error)
                })
            },

            getDataSourceTypes() {
                this.$api.REPORT_DATA_SOURCE_API.get('GET_DATA_SOURCE_TYPES').then(res => {
                    this.dataSetInit.dataSourceTypes = res.data;
                    this.dataSet.dataSourceType = this.dataSetInit.dataSourceTypes[0].nameEn;
                })
            },

            getDatabasesTables() {
                this.$api.REPORT_DATA_SOURCE_API.get('GET_DATABASES_TABLES').then(res => {
                    this.dataSet.databasesTables = res.data;
                })
            },

            getPeriods() {
                this.$api.REPORT_DATA_SET_API.get('GET_PERIODS').then(res => {
                    this.dataSet.periods = res.data;
                })
            },

            getDataTypes() {
                this.$api.REPORT_DATA_SET_API.get('GET_DATA_TYPES').then(res => {
                    this.dataSetInit.dataTypes = res.data
                    this.dataSetInit.dataSetFields.forEach(dataSetField => {
                        dataSetField.dataTypes = this.dataSetInit.dataTypes
                        dataSetField.dataType = dataSetField.dataTypes[0].nameEn
                    })
                })
            },

            getCalculateTypes() {
                this.$api.REPORT_DATA_SET_API.get('GET_CALCULATE_TYPES').then(res => {
                    this.dataSetInit.calculateTypes = res.data
                    this.dataSetInit.dataSetFields.forEach(dataSetField => {
                        dataSetField.calculateTypes = this.dataSetInit.calculateTypes
                        dataSetField.calculateType = dataSetField.calculateTypes[0].nameEn
                    })
                })
            },

            getFieldTypes() {
                this.$api.REPORT_DATA_SET_API.get('GET_FIELD_TYPES').then(res => {
                    this.dataSetInit.fieldTypes = res.data
                    this.dataSetInit.dataSetFields.forEach(dataSetField => {
                        dataSetField.fieldTypes = this.dataSetInit.fieldTypes
                        dataSetField.fieldType = dataSetField.fieldTypes[0].nameEn
                    })
                })
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
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
                this.dataSetInit.dataSetFields.push({
                    dataTypes: this.dataSetInit.dataTypes,
                    calculateTypes: this.dataSetInit.calculateTypes,
                    fieldTypes: this.dataSetInit.fieldTypes,
                    key: Date.now()
                })
                this.dataSet.dataSetFields.push({
                    expression: '',
                    dataType: '',
                    calculateType: '',
                    fieldType: '',
                    key: Date.now()
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