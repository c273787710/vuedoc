<template>
<div class="app-container">
  <div class="filter-container">
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="small" icon="el-icon-edit" @click="addCateBtn">
      添加分类
    </el-button>
  </div>
  <el-divider content-position="left">分类数据列表</el-divider>
  <el-table :data="tableData" style="width: 100%" border empty-text="文章分类为空" highlight-current-row>
    <el-table-column label="ID" width="50" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column label="分类名称" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.cate_name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="访问次数" align="center" width="100px">
      <template slot-scope="scope">
        <span>{{ scope.row.lock_times }}</span>
      </template>
    </el-table-column>
    <el-table-column label="状态" align="center" width="100px">
      <template slot-scope="scope">
        <el-button v-if="scope.row.status == 1" type="success" icon="el-icon-check" size="mini" circle></el-button>
        <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
      </template>
    </el-table-column>
    <el-table-column label="排序" align="center" width="90px">
      <template slot-scope="scope">
        <span>{{ scope.row.sort }}</span>
      </template>
    </el-table-column>
    <el-table-column label="是否为导航" align="center" width="100px">
      <template slot-scope="scope">
        <el-button v-if="scope.row.is_index == 1" type="success" icon="el-icon-check" size="mini" circle></el-button>
        <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
      </template>
    </el-table-column>
    <el-table-column label="添加时间" align="center">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.add_time | dateFormat }}</span>
      </template>
    </el-table-column>
    <el-table-column label="最后更新时间" align="center">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.update_time | dateFormat  }}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>


  <el-dialog title="添加文章分类" :visible.sync="addFormVisible" width="40%" :before-close="closeDialog" :destroy-on-close="true">
    <el-form :model="currentCateData" ref="cateForm" :rules="cateRules">
      <el-form-item label="分类名称" :label-width="formLabelWidth" prop="cate_name">
        <el-input v-model="currentCateData.cate_name"
                  autocomplete="off"
                  placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
        <el-input v-model.number="currentCateData.sort" autocomplete="off" placeholder="请输入排序"></el-input>
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth">
        <el-switch v-model="currentCateData.status"
                   active-color="#13ce66"
                   :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="是否头部导航" :label-width="formLabelWidth">
        <el-switch v-model="currentCateData.is_index"
                   active-color="#13ce66"
                   :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelFormSubmit">取 消</el-button>
      <el-button v-loading.fullscreen.lock="loading" type="primary" @click="addFormSubmit">确 定</el-button>
    </div>
  </el-dialog>
</div>

</template>

<script>
  import {AddCate,GetCateList,EditCate,DelCate} from '@/api/cate'

  export default {
    name: 'Cate',
    created:function(){
      GetCateList().then((res)=>{
        this.tableData = res.data
      }).catch((err)=>{
        console.log(err)
      })
    },
    data() {
      const validateCateName = function(rule,value,callback) {
        if(value.length < 2 || value.length > 12){
          callback(new Error("分类名不能小于2个和不能大于12个字符"))
        }else{
          callback()
        }

      }
      const validateSort = function(rule,value,callback) {
        if(/^\d+$/.test(value) && (value > 0 && value < 200)){
          callback()
        }else{
          callback(new Error("排序只能输入纯数字,且在1到200之间"))
        }

      }
      return {
        tableData: [],
        addFormVisible : false,
        formLabelWidth: '120px',
        currentCateData : {
          id : 0 ,
          cate_name : "" ,
          status : 1 ,
          lock_times : 0 ,
          is_index : 1 ,
          sort : 100
        },
        cateRules : {
          cate_name : [
            { required: true, trigger: 'blur',validator:validateCateName}
          ],
          sort : [
            {required:true,trigger:"blur",validator:validateSort}
          ]
        },
        loading:false,
        actionType : 0 ,
        editIndex : 0 ,
      }
    },
    methods: {
      handleEdit(index, row) {
        this.actionType = 2
        this.currentCateData = this.tableData[index]
        this.addFormVisible = true
        this.editIndex = index
      },
      handleDelete(index, row) {
        const id = row.id
        this.$confirm('你确定要删除【'+row.cate_name+"】分类吗", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DelCate({id:id}).then(res => {
            this.$message({
              message : res.msg,
              type : "success"
            })
            this.tableData.splice(index,1)
          })
        })



      },
      addFormSubmit(){
        this.loading = true;
        this.$refs.cateForm.validate(valid => {
          if(valid){
            if(this.actionType == 1){
              AddCate(this.currentCateData).then(res => {
                this.loading = false;
                this.$message({
                  message : res.msg,
                  type : "success"
                })
                this.addFormVisible = false
                this.actionType = 0 ;
                this.tableData.push(res.data)
                this.currentCateData = {
                  id : 0 ,
                  cate_name : "" ,
                  status : 1 ,
                  lock_times : 100 ,
                  is_index : 1 ,
                  sort : 100
                }
              }).catch(() => {
                this.loading = false;
              })
            }else if(this.actionType == 2){
              this.loading = false;
              EditCate(this.currentCateData).then(res => {
                this.loading = false;
                this.$message({
                  message : res.msg,
                  type : "success"
                })
                this.addFormVisible = false
                this.actionType = 0 ;
                this.currentCateData.update_time = res.data.update_time
                this.currentCateData = {
                  id : 0 ,
                  cate_name : "" ,
                  status : 1 ,
                  lock_times : 100 ,
                  is_index : 1 ,
                  sort : 100
                }
              }).catch(()=>{
                this.loading = false;
              })
            }
          }else{
            this.loading = false;
            this.$message({
              message: '请正确输入分类数据',
              type: 'error'
            });
            return false;
          }
        })
      },
      cancelFormSubmit(){
        this.currentCateData = {
          id : 0 ,
          cate_name : "" ,
          status : 1 ,
          lock_times : 100 ,
          is_index : 1 ,
          sort : 100
        }
        this.addFormVisible = false
        this.actionType = 0
      },
      closeDialog(done){
        this.currentCateData = {
          id : 0 ,
          cate_name : "" ,
          status : 1 ,
          lock_times : 100 ,
          is_index : 1 ,
          sort : 100
        }
        this.addFormVisible = false
        this.actionType = 0
      },
      addCateBtn(){
        this.addFormVisible = true
        this.actionType = 1
      }

    }
  }
</script>

<style scoped>
</style>
