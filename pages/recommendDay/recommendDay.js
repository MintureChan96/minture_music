import request from '../../utils/request'
// pages/recommendDay/recommendDay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      day:'',
      mouth:'',
      recommendList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.findRecommendList();
    let userInfo =wx.getStorageSync('loginInfo')
    console.log(userInfo)
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          // 跳转至登录界面
        setTimeout(()=>{
          wx.reLaunch({
            url: '/pages/login/login'
          })
        },1000)}
      }) 
    } 
        this.setData({
          day: new Date().getDate(),
          mouth:new Date().getMonth() + 1
        })
      
  },
   findRecommendList(){
         request('/recommend/songs',{},'GET').then(r =>{
           console.log(r)
          if(r.code==200){
            let result = []
            r.data.dailySongs.forEach(i => {
              let obj = {
                picUrl:i.al.picUrl,
                name:i.al.name,
                singer:i.ar[0].name
              }
              result.push(obj)
            });
            console.log(result)
            this.setData({
              recommendList:result
            });
         }
       })
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