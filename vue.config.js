/*
 * @Description:
 * @version: 1.0.0
 * @Author: chenhong
 * @Date: 2021-07-15 17:09:26
 * @LastEditors: chenhong
 * @LastEditTime: 2021-07-19 10:17:23
 */
const {name} = require("./package");
module.exports = {
    devServer: {
        port : "8082",
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8090', //API服务器的地址
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        before: app => {}
    },

    configureWebpack: {
        output: {
            library: `${name}-[name]`,
            libraryTarget: "umd", // 把微应用打包成 umd 库格式
            jsonpFunction: `webpackJsonp_${name}`,
        },
    },
};
