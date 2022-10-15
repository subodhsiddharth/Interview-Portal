import React, { useEffect, useState } from "react";
import EditPage from "./EditInterview";
import { Link, useHistory } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography , Button } from '@mui/material';

const InterviewList = () => {
  let [data, setData] = useState([]);
  useEffect(() => {
    fetch("/allMeetings")
      .then((res) => res.json())
      .then((data) => {
        setData(data.meetings);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const history = useHistory();
  function calTime(stime) {
    let hr = parseInt(stime / 100);
    let min = (stime % 100) + "";
    let time = hr + ":" + (min.length === 1 ? "0" : "") + min;
    return time;
  }

  return (
    <div id="allInterview">      
      <TableContainer component={Paper} 
        sx={{ maxHeight: 880 }}
        id = "TableContainer"
      >
      <Typography variant="h4" gutterBottom align="center"> Interviews </Typography>
      <Table sx={{ minWidth: 650 }} 
        aria-label="Scheduled Meetings"
        id = "Table"
        >
        <TableHead>
          <TableRow>
            <TableCell align="center"> <h3>Meeting Id </h3></TableCell>
            <TableCell align="center"><h3>Participants</h3> </TableCell>
            <TableCell align="center"><h3>Date</h3></TableCell>
            <TableCell align="center"><h3>Start Time</h3></TableCell>
            <TableCell align="center"><h3>End Time</h3></TableCell>
            <TableCell align="center"><h3>Edit</h3></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) =>{
            return (
              <>
              <TableRow
                key={item._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">{item.title}</TableCell>
                  <TableCell align="center">
                    {
                      item.users.map( (e) => (
                        <>
                        {e.email}
                        <br/>
                        </>
                      ))
                    }
                  </TableCell>
                  <TableCell align="center">{item.date}</TableCell>
                  <TableCell align="center">{calTime(item.startTime)}</TableCell>
                  <TableCell align="center">{calTime(item.endTime)}</TableCell>
                  <TableCell align="center">
                    <Button onClick={ () => {
                      history.push("/edit/" + item._id);
                    }}>
                      Update
                    </Button>
                    </TableCell>
              </TableRow>
            </>
          )})}
        </TableBody>
      </Table>
    </TableContainer>
    </div> 
  );
};

export default InterviewList;
