<template>
  <div>
    <span>{{ msg }}</span>
  </div>
</template>

<script>
import {welcome} from "@/apis/welcome.js"
import {axios} from "@/utils/request";
import {hello} from "@/apis/apis.js"

export default {
  name: "welcome",
  data() {
    return {
      msg: "",
    }
  },
  methods: {
    hello() {
      const response =welcome(null)
      response.then(res => {
        this.msg = res.result
      }).catch(err => {

      })
      // this.msg = res.data.result
    }
  },
  created() {
    this.hello()
  }

}
</script>

<style scoped>

</style>