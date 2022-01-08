/**
 * 用户登录 接口
 * @Author: wangjt
 * @Date: 2020-06-04
 * @Project cicada-dataCenter-webui
 */
import * as reqUtil from '@/api/reqUtil'

/*
*  登录
 * @param objCode , password
 * @returns {Promise<*>}
* */
export async function login(objCode , password ,settings) {
    return await reqUtil.get({
        url: '/login' ,
        settings : settings
    },{objCode , password } , {withCredentials: true});
}

/*
*  注销
 * @param
 * @returns {Promise<*>}
* */
export async function logout() {
    return await reqUtil.post({
        url: '/logout'
    });
}

/**
 * dids 注销登录
 * @return {Promise<*>}
 */
export async function didsLogout(){
    return await reqUtil.get({
        url : "/didslogin/loginOut"
    })
}
/*
*  查 当前用户的功能权限
 * @param
 * @returns {Promise<*>}
* */
export async function queryUserFunction() {
    return await reqUtil.post({
        url: '/user/queryUserFunction',
        errorMsg : "权限过期，请重新登录"
    });
}
/*
*  修改密码
 * @param userCode oldPassword newPassword
 * @returns {Promise<*>}
* */
export async function updataPassword(userCode, oldPassword, newPassword , settings ) {
    return await reqUtil.get({
        url: '/user/updataPassword',
        settings : settings
    } ,{oldPassword ,newPassword , userCode });
}

/*
*  更新登录次数
 * @param userId
 * @returns {Promise<*>}
* */
export async function updataLoginNumber(userId) {
    return await reqUtil.get({
        url: '/user/updataLoginNumber'
    } , {userId});
}
/*
*  检查登录过期
 * @param userId
 * @returns {Promise<*>}
* */
export async function isOverTime(userId) {
    return await reqUtil.post({
        url: '/user/isOverTime'
    } , userId);
}

/*
*  检查登录权限变更
 * @param userId
 * @returns {Promise<*>}
* */
export async function getUserRole(userId) {
    return await reqUtil.get({
        url: '/user/getUserRole',
        errorMsg :false
    } , {userId});
}


