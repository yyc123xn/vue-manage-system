<template>
  <ve-histogram
          :data="chartData"
          :settings="chartSettings"
          :toolbox="toolbox"
          :loading="loading"
          :data-empty="dataEmpty">
  </ve-histogram>
</template>

<script>
    // 使用前需先引入对应模块
    import 'echarts/lib/component/toolbox'
    import 'v-charts/lib/style.css'
    export default {
        name: "Histogram",
        props: {id : Number, queryColumns: Array, queryConditions: Array},
        data () {
            this.chartSettings = {
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
                let postParams = {
                    id : reportId
                }
                if (this.queryColumns !== undefined && 0 < this.queryColumns.length) {
                    postParams.queryColumns = this.queryColumns
                    postParams.queryConditions = this.queryConditions
                }
                await this.$api.REPORT_REPORT_API.post('GET_REPORT_DATA', postParams).then(res => {
                    reportData = res.data
                })
                return reportData
            },

            updateReportData(reportId) {
                this.getReportData(reportId).then(res => {
                    this.loading = true;
                    this.dataEmpty = 0 === res.rows.length;
                    this.chartData = res
                    this.loading = false;
                })
            }
        },

        watch: {
            queryConditions: {
                handler (newV, oldV) {
                    // do something, 可使用this
                    this.updateReportData(this.id)
                },
                deep :true
            }
        },

        mounted() {
            let _this = this;
            let reportId =_this._props.id;
            this.updateReportData(reportId)
        }
    }
</script>
