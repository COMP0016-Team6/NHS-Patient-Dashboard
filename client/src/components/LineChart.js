import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import Modal from "./Modal";

const Linechart = ({ type, filter, dates, showWeight }) => {
  const patientFeed = useSelector(state => state.patientFeed);
  const treatmentPlan = useSelector(state => state.patientPlan);
  const { feeds, weights } = patientFeed;
  const [open, setOpen] = useState(false);
  const [feed_id, setFeedId] = useState(0);

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
    if (filter === "All Data") {
      for (var i = 0; i < feeds.length; i++) {
        if (dates === null || (dates[0] <= feeds[i].timestamp && feeds[i].timestamp <= dates[1])) {
          newFeed.push({"id": feeds[i].id, "fluid": feeds[i].fluid, "energy": feeds[i].energy, "timestamp": feeds[i].timestamp.toLocaleString(), "timestamp_date": feeds[i].timestamp, "patient_feedback": feeds[i].patient_feedback});
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
        let feed_id = feeds[i].id;
        let sumfluid = feeds[i].fluid;
        let sumEnergy = feeds[i].energy;
        let cur_date = feeds[i].timestamp;
        let cur_date_format = feeds[i].timestamp.toLocaleDateString(undefined, options);
        let patient_feedback = feeds[i].patient_feedback;
        i++;
        
        while (i < feeds.length && cur_date_format == feeds[i].timestamp.toLocaleDateString(undefined, options)) {
          sumfluid += feeds[i].fluid;
          sumEnergy += feeds[i].energy;
          i++;
        }
        newFeed.push({"id": feed_id, "fluid": (parseFloat(sumfluid/(i - start)).toFixed(2)), "energy": (parseFloat(sumEnergy/(i - start)).toFixed(2)), "timestamp": cur_date_format, "timestamp_date": cur_date, "patient_feedback": patient_feedback });
      }
      else i++;
    }
    return newFeed;

  } 

  const findTargetVals = (timestamp) => {
    let targets = {modified_time: "", target_energy: "", target_fluid: ""};

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
    
    datasets: [
      {
        lineTension: 0.4,
        label: "Actual Feed",
        hidden: false,
        id: filterFeed(filter, dates).map(d=>d.id),
        patient_feedback: filterFeed(filter, dates).map(d=>d.patient_feedback),
        data: type==="fluid"? filterFeed(filter, dates).map(d=>d.fluid) : filterFeed(filter, dates).map(d=>d.energy),
        fill: true,
        pointBackgroundColor: filterFeed(filter, dates).map(d=> d.patient_feedback? "rgba(255, 224, 0, 1)" : "rgba(52, 191, 110, 0.2)"),
        pointRadius: filterFeed(filter, dates).map(d=> d.patient_feedback? 5 : 3),
        backgroundColor: "rgba(52, 191, 110, 0.2)",
        borderColor: "#27AE60",
        fontSize: 20
      },
      {
        pointRadius: 0,
        borderWidth: 2,
        label: "Prescribed Feed",
        data: type==="fluid"? filterFeed(filter, dates).map(d => (findTargetVals(d.timestamp_date).target_feed_fluid)) : filterFeed(filter, dates).map(d => (findTargetVals(d.timestamp_date).target_feed_energy)),
        borderColor: "#EB5757",
        fill: false,
        borderDash: [35,20],
        steppedLine: "middle",
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
          let feedback = data.datasets[0].patient_feedback[tooltipItem.index];
          let feedbackText = feedback? `Reason: ${feedback}` : "";

          let percentageDiff = parseFloat((Math.abs(actual - target) / ((actual + target) / 2)) * 100).toFixed(1);
        
          return ((type === "fluid" && treatmentPlan.target_fluid === 0) ||  (type === "energy" && treatmentPlan.target_energy === 0))? 
            [`Received value: ${actual}`, feedbackText] 
          : (tooltipItem.datasetIndex === 0? 
            [`Received value: ${actual}`, `Percentage difference: ${percentageDiff}%`, feedbackText] 
            : (tooltipItem.datasetIndex === 1?
            [`Target value: ${target}`, `Percentage difference: ${percentageDiff}%`] :
            null ));
        }
      }
    },

    onClick: (e, element) => {
      if (element.length > 0) {
        var ind = element[0]._index;
        setFeedId(data.datasets[0].id.splice(ind, 1)[0]);
        setOpen(true);
      }
    },
    
    scales: {      
      yAxes: [{
      scaleLabel: {
      display: true,
      labelString: type==="fluid"? "Fluid (mL)" : "Energy Intake (kcal)",
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

  const dataWeight = {
    labels: filterFeed(filter, dates).map(d=>d.timestamp),

    datasets: [
      {
        lineTension: 0,
        pointRadius: 1,
        borderWidth: 2,
        label: "Weight (kg)",
        fill: false,
        data: filterFeed(filter, dates).map(d=>(findWeights(d.timestamp_date).weight)),
        fill: true,
        backgroundColor: "rgba(0, 250, 250, 0.1)",
        borderColor: "#07A1FF",
        fontSize: 20
      }
    ]
  }

  const optionWeight = {
    responsive: true,

    animation: {
      easing: 'easeOutSine', 
      duration: 700
    },

    scales: {      
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Weight (kg)",
          fontSize: 18
        },
        ticks: {
          suggestedMin: 50,
          suggestedMax: 80
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
  }

  return (
    <div>
      <div className="mt-5"></div>
      <Modal open={open} feed_id={feed_id} setOpen={setOpen} />
      <Line data={data} options={options} />
      <div className="mt-5"></div>
      {showWeight? <Line data={dataWeight} options={optionWeight} /> : null}
    </div>
  )
}

export default Linechart;