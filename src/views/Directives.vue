<template>
    <div class="p20">
<!--        <span v-countdown="160000" formatter='HH小时mm分ss秒'></span>
        <Level :level="1" :title="title">{{title}}</Level>-->
        <el-form label-position="right" label-width="200px">
            <el-form-item v-for="(item,k) in list" :key="k" :label="item.label">
                <el-input type="text" v-model="inpVal" v-input-limit:[k] :ce-custom-reg="item.reg" @change="changeInp" ></el-input>
            </el-form-item>
        </el-form>
        <el-button @click="log">输出</el-button>
    </div>
</template>

<script type="text/jsx">
    //import * as CountOut from "@/api/directives/timeout.js"
    var Child = {
        render(createElement) {
            return createElement('p', 'text')
        }
    };
    import Level from "../components/Level";

    export default {
        name: "Direcives",
        components: {
            Level
        },
        // directives : { countdown : CountOut.default.countdown}
        data() {
            return {
                title: "特性",
                text : "",
                inpVal : "",
                rule : {

                },
                reg : /^[^A-Za-z_]|[^A-Za-z_0-9]+/ ,
                list : {
                    trim : {
                        label : "限制空格" ,
                    },
                    number : {
                        label : "允许数字"
                    },
                    noSpecial : {
                        label : "特殊字符"
                    },
                    letter : {
                        label : "字母数字下划线"
                    },
                    custom : {
                        label : "自定义" ,
                        reg : /^[^A-Za-z_]|[^A-Za-z_0-9]+/
                    },
                    fieldCode : {
                        label : "字段名"
                    },
                    fieldName: {
                        label : "字段中文名"
                    },
                    fieldChineseCode : {
                        label : "字段名可中文"
                    },
                    chartCode:{
                        label : "新建表名"
                    }
                }
            }
        },
        render(createElement, hack) {
            let childNode = createElement(Child);
            let l = createElement("Level",
                {
                    props: {
                        level: 1,
                        title: "level"
                    }
                },
                "level"
            );
            return (
                <div
                    id = "myDiv"
                    domPropsInnerHTML="content"
                > </div>
            );
        },
        methods : {
            log(){
                console.log(this.inpVal)
            },
            changeInp(val){
                console.log(this.inpVal)
            }
        }

    }
</script>

<style scoped>

</style>
