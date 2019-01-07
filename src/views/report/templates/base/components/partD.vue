<template>
  <div v-loading="loading" class="tc-report-card">
    <div :class="{titleChange:!partDShow}" class="tc-report-card-title clearfix">
      <span><span class="titleText">D</span>数据测量/现场测试</span>
      <span class="right" style="float:right;color:#FFA800" @click="partDShow=!partDShow">
        <span v-if="partDShow">收起</span>
        <span v-if="!partDShow">展开</span>
        <i :class="{rotaga:!partDShow}" class="el-icon-caret-top"/>
      </span>
    </div>
    <div v-show="partDShow" class="tc-report-card-content">
      <el-form ref="form" :model="data" label-width="70px">
        <el-form-item label-width="0" style="margin: 0 0 24px 0">
          <el-table
            :data="data.checkitems"
            border
            class="tc-writable-table"
            style="width: 100%">
            <el-table-column label="测试项目" align="center" width="180px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.title" placeholder="请输入新增测试项" />
              </template>
            </el-table-column>
            <el-table-column label="测试要求" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.description" placeholder="请输入"/>
              </template>
            </el-table-column>
            <el-table-column label="测试数据" align="center" width="180px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.message" placeholder="请输入"/>
              </template>
            </el-table-column>
            <el-table-column label="包含产品" align="center" width="180px">
              <template slot-scope="scope">
                <el-form-item
                  :rules="[{ required: true, message:'请选择产品', trigger: 'change' }]"
                  :prop="'checkitems.'+scope.$index+'.products'"
                  label-width="0"
                  class="tc-form-item">
                  <el-select
                    v-model="scope.row.products"
                    multiple
                    collapse-tags>
                    <el-option
                      v-for="item in configs.products"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="测试数量" align="center" width="180px">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.check_quantity" :min="0" :controls="false" placeholder="请输入" controls-position="right" class="tc-input-number-ld"/>
              </template>
            </el-table-column>
            <el-table-column label="测试结论" align="center" width="120px">
              <template slot-scope="scope">
                <el-form-item
                  :rules="[{ required: true, message: '请选择测试结论', trigger: 'change' }]"
                  :prop="'checkitems.'+scope.$index+'.conclusion'"
                  label-width="0"
                  class="tc-form-item">
                  <el-select v-model="scope.row.conclusion" style="width: 100%; max-width: 100%;">
                    <el-option
                      v-for="item in configs.conclusionOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" width="50">
              <template slot-scope="scope">
                <el-button type="success" size="mini" icon="el-icon-minus" circle @click="handleRemoveCheckItem(scope.$index)"/>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label-width="0" style="margin: 0 0 24px 0;">
          <el-button type="success" icon="el-icon-plus" @click="handleAddCheckItem">添加测试项</el-button>
        </el-form-item>

        <el-form-item label="备注" :rules="
          _.filter(data.checkitems, item => {
            return [2,3].includes(item.conclusion) 
          }).length ? [{ required: true, message: '请输入备注内容', trigger: 'blur' }] : []" prop="remark_content">
          <el-input
            :autosize="{ minRows: 3, maxRows: 5}"
            v-model="data.remark_content"
            type="textarea"
            placeholder="请输入备注内容"
            style="width: 100%;"/>
        </el-form-item>
        <el-form-item label="图片">
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
  remark_content: '',
  files: [],
  checkitems: []
}
const defaultCheckitem = {
  title: '',
  description: '',
  products: [],
  check_quantity: 0,
  message: '',
  conclusion: null
}

export default {
  name: 'ReportPartD',
  components: {
    'tc-upload-image': UploadImage
  },
  props: {
    configs: {
      required: true,
      type: Object
    },
    checkitems: {
      required: true,
      type: Array | null
    }
  },
  data() {
    return {
      loading: true,
      data: this._.cloneDeep(defaultData),
      partDShow: true
    }
  },
  methods: {
    setData(data) {
      if (data) {
        this.data = this._.cloneDeep(data)
      } else {
        const _data = this._.cloneDeep(defaultData)
        _data.checkitems = this._.flatMap(this.checkitems, checkitem => {
          return this._.merge(this._.cloneDeep(defaultCheckitem), {
            check_quantity: checkitem.check_quantity,
            description: checkitem.description,
            products: checkitem.products,
            title: checkitem.title,
            id: checkitem.id
          })
        })
        this.data = _data
      }
      this.loading = false
    },
    // 增加测试项
    handleAddCheckItem() {
      this.data.checkitems.push(this._.cloneDeep(defaultCheckitem))
    },
    handleRemoveCheckItem(index) {
      this.data.checkitems.splice(index, 1)
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

    // 提交
    handleComfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('save', this.data, 'data_measurement')
        }
      })
    }
  }
}
</script>
