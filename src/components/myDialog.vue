<!--
 * @Author: marineyulxl
 * @Date: 2023-04-20 17:21:28
 * @LastEditTime: 2023-04-20 19:34:44
-->
<template>
    <div>
      <el-dialog :close-on-click-modal = "false" v-model="dialogShow" :title="Title" :width="obj.dialogWidth" :before-close="close" draggable>
        <div :style="{height:`${obj.dialogHeight}vh`}">
          <el-scrollbar>
            <slot></slot>
          </el-scrollbar>
        </div>
        <template #footer>
          <span v-if="obj.dialogIsFooter" class="dialog-footer">
            <el-button class="btn-mixins dia-suc" @click="success">{{ obj.dialogSuccessBtnText }}</el-button>
            <el-button class="btn-mixins-clear-default" @click="close">{{ obj.dialogCloseBtnText }}</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
   
  <script lang="ts">
  import { computed } from 'vue'
  export default {
    props: {
      dialogObject: {
        default() {
          return {}
        },
        type: Object
      }
    },
    emits: ['dialogClose', 'dialogSuccess'],
    setup(props, ctx) {
      // const dialogObj = reactive(inject('dialogObj'))
      // 处理props的数据 重新定义 dialogVisible
      const dialogShow = computed({
        get() {
          // getter
          return props.dialogObject.dialogVisible
        },
        set(val) {
          // console.log(val)
          return val
        }
      })
      const Title = computed({
        get() {
          // getter
  
          return props.dialogObject.title
        },
        set(val) {
          //   console.log('1',val)
          return val
        }
      })
      const obj = {
        // dialogTitle: props.dialogObject.title || '标题',
        dialogWidth: props.dialogObject.width || '30%',
        dialogHeight: props.dialogObject.height || '55',
        dialogCloseBtnText: props.dialogObject.closeBtnText || '取消',
        dialogSuccessBtnText: props.dialogObject.successBtnText || '确定',
        dialogIsFooter: props.dialogObject.isFooter || true
      }
      const close = () => {
        ctx.emit('dialogClose', false, 'close')
      }
      const success = () => {
        ctx.emit('dialogSuccess', false, 'success')
      }
      return { obj, dialogShow, close, success, Title }
    }
  }
  </script>
  <style >
  
  
  
  .el-overlay-dialog .el-dialog{
      border-radius: 2px;
    }
  .el-dialog__header {
    border-top-left-radius:2px;
    border-top-right-radius:2px;
    background: #3875b0;
    line-height: 45px;
    padding: 0 15px;
    margin: 0;
  }
  .el-dialog__title{
    font-size: 14px;
    color: #ffffff;
  }
  .el-dialog__headerbtn{
    top: -2px;
  }
  </style>