/**
 * 数据建模首页 接口
 * @Author: chenzt
 * @Date: 2021-08-23
 * @Project cicada-dataCenter-webui
 */
import * as reqUtil from '@/api/reqUtil'
const root = "/firstPageShare"
/*
* 来自分享（shareCard）
* @params
* @returns {Promise<*>}
* */

export async function fromShare(params, settings) {
    return await reqUtil.post({
        url : root + "/fromShare",
        settings
    } , params)
}

/**
 * 我的分享
 * @param {*} params 
 * @param {*} settings 
 */
export async function myShares(params, settings) {
    return await reqUtil.post({
        url : root + "/myShares",
        settings
    } , params)
}

/**
 * 资源数量统计
 * @param {*} settings 
 */
export async function myResourceCount(settings) {
    return await reqUtil.get({
        url : "firstPage/myResourceCount",
        settings
    })
}

/**
 * 数据集-分享的资源
 * @param {*} settings 
 */
export async function getSourceDataSetTree(settings) {
    return await reqUtil.get({
        url : "firstPageShare/myDataSet",
        settings
    } )
}

/**
 * 数据服务-分享的资源
 * @param {*} params 
 * @param {*} settings 
 */
export async function getSourceDataServiceTree(params, settings) {
    return await reqUtil.post({
        url : root + "/searchShareResource",
        settings
    }, params)
}

/**
 * 添加分享
 * @param {*} params 
 * @param {*} settings 
 */
export async function addShare(params, settings) {
    return await reqUtil.post({
        url : root + "/addShareManagement",
        settings
    }, params)
}

/**
 * 取消分享
 * @param {*} params 
 * @param {*} settings 
 */
export async function cancelShare(params, settings) {
    return await reqUtil.post({
        url : root + "/cancelShare",
        settings
    }, params)
}

/**
 * 获取情景案例模型类型
 * @param {*} settings 
 */
export async function queryParentCaseType( settings) {
    return await reqUtil.get({
        url : "scenarioCase/queryParentCaseType",
        settings
    })
}

/**
 * 情景案例查询
 * @param {*} params 
 * @param {*} settings 
 */
export async function queryScenarioCase(params, settings) {
    return await reqUtil.post({
        url : "scenarioCase/queryScenarioCase",
        settings
    }, params)
}
/**
 * 获取仪表盘分享资源
 * @param {*} settings 
 */
export async function getDashboardAllByUserId( settings) {
    return await reqUtil.post({
        url : "/dashboard/getDashboardAllByUserId",
        settings
    })
}

/**
 * 添加仪表盘对象到功能表
 * @param {*} settings 
 */
export async function dashboardAuthRegister(params, settings) {
    return await reqUtil.post({
        url : "/dashboardAuth/dashboardAuthRegister",
        settings
    }, params)
}
/**
 * 添加仪表盘授权

 * @param {*} settings 
 */
export async function addDashboardAuth(params, settings) {
    return await reqUtil.post({
        url : "/dashboardAuth/addDashboardAuth",
        settings
    }, params)
}