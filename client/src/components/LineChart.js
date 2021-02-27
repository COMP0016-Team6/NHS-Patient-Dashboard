// allow daily, monthly and yearly data filtering
// also a bar chart

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const Linechart = ({patient_id, target_rate, target_volume, filter, dates}) => {
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
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getFeeds();
    return () => cancelled = true;
  }, []);

  // const formatDate = (date) => {
  //   let newDate = date.toLocaleDateString().split("/");
  //   date = new Date(parseInt(newDate[2]), parseInt(newDate[1])-1, parseInt(newDate[0]));
  //   return date;
  // }

  const compareByMonth = (date_range, date) => {
    let lower = [parseInt(date_range[0].getFullYear()), parseInt(date_range[0].getMonth())];
    let upper = [parseInt(date_range[1].getFullYear()), parseInt(date_range[1].getMonth())];

    let cur_date = [parseInt(date.getFullYear()), parseInt(date.getMonth())];

    if (lower[0] < cur_date[0] && cur_date[0] < upper[0]) {
      return true;
    }
    if ((lower[0] == cur_date[0] && cur_date[1] >= lower[1]) || (upper[0] == cur_date[0] && cur_date[0] <= upper[1])) {
      return true;
    }

    return false;
  }

  const filterFeed = (filter, feed, dates) => {
    let newFeed = [];
    // let formattedDate;
    if (filter === "All Data") {
      for (var i = 0; i < feed.length; i++) {
        // formattedDate = formatDate(feed[i].feed_timestamp);
        if (dates === null || (dates[0] <= feed[i].feed_timestamp && feed[i].feed_timestamp <= dates[1])) {
          newFeed.push({volume: feed[i].volume, "feed_timestamp": feed[i].feed_timestamp.toLocaleString()});
        }
      }
      return newFeed;
    }

    let options;

    if (filter === "By Day") options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    else if (filter === "By Month") options = { month: 'numeric', year: 'numeric' };
    else if (filter === "By Year") options = { year: 'numeric' };

    var i = 0;
    while (i < feed.length) {
      let byDay = dates === null || (filter === "By Day" && (dates[0] <= feed[i].feed_timestamp && feed[i].feed_timestamp <= dates[1]));
      let byMonth = dates === null || (filter === "By Month" && compareByMonth(dates, feed[i].feed_timestamp));
      let byYear = dates === null || (filter === "By Year" && (dates[0].getFullYear() <= feed[i].feed_timestamp.getFullYear() && feed[i].feed_timestamp.getFullYear() <= dates[1].getFullYear()));  

      if (byDay || byMonth || byYear) { 
        let start = i;
        let sum = feed[i].volume;
        let cur_date = feed[i].feed_timestamp.toLocaleDateString(undefined, options);
        i++;
        
        while (i < feed.length && cur_date == feed[i].feed_timestamp.toLocaleDateString(undefined, options)) {
          sum += feed[i].volume;
          i++;
        }
        newFeed.push({"volume": (parseFloat(sum/(i - start)).toFixed(2)), "feed_timestamp": cur_date});
      }
      else i++;
    }
    return newFeed;

  } 
 
  const data = {
    labels: filterFeed(filter, feed, dates).map(d=>d.feed_timestamp),
    
    // labels: feed.map(d=>d.feed_timestamp.toLocaleString()),
    datasets: [
      {
        lineTension: 0.4,
        pointRadius: 3,
        label: "Actual Feed",
        hidden: false,
        data: filterFeed(filter, feed, dates).map(d=>d.volume),
        //data: feed.map(d=>d.volume),
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

    animation: {
      easing: 'easeOutSine', 
      duration: 700
    },

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
          let actual = parseFloat(data.datasets[0].data[tooltipItem.index]);
          let target = parseFloat(data.datasets[1].data[tooltipItem.index]);
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
      {/* pass this from the dashboard! and pass the filter as a prop
      <button onClick={filterToggle} className="btn btn-primary">By day</button>*/}
      <Line data={data} options={options} />
    </div>
  )
}

export default Linechart;