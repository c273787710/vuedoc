<template>
  <div>
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-edit" size="small" @click="addArticle">
        添加文章
      </el-button>
    </div>
    <el-table :data="article_list" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="标题">
              <span>{{ props.row.title }}</span>
            </el-form-item>
            <el-form-item label="描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
            <el-form-item label="查看次数">
              <span>{{ props.row.look_times }}</span>
            </el-form-item>
            <el-form-item label="点赞次数">
              <span>{{ props.row.stars }}</span>
            </el-form-item>
            <el-form-item label="文章分类">
              <span>{{ props.row.cid }}</span>
            </el-form-item>
            <el-form-item label="是否热门">
              <el-tag v-if="props.row.is_hot == 1" type="success" effect="dark" size="small">是</el-tag>
              <el-tag v-else type="danger" effect="dark" size="small">否</el-tag>
            </el-form-item>
            <el-form-item label="是否推荐">
              <el-tag v-if="props.row.is_recommend == 1" type="success" effect="dark" size="small">是</el-tag>
              <el-tag v-else type="danger" effect="dark" size="small">否</el-tag>
            </el-form-item>
            <el-form-item label="状态">
              <el-tag v-if="props.row.status == 1" type="success" effect="dark" size="small">可用</el-tag>
              <el-tag v-else type="danger" effect="dark" size="small">禁用</el-tag>
            </el-form-item>
            <el-form-item label="添加时间">
              <i class="el-icon-time"></i>
              <span>{{ formatDate(props.row.add_time) }}</span>
            </el-form-item>
            <el-form-item label="更新时间">
              <i class="el-icon-time"></i>
              <span>{{ formatDate(props.row.update_time) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" width="50" align="center"></el-table-column>
      <el-table-column label="文章标题" prop="title" align="center"></el-table-column>
      <el-table-column label="所属分类" prop="cid" align="center"></el-table-column>
      <el-table-column label="是否推荐" prop="is_recommend" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_recommend == 1" type="success" effect="dark" size="small">是</el-tag>
          <el-tag v-else type="danger" effect="dark" size="small">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否热门" prop="is_hot" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_hot == 1" type="success" effect="dark" size="small">是</el-tag>
          <el-tag v-else type="danger" effect="dark" size="small">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success" effect="dark" size="small">可用</el-tag>
          <el-tag v-else type="danger" effect="dark" size="small">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="editArticle(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="delArticle(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <article-form :show-dialog="showDialog" @closeDialog="closeDialog"></article-form>
  </div>

</template>

<style>
  .filter-container{
    margin-bottom: 20px;
    padding: 10px 10px 0 10px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

<script>
  import ArticleForm from "./ArticleForm"
  export default {
    name: "Article",
    components:{
      ArticleForm
    },
    data() {
      return {
        showDialog:false,
        article_list : [{
          id : 1 ,
          title : "php讲解" ,
          desc : "php讲解" ,
          look_times : 100 ,
          stars : 100 ,
          cid : 1 ,
          is_hot : 1 ,
          is_recommend : 1,
          status : 1 ,
          add_time : 0,
          update_time : 0,
        }]
      }
    },
    methods :{
      formatDate(row) {
        let date = new Date(parseInt(row) * 1000);
        let Y = date.getFullYear() + '年';
        let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '月' : date.getMonth() + 1 + '月';
        let D = date.getDate() < 10 ? '0' + date.getDate() + '日 ' : date.getDate() + '日 ';
        let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
        let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
      },
      editArticle(index,row){},
      delArticle(index,row){},
      addArticle(){
        this.showDialog = true
      },
      closeDialog(){
        this.showDialog = false
      }
    }
  }
</script>
