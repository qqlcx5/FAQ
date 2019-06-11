<template>
  <div class="container">
    <elHeader></elHeader>
    <elAside></elAside>
    <div class="m-main">
      <header class="m-mn-title">类别管理</header>
      <div class="m-mn-body">
        <div class="mn-bd-box">
          <div class="tree">
            <div class="tree-hd">
              <el-input placeholder="请输入关键字"
                        v-model="filterText"></el-input>
            </div>
            <el-tree @node-drop="handleDrop"
                     class="filter-tree"
                     :data="filterCategory"
                     :props="categrateProps"
                     ref="filterTree"
                     default-expand-all
                     :expand-on-click-node="false"
                     :filter-node-method="filterNode"
                     node-key="id">
              <span class="custom-tree-node"
                    slot-scope="{$index, node, data }">
                <span class="tree-text">{{ node.label }}</span>
                <span>
                  <el-button type="text"
                             class="edit fa fa-pencil-square-o"
                             size="mini"
                             @click="() => editCategory(data, node)"
                             :disabled="node.key === 'root'"></el-button>
                  <el-button type="text"
                             class="apend fa fa-plus-square-o"
                             size="mini"
                             @click="() => appendCategory(data, node)"></el-button>
                  <el-popover placement="top-end"
                              :offset="-5"
                              :value="isVisibleDel === data.id"
                              :key="$index"
                              style="margin-bottom:5px;">
                    <p>确定删除“{{data.name}}”类别吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini"
                                 type="text"
                                 @click="isVisibleDel = ''">取消</el-button>
                      <el-button type="primary"
                                 size="mini"
                                 @click="() => {removeCategory(data);isVisibleDel = ''}"
                                 :disabled="node.key === 'root'">确定</el-button>
                    </div>
                    <el-button slot="reference"
                               type="text"
                               class="delete fa fa-trash-o"
                               size="mini"
                               style="margin-left:10px;"
                               @click="popoverDel(data.id)"
                               :disabled="node.key === 'root'"></el-button>
                  </el-popover>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
    </div>
    <!--- m-main-end -->
    <el-dialog class="small-dialog"
               width="20%"
               title="类别管理"
               :visible.sync="dialogCategoryVisible"
               @close="dialogCategoryClose"
               center>
      <div>
        <el-form :model="categoryForm"
                 :rules="categoryRule"
                 ref="categoryForm"
                 label-position="center">
          <el-form-item label="名称"
                        prop="name">
            <el-input placeholder="请输入名称"
                      v-model.trim="categoryForm.name"
                      maxlength="15"
                      clearable></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary"
                       @click="saveCategory"
                       :disabled="!categoryForm.name">确定</el-button>
            <el-button @click="dialogCategoryVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { api_get, api_post } from '../api'
import qs from 'querystring'
import { postCategory, dragUpdateCategory } from '../api/commonApi'
import { $isRepeatNode } from '../js/common'
export default {
  created () {
    postCategory(this.$store)
  },
  watch: {
    filterText (val) {
      this.$refs.filterTree.filter(val);
    }
  },
  computed: {
    ...mapGetters(['filterCategory'])
  },
  methods: {
    handleDrop (draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType);
      if (draggingNode && dropNode && draggingNode.data.id && dropNode.data.id) {
        let params = {
          parentId: dropNode.parent.data.id,
          sourceId: draggingNode.data.id,
          targetId: dropNode.data.id,
          direction: dropType
        }
        dragUpdateCategory(this.$store, params)
      }
    },
    allowDrop (draggingNode, dropNode, type) {
      if (dropNode.data.id === 'root') {
        return false;
      }
      return true;
    },
    allowDrag (draggingNode) {
      if (draggingNode.data.id === 'root') {
        return false;
      }
      return true;
    },
    popoverDel (id) {
      this.isVisibleDel = id
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    dialogCategoryClose () {
      this.$refs.categoryForm.resetFields()
      this.categoryForm = this.defaultCategoryForm
    },
    editCategory ({ ...data }, parentNode) {
      this.dialogCategoryVisible = true
      this.curretLevelNodes = parentNode.parent.childNodes;
      this.$nextTick(() => this.categoryForm = data)
    },
    appendCategory (data, parentNode) {
      let parentId = data.id;
      this.dialogCategoryVisible = true
      this.curretLevelNodes = parentNode.childNodes;

      this.$nextTick(() => this.categoryForm = {
        ...this.categoryForm,
        parentId: parentId
      })
    },
    removeCategory ({ ...data }) {
      let form = {
        id: data.id
      }
      api_post('deleteClass', qs.stringify(form)).then(() => {
        postCategory(this.$store)
      })
    },
    saveCategory () {
      let method = 'appendClass';
      let { children, id, ...form } = { ...this.categoryForm };
      if (this.categoryForm.id) {
        form.menuId = this.categoryForm.id;
        delete form.order
        console.log(form)
        method = 'updateClass';

      }
      this.$refs.categoryForm.validate((valid) => {
        if (valid) {
          api_post(method, form).then(() => {
            postCategory(this.$store)
            this.dialogCategoryVisible = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  data () {
    const categoryForm = {
      name: ''
    }
    let validatorName = (rule, value, callback) => {
      // 不能为空
      console.log
      if (value.trim() === '') {
        return callback(new Error('请输入名称'))
      }
      if ($isRepeatNode(this.curretLevelNodes, value)) {
        return callback(new Error('名称已被占用，请重新输入！'))
      }
      // 成功
      callback()
    }
    return {
      isVisibleDel: false,
      curretLevelNodes: [],
      dialogCategoryVisible: false,
      categoryForm: categoryForm,
      categoryRule: {
        name: [
          { required: true, validator: validatorName, trigger: 'blur' }
        ]
      },
      defaultCategoryForm: categoryForm,
      filterText: '',
      categrateProps: {
        value: 'id',
        label: 'name'
      },
    };
  }
};
</script>

<style lang="scss">
@import "../sass/categoryMgt.scss";
</style>

