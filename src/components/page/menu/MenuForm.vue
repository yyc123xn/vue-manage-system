<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-sort"></i> 菜单管理</el-breadcrumb-item>
                <el-breadcrumb-item v-if="isEdit">编辑菜单</el-breadcrumb-item>
                <el-breadcrumb-item v-if="!isEdit">新增菜单</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="form-box">
                <el-form :model="menu" :rules="rules" ref="menu" label-width="8%">
                    <el-form-item label="英文名称" prop="name">
                        <el-input v-model="menu.name"></el-input>
                    </el-form-item>
                    <el-form-item label="前端路径" prop="path">
                        <el-input v-model="menu.path"></el-input>
                    </el-form-item>
                    <el-form-item label="前端组件名" prop="component">
                        <el-input v-model="menu.component"></el-input>
                    </el-form-item>
                    <el-form-item label="父菜单名称" prop="meta.title">
                        <el-input v-model="menu.meta.title"></el-input>
                    </el-form-item>
                    <el-form-item label="父菜单icon" prop="meta.icon">
                        <el-select v-model="menu.meta.icon" placeholder="请选择">
                            <template v-for="(icon, index) in menuConstant.icons">
                                <el-option :key="index" :label="icon" :value="'el-icon-lx-' + icon">
                                    <span style="float: left">{{icon}}</span>
                                    <span style="float: right; color: #8492a6; font-size: 17px"><i :class="`el-icon-lx-${icon}`"></i></span>
                                </el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="重定向url">
                        <el-input :placeholder="'默认为空字符串'" v-model="menu.redirect"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单权重" prop="weight">
                        <el-input-number v-model="menu.weight" :step="1"></el-input-number>
                    </el-form-item>
                    <el-form-item labelWidth="40%" style="width: 20%" label="权限">
                        <multiCascader placeholder="请选择" :options="configOptions" @on-selected="getSelected" :inputValue="configTips"></multiCascader>
                    </el-form-item>
                    <el-form-item label="子菜单">
                        <el-table :data="menu.children">
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <el-form label-position="right" inline class="demo-table-expand">
                                        <el-form-item label="英文名称">
                                            <el-input v-model="props.row.name"></el-input>
                                        </el-form-item>
                                        <el-form-item label="前端路径">
                                            <el-input v-model="props.row.path"></el-input>
                                        </el-form-item>
                                        <el-form-item label="前端组件名">
                                            <el-input v-model="props.row.component"></el-input>
                                        </el-form-item>
                                        <el-form-item label="菜单名称">
                                            <el-input v-model="props.row.meta.title"></el-input>
                                        </el-form-item>
                                        <el-form-item label="菜单icon">
                                            <el-select v-model="props.row.meta.icon" placeholder="请选择">
                                                <template v-for="(icon, index) in menuConstant.icons">
                                                    <el-option :key="index" :label="icon" :value="'el-icon-lx-' + icon">
                                                        <span style="float: left">{{icon}}</span>
                                                        <span style="float: right; color: #8492a6; font-size: 17px"><i :class="`el-icon-lx-${icon}`"></i></span>
                                                    </el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="重定向url">
                                            <el-input :placeholder="'默认为空字符串'" v-model="props.row.redirect"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="英文名称"
                                    prop="name">
                            </el-table-column>
                            <el-table-column
                                    label="前端组件名"
                                    prop="component">
                            </el-table-column>
                            <el-table-column
                                    label="菜单名称">
                                <template slot-scope="scope">
                                    {{menu.children[scope.$index].meta.title}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="菜单icon">
                                <template slot-scope="scope">
                                    {{menu.children[scope.$index].meta.icon}}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            @click="removeSubMenu(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="addSubMenu" type="primary">新增子菜单</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addMenu('menu')">表单提交</el-button>
                        <el-button @click="redirect2MenuTable">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-col>

    </el-col>
</template>

<script>
    import multiCascader from "multi-cascader"
    import ElButton from "../../../../node_modules/element-ui/packages/button/src/button.vue";
    export default {
        name: 'MenuForm',
        components: {
            ElButton,
            multiCascader},
        data: function(){
            return {
                rules: {
                    name: [
                        {required: true, message: '请输入英文名称', trigger: 'blur'}
                    ],
                    path: [
                        {required: true, message: '请输入前端路径', trigger: 'blur'}
                    ],
                    component: [
                        {required: true, message: '请输入前端组件名', trigger: 'blur'}
                    ],
                    title: [
                        {required: true, message: '请输入父菜单名称', trigger: 'blur'}
                    ],
                    icon: [
                        {required: true, message: '请输入父菜单icon', trigger: 'blur'}
                    ],
                    weight: [
                        {required: true, message: '请输入菜单权重', trigger: 'blur'}
                    ]
                },
                menu: {
                    name: '',
                    path: '/',
                    component: '',
                    meta: {
                        title: "",
                        icon: ""
                    },
                    redirect: '',
                    children: [
                        {
                            name: 'sub_menu_name1',
                            path: 'sub_menu_path1',
                            component: 'sub_menu_component1',
                            meta: {
                                title: "",
                                icon: ""
                            },
                            redirect: '',
                        }
                    ],
                    weight: 0,
                    privilege: []
                },

                menuConstant: {
                    departments: [],
                    icons: [
                        'attentionforbid',
                        'attentionforbidfill',
                        'attention',
                        'attentionfill',
                        'tag',
                        'tagfill',
                        'people',
                        'peoplefill',
                        'notice',
                        'noticefill',
                        'mobile',
                        'mobilefill',
                        'voice',
                        'voicefill',
                        'unlock',
                        'lock',
                        'home',
                        'homefill',
                        'delete',
                        'deletefill',
                        'notification',
                        'notificationfill',
                        'notificationforbidfill',
                        'like',
                        'likefill',
                        'comment',
                        'commentfill',
                        'camera',
                        'camerafill',
                        'warn',
                        'warnfill',
                        'time',
                        'timefill',
                        'location',
                        'locationfill',
                        'favor',
                        'favorfill',
                        'skin',
                        'skinfill',
                        'news',
                        'newsfill',
                        'record',
                        'recordfill',
                        'emoji',
                        'emojifill',
                        'message',
                        'messagefill',
                        'goods',
                        'goodsfill',
                        'crown',
                        'crownfill',
                        'move',
                        'add',
                        'hot',
                        'hotfill',
                        'service',
                        'servicefill',
                        'present',
                        'presentfill',
                        'pic',
                        'picfill',
                        'rank',
                        'rankfill',
                        'male',
                        'female',
                        'down',
                        'top',
                        'recharge',
                        'rechargefill',
                        'forward',
                        'forwardfill',
                        'info',
                        'infofill',
                        'redpacket',
                        'redpacket_fill',
                        'roundadd',
                        'roundaddfill',
                        'friendadd',
                        'friendaddfill',
                        'cart',
                        'cartfill',
                        'more',
                        'moreandroid',
                        'back',
                        'right',
                        'shop',
                        'shopfill',
                        'question',
                        'questionfill',
                        'roundclose',
                        'roundclosefill',
                        'roundcheck',
                        'roundcheckfill',
                        'global',
                        'mail',
                        'punch',
                        'exit',
                        'upload',
                        'read',
                        'file',
                        'link',
                        'full',
                        'group',
                        'friend',
                        'profile',
                        'addressbook',
                        'calendar',
                        'text',
                        'copy',
                        'share',
                        'wifi',
                        'vipcard',
                        'weibo',
                        'remind',
                        'refresh',
                        'filter',
                        'settings',
                        'scan',
                        'qrcode',
                        'cascades',
                        'apps',
                        'sort',
                        'searchlist',
                        'search',
                        'edit'
                    ],
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
                this.menu.privilege = this.checkTreeData(this.configOptions)
                if (0 !== this.menu.privilege.length) {
                    this.configTips = `已选择${this.menu.privilege.length}个分组`;
                } else {
                    this.configTips = `请选择权限`;
                }
            },

            getDepartments() {
                this.$api.FINANCE_DEPARTMENT_API.get("GET_DEPARTMENTS").then(res => {
                    this.menuConstant.departments = this.getTreeData(res.data, this.menu.privilege)
                    this.configOptions = this.menuConstant.departments
                    this.getSelected()
                })
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
            },

            addMenu(menu) {
                this.$refs[menu].validate((valid) => {
                    if (valid) {
                        let menuId = this.$route.query.id
                        if (undefined !== menuId) {
                            // 编辑
                            this.$api.FINANCE_MENU_API.put('EDIT_MENU', this.menu).then(res => {
                                this.$message.success("成功编辑菜单")
                            }).catch(error => {
                                this.$message.error ("提交失败", error)
                            })
                        } else {
                            // 添加
                            this.$api.FINANCE_MENU_API.post('ADD_MENU', this.menu).then(res => {
                                this.$message.success("成功添加菜单")
                            }).catch(error => {
                                this.$message.error ("提交失败", error)
                            })
                        }
                        this.$router.go(0)
                    } else {
                        this.$message.error("请将菜单信息填写完整")
                        return false;
                    }
                })
            },

            removeSubMenu(index) {
                if (this.menu.children.length > 1) {
                    this.menu.children.splice(index, 1)
                } else {
                    this.$message.error("父菜单至少有一个子菜单")
                }
            },

            addSubMenu() {
                this.menu.children.push({
                    name: 'sub_menu_name' + (this.menu.children.length + 1),
                    path: 'sub_menu_path' + (this.menu.children.length + 1),
                    component: 'sub_menu_component' + (this.menu.children.length + 1),
                    meta: {
                        title: "",
                        icon: ""
                    },
                    redirect: '',
                    key: Date.now()
                })
            },

            // 获取数菜单详情
            getMenuInfo(menuId) {
                let getParams = {
                    id : menuId
                }
                this.$api.FINANCE_MENU_API.get('GET_MENU_INFO', getParams).then(res => {
                    this.menu = res.data
                })
            },

            redirect2MenuTable() {
                this.$router.push("/menu_table")
            },

            redirect2Icon() {
                const {href} = this.$router.resolve({
                    name: 'icon'
                })
                window.open(href, '_blank')
            }
        },
        computed: {
            isEdit: function () {
                return undefined !== this.$route.query.id
            }
        },
        created() {
            let menuId = this.$route.query.id
            if (undefined !== menuId) {
                this.getMenuInfo(menuId)
            }
            this.getDepartments()
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