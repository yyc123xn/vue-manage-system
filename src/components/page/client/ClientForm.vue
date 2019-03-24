<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-profile"></i> 公司客户</el-breadcrumb-item>
                <el-breadcrumb-item>客户表单</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="form-box">
                <el-form ref="client" :rules="rules" :model="client" label-width="7%">
                    <el-form-item label="中文名" prop="nameCn">
                        <el-input v-model="client.nameCn"></el-input>
                    </el-form-item>
                    <el-form-item label="英文名" prop="nameEn">
                        <el-input v-model="client.nameEn"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="clientHelper.sex">
                            <el-radio label="男" value="1" onselect></el-radio>
                            <el-radio label="女" value="0"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="client.email"></el-input>
                    </el-form-item>
                    <el-form-item label="公司名称" prop="company">
                        <el-input v-model="client.company"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="phoneNumber">
                        <el-input v-model="client.phoneNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="address">
                        <v-distpicker @province="onChangeProvince" @city="onChangeCity" @area="onChangeArea"></v-distpicker>
                    </el-form-item>
                    <el-form-item label="已回款">
                        <el-input-number v-model="client.receivedPayments" :precision="2" :min="0" :step="0.1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="仍欠款">
                        <el-input-number v-model="client.debt" :precision="2" :min="0" :step="0.1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input type="textarea" rows="5" v-model="client.description"></el-input>
                    </el-form-item>
                    <el-form-item label="行业" prop="business">
                        <el-select v-model="client.business" placeholder="请选择" filterable>
                            <template v-for="(business, index) in clientConstant.businesses">
                                <el-option :key="business.nameEn" :label="business.nameCn" :value="business.id">
                                    <span style="float: left">{{ business.nameCn }}</span>
                                    <span style="margin-left: 20px;float: right; color: #8492a6; font-size: 13px">{{ business.nameEn }}</span>
                                </el-option>
                            </template>
                        </el-select>
                        <el-button style="margin-left: 10px" type="primary" @click="handleAddBusiness">新增行业</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="addClient('client')">表单提交</el-button>
                        <el-button @click="redirect2ClientTable">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-col>

        <!-- 编辑弹出框 -->
        <el-dialog title="新增行业" :visible.sync="addBusinessVisible" width="50%">
            <el-form ref="business" :rules="rules.businessRules" :model="business" label-width="8%">
                <el-form-item label="中文名" prop="nameCn">
                    <el-input v-model="business.nameCn"></el-input>
                </el-form-item>
                <el-form-item label="英文名" prop="nameEn">
                    <el-input v-model="business.nameEn"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input type="textarea" rows="5" v-model="business.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAddBusiness('business')">确 定</el-button>
            </span>
        </el-dialog>

    </el-col>
</template>

<script>
    import VDistpicker from 'v-distpicker'
    export default {
        name: 'ClientForm',
        components: {
            VDistpicker
        },
        // todo 添加票据流程代码
        data: function(){
            return {
                addBusinessVisible: false,
                client: {
                    id : 0,
                    nameCn : '',
                    nameEn : '',
                    sex : 0,
                    email : '',
                    status : 1,
                    company : '',
                    phoneNumber : '',
                    debt: 0,
                    receivedPayments: 0,
                    address: [{}, {}, {}],
                    business: '',
                    description: ''
                },

                business: {
                    nameEn: '',
                    nameCn: '',
                    description: ''
                },

                clientHelper: {
                    sex: "男"
                },

                clientConstant: {
                    businesses :[]
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
                    address : [
                        { required: true, message: '请选择客户地址', trigger: 'blur' },
                    ],
                    business: [
                        { required: true, message: '请选择用户行业', trigger: 'blur' }
                    ],
                    company: [
                        { required: true, message: '请填写公司名称', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请填写客户描述', trigger: 'blur' }
                    ],
                    businessRules: {
                        nameCn: [
                            { required: true, message: '请输入中文名', trigger: 'blur' }
                        ],
                        nameEn: [
                            { required: true, message: '请输入英文名', trigger: 'blur' }
                        ],
                        description: [
                            { required: true, message: '请填写行业描述', trigger: 'blur' }
                        ]
                    }
                }
            }
        },
        methods: {
            addClient(client) {
                this.$refs[client].validate((valid) => {
                    if (valid) {
                        this.client.sex = '男' === this.clientHelper.sex ? 1 : 0;
                        let clientId = this.$route.query.id
                        if (undefined !== clientId) {
                            // 编辑
                            this.$api.FINANCE_CLIENT_API.put('EDIT_CLIENT', this.client).then(res => {
                                this.$message.success("成功编辑客户信息")
                            })
                        } else {
                            // 添加
                            console.log(this.client)
//                            this.$api.FINANCE_CLIENT_API.post('ADD_CLIENT', this.developer).then(res => {
//                                this.$message.success("成功添加客户信息")
//                            })
                        }
                        this.$router.replace('/client_table')
                    } else {
                        this.$message.error("请将客户信息填写完整")
                        return false;
                    }
                })
            },

            handleAddBusiness() {
                this.addBusinessVisible = true;
            },

            saveAddBusiness(business) {
                this.$refs[business].validate((valid) => {
                    if (valid) {
                        this.$api.FINANCE_COMMON_API.post("ADD_BUSINESS", this.business).then(res => {
                            this.getBusinesses()
                        })
                        this.addBusinessVisible = false;
                    } else {
                        this.$message.error("请将行业信息填写完整")
                        return false;
                    }
                })
            },

            getClientInfo(clientId) {
                let getParams = {
                    id : clientId
                }
                this.$api.FINANCE_CLIENT_API.get("GET_CLIENT_INFO", getParams).then(res => {
                    this.client = res.data
                })
            },

            redirect2ClientTable() {
                this.$router.push("/client_table")
            },

            getBusinesses() {
                this.$api.FINANCE_COMMON_API.get("GET_BUSINESSES").then(res => {
                    this.clientConstant.businesses = res.data
                })
            },

            onChangeProvince(province){
                this.client.address[0] = province;
            },
            onChangeCity(city){
                this.client.address[1] = city;
            },
            onChangeArea(area){
                this.client.address[2] = area;
            }
        },
        created() {
            let clientId = this.$route.query.id
            if (undefined !== clientId) {
                this.getClientInfo(clientId)
            }
            this.getBusinesses()
        }
    }
</script>

<style scoped>
    .divwrap{
        height: 400px;
        overflow-y: auto;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
    }
    .divwrap>>>.distpicker-address-wrapper{
        color: #999;
    }
    .divwrap>>>.address-header{
        position: fixed;
        bottom: 400px;
        width: 100%;
        background: #000;
        color:#fff;
    }
    .divwrap>>>.address-header ul li{
        flex-grow: 1;
        text-align: center;
    }
    .divwrap>>>.address-header .active{
        color: #fff;
        border-bottom:#666 solid 8px
    }
    .divwrap>>>.address-container .active{
        color: #000;
    }

</style>