<template>
  <div v-loading="loading" class="tc-report-card" >
    <div :class="{titleChange:!partGShow}" class="tc-report-card-title clearfix">
      <span><span class="titleText">G</span>附录</span>
      <span class="right" style="float:right;color:#FFA800" @click="partGShow=!partGShow">
        <span v-if="partGShow">收起</span>
        <span v-if="!partGShow">展开</span>
        <i :class="{rotaga:!partGShow}" class="el-icon-caret-top"/>
      </span>
    </div>
    <div v-show="partGShow" class="tc-report-card-content">
      <el-form ref="form" :model="data" label-width="130px">
        <div class="tc-report-card-content-title">附录Ⅰ 取样信息</div>
        <div v-for="(item, index) in data.sampling_information" :key="'p'+index">
          <el-form-item>
            <template slot="label">
              <span>{{ (index+1).toString() }}</span>
              款号/型号
            </template>
            <span style="margin-right: 1rem;">{{ item.sampling_number ? item.sampling_number : 'N/A' }}</span>
          </el-form-item>
          <el-form-item label-width="0" style="margin: 0 0 24px 0;">
            <table cellspacing="0" cellpadding="0" border="0" class="tc-table" style="width: 100%">
              <thead>
                <tr><th>取样信息</th><th>其它信息</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align: left;">
                    <el-form-item label="取样数量" label-width="100px">
                      {{ item.sampling_quantity }}
                    </el-form-item>
                    <el-form-item label="取样原因" label-width="100px">
                      {{ item.sampling_reason }}
                    </el-form-item>
                    <el-form-item label="收件公司" label-width="100px">
                      {{ item.receive_company }}
                    </el-form-item>
                    <el-form-item label="收件人" label-width="100px">
                      {{ item.receive_person }}
                    </el-form-item>
                    <el-form-item label="收件地址" label-width="100px">
                      {{ item.receive_address }}
                    </el-form-item>
                    <el-form-item label="备注信息" label-width="100px">
                      {{ item.remark }}
                    </el-form-item>
                  </td>
                  <td style="text-align: left; width: 850px;" valign="top">
                    <el-form-item label="快递公司" label-width="100px">
                      <el-input v-model="item.courier_company" placeholder="请输入快递公司" style="width: 690px;"/>
                    </el-form-item>
                    <el-form-item label="快递单号" label-width="100px">
                      <el-input v-model="item.courier_number" placeholder="请输入快递单号" style="width: 690px;"/>
                    </el-form-item>
                    <el-form-item label="备注信息" label-width="100px">
                      <el-input v-model="item.courier_remark" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入备注信息" type="textarea" style="width: 690px;"/>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <tc-upload-image
                      :files="item.files"
                      :name="'sampling_information.'+index+'.files'"
                      @upload="handleUploadFile"
                      @remove="handleRemoveFile"/>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-form-item>
        </div>
        <div class="tc-report-card-content-title">附录Ⅱ 测量及测试仪器记录</div>
        <el-form-item label-width="0" style="margin: 0 0 24px 0;">
          <el-table
            :data="data.tools"
            border
            class="tc-writable-table"
            style="width: 100%">
            <el-table-column label="描述" align="center">
              <template slot-scope="scope">
                <el-form-item
                  :rules="[{ required: true, message: $t('report.rules.conclusion'), trigger: 'change' }]"
                  :prop="'tools.'+scope.$index+'.name'"
                  label-width="0"
                  class="tc-form-item">
                  <el-select
                    v-model="scope.row.name"
                    filterable
                    default-first-option
                    style="width: 100%;">
                    <el-option
                      v-for="item in configs.toolOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="仪器编号" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.order_number"/>
              </template>
            </el-table-column>
            <el-table-column label="校准日期" align="center">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.calibrated_at" type="date" style="width: 100%;"/>
              </template>
            </el-table-column>
            <el-table-column label="有效日期" align="center">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.effected_at" type="date" style="width: 100%;"/>
              </template>
            </el-table-column>
            <el-table-column label="来源" align="center">
              <template slot-scope="scope">
                <el-form-item
                  :rules="[{ required: true, message: $t('report.rules.conclusion'), trigger: 'change' }]"
                  :prop="'tools.'+scope.$index+'.source'"
                  label-width="0"
                  class="tc-form-item">
                  <el-select
                    v-model="scope.row.source"
                    filterable
                    default-first-option
                    style="width: 100%;">
                    <el-option
                      v-for="item in configs.sourceOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" width="50">
              <template slot-scope="scope">
                <el-button type="success" size="mini" icon="el-icon-minus" circle @click="handleRemoveTool(scope.$index)"/>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label-width="0" style="margin: 0 0 24px 0;">
          <el-button type="success" icon="el-icon-plus" @click="handleAddTool">添加</el-button>
        </el-form-item>

        <div class="tc-report-card-content-title">附录Ⅲ 其他图片( 廉政声明、工厂大门，仓储，测量图标，包装清单等)</div>
        <el-form-item label-width="0" style="margin: 0 0 24px 0;">
          <tc-upload-image
            :files="data.files"
            :name="'files'"
            @upload="handleUploadFile"
            @remove="handleRemoveFile"/>
        </el-form-item>
        <el-form-item label-width="0" style="text-align: center;">
          <el-button class="tc-report-button" @click="handleComfirm">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import UploadImage from '@/views/report/components/UploadImage'

const defaultData = {
  sampling_information: [],
  tools: [],
  files: []
}
const defaultTool = {
  name: null,
  number: '',
  calibrated_at: '',
  effected_at: '',
  source: null
}
const defaultSamplingInformation = {
  courier_company: '',
  courier_number: '',
  courier_remark: '',
  files: []
}

export default {
  name: 'ReportPartG',
  components: {
    'tc-upload-image': UploadImage
  },
  props: {
    configs: {
      required: true,
      type: Object
    },
    samplingInformation: {
      required: true,
      type: Array | null
    }
  },
  data() {
    return {
      loading: true,
      data: this._.cloneDeep(defaultData),
      partGShow: true
    }
  },
  methods: {
    setData(data) {
      if (data) {
        this.data = this._.cloneDeep(data)
      } else {
        const _data = this._.cloneDeep(defaultData)
        _data.sampling_information = this._.cloneDeep(this._.map(this.samplingInformation, samplingInformation => {
          return this._.merge(this._.cloneDeep(defaultSamplingInformation), samplingInformation)
        }))
        this.data = _data
      }
      this.loading = false
    },
    handleUploadFile(file, name) {
      this._.get(this.data, name).push(file)
    },
    handleRemoveFile(file, name) {
      const index = this._.findIndex(this._.get(this.data, name), { id: file.id })
      if (~index) {
        this._.get(this.data, name).splice(index, 1)
      }
    },

    // 工具
    handleAddTool() {
      this.data.tools.push(this._.cloneDeep(defaultTool))
    },
    handleRemoveTool(index) {
      this.data.tools.splice(index, 1)
    },
    // 提交
    handleComfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message({
            message: '附录保存成功',
            type: 'success'
          })
          this.$emit('save', this.data, 'appendix')
        }
      })
    }
  }
}
</script>
