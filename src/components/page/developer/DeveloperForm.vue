<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-profile"></i> 公司员工</el-breadcrumb-item>
                <el-breadcrumb-item>员工表单</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="form-box">
                <el-form ref="developer" :rules="rules" :model="developer" label-width="6%">
                    <el-form-item label="中文名" prop="nameCn">
                        <el-input v-model="developer.nameCn"></el-input>
                    </el-form-item>
                    <el-form-item label="英文名" prop="nameEn">
                        <el-input v-model="developer.nameEn"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="developerHelper.sex">
                            <el-radio label="男" value="1"></el-radio>
                            <el-radio label="女" value="0"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="developer.email"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="phoneNumber">
                        <el-input v-model="developer.phoneNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="权限" prop="privilege">
                        <el-select v-model="developer.privilege" placeholder="请选择">
                            <template v-for="(privilege, index) in developerConstant.privileges">
                                <el-option :key="privilege.nameEn" :label="privilege.nameCn" :value="privilege.nameEn">
                                    <span style="float: left">{{ privilege.nameCn }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ privilege.nameEn }}</span>
                                </el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="部门" prop="group">
                        <el-cascader :options="developerConstant.groups" v-model="developerHelper.group" change-on-select filterable></el-cascader>
                    </el-form-item>
                    <el-form-item label="学历" prop="academicDegree">
                        <el-select v-model="developer.academicDegree" placeholder="请选择">
                            <template v-for="(academicDegree, index) in developerConstant.academicDegrees">
                                <el-option :key="academicDegree.nameEn" :label="academicDegree.nameCn" :value="academicDegree.nameEn">
                                    <span style="float: left">{{ academicDegree.nameCn }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ academicDegree.nameEn }}</span>
                                </el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="基本工资">
                        <el-input-number v-model="developer.baseWages" :precision="2" :min="0" :step="0.1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="职务工资">
                        <el-input-number v-model="developer.dutyWages" :precision="2" :min="0" :step="0.1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="住房补贴">
                        <el-input-number v-model="developer.housingWages" :precision="2" :min="0" :step="0.1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="退休金">
                        <el-input-number v-model="developer.pension" :precision="2" :min="0" :step="0.1"></el-input-number>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addDeveloper('developer')">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-col>

    </el-col>
</template>

<script>
    export default {
        name: 'DeveloperForm',
        data: function(){
            return {
                developer: {
                    id : 0,
                    nameCn : '',
                    nameEn : '',
                    sex : 0,
                    email : '',
                    privilege : '',
                    status : 1,
                    password : '',
                    group : '',
                    academicDegree : '',
                    baseWages : 0,
                    dutyWages : 0,
                    housingWages : 0,
                    pension : 0,
                    phoneNumber : ''
                },

                developerConstant: {
                    privileges : [
                        {
                            nameEn : "privilege1",
                            nameCn : "权限1"
                        },
                        {
                            nameEn : "privilege2",
                            nameCn : "权限2"
                        }
                    ],
                    groups : [
                        {
                            value : "group1",
                            label : "部门1"
                        },
                        {
                            value : "group2",
                            label : "部门2"
                        }
                    ],
                    academicDegrees : [
                        {
                            nameEn : "academicDegree1",
                            nameCn : "学历1"
                        },
                        {
                            nameEn : "academicDegree2",
                            nameCn : "学历2"
                        }
                    ]
                },

                developerHelper: {
                    sex: '男',
                    group : []
                },
                rules: {
                    nameCn: [
                        { required: true, message: '请输入中文名', trigger: 'blur' }
                    ],
                    nameEn: [
                        { required: true, message: '请输入英文名', trigger: 'blur' }
                    ],
                    sex: [
                        { required: true, message: '请输入中文名', trigger: 'blur' }
                    ],
                    email : [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                    ],
                    phoneNumber : [
                        { required: true, message: '请输入电话号码', trigger: 'blur' },
                        { validator : this.$validator.phoneNumber, trigger: 'blur'}
                    ],
                    privilege : [
                        { required: true, message: '请选择员工权限', trigger: 'blur' },
                    ],
                    group : [
                        { required: true, message: '请选择员工部门', trigger: 'blur' },
                    ],
                    academicDegree : [
                        { required: true, message: '请输入员工学历', trigger: 'blur' },
                    ],
                    region: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                    date1: [
                        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    date2: [
                        { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                    ],
                    type: [
                        { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                    ],
                    resource: [
                        { required: true, message: '请选择活动资源', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请填写活动形式', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            addDeveloper(developer) {
                this.$refs[developer].validate((valid) => {
                    if (valid) {
                        this.developer.sex = '男' === this.developerHelper.sex ? 1 : 0;
                        this.developer.group = this.developerHelper.group[0]
                        console.log(this.developer)
//                this.$api.FINANCE_DEVELOPER_API.post('ADD_DEVELOPER', this.developer).then(res => {
//                    this.$message.success("成功添加员工")
//                    this.$router.replace('/developer_table')
//                })
                    } else {
                        this.$message.error("请将员工信息填写完整")
                        return false;
                    }
                })
            },

            getPrivileges() {
                this.$api.FINANCE_DEVELOPER_API.get('GET_PRIVILEGES').then(res => {
                    this.developerConstant.privileges = res.data
                })
            },

            getAcademicDegrees() {
                this.$api.FINANCE_DEVELOPER_API.get('GET_ACADEMIC_DEGREES').then(res => {
                    this.developerConstant.academicDegrees = res.data
                })
            },

            onSubmit() {
                this.$message.success('提交成功！');
            }
        },
        created() {
            this.getPrivileges()
            this.getAcademicDegrees()
        }
    }
</script>