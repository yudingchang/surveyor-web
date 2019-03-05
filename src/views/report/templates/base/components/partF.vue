<template>
  <div class="tc-report-card">
    <div :class="{titleChange:!partFShow}" class="tc-report-card-title clearfix">
      <span><span class="titleText">F</span>客户特殊要求</span>
      <span class="right" style="float:right;color:#FFA800" @click="partFShow=!partFShow">
        <span v-if="partFShow">收起</span>
        <span v-if="!partFShow">展开</span>
        <i :class="{rotaga:!partFShow}" class="el-icon-caret-top"/>
      </span>
    </div>
    <div v-show="partFShow" class="tc-report-card-content">
      <el-form ref="form" :model="data" label-width="70px">
        <div v-for="(product, index) in data.products" :key="index">
          <el-form-item >
            <el-form-item class="borderContent">
              <el-form-item label-width="0" style="margin-bottom:24px;">
                <span>{{ (index+1).toString() }}</span>
                <el-form-item v-if="product.id" style="display:inline-block;width:70%" label="款号/型号" label-width="80px">
                    <span>{{ product.number ? product.number : 'N/A' }}</span>
                </el-form-item>
                <el-form-item v-if="!product.number" :prop="'products.'+index+'.name'" :rules="[{ required: true, message: '请输入款号或产品名称', trigger: 'blur' }]" style="display:inline-block" label-width='10px'>
                  <el-input  maxlength="50" v-model="product.name" style="width: 480px;" placeholder="请输入款号或产品名称"/>
                </el-form-item>
                <i class="el-icon-close tc-remove" @click="handleRemoveProduct(index)"/>
              </el-form-item>
              <el-form-item
                :rules="[{ required: true, message: '请选择结论', trigger: 'blur' }]"
                :prop="'products.'+index+'.conclusion'"
                label="结论">
                <el-radio
                  v-for="item in configs.conclusionOptions"
                  v-model="product.conclusion"
                  :key="item.value"
                  :label="item.value">
                  {{ item.label }}
                </el-radio>
              </el-form-item>
            </el-form-item>
          </el-form-item>
          <el-form-item label="备注" :rules="[2, 3].includes(product.conclusion) ? [{ required: true, message: '请输入备注内容', trigger: 'blur' }] :[]" :prop="'products.'+index+'.remark_content'">
            <el-input
              :autosize="{ minRows: 3, maxRows: 5}"
              v-model="product.remark_content"
              type="textarea"
              style="width: 100%;"
              placeholder="请输入备注内容"/>
          </el-form-item>
          <el-form-item label="图片">
            <tc-upload-image
              :files="product.files"
              :name="'products.'+index+'.files'"
              @upload="handleUploadFile"
              @remove="handleRemoveFile"/>
          </el-form-item>
        </div>
        <el-form-item label-width="70px">
          <el-button type="success" icon="el-icon-plus" @click="handleAddProduct">添加</el-button>
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
  products: []
}

const defaultProduct = {
  conclusion: null,
  remark_content: '',
  files: []
}

export default {
  name: 'ReportPartF',
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
      data: this._.cloneDeep(defaultData),
      partFShow: true
    }
  },
  methods: {
    setData(data) {
      if (data) {
        this.data = this._.cloneDeep(data)
      } else {
        const _data = this._.cloneDeep(defaultData)
        this.data = _data
      }
      this.loading = false
    },

    // 删除
    handleRemoveProduct(index) {
      this.data.products.splice(index, 1)
    },
    // 添加
    handleAddProduct() {
      this.data.products.push(this._.cloneDeep(defaultProduct))
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
          this.$message({
            message: '客户特殊要求保存成功',
            type: 'success'
          })
          this.$emit('save', this.data, 'special_attention')
        }else{
          this.$message({
            message: '存在未填写必填项，请确认',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
