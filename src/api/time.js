/**
 * 时间转换api
 * @Author: wangjt
 * @Date: 2020-02-19
 * @Project vue-demo
 */
export const time = {
    /**
     * * 获取当前时间毫秒数
     * @params
     * @returns {Promise<*>}
     * */
    getUnix: function () {
        let date = new Date();
        return date.getTime();
    },
    /*
     * 获取今天0点0分0秒的毫秒数
     * @params
     * @return
     * */
    getTodayUnix: function () {
        let date = new Date();
        date = this.setTime(date);
        return date.getTime();
    },
    /*
     * 设置时间
     * @params date:日期时间, h:hour, m: minute, s: second, ms: millisecond
     * */
    setTime: function (date, h = 0, m = 0, s = 0, ms = 0) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    },
    /*
     * 获取今年1月1日0点0分0秒的毫秒数
     * @params
     * @return
     * */
    getYearUnix: function () {
        let date = new Date();
        date = this.setTime(date);
        date.setMonth(0);
        date.setDate(1);
        return date.getTime();
    },
    /*
     * 获取标准年月日
     * @params time
     * @return
     * */
    getLastDate: function (time) {
        let date = new Date(time);
        let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return date.getFullYear() + '年' + month + '月' + day + '日';
    },
    /*
     * 时间转换格式
     * @params times: 时间 , pattern: 格式, 默认"yyyy-MM-dd hh:mm:ss"
     * @return {string}
     * */
    formatTimeToStr: function (times, pattern) {
        return new Date(times).Format(pattern);
    },
    /*
     * 转换时间
     * @params timestamp
     * @return
     * */
    getFormatTime : function (timestamp) {
        let now = this.getUnix();
        let today = this.getTodayUnix();
        let year = this.getYearUnix();
        let timer = (now - timestamp) /1000;
        let tip = '';
        if(timer <= 60 ){
            tip = '刚刚';
        }else if(timer < 3600){
            tip = Math.floor(timer/ 60) + '分钟前';
        }else if(timer >= 3600 && timer < 86400){
            tip = Math.floor(timer/ 3600) + '小时前';
        }else if(timer/86400 <= 31 ){
            tip = Math.floor(timer/ 86400) + '天前';
        }else {
            tip = this.getLastDate(timestamp)
        }
        return tip;
    }

};

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * @params fmt 格式
 * @return {string}
 */
Date.prototype.Format = function (fmt = "yyyy-MM-dd hh:mm:ss") {
    let o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
