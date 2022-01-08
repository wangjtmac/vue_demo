<template>
    <div class="Item" @click.prevent>
        <div class="header">{{title}}</div>
        <div class="content"></div>
    </div>
</template>

<script>
export default {
    name: "Item",
    props : {
        title : String
    }
}
</script>

<style scoped>
.Item {
    position: relative;
    z-index: 0;
    height: 100%;
    /*background: #fff;*/
    pointer-events: none;
}

.header {
    height: 40px;
    padding: 10px;
    box-sizing: border-box;
    background: lightcyan;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.content {
    pointer-events: initial;
    height: calc(100% - 40px);
}
</style>
