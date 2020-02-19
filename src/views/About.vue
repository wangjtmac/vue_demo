<template>
    <div class="about">
        <div class="main" v-click-outside="close">
            <button @click="show = !show">显示</button>
            <div class="dropdown" v-show="show">
                <p>下拉框的内容</p>
            </div>
        </div>
        <br>
        <div>时间转换指令</div>
        <div v-time="timeNow"></div>
        <div v-time="timeBefore"></div>

    </div>
</template>
<script>
    export default {
        name: 'About',
        data(){
          return {
              show : false ,
              timeNow : new Date(),
              timeBefore : 1488930695721
          }
        },
        directives: {
            clickOutside: {
                bind(el , binding , vnode) {
                    function documentHandler(e) {
                        if(el.contains(e.target)){
                            return false;
                        }
                        if(binding.expression){
                            binding.value(e);
                        }
                    }

                    el.__vueClickOutside__ = documentHandler;
                    document.addEventListener('click', documentHandler);
                },
                inserted() {

                },
                unbind(el , binding){
                    document.removeEventListener('click' , el.__vueClickOutside__);
                    delete el.__vueClickOutside__;
                }
            },
            time : {

            }
        },
        methods: {
            close() {
                this.show = false;
            }

        }
    }
</script>
<style scoped>
    .main {
        width: 125px;
    }
    button {
        display: block;
        width: 100%;
        background-color:#39f;
        border:0;
        padding: 6px;
        text-align: center;
        font-size: 12px;
        border-radius: 4px;
        cursor: pointer;
        outline: none;
        position: relative;
        color: #fff;
    }
    button:active {
        top : 1px;
        left: 1px;
    }
    .dropdown {
        width : 100%;
        height: 150px;
        margin:5px 0;
        font-size: 12px;
        border-radius:4px;
        background: #fff;
        border: 1px solid #ddd;
        box-shadow: 0 0 6px 1px rgba(0,0,0,.2);
    }
</style>