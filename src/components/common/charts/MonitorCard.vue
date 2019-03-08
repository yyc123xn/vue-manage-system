<template>
    <el-col>
        <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-1">
                <i class="el-icon-lx-attention grid-con-icon"></i>
                <div class="grid-cont-right">
                    <div class="grid-num">1234</div>
                    <div>用户访问量</div>
                </div>
            </div>
        </el-card>
    </el-col>
</template>

<script>
    export default {
        name: "MonitorCard",
        data() {
            return {
                msg: 'hello vue'
            }
        }
    }
</script>

<style>
    body {
        background-color: #ff0000;
    }
    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }
</style>