<!--
 * @Author: marineyulxl
 * @Date: 2023-04-20 17:11:50
 * @LastEditTime: 2023-04-20 19:52:15
-->
<template>
    <div class="form">
        <el-form :model="props.formData" label-width="120px" class="inform" ref="formRef">
            <el-form-item v-for="item, index in props.formItem" :key="item.property" :label="item.label" label-width="140px"
                :prop="item.property">
                <el-input v-if="item.type === 'Input'" v-model="props.formData[item.property]" :disabled="item.disabled||false"></el-input>
                <el-switch v-if="item.type === 'Switch'" v-model="props.formData[item.property]"/>
                <el-select placeholder="" v-if="item.type === 'Select'" v-model="props.formData[item.property]">
                    <el-option v-for="i in item.options" :key="i.value" :label="i.label" :value="i.value" />
                </el-select>
                <el-input :rows="5" type="textarea" placeholder="Please input" v-if="item.type === 'textarea'"  v-model="props.formData[item.property]"/>
            </el-form-item>

        </el-form>
    </div>
</template>

<script setup lang="ts">
import { Switch } from '@element-plus/icons-vue';
import { reactive,nextTick } from 'vue'
import { ref ,watch} from 'vue'

const value = ref('')
const formRef = ref()

// do not use same name with ref

// type from_item = {
//     label: string, property: string
// }
const props = defineProps({
    formItem: {
        type: Array as any,
        default: () => []
    },
    formData:{
        type:Object,
        default: () => {}
    }
})
const form:any = reactive({})
const initFormData=()=>{
// props.formItem.forEach((item:any)=>{
//     // console.log(item);
//     if(item.property){
//         form[item.property]=item.value || ' ';
//     }
    
// })
}
watch(props.formItem, (newValue) => {
    console.log('formitem:为', newValue);
    console.log(props.formData,'1');
    
    initFormData()
},{
    immediate:true
})

//清空
const reset=()=>{
    console.log('调用了该方法',formRef)
    formRef.value.resetFields()
}
defineExpose({ reset,formRef });
</script>

<style scoped>
.input {
    width: 60%;
}

.form {
    display: flex;
    justify-content: center;
}

.inform {
    transform: translateX(-20%);
}
</style>