export default [
    {
        path: "/",
        component: "Home",
        name: "home",
        meta: {
            title: "基础组件",
            icon: "el-icon-lx-home",
        },
        children: [
            {
                path: 'dashboard',
                component: "Dashboard",
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    icon: 'el-icon-lx-home',
                }
            },
            {
                path: 'base_table',
                component: "BaseTable",
                name: 'base_table',
                meta: {
                    icon: 'el-icon-lx-cascades',
                    title: '基础表格'
                }
            },
            {
                path: 'tabs',
                component: "Tabs",
                name: 'tabs',
                meta: {
                    icon: 'el-icon-lx-copy',
                    title: 'tab选项卡'
                }
            },
            {
                path: 'icon',
                component: "Icon",
                name: 'icon',
                meta: {
                    icon: 'el-icon-lx-emoji',
                    title: '自定义图标'
                }
            },
            {
                path: 'base_charts',
                component: "BaseCharts",
                name: 'base_charts',
                meta: {
                    icon: 'el-icon-lx-favor',
                    title: 'schart图表'
                }
            }
        ]
    },
    {
        path: "/",
        component: "Home",
        name: 'table',
        meta: {
            icon: 'el-icon-lx-calendar',
            title: '表单相关',
        },
        children: [
            {
                path: 'base_form',
                component: "BaseForm",
                name: 'base_form',
                meta: {
                    title: '基本表单'
                }
            },
            {
                path: 'vue_editor',
                component: "VueEditor",
                name: 'vue_editor',
                meta: {
                    title: '富文本编辑器'
                }
            },
            {
                path: 'markdown',
                component: "Markdown",
                name: 'markdown',
                meta: {
                    title: 'markdown编辑器'
                }
            },
            {
                path: 'upload',
                component: "Upload",
                name: 'upload',
                meta: {
                    title: '文件上传'
                }
            }
        ]
    },

    {
        path: "/",
        component: "Home",
        name: 'tuozhuai',
        meta: {
            icon: 'el-icon-rank',
            title: '拖拽组件',
        },
        children: [
            {
                path: 'drag_list',
                component: "DragList",
                name: 'drag_list',
                meta: {
                    title: '拖拽列表'
                }
            },
            {
                path: 'drag_dialog',
                component: "DragDialog",
                name: 'drag_dialog',
                meta: {
                    title: '拖拽弹框'
                }
            }
        ]
    },
    {
        path: "/",
        component: "Home",
        name: 'error',
        meta: {
            icon: 'el-icon-lx-warn',
            title: '错误处理'
        },
        children: [
            {
                path: 'permission',
                component: "Permission",
                name: 'permission',
                meta: {
                    title: '权限测试'
                }
            }
        ]
    },
    {
        path: "/",
        component: "Home",
        name: 'voucher',
        meta: {
            title: '公司票据',
            icon: 'el-icon-lx-punch',
        },
        children: [
            {
                path: 'voucher_table',
                component: "VoucherTable",
                name: 'voucher_table',
                meta: {
                    icon: 'el-icon-lx-cascades',
                    title: '票据列表'
                }
            },
            {
                path: 'voucher_form',
                component: "VoucherForm",
                name: 'voucher_form',
                meta: {
                    title: '票据表单'
                }
            }
        ]
    },
    {
        path: "/",
        component: "Home",
        name: 'fixed_assets',
        meta: {
            title: '公司固定资产',
            icon: 'el-icon-lx-apps',
        },
        children: [
            {
                path: 'fixed_assets_table',
                component: "FixedAssetsTable",
                name: 'fixed_assets_table',
                meta: {
                    icon: 'el-icon-lx-cascades',
                    title: '固定资产列表'
                }
            },
            {
                path: 'fixed_assets_form',
                component: "FixedAssetsForm",
                name: 'fixed_assets_form',
                meta: {
                    title: '固定资产表单'
                }
            }
        ]
    },
    {
        path: "/",
        component: "Home",
        name: 'developer',
        meta: {
            title: '公司员工',
            icon: 'el-icon-lx-profile',
        },
        children: [
            {
                path: 'developer_table',
                component: "DeveloperTable",
                name: 'developer_table',
                meta: {
                    icon: 'el-icon-lx-cascades',
                    title: '员工列表'
                }
            },
            {
                path: 'developer_form',
                component: "DeveloperForm",
                name: 'developer_form',
                meta: {
                    title: '员工表单'
                }
            }
        ]
    },
    {
        path: "/",
        component: "Home",
        name: 'client',
        meta: {
            title: '公司客户',
            icon: 'el-icon-lx-group',
        },
        children: [
            {
                path: 'client_table',
                component: "ClientTable",
                name: 'client_table',
                meta: {
                    icon: 'el-icon-lx-cascades',
                    title: '客户列表'
                }
            },
            {
                path: 'client_form',
                component: "ClientForm",
                name: 'client_form',
                meta: {
                    title: '客户表单'
                }
            }
        ]
    },
    {
        path: "/",
        component: "Home",
        name: 'data_source',
        meta: {
            title: '数据源',
            icon: 'el-icon-lx-file',
        },
        children: [
            {
                path: 'data_source_table',
                component: "DataSourceTable",
                name: 'data_source_table',
                meta: {
                    icon: 'el-icon-lx-cascades',
                    title: '数据源列表'
                }
            },
            {
                path: 'data_source_form',
                component: "DataSourceForm",
                name: 'data_source_form',
                meta: {
                    title: '数据源表单'
                }
            }
        ]
    },
    {
        path: "/",
        component: "Home",
        name: 'dashboard',
        meta: {
            title: '数据看板',
            icon: 'el-icon-lx-rank',
        },
        children: [
            {
                path: 'dashboard_table',
                component: "DashboardTable",
                name: 'dashboard_table',
                meta: {
                    icon: 'el-icon-lx-cascades',
                    title: '看板列表'
                }
            },
            {
                path: 'dashboard_form',
                component: "DashboardForm",
                name: 'dashboard_form',
                meta: {
                    title: '看板表单'
                }
            },
            {
                path: 'dashboard_info',
                component: "DashboardInfo",
                name: 'dashboard_info',
                meta: {
                    title: '看板详情'
                }
            }
        ]
    },
    {
        path: "/",
        component: "Home",
        name: 'data_set',
        meta: {
            title: '数据集',
            icon: 'el-icon-lx-text',
        },
        children: [
            {
                path: 'data_set_table',
                component: "DataSetTable",
                name: 'data_set_table',
                meta: {
                    icon: 'el-icon-lx-cascades',
                    title: '数据集列表'
                }
            },
            {
                path: 'data_set_form',
                component: "DataSetForm",
                name: 'data_set_form',
                meta: {
                    title: '数据集表单'
                }
            }
        ]
    },
    {
        path: "/",
        component: "Home",
        name: 'department',
        meta: {
            title: '部门管理',
            icon: 'el-icon-lx-text',
        },
        children: [
            {
                path: 'department',
                component: "Department",
                name: 'department',
                meta: {
                    icon: 'el-icon-lx-cascades',
                    title: '部门管理'
                }
            },
            {
                path: 'privilege',
                component: "Privilege",
                name: 'privilege',
                meta: {
                    title: '权限管理'
                }
            }
        ]
    },
    {
        path: "/",
        component: "Home",
        name: 'home',
        meta: {
            title: 'Home',
            icon: 'el-icon-lx-text',
        },
        children: [
            {
                path: 'dashboard',
                component: "Dashboard",
                name: 'dashboard',
                meta: {
                    icon: 'el-icon-lx-cascades',
                    title: '主页'
                }
            },
            {
                path: 'message',
                component: "Message",
                name: 'message',
                meta: {
                    title: '消息提醒'
                }
            }
        ]
    },
    // {
    //     path: "/",
    //     component: "Home",
    //     name: 'report',
    //     meta: {
    //         title: '报表',
    //         icon: 'el-icon-lx-pic',
    //     },
    //     children: [
    //         {
    //             path: 'report_table',
    //             component: "ReportTable",
    //             name: 'report_table',
    //             meta: {
    //                 icon: 'el-icon-lx-cascades',
    //                 title: '报表列表'
    //             }
    //         },
    //         {
    //             path: 'report_form',
    //             component: "ReportForm",
    //             name: 'report_form',
    //             meta: {
    //                 title: '报表表单'
    //             }
    //         }
    //     ]
    // }
]