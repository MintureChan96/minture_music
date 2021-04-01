


export default (url,data={},method='GET') =>{
   return new Promise((resolve,reject)=>{
    wx.request({
      url:'https://autumnfish.cn'+url,
      data,
      method,
      header:{
         cookie:wx.getStorageSync('loginCookies')?wx.getStorageSync('loginCookies').find(i => i.indexOf('MUSIC_U') !== -1):''
      },
      success : (res) =>{
         if(url.toString().includes('login')){
             wx.setStorage({
                key:"loginCookies",
                data:res.cookies
             })
         }
         resolve(res.data)
      },
      fail: (err) =>{
          reject(err)
      }
    })
   })
}