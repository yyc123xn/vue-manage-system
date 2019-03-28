<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-favor"></i> schart图表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <div class="plugins-tips">
                vue-schart：vue.js封装sChart.js的图表组件。
                访问地址：<a href="https://github.com/lin-xin/vue-schart" target="_blank">vue-schart</a>
            </div>
            <!--<el-col>-->
                <!--<histogram></histogram>-->
            <!--</el-col>-->
            <!--<el-col>-->
                <!--<LineDup></LineDup>-->
            <!--</el-col>-->
            <!--<el-col>-->
                <!--<el-col span=12><Pie></Pie></el-col>-->
                <!--<el-col span=12><Pie></Pie></el-col>-->
            <!--</el-col>-->
            <!--<el-col>-->
                <!--<MonitorCard></MonitorCard>-->
            <!--</el-col>-->
            <el-col>
            <LineDup></LineDup>
            </el-col>
            <el-col span="12">
                <Map></Map>
            </el-col>
            <el-col span="12">
                <Table></Table>
            </el-col>
            <el-col span="12">
                <Table></Table>
            </el-col>
            <el-col span="12">
                <Map></Map>
            </el-col>
        </el-col>
    </el-col>

</template>

<script>
    import Schart from 'vue-schart';
    import Histogram from '../common/charts/Histogram.vue'
    import LineDup from '../common/charts/Line.vue'
    import Pie from '../common/charts/Pie.vue'
    import MonitorCard from '../common/charts/MonitorCard.vue'
    import Map from '../common/charts/Map.vue'
    import Table from '../common/charts/Table.vue'
    import 'echarts/lib/component/toolbox'
    import ElCol from "element-ui/packages/col/src/col";
    export default {
        name: 'basecharts',
        components: {
            ElCol,
            Schart,
            Histogram,
            LineDup,
            Pie,
            Map,
            Table,
            MonitorCard
        },

        data: () => ({
            data1:[
                {name:'2012',value:1141},
                {name:'2013',value:1499},
                {name:'2014',value:2260},
                {name:'2015',value:1170},
                {name:'2016',value:970},
                {name:'2017',value:1450}
            ],
            data2 : [
                {name:'短袖',value:1200},
                {name:'休闲裤',value:1222},
                {name:'连衣裙',value:1283},
                {name:'外套',value:1314},
                {name:'羽绒服',value:2314}
            ],
            options1: {
                title: '某商店近年营业总额',
                autoWidth: true,   // 设置宽高自适应
                showValue: false,
                bgColor: '#F9EFCC',
                fillColor: '#00887C',
                contentColor: 'rgba(46,199,201,0.3)',
                yEqual: 7
            },
            options2: {
                title: '某商店近年营业总额',
                bgColor: '#D5E4EB',
                titleColor: '#00887C',
                fillColor: 'red',
                contentColor: 'rgba(46,199,201,0.3)'
            },
            options3: {
                title: '某商店各商品年度销量',
                bgColor: '#829dca',
                titleColor: '#ffffff',
                legendColor: '#ffffff',
                radius: 120
            },
            options4: {
                title: '某商店各商品年度销量',
                bgColor: '#829daa',
                titleColor: '#ffffff',
                legendColor: '#ffffff',
                radius: 120,
                innerRadius:80
            }
        })
    }
</script>