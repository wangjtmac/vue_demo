/**
 * 输入限制
 * onkeypress 事件会在键盘按键被按下并释放一个键时发生可在事件触发时检测若输入的值不匹配，直接返回 fales
 * 但复杂规则不能使用，会导致输入不流畅
 *  限制空格 默认
 *  仅输入数字 number
 *  仅 字母数字下划线 letter
 *  custom 自定义  :ce-custom-reg="reg" 自定义模式，输入自定义的正则
 *
 * */


/**
 * 通过标签 ，获取dom
 * @param parent
 * @param type
 * @returns {*}
 */
let findEle = (parent, type) => {
    return parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type)
};

function Limit( reg ,hasPressEvt  ,  nonReg ) {
    return (el , customReg) => {
        if(hasPressEvt){
            el.onkeypress = (event) => {
                return (nonReg.test(String.fromCharCode(event.keyCode || event.which)));
            };
        }
        el.oninput = () => {
            let $inp = findEle(el, 'input') , val = $inp.value , ruleReg = customReg || reg || /\s/g;
            $inp.value = val.replace(ruleReg , '');
        };
    }
}

/**
 * 限制空格
 */
const emptyLimit = Limit(/\s/g , true ,  /[\S]/ );

/**
 * 仅数字
 */
const numberLimit = Limit(/\D/ig ,true ,   /[\d]/ );

/**
 * 字母数字下划线
 */
const letterLimit = Limit( /\W/g  , true ,/[\w]/ );
/**
 * 自定义
 * /^[^A-Za-z_]|[^A-Za-z_0-9]+/ 字母，数字，下划线 ，不以数字开头
 */
const customLimit = Limit();

/**
 * 限制 特殊字符，
 * @param el
 */
let regEmoji = /[^a-z0-9A-Z\u4e00-\u9fa5()（）\\-]+/g;
const emojiSpecialLimit = Limit(regEmoji);

export default {
    inputLimit : {
        bind: function (el, binding, vnode) {
            let customReg = vnode.data.attrs["ce-custom-reg"];
            switch (binding.arg) {
                case 'number':
                    numberLimit(el);
                    break;
                case 'noSpecial':
                    emojiSpecialLimit(el);
                    break;
                case 'letter' :
                    letterLimit(el);
                    break;
                case 'custom' :
                    customLimit(el , customReg);
                    break;
                case "" :
                    emptyLimit(el);
                    break;
                default:
                    break;
            }
        },
        unbind: function (el) {
            delete el.onkeypress;
            delete el.oninput;
        },
    }
}