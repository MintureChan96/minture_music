
/**
  说明: 登录流程
  1. 收集表单项数据
  2. 前端验证
    1) 验证用户信息(账号，密码)是否合法
    2) 前端验证不通过就提示用户，不需要发请求给后端
    3) 前端验证通过了，发请求(携带账号, 密码)给服务器端
  3. 后端验证
    1) 验证用户是否存在
    2) 用户不存在直接返回，告诉前端用户不存在
    3) 用户存在需要验证密码是否正确
    4) 密码不正确返回给前端提示密码不正确
    5) 密码正确返回给前端数据，提示用户登录成功(会携带用户的相关信息)
*/
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '', // 手机号
    password: '' // 用户密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 表单项内容发生改变的回调
  handleInput(event) {
    let type = event.currentTarget.id;
    this.setData({
      [type]: event.detail.value
    })
  },
  async login(event) {
    let { phone, password: pwd } = this.data;
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空！',
        icon: 'none'
      })
      return;
    }
    let reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (!reg.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确!',
        icon: 'none'
      })
      return
    }
    if (!pwd) {
      wx.showToast({
        title: '密码不能为空!',
        icon: 'none'
      })
      return
    }
    let res = await request('/login/cellphone', { phone: this.data.phone, password: this.data.password }, 'GET')
    console.log(res)
    if (res.code == 200) {
      wx.showToast({
        title: '登录成功!',
        icon: "success"
      })
      wx.setStorageSync('loginInfo',JSON.stringify(res.profile))
      wx.switchTab({
        url: '/pages/personal/personal',
      })
  
    }
    else if (res.code == 400) {
      wx.showToast({
        title: '手机号输入有误!',
        icon: 'none'
      })
    }
    else if (res.code == 502) {
      wx.showToast({
        title: '密码输入有误!',
        icon: 'none'
      })
    }
    else if (res.code == 509) {
      wx.showToast({
        title: '密码错误次数过多,请稍后再试!',
      })
    }
    else {
      wx.showToast({
        title: '登录失败,请重试！',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
