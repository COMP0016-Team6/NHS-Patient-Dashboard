import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const Linechart = ({patient_id, target_rate, target_volume}) => {
  const [feed, setFeed] = useState([]);
  useEffect(() => {
    let cancelled = false;
    const getFeeds = async () => {
      try {
        const res = await fetch("http://localhost:5000/getFeeds", {
          method: "POST",
          headers: { 
            jwt_token: localStorage.token,
            "Content-type": "application/json"
          },
          body: JSON.stringify({patient_id})
        });
        let parseData = await res.json();
        if (!cancelled) {
          for (var i = 0; i < parseData.length; i++) {
            parseData[i].feed_timestamp = new Date(parseData[i].feed_timestamp);
          }
          setFeed(parseData);
          console.log(parseData);
        }      
      } catch (err) {
        console.error(err.message);
      }
    };
    getFeeds();
    return () => cancelled = true;
  }, []);


  const data = {
    labels: feed.map(d=>d.feed_timestamp.toLocaleString()),
  
    datasets: [
      {
        lineTension: 0.4,
        pointRadius: 3,
        label: "Actual Feed",
        hidden: false,
        data: feed.map(d=>d.volume),
        fill: true,
        backgroundColor: "rgba(52, 191, 110, 0.2)",
        borderColor: "#27AE60",
        fontSize: 20
      },
      {
        lineTension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        label: "Prescribed Feed",
        data: feed.map(d=>target_volume),
        borderColor: "#EB5757",
        fill: false,
        borderDash: [35,20]
      }
    ]
  };
    

  const options = {
    responsive: true,

    annotation: {
      annotations: [{
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: 5,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 4,
        label: {
          enabled: false,
          content: 'Test label'
        }
      }]
    },

    tooltips: {
      titleFontSize: 14,
      bodyFontSize: 14,
      borderWidth: 2,
      displayColors: false,
      borderColor: 'rgba(252, 214, 112, 1)',
      callbacks: {
        label: function(tooltipItem, data) {
          let actual = data.datasets[0].data[tooltipItem.index];
          console.log(tooltipItem);
          let target = data.datasets[1].data[tooltipItem.index];
          let percentageDiff = parseFloat((Math.abs(actual - target) / ((actual + target) / 2)) * 100).toFixed(1);
        
          return tooltipItem.datasetIndex === 0? 
            [`Received value: ${actual}`, `Percentage difference: ${percentageDiff}%`] 
            : 
            [`Target value: ${target}`, `Percentage difference: ${percentageDiff}%`];
        }
      }
    },
    
    scales: {      
      yAxes: [{
      scaleLabel: {
      display: true,
      labelString: 'Volume (mL^3)',
      fontSize: 18
      }
      }],

      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Time Stamp',
          fontSize: 18
        }
      }]
    },

    legend: {
      display: false
    }
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  )
}

export default Linechart;