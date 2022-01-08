<template>
    <div class="home">
        <!--<input type="text" v-focus>-->
        <!--    <div v-focus:msg.a.b.enter="message"></div>-->

        <el-select v-model="value" popper-class="select_limit" placeholder="请选择">
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :title="item.label"
                    :value="item.value"
            >
            </el-option>
        </el-select>
        <div ref="par" style="height: 30%">
            <el-table
                    :data="tableData"
                    stripe
                    ref="table"
                    :max-height="tableH"
                    style="width: 100%"
            >
                <el-table-column prop="date" label="日期" width="180">
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="180">
                </el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
            </el-table>
        </div>

        <el-input
                placeholder="请输入内容"
                v-model="inputV"
                class="input-with-select"
        >
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <div v-for="(state ,key) in currentState" :key="key">
            {{state}}
        </div>
        <el-button type="primary" @click="showGlobal">renewGlobal</el-button>

        <el-input v-model="num" v-input-limit:decimal @change="numChange"></el-input>
    </div>
</template>

<script>
import {mapGetters} from "vuex"

export default {
    name: "Home",
    watch: {
        tableH(val) {
            this.$refs.table.doLayout();
        },
    },
    computed: {
        tableH() {
            let h = "100%";
            this.$nextTick(() => {
                h = this.$refs.par.clientHeight + "px";
            });
            return h;
        },
        ...mapGetters(["globalState"])
    },
    data() {
        return {
            num : 0 ,
            inputV: "",
            pre: "",
            tableData: [
                {
                    date: "2016-05-02",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                },
                {
                    date: "2016-05-04",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1517 弄",
                },
                {
                    date: "2016-05-01",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1519 弄",
                },
                {
                    date: "2016-05-03",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1516 弄",
                },
            ],
            message: "some msg",
            options: [
                {
                    value: "选项1",
                    label: "黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕",
                },
                {
                    value: "选项2",
                    label: "双皮奶",
                },
                {
                    value: "选项3",
                    label: "蚵仔煎",
                },
                {
                    value: "选项4",
                    label: "龙须面",
                },
                {
                    value: "选项5",
                    label: "北京烤鸭",
                },
            ],
            value: "",
            currentState : null
        };
    },
    methods: {
        countHeight() {
        },
        getTableH() {
            window.addEventListener("resize", this.countHeight, false);
        },
        showGlobal(){
            this.$setGlobalState({
                userInfo: {name: "vue-demo-app"}, globalConfig: {time : new Date()}
            });
        },
        stateChange(state){
            this.currentState = state;
        },
        numChange(val){
            'use strict';
            const vm = this;
            let reg = /^\+?[1-9][0-9]*$/;
            let num = parseFloat(val);
            if(reg.test(val)){
                vm.num = Number(num).toFixed(1) ;
            }else {
                vm.num = Number(num);
            }
        }
    },
    created() {
        let services = this.$services("login");
        this.currentState = this.globalState;
        this.$onGlobalStateChange && this.$onGlobalStateChange(this.stateChange);

        let obj = {name : "2"};

    }
};
</script>
<style>
.select_limit {
    max-width: 200px;
}

.home {
    height: calc(100vh);
}
</style>
