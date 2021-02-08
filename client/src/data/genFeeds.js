import React from 'react';

function getRandomDateArray(numItems) {
    // Create random array of objects (with date)
    let data = [];
    let baseTime = new Date('2018-05-01T00:00:00').getTime();
    let dayMs = 24 * 60 * 60 * 1000;
    for(var i = 0; i < numItems; i++) {
      data.push({
        time: new Date(baseTime + i * dayMs),
        value: Math.round(20 + 80 * Math.random())
      });
    }
    return data;
}

const genFeeds = () => {
    let feeds = [];
    
    // For the line chart
    feeds.push({
        title: 'Visits',
        data: getRandomDateArray(150)
    });

    return feeds;
}

export default genFeeds;