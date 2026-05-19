const app = getApp()

Page({
  data: {
    plans: [
      { title: '', deadline: '', time: '12:00' }
    ],
    existingPlans: [],
    canSubmit: false,
    submitting: false,
    minDate: '',
    defaultDate: '',
    defaultTime: '12:00'
  },

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  },

  onLoad() {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const defaultDate = this.formatDate(nextYear);
    const defaultTime = '12:00';
    
    this.setData({
      minDate: this.formatDate(new Date()),
      defaultDate: defaultDate,
      defaultTime: defaultTime,
      plans: [{ title: '', deadline: defaultDate, time: defaultTime }]
    });
    this.checkCanSubmit();
    this.loadExistingPlans();
  },

  // 加载已有计划
  async loadExistingPlans() {
    if (!app.globalData.userId) {
      this.setData({ existingPlans: [] });
      return;
    }

    try {
      const res = await wx.request({
        url: `${app.globalData.apiBase}/plans/${app.globalData.userId}`,
        method: 'GET'
      });
      
      if (res.statusCode === 200 && res.data && res.data.success) {
        const data = res.data.data || [];
        if (data.length > 0) {
          this.setData({
            existingPlans: data.map(p => ({
              ...p,
              deadline: p.deadline ? p.deadline.substring(0, 10) : ''
            }))
          });
        }
      }
    } catch (error) {
      console.error('加载计划失败:', error);
    }
  },

  // 添加计划
  addPlan() {
    if (this.data.plans.length >= 6) {
      wx.showToast({ title: '最多6个计划', icon: 'none' });
      return;
    }
    this.setData({
      plans: [...this.data.plans, { title: '', deadline: this.data.defaultDate, time: this.data.defaultTime }]
    });
    this.checkCanSubmit();
  },

  // 删除计划
  removePlan(e) {
    const index = e.currentTarget.dataset.index;
    const plans = [...this.data.plans];
    plans.splice(index, 1);
    this.setData({ plans });
    this.checkCanSubmit();
  },

  // 输入标题
  onTitleInput(e) {
    const index = e.currentTarget.dataset.index;
    const plans = [...this.data.plans];
    plans[index].title = e.detail.value;
    this.setData({ plans });
    this.checkCanSubmit();
  },

  // 选择日期
  onDateChange(e) {
    const index = e.currentTarget.dataset.index;
    const plans = [...this.data.plans];
    plans[index].deadline = e.detail.value;
    this.setData({ plans });
    this.checkCanSubmit();
  },

  // 选择时间
  onTimeChange(e) {
    const index = e.currentTarget.dataset.index;
    const plans = [...this.data.plans];
    plans[index].time = e.detail.value;
    this.setData({ plans });
    this.checkCanSubmit();
  },

  // 检查是否可以提交
  checkCanSubmit() {
    const { plans } = this.data;
    const canSubmit = plans.length >= 1 && plans.some(p => p.title.trim().length >= 3 && p.deadline);
    this.setData({ canSubmit });
  },

  // 提交计划
  async submitPlans() {
    if (!this.data.canSubmit || this.data.submitting) {
      if (!this.data.plans.some(p => p.title.trim().length >= 3)) {
        wx.showToast({ title: '计划至少3个字', icon: 'none' });
      }
      return;
    }

    // 请求订阅消息权限
    const tmplIds = ['iLfFBjJovf2crtLiOCc4gyRLUPK8p_HabJid_5g7EN0'];
    
    try {
      const subscribeResult = await new Promise((resolve) => {
        wx.requestSubscribeMessage({
          tmplIds: tmplIds,
          success: (res) => resolve(res),
          fail: (err) => resolve({ errMsg: 'fail' })
        });
      });
      
      console.log('订阅消息权限:', subscribeResult);
    } catch (e) {
      console.log('订阅消息请求失败:', e);
    }

    this.setData({ submitting: true });

    try {
      // 先登录获取 openid
      const loginRes = await wx.login();
      
      if (!loginRes.code) {
        throw new Error('获取登录code失败');
      }

      // 转换plans格式，合并deadline和time
      const plansToSubmit = this.data.plans.map(p => ({
        title: p.title,
        deadline: p.deadline + ' ' + p.time + ':00'
      }));

      // 用 promise 方式获取响应
      const loginReqData = await new Promise((resolve, reject) => {
        wx.request({
          url: `${app.globalData.apiBase}/login`,
          method: 'POST',
          header: { 'content-type': 'application/json' },
          data: JSON.stringify({ code: loginRes.code }),
          success: (res) => resolve(res),
          fail: (err) => reject(err),
          timeout: 10000
        });
      });

      if (loginReqData.statusCode !== 200 || !loginReqData.data || !loginReqData.data.success) {
        throw new Error(loginReqData.data?.error || '登录失败');
      }

      const userData = loginReqData.data.data;
      app.setUserInfo(userData.userId, userData.openid);

      // 提交计划
      const submitResData = await new Promise((resolve, reject) => {
        wx.request({
          url: `${app.globalData.apiBase}/plans`,
          method: 'POST',
          header: { 'content-type': 'application/json' },
          data: JSON.stringify({
            userId: userData.userId,
            plans: plansToSubmit
          }),
          success: (res) => resolve(res),
          fail: (err) => reject(err),
          timeout: 10000
        });
      });

      if (submitResData.statusCode === 200 && submitResData.data && submitResData.data.success) {
        wx.showToast({ title: '保存成功', icon: 'success' });
        setTimeout(() => {
          wx.redirectTo({ url: '/pages/result/result' });
        }, 1500);
      } else {
        wx.showToast({ title: submitResData.data?.message || '保存失败', icon: 'error' });
      }
    } catch (error) {
      console.error('提交失败:', error);
      wx.showToast({ title: '提交失败', icon: 'error' });
    } finally {
      this.setData({ submitting: false });
    }
  }
})
