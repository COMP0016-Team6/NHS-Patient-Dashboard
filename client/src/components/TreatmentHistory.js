import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    maxHeight: 600
  }
});

const TreatmentHistory = () => {
  const treatmentPlan = useSelector(state => state.patientPlan);
  const classes = useStyles();

  return (
    <TableContainer component={Paper} >
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell align="center">Treatment Plan Description</TableCell>
          <TableCell align="center">Target Volume (ml^3)</TableCell>
          <TableCell align="center">Target Energy (kcal)</TableCell>
          <TableCell align="center">Modified On</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
      {treatmentPlan.map(plan => (
      <TableRow>
        <TableCell style={{ width: 350 }} align="center">{plan.description}</TableCell>
        <TableCell style={{ width: 160 }} align="center">{plan.target_feed_volume}</TableCell>
        <TableCell style={{ width: 160 }} align="center">{plan.target_feed_energy}</TableCell>
        <TableCell style={{ width: 200 }} align="center">{plan.modified_time.toLocaleString()}</TableCell>
      </TableRow>
     ))}
      </TableBody>
      </Table>
      </TableContainer>
  )
}

export default TreatmentHistory;