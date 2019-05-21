var requestHandler = {
  params: '',
  success: function (res) {
    // success  
  },
  fail: function () {
    // fail  
  },
}
//GET请求  
function GET(requestHandler) {
  request('GET', requestHandler)
}
//POST请求  
function POST(requestHandler) {
  request('POST', requestHandler)
}

function request(method, requestHandler) {
  //注意：可以对params加密等处理  
  var params = requestHandler.params;
  if (params) {
    if (!params.app_id) {
      params.app_id = "wx5550cef350778b61";
      // params.app_id = "wxde059b418de529cd";
    }
  }
  var url = requestHandler.url;
  wx.request({
    url: url,
    data: params,
    method: method,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    }, // 设置请求的 header  
    success: function (res) {
      requestHandler.success(res)
    },
    fail: function (res) {
      console.log(res)
      requestHandler.fail()
    },
    complete: function () {}
  })
}

function formatTime(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

//数据转化  
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


module.exports = {
  GET: GET,
  POST: POST,
  formatTime: formatTime
}