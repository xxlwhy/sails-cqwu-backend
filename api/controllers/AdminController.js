var fs = require('fs');
const {create} = require('domain');
module.exports = {
  // localhost:1337/admin/index
  index: function (req, res) {
    res.view({layout: false});
  },

  login: function (req, res) {
    res.view({layout: false});
  },
  addData: async function (req, res) {
    var json = req.allParams();
    // json.course=['语文','数学','English','物理'];
    // console.log(json);
    var row = await SailsNews.create(json).fetch();
    // console.log(row);
    res.json(row);
  },
  register: async function (req, res) {
    // 第一种方法同步
    var json = req.allParams();
    try {
      // 有错误 不会执行
      var row = await User.create(json).fetch();//fetch专门用于同步
      req.session.user = {id: row.id, nicheng: row.nicheng};
      res.json(true);
    } catch (err) {
      if (err && err.code === 'E_UNIQUE')
        res.json(false);
    }
    // 第2种方法异步
    // var json = req.allParams();
    // User.create(json, async function (err) {
    //   console.log(err);
    //   if (err && err.code === 'E_UNIQUE')
    //     res.json(false);
    //   else {
    // 查询使用的同步
    //     var row = await User.findOne({ username: json.username });//findOne(json)
    //     req.session.user = { id: row.id, nicheng: row.nicheng };
    //     res.json(true);
    //   }
    // });
  },
  loginS: async function (req, res) {
    // 第一种方法同步
    var json = req.allParams();
    if (req.session.captcha.toUpperCase() !== json.yzm.toUpperCase()) {
      return res.json(1);
    }
    delete json.yzm;
    var row = await User.findOne(json);
    if (row) {
      req.session.user = {id: row.id, nicheng: row.nicheng};
      res.json(3)
    } else {
      res.json(2)
    }
  },
  changePwd: async function (req, res) {
    var oldPwd = req.body.oldPwd;
    var newPwd = req.body.newPwd;
    var id = req.session.user.id;
    var row = await User.findOne({id, password: oldPwd})
    // 如果密码不正确 则row=undefined
    if (!row) {
      return res.json(false)
    }
    row = await User.update({id: id}, {password: newPwd}).fetch()
    res.json(row[0])
  },
  getRecords: async function (req, res) {
    var num = await SailsNews.count();
    res.json(num);
  },
  // =====================分页=====================
  getPage: async function (req, res) {
    var pageSize = req.query.pageSize;
    var start = pageSize * req.query.cPage;
    try {
      var arr = await SailsNews.find().sort('id DESC').skip(start).limit(pageSize);
      res.json(arr);
    } catch (err) {
      if (err && err.code === 'E_INVALID_CRITERIA')
        res.json(false);
    }
  },
  delete: async function (req, res) {
    var id = req.query.id;
    var row = await SailsNews.destroy({id}).fetch();
    res.json(row);
  },
  search: async function (req, res) {
    var keyword = req.query.keyword;
    var arr = await SailsNews.find({title: {contains: keyword}}).sort('id DESC');
    res.json(arr[0]);
  },
  getNiCheng: async function (req, res) {
    res.json(req.session.user.nicheng);
  },
  logoutS: async function (req, res) {
    delete req.session.user;
    res.json(true);
  },
  edit: async function (req, res) {
    var json = req.allParams();
    var id = json.id;
    delete json.id;
    var row = await SailsNews.update({id}, json).fetch();
    res.json(row);
  },
  clearImg: async function (req, res) {
    var oImg = require('../../models/getImages');
    var path = req.query.path;
    // console.log(path)  //./assets/upload/   //./assets/adv/
    var allImg = oImg.getImageFiles(path);
    var arrAdvImg = [];
    var dbImgArr = [];
    if (path === './assets/adv') {
      arrAdvImg = await Adv.find();
      arrAdvImg.forEach(el => {
        dbImgArr.push(el.src);
      })
    } else {
      arrAdvImg = await SailsNews.find();
      // console.log(arr)
      arrAdvImg.forEach(el => {
        var imgArr = el.content.match(/upload\/[^"]+/g);
        imgArr.forEach(element => {
          element = element.split("/");
          l = element.length;
          element = element[l - 1];
          dbImgArr.push(element);
        })
      })
    }
    allImg.forEach(el => {
      var flag = true;
      dbImgArr.forEach(element => {
        if (el === element) {
          flag = false;
          return
        }
      })
      if (flag) {
        fs.unlinkSync(path + el);
      }
    })
    res.json(true);
  },

  upload: function (req, res) {
    req.file('image').upload(
      {
        dirname: require('path').resolve(sails.config.appPath, 'assets/upload')
      },
      function (err, files) {
        if (err)
          return res.serverError(err);
        if (files.length === 0) {
          return res.json(false);
        }
        let path = files[0].fd.split('\\');
        path = path[path.length - 1];
        // console.log(path);//获取的文件放在assets/images下,这个名字应存一份到数据库
        // setTimeout(function () {
        // }, 2000)
        res.json(path);
      });
  },
  upAdv: function (req, res) {
    req.file('image').upload(
      {
        dirname: require('path').resolve(sails.config.appPath, 'assets/adv')
      },
      async function (err, files) {
        if (err)
          return res.serverError(err);
        let path = files[0].fd.split('\\');
        var imageName = path[path.length - 1];
        var json = req.allParams();//只能收文本文件
        json.src = imageName;
        // console.log(json);
        var row = await Adv.create(json).fetch();
        //延时发送否则图片显示不了
        setTimeout(function () {
          res.json(row);
        }, 2000)
      });
  },
  captcha: function (req, res) {
    var svgCaptcha = require('svg-captcha');
    var codeConfig = {
      size: 4,//验证码长度
      ignoreChars: '0oO1liI',  //排除易混淆字符
      noise: 2,
      height: 45,
    };
    var captcha = svgCaptcha.create(codeConfig);
    req.session.captcha = captcha.text.toLowerCase();
    res.json(captcha.data)
  }
};
