import React, { useEffect, useState } from "react";
import { Button , Container,TextField , InputLabel} from '@material-ui/core';
import { Input } from '@mui/material';
import { Typography , Alert , AlertTitle} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';

const Details = (props) => {
  var today = new Date().toISOString().split("T")[0];
  const [title, setTitle] = useState("");
  const [email1, setEmail1] = useState([]);
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [pushed , setPushed] = useState(0);
  const [listEmpty , setListEmpty ] = useState(1) ;
  const [valid, setValid] = useState(1);
  const [hosted, setHosted] = useState(0) ;

  function calTime(stime) {
    let hr = parseInt(stime / 100) + "";
    let min = (stime % 100) + "";
    let time =
      (hr.length === 1 ? "0" : "") +
      hr +
      ":" +
      (min.length === 1 ? "0" : "") +
      min;
    return time;
  }
  function addParticipant(e) {
    e.preventDefault();
    if (!email1.includes(email)) {
      setEmail1([...email1, email]);
      setEmail("");
    }
  }

  async function ValidateParticipant(e, email) {
    e.preventDefault();
    console.log("hi" , email)
    let path = "/" + "check";
    if (props.meetingId !== undefined) {
      path += "/" + props.meetingId;
    }
    fetch(path, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date,
        startTime,
        endTime,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(`${data.email} is invalid`);
          setEmail1((val) => val.filter((ele) => ele==data.email));
          setValid(1);
        } else {
          alert(`${email} is Available`);
          setValid(0);
        }
      });
  }

  async function validator(e) {
    email1.forEach((email) => {
      try {
        ValidateParticipant(e, email);
      } catch (err) {
        console.log(err);
      }
    });
  }

  function CheckAvailability(e) {
    e.preventDefault();
    setPushed(1) ;
    validator(e);
  }

  useEffect(() => {
    if (props.func === "edit") {
      fetch("/meetingDetail/" + props.meetingId)
        .then((res) => res.json())
        .then((data) => {
          data = data.meeting;
          console.log("asdfsadf");
          let start = calTime(data.startTime);
          let end = calTime(data.endTime);
          setTitle(data.title);
          setEmail1(data.users.map((e)=>e.email));
          setDate(data.date);
          setStartTime(start);
          setEndTime(end);
          console.log(start , end , data.title, data.date);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);


  function formSubmitHandler(e) {
    e.preventDefault();
    let path = "/" + props.func;
    if (props.meetingId !== undefined) {
      path += "/" + props.meetingId;
    }

    fetch(path, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        date,
        startTime,
        endTime,
        email1,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert("Succesfully Interview Scheduled");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
    <div id="details">
      <div id="title">
      <Typography 
        variant="h5" marginTop={"20px"} 
        fontWeight={"600"} 
        fontFamily={"inherit"}
        > 
        {props.func}
      </Typography>
      </div>
      <div id="detailForm">
        <Container >
        <form>
            <div id = "Input">
            <TextField id="outlined-basic" variant="outlined" 
                placeholder="Meeting Id"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

          <div className="inp1" id = "Input">
            <span>
              <Typography variant="subtitle1" gutterBottom> Date</Typography>
              </span>
              <span>
            <Input disableUnderline={true}
              name="date"
              type="date"
              // defaultValue=""
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            ></Input>
            </span>
          </div>
          <div>
          
          </div>
          <div className="inp1" id = "Input" >
            <span>
            <Typography variant="subtitle1" gutterBottom> Start Time</Typography>
            </span>
            <span>
              <Input disableUnderline={true}
                type="time"
                name="start-time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              ></Input>
            </span>
          </div>

          <div className="inp1"  id = "Input" >
          <span>
            <Typography variant="subtitle1" gutterBottom>End Time</Typography>
          </span>
          <span>
            <Input disableUnderline={true}
            id="outlined-basic"
              type="time"
              name="end-time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            ></Input>
            </span>
          </div>

          <div id = "Input" className="insertList">
            <TextField id="outlined-basic" variant="outlined"
              inputProps={{ 'aria-label': 'naked' }}
              type="email"
              placeholder="Add Participant"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value) ;
                setPushed(0) ;
                setValid(1)}}
              name = ""
              required
            />
            <Button onClick={
              addParticipant
            }>
                {
                pushed ?
                  <DoneOutlinedIcon fontSize="large"  />
                :
                  <AddOutlinedIcon fontSize="large"  />
                }
            </Button>
          </div>
          {/* <div>
            {
              pushed ?
              valid ?
              <Alert severity="error">
              <AlertTitle>user already in meeting!</AlertTitle>
                This user can not be <strong> added </strong>
              </Alert>
              :
              <Alert severity="success">
              <AlertTitle>user added</AlertTitle>
                user is added in meeting. 
              </Alert>
              :
              <></>
            }
            </div> */}

            <div id = "submit" className="inp1" >
            <Button id="create" variant="outlined" 
            onClick={CheckAvailability}>
              <Typography variant="subtitle1" color={"#ffffff"} >Check Availabilty</Typography>
            </Button>
          </div>

          <div id = "submit" className="inp1" >
            <Button id="create" variant="outlined" onClick={(e) => {
            formSubmitHandler(e);
          }}>
              <Typography variant="subtitle1" color={"#ffffff"} >Host  Meeting</Typography>
            </Button>
          </div>
        </form>
        </Container>
      </div>
    </div>

    <div id="details" className="partDiv">
    <Button id="partButton" >
        <h3>Participants</h3>
    </Button>
    {
      email1.map( v => (
    <Container id="pC">
      <h5>{v}</h5>
    </Container>
    ))}
    </div>

    </>
  );
};

export default Details;
