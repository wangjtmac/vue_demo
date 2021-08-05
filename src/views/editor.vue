<template>
    <div class="editor">
       <code-editor v-model="code" language="x-sql"></code-editor>
    </div>
</template>

<script>
import CodeEditor from "./codeEditor"
export default {
    name: "editor",
    components : {CodeEditor} ,
    data () {
        return  {
            code : ""
        }
    },

}
</script>

<style scoped>

</style>
