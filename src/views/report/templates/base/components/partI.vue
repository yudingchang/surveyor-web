<template>
  <div v-loading="loading" class="tc-report-card">
    <div :class="{titleChange:!partHShow}" class="tc-report-card-title clearfix">
      <span><span class="titleText">I</span>基本信息</span>
      <span class="right" style="float:right;color:#FFA800" @click="partHShow=!partHShow">
        <span v-if="partHShow">收起</span>
        <span v-if="!partHShow">展开</span>
        <i :class="{rotaga:!partHShow}" class="el-icon-caret-top"/>
      </span>
    </div>
    <div v-show="partHShow" class="tc-report-card-content">
      <el-form ref="form" :model="data" label-width="130px">
        <el-form-item label-width="0" style="margin: 0 0 24px 0;">
          <table cellspacing="0" cellpadding="0" border="0" class="tc-table" style="width: 100%">
            <tbody>
              <!-- <tr>
                <td style="width: 270px; vertical-align:middle;text-align:center;" class="background-gray">
                  检验类型
                </td>
                <td style="text-align: left; min-width: 350px;vertical-align:middle;">
                  <el-form-item label-width="0" class="singleForm">
                    第<el-input-number v-model="data.number" :min="1" controls-position="right" style="width: 120px; margin: 0 7px;"/>次检验
                  </el-form-item>
                </td>
              </tr> -->
              <tr>
                <td style="width: 270px;vertical-align:middle;text-align:center;" class="background-gray">
                  买家名称
                </td>
                <td style="text-align: left;width: 470px;">
                  <el-form-item label-width="0" class="singleForm">
                    <el-input v-model="data.user_name" style="width: 100%;"/>
                  </el-form-item>
                </td>
                <td style="width: 270px;vertical-align:middle;text-align:center;" class="background-gray">
                  订单号码
                </td>
                <td style="text-align: left;">
                  <el-form-item label-width="0" class="singleForm">
                    <el-input v-model="data.order_name" style="width: 100%;"/>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td style="width: 270px;vertical-align:middle;text-align:center;" class="background-gray">
                  供应商名称
                </td>
                <td style="text-align: left;">
                  <el-form-item label-width="0" class="singleForm">
                    <el-input v-model="data.supplier_name" style="width: 100%;"/>
                  </el-form-item>
                </td>
                <td style="width: 270px;vertical-align:middle;text-align:center;" class="background-gray">
                  款号/型号
                </td>
                <td style="text-align: left;">
                  <el-form-item label-width="0" class="singleForm">
                    <el-input v-model="data.product_number" style="width: 100%;"/>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td style="width: 270px;vertical-align:middle;text-align:center;" class="background-gray">
                  检验日期
                </td>
                <td style="text-align: left;">
                  <el-form-item label-width="0" class="singleForm">
                    <el-date-picker
                      v-model="data.inspection_dates"
                      type="dates"
                      style="width: 100%;"/>
                  </el-form-item>
                </td>
                <td style="width: 270px;vertical-align:middle;text-align:center;" class="background-gray">
                  产品名称
                </td>
                <td style="text-align: left;">
                  <el-form-item label-width="0" class="singleForm">
                    <el-input v-model="data.product_name" style="width: 100%;"/>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td style="width: 270px;vertical-align:middle;text-align:center;" class="background-gray">
                  检验地址
                </td>
                <td style="text-align: left;vertical-align:middle;">
                  <el-form-item label-width="0" class="singleForm">
                    <el-input v-model="data.inspection_address" style="width: 100%;"/>
                  </el-form-item>
                </td>
                 <td style="width: 270px;vertical-align:middle;text-align:center;" class="background-gray">
                  整批次数量
                </td>
                <td style="text-align: left;vertical-align:middle;">
                  <el-form-item label-width="0" class="singleForm">
                    {{ data.report_quantity }}
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td style="width: 270px;vertical-align:middle;text-align:center;" class="background-gray">
                  检验服务
                </td>
                <td style="text-align: left;vertical-align:middle;">
                  <el-form-item label-width="0" class="singleForm" style="display:inline-block">
                    <el-select
                      v-model="data.inspection_type"
                      filterable
                      default-first-option
                      style="width: 180px;">
                      <el-option
                        v-for="item in configs.inspectionTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                    
                  </el-form-item>
                  <!-- <td style="text-align: left; min-width: 350px;vertical-align:middle;"> -->
                  <el-form-item label-width="0" class="singleForm" style="display:inline-block;vertical-align:middle;">
                    第<el-input-number v-model="data.number" :min="1" controls-position="right" style="width: 120px; margin: 0 7px;"/>次检验
                  </el-form-item>
                <!-- </td> -->
                </td>
                <td style="width: 270px;vertical-align:middle;text-align:center;" class="background-gray">
                  是否合并抽样
                </td>
                <td style="text-align: left;vertical-align:middle;">
                  <el-radio-group v-model="data.is_merge_sampling">
                    <el-radio :label=1>是</el-radio>
                    <el-radio :label=0>否</el-radio>
                  </el-radio-group>
                </td>
              </tr>
              <tr>
                <td style="width: 270px;vertical-align:middle;text-align:center;" class="background-gray">
                  检验依据
                </td>
                <td style="text-align: left;" colspan=3>
                  <el-form-item label-width="0" class="singleForm">
                    <el-radio
                      v-for="item in configs.inspectionBases"
                      v-model="data.inspection_basis"
                      :key="item.value"
                      :label="item.value">
                      {{ item.label }}
                    </el-radio>
                    <el-input v-model="data.inspection_basis_other" style="width: 100px;" placeholder="请输入"/>
                  </el-form-item>
                </td>
              </tr>          
            </tbody>
          </table>
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
import { getToken } from '@/utils/auth'

const defaultData = {
  number: 1,
  user_name: '',
  supplier_name: '',
  factory_name: '',
  product_number: '',
  product_name: '',
  order_name: '',
  inspection_type: null,
  inspection_dates: [],
  inspection_address: '',
  report_quantity: 0,
  inspection_basis: null,
  inspection_basis_other: '',
  is_merge_sampling:0,
  file: null
}

export default {
  name: 'ReportPartH',
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
      loading: true,
      data: this._.cloneDeep(defaultData),
      partHShow: true
    }
  },
  computed: {
    uploadUrl() {
      return process.env.BASE_API + 'v1/upload'
    },
    uploadHeaders() {
      return { Authorization: 'Bearer ' + getToken() }
    }
  },
  methods: {
    setData(data) {
      if (data) {
        this.data = this._.cloneDeep(data)
      } else {
        const _data = this._.cloneDeep(defaultData)
        const products = this._.get(this.order, 'products')
        const productNumbers = this._.filter(this._.map(products, 'number'))
        const productNames = this._.filter(this._.map(products, 'name'))
        const productOrderNumbers = this._.filter(this._.map(this._.flatten(this._.map(products, 'PO')), 'number'))
        const productQuantity = this._.sum(this._.map(products, 'report_quantity'))

        _data.user_name = this._.get(this.order, 'order.user_name')
        _data.supplier_name = this._.get(this.order, 'order.supplier.name')
        _data.factory_name = this._.get(this.order, 'service.address.name')
        _data.product_number = productNumbers ? productNumbers.join(',') : ''
        _data.product_name = productNames ? productNames.join(',') : ''
        _data.order_name = productOrderNumbers ? productOrderNumbers.join(',') : ''
        _data.inspection_type = parseInt(this._.get(this.order, 'order.inspection_type'))
        _data.inspection_dates = this._.get(this.order, 'service.inspection_dates')
        _data.inspection_address = this._.get(this.order, 'service.address.address_detail')
        _data.report_quantity = productQuantity

        this.data = _data
      }
      this.loading = false
    },
    // 提交
    handleComfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message({
            message: '基本信息保存成功',
            type: 'success'
          })
          this.$emit('save', this.data, 'general_information')
        }
      })
    },

    handleBeforeUpload(file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
        return false
      }
      if (file.size / 1024 / 1024 > 10) {
        this.$message.error('上传图片大小不能超过 10MB!')
        return false
      }
    },
    uploadOnProgress(e, file) {
      const index = this.uploadingFiles.findIndex(uploadingFile => uploadingFile.uid === file.uid)
      this.uploadingFiles[index].percent = Math.round(e.percent)
      this.$set(this.uploadingFiles, index, file)
    },
    // 上传成功
    handleSuccess(response, file, fileList) {
      if (response.code === 0) {
        this.data.file = {
          id: response.data.id,
          name: response.data.name,
          url: response.data.url
        }
      }
    },
    // 移除图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
  }
}
</script>

<style lang="scss">
.tc-report-card {
  .noFileStyle{
    padding-top:300px;
    i{
      color:#FFA800;
      font-size: 36px;
    }
    p:nth-child(2){
      font-size:22px;
      color:#7F8FA4;
    }
    p:nth-child(3){
      font-size:16px;
      color:#EF3535;
      margin-top:25px;
    }

  }
  .el-upload {
    width: 80%;
    .avatar{
      width: 100%;
    }
  }
}
  /* .avatar-uploader .el-upload {
    width: 450px;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  } */
  /* .avatar {
    width: 450px;
    display: block;
    object-fit: contain;
  } */
</style>
