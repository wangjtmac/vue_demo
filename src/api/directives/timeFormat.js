import * as Time from '@/api/time'
export default {
    timeFormat : {
        bind(el , bingding , vnode){
            el.innerHTML = Time.time.formatTimeToStr(bingding.value , bingding.arg);
            el.__timeout__ = setInterval(function () {
                el.innerHTML = Time.time.formatTimeToStr(bingding.value , bingding.arg);
            },1)
        },
        unbind(el ){
            clearInterval(el.__timeout__);
            delete el.__timeout__;
        }
    }
}