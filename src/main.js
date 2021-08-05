import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false
import Axios from 'axios';

const axios = Axios.create({
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    baseURL: "/api",
    timeout: 1000 * 60 * 60
});
Vue.prototype.$axios = axios;

import VueResource from "vue-resource"

Vue.use(VueResource);
const http = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    timeout: 1000 * 60 * 60,
    // root: "http://jsonplaceholder.typicode.com"
    root: "http://127.0.0.1:8090"
};
Vue.http.options = http;

import {
    Message
} from 'element-ui';
export async function fetch(options) {
    try {
        let instance = await axios.create({
            timeout: 20000, // 超时
            headers: {
                // 'X-touchspring-Token': store.state.user.token,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        let result = await instance(options);
        result = result.data;
        console.log(result);
        if (result.code === 1200 || result.code === 2000) {
            return result;
        } else {
            Message({
                message: result.message,
                type: 'error',
                showClose: true,
                duration: 2 * 1000,
            });
        }
    } catch (err) {
        console.log(err)
    }
}

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI , {
    size : "small"
});

//echarts
import VCharts from 'v-charts'
Vue.use(VCharts);
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;
/**
 * 全局引入指令
 */
Vue.use((Vue) => {
    ((requireContext) => {
        const arr = requireContext.keys().map(requireContext);
        (arr || []).forEach((directive) => {
            directive = directive.__esModule && directive.default ? directive.default : directive;
            Object.keys(directive).forEach((key) => {
                Vue.directive(key, directive[key]);
            });
        });
    })(require.context('@/api/directives', false, /^\.\/.*\.js$/));
});

/*
* 引入common文件下，共用组件
* components/signed-components 目录下的通用组件 可全局使用不用注册
* 该目录下的组件 新建的组件要求：建个目录，内部建vue组件，仅单个vue，若有其他引入的vue文件，需要在里面建个目录存放。
* 例：新建个 table 目录，里面新建个 table.vue ,table.vue 需要引用 option.vue ,需要建个pages,注：目录名称必须是pages,文件名称不能有pages, 目录存放这个 option.vue
* */

function changeStr (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
const requireComponent = require.context('@/components/common', true, /(\.\/(?:(?!pages).)+)\.vue$/);
// 查找同级目录下以vue结尾的组件
Vue.use((Vue) =>{
    ((requireContext) => {
        const arr = requireContext.keys();
        (arr || []).forEach((fileName) => {
            let config = requireComponent(fileName);
            let componentName = config.default.name;
            Vue.component(componentName, config.default || config);
        });
    })(requireComponent);
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
