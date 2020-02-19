<template>
  <div class="home">
    <!--<input type="text" v-focus>-->
    <div v-focus:msg.a.b.enter="message"></div>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'Home',
  data(){
    return {
      message : 'some msg'
    }
  },
  components: {

  }
}
</script>
