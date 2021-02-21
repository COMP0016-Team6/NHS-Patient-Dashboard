import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const Linechart = ({patient_id}) => {
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
        // console.log(parseData);
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
  
      data: feed.map(d=>d.volume),
      fill: true,
      backgroundColor: "rgba(52, 191, 110, 0.2)",
      borderColor: "#27AE60"
    },
      // {
      // lineTension: 0.4,
      // pointRadius: 3,
      // label: "Prescribed Feed",
      // data: prescribedData.data.map(d=>d.value),
      // fill: false,
      // borderColor: "#EB5757"
      // },
    ]
  };

  const options = {
    responsive: true,
    scales: {
      yAxes: [{
      scaleLabel: {
      display: true,
      labelString: 'Feed (mL)'
      }
      }],

      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Time'
        }
      }]
    }     
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  )
}

export default Linechart;