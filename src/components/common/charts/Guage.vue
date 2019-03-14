<template>
    <ve-gauge :data="chartData" :settings="chartSettings"></ve-gauge>
</template>

<script>
    export default {
        name: 'Guage',
        data () {
            this.chartSettings = {
                dataType: {
                    '占比': 'percent'
                },
                seriesMap: {
                    '占比': {
                        min: 0,
                        max: 1
                    }
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
        }
    }
</script>