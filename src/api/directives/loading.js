/**
 * v-ce-loading
 * 自定义 loading指令
 *   <div v-ce-loading:[loadingOption]="loading"></div>
 *   <div v-ce-loading:[loadingOption].fullscreen="loading"></div>
 *   loadingOption : {
 *          fullscreen : true , //全屏
 *          background : '#000000' , // 背景色
 *          text : "加载" , //加载文字
 *          iconClass : "加载动画样式",
 *          color : "加载文字颜色"，
 *          fontSize : "加载字体大小"
 *          zIndex : "遮罩层级"
 *   }
 *
 */

import vue from "vue";
import CeLoading from "@/components/CeLoading.vue";

const Mask = vue.extend(CeLoading);
//蒙版操作更新
const toggleLoading = function(el, binding) {
    if (binding.value) {
        vue.nextTick(() => {
            if (binding.modifiers.fullscreen) {
                //全屏情况下
                //el.instance.fullscreen = true;
                //document.body.style.overflow = "hidden";
                document.body.appendChild(el.mask);
            } else {
                //el.instance.fullscreen = false;
                //非全屏情况下
                let height = el.clientHeight; //当前元素高度
                let width = el.clientWidth; //当前元素宽度
                let offsetTop = el.offsetTop; //当前元素距离顶部距离
                //给蒙版赋值
                el.mask.style.top = 0;
                el.mask.style.left = 0;
                el.mask.style.height = "100%";
                el.mask.style.width =  "100%";
                el.style.position = "relative";
                el.appendChild(el.mask);
            }
        });
    } else {
        //移除节点
        el.mask && el.mask.parentNode && el.mask.parentNode.removeChild(el.mask);
        el.instance && el.instance.$destroy();
    }
};
export default {
    ceLoading : {
        //只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
        bind(el, binding,vnode) {
            let {background , text , iconClass , color ,fontSize ,zIndex ,fullscreen } = binding.arg;
            const mask = new Mask({
                el: document.createElement("div"),
                data: {
                    fullscreen: !!binding.modifiers.fullscreen || fullscreen,
                    background: background || "255, 255, 255, 0.9",
                    text: text || "",
                    iconClass: iconClass ||  "",
                    color: color || '#555',
                    fontSize: fontSize || null,
                    zIndex: zIndex || 1000,
                }
            });
            el.instance = mask; //将mask存入
            el.mask = mask.$el; //dom存入，方便获取
            toggleLoading(el, binding);
        },
        // 当被绑定的元素插入到 DOM 中时……
        //被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
        // eslint-disable-next-line no-unused-vars
        inserted: function(el, binding, vnode, oldVnode) {
            //console.log("元素插入的时候");
        },
        //所在组件的 VNode 更新时调用
        update(el, binding) {
            //console.log("更新了", binding);
            if (binding.oldValue !== binding.value) {
                toggleLoading(el, binding);
            }
        },
        //指令所在组件的 VNode 及其子 VNode 全部更新后调用
        componentUpdated() {
            //console.log("渲染完成了");
        },
        //只调用一次，指令与元素解绑时调用
        unbind(el) {
            //console.log("解绑了");
            //不知道指令如何解绑，先写着
            el.mask && el.mask.parentNode && el.mask.parentNode.removeChild(el.mask);
            el.instance && el.instance.$destroy();
        }
    }
}