const app = getApp()

Page({
  goToPlans() {
    wx.navigateTo({
      url: '/pages/plans/plans'
    });
  }
})
