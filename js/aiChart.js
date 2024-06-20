const customChart = echarts.init(document.querySelector('#custom-chart'));
// const scatterChart = echarts.init(document.querySelector('#scatter-chart'));

const getColor = (value) => {
    if (value >= 0.8 && value <= 1) return '#70DB93';
    if (value >= -0.8 && value < 0.8) return '#ff8650';
    if (value <= -0.8 <= value >= -1) return '#f95b5b';
}

const getText = (value) => {
    if (value >= 0.8 && value <= 1) return '人写作';
    if (value >= -0.8 && value < 0.8) return '疑似AI写作';
    if (value <= -0.8 <= value >= -1) return 'AI写作';
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

const aiRender = () => {
    const data = JSON.parse($('#custom-chart-data').text());
    const customData = data.map((item, index) => {
        return {
            name: `第${index + 1}段`,
            value: [0, index, index + 1, item],
            itemStyle: {
                normal: {
                    color: getColor(item * 1)
                }
            }
        }
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
            max: customData.length,
            axisLabel: {
                formatter: function (value) {
                    if (value === 0) return '0%';
                    if (value === data.length) return '100%';
                    return `${parseInt((100 / data.length) * (value))}%`
                },
                showMaxLabel: true,
                showMinLabel: true
            },
            axisTick: {
                show: false
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
    customChart.on('click', function(params) {
        const dataIndex = params.dataIndex;
        const dataValue = params.data.value[3];
        if (dataValue < 0.8) {
            const range = document.createRange();
            const selection = window.getSelection();
            const referenceNode = document.querySelector(`#score_${dataIndex + 1}`);
            range.selectNodeContents(referenceNode);
            selection.removeAllRanges();
            selection.addRange(range) 
            window.location.href = `#score_${dataIndex + 1}`;
        }
    });
    // // 散点图
    // const scatterData = data.map((item, index) => {
    //     return [index + 1, item]
    // });
    // scatterChart.setOption({
    //     xAxis: {
    //         type: 'value',
    //         name: '片段',
    //         nameGap: 16,
    //         splitLine: {
    //             show: false
    //         },
    //         max: scatterData.length,
    //         axisLabel: {
    //             show: false
    //         }

    //     },
    //     grid: {
    //         left: '5%',
    //         right: '10%',
    //         bottom: '15%',
    //         top: '15%'
    //     },
    //     yAxis: {
    //         min: -2,
    //         max: 2,
    //         type: 'value',
    //         name: 'AI写               人写',
    //         nameLocation: 'middle',
    //         nameGap: 15,
    //         splitLine: {
    //             show: false
    //         },
    //         axisTick: {
    //             show: true
    //         },
    //         axisLine: {
    //             show: true
    //         },
    //         axisLabel: {
    //             show: false
    //         }
    //     },
    //     series: [
    //         {
    //             data: scatterData,
    //             type: 'scatter',
    //             itemStyle: {
    //                 color: (params) => getColor(params.value[1])
    //             }
    //         }
    //     ]
    // })

}

aiRender();