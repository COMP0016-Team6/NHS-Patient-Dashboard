import React from 'react';

Date.prototype.formatDate = function() {
  return (this.getDate() + 1) + 
    "/" +  this.getMonth() +
    "/" +  this.getFullYear();
}

function getRandomDateArray(numItems) {
    // Create random array of objects (with date)
    let data = [];
    let baseTime = new Date('2021-02-09T00:00:00').getTime();
    let dayMs = 24 * 60 * 60 * 1000;
    for(var i = 0; i < numItems; i++) {
      data.push({
        time: new Date(baseTime + i * dayMs).formatDate(),
        value: Math.round(10 + 5 * Math.random())
      });
    }
    return data;
}

const genFeeds = () => {
    let feeds = [];
    
    // For the line chart
    feeds.push({
        title: 'Feed',
        data: getRandomDateArray(10)
    });

    return feeds;
}

export default genFeeds;