/**
 * 防抖动事件
 * 提交保存按钮有时候会在短时间内被点击多次，这样就会多次重复请求后端接口，造成数据的混乱，比如新增表单的提交按钮，多次点击就会新增多条重复的数据
 * */

export default {
    debounce : {
        inserted (el, binding) {
            if (typeof binding.value !== 'function') {
                throw 'callback must be a function'
            }
            let timer;
            function countDoTime(){
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    binding.value()
                }, 1000)
            }
            el.__countDoTime__ = countDoTime;
            el.addEventListener('click', countDoTime)
        },
        unbind(el){
            el.removeEventListener("click" , el.__countDoTime__);
            delete el.__countDoTime__;
        }
    }
}
