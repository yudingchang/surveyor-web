<template>
  <div v-loading="loading" class="tc-report-card">
    <div :class="{titleChange:!partBShow}" class="tc-report-card-title clearfix">
      <span><span class="titleText">B</span>包装/标识/标签</span>
      <span class="right" style="float:right;color:#FFA800" @click="partBShow=!partBShow">
        <span v-if="partBShow">收起</span>
        <span v-if="!partBShow">展开</span>
        <i :class="{rotaga:!partBShow}" class="el-icon-caret-top"/>
      </span>

    </div>
    <div v-show="partBShow" class="tc-report-card-content">
      <el-form ref="form" :model="data" label-width="100px">
        <div class="tc-report-card-content-title">包装符合性</div>
        <div v-for="(product, index) in data.packing.products" :key="'p'+index">
          <el-form-item class="borderContent" label-width="0">
            <el-form-item style="margin-bottom:25px">
              <span>{{ (index+1).toString() }}</span>
              <el-form-item v-if="product.id" style="display:inline-block;width:70%" label="款号/型号" label-width="80px">
                  <span>{{ product.number ? product.number : 'N/A' }}</span>
              </el-form-item> 
              <el-form-item :prop="'packing.products.'+index+'.name'" :rules="[{ required: true, message: '请输入款号或产品名称', trigger: 'blur' }]" style="display:inline-block" label-width='10px'>
                <el-input v-if="!product.number" maxlength="50" v-model="product.name" style="width: 480px;" placeholder="请输入款号或产品名称"/>
              </el-form-item>
              <i v-if="!product.id" class="el-icon-close tc-remove" @click="handleRemovePackingProduct(index)"/>
            </el-form-item>
            <el-form-item
              :rules="[{ required: true, message: '请选择结论', trigger: 'blur' }]"
              :prop="'packing.products.'+index+'.conclusion'"
              label="结论"
              style="margin-bottom:25px"
            >
              <el-radio
                v-for="item in configs.conclusionOptions"
                v-model="product.conclusion"
                :key="item.value"
                :label="item.value">
                {{ item.label }}
              </el-radio>
            </el-form-item>
            <el-form-item label-width="0">
              <table cellspacing="0" cellpadding="0" border="0" class="tc-table" style="width: 100%">
                <thead>
                  <tr><th style="width: 180px;">项目</th><th>检验结果</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="vertical-align:middle;text-align:center;">单个包装</td>
                    <td class="el-form--inline" style="text-align: left;">
                      <el-form-item
                        :rules="[{ required: true, message: '请选择包装', trigger: 'change' }]"
                        :prop="'packing.products.'+index+'.single.package'"
                        label="包装"
                        label-width="70px">
                        <el-select
                          v-model="product.single.package"
                          allow-create
                          filterable
                          default-first-option
                          style="width: 120px;"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="item in configs.packageOptions.single"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"/> 
                        </el-select>
                      </el-form-item>
                      <el-form-item label="说明" label-width="70px">
                        <el-input v-model="product.single.description" style="width: 500px;" placeholder="请输入内容" />
                      </el-form-item>
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align:middle;text-align:center;">内包装</td>
                    <td class="el-form--inline" style="text-align: left;">
                      <el-form-item
                        :rules="[{ required: true, message: '请填写入数', trigger: 'blur' }]"
                        :prop="'packing.products.'+index+'.inner.quantity'"
                        label="入数"
                        label-width="70px">
                        <el-input-number v-model="product.inner.quantity" :min="0" :controls="false" placeholder="请输入" controls-position="right" class="tc-input-number-pd" />
                      </el-form-item>
                      <el-form-item
                        :rules="[{ required: true, message: '请选择包装', trigger: 'change' }]"
                        :prop="'packing.products.'+index+'.inner.package'"
                        label="包装"
                        label-width="70px">
                        <el-select
                          v-model="product.inner.package"
                          placeholder="请选择"
                          allow-create
                          filterable
                          default-first-option
                          style="width: 120px;">
                          <el-option
                            v-for="item in configs.packageOptions.inner"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"/>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="说明" label-width="50px">
                        <el-input v-model="product.inner.description" placeholder="请输入内容" style="width: 295px;"/>
                      </el-form-item>
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align:middle;text-align:center;">外包装</td>
                    <td class="el-form--inline" style="text-align: left;">
                      <el-form-item
                        :rules="[{ required: true, message: '请填写入数', trigger: 'blur' }]"
                        :prop="'packing.products.'+index+'.outer.quantity'"
                        label="入数"
                        label-width="70px">
                        <el-input-number v-model="product.outer.quantity" :min="0" :controls="false" placeholder="请输入" controls-position="right" class="tc-input-number-pd" />
                      </el-form-item>
                      <el-form-item
                        :rules="[{ required: true, message: '请选择包装', trigger: 'change' }]"
                        :prop="'packing.products.'+index+'.outer.package'"
                        label="包装"
                        label-width="70px">
                        <el-select
                          v-model="product.outer.package"
                          allow-create
                          filterable
                          default-first-option
                          placeholder="请选择"
                          style="width: 120px;">
                          <el-option
                            v-for="item in configs.packageOptions.outer"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"/>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="说明" label-width="50px">
                        <el-input v-model="product.outer.description" placeholder="请输入内容" style="width: 295px;" />
                      </el-form-item>
                      <div v-if="product.outer.package == _.first(configs.packageOptions.outer).value" class="tc-form-item">
                        <el-form-item label="外箱尺寸" label-width="70px">
                          <el-form-item
                            :rules="[{ required: true, message: '请填写外箱长度', trigger: 'blur' }]"
                            :prop="'packing.products.'+index+'.outer.size_length'"
                            label="长"
                            placeholder="请输入"
                            label-width="40px">
                            <el-input-number v-model="product.outer.size_length" :min="0" :controls="false" style="width: 100px;" controls-position="right" class="tc-input-number-pd"/>
                          </el-form-item>
                          <el-form-item
                            :rules="[{ required: true, message: '请填写外箱宽度', trigger: 'blur' }]"
                            :prop="'packing.products.'+index+'.outer.size_width'"
                            label="宽"
                            placeholder="请输入"
                            label-width="40px">
                            <el-input-number v-model="product.outer.size_width" :min="0" :controls="false" style="width: 100px;" controls-position="right" class="tc-input-number-pd"/>
                          </el-form-item>
                          <el-form-item
                            :rules="[{ required: true, message: '请填写外箱高度', trigger: 'blur' }]"
                            :prop="'packing.products.'+index+'.outer.size_height'"
                            label="高"
                            placeholder="请输入"
                            label-width="40px">
                            <el-input-number v-model="product.outer.size_height" :min="0" :controls="false" style="width: 100px;" controls-position="right" class="tc-input-number-pd"/>
                          </el-form-item>
                          <el-form-item
                            :rules="[{ required: true, message:'请选择单位', trigger: 'blur' }]"
                            :prop="'packing.products.'+index+'.outer.size_unit'"
                            label-width="0">
                            <el-select
                              v-model="product.outer.size_unit"
                              placeholder="厘米"
                              default-first-option
                              style="width: 120px;">
                              <el-option
                                v-for="item in configs.packageOptions.size"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"/>
                            </el-select>
                          </el-form-item>
                        </el-form-item>
                        <el-form-item label="外箱毛重" label-width="70px">
                          <el-form-item
                            :rules="[{ required: true, message:'请输入外箱毛重', trigger: 'blur' }]"
                            :prop="'packing.products.'+index+'.outer.weight'"
                            label-width="0">
                            <el-input-number v-model="product.outer.weight" :min="0" :controls="false" placeholder="请输入" style="width: 100px;" controls-position="right" class="tc-input-number-pd"/>
                          </el-form-item>
                          <el-form-item
                            :rules="[{ required: true, message: '请选择重量单位', trigger: 'blur' }]"
                            :prop="'packing.products.'+index+'.outer.weight_unit'"
                            label-width="0">
                            <el-select
                              v-model="product.outer.weight_unit"
                              default-first-option
                              placeholder="请选择单位"
                              style="width: 120px;">
                              <el-option
                                v-for="item in configs.packageOptions.weight"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"/>
                            </el-select>
                          </el-form-item>
                        </el-form-item>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-form-item>
          </el-form-item>

          <el-form-item label="备注" label-width="70px" :rules="[2, 3].includes(product.conclusion) ? [{ required: true, message: '请输入备注内容', trigger: 'blur' }] : []" :prop="'packing.products.'+index+'.remark_content'">
            <el-input
              :autosize="{ minRows: 3, maxRows: 5}"
              v-model="product.remark_content"
              type="textarea"
              placeholder="请输入备注内容"
              style="width: 100%;"/>
          </el-form-item>
          <el-form-item label="图片" label-width="70px">
            <tc-upload-image
              :files="product.files"
              :name="'packing.products.'+index+'.files'"
              @upload="handleUploadFile"
              @remove="handleRemoveFile"/>
          </el-form-item>
        </div>
        <el-form-item label-width="70px" style="margin: 0 0 22px 0;">
          <el-button type="success" icon="el-icon-plus" @click="handleAddPackingProduct">添加</el-button>
        </el-form-item>

        <div class="tc-report-card-content-title">唛头/标识</div>
        <div v-for="(product, index) in data.marking.products" :key="'s'+index">
          <el-form-item label-width="70px" >
            <el-form-item class="borderContent" >          
              <el-form-item style="margin-bottom:24px;">
                <span>{{ (index+1).toString() }}</span>
                <el-form-item v-if="product.id" style="display:inline-block;width:70%" label="款号/型号" label-width="80px">
                  <span>{{ product.number ? product.number : 'N/A' }}</span>
                </el-form-item>  
                <el-form-item :prop="'marking.products.'+index+'.name'" :rules="[{ required: true, message: '请输入款号或产品名称', trigger: 'blur' }]" style="display:inline-block" label-width='10px'>
                  <el-input v-if="!product.number" v-model="product.name" maxlength="50" style="width: 480px;" placeholder="请输入款号或产品名称"/>
                </el-form-item>
                <!-- <el-input v-if="!product.number" v-model="product.name" style="width: 480px;" placeholder="请输入产品名称"/> -->
                <i v-if="!product.id" class="el-icon-close tc-remove" @click="handleRemoveMarkingProduct(index)"/>
              </el-form-item>
              <el-form-item
                :rules="[{ required: true, message:'请选择结论', trigger: 'blur' }]"
                :prop="'marking.products.'+index+'.conclusion'"
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
          <el-form-item label="备注" label-width="70px" :rules="[2, 3].includes(product.conclusion) ? [{ required: true, message: '请输入备注内容', trigger: 'blur' }] : []" :prop="'marking.products.'+index+'.remark_content'">
            <el-input
              :autosize="{ minRows: 3, maxRows: 5}"
              v-model="product.remark_content"
              type="textarea"
              style="width: 100%;"
              placeholder="请输入备注内容"/>
          </el-form-item>
          <el-form-item label="图片" label-width="70px">
            <tc-upload-image
              :files="product.files"
              :name="'marking.products.'+index+'.files'"
              @upload="handleUploadFile"
              @remove="handleRemoveFile"/>
          </el-form-item>
        </div>
        <el-form-item label-width="70px" style="margin: 0 0 22px 0;">
          <el-button type="success" icon="el-icon-plus" @click="handleAddMarkingProduct">添加</el-button>
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
  packing: {
    products: []
  },
  marking: {
    products: []
  }
}

const defaultPackingProduct = {
  conclusion: null,
  number: '',
  name: '',
  single: {
    package: null,
    description: ''
  },
  inner: {
    quantity: null,
    package: null,
    description: ''
  },
  outer: {
    quantity: null,
    package: null,
    description: ''
  },
  remark_content: '',
  files: []
}

const defaultMarkingProduct = {
  conclusion: null,
  remark_content: '',
  files: []
}

export default {
  name: 'ReportPartB',
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
      partBShow: true
    }
  },
  methods: {
    setData(data) {
      if (data) {
        this.data = this._.cloneDeep(data)
      } else {
        const _data = this._.cloneDeep(defaultData)
        _data.packing.products = this._.flatMap(this.configs.products, product => {
          return this._.merge(this._.cloneDeep(defaultPackingProduct), {
            id: product.id,
            number: product.number,
            name: product.name
          })
        })
        _data.marking.products = this._.flatMap(this.configs.products, product => {
          return this._.merge(this._.cloneDeep(defaultMarkingProduct), {
            id: product.id,
            number: product.number,
            name: product.name
          })
        })
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

    // 增加包装符合性中的商品
    handleAddPackingProduct() {
      this.data.packing.products.push(this._.cloneDeep(defaultPackingProduct))
    },
    // 删除包装符合性中的商品
    handleRemovePackingProduct(index) {
      this.data.packing.products.splice(index, 1)
    },

    // 增加唛头/标识中的商品
    handleAddMarkingProduct() {
      this.data.marking.products.push(this._.cloneDeep(defaultMarkingProduct))
    },
    // 删除唛头/标识中的商品
    handleRemoveMarkingProduct(index) {
      this.data.marking.products.splice(index, 1)
    },

    // 提交
    handleComfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message({
            message: '包装标识标签保存成功',
            type: 'success'
          })
          this.$emit('save', this.data, 'packing_and_marking')
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
