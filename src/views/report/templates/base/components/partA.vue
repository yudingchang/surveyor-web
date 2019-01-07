<template>
  <div v-loading="loading" class="tc-report-card">
    <div :class="{titleChange:!partAShow}" class="tc-report-card-title clearfix">
      <span><span class="titleText">A</span>数量符合性</span>
      <span class="right" style="float:right;color:#FFA800" @click="partAShow=!partAShow">
        <span v-if="partAShow">收起</span>
        <span v-if="!partAShow">展开</span>
        <i :class="{rotaga:!partAShow}" class="el-icon-caret-top"/>
      </span>
    </div>
    <div v-show="partAShow" class="tc-report-card-content">
      <el-form ref="form" :model="data" label-width="100px">
        <el-form-item
          :rules="[{ required: true, message: '请填写结论', trigger: 'blur' }]"
          label="结论"
          prop="conclusion">
          <el-radio
            v-for="item in configs.conclusionOptions"
            v-model="data.conclusion"
            :key="item.value"
            :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-form-item>
        <el-form-item label-width="0" style="margin: 0 0 32px 0;">
          <el-table
            :data="data.products"
            :summary-method="getSummaries"
            border
            show-summary
            class="tc-writable-table"
            style="width: 100%">
            <el-table-column label="款号/型号" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.section_number"/>

              </template>
            </el-table-column>
            <el-table-column label="订单号码" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.order_number"/>
                <!-- <el-table-column label="订单产品数"></el-table-column> -->
              </template>
            </el-table-column>
            <el-table-column label="订单产品数" align="center" width="150px" prop="order_quantity">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.order_quantity" :min="0" :controls="false" controls-position="right" class="tc-input-number"/>
              </template>
            </el-table-column>
            <el-table-column label="出货数量" align="center" width="150px" prop="shipment_quantity">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.shipment_quantity" :min="0" :controls="false" controls-position="right" class="tc-input-number"/>
              </template>
            </el-table-column>
            <el-table-column label="实际完成数量" align="center">
              <el-table-column label="已包装" align="center" width="150px" prop="completed_unpackaged">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.completed_unpackaged" :min="0" :controls="false" controls-position="right" class="tc-input-number"/>
                </template>
              </el-table-column>
              <el-table-column label="未包装" align="center" width="150px" prop="completed_packaged">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.completed_packaged" :min="0" :controls="false" controls-position="right" class="tc-input-number"/>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="箱数" align="center">
              <el-table-column label="已包装" align="center" width="150px" prop="unpackaged">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.unpackaged" :min="0" :controls="false" controls-position="right" class="tc-input-number"/>
                </template>
              </el-table-column>
              <el-table-column label="未包装" align="center" width="150px" prop="packaged">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.packaged" :min="0" :controls="false" controls-position="right" class="tc-input-number"/>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="抽样数" align="center" width="150px" prop="check_quantity">
              <template slot-scope="scope" >
                <el-input-number v-model="scope.row.check_quantity" :min="0" :controls="false" controls-position="right" class="tc-input-number"/>
              </template>
            </el-table-column>
            <el-table-column label="抽箱数" align="center" width="150px" prop="check_package_quantity">
              <template slot-scope="scope" >
                <el-input-number v-model="scope.row.check_package_quantity" :min="0" :controls="false" controls-position="right" class="tc-input-number"/>
              </template>
            </el-table-column>
            <el-table-column align="center" width="50" class="last-column">
              <template slot-scope="scope">
                <el-button type="success" size="mini" icon="el-icon-minus" circle @click="handleRemoveProduct(scope.$index)"/>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="success" icon="el-icon-plus" @click="handleAddProduct">添加</el-button>
        </el-form-item>
        <el-form-item label="是否有箱号" style="margin-bottom: 0px;">
          <el-radio v-model="data.has_package_number" :label="0">没有</el-radio>
          <el-radio v-model="data.has_package_number" :label="1">有</el-radio>
        </el-form-item>
        <el-form-item>
          <el-input
            v-if="data.has_package_number == 1"
            :autosize="{ minRows: 3, maxRows: 5}"
            v-model="data.packag_number"
            type="textarea"
            style="width: 560px;"/>
        </el-form-item>
        <el-form-item  label="备注" :rules="[2, 3].includes(data.conclusion) ? [{ required: true, message: '请填写结论', trigger: 'blur' }] : []"
            prop="remark_content">

            <div style="margin-bottom:12px;">
              <el-select
            v-model="data.remark_title"
            filterable
            default-first-option
            style="width: 560px;">
            <el-option
              v-for="item in configs.remarkTitles"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
            </div>
          <div>
            <el-input
            :autosize="{ minRows: 3, maxRows: 5}"
            
            v-model="data.remark_content"
            type="textarea"
            placeholder="补充说明文字"
            style="width: 560px;"/>
          </div>
        </el-form-item>
        <el-form-item label="图片">
          <tc-upload-image
            :files="data.files"
            :name="'files'"
            @upload="handleUploadFile"
            @remove="handleRemoveFile"/>
        </el-form-item>
        <el-form-item label-width="0" style="text-align: center;">
          <el-button class="tc-report-button" style="outline:none;border:none;" @click="handleComfirm">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import UploadImage from '@/views/report/components/UploadImage'

const defaultData = {
  conclusion: null,
  has_package_number: 0,
  remark_title: '',
  remark_content: '',
  files: [],
  packag_number: '',
  products: []
}

const defaultProduct = {
  section_number: '',
  order_number: '',
  order_quantity: 0,
  shipment_quantity: 0,
  completed_unpackaged: 0,
  completed_packaged: 0,
  unpackaged: 0,
  packaged: 0,
  check_quantity: 0,
  check_package_quantity: 0
}

export default {
  name: 'ReportPartA',
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
      partAShow: true
    }
  },
  methods: {
    setData(data) {
      if (data) {
        this.data = this._.cloneDeep(data)
      } else {
        const _data = this._.cloneDeep(defaultData)
        _data.products = this._.flatMap(this.configs.products, product => {
          return this._.map(product.PO, item => {
            return this._.merge(this._.cloneDeep(defaultProduct), {
              id: product.id,
              section_number: product.number,
              order_number: item.number,
              order_quantity: item.quantity
            })
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
    // 增加商品
    handleAddProduct() {
      this.data.products.push(this._.cloneDeep(defaultProduct))
    },
    // 数据统计
    getSummaries(param) {
      console.log(param, '123123')
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        if (index === 1) {
          sums[index] = ''
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = ''
        }
      })

      return sums
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
    handleComfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.data)
          this.$emit('save', this.data, 'quantity_conformity')
        }
      })
    }
  }
}
</script>
<style lang='scss'>
  .tc-report-card{
    .el-form-item__label {
      text-align: left;
    }
    .is-leaf{
      background-color: #F5F8FA;
    }
    .is-center{
      padding: 0;
    }
    td .cell{
      background-color: #F5F8FA ;
      line-height: inherit;
    }
  }
</style>
