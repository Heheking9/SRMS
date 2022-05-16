import React from "react";
import * as echarts from "echarts";

class Test extends React.Component {
  componentDidMount() {
    console.log(this.props);
    const { data, xdata } = this.props;
    console.log(data);
    var myChart = echarts.init(document.getElementById("main"));
    var data2 = xdata.map((el) => {
      console.log(el);

      return parseInt(
        data.reduce((e, pro) => {
          console.log(e, pro[el]);
          if (typeof e === "object") {
            return e[el];
          } else {
            return e + pro[el];
          }
          // if (e[el] && typeof e[el] === "number") {
          //   console.log(e);
          // if(e){}
          // }
        }) / data.length
      );
    });
    data2.shift();
    xdata.shift();

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "科研数据可视化",
      },
      tooltip: {},
      legend: {
        data: ["平均数量"],
      },
      xAxis: {
        data: xdata,
      },
      yAxis: {},
      series: [
        {
          name: "平均数量",
          type: "bar",
          data: data2,
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }
  render() {
    return <div id="main" style={{ width: 1000, height: 500 }}></div>;
  }
}
export default Test;
