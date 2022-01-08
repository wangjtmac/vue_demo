/**
 * 输入限制
 * onkeypress 事件会在键盘按键被按下并释放一个键时发生可在事件触发时检测若输入的值不匹配，直接返回 fales
 * 但复杂规则不能使用，会导致输入不流畅
 *  限制空格 v-input-limit:trim
 *  仅输入数字 v-input-limit:number
 *  仅 字母数字下划线 v-input-limit:letter
 *  v-input-limit:custom 自定义  :ce-custom-reg="reg" 自定义模式，输入自定义的正则
 *
 * */
import {Message} from "element-ui";

/**
 * 通过标签 ，获取dom
 * @param parent
 * @param type
 * @returns {*}
 */
let findEle = (parent, type) => {
    return parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type)
};
//输入法输入状态
let doing = false;

function clearStr($inp, reg , vnode , message) {
    let val = $inp.value, ruleReg = reg || /\s/g;
    if (val === undefined) return;
    let res = val;
    val = val.replace(ruleReg, '');
    if(res !== val && message) Msg(message);
    vnode.data.model.callback(val);//修改绑定参数
}

function Msg(msg , type='warning'){
    Message.closeAll();
    Message[type](msg);
}

/**
 * 限制规则的输入
 * @param reg
 * @param hasPressEvt
 * @param nonReg
 * @param message
 * @return {function(*=): void}
 * @constructor
 */
function Limit({reg, hasPressEvt, nonReg , message}) {
    return (el , vnode) => {
        if (hasPressEvt) {
            el.onkeypress = (event) => {
                let result = (nonReg.test(String.fromCharCode(event.keyCode || event.which)));
                if(!result && message) Msg(message);
                return result;
            };
        }
        let $inp = findEle(el, 'input');
        el.rule = reg;
        el.inputStart = () => {
            doing = true;
        };
        el.inputTxt = () => {
            if (!doing) {
                clearStr($inp, el.rule , vnode , message);
            }
        }
        el.inputEnd = () => {
            clearStr($inp, el.rule , vnode , message);
            doing = false;
        }
        $inp.addEventListener('compositionstart', el.inputStart, false);
        $inp.addEventListener("input", el.inputTxt, false)
        $inp.addEventListener('compositionend', el.inputEnd, false);
    }
}

let InputStrategy = function (){
    let strategy = {
        trim : function (){ //限制空格
            return {reg : /\s/g , hasPressEvt : true, nonReg : /[\S]/};
        },
        number : function (){ //允许数字
            return {reg : /\D/ig , hasPressEvt : true,message : '仅允许输入数字' ,  nonReg : /[\d]/};
        },
        noSpecial : function (){//限制 特殊字符，
            return {reg : /[\]@/'\\"$%&^*{}<>[:;]+/g , message : '限制输入特殊字符及空格' };
        },
        letter : function (){ // 允许 字母数字下划线
            return {reg :/\W/g , hasPressEvt : true,message : '仅允许输入字母、数字、下划线' , nonReg : /[\w]/};
        },
        custom : function (arg){ //自定义
            return {...arg};
        },
        fieldCode : function (){ //字段名code 允许字母数字下划线 非数字开头
            return {reg : /^[^a-zA-Z_][^a-zA-Z0-9_]*|[^a-zA-Z0-9_]$|[^a-zA-Z0-9_]*/g , message : '仅允许输入字母数字下划线,非数字开头' , hasPressEvt : true, nonReg : /[A-Za-z_0-9]/};
        },
        fieldName : function (){ //字段中文名 允许字母数字中文下划线
            return {reg : /[^a-z0-9A-Z_\-\u4e00-\u9fa5]+/g,message : '仅允许输入字母、数字、中文、下划线、横杆' ,  hasPressEvt : true, nonReg : /[a-z0-9A-Z_\-\u4e00-\u9fa5]/};
        },
        fieldChineseCode : function (){//字段名code 允许字母数字中文下划线横杆 非数字开头
            return {reg : /^[^a-zA-Z_\-\u4e00-\u9fa5][^a-zA-Z0-9_]*|[^a-zA-Z0-9_\-\u4e00-\u9fa5]$|[^a-zA-Z0-9_\-\u4e00-\u9fa5]*/g ,message : '仅允许输入字母、数字、中文、下划线、横杆 非数字开头' ,  hasPressEvt : true, nonReg : /[A-Za-z_0-9\-\u4e00-\u9fa5]/};
        },
        chartCode : function (){ //新建表名 允许小写字母数字下划线 非数字开头
            return {reg : /^[^a-z_][^a-z0-9_.]*|[^a-z0-9_.]$|[^a-z0-9_.]*/g , hasPressEvt : true,  message : '仅允许输入允许小写字母、数字、下划线,非数字开头' , nonReg : /[a-z_.0-9]/};
        },
        decimal : function (){ //小数
            return {reg : /[^0-9.]/g , hasPressEvt : true, message : '仅允许输入整数或小数' , nonReg : /[0-9.]/}
        },
        fieldValue : function (){ //字段值
            return {reg : /[^a-z0-9A-Z_.\-\u4e00-\u9fa5]+/g, hasPressEvt : true,message : '仅允许输入字母、中文、数字、点、下划线、横杆' ,  nonReg : /[a-z0-9A-Z_.\-\u4e00-\u9fa5]/};
        }
    };
    return function (type , arg){
        let params = strategy[type] && strategy[type](arg);
        return Limit(params);
    }
}();


export default {
    inputLimit: {
        bind: function (el, binding, vnode) {
            let reg = vnode.data.attrs["ce-custom-reg"],
                message = vnode.data.attrs['ce-custom-msg'];
            let limit = InputStrategy(binding.arg , {reg ,message});
            limit(el , vnode);
        },
        unbind: function (el) {
            delete el.onkeypress;
            let $inp = findEle(el, 'input');
            if ($inp) {
                $inp.removeEventListener('compositionstart', el.inputStart, false);
                $inp.removeEventListener("input", el.inputTxt, false)
                $inp.removeEventListener('compositionend', el.inputEnd, false);
            }
            delete el.inputStart;
            delete el.inputTxt;
            delete el.inputEnd;
        },
    }
}
