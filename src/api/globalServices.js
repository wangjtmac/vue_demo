

function changeStr (str) {
    return str.replace('-','');
}
let requireServices = require.context(`@/services`, true, /(\.\/(?:(?!index).)+)\.js$/),
    requireMock = require.context(`@/mock`, true, /(\.\/(?:(?!index).)+)\.js$/);
let getAllService = function (self ,req){
    ((requireContext) => {
        const arr = requireContext.keys();
        (arr || []).forEach((fileName) => {
            let config = req(fileName);
            let name = changeStr(
                fileName.replace(/^\.\/.*\//, '').replace(/\.\w+$/, '')
            );
            self[name] = config;
        });
    })(req);

}

export const globalServices = function (isMock=false){
    let req = isMock ? requireMock : requireServices;
    let vm = {};
    getAllService(vm ,req);
    let {loginservices , loginmock ,homeservices , homemock } = vm;
    let servicesStrategy = {
        login : function (){
            return loginservices || {...loginmock};
        },
        home : function (){
            return homeservices || homemock;
        }
    };
    return function (serviceName){
        return servicesStrategy[serviceName]();
    }
};
