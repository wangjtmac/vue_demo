import data from "./index"
// import Mock from "mockjs"
let Mock = {
    mock : function (){}
}
/*
*  登录
 * @param objCode , password
 * @returns {Promise<*>}
* */
export async function login(objCode , password , settings) {
    settings.loading = false;
    return await Mock.mock(data.login);
}

/*
*  注销
 * @param
 * @returns {Promise<*>}
* */
export async function logout() {
    return await Mock.mock(data.logout);
}
/*
*  注销
 * @param
 * @returns {Promise<*>}
* */
export async function queryUserFunction() {
    return await Mock.mock(data.queryUserFunction);
}

/*
*  修改密码
 * @param userCode oldPassword newPassword
 * @returns {Promise<*>}
* */
export async function updataPassword(userCode, oldPassword, newPassword , settings ) {
    settings.loading = false;
    return await Mock.mock(data.updataPassword);
}
/*
*  修改登录次数
 * @param userId
 * @returns {Promise<*>}
* */
export async function updataLoginNumber( ) {
    return await Mock.mock(data.updataLoginNumber);
}
/*
*  检查登录过期
 * @param userId
 * @returns {Promise<*>}
* */
export async function isOverTime() {
    return await Mock.mock(data.isOverTime);
}
/*
*  检查登录权限变更
 * @param userId
 * @returns {Promise<*>}
* */
export async function getUserRole() {
    return await Mock.mock(data.getUserRole);
}
