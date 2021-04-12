<template>
  <div style="width: 100%;height: 85vh;">
    <video ref="video" style="width: 100%;height: 100%;" controls="" loop autoplay="" name="media" :src="url" />
  </div>
</template>

<script>
export default {
  name: 'Video',
  data () {
    return {
      url: ''
    }
  },
  mounted () {
    this.url = 'http://mw-striver.cn:9000/moves/The%20Nights-Avicii-HD.mp4'
    this.$refs.video.src = this.url
  }
}
</script>

<style scoped></style>
