import Vue from 'vue'
export const bus = new Vue({
        data () {
        return {
                dataList: {}
    }
  },
  created () {
        this.$on('lookDetail', data => {
        this.dataList = data
    })
  }
});