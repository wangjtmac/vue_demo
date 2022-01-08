<template>
    <div
            :class="fullscreen ? 'ce-Mask-FullScreen' : 'ce-Mask'"
            :style="{
                  zIndex: zIndex,
                  background: 'rgba(' + background + ')',
                  fontSize: fontSize + 'px',
                  color: color
                }">
        <div class="ce-icon_m" :class="iconClass || defaultIcon"></div>
        <span>{{ text }}</span>
    </div>
</template>

<script>
    export default {
        name: "CeLoading",
        data() {
            return {
                fullscreen: false,
                background: "255, 255, 255, 0.9",
                text: "",
                color: "#555",
                fontSize: null,
                zIndex: 1000,
                iconClass: '',
                defaultIcon: "df-loading-icon",
            };
        },
        mounted() {
            if (this.fullscreen) {
                document.body.style.overflow = "hidden";
            }
        },
        destroyed() {
            document.body.style.overflowX = "hidden";
        },
    };
</script>

<style lang="less" scoped>
    .ce-loading-icon {
        width: 60px;
        height: 60px;
        background-color: #409eff;
        margin: 10px auto;
        border-radius: 4px;
        animation: rotateplane 1.5s infinite ease-in-out;
    }
    @keyframes rotateplane {
        0% {
            transform: perspective(120px) rotateX(0deg) rotateY(0deg);
        }
        50% {
            transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
        }
        100% {
            transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
        }
    }
    .ce-icon_m {
        margin-bottom: 10px;
    }
    .ce-Mask {
        position: absolute;
        z-index: 2000;
        background: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        flex-flow: column;
    }

    .ce-Mask-FullScreen {
        &:extend(.ce-Mask);
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
    }

    .df-loading-icon {
        width: 25px;
        height: 25px;
        background-color: #409eff;
        margin-bottom: 5px;
        animation: ce-rotate 2s linear infinite;
    }

    @keyframes ce-rotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

</style>
<style scoped lang="less" src="./loading.less"></style>