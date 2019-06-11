const handlePie = lst => {
  //单维度单度量
  const legendArr = []; //图例
  const seriesArr = [];
  const total = lst.reduce((total, item) => {
    legendArr.push(item.name);
    let value = isNaN(Number(item.value)) ? 0 : Number(item.value);
    total += value;
    seriesArr.push({
      value: value,
      name: item.name
    });
    return total;
  }, 0);
  return {
    seriesData: seriesArr,
    legendData: legendArr,
    total: total,
    title: '问题总数'
  };
};

const handleAxis = lst => {
  let dimObj = {
    type: 'category',
    data: [],
    axisPointer: {
      type: 'shadow'
    }
  };

  let yAxisObj = {
    type: 'value',
    name: '问答个数'
  };

  let measObj = {};
  lst.map(item => {
    //必须有key为dims的
    for (let key in item) {
      if (key === 'dims') {
        //维度分类
        dimObj.data.push(item[key]);
      } else {
        //度量分类
        let val =
          item[key] === null || isNaN(Number(item[key]))
            ? 0
            : parseFloat(item[key]);
        if (measObj[key]) {
          measObj[key].push(val);
        } else {
          measObj[key] = [val];
        }
      }
    }
  });
  return {
    yAxisObj: yAxisObj,
    dimObj: dimObj,
    measObj: measObj
  };
};

const polar = {
  single: val => {
    //单个值
    return val.summary[val.summary.length - 1];
  },
  multiple: val => {},
  pie: val => {
    const handleObj = handlePie(val);
    const baseTitle = {
      text: handleObj.total,
      subtext: handleObj.title,
      left: 'center',
      top: '38%',
      itemGap: 2,
      textStyle: {
        fontSize: 40,
        lineHeight: 1
      },
      subtextStyle: {
        fontSize: 16,
        lineHeight: 1
      }
    };
    const baseTooltip = {
      trigger: 'item',
      formatter: '类别 <br/>{b}: {c} ({d}%)'
    };

    const baseLegend = {
      type: 'scroll',
      bottom: 10
    };

    let seriesObj = {
      name: '问答总数',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: handleObj.seriesData
    };

    return {
      title: {
        ...baseTitle
      },
      tooltip: {
        ...baseTooltip
      },
      legend: {
        ...baseLegend
      },
      series: [seriesObj]
    };
  },
  bar: val => {
    const handleObj = handleAxis(val);

    const baseLegend = {
      data: []
    };
    const baseSeries = [];

    const baseXAxis = [
      {
        ...handleObj.dimObj
      }
    ];
    const baseYaxis = [
      {
        ...handleObj.yAxisObj
      }
    ];

    for (let key in handleObj.measObj) {
      baseLegend.data.push(key);

      baseSeries.push({
        name: key,
        type: 'bar',
        data: handleObj.measObj[key]
      });
    }

    const baseTooltip = {
      trigger: 'axis'
    };
    const baseGrid = {
      bottom: 30
    };

    return {
      grid: {
        ...baseGrid
      },
      tooltip: {
        ...baseTooltip
      },
      legend: {
        ...baseLegend
      },
      series: [...baseSeries],
      xAxis: [...baseXAxis],
      yAxis: [...baseYaxis]
    };
  },
  tag: (val, setting) => {
    let data = val.map((item, index) => {
      for (let key in item) {
        return {
          name: key,
          value: item[key]
        };
      }
    });
    return {
      title: {
        text: '标签云统计',
        show: false,
        x: 'center',
        textStyle: {
          fontSize: 23
        }
      },
      ...setting,
      backgroundColor: 'transparent',
      series: [
        {
          name: '标签云',
          type: 'wordCloud',
          size: ['2%', '99%'],
          sizeRange: [10, 40],
          textRotation: [0],
          rotationRange: [0, 0],
          //shape: 'circle',
          width: '90%',
          height: '90%',
          textPadding: 0,
          autoSize: {
            enable: true,
            minSize: 10
          },
          grid: {
            left: '2%',
            right: '2%'
          },
          textStyle: {
            normal: {
              color: function() {
                return (
                  'rgb(' +
                  [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                  ].join(',') +
                  ')'
                );
              }
            },
            emphasis: {
              shadowBlur: 5,
              shadowColor: '#888'
            }
          },
          data: data
        }
      ]
    };
  }
};

export default polar;
