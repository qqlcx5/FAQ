<template>
  <div class="container user-mgt">
    <Aside></Aside>
    <Header></Header>
    <div class="m-main">
      <header class="m-mn-title">代码管理</header>
      <div class="m-mn-body">
        <header class="mn-bd-tools">
          <div>
            <!-- <el-button @click="batchDelete">批量删除</el-button> -->
          </div>
        </header>

        <!-- table--start -->
        <div class="m-table">
          <el-table ref="multipleTable" :data="primaryTable" class="mn-bd-table" v-loading="loading"
            element-loading-text="数据加载中..." tooltip-effect="light" :stripe="true"
            @selection-change="handleSelectionChange">
            <!-- <el-table-column type="selection"></el-table-column> -->
            <el-table-column label="类型">
              <template
                slot-scope="scope">{{ scope.row.style === 'link' ? '链接式' : scope.row.style === 'icon' ? '图标式' : '浮窗式'}}</template>
            </el-table-column>

            <el-table-column prop="skin" label="皮肤">
              <template slot-scope="scope">{{ scope.row.skin === 'web' ? 'web端' : '微信端'}}</template>
            </el-table-column>

            <el-table-column label="生成时间">
              <template slot-scope="scope">{{ scope.row.updateTime }}</template>
            </el-table-column>

            <el-table-column label="链接文字">
              <template slot-scope="scope">
                <p v-html="escape2Html(scope.row.linkText)"></p>
              </template>
            </el-table-column>

            <!-- <el-table-column prop="qq"
              label="QQ">
            </el-table-column><el-table-column prop="roleNames"
              label="角色">
            </el-table-column>-->
            <el-table-column label="操作" width="160px">
              <template slot-scope="scope">
                <el-button class="el-icon-edit" type="text" @click="handleEdit(scope.$index, scope.row)" size="mini">编辑
                </el-button>
                <el-popover placement="top" width="150" trigger="click" v-model="scope.row.popover"
                  class="delete-popover">
                  <p>确认删除？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button @click="scope.row.popover = false">取消</el-button>
                    <el-button type="primary" @click="handleDelete(scope.row.id)">确定</el-button>
                  </div>
                  <el-button type="text" class="el-icon-delete" slot="reference" size="mini"
                    style="margin-left:10px;color:#F56C6C">删除</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination v-if="total" background layout="prev, pager, next" :total="total"
            :current-page.sync="currentPage" style="text-align:right"></el-pagination>
        </div>

        <!-- table-end -->
      </div>

      <!-- dialog-start -->
      <el-dialog title="获取代码" :visible.sync="dialogFormVisible" :closeOnClickModal="false" v-if="dialogFormVisible" center>
        <el-code :editCode="codeForm" @setDialogFormVisible="setDialogFormVisible"></el-code>
      </el-dialog>

      <!-- dialog-end -->
    </div>
  </div>
</template>

<script>
  import Aside from "../components/aside";
  import Header from "../components/header.vue";
  import elCode from "../components/getCode";
  import qs from "querystring";

  import {
    $submitForm,
    $formatDateTime,
    $escape2Html
  } from "../js/common";
  import {
    api_get,
    api_post
  } from "../api";
  export default {
    components: {
      Aside,
      Header,
      elCode
    },
    watch: {
      currentPage: {
        handler: function (val) {
          return this.tableInit(val);
        },
        immediate: true
      },
      dialogFormVisible: {
        handler: function (val) {
          if (!val) {
            this.codeForm = ''
          }
        }
      }
    },
    methods: {
      tableInit(currentPage = 1, must = null, size = 10) {
        let from = 10 * (currentPage - 1);
        const data = {
          from,
          must,
          size
        };

        if (!data.must) delete data.must;

        api_post("/searchSetting", JSON.stringify(data), "post", "json").then(
          response => {
            this.primaryTable = response.data && JSON.parse(response.data);
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      formatDateTime(time) {
        return $formatDateTime(new Date(time));
      },
      escape2Html(str) {
        return $escape2Html(str);
      },

      handleSelectionChange(ids) {
        return multipleSelection.call(this, ids);
      },

      heandleSearch() {
        let must = null;
        if (this.searchText) {
          must = {};
          must[this.searchType] = this.searchText;
        }

        this.tableInit(1, must);
      },

      handleDelete(id) {
        let param = {
          id: id
        };
        api_post(`deleteSetting`, qs.stringify(param)).then(resp => {
          this.tableInit(this.currentPage);
        });
      },

      batchDelete() {
        list_delete.call(this);
      },
      save() {
        $submitForm(this, "form").then(() => {
          let param = {
            ...this.form,
            synonym: this.form.synonym.replace(/，/gi, ",")
          };
          let method = param.id ? "put" : "post";

          api_post("synonym", param, method, "json").then(resp => {
            this.Msg(resp.msg, "success");
            this.dialogFormVisible = false;
            this.tableInit(this.currentPage);
          });
        });
      },
      handleEdit(idx, data) {
        let {
          popover,
          ...form
        } = data;
        this.codeForm = form;
        this.dialogFormVisible = true;
      },
      clearForm() {
        //清空表单
        this.$refs.form.resetFields();
        this.form = {
          id: "",
          words: "",
          synonym: ""
        };
        // this.form.roleIds = [];
      },
      setDialogFormVisible(visible = false) {
        this.dialogFormVisible = false;
        this.tableInit(this.currentPage)
      }
    },
    data() {
      return {
        text: "用户",
        loading: true,
        fullscreenLoading: false,
        primaryTable: [], //表格数据
        dialogFormVisible: false,
        multipleSelection: [],
        total: 0,
        codeForm: '',
        currentPage: 1,
        dialogTitle: "编辑",
        searchType: "username",
        searchText: ""
      };
    }
  };
</script>