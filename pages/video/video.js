
// pages/video.js
import request from "../../utils/request"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId:0,
    ddtList:[],
    videoId:'',
    videoUpdateTime: [], // 记录video播放的时长
    isTriggered: false, // 标识下拉刷新是否被触发

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad :async function (options) {
    let userInfo =wx.getStorageSync('loginInfo')
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
   this.getVideoList();
  },
  async getVideoList(){
   let videoList = await request('/video/group/list',{},'GET')
   this.setData({
     videoGroupList:videoList.data.slice(0,14),
     navId:videoList.data[0].id
   })
   this.getListDetail(this.data.navId);
  },
  changeNav(event){
   let id = event.currentTarget.id;
   this.setData({
     navId: id * 1,
     ddtList: []
   })
   wx.showLoading({
    title: '正在加载!',
  })
   this.getListDetail(this.data.navId);
  }, 
  async getListDetail(navId){
    let videoDetails = await request('/video/group',{id:navId},'GET');
    let videoInfoList = [];
    videoDetails.datas.forEach(i =>{
      videoInfoList.push({
          id:i.data.vid,
          title:i.data.title,
          creator:i.data.creator,
          commentCount:i.data.commentCount,
          praisedCount:i.data.praisedCount,
          coverUrl:i.data.coverUrl,
        })
      })
      videoInfoList.forEach(i =>{
         request('/video/url',{id:i.id}).then(r =>{
           i.url = r.urls[0].url.toString().replace('http','https')
           this.setData({
            "ddtList": videoInfoList
           })
         })
       })
    this.setData({
      ddtList: videoInfoList,
      isTriggered: false
    })
    wx.hideLoading()
  },
  handlePlay(event){ 
    let vid = event.currentTarget.id
    this.setData({
      videoId:vid
    })
    this.videoContent =  wx.createVideoContext(vid)
    let {videoUpdateTime} = this.data;
    let videoItem  =videoUpdateTime.find(item =>item.vid == vid);
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime)
       this.videoContent.play()
    }
      this.videoContent.play()
  },
  handleTimeUpdate(event){
    let videoTimeObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime};
    let {videoUpdateTime} = this.data;
    /*
    * 思路： 判断记录播放时长的videoUpdateTime数组中是否有当前视频的播放记录
    *   1. 如果有，在原有的播放记录中修改播放时间为当前的播放时间
    *   2. 如果没有，需要在数组中添加当前视频的播放对象
    *
    * */
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid);
    if(videoItem){ // 之前有
      videoItem.currentTime = event.detail.currentTime;
    }else { // 之前没有
      videoUpdateTime.push(videoTimeObj);
    }
    // 更新videoUpdateTime的状态
    this.setData({
      videoUpdateTime
    })
  },
  
  // 视频播放结束调用的回调
  handleEnded(event){
    // 移除记录播放时长数组中当前视频的对象
    let {videoUpdateTime} = this.data;
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id), 1);
    this.setData({
      videoUpdateTime
    })
  },
  
  // 自定义下拉刷新的回调： scroll-view
  handleRefresher(){
    // 再次发请求，获取最新的视频列表数据
    this.getListDetail(this.data.navId);
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
  onShareAppMessage: function ({from}) {
    //  if(from === 'button'){
    //   return{
    //     title:'来自',
    //     page: '/pages/video/video'
    //   }
    //  }else{
    //    return{

    //    }
    //  }
      
  }
})