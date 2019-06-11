<template>
  <el-date-picker v-model="datetimerangeValueData"
    :type="type"
    :picker-options="pickerOptions"
    :firstDayOfWeek="7"
    :default-time="['00:00:00','23:59:59']"
    range-separator="~"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    align="right"
    @change="datetimerangeChange"></el-date-picker>
</template>

<script>
import { $getLatelyTotalDays } from '../js/common'
export default {
  props: [
    'datetimerangeValue',
    'type'
  ],
  methods: {
    datetimerangeChange(val) {
      this.$emit('datetimerangeValueChange', val);
    }
  },
  watch: {
    datetimerangeValue(val) {
      this.datetimerangeValueData = val;
    }
  },
  data() {
    return {
      datetimerangeValueData: this.datetimerangeValue,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            const lately3Month = $getLatelyTotalDays(end, 3) || 90
            console.log(lately3Month)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * lately3Month);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  }
};
</script>
