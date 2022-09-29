const getters = { // 派生属性,相当于重命名
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto,
  tokenTime: state => state.user.tokenTime,
  companyId: state => state.user.userInfo.companyId // userInfo对象里面有companyId,获取公司设置功能
}
export default getters
