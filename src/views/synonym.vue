<template>
  <div class="container user-mgt">
    <Aside></Aside>
    <Header></Header>
    <div class="m-main">
      <header class="m-mn-title">同义词管理</header>
      <div class="m-mn-body">

                  <header class="mn-bd-tools">
          <div>
            <el-button type="primary" @click="dialogFormVisible = true">添加同义词</el-button>
            <!-- <el-button @click="batchDelete">批量删除</el-button> -->
            <el-button @click="update">更新</el-button>
          </div>
        </header>

        <!-- table--start -->
        <div class="m-table">
          <el-table
            ref="multipleTable"
            :data="primaryTable"
            class="mn-bd-table"
            v-loading="loading"
            element-loading-text="数据加载中..."
            tooltip-effect="light"
            :stripe="true"
            @selection-change="handleSelectionChange"
          >
            <!-- <el-table-column type="selection"></el-table-column> -->

            <el-table-column prop="words"  label="词汇"></el-table-column>

            <el-table-column prop="synonym" :show-overflow-tooltip="true" label="同义词"></el-table-column>

            <!-- <el-table-column prop="qq"
              label="QQ">
            </el-table-column><el-table-column prop="roleNames"
              label="角色">
            </el-table-column>-->
            <el-table-column label="操作" width="160px">
              <template slot-scope="scope">
                <el-button
                  class="el-icon-edit"
                  type="text"
                  @click="handleEdit(scope.$index, scope.row)"
                  size="mini"
                >编辑</el-button>
                <el-popover
                  placement="top"
                  width="150"
                  trigger="click"
                  v-model="scope.row.popover"
                  class="delete-popover"
                >
                  <p>确认删除？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button @click="scope.row.popover = false">取消</el-button>
                    <el-button type="primary" @click="handleDelete(scope.row.id)">确定</el-button>
                  </div>
                  <el-button
                    type="text"
                    class="el-icon-delete"
                    slot="reference"
                    size="mini"
                    style="margin-left:10px;color:#F56C6C"
                  >删除</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-if="total"
            background
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="currentPage"
            style="text-align:right"
          ></el-pagination>
        </div>

        <!-- table-end -->
      </div>

      <!-- dialog-start -->
      <el-dialog
        title="同义词"
        :visible.sync="dialogFormVisible"
        :closeOnClickModal="false"
        @close="clearForm"
        center
      >
        <el-form :model="form" ref="form" label-position="center">
          <el-form-item label="词汇：" prop="words" style="padding-left:1em">
            <el-input placeholder="请输入" v-model.trim="form.words" clearable></el-input>
          </el-form-item>

          <el-form-item label="同义词：" prop="synonym">
            <el-input
              placeholder="请输入"
              v-model.trim="form.synonym"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item>
              <p style="margin:0;color:">多个同义词之间请用“,”分隔</p>
          </el-form-item>

        <div style="text-align:center">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="save" :disabled="btnDisable">保存</el-button>
        </div>

        </el-form>

      </el-dialog> 

      <!-- dialog-end -->
    </div>
  </div>
</template>

<script>
import Aside from "../components/aside";
import Header from "../components/header.vue";
import qs from "querystring";

import {$submitForm } from "../js/common";
import { api_get, api_post } from "../api";
export default {
  components: {
    Aside,
    Header
  },
  watch: {
    currentPage: {
      handler: function(val){
        return this.tableInit(val)
      },
      immediate: true
    },
  },
  methods: {
    update(){
            api_post('/synonym/reload').then(resp => {
        this.Msg(resp.msg, 'success')
      })
    },
    tableInit(currentPage = 1, must = null, size = 10) {
      let from = 10 * (currentPage - 1);
      const data = {
        from,
        must,
        size
      };

      if (!data.must) delete data.must;

      api_post("/synonym/list", JSON.stringify(data), "post", "json").then(
        response => {
          this.primaryTable = response.datas;
          this.total = response.total;
          this.loading = false;
        }
      );
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
      api_post(`synonym/${id}`,null,'delete').then(resp => {
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
          synonym:this.form.synonym.replace(/，/ig,',')
        };
        if(!param.synonym || !param.words){
          this.Msg('不能为空', "warning");
          return;
        }
        let method = param.id ? "put" : "post";
        this.btnDisable = true;
        api_post('synonym', param,method,'json').then(resp => {
          this.Msg(resp.msg, "success");
          this.dialogFormVisible = false;
          this.tableInit(this.currentPage);
        }).finally(resp=>{
          this.btnDisable = false;
        });
      });
    },
    handleEdit(idx, data) {
      let { popover, ...userData } = data;
      this.form = userData;
      this.dialogTitle = "编辑";
      this.dialogFormVisible = true;
    },
    clearForm() {
      //清空表单
      this.$refs.form.resetFields();
      this.form = {
        id: "",
        words:"",
        synonym:""
      }
      // this.form.roleIds = [];
    }
  },
  data() {
    return {
      text: "用户",
      loading: true,
      btnDisable:false,
      fullscreenLoading: false,
      primaryTable: [], //表格数据
      dialogFormVisible: false,
      multipleSelection: [],
      total: 0,
      currentPage: 1,
      form: {
        id: "",
        words:"",
        synonym:""
      },
      dialogTitle: "编辑",
      searchType: "username",
      searchText: ""
    };
  }
};
</script>