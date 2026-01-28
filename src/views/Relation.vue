<template>
  <div class="Relation">
    <div class="content">
      <graph ref="relation" />
    </div>
  </div>
</template>

<script>
import Graph from "@/components/graph";

import { data } from "./relation";

export default {
  name: 'Relation',
  components: {
    Graph
  },
  mounted() {
    this.$refs.relation.reloadData(data ,{

    });
  }
};
</script>

<style scoped>
.content {
    height: 400px;
    width: 1200px;
    margin:20px auto;
    border:1px solid #ddd;
}
</style>
