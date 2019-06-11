<template>
  <div class="login-bd">
    <div class="login-titlte">
      <icon name="robot" scale="20"></icon>
      <h1>海迈智能客服</h1>
    </div>
    <div class="login-introduce">
      <h2>
        <!-- <icon name="quotation"></icon>新一代 数据仓库 -->
        <!-- 海迈智能客服 -->
      </h2>
      <!-- <p>价值数据在大数据中呈现</br>数据管控运筹帷幄
        <icon name="quotation"></icon> -->
      <!-- </p> -->
    </div>
    <div class="login-box"
      v-loading="loading">
      <header>账号登录</header>

      <el-form :model="loginForm"
        :rules="rules"
        ref="loginForm">
        <el-form-item prop="username">
          <div class="ipt-icon">
            <icon name="user"></icon>
          </div>
          <el-input v-model="loginForm.username"
            @keyup.enter.native="submitForm('loginForm')"
            placeholder="请输入账号"
            size="large">
          </el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <div class="ipt-icon">
            <icon name="lock"></icon>
          </div>
          <el-input v-model="loginForm.pwd"
            placeholder="请输入密码"
            type="password"
            @keyup.enter.native="submitForm('loginForm')"
            size="large">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="submitForm('loginForm')"
            size="large">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="login-other">
        <!-- <div class="login-forget">忘记密码？
          <a @click="dialog_findPassword=true">找回密码</a>
        </div> -->
        <div class="register"
          @click="dialog_register = true"><a>注册</a></div>
      </div>
    </div>

    <!-- 用户注册 - start -->
    <el-dialog title="用户注册"
      :visible.sync="dialog_register"
      @close="closeDialog('form_register')">
      <el-form :model="form_register"
        :rules="rules_register"
        ref="form_register"
        label-position="center">

        <el-form-item label="用户名："
          prop="nickname"
          style="padding-left:1em">
          <el-input placeholder="请输入"
            v-model.trim="form_register.nickname"
            clearable></el-input>
        </el-form-item>

        <el-form-item label="昵称："
          prop="username"
          style="padding-left:2em">
          <el-input placeholder="请输入"
            v-model.trim="form_register.username"
            clearable></el-input>
        </el-form-item>

        <el-form-item label="密码："
          prop="pwd"
          style="padding-left:2em">
          <el-input placeholder="请输入"
            v-model.trim="form_register.pwd"
            type="password"
            clearable></el-input>
        </el-form-item>

        <el-form-item label="确认密码："
          prop="pwd">
          <el-input placeholder="请输入"
            v-model.trim="form_register.checkPassword"
            type="password"
            clearable></el-input>
        </el-form-item>

        <el-form-item label="电话："
          prop="mobile"
          style="padding-left:2em">
          <el-input placeholder="请输入"
            v-model.trim="form_register.mobile"
            clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="QQ："
          prop="qq"
          style="padding-left:2.5em">
          <el-input placeholder="请输入"
            v-model.trim="form_register.qq"
            clearable></el-input>
        </el-form-item>

        <el-form-item label="邮箱："
          prop="email"
          style="padding-left:2em">
          <el-input placeholder="请输入"
            v-model.trim="form_register.email"
            clearable></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer"
        class="dialog-footer"
        style="text-align:center">
        <el-button @click="dialog_register = false">取 消</el-button>
        <el-button type="primary"
          @click="confirm_register">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 用户注册 - end -->

    <el-dialog title="找回密码"
      :visible.sync="dialog_findPassword"
      @close="closeDialog('form_findPassword')">
      <el-form :model="form_findPassword"
        :rules="rules_findPassword"
        ref="form_findPassword"
        label-position="center">

        <el-form-item label="用户电话："
          prop="mobile">
          <el-input placeholder="请输入"
            v-model.trim="form_findPassword.mobile"
            clearable>
          </el-input>
        </el-form-item>

        <el-form-item label="验证码："
          prop="captcha"
          style="padding-left:1em">
          <el-input placeholder="请输入"
            v-model.trim="form_findPassword.captcha"
            clearable></el-input>
        </el-form-item>

        <el-form-item label="新密码："
          prop="password"
          style="padding-left:1em">
          <el-input placeholder="请输入"
            v-model.trim="form_findPassword.password"
            type="password"
            clearable></el-input>
        </el-form-item>

        <el-form-item label="确认密码："
          prop="checkPassword">
          <el-input placeholder="请输入"
            v-model.trim="form_findPassword.checkPassword"
            type="password"
            clearable></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
        class="dialog-footer"
        style="text-align:center">
        <el-button @click="dialog_findPassword = false">取 消</el-button>
        <el-button type="primary"
          @click="changePassword">确 定</el-button>
      </div>
    </el-dialog>

  </div>
  </div>
</template>
<script>
import { $submitForm } from "../js/common";
// import { login } from "../api/authority/user"
import {
  api_post, api_get,
} from '../api'

import qs from 'querystring'
import { $msg } from '../js/common';
export default {

  watch: {

  },

  computed: {
    userInfo() {
      return this.$store.state.user.name;
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(
        function (valid) {
          if (!valid) return;
          this.loading = true;
          let param = {
            username: this.loginForm.username,
            pwd: this.loginForm.pwd
          }
          api_post('login', qs.stringify(param)).then(response => {

            if (response.status !== 'success') return $msg(response.msg, 'warning');

            this.$store.commit("SETLOGIN", JSON.stringify(response.datas));
            let path = this.$route.query.redirect;
            console.log(path)
            this.$router.push({ path: path || 'interlocutionMgt' });
          }).finally(() => {
            this.loading = false;
          })
        }.bind(this)
      );
    },
    confirm_register() {
      $submitForm(this, "form_register").then(() => {
        const { id, deptName, checkPassword, popover, roles, ...form } = this.form_register;
        form.status = 1;
        api_post('/addUser', JSON.stringify(form), 'post', 'json').then(response => {
          $msg('注册成功!', 'success');
          this.dialog_register = false;

        }).catch(() => { })
      })
    },
    changePassword() {
      this.$refs["form_findPassword"].validate((valid) => {
        if (valid) {
          let { checkPassword, ...param } = this.form_findPassword;

          api_post('user/forgetPwd', qs.stringify(param), 'put').then((resp) => {
            $msg('修改密码成功!', 'success');
            this.dialog_findPassword = false;
          })
        }
      })
    },
    getCatptcha(form = 'form_findPassword') {
      this.$refs[form].validateField('mobile', (valid) => {
        if (!valid) {
          let { mobile } = this[form];
          this.catptchaFlag = 60;
          api_get(`/user/captcha?mobile=${mobile}`);
        }
      });
    },
    closeDialog(ref) {
      this.$refs[ref].resetFields(function (valid) {

      })
    }
  },
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form_register.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {//先这样吧没空改
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form_findPassword.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        pwd: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: ["change", "blur"]
          }
        ],
        pwd: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["change", "blur"]
          }
        ],
        captcha: [
          {
            required: true,
            message: "请输入验证码",
            trigger: ["change", "blur"]
          }
        ]
      },
      loading: false,
      dialog_register: false,
      dialog_findPassword: false,
      form_register: {
        username: "",
        nickname: "",
        email: "",
        qq: "",
        mobile: "",
        pwd: ""
      },
      form_findPassword: {
        mobile: "",
        captcha: "",
        password: "",
        checkPassword: ""
      },
      rules_findPassword: {
        pwd: [
          { required: true, trigger: 'blur', message: "密码不能为空", }
        ],
        checkPassword: [
          { validator: validatePass2, trigger: 'blur' }
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
        ],
        captcha: [{
          required: true,
          message: "输入不能为空",
          trigger: ["blur", "change"]
        }]
      },
      rules_register: {
        username: [
          {
            required: true,
            message: "输入不能为空",
            trigger: ["blur", "change"]
          }
        ],
        pwd: [
          { required: true, trigger: 'blur', message: "密码不能为空", }
        ],
        checkPassword: [
          { validator: validatePass, trigger: 'blur' }
        ],
        nickname: [
          {
            required: true,
            message: "输入不能为空",
            trigger: ["blur", "change"]
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
        qq: [
          {
            required: true,
            message: "输入不能为空",
            trigger: ["blur"]
          },
          {
            pattern: /^[1-9]\d{4,9}$/,
            message: "请输入正确的qq"
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
        ],
        captcha: [{
          required: true,
          message: "输入不能为空",
          trigger: ["blur", "change"]
        }]
      },
    };
  }
};
</script>
<style lang="scss">
@import "../sass/login.scss";
</style>
