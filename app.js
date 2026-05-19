const app = getApp()

App({
  globalData: {
    userId: null,
    openid: null,
    apiBase: 'http://119.29.178.222:3000/api' // 服务器公网IP
  },

  onLaunch() {
    // 检查本地存储的用户信息
    const userId = wx.getStorageSync('userId');
    const openid = wx.getStorageSync('openid');
    
    if (userId && openid) {
      this.globalData.userId = userId;
      this.globalData.openid = openid;
    }
  },

  // 保存用户信息
  setUserInfo(userId, openid) {
    this.globalData.userId = userId;
    this.globalData.openid = openid;
    wx.setStorageSync('userId', userId);
    wx.setStorageSync('openid', openid);
  }
})
