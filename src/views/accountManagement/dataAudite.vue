<template>
  <div v-loading="loading" class="dataAudite">
    <div class="step clearfix">
        <img src="/static/image/vertical_success.png" alt="" class="fl">
        <div class="fl stepContent">
            <p class="greenColor">资料提交</p>
            <p class="greenColor">2018-05-16 9:00</p>
            <p class="greenColor">您的专业资料已提交，等待测库工作人员审核</p>
            <p class="greenColor">2018-05-16 9:00</p>
            <p class="greenColor">审核通过</p>
            <p class="greenColor">2018-05-16 9:00</p>
            <a @click="searchData()">查看资料</a>
        </div>
    </div>
    <!-- <div class="step clearfix">
        <img src="/static/image/vertical_fail.png" alt="" class="fl">
        <div class="fl stepContent">
            <p class="greenColor">资料提交</p>
            <p class="greenColor">2018-05-16 9:00</p>
            <p class="greenColor">您的专业资料已提交，等待测库工作人员审核</p>
            <p class="greenColor">2018-05-16 9:00</p>
            <p class="redColor">审核未通过</p>
            <p class="redColor">2018-05-16 9:00</p>
            <p>审核未通过原因审核未通过原因审核未通过原因</p>
            <a  @click="searchData()">修改资料</a>
        </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'ReportPartA',
  components: {
  },
  props: {
  },
  data() {
    return {
      loading: false,
      data: {},
      partAShow: true
    }
  },
  methods: {
    searchData() {
     this.$router.push({
         path:'professiondData'
     })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang='scss' scoped>
  .dataAudite{
      margin: 50px 0 0 80px;
      .step{
          position: relative;
          .stepContent{
              margin-left: 16px;
              .greenColor{
                  font-size:18px;
                  color:#FFA800;
              }
              .redColor{
                  font-size:18px;
                  color:#E65C5C;
              }
              p:nth-child(2){
                  margin:10px 0 70px 0;
              }
              p:nth-child(3){
                  margin-bottom: 10px;
              }
               p:nth-child(4){
                  margin-bottom: 75px;
              }
              p:nth-child(5){
                  margin-bottom: 10px;
              }
              p:nth-child(7){
                  font-size: 18px;
                  color:#164061;
                  margin-top: 10px;
              }
              a{
                  display: block;
                  width: 160px;
                  text-align: center;
                  color:#ffffff;
                  height: 40px;
                  line-height:40px;
                  background:#FFA800;
                  border-radius:4px;
                  margin-top:24px;
              }
          }
      }
  }
</style>
