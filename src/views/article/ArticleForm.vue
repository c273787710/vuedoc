<template>
    <el-dialog title="添加文章" :visible.sync="showDialog" width="90%"
               :before-close="cancelFormSubmit"
               :show-close="false"
               destroy-on-close
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form ref="form">
        <el-form-item label="文章标题" label-width="90px">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="内容" label-width="90px">
          <mavon-editor v-model="content"
                        @change="contentChange" @imgAdd="contentAddImg"></mavon-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelFormSubmit">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
  import {mavonEditor} from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  export default {
    name: 'ArticleForm',
    data(){
      return {
        content:"请输入内容"
      }
    },
    components:{mavonEditor},
    props:{
      showDialog:{
        type:Boolean,
        default:false
      }
    },
    methods:{
      cancelFormSubmit(){
        this.$emit("closeDialog")
      },
      contentChange(value,render){
        this.content=value
        console.log(render)
      },
      contentAddImg(pos, $file){
        console.log("pos="+pos)
        console.log($file)
        let formdata = new FormData();
        console.log(formdata)
        /*this.$upload.post('/上传接口地址', formdata).then(res => {
          console.log(res.data);
          this.$refs.md.$img2Url(pos, res.data);
        }).catch(err => {
          console.log(err)
        })*/
      }
    }
  }
</script>

<style scoped>
</style>
