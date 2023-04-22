<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.name" placeholder="分类名" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch()">搜索</el-button>
				<el-button  type="danger" @click="resetQuery">重置</el-button>
				<el-button type="primary" :icon="Plus" @click="handleAdd()">新增</el-button>
			</div>
			<el-table :data="tableData" class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="name" label="分类名称">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>	
				<el-table-column prop="createdAt" label="创建时间"></el-table-column>
				<el-table-column prop="updatedAt" label="修改时间"></el-table-column>
				<el-table-column label="操作" width="220" align="center">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
							编辑
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index,scope.row)" v-permiss="16">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="footer">
				<div style="margin-top: 20px">
					<!-- <el-button @click="toggleSelection()">清空</el-button> -->
				</div>
				<!-- 分页 -->
				<div class="demo-pagination-block">
					<el-pagination background v-model:current-page="query.page" v-model:page-size="query.limit"
						:page-sizes="[5, 10, 20]" layout="total,sizes, prev, pager, next" :total="pageTotal"
						@current-change="handlePageChange" @size-change="handleSizeChange" />
				</div>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog :title="dialogTitle" v-model="editVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item label="分类名称">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
        <el-form-item label="创建时间" v-if="dialogTitle=='编辑分类'">
					<el-input v-model="form.createdAt" disabled></el-input>
				</el-form-item>
        <el-form-item label="修改时间"  v-if="dialogTitle=='编辑分类'">
					<el-input v-model="form.updatedAt" disabled></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit()">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
 
<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';

import {getCategory,getLimitCategory,updateCategory,deleteCategory,createCategory} from '../api/category'
interface TableItem {
	_id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

const query = reactive({
	name: '',
	page: 1,
	limit: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = async () => {
  try {
    const { data: res } = await getLimitCategory(query)
    res.data.forEach((item: TableItem) => {
			const date = new Date(item.createdAt);
			item.createdAt = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
			const date2 = new Date(item.updatedAt);
			item.updatedAt = `${date2.getFullYear()}/${date2.getMonth() + 1}/${date2.getDate()} ${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()}`;
    })
    tableData.value = res.data
		  tableData.value.reverse()
		  pageTotal.value = res.total
   
  } catch (error:any) {
    if (error.response.status === 404) {
			const res = error.response.data
			tableData.value = res.data
			pageTotal.value = res.total
			ElMessage.error(error.response.data.message);
		}
  }
	
};
getData();

// 查询操作
const handleSearch = () => {
	query.page = 1;
	getData();
};
//重置
const resetQuery = () => {
	query.page = 1
	query.limit = 10
	query.name = ''
	getData();
}
// 分页导航
const handlePageChange = (val: number) => {
	query.page = val;
	console.log(query);
	getData();
};
const handleSizeChange = (val: number) => {
	query.limit = val;
	getData();
}

// 删除操作
const handleDelete = (index: number,row:any) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			deleteCategory(row._id).then(res => {
        console.log(res);
        
			ElMessage.success(res.data.message);
			getData()
		}).catch((err) => {
			console.log(err);
      ElMessage.error(err.response.data.message);
		});
		})
		.catch(() => {});
};
const handleAdd=()=>{
  form.name=''
  dialogTitle.value = "新增分类"
  editVisible.value=true
}
// 表格编辑时弹窗和保存
const editVisible = ref(false);
const dialogTitle=ref<string>('分类')
let form = reactive({
	name: '',
  createdAt:"",
  updatedAt:''
});
let productId: string = '';
const handleEdit = (index: number, row: any) => {
  dialogTitle.value='编辑分类'
	productId = row._id;
	form.name = row.name;
  form.createdAt=row.createdAt;
  form.updatedAt=row.updatedAt
	editVisible.value = true;
};
const saveEdit = () => {
	editVisible.value = false;
  if(dialogTitle.value=='编辑分类'){
    updateCategory(productId, form.name).then(res => {
			ElMessage.success(res.data.message);
			getData()
		}).catch(err=>{
		ElMessage.error(err.response.data.message);
	})
  }else {
	createCategory(form.name).then(res=>{
		ElMessage.success(res.data.message);
			getData()
	}).catch(err=>{
		ElMessage.error(err.response.data.message);
	})
  }
		

};
</script>

<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 300px;
}
.table {
	width: 100%;
	font-size: 14px;
}
.red {
	color: #F56C6C;
}
.mr10 {
	margin-right: 10px;
}
.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}
.footer {
	display: flex;
	justify-content: space-between;
}

.demo-pagination-block {
	margin-top: 18px;
}
</style>
