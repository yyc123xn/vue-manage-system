<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-text"></i> 部门管理</el-breadcrumb-item>
                <el-breadcrumb-item>部门管理</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="form-box">
                <div class="custom-tree-container">
                    <div class="block">
                        <el-input style="margin-bottom: 20px"
                                placeholder="输入关键字进行过滤"
                                v-model="filterText">
                        </el-input>
                        <el-tree
                                :data="departments"
                                show-checkbox
                                node-key="id"
                                :expand-on-click-node="false"
                                ref="departmentTree"
                                :filter-node-method="filterDepartment">
                          <span class="custom-tree-node" slot-scope="{ node, data }">
                              <span style="margin-right: 20px">{{ node.label }}</span>
                              <span>
                                  <el-button
                                          type="text"
                                          @click="editDepartment(node, data)">
                                    编辑
                                  </el-button>
                                  <el-button
                                          type="text"
                                          @click="addDepartment(node, data)">
                                    添加子部门
                                  </el-button>
                                  <el-button v-if="node.label !== '部门'"
                                          type="text"
                                          @click="deleteDepartment(node, data)"
                                          style="color:red;">
                                    删除当前部门
                                  </el-button>
                                </span>
                            </span>
                        </el-tree>
                    </div>
                </div>
            </el-col>
        </el-col>

        <!-- 编辑弹出框 -->
        <el-dialog title="部门" :visible.sync="editVisible" width="50%">
            <el-form label-width="9%" :model="department" ref="department" :rules="rules">
                <el-form-item label="名称" prop="label">
                    <el-input v-model="department.label"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input type="textarea" rows="5" v-model="department.description"></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="leader">
                    <el-select
                            v-model="department.leader"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入关键词"
                            :remote-method="queryDevelopers"
                            :loading="loading">
                        <el-option
                                v-for="developer in developers"
                                :key="developer.id"
                                :label="developer.nameCn"
                                :value="developer.nameEn">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('department')">确 定</el-button>
            </span>
        </el-dialog>
    </el-col>
</template>

<script>

    export default {
        /**
         * todo 添加测试，删除测试，编辑测试，然后把其他代码和部门结合
         */
        name: 'Department',
        data: function(){
            return {
                editVisible: false,
                filterText: '',
                department: {
                    id : 0,
                    name : '',
                    description : '',
                    parentId: 0,
                    label: '',
                    leader: '',
                    data: '',
                },
                loading: false,
                rules: {
                    label: [
                        { required: true, message: '请输入部门名称', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请输入部门描述', trigger: 'blur' }
                    ],
                    leader: [
                        { required: true, message: '请选择部门负责人', trigger: 'blur' }
                    ]
                },
                id: 1000,
                departments: [],
                developers: []
            }
        },
        methods: {

            queryDevelopers(query) {
                if (query !== '') {
                    this.loading = true;
                    let getParams = {
                        name: query
                    }
                    this.$api.FINANCE_DEVELOPER_API.get("QUERY_DEVELOPERS", getParams).then(res => {
                        this.developers = res.data
                        this.loading = false;
                    })
                    setTimeout(() => {
                        this.loading = false;
                    });
                } else {
                    this.developers = [];
                }
            },

            editDepartment(node, data) {
                let getParams = {
                    id : data.id
                }
                this.$api.FINANCE_DEPARTMENT_API.get("GET_DEPARTMENT_INFO", getParams).then(res => {
                    this.department = res.data
                    this.department.data = data
                    this.editVisible = true
                })
            },

            addDepartment(node, data) {
                const newDepartment = {
                    name: '新部门',
                    label: '新部门',
                    children: [],
                    parentId: data.id
                };
                this.$api.FINANCE_DEPARTMENT_API.post("ADD_DEPARTMENT", newDepartment).then(res => {
                    newDepartment.id = res.data
                    if (!data.children) {
                        this.$set(data, 'children', []);
                    }
                    data.children.push(newDepartment);
                    this.$message.success("添加新部门成功")
                })
            },

            deleteDepartment(node, data) {
                this.$confirm('删除不可恢复，是否确定删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const parent = node.parent;
                    let deleteParams = {
                        id : data.id,
                        parentId: parent.data.id
                    }
                    this.$api.FINANCE_DEPARTMENT_API.delete("DELETE_DEPARTMENT", deleteParams).then(res => {
                        const children = parent.data.children || parent.data;
                        const index = children.findIndex(d => d.id === data.id);
                        children.splice(index, 1);
                        this.$message.success("删除部门成功")
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            saveEdit(department) {
                this.$refs[department].validate((valid) => {
                    if (valid) {
                        this.department.name = this.department.label
                        this.$api.FINANCE_DEPARTMENT_API.put("EDIT_DEPARTMENT", this.department).then(res => {
                            this.department.data.label = this.department.label
                            this.$message.success("编辑部门信息成功")
                            this.editVisible = false
                        })
                    } else {
                        this.$message.error("请将信息填写完整")
                        return false;
                    }
                })
            },

            filterDepartment(value, data) {
                if (!value) {
                    return true;
                }
                return data.label.indexOf(value) !== -1;
            },

            getDepartments() {
                this.$api.FINANCE_DEPARTMENT_API.get("GET_DEPARTMENTS").then(res => {
                    this.departments = res.data
                })
            }
        },

        created() {
            this.getDepartments()
        },

        watch: {
            filterText(val) {
                this.$refs.departmentTree.filter(val);
            }
        },
    }
</script>

<style>
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand {
        width: 100%;
    }
</style>