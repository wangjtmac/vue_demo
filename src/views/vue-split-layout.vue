<template>
    <div class="vue-split-layout">
<!--        <Layout :resize="true" :edit="true" :splits="tree">
            <div class="view1"></div> &lt;!&ndash; 0 - view &ndash;&gt;
            <Pane title="pane">content</Pane> &lt;!&ndash; 1 - view &ndash;&gt;
            <div class="view1"></div> &lt;!&ndash; 2 - view &ndash;&gt;
        </Layout>-->
<!--        <vue-document-editor :content.sync="content" />-->
        <el-button @click="add">新增</el-button>
        <el-form>
            <common-table
                    :data="data"
                    :columns="columns"
            >
                <template v-for="(item , inx) in columns" :slot="item.prop" slot-scope="{row , $index}" >
                    <el-form-item :prop="item.prop">
                        <el-input :key="inx" v-model="row[item.prop]"></el-input>
                    </el-form-item>

                </template>
            </common-table>
        </el-form>

    </div>
</template>

<script>
import {Layout,Pane} from '@/assets/vue-split-layout'
import CommonTable from "@/components/common/CommonTable";
// import VueDocumentEditor from "vue-document-editor"
export default {
    name: "vue-split-layout",
    components: {
        CommonTable, Layout , Pane ,
        // VueDocumentEditor
    },
    computed: {
        /*containH() {
            const vm = this, {height} = vm;
            let type = Object.prototype.toString.call(height);
            if (type === "[object String]") {
                return {'flex-basis': height};
            } else {
                return {'flex-basis': height + 'px'};
            }
        }*/
    },
    data () {
        return {
            tree: {
                dir: 'horizontal', // Left | Right
                // Other split
                first: {
                    dir: 'vertical',
                    first: 0,    // these numbers represents the views slot ID
                    second: 2
                },
                second: 1
            },
            content: ["<h1>Default Content</h1>"] ,
            data : [],
            columns : [
                {
                    prop : "testa",
                    label : "testa",
                },{
                    prop : "testb",
                    label : "testb",
                },
            ],
        }
    },
    methods : {
        add(){
            this.data.push({
                testa : "" ,
                testb : "" ,
            })
        }
    }
}
</script>

<style scoped>
    .vue-split-layout {
        height: 100%;
    }
    .view1 {
        /*background:lightcyan;*/
        height: 100%;
    }
</style>
