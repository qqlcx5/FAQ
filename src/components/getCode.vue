<template>
  <div class="m-main get-code">
    <header class="m-mn-title">获取代码</header>
    <div class="m-mn-body">
      <el-tabs class="step" v-model="activeTab">
        <!-- 链接式 --start-->
        <el-tab-pane label="链接式" name="link">
          <header class="step-hd">
            <span class="step-num">1</span>输入链接文字
          </header>
          <div>
            <div class="editor fixed-width" ref="editor"></div>
          </div>
        </el-tab-pane>

        <!-- 链接式 --end-->
        <!-- 图标式 --start-->
        <el-tab-pane label="图标式" name="icon">
          <header class="step-hd">
            <span class="step-num">1</span>选择图标样式
          </header>
          <div class="step-pannel">
            <div class="icon-radio-group">
              <el-radio v-model="codeForm.icon" label="iconRobot1">
                <div class="w-icon w-icon-iconFloatRobot1"></div>
              </el-radio>
              <!-- <el-radio v-model="codeForm.icon" label="iconRobot2">
                  <div class="w-icon w-icon-iconRobot2"></div>
              </el-radio>-->
            </div>
          </div>
        </el-tab-pane>

        <!-- 图标式 --end-->
        <!-- 浮窗式 --start-->
        <el-tab-pane label="浮窗式" name="floatIcon">
          <header class="step-hd">
            <span class="step-num">1</span>选择图标样式
          </header>
          <div class="step-pannel">
            <div class="icon-radio-group">
              <el-radio v-model="codeForm.floatIcon" label="iconFloatRobot1">
                <div class="w-icon w-icon-iconFloatRobot1"></div>
              </el-radio>
              <!-- <el-radio v-model="codeForm.floatIcon" label="iconFloatRobot1">
                  <div class="w-icon w-icon-iconFloatRobot2"></div>
                </el-radio>
                <el-radio v-model="codeForm.floatIcon" label="iconFloatRobot2">
                  <div class="w-icon w-icon-iconFloatRobot3"></div>
              </el-radio>-->
            </div>
          </div>
        </el-tab-pane>

        <!-- 浮窗式 --end-->
      </el-tabs>

      <div class="step fixed-width step-skin">
        <header class="step-hd">
          <span class="step-num">2</span>选择聊天皮肤
        </header>
        <div class="step-pannel">
          <dl>
            <dt>网页：</dt>
            <dd>
              <div class="img-box">
                <el-radio v-model="codeForm.skin" label="web">
                  <img src="../assets/img/web.jpg" alt="pc端">
                </el-radio>
              </div>
            </dd>
            <dt>微信：</dt>
            <dd>
              <div class="img-box">
                <el-radio v-model="codeForm.skin" label="mobile">
                  <img src="../assets/img/mobile.jpg" alt="移动端">
                </el-radio>
              </div>
            </dd>
          </dl>
        </div>
      </div>

      <div class="step fixed-width">
        <header class="step-hd">
          <span class="step-num">3</span>设置图标位置
        </header>
        <div class="step-pannel">
          <div>
            <el-radio v-model="codeForm.position" :label="0">位于浏览器左侧</el-radio>
            <el-radio v-model="codeForm.position" :label="1">位于浏览器右侧</el-radio>
          </div>

          <div class="input-box">
            <el-input v-model.number="codeForm.horizonta" type="number">
              <el-button slot="prepend">距离浏览器{{codeForm.position ? '右' : '左'}}侧</el-button>
              <el-button slot="append">px</el-button>
            </el-input>
          </div>

          <div class="input-box">
            <el-input v-model.number="codeForm.vertical" type="number">
              <el-button slot="prepend">距离浏览器底部</el-button>
              <el-button slot="append">px</el-button>
            </el-input>
          </div>
        </div>
      </div>
      <div class="step fixed-width">
        <header class="step-hd">
          <span class="step-num">4</span>生成代码
        </header>
        <div class="step-pannel">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="code"
            ref="codeInput"
            resize="none"
          ></el-input>
          <div style="display:flex;">
            <el-button
              type="primary"
              style="margin-right:auto"
              @click="addCode"
            >{{this.editCode ?'生成代码并修改': '生成代码'}}</el-button>
            <el-button type="primary" @click="preview" v-if="codeSrc">预览</el-button>
            <el-button type="primary" @click="copy">复制</el-button>
            <el-button type="primary" @click="closeDialog">关闭</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from "wangeditor";
import { api_get, api_post } from "../api";
import { $msg, $escape2Html } from "../js/common";
export default {
  components: {
    "remote-js": {
      render(h) {
        return h("script", { attrs: { src: this.src } });
      },
      props: {
        src: { type: String }
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.itemHandleShow();
    });
  },
  props: ["editCode"],
  watch: {
    editCode: {
      handler: function(val) {
        if (!val) return;
        const {
          skin,
          style,
          id,
          linkText,
          position,
          marginBottom,
          marginSide
        } = val;
        this.activeTab = style;
        this.codeForm = {
            id,
          skin,
          linkText,
          vertical: marginBottom,
          horizonta: marginSide,
          position: position === "left" ? 0 : 1
        };
      },
      immediate: true
    }
  },
  methods: {
    itemHandleShow() {
      if (this.activeTab === "link") {
        if (!this.$refs.editor) return;
        this.editor = new Editor(this.$refs.editor);
        this.editor.customConfig.onchange = html => {
          this.codeForm.linkText = html;
        };

        this.editor.customConfig.menus = this.editorMenus;

        this.editor.create();
      }
      this.editor.txt.html($escape2Html(this.codeForm.linkText));
    },

    addCode() {
      const { position, horizonta, vertical, skin } = this.codeForm;

      let param = {
        style: this.activeTab,
        position: position ? "right" : "left",
        marginSide: horizonta,
        marginBottom: vertical,
        skin
      };
      if (param.style === "link")
        param.linkText = this.codeForm.linkText.replace(/"/g, "'");
        if(this.codeForm.id)param.id = this.codeForm.id;
        let api = 'addSysSetting';
        if(this.editCode)api = 'updateSetting';

      api_post(api, JSON.stringify(param), "post", "json").then(
        resp => {
          this.codeSrc = resp.data;
          this.code = `<script src=${resp.data}><\/script>`;
        }
      );
    },
    preview() {
      document.getElementById("hymakeFAQRobot") &&
        document.body.removeChild(hymakeFAQRobot);
      let body = document.body;
      let scriptTag = document.createElement("script");
      scriptTag.src = this.codeSrc;
      scriptTag.id = "codeScript";
      body.appendChild(scriptTag);
    },
    copy() {
      if (!this.code) return;

      this.$refs.codeInput.select();

      if (document.execCommand("copy")) {
        document.execCommand("copy");
        $msg("复制成功", "success");
      }
    },
    closeDialog(){
        this.$emit('setDialogFormVisible' );
    }
  },
  data() {
    return {
      activeTab: "link",
      codeForm: {
        linkText: "智能客服",
        icon: "iconRobot1",
        floatIcon: "iconFloatRobot1",
        position: 0,
        vertical: 50,
        horizonta: 50,
        skin: "web"
      },
      code: "",
      codeSrc: "",
      editor: "",
      editorMenus: [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "code", // 插入代码
        "undo", // 撤销
        "redo" // 重复
      ]
    };
  }
};
</script>

<style lang="scss">
@import "../sass/getCode";
</style>