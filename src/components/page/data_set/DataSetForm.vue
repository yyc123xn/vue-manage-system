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
                <el-form :model="dataSet" ref="dataSet" label-width="80px">
                    <el-form-item label="数据集名称" :rules="rules.username">
                        <el-input v-model="dataSet.name"></el-input>
                    </el-form-item>
                    <el-form-item label="数据集描述" :rules="rules.description">
                        <el-input type="textarea" rows="5" v-model="dataSet.description"></el-input>
                    </el-form-item>
                    <el-form-item label="数据源" :rules="rules.dataSourceType">
                        <el-select v-model="dataSet.dataSourceType" placeholder="数据源类型">
                            <template v-for="(dataSourceType, index) in dataSet.dataSourceTypes">
                                <el-option :key="dataSourceType.nameEn" :label="dataSourceType.nameEn" :value="dataSourceType.nameEn"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据库&表" :rules="rules.databaseTable">
                        <el-cascader
                                :options="dataSet.databasesTables"
                                change-on-select></el-cascader>
                    </el-form-item>
                    <el-form-item label="计算周期" :rules="rules.period">
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
                                <template v-for="(dataType, index) in dataSetField.dataTypes">
                                    <el-option :key="dataType.nameEn" :label="dataType.nameEn" :value="dataType.nameEn"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                        <el-col class="line" :span="2">字段类型</el-col>
                        <el-col :span="3">
                            <el-select v-model="dataSetField.fieldType" placeholder="请选择">
                                <template v-for="(fieldType, index) in dataSetField.fieldTypes">
                                    <el-option :key="fieldType.nameEn" :label="fieldType.nameEn" :value="fieldType.nameEn"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                        <el-col class="line" :span="2">计算方式</el-col>
                        <el-col :span="3">
                            <el-select v-model="dataSetField.calculateType" placeholder="请选择">
                                <template v-for="(calculateType, index) in dataSetField.calculateTypes">
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
                    <el-form-item label="过滤运算条件" :rules="rules.description">
                        <el-input type="textarea" rows="5" v-model="dataSet.extraExpression"></el-input>
                    </el-form-item>
                    <el-form-item label="日期时间">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="dataSet.date1" style="width: 100%;"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-time-picker placeholder="选择时间" v-model="dataSet.date2" style="width: 100%;"></el-time-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="选择开关">
                        <el-switch v-model="dataSet.delivery"></el-switch>
                    </el-form-item>
                    <el-form-item label="多选框">
                        <el-checkbox-group v-model="dataSet.type">
                            <el-checkbox label="步步高" name="type"></el-checkbox>
                            <el-checkbox label="小天才" name="type"></el-checkbox>
                            <el-checkbox label="imoo" name="type"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="单选框">
                        <el-radio-group v-model="dataSet.resource">
                            <el-radio label="步步高"></el-radio>
                            <el-radio label="小天才"></el-radio>
                            <el-radio label="imoo"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addDataSet">表单提交</el-button>
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
                rules : {
                    username : [
                        { required: true, message: '请输入数据集名称', trigger: 'blur' }
                    ],
                    description : [
                        { required: true, message: '请输入数据集描述', trigger: 'blur' }
                    ],
                    dataSourceType : [
                        { required: true, message: '请选择数据源类型', trigger: 'blur' }
                    ],
                    databaseTable : [
                        { required: true, message: '请选择数据库和表', trigger: 'blur' }
                    ],
                    period : [
                        { required: true, message: '请选择数据集计算周期', trigger: 'blur' }
                    ]
                },
                dataSet: {
                    name: '',
                    description: '',
                    // 数据从后端获取
                    dataSourceType : "",
                    dataSourceTypes: [],
                    databasesTables : [],
                    dataTypes: [],
                    calculateTypes: [],
                    fieldTypes: [],
                    dataSetFields : [{
                        expression: '',
                        dataType: '',
                        dataTypes: [],
                        calculateType: '',
                        calculateTypes: [],
                        fieldType: '',
                        fieldTypes: []
                    }],
                    period : "",
                    periods : [],
                    extraExpression: '',
                    date1: '',
                    date2: '',
                    delivery: true,
                    type: ['步步高'],
                    resource: '小天才',
                    options: []
                },
                options:[
                    {
                        value: 'guangdong',
                        label: '广东省',
                        children: [
                            {
                                value: 'guangzhou',
                                label: '广州市',
                                children: [
                                    {
                                        value: 'tianhe',
                                        label: '天河区'
                                    },
                                    {
                                        value: 'haizhu',
                                        label: '海珠区'
                                    }
                                ]
                            },
                            {
                                value: 'dongguan',
                                label: '东莞市',
                                children: [
                                    {
                                        value: 'changan',
                                        label: '长安镇'
                                    },
                                    {
                                        value: 'humen',
                                        label: '虎门镇'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        value: 'hunan',
                        label: '湖南省',
                        children: [
                            {
                                value: 'changsha',
                                label: '长沙市',
                                children: [
                                    {
                                        value: 'yuelu',
                                        label: '岳麓区'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        methods: {
            addDataSet() {
                this.$message.success("提交成功")
                console.log(this.dataSet)
                this.$api.REPORT_DATA_SET_API.addDataSet(this.dataSet).then(res => {
                    console.log("添加数据集成功")
                }).catch(error => {
                    console.log(error)
                })
            },

            getDataSourceTypes() {
                this.$api.REPORT_DATA_SOURCE_API.getDataSourceTypes().then(res => {
                    this.dataSet.dataSourceTypes = res.data.data;
                    this.dataSet.dataSourceType = this.dataSet.dataSourceTypes[0].nameEn;
                })
            },

            getDatabasesTables() {
                this.$api.REPORT_DATA_SOURCE_API.getDatabasesTables().then(res => {
                    this.dataSet.databasesTables = res.data.data;
                })
            },

            getPeriods() {
                this.$api.REPORT_DATA_SET_API.getPeriods().then(res => {
                    this.dataSet.periods = res.data.data;
                })
            },

            getDataTypes() {
                this.$api.REPORT_DATA_SET_API.getDataTypes().then(res => {
                    this.dataSet.dataTypes = res.data.data
                    this.dataSet.dataSetFields.forEach(dataSetField => {
                        dataSetField.dataTypes = res.data.data
                        dataSetField.dataType = dataSetField.dataTypes[0].nameEn
                    })
                })
            },

            getCalculateTypes() {
                this.$api.REPORT_DATA_SET_API.getCalculateTypes().then(res => {
                    this.dataSet.calculateTypes = res.data.data
                    this.dataSet.dataSetFields.forEach(dataSetField => {
                        dataSetField.calculateTypes = res.data.data
                        dataSetField.calculateType = dataSetField.calculateTypes[0].nameEn
                    })
                })
            },

            getFieldTypes() {
                this.$api.REPORT_DATA_SET_API.getFieldTypes().then(res => {
                    this.dataSet.fieldTypes = res.data.data
                    this.dataSet.dataSetFields.forEach(dataSetField => {
                        dataSetField.fieldTypes = res.data.data
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
                }
            },

            addDataSetField() {
                this.dataSet.dataSetFields.push({
                    expression: '',
                    dataType: '',
                    dataTypes: this.dataSet.dataTypes,
                    calculateType: '',
                    calculateTypes: this.dataSet.calculateTypes,
                    fieldType: '',
                    fieldTypes: this.dataSet.fieldTypes,
                    key: Date.now()
                });
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