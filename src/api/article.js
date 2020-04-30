import request from '@/utils/request'

export function addArticle(data) {
  return request({
    url: "/api/admin/article/add",
    method: "post",
    data,
  })
}

export function listArticle(data) {
  return request({
    url: "/api/admin/article/list" ,
    method: "get",
    params:data
  })
}

export function delArticleByID(id){
  return request({
    url : "/api/admin/article/del" ,
    method:"post",
    data:{
      id : id
    }
  })
}

export function editArticle(data){
  return request({
    url : "/api/admin/article/edit",
    method: "post",
    data
  })
}