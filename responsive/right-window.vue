<template>
  <view>
    <pages-detail-index ref="detailPage"></pages-detail-index>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        title: 'Hello'
      }
    },
    created(e) {
      uni.$on('updateDetail', (e) => {
        this.$refs.detailPage.load(e.detail);
      })
    },
    onLoad() {},
    methods: {}
  }
</script>

<style>
</style>
