<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd">+新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input v-model="formInline.keyword" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <el-table :data="list" style="width: 100%" height="500px">
            <el-table-column v-for="item in tableLabel" :key="item.prop" :label="item.label" :prop="item.prop"
                :width="item.width ? item.width : '125'" />
            <el-table-column fixed="right" label="操作" width="180">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination small background layout="prev, pager, next" :total="config.total" class="mt-4 pager"
            @current-change="changePage" />
    </div>
    <el-dialog v-model="centerDialogVisible" :title="action == 'add' ? '新增用户' : '编辑用户'" width="35%" center
        :before-close="handleClose">
        <el-form :inline="true" :model="formUser" ref="userForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="姓名" prop="name" :rules="[
                        { required: true, message: '姓名是必填项' }
                    ]">
                        <el-input v-model="formUser.name" placeholder="请输入姓名" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="年龄" prop="age" :rules="[
                        { required: true, message: '年龄是必填项' },
                        { type: 'number', message: '年龄必须是数字' },
                    ]">
                        <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="性别" prop="sex" :rules="[
                        { required: true, message: '性别是必填项' }
                    ]">
                        <el-select v-model="formUser.sex" placeholder="请选择">
                            <el-option label="男" value="1" />
                            <el-option label="女" value="0" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出生日期" prop="birth" :rules="[
                        { required: true, message: '出生日期是必填项' }
                    ]">
                        <el-date-picker v-model="formUser.birth" type="date" label="出生日期" placeholder="请输入"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="地址" prop="addr" :rules="[
                { required: true, message: '地址是必填项' }
            ]">
                <el-input v-model="formUser.addr" placeholder="请输入地址" />
            </el-form-item>
            <el-row style="justify-content:flex-end">
                <el-form-item>
                    <el-button type="primary" @click="handleCancel">取消</el-button>
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                </el-form-item>
            </el-row>

        </el-form>
        <!-- <template #footer>
            <span class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="centerDialogVisible = false">
                    确定
                </el-button>
            </span>
        </template> -->
    </el-dialog>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import { defineComponent, getCurrentInstance, onMounted, reactive, ref } from 'vue';

export default defineComponent({
    setup() {
        const { proxy } = getCurrentInstance()
        const list = ref([])
        const tableLabel = reactive([
            {
                prop: "name",
                label: "姓名"
            },
            {
                prop: "age",
                label: "年龄"
            },
            {
                prop: "sexLabel",
                label: "性别"
            },
            {
                prop: "birth",
                label: "出生日期",
                width: 200
            },
            {
                prop: "addr",
                label: "地址",
                width: 320
            }
        ])
        onMounted(() => {
            getUserData(config)
        })
        const config = reactive({
            total: 0,
            page: 1,
            name: ''
        })
        const getUserData = async (config) => {
            let res = await proxy.$api.getUserData(config)
            // console.log(res);
            config.total = res.count;
            list.value = res.list.map((item) => {
                item.sexLabel = item.sex === 0 ? '女' : '男'
                return item
            })
        }
        const changePage = (page) => {
            // console.log(page);
            config.page = page
            getUserData(config)
        }
        const formInline = reactive({
            keyword: ''
        })
        const handleSearch = () => {
            config.name = formInline.keyword
            getUserData(config)
        }
        //控制模态框的显示隐藏
        const centerDialogVisible = ref(false)
        const handleClose = (done => {
            ElMessageBox.confirm("确定关闭吗?").then(() => {
                proxy.$refs.userForm.resetFields()
                done()
            }).catch(() => {

            })
        })
        //添加用户的form数据
        const formUser = reactive({
            name: '',//添加用户的用户名
            age: '',
            sex: '',
            birth: '',
            addr: ''
        })
        const timeFormat = (time) => {
            var time = new Date(time)
            var year = time.getFullYear()
            var month = time.getMonth() + 1
            var date = time.getDate()
            function add(m) {
                return m < 10 ? "0" + m : m;
            }
            return year + '-' + add(month) + '-' + add(date)
        }
        //添加用户
        const onSubmit = () => {
            proxy.$refs.userForm.validate(async (valid) => {
                if (valid) {
                    if (action.value == 'add') {
                        formUser.birth = timeFormat(formUser.birth)
                        let res = await proxy.$api.addUser(formUser)
                        if (res) {
                            proxy.$refs.userForm.resetFields()
                            centerDialogVisible.value = false
                            getUserData(config)
                        }
                    } else {
                        //编辑的接口
                        // formUser.sex == '男' ? (formUser.sex = 1) : (formUser.sex = 0)
                        let res = await proxy.$api.editUser(formUser)
                        if (res) {
                            proxy.$refs.userForm.resetFields()
                            centerDialogVisible.value = false
                            getUserData(config)
                        }
                    }
                } else {
                    ElMessage({
                        showClose: true,
                        message: '请输入正确的内容',
                        type: 'error'
                    })
                }
            })

        }
        //取消弹出框
        const handleCancel = () => {
            proxy.$refs.userForm.resetFields()
            centerDialogVisible.value = false
        }
        //区分编辑和新增
        const action = ref('add')
        //新增用户
        const handleAdd = () => {
            action.value = 'add'
            centerDialogVisible.value = true
        }
        //编辑用户信息
        const handleEdit = (row) => {
            action.value = 'edit'
            centerDialogVisible.value = true
            //浅拷贝
            row.sex == 0 ? (row.sex = '女') : (row.sex = '男')
            proxy.$nextTick(() => {
                Object.assign(formUser, row)
            })
        }
        //删除用户信息
        const handleDelete = (row) => {
            ElMessageBox.confirm("确定删除吗?").then(async () => {
                await proxy.$api.deleteUser({
                    id: row.id
                })
                ElMessage({
                    showClose: true,
                    message: '删除成功',
                    type: 'success'
                })
                getUserData(config)
            }).catch(() => {

            })
        }
        return {
            list,
            tableLabel,
            config,
            changePage,
            formInline,
            handleSearch,
            centerDialogVisible,
            handleClose,
            formUser,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            handleAdd,
            handleDelete
        }
    },
})
</script>>

<style lang="less" scoped>
.table {
    position: relative;
    height: 520px;

    .pager {
        position: absolute;
        right: 0;
        bottom: -20px;
    }
}

.user-header {
    display: flex;
    justify-content: space-between;
}
</style>