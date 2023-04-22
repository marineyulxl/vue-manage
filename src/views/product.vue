<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="query.category" placeholder="分类查询" class="handle-select mr10">
					<el-option v-for="item in category" :key="item._id" :label="item.name" :value="item._id"></el-option>
				</el-select>
				<el-input v-model="query.name" placeholder="商品名字" class="handle-input mr10"></el-input>
				<el-button type="primary" plain :icon="Search" @click="handleSearch">查询</el-button>
				<el-button plain type="danger" @click="resetQuery">重置</el-button>
			</div>
			<el-table v-loading="loading" :data="tableData" class="table" ref="multipleTableRef"
				header-cell-class-name="table-header" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" />
				<el-table-column prop="name" label="商品名称"></el-table-column>
				<el-table-column prop="description" label="商品描述" :formatter="formatDescription">
				</el-table-column>

				<el-table-column label="商品分类" width="100">
					<template #default="scope">{{ scope.row.category.name }}</template>
				</el-table-column>
				<el-table-column label="商品价格">
					<template #default="scope">
						<span style="color: red;">￥{{ scope.row.price }}</span></template>
				</el-table-column>
				<el-table-column label="商品图片(查看大图)" align="center">
					<template #default="scope">
						<el-image class="table-td-thumb" :src="scope.row.images[0]" :z-index="10"
							:preview-src-list="[scope.row.images[0]]" preview-teleported>
						</el-image>
					</template>
				</el-table-column>
				<el-table-column prop="createdAt" label="创建时间"></el-table-column>
				<el-table-column prop="updatedAt" label="修改时间"></el-table-column>
				<el-table-column label="操作" width="180" align="center">
					<template #default="scope">
						<!-- 编辑-->
						<el-tooltip effect="dark" content="编辑" placement="top">
							<el-icon @click="handleEdit(scope.$index, scope.row)" color="#409EFF" size="16px" class="mgr20">
								<EditPen />
							</el-icon>
						</el-tooltip>
						<!-- 删除 -->
						<el-tooltip effect="dark" content="删除" placement="top">
							<el-icon @click="handleDelete(scope.$index, scope.row)" color="#F56C6C" size="16px"
								class="mgr20">
								<Delete />
							</el-icon>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<div class="footer">
				<div style="margin-top: 20px">
					<el-button-group>
						<el-button type="default" plain @click="handleAdd()">添加</el-button>
						<!-- <el-button type="default" plain >清空</el-button> -->
						<el-button type="danger" @click="handleDeletes()">批量删除</el-button>
					</el-button-group>
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

		<!-- 编辑新增弹出框 -->
		<el-dialog :title="dialogTitle" v-model="editVisible" width="30%" close-on-click-modal>
			<el-form label-width="70px">
				<el-form-item label="商品名称">
					<el-input v-model="form.name" placeholder="请输入商品名称"></el-input>
				</el-form-item>
				<el-form-item label="商品描述">
					<el-input v-model="form.description" :rows="4" type="textarea" placeholder="请输入商品描述"></el-input>
				</el-form-item>
				<el-form-item label="商品价格">
					<el-input v-model="form.price" placeholder="请输入商品价格"></el-input>
				</el-form-item>
				<el-form-item label="商品价格">
					<el-select v-model="form.category" placeholder="分类查询" class="handle-select mr10">
						<el-option v-for="item in category" :key="item._id" :label="item.name"
							:value="item._id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商品图片">
					<el-upload v-model:file-list="fileList" action="#" list-type="picture-card" :on-remove="handleRemove"
						:on-change="handleChange" :auto-upload="false">
						<el-icon>
							<Plus />
						</el-icon>
					</el-upload>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveSubmit()">确 定</el-button>
				</span>
			</template>
		</el-dialog>
		<el-dialog v-model="dialogVisible">
			<img w-full :src="dialogImageUrl" alt="Preview Image" />
		</el-dialog>
	</div>
</template>
 
<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { getProduct, updateProduct, deleteProduct, addProduct ,deleteProducts} from '../api/product';
import { baseURL } from '../utils/baseUrl'
import { getCategory } from '../api/category'
import type { UploadProps, UploadUserFile } from 'element-plus'
import type { UploadFile } from 'element-plus/lib/components/upload';

const dialogTitle = ref<string>('商品管理')
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
	const [baseUrl, imagePath] = uploadFile.name.split('/images/')
	const deleteImage: string = `/images/${imagePath}`
	form.deleteImages.push(deleteImage)
	console.log(form.deleteImages, '1');

}
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
	form.images.push(uploadFile)
	console.log(uploadFile, uploadFiles)
}
interface category {
	id: string;
	name: string
}
interface images {
	[index: number]: string;
}

interface TableItem {
	_id: string;
	name: string;
	description: string;
	category: category;
	price: number;
	images: images[];
	createdAt: string;
	updatedAt: string
}
interface categoryItem {
	_id: string;
	name: string;
	createdAt: string;
	updatedAt: string
}
interface Form {
	name: string;
	description: string;
	price: string;
	category: string;
	images: UploadFile[];
	deleteImages: string[]
}
let query = reactive({
	page: 1,
	limit: 10,
	name: '',
	category: '',
	sort: '',
});
const category = ref<categoryItem[]>([]);
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
let loading = ref<boolean>(false)
// 多选
const multipleSelection = ref<TableItem[]>([])
const handleSelectionChange = (val: TableItem[]) => {
	multipleSelection.value = val
}
// 获取表格数据
const getData = async () => {
	loading.value = true
	try {
		const { data: res } = await getProduct(query);
		res.data.forEach((item: TableItem) => {
			item.images = item.images.map(element => element = baseURL + element);
			const date = new Date(item.createdAt);
			item.createdAt = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
			const date2 = new Date(item.updatedAt);
			item.updatedAt = `${date2.getFullYear()}/${date2.getMonth() + 1}/${date2.getDate()} ${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()}`;

		})
		tableData.value = res.data
		tableData.value.reverse()
		pageTotal.value = res.total

		loading.value = false
	} catch (err: any) {
		console.log(err);
		if (err.response.status === 404) {
			const res = err.response.data
			tableData.value = res.data
			pageTotal.value = res.total
			ElMessage.error(err.response.data.message);
		}

		loading.value = false
	}
};
getData();
// 获取分类
const getCategoryData = async () => {
	try {
		const { data: res } = await getCategory()
		category.value = res.data
	} catch (error) {
		console.log(error);

	}
}
getCategoryData()
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
	query.category = ''
	query.sort = ''
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
//增加操作
const handleAdd = () => {
	resetForm()
	dialogTitle.value = "新增商品"
	editVisible.value = true;
}
// 删除操作
const handleDelete = (index: number, row: any) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	}).then(() => {
		deleteProduct(row._id).then(res => {
			ElMessage.success(res.data.message);
			getData()
		}).catch((err) => {
			console.log(err);
			ElMessage.error(err.response.data.message);
		});

	})
		.catch(() => { });
};
const handleDeletes=()=>{
	const ids = multipleSelection.value.map(row => row._id);
	// 二次确认删除
	ElMessageBox.confirm('确定要删除该分类以及属下商品？', '提示', {
		type: 'warning'
	}).then(() => {
		deleteProducts(ids).then(res => {
			console.log("批量删除",res);
			
			ElMessage.success(res.data.message);
			getData()
		}).catch((err) => {
			console.log(err);
			ElMessage.error(err.response.data.message);
		});

	})
		.catch(() => { });
	console.log(ids);
	
}
// 表格编辑时弹窗和保存
const editVisible = ref(false);
const fileList = ref<UploadUserFile[]>([])
let form = reactive<Form>({
	name: '',
	description: '',
	price: '',
	category: '',
	images: [],
	deleteImages: []
});
const resetForm =()=>{
	console.log(111);
	productId = '';
	form.name = '';
	form.price = '';
	form.description = '';
	form.category = '',
	form.images= [],
	form.deleteImages= []
	fileList.value=[]
}
let productId: string = '';
const handleEdit = (index: number, row: any) => {
	dialogTitle.value = "编辑商品"
	//这点有体验bug
	fileList.value = []
	row.images.forEach((image: any) => {
		fileList.value.push({ name: image, url: image });
	})
	productId = row._id;
	form.name = row.name;
	form.price = row.price;
	form.description = row.description;
	form.category = row.category._id

	editVisible.value = true;
};
//保存
const saveSubmit = () => {
	editVisible.value = false;
	console.log(form);
	const formData = new FormData();
	formData.append('name', form.name);
	formData.append('description', form.description);
	formData.append('category', form.category);
	formData.append('price', form.price);
	form.images.forEach((image: any) => {
		formData.append('images', image.raw);
	});
	form.deleteImages.forEach((image: any) => {
		formData.append('deleteImages', image);
	});
	if (dialogTitle.value == "新增商品") {
		addProduct(formData).then(res => {
			ElMessage.success(res.data.message);
			getData()
		}).catch(err=>{
		ElMessage.error(err.response.data.message);
	})
	} else {
		updateProduct(productId, formData).then(res => {
			ElMessage.success(res.data.message);
			getData()
		}).catch(err=>{
		ElMessage.error(err.response.data.message);
	})
	}

};
//表格优化
const formatDescription = (row: any, column: any) => {
	const maxLength = 6; // 最大字符数
	let description = row[column.property];
	if (description && description.length > maxLength) {
		return description.slice(0, maxLength) + '...';
	} else {
		return description;
	}
}
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

.mgr20 {
	margin-right: 10px;
}

.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}

/* footer */
.footer {
	display: flex;
	justify-content: space-between;
}

.demo-pagination-block {
	margin-top: 18px;
}
</style>
