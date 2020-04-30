<template>
  <div class="app-container">
    <el-divider content-position="left">文章筛选以及添加</el-divider>
    <!-- 搜索框 -->
    <div class="filter-container">
      <el-input style="width: 200px;" clearable v-model="listQuery.title" size="small" class="filter-item" placeholder="请输入文章标题进行搜索"></el-input>
      <label class="filter-item filter-item-label">请选择分类:</label>
      <el-select v-model="listQuery.cid" placeholder="请选择" size="small" class="filter-item">
        <el-option v-for="item in this.cateList" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
      </el-select>
      <label class="filter-item filter-item-label">是否推荐:</label>
      <el-select v-model="listQuery.is_recommend" placeholder="请选择是否推荐" size="small" class="filter-item">
        <el-option :key="-1" label="全部" :value="0"></el-option>
        <el-option :key="0" label="是" :value="2"></el-option>
        <el-option :key="1" label="否" :value="1"></el-option>
      </el-select>
      <label class="filter-item filter-item-label">是否热门:</label>
      <el-select v-model="listQuery.is_hot" placeholder="请选择是否热门" size="small" class="filter-item">
        <el-option :key="-1" label="全部" :value="0"></el-option>
        <el-option :key="0" label="是" :value="2"></el-option>
        <el-option :key="1" label="否" :value="1"></el-option>
      </el-select>
      <el-button class="filter-item" size="small" type="primary" @click="searchArticle" icon="el-icon-search">筛选</el-button>
      <el-button class="filter-item" type="primary" size="small" icon="el-icon-edit"  @click="addArticle">添加文章</el-button>
    </div>
    <el-divider content-position="left">文章数据列表</el-divider>
    <el-table 
      v-loading="tableLoading" 
      :data="articleList" 
      border 
      highlight-current-row 
      style="width:100%"
      >
        <el-table-column label="ID" prop="id" width="80" align="center"></el-table-column>
        <el-table-column label="文章题目" prop="title" align="center"></el-table-column>
        <el-table-column label="所属分类" prop="cate.cate_name" align="center"></el-table-column>
        <el-table-column label="查看次数" align="center" prop="look_times" width="120"></el-table-column>
        <el-table-column label="点赞次数" align="center" prop="stars" width="120"></el-table-column>
        <el-table-column label="推荐" align="center" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.is_recommend | statusFilter" effect="dark" size="small">
              {{ row.is_recommend == 1 ? '是' : '否'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="热门" align="center" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.is_hot | statusFilter" effect="dark" size="small">
              {{ row.is_hot == 1 ? '是' : '否'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter" effect="dark" size="small">
              {{ row.status == 1 ? '上架' : '下架'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="articleEdit(row,$index)">编辑</el-button>
            <el-button type="danger" size="mini" @click="articleDelete(row,$index)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <pagination 
      v-show="total > 0" 
      :total="total" 
      :page.sync="listQuery.page" 
      :limit.sync="listQuery.limit" 
      @pagination="getArticleList"></pagination>

    <!-- 添加和修改边框 -->
    <el-dialog 
      :title="dialogTitle" 
      :close-on-click-modal="false" 
      :close-on-press-escape="false" 
      :show-close="false" 
      :visible.sync="articleFormVisilable" fullscreen>
      <el-form ref="articleForm" :rules="articleRules" :model="currentArticle" label-position="left" label-width="90px" style="width:80%; margin-left:10%;">
        <el-form-item label="文章标题:" prop="title">
          <el-input v-model="currentArticle.title" maxlength="100" placeholder="请输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="cid">
          <el-select v-model="currentArticle.cid" placeholder="请选择文章所属分类">
            <el-option v-for="item in cateList" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="desc">
          <el-input type="textarea" :autosize="{minRows: 4, maxRows: 8}" placeholder="请输入内容" :show-word-limit="true" v-model="currentArticle.desc" maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="是否推荐">
          <el-switch v-model="currentArticle.is_recommend" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item label="是否热门">
          <el-switch v-model="currentArticle.is_hot" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="currentArticle.status" :active-value="1" :inactive-value="0" active-text="上架" inactive-text="下架"></el-switch>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <mavon-editor v-model="currentArticle.content"
                        :toolbars="MarkDownToolBars"
                        placeholder="请输入文章内容" style="height:500px">
          </mavon-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('articleForm')">取 消</el-button>
        <el-button type="primary" @click="confirmArticleForm('articleForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
.filter-container{
  padding-bottom: 10px;
}
.filter-container .filter-item{
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
}
.filter-item-label{
  color: #606266;
  margin-left: 10px;
  margin-right: 2px;
  font-size: 14px;
}
</style>

<script>
import {listArticle, delArticleByID, addArticle, editArticle} from "@/api/article"
import { GetCateList } from "@/api/cate";
import Pagination from '@/components/Pagination'  //分页
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import DefaultOptions from "./default-options"

export default {
  name: "Article",
  components:{
    Pagination,mavonEditor
  },
  data(){
    const cidValid = (rule,value,callback) => {
      if(value == 0) {
        return callback(new Error("请选择文章分类如没有分类请前往添加"))
      }
      for(var i = 0 ;i<this.cateList.length;i++){
        if(this.cateList[i].id == value){
          return callback()
        }
      }
      return callback(new Error("分类错误"))
    }
    return {
      MarkDownToolBars: DefaultOptions,
      tableLoading : false,
      articleList: null,
      cateList:[
        {
          id: 0,
          cate_name: "请选择分类"
        }
      ],
      total: 0 ,
      listQuery:{
        page:1,
        limit:10,
        title:"",
        cid:0,
        is_hot:0,
        is_recommend:0
      },
      dialogTitle:"弹出框",
      articleFormVisilable:false,
      currentArticle:{
        id:0,
        title:"",
        desc:"",
        cid:0,
        is_hot:0,
        is_recommend: 0,
        status: 1,
        content: ""
      },
      articleRules:{
        title:{type:"string",required:true,message:"请输入文章标题",trigger:"blur"},
        cid:{type:"number",required:true,message:"请选择文章分类,如没有分类请前往添加",validator:cidValid,trigger:"change"},
        desc:{required:true,message:"请输入文章简介",trigger:"blur"},
        content:{required:true,message:"请输入文章内容",trigger:"blur"}
      },
      currentTemp:null,
      currentActionType:0,
    }
  },
  filters:{
    statusFilter(status){
      if(status == 1){
        return 'success' ;
      }else{
        return 'danger' ;
      }
    }
  },
  created() {
    GetCateList().then(res => {
      if (res.code == 0) {
        this.cateList = this.cateList.concat(res.data);
      }
    });
    this.getArticleList();
  },
  methods: {
    //获取文章列表数据
    getArticleList(){
      this.tableLoading = true
      listArticle(this.listQuery).then((res)=>{
        this.tableLoading = false;
        this.articleList = res.data.list
        this.total = res.data.count
      }).catch(()=>{
        this.tableLoading = false;
      })
    },
    articleDelete(row,index){
      this.$confirm("您确定要删除【"+row.title+"】文章吗?","删除确认",{
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        this.tableLoading = true;
        delArticleByID(row.id).then((res)=>{
          this.tableLoading = false;
          this.articleList.splice(index,1)
          this.total -= 1
          this.$notify({
            title: '删除公告',
            message: '删除【'+row.title+'】文章成功',
            type: 'success',
            duration: 3000
          })
        }).catch(()=>{
          this.tableLoading = false
        })
      })
    },
    addArticle(){
      this.dialogTitle = "添加文章"
      this.articleFormVisilable = true
      this.currentActionType = 1 
    },
    articleEdit(row,index){
      this.currentTemp = Object.assign({},row)
      this.currentArticle = {
        id:row.id,
        title:row.title,
        desc:row.desc,
        cid:row.cate.id,
        is_hot:row.is_hot,
        is_recommend: row.is_recommend,
        status: row.status,
        content: row.content
      }
      this.articleFormVisilable = true
      this.currentActionType = 2
    },
    resetForm(formName){
      this.$refs[formName].resetFields();
      this.currentArticle = {
        id:0,
        title:"",
        desc:"",
        cid:0,
        is_hot:0,
        is_recommend: 0,
        status: 1,
        content: ""
      };
      this.articleFormVisilable = false;
    },
    confirmArticleForm(formName){
      this.$refs[formName].validate((valid)=>{
        if(valid){
          const loading = this.$loading({
            lock: true,
            text: "正在提交数据",
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.7)'
          })
          if(this.currentActionType == 1){
            addArticle(this.currentArticle).then( (res)=>{
              loading.close()
              this.$message.success("成功添加【"+res.data.title+"】文章")
              this.total += 1
              this.articleList.unshift(res.data)
              this.resetForm(formName)
            } ).catch(()=>{
              loading.close()
            })
          }else if(this.currentActionType == 2){
            editArticle(this.currentArticle).then( (res)=>{
              const index = this.articleList.findIndex(v => v.id === this.currentTemp.id)
              this.currentTemp = res.data;
              this.articleList.splice(index,1,this.currentTemp)
              this.articleFormVisilable = false
              this.$message.success("修改【"+ this.currentArticle.title +"】文章成功")
              loading.close()
            } ).catch(()=>{
              loading.close()
            })
          }
          
        }else{
          this.$message.error('请正确输入信息');
        }
      })
    },
    searchArticle(){
      this.getArticleList()
    }
  }
};
</script>
