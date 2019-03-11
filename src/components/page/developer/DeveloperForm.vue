<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>基本表单</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="form-box">
                <el-form ref="developer" :rules="rules" :model="developer" label-width="80px">
                    <el-form-item label="中文名" prop="nameCn">
                        <el-input v-model="developer.nameCn"></el-input>
                    </el-form-item>
                    <el-form-item label="英文名" prop="nameEn">
                        <el-input v-model="developer.nameEn"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="developerInit.sex">
                            <el-radio label="男"></el-radio>
                            <el-radio label="女"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="developer.email"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="phoneNumber">
                        <el-input v-model="developer.phoneNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="权限" prop="privilege">
                        <el-select v-model="developerInit.privilege" placeholder="请选择">
                            <template v-for="(privilege, index) in developerInit.privileges">
                                <el-option :key="privilege.nameEn" :label="privilege.nameCn" :value="privilege.nameCn"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="部门" prop="group">
                        <el-cascader :options="developerInit.groups" v-model="developerInit.group" change-on-select></el-cascader>
                    </el-form-item>
                    <el-form-item label="学历" prop="academicDegree">
                        <el-select v-model="developerInit.academicDegree" placeholder="请选择">
                            <template v-for="(academicDegree, index) in developerInit.academicDegrees">
                                <el-option :key="academicDegree.nameEn" :label="academicDegree.nameCn" :value="academicDegree.nameCn"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="基本工资">
                        <el-input v-model="developer.baseWages"></el-input>
                    </el-form-item>
                    <el-form-item label="职务工资">
                        <el-input v-model="developer.dutyWages"></el-input>
                    </el-form-item>
                    <el-form-item label="住房补贴">
                        <el-input v-model="developer.housingWages"></el-input>
                    </el-form-item>
                    <el-form-item label="退休金">
                        <el-input v-model="developer.pension"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="固定资产描述">-->
                        <!--<el-input type="textarea" rows="5" v-model="developer.desc"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="固定资产时间">-->
                        <!--<el-col :span="12">-->
                            <!--<el-date-picker type="date" placeholder="选择日期" v-model="developer.date1" style="width: 100%;"></el-date-picker>-->
                        <!--</el-col>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="固定资产类型">-->
                        <!--<el-select v-model="developer.region" placeholder="请选择">-->
                            <!--<template v-for="(voucherType, index) in developer.voucherTypes">-->
                                <!--<el-option :key="voucherType.nameEn" :label="voucherType.nameCn" :value="voucherType.nameCn"></el-option>-->
                            <!--</template>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="日期时间">-->
                        <!--<el-col :span="11">-->
                            <!--<el-date-picker type="date" placeholder="选择日期" v-model="developer.date1" style="width: 100%;"></el-date-picker>-->
                        <!--</el-col>-->
                        <!--<el-col class="line" :span="2">-</el-col>-->
                        <!--<el-col :span="11">-->
                            <!--<el-time-picker placeholder="选择时间" v-model="developer.date2" style="width: 100%;"></el-time-picker>-->
                        <!--</el-col>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="城市级联">-->
                        <!--<el-cascader :options="options" v-model="developer.options"></el-cascader>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="选择开关">-->
                        <!--<el-switch v-model="developer.delivery"></el-switch>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="多选框">-->
                        <!--<el-checkbox-group v-model="developer.type">-->
                            <!--<el-checkbox label="步步高" name="type"></el-checkbox>-->
                            <!--<el-checkbox label="小天才" name="type"></el-checkbox>-->
                            <!--<el-checkbox label="imoo" name="type"></el-checkbox>-->
                        <!--</el-checkbox-group>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="单选框">-->
                        <!--<el-radio-group v-model="developer.resource">-->
                            <!--<el-radio label="步步高"></el-radio>-->
                            <!--<el-radio label="小天才"></el-radio>-->
                            <!--<el-radio label="imoo"></el-radio>-->
                        <!--</el-radio-group>-->
                    <!--</el-form-item>-->
                    <el-form-item>
                        <el-button type="primary" @click="addDeveloper">表单提交</el-button>
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
                    phoneNumber : '',
                    createDeveloper : '',
                    updateDeveloper : ''
                },
                developerInit: {
                    sex : "男",
                    privilege : '',
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
                    group : [],
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
                    academicDegree: '',
                    academicDegrees : [
                        {
                            nameEn : "academicDegree1",
                            nameCn : "学历1"
                        },
                        {
                            nameEn : "academicDegree2",
                            nameCn : "学历2"
                        }
                    ],
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: true,
                    type: ['步步高'],
                    resource: '小天才',
                    desc: '',
                    options: []
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

            addDeveloper() {
                this.developerInit.privileges.forEach(privilege => {
                    if (privilege.nameCn === this.developerInit.privilege) {
                        this.developer.privilege = privilege.nameEn
                    }
                })
                this.developerInit.academicDegrees.forEach(academicDegree => {
                    if (academicDegree.nameCn === this.developerInit.academicDegree) {
                        this.developer.academicDegree = academicDegree.nameEn
                    }
                })
                this.developer.sex = this.developerInit.sex === '男' ? 1 : 0;
                this.developer.group = this.developerInit.group[0]
                console.log(this.developer)
                this.$api.FINANCE_DEVELOPER_API.post('ADD_DEVELOPER', this.developer).then(res => {
                    this.$message.success("成功添加员工")
                    this.$router.replace('/developer_table')
                })
            },

            getPrivileges() {
                this.$api.FINANCE_DEVELOPER_API.get('GET_PRIVILEGES').then(res => {
                    this.developerInit.privileges = res.data.data
                })
            },

            getAcademicDegrees() {
                this.$api.FINANCE_DEVELOPER_API.get('GET_ACADEMIC_DEGREES').then(res => {
                    this.developerInit.academicDegrees = res.data.data
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