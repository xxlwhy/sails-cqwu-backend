var base = {
    add: function (el, type, fn) {
        if (el.addEventListener)
            el.addEventListener(type, fn, false);
        else if (el.attachEvent)
            el.attachEvent('on' + type, fn);
        else
            el['on' + type] = fn
    },
    del: function (el, type, fn) {
        if (el.addEventListener)
            el.removeEventListener(type, fn, false);
        else if (el.attachEvent)
            el.detachEvent('on' + type, fn);
        else
            el['on' + type] = null
    },
    stopBubble: function (e) {//e:就是事件对象
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true
    },
    stopDefault: function (e) {
        if (e.preventDefault)
            e.preventDefault();
        else
            e.returnValue = false
    },
    agent: function (parent, targentName, type, fn) {
        this.add(parent, type, function (ev) {
            var e = ev || event;
            var targent = e.target || e.srcElement;
            while (targent.nodeName !== targentName.toUpperCase()
                && targent.nodeName !== parent.nodeName) {
                targent = targent.parentNode;
            }
            if (targent.nodeName === targentName.toUpperCase())
                fn.call(targent);
        })
    },
    agents: function (parent, arr, type, fn) {
        var _this=this;
        arr.forEach(function(targentName){
            _this.add(parent, type, function (ev) {
                var e = ev || event;
                var targent = e.target || e.srcElement;
                while (targent.nodeName !== targentName.toUpperCase()
                    && targent.nodeName !== parent.nodeName) {
                    targent = targent.parentNode;
                }
                if (targent.nodeName === targentName.toUpperCase())
                    fn.call(targent);
            })
        })
    },
    clearCls: function (arr, cls) {
        arr.forEach(function (el) {
            if (el.classList.contains(cls)) {
                el.classList.remove(cls);
                return
            }
        });
    },
    getDocAttr:function(attr){
        return document.documentElement[attr] ||document.body[attr]
    },
    getPos:function(obj){
        var l=obj.offsetLeft;
        var t=obj.offsetTop;
        while(obj=obj.offsetParent){ //offsetParent:有定位的父级元素
            l+=obj.offsetLeft;
            t+=obj.offsetTop;
        }
        return {left:l,top:t}
    },
    getStyle:function (obj, attr) {
        if (obj.currentStyle) {
            return parseInt(obj.currentStyle[attr]);
        } else {
            return parseInt(getComputedStyle(obj, false)[attr]);
        }
    },
    setCookie:function(name,value,iDate){
        var date=new Date()
        date.setDate(date.getDate()+iDate);
        document.cookie=`${name}=${value};expires=${date}`
    },
    getCookie:function(name){
        var cookie=document.cookie;
        var arr=cookie.split('; ');
		for(var i in arr){
            var temp=arr[i].split('=');
            if(temp[0]===name){
                return temp[1];
            }
        }
        return ''
    },
    removeCookie:function(name){
        this.setCookie(name,1,-1);
    }      
}