<template>
  <ve-histogram :data="chartData" :settings="chartSettings" :toolbox="toolbox"></ve-histogram>
</template>

<script>
    // 使用前需先引入对应模块
    import 'echarts/lib/component/toolbox'
    export default {
        name: "Histogram",
        props: {id : Number},
        data () {
            this.chartSettings = {
            }
            this.toolbox = {
                feature: {
                    saveAsImage: {}
                }
            }
            return {
                chartData: {

                }
            }
        },

        methods: {
            async getReportData(reportId) {
                let reportData
                let getParams = {
                    id : reportId
                }
                await this.$api.REPORT_REPORT_API.get('GET_REPORT_DATA', getParams).then(res => {
                    reportData = res.data
                })
                return reportData
            }
        },

//        watch: {
//            queryColumn: val => {
//                console.log('queryColumn')
//                console.log(val)
//                let _this = this;
//                console.log(this.id)
//            }
//        },

        mounted() {
            let _this = this;
            let reportId =_this._props.id;
            this.getReportData(reportId).then(res => {
                _this.chartData = {
                    rows: res,
                    columns: ['create_time', 'base_wages', 'status'],
                }
                _this.chartSettings = {
                }
            })
        }
    }
</script>
