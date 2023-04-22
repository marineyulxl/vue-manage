<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.orderStatus" placeholder="分类查询" class="handle-select mr10">
                    <el-option label="未支付" value="created"></el-option>
                    <el-option label="待发货" value="paid"></el-option>
                    <el-option label="待收货" value="delivered"></el-option>
                    <el-option label="已完成" value="completed"></el-option>
                    <el-option label="已取消" value="cancelled"></el-option>
                </el-select>
                <el-input v-model="query.orderNo" placeholder="商品号查询" class="handle-input mr10"></el-input>
                <el-input v-model="query.name" placeholder="收件人姓名查询" class="handle-input mr10"></el-input>
                <el-button type="primary" plain :icon="Search" @click="handleSearch">查询</el-button>
                <el-button plain type="danger" @click="resetQuery">重置</el-button>
            </div>
            <el-table v-loading="loading" :data="tableData" class="table" ref="multipleTableRef"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
                <el-table-column prop="shippingAddress.name" label="收件人" width="70">
                </el-table-column>
                <el-table-column prop="shippingAddress.phone" label="收件人电话">
                </el-table-column>
                <el-table-column prop="shippingAddress.address" label="收件人地址" width="220">
                </el-table-column>
                <el-table-column label="商品总价" width="100">
                    <template #default="scope">
                        <span style="color: red;">￥{{ scope.row.totalPrice }}</span></template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template #default="scope">
                        <el-tag :type="getStatusColor(scope.row.orderStatus)">
                            {{ orderStatusMap[scope.row.orderStatus] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="updatedAt" label="更新时间"></el-table-column>
                <el-table-column label="操作" width="120">
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
                        <!-- <el-button type="default" plain @click="handleAdd()">添加</el-button> -->
                        <!-- <el-button type="default" plain >清空</el-button> -->
                        <el-button type="danger" @click="handleDeletes()">批量删除</el-button>
                    </el-button-group>
                    <!-- <el-button @click="toggleSelection()">清空</el-button> -->
                </div>
                <!-- 分页 -->
                <div class="demo-pagination-block">
                    <el-pagination background :current-page="query.page" :page-size="query.limit"
                        :page-sizes="[5, 10, 20]" layout="total, sizes, prev, pager, next" :total="pageTotal"
                        @current-change="handlePageChange" @size-change="handleSizeChange" />
                </div>
            </div>
        </div>

        <!-- 编辑新增弹出框 -->
        <el-dialog :title="dialogTitle" v-model="editVisible" width="30%" destroy-on-close :close-on-click-modal="false"
            draggable>
            <el-scrollbar height="50vh">
                <el-form label-width="70px">
                    <el-form-item label="订单号">
                        <el-input v-model="form.orderNo" disabled class="input"></el-input>
                    </el-form-item>
                    <el-form-item label="收件人">
                        <el-input v-model="form.shippingAddress.name" class="input" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="form.shippingAddress.phone" class="input" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="收货地址">
                        <el-input v-model="form.shippingAddress.address" disabled class="input"></el-input>
                    </el-form-item>

                    <el-form-item label="订单状态">
                        <el-select v-model="form.orderStatus" class="handle-select mr10">
                            <el-option label="未支付" value="created"></el-option>
                            <el-option label="待发货" value="paid"></el-option>
                            <el-option label="待收货" value="delivered"></el-option>
                            <el-option label="已完成" value="completed"></el-option>
                            <el-option label="已取消" value="cancelled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品列表">
                        <div class="listcotent">
                            <div class="listItem" v-for="productItem in form.productList" :key="productItem._id">
                                <el-image style="width: 100px; height: 100px" :src="productItem.images[0]" />
                                <div class="listItem_right">
                                    <div class="listItem_right_top">
                                        <span>{{ productItem.name }}</span>
                                    </div>
                                    <div class="listItem_right_btm">
                                        <div class="demonstration" style="color: red;">￥{{ productItem.price }}</div>
                                        <div class="demonstration">x{{ productItem.quantity }}</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="商品总价">
                        <el-input v-model="form.totalPrice" disabled class="input"></el-input>
                    </el-form-item>
                </el-form>
            </el-scrollbar>
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
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
import { Delete, Search} from '@element-plus/icons-vue';
import { baseURL } from '../utils/baseUrl'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { getorders, deletceOrder,deletceOrders,updateOrder } from '../api/order'

const dialogTitle = ref<string>('商品管理')
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

interface shippingAddress {
    address: string,
    name: string,
    phone: string
}
interface productId {
    images: [],
    name: string,
    price: number
}
interface OrderItem {
    _id?: string;
    orderNo: string;
    orderStatus: string;
    shippingAddress: shippingAddress;
    totalPrice: string;
    productList: any[]
    createdAt: string;
    updatedAt: string
}
const tableData = ref<OrderItem[]>([]);
const pageTotal = ref(0);
let loading = ref<boolean>(false)
let query = reactive({
    name:'',
    page: 1,
    limit: 10,
    orderStatus: '',
    orderNo:'',
    sort: '',
});
const statusTags = reactive<any>({
    created: 'success',
    paid: 'warning',
    delivered: 'info',
    completed: 'success',
    cancelled: 'danger'
})
const orderStatusMap = reactive<any>({
    created: '未支付',
    paid: '待发货',
    delivered: '待收货',
    completed: '已完成',
    cancelled: '已取消',
})
const getStatusColor = (status: any) => {
    switch (status) {
        case 'created':
            return 'danger';
        case 'paid':
            return 'warning';
        case 'delivered':
            return 'info';
        case 'completed':
            return 'success';
        case 'cancelled':
            return 'danger';
    }
}
// 多选
const multipleSelection = ref<OrderItem[]>([])
const handleSelectionChange = (val: OrderItem[]) => {
	multipleSelection.value = val
}
// 获取表格数据
const getData = async () => {
    loading.value = true
    try {
        const { data: res } = await getorders(query)
        console.log("订单", res);
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

const getStatusTag = computed((row) => {
    const status = row.orderStatus;
    return statusTags[status];
})
// 查询操作
const handleSearch = () => {
    query.page = 1;
    console.log(query);
    
    getData();
};
//重置
const resetQuery = () => {
    query.page = 1
    query.limit = 10
    query.orderStatus = ''
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
    dialogTitle.value = "新增商品"
    editVisible.value = true;
}
// 删除操作
const handleDelete = (index: number, row: any) => {
    // 二次确认删除
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    }).then(() => {
        deletceOrder(row._id).then(res => {
            ElMessage.success(res.data.message);
            getData()
        }).catch((err) => {
            console.log(err);

        });

    })
        .catch(() => { });
};
const handleDeletes = () => {
    const ids = multipleSelection.value.map(row => row._id);
    // 二次确认删除
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    }).then(() => {
        deletceOrders(ids).then(res => {
			console.log("批量删除",res);
			ElMessage.success(res.data.message);
			getData()
		}).catch((err) => {
			console.log(err);

		});
    })
    .catch(() => { });

}
// 表格编辑时弹窗和保存
const editVisible = ref(false);
const fileList = ref<UploadUserFile[]>([])
let form = reactive<OrderItem>({
    _id:'',
    orderNo: '',
    orderStatus: '',
    shippingAddress: {} as {
        name: string;
        phone: string;
        address: string;
    },
    totalPrice: '',
    productList: [],
    createdAt: '',
    updatedAt: ''
})
let productId: string = '';
const handleEdit = (index: number, row: any) => {
    dialogTitle.value = "查看订单"
    const list = row.productList.map((item: any) => {
        let { images, name, price, _id } = item.productId
        let quantity = item.quantity
        images = images.map((element: any) => element = baseURL + element);
        return { images, name, price, _id, quantity }
    });
    form._id=row._id
    form.orderNo = row.orderNo
    form.shippingAddress.name = row.shippingAddress.name
    form.shippingAddress.phone = row.shippingAddress.phone
    form.shippingAddress.address = row.shippingAddress.address
    form.productList = list
    form.totalPrice = row.totalPrice
    form.orderStatus = row.orderStatus
    console.log(row);

    editVisible.value = true;
};
//保存
const saveSubmit = () => {
    console.log(form);
    updateOrder(form._id,form.orderStatus).then(res=>{
        console.log(res,'修改');
        ElMessage.success(res.data.message);
			getData()
    }).catch(err=>{
        ElMessage.error(err.response.data.message);
    })
    editVisible.value = false;

};

</script>

<style >
.input {
    width: 80%;
}

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

.listcotent {
    width: 300px;
}

.listItem {
    margin-top: 10px;
    display: flex;
}

.listItem_right {
    width: 150px;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between
}

.listItem_right_btm {
    display: flex;
    justify-content: space-between;
}

/* footer */
.footer {
    display: flex;
    justify-content: space-between;
}

.demo-pagination-block {
    margin-top: 18px;
}


.el-overlay-dialog .el-dialog {
    border-radius: 2px;
}

.el-dialog__header {
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    background: #3875b0;
    line-height: 45px;
    padding: 0 15px;
    margin: 0;
}

.el-dialog__title {
    font-size: 14px;
    color: #ffffff;
}

.el-dialog__headerbtn {
    top: -2px;
}</style>
