<template>
    <ve-gauge :data="chartData"
              :settings="chartSettings"
              :toolbox="toolbox"
              :loading="loading"
              :data-empty="dataEmpty"></ve-gauge>
</template>

<script>
    // 使用前需先引入对应模块
    import 'echarts/lib/component/toolbox'
    import 'v-charts/lib/style.css'
    export default {
        name: 'Guage',
        props: {id : Number, queryColumn: Array, queryCondition: Array},
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
                chartData: {},
                loading: true,
                dataEmpty: false
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
            },

            updateReportData(reportId) {
                this.getReportData(reportId).then(res => {
                    this.loading = true;
                    if (0 === res.length) {
                        this.dataEmpty = true;
                    }
                    this.chartData = {
                        rows: res,
                        columns: ['create_time', 'base_wages'],
                    }
                    this.chartSettings = {
                    }
                    this.loading = false;
                })
            }
        },

        watch: {
            queryCondition: {
                handler (newV, oldV) {
                    // do something, 可使用this
                    this.updateReportData(this.id)
                },
                deep:true
            }
        },

        mounted() {
            let _this = this;
            let reportId =_this._props.id;
            this.updateReportData(reportId)
        }
    }
</script>