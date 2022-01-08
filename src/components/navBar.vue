<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" v-bind="$attrs" v-on="$listeners">
        <el-menu-item v-for="(menu , index) in data" :key="index" :route="menu.path" :index="menu.k" >{{menu.label}}</el-menu-item>
    </el-menu>
</template>

<script>

export default {
    name: "navBar" ,
    props : {
        data :{
            type : Array ,
            default : ()=>[]
        },
    },
    computed : {
        curRouter(){
            console.log(this.$route)
            return "0";
        }
    },
    watch :{
        "$route" : {
            handler(rou){
                let fullPath = this.data.find(item => item.path === rou.fullPath);
                if(fullPath){
                    this.activeIndex = fullPath.k;
                }else {
                    this.activeIndex = "0";
                }
            },
            deep : true
        }
    },
    data(){
        return {
            activeIndex : "0"
        }
    }
}
</script>

<style scoped>

</style>
