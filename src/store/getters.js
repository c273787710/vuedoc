const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.adminInfo.token,
  avatar: state => state.user.adminInfo.img,
  name: state => state.user.adminInfo.name ,

  isLogin : state => state.user.isLogin ,
}
export default getters
