<template>
  <div class="about">
    <div class="p10">
      <button class="loc-button" @click="addPost">添加</button>
      <button class="loc-button" @click="getPosts">获取</button>
      <div class="dib">
        <el-input size="mini" v-model="postId">
          <el-button slot="append" @click="getPostDetail">查询</el-button>
        </el-input>
      </div>
    </div>
    <common-table :data="tableData" :columns="tableHead">
      <template slot="operate" slot-scope="{ row, $index }">
        <span class="ce-icons" v-for="(item, index) in operates" :key="index">
          <el-button
            type="text"
            size="medium"
            @click="item.clickFn(row, $index)"
            :class="item.icon"
            circle
          ></el-button>
        </span>
      </template>
      <template slot="img" slot-scope="{ row }">
        <div v-if="row.img">
          <img
            v-for="(img, i) in row.img"
            :key="i"
            height="40"
            class="ml5"
            :src="img"
            alt=""
          />
        </div>
      </template>
    </common-table>

    <common-dialog
      custom-class="log"
      :width="width"
      :title="title"
      v-loading="loading"
      :visible.sync="visible"
    >
      <el-form size="mini" label-position="right" label-width="80px">
        <el-form-item v-for="(item, key) in formList" :key="key">
          <div v-if="item.label" slot="label">{{ item.label }} :</div>
          <el-input v-if="item.type === 'input'" v-model="form[key]"></el-input>
          <el-input
            v-if="item.type === 'input-number'"
            v-input-limit:number
            v-model.number="form[key]"
          ></el-input>
          <el-select
            class="width100"
            v-if="item.type === 'select'"
            v-model="form[key]"
          >
            <el-option
              v-for="opt in item.option"
              :key="opt.value"
              :value="opt.value"
              :label="opt.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submit">{{ submitTip }}</el-button>
      </span>
    </common-dialog>

    <div class="main" v-click-out="close">
      <button @click="show = !show">显示</button>
      <div class="dropdown" v-show="show">
        <p>下拉框的内容</p>
      </div>
    </div>
    <br />
    <div>时间转换指令</div>
    <p v-time-format:[format]="timeNow"></p>
    <p v-time-format="timeBefore"></p>
    <button class="loc-button" v-long-press="longpress">长按</button>
    <textarea name="" cols="30" rows="10" v-model="text"></textarea>
    <el-button size="mini" type="primary" v-copy="text">copy</el-button>
    <div class="ce-box" v-ce-loading:[loadingOption]="loading"></div>
    <button class="loc-button" @click="loading = !loading">切换loading</button>
    <button class="loc-button" v-debounce="doEnt">抖动</button>
  </div>
</template>
<script>
import CommonDialog from "@/components/common/CommonDialog";

export default {
  name: 'About',
  components: { CommonDialog },
  data() {
    const currencyOpt = [{ value: '$' }, { value: 'RMB' }]
    return {
      tableData: [],
      show: false,
      timeNow: new Date(),
      timeBefore: 1488930695721,
      format: 'yyyy/MM/dd hh:mm:ss',
      loading: true,
      loadingOption: {
        text: '拼命加载...',
        iconClass: 'loader_01'
      },
      text: '',
      operates: [
        {
          icon: 'el-icon-edit',
          clickFn: this.editPost
        },
        {
          icon: 'el-icon-delete',
          clickFn: this.deletePost
        }
      ],
      tableHead: [
        {
          type: 'index',
          label: 'inx'
        },
        {
          prop: 'id',
          label: 'id'
        },
        {
          prop: 'userId',
          label: '用户id',
          width: '60'
        },
        {
          prop: 'body',
          label: 'body'
        },
        {
          prop: 'title',
          label: 'title'
        },
        {
          prop: 'price',
          label: '价格'
        },
        {
          prop: 'currency',
          label: '货币单位'
        },
        {
          prop: 'img',
          label: '图片'
        },
        {
          prop: 'operate',
          label: '操作',
          width: '120'
        }
      ],
      width: '500px',
      title: '新增post',
      visible: false,
      formList: {
        userId: {
          label: '用户id',
          type: 'input'
        },
        body: {
          label: '正文',
          type: 'input'
        },
        title: {
          label: '标题',
          type: 'input'
        },
        price: {
          label: '价格',
          type: 'input-number'
        },
        currency: {
          label: '货币单位',
          type: 'select',
          option: currencyOpt
        }
      },

      form: {
        userId: '',
        body: '',
        title: '',
        price: '',
        currency: ''
      },
      submitTip: '提交',
      postId: '',
      editState: 'new' // new edit
    }
  },
  computed: {
    timeN() {
      return new Date()
    },
    service() {
      return this.$axios
    }
  },

  methods: {
    getPostDetail() {
      const vm = this,
        { postId, service } = vm
      service.get(`posts/${postId}`).then((res) => {
        if (res.data.status === 0) {
          vm.tableData = []
          vm.tableData.push(res.data.data)
        } else {
          vm.tableData = []
          vm.$message.warning(res.data.message || '暂无数据')
        }
      })
    },
    deletePost() {},
    submit() {
      const vm = this,
        { form, service, editState } = vm
      if (editState === 'new') {
        service.post('posts', form).then((res) => {
          if (res.status === 200) vm.$message.success('新增成功!')
        })
      } else {
      }
    },
    editPost(row, inx) {
      this.visible = true
      this.editState = 'edit'
      this.form = JSON.parse(JSON.stringify(row))
    },
    getPosts() {
      const vm = this,
        { $axios } = vm
      $axios.get('posts').then((res) => {
        vm.tableData = res.data
      })
    },
    addPost() {
      this.visible = true
      this.editState = 'new'
    },
    doEnt() {
      console.log('执行一次')
    },
    close() {
      this.show = false
    },
    getTime() {
      return new Date()
    },
    longpress() {
      this.$message.info('触发长按事件')
    },
    getData() {
      /*this.$axios.get("posts").then(res =>{
              console.log(res.data)
            })*/
      /*this.$http.get("posts").then(res =>{
              console.log(res.body)
            })*/
      /*fetch("http://jsonplaceholder.typicode.com/posts").then(res=>res.json()).then(res => {
              console.log(res)
            })*/
      /* this.postData('http://jsonplaceholder.typicode.com/posts' , {})
                .then(data => console.log(data)) // JSON from `response.json()` call
                .catch(error => console.error(error))
                 */
    },
    postData(url, data) {
      // Default options are marked with *
      return fetch(url, {
        body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
          'user-agent': 'Mozilla/4.0 MDN Example',
          'content-type': 'application/json'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer' // *client, no-referrer
      }).then((response) => response.json()) // parses response to JSON
    }
  },
  created() {
    // this.getData();
  }
}
</script>
<style scoped lang="less">
/deep/ .loading_icon {
  font-size: 30px;
  color: #409eff;
}

.main {
  width: 125px;
}

.loc-button {
  display: inline-block;
  margin: 6px;
  border: 0;
  padding: 6px;
  text-align: center;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  position: relative;
  &:not(.el-button--text) {
    background-color: #39f;
    color: #fff;
  }
}

button:active {
  top: 1px;
  left: 1px;
}
.el-button {
  position: relative;
}
.dropdown {
  width: 100%;
  height: 150px;
  margin: 5px 0;
  font-size: 12px;
  border-radius: 4px;
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.2);
}

.ce-box {
  height: 350px;
  background: skyblue;
}
</style>
