<template>
  <div class="container user-mgt">
    <Aside></Aside>
    <Header></Header>
    <div class="m-main">
      <header class="m-mn-title">用户管理</header>
      <div class="m-mn-body">
        <header class="mn-bd-tools">
          <div>
            <el-button type="primary"
                       @click="dialogFormVisible = true,dialogTitle = '新增'">新增</el-button>
            <!-- <el-button @click="batchDelete">批量删除</el-button> -->
          </div>
          <div class="mn-bd-tools_search">
            <el-select v-model="searchType"
                       placeholder="请选择"
                       class="searchType">
              <el-option label="用户名"
                         value="username"></el-option>
              <el-option label="昵称"
                         value="nickname"></el-option>
              <el-option label="电话"
                         value="mobile"></el-option>
              <el-option label="邮箱"
                         value="email"></el-option>
            </el-select>
            <el-input placeholder="搜索..."
                      v-model.trim="searchText"
                      class="searchText"
                      clearable>
              <el-button slot="append"
                         icon="el-icon-search"
                         @click="heandleSearch"></el-button>
            </el-input>
          </div>
        </header>

        <!-- table--start -->
        <div class="m-table">
          <el-table ref="multipleTable"
                    :data="primaryTable"
                    class="mn-bd-table"
                    v-loading="loading"
                    element-loading-text="数据加载中..."
                    tooltip-effect="light"
                    :stripe="true"
                    @selection-change="handleSelectionChange">
            <!-- <el-table-column type="selection"></el-table-column> -->

            <el-table-column prop="username"
                             :show-overflow-tooltip="true"
                             label="用户名"></el-table-column>

            <el-table-column prop="nickname"
                             label="昵称"></el-table-column>

            <el-table-column prop="mobile"
                             label="电话号码"></el-table-column>

            <el-table-column prop="email"
                             label="邮箱"></el-table-column>

            <!-- <el-table-column prop="qq"
              label="QQ">
            </el-table-column><el-table-column prop="roleNames"
              label="角色">
            </el-table-column>-->
            <el-table-column label="操作"
                             width="160px">
              <template slot-scope="scope">
                <el-button class="el-icon-edit"
                           type="text"
                           @click="handleEdit(scope.$index, scope.row)"
                           size="mini">编辑</el-button>
                <el-popover placement="top"
                            width="150"
                            trigger="click"
                            v-model="scope.row.popover"
                            class="delete-popover">
                  <p>确认删除？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button @click="scope.row.popover = false">取消</el-button>
                    <el-button type="primary"
                               @click="handleDelete(scope.row.id)">确定</el-button>
                  </div>
                  <el-button type="text"
                             class="el-icon-delete"
                             slot="reference"
                             size="mini"
                             style="margin-left:10px;color:#F56C6C">删除</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination v-if="total"
                         background
                         layout="prev, pager, next"
                         :total="total"
                         :current-page.sync="currentPage"
                         style="text-align:right"></el-pagination>
        </div>

        <!-- table-end -->
      </div>

      <!-- dialog-start -->
      <el-dialog :title="`${dialogTitle}用户`"
                 :visible.sync="dialogFormVisible"
                 :closeOnClickModal="false"
                 @close="clearForm"
                 center>
        <el-form :model="form"
                 :rules="rules"
                 ref="form"
                 label-position="center">
          <el-form-item label="昵称："
                        prop="nickname"
                        style="padding-left:1em">
            <el-input placeholder="请输入"
                      v-model.trim="form.nickname"
                      clearable></el-input>
          </el-form-item>

          <el-form-item label="用户名："
                        prop="username">
            <el-input placeholder="请输入"
                      v-model.trim="form.username"
                      :disabled="dialogTitle === '编辑'"
                      clearable></el-input>
          </el-form-item>

          <el-form-item label="密码："
                        prop="pwd"
                        style="padding-left:1em">
            <el-input v-if="dialogTitle === '新增'"
                      placeholder="请输入"
                      v-model.trim="form.pwd"
                      type="pwd"
                      clearable
                      disabled></el-input>
            <el-button v-else
                       style="width: 218px;"
                       type="warning"
                       @click='restPwd'
                       plain>重置密码为123456</el-button>
          </el-form-item>

          <el-form-item label="电话："
                        prop="mobile"
                        style="padding-left:1em">
            <el-input placeholder="请输入"
                      v-model.trim="form.mobile"
                      clearable></el-input>
          </el-form-item>

          <el-form-item label="QQ："
                        prop="qq"
                        style="padding-left:1.5em">
            <el-input placeholder="请输入"
                      v-model.trim="form.qq"
                      clearable></el-input>
          </el-form-item>

          <el-form-item label="邮箱："
                        prop="email"
                        style="padding-left:1em">
            <el-input placeholder="请输入"
                      v-model.trim="form.email"
                      clearable></el-input>
          </el-form-item>

          <!-- <el-form-item label="角色："
            prop="roleNames"
            style="padding-left:2em">
            <el-select v-model="form.roleIds"
              value-key="id"
              multiple
              placeholder="请选择">
              <el-option v-for="item in roleList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>-->
        </el-form>

        <div style="text-align:center">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="save">保存</el-button>
        </div>
      </el-dialog>

      <!-- dialog-end -->
    </div>
  </div>
</template>

<script>
import Aside from "../components/aside";
import Header from "../components/header";
import qs from "querystring";

import { $submitForm } from "../js/common";
import { api_get, api_post } from "../api";
export default {
  components: {
    Aside,
    Header
  },
  watch: {
    currentPage: {
      handler: function (val) {
        return this.tableInit(val)
      },
      immediate: true
    },
    dialogFormVisible (value) {
      if (value && this.dialogTitle === "编辑")
        this.$nextTick(() => {
          this.form = {
            ...this.userForm
          }
        })
    }
  },
  methods: {
    tableInit (currentPage = 1, must = null, size = 10) {
      let from = 10 * (currentPage - 1);
      const data = {
        from,
        must,
        size
      };

      if (!data.must) delete data.must;

      api_post("userSearch", JSON.stringify(data), "post", "json").then(
        response => {
          this.primaryTable = response.datas;
          this.total = response.total;
          this.loading = false;
        }
      );
    },

    handleSelectionChange (ids) {
      return multipleSelection.call(this, ids);
    },

    heandleSearch () {
      let must = null;
      if (this.searchText) {
        must = {};
        must[this.searchType] = this.searchText;
      }

      this.tableInit(1, must);
    },

    handleDelete (id) {
      let parm = {
        id: id
      };
      api_post("deleteUser", qs.stringify(parm)).then(resp => {
        this.tableInit(this.currentPage);
      });
    },

    batchDelete () {
      list_delete.call(this);
    },
    save () {
      $submitForm(this, "form").then(() => {
        let param = {
          ...this.form
        };
        let api = param.id ? "updateUser" : "addUser";

        api_post(api, param).then(resp => {
          this.Msg(resp.msg, "success");
          this.dialogFormVisible = false;
          this.tableInit(this.currentPage);
        });
      });
    },
    handleEdit (idx, data) {
      console.log(idx, data)
      let { popover, ...userData } = data;
      this.userForm = userData;
      this.dialogTitle = "编辑";
      this.dialogFormVisible = true;
    },
    restPwd () {
      let param = {
        id: this.userForm.id
      }
      console.log(param, 'params')
      api_post('http://192.168.102.54:8090/restPwd', qs.stringify(param)).then(resp => {
        this.Msg(resp.msg, "success");
      });
    },
    clearForm () {
      //清空表单
      this.$refs.form.resetFields();
      this.form.id = "";
      // this.form.roleIds = [];
    }
  },
  data () {
    return {
      text: "用户",
      loading: true,
      fullscreenLoading: false,
      primaryTable: [], //表格数据
      dialogFormVisible: false,
      dialogTransferVisible: false,
      multipleSelection: [],
      total: 0,
      currentPage: 1,
      roleList: [],
      form: {
        id: "",
        username: "",
        nickname: "",
        email: "",
        mobile: "",
        pwd: "123456"
        // orgId: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "输入不能为空",
            trigger: ["blur", "change"]
          }
        ],
        nickname: [
          {
            required: true,
            message: "输入不能为空",
            trigger: ["blur", "change"]
          }
        ],
        qq: [
          {
            required: false,
            trigger: ["blur"]
          },
          {
            pattern: /^[1-9]\d{4,9}$/,
            message: "请输入正确的qq格式"
          }
        ],
        email: [
          {
            required: true,
            message: "输入不能为空",
            trigger: ["blur"]
          },
          {
            pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
            message: "请输入正确的邮箱格式"
          }
        ],
        mobile: [
          {
            required: true,
            message: "输入不能为空",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: "请输入正确的手机格式"
          }
        ]
      },
      dialogTitle: "编辑",
      searchType: "username",
      searchText: ""
    };
  }
};
</script>