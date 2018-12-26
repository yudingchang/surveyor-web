<template>
  <el-form ref="targetForm" :model="target" class="targetForm">
    <el-form-item style="width:428px;">
      <!-- 选择国家 -->
      <el-col :span="8">
        <el-form-item
          :rules="[{ required: true, message: $t('rules.required.country'), trigger: 'blur' }]"
          prop="country"
        >
          <el-select v-model="target.country_id" style="width: 100%;" @change="handleCountryChange">
            <el-option
              v-for="item in countryOptions"
              :key="item.id"
              :label="item.chinese_name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="15">
        <el-form-item
          :rules="[{ required: true, message: $t('rules.required.address'), trigger: 'blur' }]"
          prop="country"
          style="width: 100%;"
        >
          <el-cascader
            :options="locationOptions"
            v-model="target.location_ids"
            :props="{label:'chinese_name',value:'id',children:'children_simple'}"
            expand-trigger="hover"
            filterable
            style="width: 100%;"/>
        </el-form-item>
      </el-col>
      <!-- 选择国家 -->
    </el-form-item>
  </el-form>
</template>

<script>
// import Map from '../../components/Map.vue'
// import stringLength from 'string-length'
import { fetchList, fetchCounty } from '@/api/fetch'

export default {
  name: 'InspectionTarget',
  components: { 'tc-map': Map },
  props: {
    target: {
      required: true,
      type: Object,
      default: () => {}
    },
    translation: {
      type: String,
      default: 'user'
    },
    hasSetMap: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      dialogLoading: false,
      currentAddressIndex: undefined,
      mapDialogVisible: false,
      locationOptions: [],
      countryOptions: [],
      address: []
    }
  },
  watch: {
    'target.country_id'(newValue, oldValue) {
      // if (newValue && newValue != oldValue) {
      //   this.fillLocationOptions(newValue)
      // }
      this.fillLocationOptions(newValue)
    }
  },
  created() {
    //   console.log(this.countryOptions)
    this.getCountryOptions()
  },
  methods: {
    // 查找国家
    getCountryOptions() {
      fetchList().then(response => {
        if (response.data.code == 0) {
          this.$nextTick(function() {
            this.countryOptions = response.data.data
            console.log(this.countryOptions)
            // Code that will run only after the
            // entire view has been rendered
          })
        }
      })
    },
    // 查找国家
    filterCountryLabel(val) {
      const country = this.lodash.find(this.$store.getters.configs.countries, country => {
        return country.id == val
      })
      return country ? country.chinese_name : ''
    },
    // 查找地址
    filterLocationLabel(val) {
      let address = ''
      let current = this.locationOptions
      this.lodash.each(val, id => {
        const i = this.lodash.find(current, location => {
          return location.id == id
        })
        if (i) {
          address += i.chinese_name
        }
        current = i.children_simple ? i.children_simple : []
      })
      return address
    },
    handleMapDialogOpened() {
      const that = this
      const location = this.target.position
      this.dialogLoading = true

      this.$nextTick(() => {
        setTimeout(() => {
          const address = this.filterCountryLabel(this.target.country) +
            this.filterLocationLabel(this.target.address) +
            this.target.address_detail

          const map = new window.BMap.Geocoder()
          if (!location) {
            // 地址转坐标
            map.getPoint(address, function(point) {
              if (point) {
                that.$refs.map.setLocation(point)
              } else {
                that.$message.error('定位失败，请手动定位')
              }
            })
          } else {
            that.$refs.map.setLocation(location)
          }
          that.dialogLoading = false
        }, 1000)
      })
    },

    // 选择国家
    handleCountryChange(val) {
      this.target.address = []
      // this.fillLocationOptions(val)
    },
    fillLocationOptions(val) {
      this.locationOptions = []
      fetchCounty({ pid: val }).then(response => {
        this.$nextTick(function() {
          this.locationOptions = response.data.data
        })
      })
    },

    handleSetLocation() {
      this.mapDialogVisible = true
    },
    handleSaveLocation() {
      const that = this
      const point = this.$refs.map.getLocation()
      this.target.position = point

      // if (stringLength(address.address) === 0) {
      //   const map = new window.BMap.Geocoder()
      //   map.getLocation(new window.BMap.Point(point.lng, point.lat), function(result) {
      //     if (result) {
      //       address.address = result.address
      //     } else {
      //       that.$message.error('定位失败，请手动定位')
      //     }
      //   })
      // }
      this.mapDialogVisible = false
    }
  }
}
</script>
<style>
    .targetForm .el-form-item__content{
        width: 100%;
    }
</style>
