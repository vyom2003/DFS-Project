import React from "react";
import Chart from "react-apexcharts";

const TotalDownloadsStatsGraph = ({
  optionsXAxisCategories,
  optionsXAxisTitleText,
  seriesXAxisData,
}) => {
  const options = {
    chart: {
      id: "bar-chart",
      background: "#fdfefe",
    },
    theme: {
      mode: "light",
      palette: "palette1",
      monochrome: {
        enabled: true,
        color: "#0082c8",
        shadeTo: "light",
        shadeIntensity: 0.65,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
        endingShape: "rounded",
      },
    },
    xaxis: {
      categories: optionsXAxisCategories,
      title: {
        text: optionsXAxisTitleText,
        style: {
          fontSize: "16px",
        },
      },
      labels: {
        style: {
          fontSize: "14px",
        },
      },
    },

    yaxis: {
      title: {
        text: "Dataset Downloads",
        style: {
          fontSize: "16px",
        },
      },
      labels: {
        style: {
          fontSize: "16px",
        },
        formatter: function (value) {
          return Math.round(value);
        },
      },
    },
  };

  const series = [
    {
      name: "Dataset Downloads",
      data: seriesXAxisData,
    },
  ];

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      height="100%"
      width="100%"
    />
  );
};

export default TotalDownloadsStatsGraph;
