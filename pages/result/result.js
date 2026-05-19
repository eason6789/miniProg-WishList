const app = getApp()

Page({
  data: {
    plans: []
  },

  onLoad() {
    this.loadPlans();
  },

  async loadPlans() {
    if (!app.globalData.userId) {
      wx.redirectTo({ url: '/pages/index/index' });
      return;
    }

    try {
      const response = await new Promise((resolve, reject) => {
        wx.request({
          url: `${app.globalData.apiBase}/plans/${app.globalData.userId}`,
          method: 'GET',
          success: resolve,
          fail: reject,
          timeout: 10000
        });
      });

      const { success, data } = response.data;
      
      if (success) {
        this.setData({
          plans: data.map(p => ({
            ...p,
            deadline: p.deadline ? p.deadline.substring(0, 10) : ''
          }))
        });
      }
    } catch (error) {
      console.error('加载计划失败:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  viewPlans() {
    wx.redirectTo({
      url: '/pages/plans/plans'
    });
  },

  goHome() {
    wx.redirectTo({
      url: '/pages/index/index'
    });
  }
})
