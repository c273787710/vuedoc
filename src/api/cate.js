import request from '@/utils/request'

export function AddCate(data) {
  return request({
    url : "/api/admin/cate/add",
    method:"post" ,
    data
  })
}

export function GetCateList() {
  return request({
    url : "/api/admin/cate/list"
  })
}

export function EditCate(data) {
  return request({
    url : "/api/admin/cate/edit",
    method:"post" ,
    data
  })
}

export function DelCate(data) {
  return request({
    url : "/api/admin/cate/del",
    method : "delete",
    data
  })
}
