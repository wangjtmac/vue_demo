<template>
    <div id="app">
        <nav-bar :data="menus" router
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 @select="selectMenu"></nav-bar>
        <div class="container">
            <router-view/>
        </div>
    </div>
</template>
<script>
import navBar from "@/components/navBar";
import {getMenu} from "@/router/index.js"
export default {
    components : {
        navBar
    },
    computed: {
        menus(){
            let list = [];
            list = getMenu();
            list = list.map( (item , i) => {
                return {
                    label : item.name ,
                    k : i+'',
                    path : item.path
                }
            })
            return list;
        }
    },
    data(){
        return {

        }
    },
    methods : {
        selectMenu(list){

        }
    },
    created() {

    }
}
</script>
<style scoped>
@import "../public/css/reset.css";
@import "../public/css/zxx.lib.css";
.container {
    height: calc(100vh - 61px);
}
</style>
