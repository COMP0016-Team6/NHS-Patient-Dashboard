import React, { useEffect, useState } from "react";
import genFeeds from "../data/genFeeds";
import { Line } from "react-chartjs-2";


const Linechart = () => {
    let actualData = genFeeds()[0];
    let prescribedData = genFeeds()[0];
    
    useEffect(() => {
        actualData = genFeeds()[0];
        prescribedData = genFeeds()[0];
    })

    const data = {
        labels: prescribedData.data.map(d=>d.time),

        datasets: [
          {
            lineTension: 0.4,
            pointRadius: 3,
            label: "Actual Feed",

            data: actualData.data.map(d=>d.value),
            fill: true,
            backgroundColor: "rgba(52, 191, 110, 0.2)",
            borderColor: "#27AE60"
          },
          {
            lineTension: 0.4,
            pointRadius: 3,
            label: "Prescribed Feed",
            data: prescribedData.data.map(d=>d.value),
            fill: false,
            borderColor: "#EB5757"
          },
        ]
    };

    const options= {
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