<template>
  <div class="tc-report-card">
    <div class="tc-report-card-title">
      <span>J</span>确认团队
    </div>
    <div class="tc-report-card-content">
      <el-form ref="form" :model="data" label-width="130px">

        <el-form-item label-width="0" style="margin: 0 40px 32px 40px;">
          <table cellspacing="0" cellpadding="0" border="0" class="tc-table" style="width: 100%">
            <tbody>
              <tr>
                <td style="width: 270px;" class="background-gray">检验员/检验日期</td>
                <td>CK1023569</td>
                <td style="width: 270px;">2018-08-17</td>
              </tr>
              <tr>
                <td class="background-gray">审核员/审核日期</td>
                <td>审核人的电子签名</td>
                <td>2018-08-17</td>
              </tr>
              <tr>
                <td class="background-gray">审批人/审批日期</td>
                <td>CK1023569</td>
                <td>2018-08-17</td>
              </tr>
            </tbody>
          </table>
        </el-form-item>

        <el-form-item label-width="0" style="text-align: center;">
          <el-button class="tc-report-button">上一步</el-button>
          <el-button class="tc-report-button">预览报告</el-button>
          <el-button class="tc-report-button">修改后通过</el-button>
          <el-button class="tc-report-button">审核不通过</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import UploadImage from '@/views/report/components/UploadImage'

export default {
  name: 'ReportPartJ',
  components: {
    'tc-upload-image': UploadImage
  },
  props: {
    configs: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      data: {
        general_conclusion: '',
        remarks: [
          { remark: 'adasdsadas' }
        ]
      }
    }
  },
  methods: {
    handleUploadQuantityComplianceFile(file) {
    },
    handleRemoveQuantityComplianceFile(file) {
    }
  }
}
</script>
