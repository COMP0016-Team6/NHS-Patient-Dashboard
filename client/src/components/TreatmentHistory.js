import React from "react";
import { useSelector } from "react-redux";

import { Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Paper}  from '@material-ui/core';
import { useStylesTable } from '../styles/styles';

const TreatmentHistory = () => {
  const treatmentPlan = useSelector(state => state.patientPlan);
  const classes = useStylesTable();

  return (
    <TableContainer component={Paper} >
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Treatment Plan Description</TableCell>
            <TableCell align="center">Target Fluid (ml^3)</TableCell>
            <TableCell align="center">Target Energy (kcal)</TableCell>
            <TableCell align="center">Modified On</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {treatmentPlan.map(plan => (
          <TableRow key={plan.modified_time + plan.description} style={{overflow: "scroll"}}>
            <TableCell align="center">{plan.description}</TableCell>
            <TableCell align="center">{plan.target_feed_fluid}</TableCell>
            <TableCell align="center">{plan.target_feed_energy}</TableCell>
            <TableCell align="center">{plan.modified_time.toLocaleString()}</TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TreatmentHistory;