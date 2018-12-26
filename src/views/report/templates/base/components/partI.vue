<template>
  <div class="tc-report-card">
    <div :class="{titleChange:!partIShow}" class="tc-report-card-title clearfix">
      <span><span class="titleText">I</span>检验结论</span>
      <span class="right" style="float:right;color:#FFA800" @click="partIShow=!partIShow">
        <span v-if="partIShow">收起</span>
        <span v-if="!partIShow">展开</span>
        <i :class="{rotaga:!partIShow}" class="el-icon-caret-top"/>
      </span>
    </div>
    {{ order.review.quantity_conformity }}
    <div v-show="partIShow" class="tc-report-card-content">
      <el-form ref="form" :model="data" label-width="130px">
        <el-form-item
          :rules="[{ required: true, message: '请选择结论', trigger: 'change' }]"
          label="报告总结论"
          prop="general_conclusion">
          <el-radio
            v-for="item in configs.generalConclusionOptions"
            v-model="data.general_conclusion"
            :key="item.value"
            :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-form-item>
        <el-form-item label-width="0" style="margin: 0 0 24px 0;">
          <table cellspacing="0" cellpadding="0" border="0" class="tc-table" style="width: 100%">
            <tbody>
              <tr>
                <td style="width: 270px;" class="background-gray">外观及工艺</td>
                <td colspan="5">符合</td>
              </tr>
              <tr>
                <td style="width: 270px;" class="background-gray">抽样数</td>
                <td colspan="5">{{ cloneE.sampling.params.quantity }}</td>
              </tr>
              <tr>
                <td rowspan="2" class="background-gray" style="vertical-align:middle;text-align:center;">检验标准</td>
                <!-- {{order}} -->
                <td rowspan="2" style="text-align:center;vertical-align:middle;">{{ _.get(_.find(_.get(configs, 'samplings.options', []), { value: cloneE.sampling.type }), 'label') }}</td>
                <td style="width: 180px;">疵点</td>
                <td style="width: 180px;">致命缺陷</td>
                <td style="width: 180px;">严重缺陷</td>
                <td style="width: 180px;">轻微缺陷</td>
              </tr>
              <tr>
                <td>AQL</td>
                <td>{{ cloneE.sampling.params.fatal_defect_limit ? cloneE.sampling.params.fatal_defect_limit : 'N/A' }}</td>
                <td>{{ cloneE.sampling.params.serious_defect_limit ? cloneE.sampling.params.serious_defect_limit : 'N/A' }}</td>
                <td>{{ cloneE.sampling.params.minor_defect_limit ? cloneE.sampling.params.minor_defect_limit : 'N/A' }}</td>
              </tr>
              <tr>
                <td rowspan="3" class="background-gray" style="vertical-align:middle;text-align:center;">检验水平</td>
                <td rowspan="3">{{ _.get(_.find(_.get(configs, 'samplings.levels', []), { level: _.get(order, 'visual_and_workmanship.sampling.params.level') }), 'value') }}</td>
                <td>最大允许值</td>
                <td>{{ cloneE.sampling.params.fatal_defect }}</td>
                <td>{{ cloneE.sampling.params.serious_defect }}</td>
                <td>{{ cloneE.sampling.params.minor_defect }}</td>
              </tr>
              <tr>
                <td>实际值</td>
                <td>{{ cloneE.real_fatal_defect }}</td>
                <td>{{ cloneE.real_serious_defect }}</td>
                <td>{{ cloneE.real_minor_defect }}</td>
              </tr>
              <tr>
                <td>结论</td>
                <td colspan="3">致命缺陷</td>
              </tr>
            </tbody>
          </table>
        </el-form-item>
        <el-form-item label-width="0" style="margin: 0 0 24px 0;">
          <table cellspacing="0" cellpadding="0" border="0" class="tc-table" style="width: 100%">
            <tbody>
              <tr>
                <td style="width: 270px;" class="background-gray">数量符合性</td>
                <td v-if="cloneA.conclusion==1" style="width: 270px;">符合</td>
                <td v-if="cloneA.conclusion==2" style="width: 270px;">不符合</td>
                <td v-if="cloneA.conclusion==3" style="width: 270px;">待定</td>
                <td v-if="cloneA.conclusion==4" style="width: 270px;">不适用</td>
                <td>123213</td>
              </tr>
              <tr>
                <td class="background-gray">包装/标识/标签</td>
                <td>不符合</td>
                <td>123213</td>
              </tr>
              <tr>
                <td class="background-gray">产品符合性</td>
                <td>不符合</td>
                <td>123213</td>
              </tr>
              <tr>
                <td class="background-gray">数据测量/现场测试</td>
                <td>不符合</td>
                <td>123213</td>
              </tr>
              <tr>
                <td class="background-gray">特别注意点</td>
                <td>不符合</td>
                <td>123213</td>
              </tr>
            </tbody>
          </table>
        </el-form-item>
        <div class="tc-report-card-content-title">备注</div>
        <el-form-item label-width="0" style="margin: 0 0 24px 0;">
          <el-table
            :data="data.remarks"
            border
            class="tc-writable-table"
            style="width: 100%">
            <el-table-column label="#" align="center" width="100">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" placeholder="请输入"/>
              </template>
            </el-table-column>
            <el-table-column align="center" width="50">
              <template slot-scope="scope">
                <el-button size="mini" type="success" icon="el-icon-minus" circle/>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label-width="0" style="margin: 0 0 24px 0;">
          <el-button type="success" icon="el-icon-plus" @click="handleAddRemark">添加</el-button>
          <el-button type="success">导入不符合备注</el-button>
          <el-button type="success">导入待定备注</el-button>
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
  general_conclusion: '',
  remarks: []
}
const defaultRemark = {
  remark: ''
}

export default {
  name: 'ReportPartI',
  components: {
    'tc-upload-image': UploadImage
  },
  props: {
    configs: {
      required: true,
      type: Object
    },
    order: {
      required: true,
      type: Object | null
    }
  },
  data() {
    return {
      data: this._.cloneDeep(defaultData),
      cloneA: '',
      cloneB: '',
      cloneE: {},

      partIShow: true
    }
  },
  methods: {
    setData(data, Deepclone) {
      if (data) {
        this.data = this._.cloneDeep(data)
      } else {
        const _data = this._.cloneDeep(defaultData)
        this.data = _data
      }
      this.cloneE = Deepclone.review.visual_and_workmanship
      this.cloneA = Deepclone.review.quantity_conformity
      this.loading = false
    },

    handleAddRemark() {
      this.data.remarks.push(this._.cloneDeep(defaultRemark))
    },
    handleRemoveRemark(index) {
      this.data.remarks.splice(index, 1)
    },

    // 提交
    handleComfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('save', this.data, 'inspection_results')
        }
      })
    }
  }
}
</script>
