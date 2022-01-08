<!--
    步骤条
-->
<template>
    <div class="steps" :class="{'steps_center' : alignCenter}">
        <div v-for="(step , i) in data"
             :key="i"
             @mousedown="(e)=>{
                 debugger
             }"
             @click="stepClick(step ,i )"
             :style="i + 1 !== data.length ? flexSpace : {'flex-basis':'auto'}"
             :class="['steps__item',{'is-active' : curValue === i}]">
            <span class="el-icon-circle-check steps__check" v-if="curValue > i"></span>
            <span class="steps__number" v-else>{{i+1}}</span>
            <span class="steps__text">{{step.label}}</span>
        </div>
    </div>
</template>

<script>
function keepTwoDecimal(num) {
    let result = parseFloat(num);
    if (isNaN(result)) {
        console.log('传递参数错误，请检查！');
        return false;
    }
    result = Math.round(num * 100) / 100;
    return result;
}

export default {
    name: "CeStep",
    props: {
        value: {
            type: Number,
            default: 0
        },
        data: {
            type: Array,
            default: () => []
        },
        alignCenter : {
            type : Boolean ,
            default : false
        },
        space : {
            type : [String , Number],
            default : ""
        }
    },
    computed: {
        curValue: {
            get(val) {
                return this.value;
            },
            set(val) {
                this.$emit('update:value', val)
            }
        },
        flexSpace(){
            const vm= this , {space , data} = vm;
            let basis = space ? space : keepTwoDecimal(1 / (data.length -1) * 100 ) +  '%';
            let type = Object.prototype.toString.call(basis);
            if(type === "[object String]") {
                return {'flex-basis' : basis};
            }else {
                return {'flex-basis' : basis + 'px'};
            }
        }
    },
    data() {
        return {}
    },
    methods : {
        stepClick(step , i){
            let res = step.clickFn(step , i);
            if(res)  this.curValue = i;
        }
    }
}
</script>

<style scoped lang="less">

.steps {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    line-height: 30px;
    &_center {
        justify-content: center;
    }
    &__item {
        display: flex;
        flex-shrink: 1;
        align-items: center;
        white-space: nowrap;
        position: relative;
        &.is-active {
            .steps__number {
                color: #fff;
                background-color: #1890ff;
                border-color: #1890ff;
            }

            .steps__text {
                color: rgba(0, 0, 0, 0.85);
                font-weight: bold;
            }
        }

        &:not(:last-child) {
            &::before {
                content: "";
                position: absolute;
                display: inline-block;
                left: 0;
                width: calc(100% - 16px);
                height: 1px;
                background-color: rgba(0, 0, 0, 0.15);
                z-index: -1;
            }
        }
        &:last-child {
            flex-shrink: 0;
            flex-grow: 0;
        }
    }

    &__number {
        min-width: 30px;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.15);
        font-size: 16px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.25);
        background: #fff;
        cursor: pointer;
    }

    &__text {
        white-space: nowrap;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        padding:0 10px 0 14px;
        cursor: pointer;
        background: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__check {
        min-width: 30px;
        font-size: 32px;
        line-height: 32px;
        color: #1890ff;
        cursor: pointer;
        background: #fff;
    }

}
</style>
