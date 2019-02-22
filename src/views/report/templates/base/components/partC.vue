<template>
  <div class="tc-report-card">
    <div :class="{titleChange:!partCShow}" class="tc-report-card-title clearfix">
      <span><span class="titleText">C</span>产品符合性</span>
      <span class="right" style="float:right;color:#FFA800" @click="partCShow=!partCShow">
        <span v-if="partCShow">收起</span>
        <span v-if="!partCShow">展开</span>
        <i :class="{rotaga:!partCShow}" class="el-icon-caret-top"/>
      </span>
    </div>
    <div v-show="partCShow" class="tc-report-card-content">
      <div class="tc-report-card-content-title">款式/材料/颜色符合性</div>
      <el-form ref="form" :model="data" label-width="70px">
        <div v-for="(product, index) in data.products" :key="index">
          <el-form-item label-width="70px">
            <el-form-item class="borderContent">
              <el-form-item style="margin-bottom:24px;" label-width="100px">
                <template slot="label" >
                  <span>{{ (index+1).toString() }}</span>
                  款号/型号
                </template>
                <span style="margin-right: 1rem;">{{ product.number ? product.number : 'N/A' }}</span>
                <el-input v-if="!product.number" v-model="product.name" style="width: 480px;"/>
                <i v-if="!product.id" class="el-icon-close tc-remove" @click="handleRemoveProduct(index)"/>
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
          <el-form-item label="备注" :rules="[2, 3].includes(product.conclusion) ? [{ required: true, message: '请输入备注内容', trigger: 'blur' }] : []"
                :prop="'products.'+index+'.remark_content'">
            <el-input
              :autosize="{ minRows: 3, maxRows: 5}"
              v-model="product.remark_content"
              type="textarea"
              placeholder="请输入备注内容"
              style="width: 100%;"/>
          </el-form-item>
          <el-form-item label="图片">
            <tc-upload-image
              :files="product.files"
              :name="'products.'+index+'.files'"
              @upload="handleUploadFile"
              @remove="handleRemoveFile"/>
          </el-form-item>
        </div>
        <el-form-item label-width="70px" style="margin: 0 0 22px 0">
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
  name: '',
  number: '',
  remark_content: '',
  files: []
}

export default {
  name: 'ReportPartC',
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
      loading: true,
      data: this._.cloneDeep(defaultData),
      partCShow: true
    }
  },
  methods: {
    setData(data) {
      if (data) {
        this.data = this._.cloneDeep(data)
      } else {
        const _data = this._.cloneDeep(defaultData)
        _data.products = this._.flatMap(this.configs.products, product => {
          return this._.merge(this._.cloneDeep(defaultProduct), {
            id: product.id,
            number: product.number,
            name: product.name
          })
        })
        this.data = _data
      }
      this.loading = false
    },

    // 删除商品
    handleRemoveProduct(index) {
      this.data.products.splice(index, 1)
    },
    // 添加商品
    handleAddProduct() {
      this.data.products.push(this._.cloneDeep(defaultProduct))
    },

    // 上传文件
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
            message: '产品符合性保存成功',
            type: 'success'
          })
          this.$emit('save', this.data, 'product_conformity')
        }
      })
    }
  }
}
</script>
