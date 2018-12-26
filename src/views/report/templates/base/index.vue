<template>
  <div class="tc-report">
    <tc-report-part-a ref="quantity_conformity" :configs="configs" @save="handleSave"/>
    <tc-report-part-b ref="packing_and_marking" :configs="configs" @save="handleSave"/>
    <tc-report-part-c ref="product_conformity" :configs="configs" @save="handleSave"/>
    <tc-report-part-d ref="data_measurement" :checkitems="data.checkitems" :configs="configs" @save="handleSave"/>
    <tc-report-part-e ref="visual_and_workmanship" :sampling="data.sampling" :configs="configs" @save="handleSave"/>
    <tc-report-part-f ref="special_attention" :configs="configs" @save="handleSave"/>
    <tc-report-part-g ref="appendix" :configs="configs" :sampling-information="_.get(data, 'order.sampling_information')" @save="handleSave"/>
    <tc-report-part-h ref="general_information" :order="data" :configs="configs" @save="handleSave"/>
    <tc-report-part-i ref="inspection_results" :order="data" :configs="configs" @save="handleSave"/>
    <el-form style="margin:60px auto 100px">
      <el-form-item label-width="0" style="text-align: center;">
        <el-button style="border:1px solid rgba(144,147,153,1);width:140px;color:#909399;" @click="back()">返回</el-button>
        <el-button style="background:#67C23A;width:140px;color:#ffffff;outline:none;border:none">预览报告</el-button>
        <el-button style="background:#FFA800;width:140px;color:#ffffff;outline:none;border:none" @click="reportsubmit()">提交报告</el-button>
      </el-form-item>
    </el-form>
    <!-- <tc-report-part-j :configs="configs" @save="handleSave"/> -->
  </div>
</template>

<script>
import UploadImage from '@/views/report/components/UploadImage'
import ReportRartA from './components/partA'
import ReportRartB from './components/partB'
import ReportRartC from './components/partC'
import ReportRartD from './components/partD'
import ReportRartE from './components/partE'
import ReportRartF from './components/partF'
import ReportRartG from './components/partG'
import ReportRartH from './components/partH'
import ReportRartI from './components/partI'
import ReportRartJ from './components/partJ'

import { fetchConfig, fetchReport, update, reportsubmit } from './api/report'

export default {
  name: 'Report',
  components: {
    'tc-upload-image': UploadImage,
    'tc-report-part-a': ReportRartA,
    'tc-report-part-b': ReportRartB,
    'tc-report-part-c': ReportRartC,
    'tc-report-part-d': ReportRartD,
    'tc-report-part-e': ReportRartE,
    'tc-report-part-f': ReportRartF,
    'tc-report-part-g': ReportRartG,
    'tc-report-part-h': ReportRartH,
    'tc-report-part-i': ReportRartI,
    'tc-report-part-j': ReportRartJ
  },
  data() {
    return {
      configs: { packageOptions: {}},
      loading: false,
      data: {
        reviews: {}
      }
    }
  },
  created() {
    this.id = this.$route.query.id
    this.$nextTick(() => {
      this.getData()
    })
  },
  methods: {
    getData() {
      fetchConfig(this.id).then(response => {
        this.configs = response.data.data

        // 报告详情
        fetchReport(this.id).then(response => {
          this.data = response.data.data
          this.configs.products = response.data.data.products

          this.$nextTick(() => {
            this.$refs.quantity_conformity.setData(this.data.review.quantity_conformity)
            this.$refs.packing_and_marking.setData(this.data.review.packing_and_marking)
            this.$refs.product_conformity.setData(this.data.review.product_conformity) // 商品复合性
            this.$refs.data_measurement.setData(this.data.review.data_measurement) // 数据测量
            this.$refs.visual_and_workmanship.setData(this.data.review.visual_and_workmanship) // 外观及工艺
            this.$refs.special_attention.setData(this.data.review.special_attention) // 客户特殊要求
            this.$refs.appendix.setData(this.data.review.appendix) // 附录
            this.$refs.general_information.setData(this.data.review.general_information) // 基本信息
            this.$refs.inspection_results.setData(this.data.review.inspection_results, this.data) // 基本信息
          })
        })
      })
    },
    handleSave(data, name) {
      const params = {}
      params[name] = data
      console.log(this.data)
      const loading = this.$loading({
        lock: true
      })
      update(this.id, params).then(response => {
        this.data[name] = data
        loading.close()
      })
    },
    reportsubmit() {
      reportsubmit(this.id, this.configs).then(res => {
        if (res.data.code == 0) {

        }
      })
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang='scss'>
  %background-1 {
    background-color: #7F8FA4;
    color: #FFF;
  }
  $color-1: #FFA800;

  .background-gray {
    @extend %background-1
  }
  .tc-report {
    margin: 25px 40px 0;
    color: rgba(80,104,140,1);
    .tc-input-number .el-input__inner {
      padding-left: 0;
      width: 100% !important;
    }
    .tc-input-number-pd .el-input__inner{
      padding: 0 15px;
      width: 100% !important;
    }
    .tc-input-number-ld .el-input__inner{
      padding: 0 15px;
      text-align:left;
      width: 100% !important;
    }
    .el-radio+.el-radio {
        margin-left: 30px;
    }
    .tc-remove {
      float: right;
      color: #F56C6C;
      margin-right: 40px;
      font-size: 22px;
      line-height: 38px;
      cursor: pointer;
    }
    .el-textarea__inner, .el-input__inner {
      background-color: #F5F8FA;
    }
    .el-form-item__label {
      span {
        display: inline-block;
        margin-right: .5rem;
        &::after {
          content: '.',
        }
      }
    }
    .tc-table {
      border: 1px solid #D7DCE3;
      th {
        border-color: #D7DCE3;
        background-color: #7F8FA4;
        color: #FFF;
        font-weight: normal;
      }
      td, th {
        border: 1px solid #D7DCE3;
        padding: 0 10px;
        text-align: center;
        .el-form-item {
          margin: 20px 0;
        }
      }
      .el-form-item__label {
        margin-bottom: 0;
      }
      .el-form-item__content {
        margin-left: 10px !important;
        margin-right: 20px !important;
      }
      .el-input__inner {
        text-align: left !important;
      }
    }
    .tc-writable-table {
      border-color: #D7DCE3;
      .el-table__header {
        th {
          padding: 0;
          @extend %background-1;
          border-color: #D7DCE3;
          font-weight: normal;
        }
      }
      .tc-input-number {
        .el-input__inner {
          text-align: center !important;
        }
      }
      .tc-form-item {
        margin: 0 !important;
      }
      .is-error {
        .el-input__inner {
          background-color: rgba(245,108,108,.7);
        }
      }
      .el-select__tags-text {
        color: rgb(96, 98, 102);
      }
      .el-table__body {
        tr {
          border-color: #D7DCE3;
        }
        td {
          padding: 0;
          // border-color: #D7DCE3 !important;
          .cell {
            padding: 0;
            .el-input__inner {
              border-width: 0;
              border-radius: 0;
            }
          }
        }
      }
    }
    .tc-report-card {
      margin-bottom: 25px;
      background-color: #fff;
      box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
      border-radius: 3px;
      padding: 20px 30px;

      .tc-report-card-title {
        font-size: 16px;
        padding: 8px 5px;
        border-bottom: 2px solid $color-1;
        .titleText {
          font-size: 18px;
          font-weight: bold;
          padding-right: 6px;
        }
        i{
           transition: all 0.5s;
        }
        .rotaga {
        transform: rotate(180deg);
        -ms-transform: rotate(180deg); /* IE 9 */
        -moz-transform: rotate(180deg); /* Firefox */
        -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
        -o-transform: rotate(180deg); /* Opera */
        }

      }
      .titleChange {
        border-bottom: none;
        padding-bottom: 0;
      }
      .tc-report-card-content {
        padding-top: 30px;

        .tc-report-card-content-title {
          color: $color-1;
          margin-bottom: 25px;
        }
        .borderContent{
          width: 100%;
          border:1px solid rgba(194,194,194,1);
          border-radius:8px;
          padding: 25px;
        }
      }
    }
    .el-radio.is-checked {
      .el-radio__inner {
        background-color: $color-1;
        border-color: $color-1;
        box-shadow: 0 0 1px $color-1 !important;
      }
      .el-radio__label {
        color: inherit;
      }
    }
    .el-radio__inner {
      &:hover {
        border-color: $color-1;
      }
    }
    .tc-report-button {
      background-color: $color-1;
      color: #FFF;
      box-shadow: none !important;
      border:none;
      padding-left: 30px;
      padding-right: 30px;
      &:focus {
        outline: none;
      }
      &:active {
        border-color: $color-1;
      }
    }
    .is-focus .el-input__inner, .el-textarea__inner, .el-input__inner {
      &:focus {
        border-color: $color-1 !important;
      }
    }
    .tc-form-item .el-form-item {
       margin: 0 !important;
       .el-form-item__content {
         margin: 0 !important;
       }
    }
    .tc-form-item > .el-form-item{
      padding-bottom: 20px !important;
    }
  }
</style>

