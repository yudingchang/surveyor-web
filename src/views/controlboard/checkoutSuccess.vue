<template>
  <div class="checkoutSuccess">
      <p class="t1"><span>您的订单提交成功等待报价</span><a href="javascript:;">查看订单详情</a> </p>
      <div class="checkoutSuccess-content">
          <div>
              <img src="/static/image/success.png" alt="">
          </div>
          <p>倒计时 <span>23：59：50</span></p>
          <p>测库的工作人员将在24小时内给您报价，请耐心等待</p>
      </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {  },
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    // key() {
    //   return this.$route.fullPath
    // }
  },
  mounted(){
    // console.log(this.$route.fullPath) 
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.checkoutSuccess {
    margin: 60px 0 0 60px;
      .t1{
        font-size: 16px;
        color: #50688C; 
        a{
            color: #FFA800;
            text-decoration: underline;
            margin-left: 20px;
        }
    }
    .checkoutSuccess-content{
        width: 940px;
        margin: 0 auto;
        background-color: #50688C;
    }
}
</style>

