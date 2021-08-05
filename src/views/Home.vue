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
                    :value="item.value">
            </el-option>
        </el-select>
        <div ref="par" style="height:30%">
            <el-table
                    :data="tableData"
                    stripe
                    ref="table"
                    :max-height="tableH"
                    style="width: 100%">
                <el-table-column
                        prop="date"
                        label="日期"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="地址">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src


export default {
    name: 'Home',
    watch :{
        tableH(val){
            this.$refs.table.doLayout();
        }
    },
    computed : {
        tableH (){
            let h = "100%";
            this.$nextTick(()=>{
                h = this.$refs.par.clientHeight + 'px';
                console.log(h)
            })
            return h;
        }
    },
    data() {
        return {
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
            message: 'some msg',
            options: [{
                value: '选项1',
                label: '黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }, {
                value: '选项3',
                label: '蚵仔煎'
            }, {
                value: '选项4',
                label: '龙须面'
            }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            value: ''
        }
    },
    methods: {
        countHeight(){

        },
        getTableH(){
            window.addEventListener(
                    "resize", this.countHeight, false
            );
        }
    }
}
</script>
<style>
.select_limit {
    max-width: 200px;
}
.home {
    height: calc(100vh);
}
</style>
