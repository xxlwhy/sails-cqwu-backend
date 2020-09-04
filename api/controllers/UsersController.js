var getDate = require('../../models/getDate');
module.exports = {

  /**F
   * `UsersController.index()`
   */
  // localhost:1337/users/index
  index: async function (req, res) {
    var adv = await Adv.find().sort('id DESC').limit(4);
    var adv1 = await Adv.find().sort('id DESC').limit(3);
    var adv2 = await Adv.find().sort('id ASC').skip(1).limit(3);
    adv1 = adv1.filter(el => {
      el.date = getDate(el.updatedAt)
      var y = el.date.split('-')[0]
      var m = el.date.split('-')[1]
      var d = el.date.split('-')[2]
      if (m < 10) {
        m = 0 + m
      }
      if (d < 10) {
        d = 0 + d
      }
      el.date = y + '-' + m + '-' + d
      el.dateD = d
      el.dateY = y + '-' + m
      // console.log(el.date)  //2018-03-28
      return el
    })
    adv2 = adv2.filter(el => {
      el.date = getDate(el.updatedAt)
      var y = el.date.split('-')[0]
      var m = el.date.split('-')[1]
      var d = el.date.split('-')[2]
      if (m < 10) {
        m = 0 + m
      }
      if (d < 10) {
        d = 0 + d
      }
      el.date = y + '-' + m + '-' + d
      el.dateD = d
      el.dateY = y + '-' + m
      return el
    })
    var news = await SailsNews.find().sort('id DESC').limit(3);
    res.view({ adv, adv1, news, adv2 });
  },

  // 全文搜索
  searchView: async function (req, res) {
    var keyword = req.query.keyword;
    // keyword = keyword.trim();
    var cPage = req.query.cPage ? req.query.cPage : 0;
    var num = await SailsNews.count({ title: { contains: keyword } });
    // console.log(num)
    var pages = Math.ceil(num / 6)
    var start = cPage * 6;
    var arr = await SailsNews.find({ title: { contains: keyword } }).sort('id DESC').skip(start).limit(6);
    arr = arr.filter(el => {
      var srcArr = el.content.match(/src="[^"]+/);
      var pArr = el.content.match(/<p>[^>]+>/);
      el.p = pArr[0];
      var src = '';
      if (srcArr.length)
        src = srcArr[0].substr(5);
      else
        src = "/upload/zhanwei.jpg";
      el.date = getDate(el.updatedAt)
      el.src = src;
      return el

    })
    res.view({ arr, cPage, pages, keyword });
  },

  /**
   * `UsersController.list()`
   */
  list: async function (req, res) {
    var arr = await SailsNews.find().sort('id DESC').limit(7);
    arr = arr.filter(el => {
      var srcArr = el.content.match(/src="[^"]+/);
      var src = '';
      // console.log(srcArr[0])
      if (srcArr.length)
        src = srcArr[0].substr(5);
      else
        src = "/zhanwei.jpg";
      el.date = getDate(el.updatedAt)
      el.src = src;
      return el
    })
    res.view({ arr });
  },
  list1: async function (req, res) {
    // 没给参数就置为0
    var cPage = req.query.cPage ? req.query.cPage : 0;
    var num = await SailsNews.count();
    var pages = Math.ceil(num / 6)
    var start = cPage * 6;
    var arr = await SailsNews.find().sort('id DESC').skip(start).limit(6);
    arr = arr.filter(el => {
      var srcArr = el.content.match(/src="[^"]+/);
      var pArr = el.content.match(/<p>[^>]+>/);
      el.p = pArr[0];
      var src = '';
      if (srcArr.length)
        src = srcArr[0].substr(5);
      else
        src = "/upload/aaa.jpg";
      el.date = getDate(el.updatedAt)
      el.src = src;
      return el

    })
    res.view({ arr, cPage, pages });
  },
  advLink: async function (req, res) {
    var row = await Adv.findOne({ id: req.query.id });
    row.date = getDate(row.updatedAt);
    res.view(row)
  },
  detail: async function (req, res) {
    var row = await SailsNews.findOne({ id: req.query.id });
    row.date = getDate(row.updatedAt);
    res.view(row)
  }

};
