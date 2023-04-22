<!--
 * @Author: marineyulxl
 * @Date: 2023-03-31 19:28:01
 * @LastEditTime: 2023-04-20 21:39:29
-->
<template>
  <div>
		<el-button type="primary" @click="getdata">dianwo</el-button>
  </div>
</template>

<script setup lang='ts'>
import {ref,reactive} from 'vue'
import { getProduct,updateProduct } from '../api/product';
const getdata =async ()=>{
	console.log(1);	
	updateProduct('642a5e5721129340db2ef9a1',{name:"羊杂"}).then(res=>{
		console.log(res);
		
	})

	
}
</script>

<style scoped>

</style>