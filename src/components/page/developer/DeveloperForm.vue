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
                <el-form ref="developer" :rules="rules" :model="developer" label-width="7%">
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
                    <el-form-item labelWidth="35%" style="width: 20%" label="权限" prop="privilege">
                        <multiCascader placeholder="请选择" :options="configOptions" @on-selected="getSelected" :inputValue="configTips"></multiCascader>
                    </el-form-item>
                    <el-form-item label="部门">
                        <el-cascader
                                v-model="developerHelper.departmentId"
                                placeholder="请选择"
                                :options="developerConstant.departments"
                                filterable
                        ></el-cascader>
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
                        <el-button @click="redirect2DeveloperTable">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-col>

    </el-col>
</template>

<script>
    import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item.vue";
    import multiCascader from "multi-cascader"
    export default {
        components: {ElFormItem, multiCascader},
        name: 'DeveloperForm',
        data: function(){
            return {
                developer: {
                    id : 0,
                    nameCn : '',
                    nameEn : '',
                    sex : 0,
                    email : '',
                    privilege : [],
                    status : 1,
                    password : '',
                    departmentId : 0,
                    academicDegree : '',
                    baseWages : 0,
                    dutyWages : 0,
                    housingWages : 0,
                    pension : 0,
                    phoneNumber : ''
                },

                developerConstant: {
                    privileges : [],
                    departments : [],
                    academicDegrees : []
                },

                developerHelper: {
                    sex: '男',
                    departmentId: []
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
                        { required: true, message: '请选择员工权限', trigger: 'change' },
                    ],
                    department : [
                        { required: true, message: '请选择员工部门', trigger: 'change' },
                    ],
                    academicDegree : [
                        { required: true, message: '请选择员工学历', trigger: 'change' },
                    ]
                },

                configTips: "请选择权限",

                configOptions: [
                    {
                        value: 2,
                        checked: false,
                        label: "一级菜单（2）"
                    },
                    {
                        value: 3,
                        checked: false,
                        label: "一级菜单（3）"
                    }
                ]
            }
        },
        methods: {

            getSelected() {
                this.developer.privilege = this.checkTreeData(this.configOptions)
                if (0 !== this.developer.privilege.length) {
                    this.configTips = `已选择${this.developer.privilege.length}个分组`;
                } else {
                    this.configTips = `请选择权限`;
                }
            },

            addDeveloper(developer) {
                this.$refs[developer].validate((valid) => {
                    if (valid) {
                        this.developer.sex = '男' === this.developerHelper.sex ? 1 : 0;
                        this.developer.departmentId = this.developerHelper.departmentId[0]
                        console.log(this.developer)
//                        let developerId = this.$route.query.id
//                        if (undefined !== developerId) {
//                            // 编辑
//                            this.$api.FINANCE_DEVELOPER_API.put('EDIT_DEVELOPER', this.developer).then(res => {
//                                this.$message.success("成功编辑员工信息")
//                            })
//                        } else {
//                            // 添加
//                            this.$api.FINANCE_DEVELOPER_API.post('ADD_DEVELOPER', this.developer).then(res => {
//                                this.$message.success("成功添加员工信息")
//                            })
//                        }
//                        this.$router.replace('/developer_table')
                    } else {
                        this.$message.error("请将员工信息填写完整")
                        return false;
                    }
                })
            },

            getDepartments() {
                this.$api.FINANCE_DEPARTMENT_API.get("GET_DEPARTMENTS").then(res => {
                    this.developerConstant.departments = this.getTreeData(res.data, this.developer.privilege)
                    this.configOptions = this.developerConstant.departments
                    this.getSelected()
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

            getDeveloperInfo(developerId) {
                let getParams = {
                    id : developerId
                }
                this.$api.FINANCE_DEVELOPER_API.get("GET_DEVELOPER_INFO", getParams).then(res => {
                    this.developer = res.data
                    this.getDepartments()
                })
            },

            redirect2DeveloperTable() {
                this.$router.push("/developer_table")
            },

            getTreeData(data, privilege){
                // 循环遍历json数据
                for(var i = 0;i < data.length; i++){
                    data[i].checked = -1 !== privilege.indexOf(data[i].value);
                    if(data[i].children.length < 1){
                        // children若为空数组，则将children设为undefined
                        data[i].children = undefined;
                    }else {
                        // children若不为空数组，则继续 递归调用 本方法
                        this.getTreeData(data[i].children, privilege);
                    }
                }
                return data;
            },

            checkTreeData(configOptions) {
                let counter = [];
                configOptions.forEach(option => {
                    if (option.checked) {
                        counter.push(option.value)
                        if (option.children !== undefined) {
                            this.checkTreeData(option.children).forEach(innerData => {
                                counter.push(innerData)
                            })
                        }
                    }
                })
                return counter;
            }
        },
        created() {
            let developerId = this.$route.query.id
            if (undefined !== developerId) {
                this.getDeveloperInfo(developerId)
            } else {
                this.getDepartments()
            }
            this.getPrivileges()
            this.getAcademicDegrees()
        }
    }
</script>