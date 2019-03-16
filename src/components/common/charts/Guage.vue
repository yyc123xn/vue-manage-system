<template>
    <ve-gauge :data="chartData" :settings="chartSettings" :toolbox="toolbox"></ve-gauge>
</template>

<script>
    // 使用前需先引入对应模块
    import 'echarts/lib/component/toolbox'
    export default {
        name: 'Guage',
        props: {id : Number, chartData: Object},
        data () {
            this.chartSettings = {
//                dataType: {
//                    '占比': 'percent'
//                },
//                seriesMap: {
//                    '占比': {
//                        min: 0,
//                        max: 1
//                    }
//                }
            }
            this.toolbox = {
                feature: {
                    saveAsImage: {}
                }
            }
            return {
                chartData: {
                    columns: ['type', 'value'],
                    rows: [
                        { type: '占比', value: 0.8 }
                    ]
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

        mounted() {
            let _this = this;
            let reportId =_this._props.id;
            this.getReportData(reportId).then(res => {
                _this.chartData = {
                    rows: res,
                    columns: ['create_time', 'base_wages'],
                }
                _this.chartSettings = {
                }
            })
        }
    }
</script>