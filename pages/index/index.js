// index.js
// 获取应用实例
const app = getApp()
import request from '../../utils/request.js';
Page({
  data: {
    list: ['https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1582742201,252512959&fm=26&gp=0.jpg'],
    tjList:[],
    phbList:[],
    bdId:['71384707','991319590','1978921795','60198','180106']
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
   onLoad:async function() {
    let result = await request('/banner',{type:1},'GET')
    this.setData({
      list:result.banners
    })
    let tjList = await request('/personalized',{limit:10},'GET')
    this.setData({
      tjList: tjList.result
    })
    
    let hbList= []
   this.data.bdId.forEach(async i =>{
      let list =[];
      list =  await request('/playlist/detail',{id:i},'GET')
      console.log(list)
      let obj = {
        name: list.playlist.name,
        tracks:list.playlist.tracks.slice(0,3)
      }
      hbList.push(obj)
      this.setData({
        phbList: hbList
      })
    })
    this.setData({
      phbList: hbList
    })
    console.log(this.data.phbList)
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
