// potentially allow for a bar chart
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";

const Linechart = ({ type, filter, dates, showWeight }) => {
  const patientFeed = useSelector(state => state.patientFeed);
  console.log(patientFeed);
  const treatmentPlan = useSelector(state => state.patientPlan);
  const { feeds, weights } = patientFeed;

        // let parseRes = await getPatientFeeds(patient_id);
        // let parseData = parseRes.feeds;
        // let parseWeights = parseRes.weights;

        // if (!cancelled) {
        //   for (var i = 0; i < parseData.length; i++)
        //     parseData[i].timestamp = new Date(parseData[i].timestamp);

        //   for (var i = 0; i < parseWeights.length; i++) 
        //     parseWeights[i].timestamp = new Date(parseWeights[i].timestamp);
          
        //   setFeed(parseData);
        //   setWeights(parseWeights);


  const compareByMonth = (date_range, date) => {
    let lower = [parseInt(date_range[0].getFullYear()), parseInt(date_range[0].getMonth())];
    let cur_date = [parseInt(date.getFullYear()), parseInt(date.getMonth())];
    
    if (typeof(date_range[1]) === "undefined") return (lower[0] < cur_date[0]) || (lower[0] == cur_date[0] && cur_date[1] >= lower[1])
    let upper = [parseInt(date_range[1].getFullYear()), parseInt(date_range[1].getMonth())];


    if (lower[0] < cur_date[0] && cur_date[0] < upper[0]) {
      return true;
    }
    if (lower[0] == cur_date[0] && cur_date[0] == upper[0]) {
      if (cur_date[1] >= lower[1] && cur_date[1] <= upper[1]) return true;
      return false;
    }
    if ((lower[0] == cur_date[0] && cur_date[1] >= lower[1]) || (upper[0] == cur_date[0] && cur_date[0] <= upper[1])) {
      return true;
    }

    return false;
  }

  const filterFeed = (filter, dates) => {
    let newFeed = [];
    // let formattedDate;
    if (filter === "All Data") {
      for (var i = 0; i < feeds.length; i++) {
        // formattedDate = formatDate(feeds[i].timestamp);
        if (dates === null || (dates[0] <= feeds[i].timestamp && feeds[i].timestamp <= dates[1])) {
          newFeed.push({"volume": feeds[i].volume, "energy": feeds[i].energy, "timestamp": feeds[i].timestamp.toLocaleString(), "timestamp_date": feeds[i].timestamp});
        }
      }
      return newFeed;
    }

    let options;

    if (filter === "By Day") options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    else if (filter === "By Month") options = { month: 'numeric', year: 'numeric' };
    else if (filter === "By Year") options = { year: 'numeric' };

    var i = 0;
    while (i < feeds.length) {
      let byDay = (dates===null || dates.length != 2) || (filter === "By Day" && (dates[0] <= feeds[i].timestamp && feeds[i].timestamp <= dates[1]));
      let byMonth = (dates===null || dates.length != 2) || (filter === "By Month" && compareByMonth(dates, feeds[i].timestamp));
      let byYear = (dates===null || dates.length != 2) || (filter === "By Year" && (dates[0].getFullYear() <= feeds[i].timestamp.getFullYear() && feeds[i].timestamp.getFullYear() <= dates[1].getFullYear()));  

      if (byDay || byMonth || byYear) { 
        let start = i;
        let sumVolume = feeds[i].volume;
        let sumEnergy = feeds[i].energy;
        let cur_date = feeds[i].timestamp;
        let cur_date_format = feeds[i].timestamp.toLocaleDateString(undefined, options);
        i++;
        
        while (i < feeds.length && cur_date_format == feeds[i].timestamp.toLocaleDateString(undefined, options)) {
          sumVolume += feeds[i].volume;
          sumEnergy += feeds[i].energy;
          i++;
        }
        newFeed.push({"volume": (parseFloat(sumVolume/(i - start)).toFixed(2)), "energy": (parseFloat(sumEnergy/(i - start)).toFixed(2)), "timestamp": cur_date_format, "timestamp_date": cur_date});
      }
      else i++;
    }
    return newFeed;

  } 

  const findTargetVals = (timestamp) => {
    let targets = {modified_time: "", target_energy: "", target_volume: ""};

    for (var i = 0; i < treatmentPlan.length; i++) {
      if (i+1 < treatmentPlan.length && timestamp >= treatmentPlan[i].modified_time && timestamp < treatmentPlan[i+1].modified_time) {
        return treatmentPlan[i];
      }

      if (i == treatmentPlan.length - 1 && timestamp >= treatmentPlan[i].modified_time) {
        return treatmentPlan[i];
      }
    }

    return targets;
  }

  const findWeights = (timestamp) => {
    let targets = { weight: "" };

    for (var i = 0; i < weights.length; i++) {
      if (i+1 < weights.length && timestamp >= weights[i].timestamp && timestamp < weights[i+1].timestamp) {
        return weights[i];
      }

      if (i == weights.length - 1 && timestamp >= weights[i].timestamp) {
        return weights[i];
      }
    }
    return targets;
  }
 
  const data = {
    labels: filterFeed(filter, dates).map(d=>d.timestamp),
    
    // labels: feeds.map(d=>d.timestamp.toLocaleString()),
    datasets: [
      {
        lineTension: 0.4,
        pointRadius: 3,
        label: "Actual Feed",
        hidden: false,
        data: type==="volume"? filterFeed(filter, dates).map(d=>d.volume) : filterFeed(filter, dates).map(d=>d.energy),
        //data: feeds.map(d=>d.volume),
        fill: true,
        backgroundColor: "rgba(52, 191, 110, 0.2)",
        borderColor: "#27AE60",
        fontSize: 20
      },
      {
        //hidden: ((type === "volume" && (target_volume === 0 || target_volume === "")) ||  (type === "energy" && (target_energy === 0 || target_energy === "")))? true : false,
        pointRadius: 0,
        borderWidth: 2,
        label: "Prescribed Feed",
        data: type==="volume"? filterFeed(filter, dates).map(d => (findTargetVals(d.timestamp_date).target_volume)) : filterFeed(filter, dates).map(d => (findTargetVals(d.timestamp_date).target_energy)),
        borderColor: "#EB5757",
        fill: false,
        borderDash: [35,20],
        steppedLine: "middle",
      },
      {
        lineTension: 0,
        pointRadius: 0,
        borderWidth: 2,
        label: "Weight (kg)",
        hidden: showWeight? false : true,
        fill: false,
        data: showWeight? filterFeed(filter, dates).map(d=>(findWeights(d.timestamp_date).weight / 100 - 0.1)) : null,
        backgroundColor: "rgba(52, 191, 110, 0.2)",
        borderColor: "#07A1FF",
        fontSize: 20
      },
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
          let weight = parseFloat(data.datasets[2].data[tooltipItem.index]);

          let percentageDiff = parseFloat((Math.abs(actual - target) / ((actual + target) / 2)) * 100).toFixed(1);
        
          return ((type === "volume" && treatmentPlan.target_volume === 0) ||  (type === "energy" && treatmentPlan.target_energy === 0))? 
            [`Received value: ${actual}`] 
          : (tooltipItem.datasetIndex === 0? 
            [`Received value: ${actual}`, `Percentage difference: ${percentageDiff}%`] 
            : (tooltipItem.datasetIndex === 1?
            [`Target value: ${target}`, `Percentage difference: ${percentageDiff}%`] :
            [`Weight: ${(weight+0.1) * 100} kg`]));
        }
      }
    },
    
    scales: {      
      yAxes: [{
      scaleLabel: {
      display: true,
      labelString: type==="volume"? "Volume (mL^3)" : "Energy Intake (kcal)",
      fontSize: 18
      }
      }],

      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Time Stamp",
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