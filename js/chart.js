const getColor = (value) => {
    if (value === 0) return '#A2A2A2';
    if (value === 1) return '#f95b5b';
    if (value === 2) return '#39A171';
    if (value === 3) return '#912608';
}

const getText = (value) => {
    if (value === 0) return '自写部分';
    if (value === 1) return '复写部分';
    if (value === 2) return '他引部分';
    if (value === 3) return '自引部分';
}

function renderItem(params, api) {
    var categoryIndex = api.value(0);
    var start = api.coord([api.value(1), categoryIndex]);
    var end = api.coord([api.value(2), categoryIndex]);
    var height = api.size([0, 1])[1];
    var rectShape = echarts.graphic.clipRectByRect(
        {
            x: start[0],
            y: start[1] - height,
            width: end[0] - start[0],
            height: height
        },
        {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
        }
    );
    return (
        rectShape && {
            type: 'rect',
            transition: ['shape'],
            shape: rectShape,
            style: api.style({
                stroke: api.style().fill,
            })
        }
    );
}


const renderPie1 = () => {
    const pieChart = echarts.init(document.querySelector('#pie-chart'))
    const pieData = JSON.parse($('#pie-chart-data').text());
    pieChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter(param) {
                // correct the percentage
                return param.name + ' (' + param.percent + '%)';
            }
        },
        legend: {
            type: 'plain',
            orient: 'horizontal',
            right: '10',
            top: '20',
        },
        series: [
            {
                type: 'pie',
                center: ['50%', '60%'],
                radius: '60%',
                label: {
                    formatter: '{b} \n ({d}%)'
                },
                data: [
                    {value: pieData[0], name: '复写率', itemStyle: {color: '#FF2B2B'}},
                    {value: (pieData[1]), name: '自写率', itemStyle: {color: '#A2A2A2'}},
                    {value: pieData[2], name: '他引率', itemStyle: {color: '#39A171'}},
                    { value: pieData[3], name: '自引率', itemStyle: { color: '#912608' } },
                ],

            }
        ]
    });
}

const renderPie2 = () => {
    const pieChart = echarts.init(document.querySelector('#pie-chart'))
    const pieData = JSON.parse($('#pie-chart-data').text());
    pieChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter(param) {
                // correct the percentage
                return param.name + ' (' + param.percent + '%)';
            }
        },
        legend: {
            type: 'plain',
            orient: 'horizontal',
            right: '10',
            top: '20',
        },
        series: [
            {
                type: 'pie',
                center: ['50%', '60%'],
                radius: '60%',
                label: {
                    formatter: '{b} \n ({d}%)'
                },
                data: [
                    {value: pieData[0], name: '复写率', itemStyle: {color: '#FF2B2B'}},
                    {value: (pieData[1] + pieData[3]), name: '自写率', itemStyle: {color: '#A2A2A2'}},
                    {value: pieData[2], name: '他引率', itemStyle: {color: '#39A171'}},
                ],

            }
        ]
    });
}


const renderBar = () => {
    const barChart = echarts.init(document.querySelector('#bar-chart'));
    const barXData = JSON.parse($('#bar-x-chart-data').text());
    const barYData = JSON.parse($('#bar-y-chart-data').text());
    barChart.setOption({
        xAxis: {
            type: 'category',
            data: barXData.map((_, index) => {
                if (index === 0) return 0;
                if (index === barXData.length - 1) return 100;
                return parseInt((100 / barXData.length) * (index + 1))
            }),
            axisLabel: {
                formatter: function (value) {
                    return value + '%';
                },
                interval:  parseInt(barXData.length / 5),
                showMaxLabel: true,
                showMinLabel: true
            }
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '10%',
            top: '10%'
        },
        // tooltip: {
        //     formatter: function (params) {
        //         return params.marker + ': ' + getText(params.value);
        //     }
        // },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} %'
            },
        },
        series: [
            {
                data: barYData,
                type: 'line',
                itemStyle: {
                    color: '#FF2B2B'
                }
            }
        ]
    })
}

const renderCustom = () => {
    const customChart = echarts.init(document.querySelector('#custom-chart'));
    const data = JSON.parse($('#custom-chart-data').text());
    let combination = 0;
    const customData = [];
    data.forEach((item, index) => {
        customData.push({
            name: `第${index + 1}段`,
            value: [0, combination, combination + item[0], item[1]],
            itemStyle: {
                normal: {
                    color: getColor(item[1])
                }
            }
        })
        combination = combination + item[0];
    });

    customChart.setOption({
        tooltip: {
            formatter: function (params) {
                return params.marker + ': ' + getText(params.value[3]);
            }
        },
        grid: {
            left: '2%',
            right: '2%',
            bottom: '30%',
            top: '0%'
        },
        yAxis: {
            show: false
        },
        xAxis: {
            max: combination,
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false,
            },
            axisLine: {
                show: false
            },
        },
        series: [
            {
                type: 'custom',
                renderItem: renderItem,
                encode: {
                    x: [0, 1],
                    y: 0
                },
                data: customData
            }
        ]
    });
}