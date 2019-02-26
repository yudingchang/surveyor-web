<template>
  <div class="SuccessfulSingle">
      <i class="iconfont icon-Fill4"></i>
      <p class="text1">恭喜您！抢单成功</p>
      <a class="btn1" @click="continueOrder">继续抢单</a>
      <a class="btn2" @click="continueOrder">返回首页</a>
      <!-- {{orderInformation}} -->
      <table class="gridtable" border>
          <tbody>
               <tr>
                  <td class="greenTd">订单号</td>
                  <td colspan="3">{{orderInformation.order.number}}</td>
                </tr>
                <tr>
                  <td class="greenTd">测库联系人</td>
                  <td colspan="3">{{orderInformation.admin.nickname}} <span v-if="orderInformation.admin.mobile_phone">({{orderInformation.admin.mobile_phone}})</span></td>
                </tr>
                <tr>
                  <td class="greenTd">测库订单号</td>
                  <td colspan="3">{{orderInformation.number}}</td>
                </tr>
                <tr>
                  <td class="greenTd">验货开始日期</td>
                  <td colspan="3">{{orderInformation.inspection_first_date}}</td>
                </tr>
                <tr>
                  <td class="greenTd">价格</td>
                  <td>¥{{ Number(orderInformation.commission) + Number(orderInformation.other_fee) }}</td>
                  <span v-if="orderInformation.other_fee!='0.00'">
                    
                    <td colspan="3"><span>(含其他费用</span>
                    <span
                        v-for="(item,index) in orderInformation.other_fee_detail"
                        :key="index"
                    >{{ item.name }} : ¥{{ item.fee }}</span>
                    <span>)</span></td>
                  </span>
                </tr>
                <tr>
                  <td class="greenTd">工作量</td>
                  <td colspan="3">{{Number(orderInformation.workload)}}天</td>
                </tr>
                <tr>
                  <td class="greenTd">总工作量</td>
                  <td colspan="3">{{Number(orderInformation.order.workload)}}人天</td>
                </tr>
                <tr>
                  <td class="greenTd">报告语言</td>
                  <td colspan="3">
                      <span v-if="cn_num>0">简体中文</span>
                      <span v-if="cn_num>0 && en_num>0">，</span>
                      <span v-if="en_num>0">英文</span>
                  </td>
                </tr>
                <tr>
                  <td class="greenTd">验货地址</td>
                  <td colspan="3">{{orderInformation.inspection_address.address_detail}}</td>
                </tr>       
          </tbody>
      </table>

  </div>
</template>

<script>
export default {
  name: '',
  data(){
      return {
          orderInformation:this.$route.query.orderInformation,
      }
  },
  components: {  },
  computed: {
      cn_num: function (){
          return this.orderInformation.reports.filter(
            t => t.locale_name == '简体中文'
          ).length
      },
      en_num: function (){
          return this.orderInformation.reports.filter(
            t => t.locale_name == '英文'
          ).length
      }

  },
  methods:{
    // 继续下单
    continueOrder(){
      this.$router.push({
        path: 'dashboard'
      })
    }
  },
  mounted(){
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.SuccessfulSingle {
    width: 600px;
    margin: 0 auto;
    i{
        font-size:100px;
        color:#67C23A;
        width: 100px;
        display: block;
        margin: 0 auto;
    }
    .text1{
        font-size: 16px;
        color:#50688C;
        text-align: center;
    }
    .btn1{
        display: block;
        width: 160px;
        margin: 16px auto;
        height: 36px;
        background:#FFA800;
        border-radius:4px;
        color:#FFFFFF;
        line-height: 36px;
        text-align: center;
    }
    .btn2{
        display: block;
        width: 160px;
        margin: 16px auto;
        height: 36px;
        border:1px solid #909399;
        background:#ffffff;
        border-radius:4px;
        color:#909399;
        line-height: 36px;
        text-align: center;
    }
    .gridtable {
        border-collapse: collapse;
        width: 100%;
        margin: 15px auto 33px;
        thead > tr {
            height: 45px;
            line-height: 45px;
        }
        th,
        td {
        border: 1px solid #dfe6ec;
        font-size: 14px;
        font-weight: normal;
        text-align: center;
        }
        .w {
        width: 120px;
        }
        tbody > tr {
        height: 45px;
        line-height: 45px;
        td {
            padding: 0 10px;
            color: #50688c;
        }
        .greenTd {
            background: #7dc855;
            color: #ffffff;
            width: 150px;
        }
        }
    }

}
</style>

