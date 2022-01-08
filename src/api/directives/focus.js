export default {
    focus : {
        bind( el , binding , vnode ){
            let keys = [];
            for(let i in vnode){
                keys.push(i)
            }
            el.innerHTML =
                'name :' + binding.name + '<br>' +
                'value :' + binding.value + '<br>' +
                'expression :' + binding.expression + '<br>' +
                'argument :' + binding.arg + '<br>' +
                'modifiers : ' + JSON.stringify(binding.modifiers) + '<br>' +
                "vnode keys :" + keys.join(', ')

        },
        inserted(el , binding , vnode  ){
            el.focus();
        },

    }
}
