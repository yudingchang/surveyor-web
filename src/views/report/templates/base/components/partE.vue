<template>
  <div v-loading="loading" class="tc-report-card">
    <div :class="{titleChange:!partEShow}" class="tc-report-card-title clearfix">
      <span><span class="titleText">E</span>外观及工艺</span>
      <span class="right" style="float:right;color:#FFA800" @click="partEShow=!partEShow">
        <span v-if="partEShow">收起</span>
        <span v-if="!partEShow">展开</span>
        <i :class="{rotaga:!partEShow}" class="el-icon-caret-top"/>
      </span>
    </div>
    <div v-show="partEShow" class="tc-report-card-content">
      <el-form ref="form" :model="data" label-width="70px">
        <el-form-item v-if="data.sampling" label-width="0" style="margin: 0 0 24px 0;">
          <table cellspacing="0" cellpadding="0" border="0" class="tc-table" style="width: 100%">
            <tbody>
              <tr>
                <td style="width: 270px;" class="background-gray">
                  检验标准
                </td>
                <td colspan="3">
                  {{ _.get(_.find(_.get(configs, 'samplings.options', []), { value: data.sampling.type }), 'label') }}
                </td>
              </tr>
              <tr v-if="data.sampling.type === 1">
                <td class="background-gray">
                  抽样水平
                </td>
                <td colspan="3">
                  {{ _.get(_.find(_.get(configs, 'samplings.levels', []), item => { return item.value == data.sampling.params.level }), 'label') }}
                </td>
              </tr>
              <tr v-if="data.sampling.type === 2">
                <td class="background-gray">
                  抽样比例
                </td>
                <td colspan="3">
                  {{ data.sampling.params.proportion }}%
                  <!-- {{ _.get(_.find(_.get(configs, 'samplings.options', []), { level: data.sampling.params.proportion }), 'label') }} -->
                </td>
              </tr>
              <tr>
                <td class="background-gray">抽样数量</td>
                <td colspan="3">{{ data.sampling.params.quantity }}</td>
              </tr>
              <tr>
                <td class="background-gray">缺陷分类</td>
                <td>致命缺陷</td>
                <td>严重缺陷</td>
                <td>轻微缺陷</td>
              </tr>
              <tr>
                <td class="background-gray">可接受质量限（AQL）</td>
                <td>{{ data.sampling.params.fatal_defect_limit ? data.sampling.params.fatal_defect_limit : 'N/A' }}</td>
                <td>{{ data.sampling.params.serious_defect_limit ? data.sampling.params.serious_defect_limit : 'N/A' }}</td>
                <td>{{ data.sampling.params.minor_defect_limit ? data.sampling.params.minor_defect_limit : 'N/A' }}</td>
              </tr>
              <tr>
                <td class="background-gray">最大允许值</td>
                <td>{{ data.sampling.params.fatal_defect }}</td>
                <td>{{ data.sampling.params.serious_defect }}</td>
                <td>{{ data.sampling.params.minor_defect }}</td>
              </tr>
              <tr>
                <td class="background-gray">实际发现</td>
                <td>{{ data.real_fatal_defect }}</td>
                <td>{{ data.real_serious_defect }}</td>
                <td>{{ data.real_minor_defect }}</td>
              </tr>
            </tbody>
          </table>
        </el-form-item>
        
        <!-- :rules="((data.real_fatal_defect>data.sampling.params.fatal_defect) || (data.real_serious_defect>data.sampling.params.serious_defect) || (data.real_minor_defect>data.sampling.params.minor_defect)) ? [{ required: true, message:'请输入备注内容', trigger: 'blur' }] : []" -->
        <el-form-item label="备注" label-width="70px" prop='remark' :rules="((data.real_fatal_defect>data.sampling.params.fatal_defect) || (data.real_serious_defect>data.sampling.params.serious_defect) || (data.real_minor_defect>data.sampling.params.minor_defect)) ? [{ required: true, message:'请输入备注内容', trigger: 'blur' }] : []">
          <el-input
            :autosize="{ minRows: 3, maxRows: 5}"  
            v-model="data.remark"
            type="textarea"
            placeholder="请输入备注内容"
            style="width: 100%;"/>
        </el-form-item>

        <div v-for="(product, index) in data.products" :key="'p'+index">
          <el-form-item label-width="100px">
            <template slot="label">
              <span>{{ (index+1).toString() }}</span>
              款号/型号
            </template>
            <span style="margin-right: 1rem;">{{ product.number ? product.number : 'N/A' }}</span>
            <el-input v-if="!product.number" v-model="product.name" style="width: 300px;" placeholder="请输入款号或名称"/>
            <span style="margin-left: 1rem;">抽样数</span>
            <!-- <span style="margin-right: 1rem;">{{ product.check_quantity ? product.check_quantity : 'N/A' }}</span> -->
            <el-input v-model="product.check_quantity" style="width: 150px;" placeholder="请输入数量"/>
            <el-button v-if="!product.id" type="success" @click="handleRemoveProduct(index)">删除产品</el-button>
            <!-- <i v-if="!product.id" class="el-icon-close tc-remove" @click=""/> -->
            
          </el-form-item>
          <el-form-item :rules="[{ required: true, message: '请选择是否有缺陷', trigger: 'blur' }]" label="是否有缺陷" :prop="'products.'+index+'.has_defect'" label-width="100px">
            <el-radio
              v-for="item in defectList"
              v-model="product.has_defect"
              @change="resetForm('form')"
              :key="item.value"
              :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-form-item>
          <el-form-item label-width="0" style="margin: 0 0 24px 0;" v-if="product.has_defect==1">
            <el-table
              :data="product.defective_items"
              border
              class="tc-writable-table"
              style="width: 100%">
              <el-table-column label="缺陷类别" align="center" width="180px">
                <template slot-scope="scope">
                  <el-form-item
                    :rules="[{ required: true, message:'请选择缺陷类别', trigger: 'change' }]"
                    :prop="'products.'+index+'.defective_items.'+scope.$index+'.title'"
                    label-width="0"
                    class="tc-form-item">
                    <el-select v-model="scope.row.title" style="width: 100%; max-width: 100%;">
                      <el-option
                        v-for="item in configs.defectiveCategories"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="缺陷项目" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.description" placeholder="请输入" />
                </template>
              </el-table-column>
              <el-table-column label="致命缺陷" align="center" width="180px">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.fatal_defect" :min="0" :controls="false" placeholder="请输入" controls-position="right" class="tc-input-number-ld"/>
                </template>
              </el-table-column>
              <el-table-column label="严重缺陷" align="center" width="180px">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.serious_defect" :min="0" :controls="false" placeholder="请输入" controls-position="right" class="tc-input-number-ld"/>
                </template>
              </el-table-column>
              <el-table-column label="轻微缺陷" align="center" width="180px">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.minor_defect" :min="0" :controls="false" placeholder="请输入" controls-position="right" class="tc-input-number-ld"/>
                </template>
              </el-table-column>
              <el-table-column align="center" width="50">
                <template slot-scope="scope">
                  <el-button type="success" size="mini" icon="el-icon-minus" circle @click="handleRemoveDefectiveItem(product, scope.$index)"/>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label-width="0" style="margin: 0 0 22px 0;" v-if="product.has_defect==1">
            <el-button type="success" icon="el-icon-plus" @click="handleAddDefectiveItem(product)">添加缺陷项</el-button>
          </el-form-item>
          <el-form-item label="图片" v-if="product.has_defect==1">
            <tc-upload-image
              :files="product.files"
              :name="'products.'+index+'.files'"
              @upload="handleUploadFile"
              @remove="handleRemoveFile"/>
          </el-form-item>
          
        </div>
        <el-form-item label-width="0" style="margin: 0 0 22px 0;" >
            <el-button type="success" icon="el-icon-plus" @click="addProduct(product)">添加产品</el-button>
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
  sampling: {
    params:{

    }
    },
  products: [],
  remark:'',
  real_fatal_defect: 0,
  real_serious_defect: 0,
  real_minor_defect: 0
}
const defaultProduct = {
  number: '',
  name: '',
  check_quantity: 0,
  defective_items: [],
  remark_content: '',
  files: []
}
const defaultDefectiveItem = {
  title: null,
  description: '',
  fatal_defect: null,
  serious_defect: null,
  minor_defect: null
}

export default {
  name: 'ReportPartE',
  components: {
    'tc-upload-image': UploadImage
  },
  props: {
    configs: {
      required: true,
      type: Object
    },
    sampling: {
      required: true,
      type: Object | null
    }
  },
  data() {
    return {
      loading: true,
      data: this._.cloneDeep(defaultData),
      defectList:[
      {
        value:1,
        label:'有'
      },{
        value:0,
        label:'无'
      }],
      partEShow: true
    }
  },
  watch: {
    'data.products': {
      handler(val) {
        this.$nextTick(() => {
          const items = this._.flatten(this._.map(this.data.products, 'defective_items'))
          this.data.real_fatal_defect = this._.sum(this._.map(items, 'fatal_defect'))
          this.data.real_serious_defect = this._.sum(this._.map(items, 'serious_defect'))
          this.data.real_minor_defect = this._.sum(this._.map(items, 'minor_defect'))
        })
      },
      deep: true
    }
  },
  methods: {
    setData(data) {
      if (data) {
        
        this.data = this._.cloneDeep(data)
      } else {
        const _data = this._.cloneDeep(defaultData)
        _data.sampling = this._.cloneDeep(this.sampling)
        _data.products = this._.map(this.configs.products, product => {
          return this._.merge(this._.cloneDeep(defaultProduct), {
            id: product.id,
            number: product.number,
            name: product.name,
            check_quantity: product.check_quantity
          })
        })
        this.data = _data
        console.log(this.data)
      }
      this.loading = false
    },
    handleRemoveProduct(index) {
      this.data.products.splice(index, 1)
    },
    // 增加缺陷项
    handleAddDefectiveItem(product) {
      product.defective_items.push(this._.cloneDeep(defaultDefectiveItem))
    },
    // 增加产品
    addProduct(product){
      this.data.products.push(this._.cloneDeep(defaultProduct))
    },
    // 删除缺陷项
    handleRemoveDefectiveItem(product, index) {
      product.defective_items.splice(index, 1)
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
            message: '外观及工艺保存成功',
            type: 'success'
          })
          const _data = this._.cloneDeep(defaultData)
          _data.real_fatal_defect = this.data.real_fatal_defect
          _data.real_minor_defect = this.data.real_minor_defect
          _data.real_serious_defect = this.data.real_serious_defect
          _data.remark = this.data.remark
          _data.sampling = this.data.sampling
          _data.products = this.data.products.map((item,index)=>{
            return{
              ...item,
              defective_items:item.defective_items.map((items,index)=>{
                return {
                  ...items,
                  check_quantity: item.check_quantity,
                  number:item.number,
                  name:item.name,
                }
              })
            }
          })
          
          
          console.log(_data)
          // this.data = this.data.
          this.$emit('save', _data, 'visual_and_workmanship')
        }
      })
    }
  }
}
</script>
