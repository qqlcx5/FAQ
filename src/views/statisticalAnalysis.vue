<template>
  <div class="container">
    <elHeader></elHeader>
    <elAside></elAside>
    <div class="m-main">
      <header class="m-mn-title">统计分析</header>
      <div class="m-mn-body">
        <header class="mn-bd-hd">
          <el-form ref="filterForm"
                   class="inline-form"
                   :model="filterForm">
            <el-form-item v-if="0"
                          label="问题类别："
                          prop="classification"
                          class="inlineBlock"
                          style="margin-right:30px">
              <el-cascader :options="selectFilterCategory"
                           v-model="filterForm.classification"
                           :props="categrateProps"></el-cascader>
            </el-form-item>
            <el-form-item label="时间范围："
                          prop="datetimerangeValue"
                          class="inlineBlock"
                          style="margin-right:30px">
              <elDatetimerange :datetimerangeValue="filterForm.datetimerangeValue"
                               type="daterange"
                               @datetimerangeValueChange="datetimerangeValueChange"></elDatetimerange>
            </el-form-item>
            <el-form-item class="inlineBlock">
              <div class="btn-group">
                <el-button type="primary"
                           @click="filterQuery"
                           plain>查询</el-button>
              </div>
            </el-form-item>
          </el-form>
        </header>
        <div class="result-box">
          <header>统计结果</header>
          <ul>
            <li class="result-item"
                v-for="(item,index) in resultLst"
                :key='index'>
              <div class="bgImg">
                <span :class="['fa',item.icon ]"></span>
              </div>
              <div class="detail">
                <span class="name">{{item.name}}</span>
                <span class="value">{{item.value}}</span>
              </div>
            </li>
          </ul>
        </div>
        <ul class="chart-panel">
          <li>
            <header>问答统计情况</header>
            <Chart :options="categoryPolar"
                   theme="macarons"
                   auto-resize></Chart>
          </li>
          <li>
            <header>FAQ趋势统计</header>
            <Chart :options="faqAnalysis"
                   theme="macarons"
                   auto-resize></Chart>
          </li>
        </ul>
        <div class="tags-cloud">
          <header>标签云统计</header>
          <Chart :options="tagsCloud"
                 theme="macarons"
                 auto-resize
                 style="width:100%;height:240px;"></Chart>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { postCategory } from '../api/commonApi'
import { api_post } from '../api'
import { $formatDateTime } from '../js/common'
import datetimerange from '../components/datetimerange'
import handleQueryParm from '../js/queryParm'
import polar from '../js/polar'
import 'echarts-wordcloud'
export default {
  created () {
    this.getAllChart();
    // postCategory(this.$store)
  },
  components: {
    elDatetimerange: datetimerange
  },
  computed: {
    filterCategory () {
      let lst = JSON.parse(JSON.stringify(this.$store.getters.filterCategory));
      if (lst.length) {
        lst = lst[0].children;
      }
      return lst
    },
    selectFilterCategory () {
      let lst = JSON.parse(JSON.stringify(this.filterCategory));
      lst.unshift({
        name: '全部',
        id: '-1'
      })
      return lst;
    }
  },
  methods: {
    datetimerangeValueChange (val) {
      this.filterForm.datetimerangeValue = val;
    },
    getAllChart (filter) {
      handleQueryParm('category', filter).then((resp) => {//问答统计情况
        this.categoryPolar = polar.pie(resp)
      });

      handleQueryParm('faq', filter).then((resp) => {//faq趋势
        this.faqAnalysis = polar.bar(resp)
      });

      api_post('/getHotWordCloud', {
        top: 200
      }).then(resp => {
        this.tagsCloud = polar.tag(resp.datas, {
          tooltip: {
            show: true
          },
          toolbox: {
            right: '25px',
            feature: {
              saveAsImage: {
                iconStyle: {
                  normal: {
                    color: '#FFFFFF'
                  }
                }
              }
            }
          }
        })
      });

      this.resultLst.forEach((item, index, arr) => {
        handleQueryParm(item.id, filter).then((resp) => {
          item.value = polar.single(resp)
          arr[index] = item;
        });
      })
    },
    filterQuery () {
      //先不管类别

      let dateRange = this.filterForm.datetimerangeValue;//时间区间
      if (!dateRange || !dateRange.length) {
        this.getAllChart()
        return;
      };

      let startVal = $formatDateTime(dateRange[0], 'date');
      let endVal = $formatDateTime(dateRange[1], 'date');

      let dateFilter = [
        {
          startVal: startVal,
          endVal: endVal,
          formatType: "y-m-d"
        }
      ];
      let sendObj = { dateFilter: dateFilter }

      this.getAllChart(sendObj)

    }
  },
  data () {
    return {
      categrateProps: {
        value: 'id',
        label: 'name'
      },
      filterForm: {
        datetimerangeValue: '',
        classification: ['-1']
      },
      resultLst: [{
        id: 'questionTotal',
        name: '问答总数（个）',
        value: 124345,
        icon: 'fa-database',
      }, {
        id: 'satisfaction',
        name: '满意数（个）',
        value: 23345,
        icon: 'fa-thumbs-o-up'
      }, {
        id: 'noAnswer',
        name: '待解决（个）',
        value: 23345,
        icon: 'fa-question'

      }, {
        id: 'closed',
        name: '已关闭（个）',
        value: 2333,
        icon: 'fa-plug'
      }],
      categoryPolar: {},
      faqAnalysis: {},
      tagsCloud: {}
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../sass/statisticalAnalysis";
.tags-cloud {
  width: 90%;
  height: 290px;
  border: 1px solid #e3e4e8;
  border-radius: 6px;
  margin-bottom: 30px;
  header {
    padding: 15px;
  }
}
</style>

