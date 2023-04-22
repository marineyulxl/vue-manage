<template>
	<div>
		<div class="container">
			<el-table :data="tableData" class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="name" label="关联商品">
          <template #default="scope">{{ scope.row.product?.name }}</template>
        </el-table-column>
        <el-table-column label="轮播图(查看大图)" align="center">
					<template #default="scope">
						<el-image
							class="table-td-thumb"
							:src="scope.row.imageUrl"
							:z-index="10"
							:preview-src-list="[scope.row.imageUrl]"
							preview-teleported
						>
						</el-image>
					</template>
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
					<el-button @click="handleAdd()">添加轮播图</el-button>
				</div>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog :title="dialogTitle" v-model="editVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item label="关联商品">
					<el-select v-model="form.product">
            <el-option v-for="item in productes" :key="item._id" :label="item.name"
							:value="item._id"></el-option>
          </el-select>
				</el-form-item>
        <el-form-item label="轮播图图片">
					<el-upload v-model:file-list="fileList" action="#" list-type="picture-card" :on-remove="handleRemove"
						:on-change="handleChange" :auto-upload="false">
						<el-icon>
							<Plus />
						</el-icon>
					</el-upload>
				</el-form-item>
        <el-form-item label="创建时间" v-if="dialogTitle=='编辑轮播图'">
					<el-input v-model="form.createdAt" disabled></el-input>
				</el-form-item>
        <el-form-item label="修改时间"  v-if="dialogTitle=='编辑轮播图'">
					<el-input v-model="form.updatedAt" disabled></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveSubmit()">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
 
<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { baseURL } from '../utils/baseUrl'
import { getSwiper,updateSwiper,delectSwiper,createSwiper} from '../api/swiper';
import { getProductAll } from "../api/product";
import type { UploadProps, UploadUserFile } from 'element-plus'
interface  product{
  _id:string,
  name:string
}
interface TableItem {
	_id: string;
	imageUrl: string;
  product:product;
	createdAt: string;
	updatedAt: string;
}
interface category {
	id: string;
	name: string
}
interface images {
	[index: number]: string;
}
interface product{
  _id: string;
	name: string;
	description: string;
	category: category;
	price: number;
	images: images[];
	createdAt: string;
	updatedAt: string
}
const tableData = ref<TableItem[]>([]);
const productes =ref<product[]>([])
const pageTotal = ref(0);
// 获取表格数据
const getData = async () => {
  try {
    const { data: res } = await getSwiper()
    res.data.forEach((item: TableItem) => {
      item.imageUrl =baseURL + item.imageUrl
			const date = new Date(item.createdAt);
			item.createdAt = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
			const date2 = new Date(item.updatedAt);
			item.updatedAt = `${date2.getFullYear()}/${date2.getMonth() + 1}/${date2.getDate()} ${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()}`;
    })
    
    tableData.value = res.data
   
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
const GetProductAll=async ()=>{
  try {
    const {data : res} =await getProductAll()
    productes.value=res.data
  } catch (error:any) {
    ElMessage.error(error.response.data.message);
  }
}
GetProductAll()
// 删除操作
const handleDelete = (index: number,row:any) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			delectSwiper(row._id).then(res => {
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

  dialogTitle.value = "新增轮播图"
  editVisible.value=true
}
//轮播图
const fileList = ref<UploadUserFile[]>([])
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  if(fileList.value.length==1)
  {
    ElMessage.error('只能有一张图片！');
    uploadFiles.pop()
  }else{
    console.log(uploadFile.raw);
    
    form.imageUrl=uploadFile.raw
	// console.log(uploadFile, uploadFiles)
  }

}
// 表格编辑时弹窗和保存
const editVisible = ref(false);
const dialogTitle=ref<string>('分类')
let form = reactive({
	product:'',
  createdAt:"",
  updatedAt:'',
  imageUrl: undefined as any |undefined,
});

let productId: string = '';
const handleEdit = (index: number, row: any) => {

  dialogTitle.value='编辑轮播图'
  fileList.value = []
  fileList.value.push({name:row.imageUrl,url:row.imageUrl})
	productId = row._id;
	form.product = row.product._id;
  form.createdAt=row.createdAt;
  form.updatedAt=row.updatedAt
	editVisible.value = true;
};
const saveSubmit = () => {
	editVisible.value = false;
  const formData = new FormData()
  formData.append('product',form.product)
  if(form.imageUrl){
    formData.append('imageUrl',form.imageUrl)
  }
 
  console.log(form.imageUrl);
  
  if(dialogTitle.value=='编辑轮播图'){
    updateSwiper(productId, formData).then(res => {
      console.log(res);
      
			ElMessage.success(res.data.message);
			getData()
		}).catch(err=>{
		ElMessage.error(err.response.data.message);
	})
  }else {
    createSwiper(formData).then(res=>{
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
