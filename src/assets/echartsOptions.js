

export const echartsOpt = {
    data() {
        let level = [
            {label: "高风险",},
            {label: "中风险",},
            {label: "低风险",},
            {label: "较低风险",}
        ];

        let xLevel = [
            {label: "50以上"},
            {label: "10 - 50",},
            {label: "0 - 10",},
        ];
        let interval = 25;
        let xInterval = 50;

        function setLevel(level, interval) {
            let len = level.length;
            return level.map((item , i) => {
                item.value = (len - i) * interval;
                return item;
            })
        }
        setLevel(level , interval);
        setLevel(xLevel , xInterval);
        function getList(num=20){
            let list = [];
            for(let i = 0; i < num; i++){
                let x = xLevel[getRandom(0,2)].label,
                    y = level[getRandom(0,3)].label;
                list.push({x,y});
            }
            return list;
        }
        let res = getList();

        function findIndex(level , label){
            let inx ;
            level.forEach((l , i)=>{
                if(l.label === label) {inx = i}
            })
            return inx;
        }
        let data = setAllList(res);

        function setAllList(list){
            return list.map(item =>{
                let xInx = findIndex(xLevel , item.x),
                    yInx = findIndex(level , item.y),
                    x  = getRandom(xInx * xInterval , (xInx+1) * xInterval) ,
                    y  = getRandom(yInx * interval , (yInx+1) * interval)
                return [x,y]
            })
        }

        function getRandom(start, end) {
            return Math.round(Math.random() * (end - start) + start);
        }

        return {
            option1: {
                xAxis: {
                    name: "规模",
                    type: "value",
                    data: xLevel,
                    interval: xInterval,
                    max: xInterval * xLevel.length,
                    axisTick: {
                        show:false,
                        lineStyle: {
                            color: "#ddd"
                        }
                    },
                    axisLabel: {
                        fontSize: 14,
                        formatter: (params) => {
                            for (let j in xLevel) {
                                if (xLevel[j].value === params) {
                                    let label;
                                    label = xLevel[j].label;
                                    return '{com' + '|' + label + '}';
                                }
                            }
                        },
                        rich: {
                            com: {
                                padding: [2, 10, 2, 10],
                                color: '#909399',
                                fontSize: 12,
                                backgroundColor: 'rgb(233, 233, 235)',
                            },
                        }

                    },
                },
                yAxis: {
                    name: "风险等级",
                    axisTick: {
                        show: false,
                        lineStyle: {
                            color: "#aaa"
                        }
                    },
                    interval,
                    max: interval * level.length,
                    axisLabel: {
                        color: "rgba(0,0,0,.65)",
                        fontSize: 14,
                        width: 20,
                        height: -10,
                        writingMode: 'vertical-rl',
                        formatter: (params) => {
                            for (let j in level) {
                                if (level[j].value === params) {
                                    let label, sty;
                                    label = level[j].label.split("").join("\n");
                                    switch (j) {
                                        case "0" :
                                            sty = "high";
                                            break;
                                        case "1":
                                            sty = "middle";
                                            break;
                                        case "2":
                                            sty = "low";
                                            break;
                                        case "3":
                                            sty = "lower";
                                            break;
                                        default:
                                            sty = "com";
                                            break;
                                    }
                                    return '{' + sty + '|' + label + '}';
                                }
                            }

                        },
                        rich: {
                            com: {
                                padding: [2, 10, 2, 10],
                                color: '#909399',
                                fontSize: 12,
                                backgroundColor: 'rgb(233, 233, 235)',
                            },
                            lower: {
                                padding: [2, 10, 2, 10],
                                color: '#67C23A',
                                fontSize: 12,
                                backgroundColor: 'rgb(225, 243, 216)',
                            },
                            low: {
                                padding: [2, 10, 2, 10],
                                color: '#48A1FF',
                                fontSize: 12,
                                backgroundColor: 'rgba(72,161,255,0.09)',
                            },
                            middle: {
                                padding: [2, 10, 2, 10],
                                color: '#FAAD14',
                                fontSize: 12,
                                backgroundColor: 'rgba(250,173,20,0.09)',
                            },
                            high: {
                                padding: [2, 10, 2, 10],
                                color: '#ED7070',
                                fontSize: 12,
                                backgroundColor: 'rgba(237,112,112,0.09)',
                            }
                        }
                    },

                },
                series: [{
                    symbolSize: 10,
                    itemStyle: {
                        color: "rgba(64,144,255,0.45)",
                        borderColor: "#4090FF",
                        borderWidth: 1
                    },
                    data,
                    type: 'scatter'
                }]
            } ,
            option2 : {

            }
        }
    }
}
