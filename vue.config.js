
//配置end
module.exports = {
    publicPath: '/',
    lintOnSave: false, //禁用eslint
    devServer: {
        index: './index.html', //默认启动serve 打开index页面
        disableHostCheck :true ,
        open: process.platform === 'darwin',
        //host: '',
        port: 8080,
        https: false,
        hotOnly: false,
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

}
