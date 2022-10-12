import React from "react";
import { Button, Container , Box} from '@material-ui/core';

const Navbar = () => {
  return (
    <div>
      <div id="header">
        <div>
        <h1>
          Interview Creation Portal
        </h1>
        </div>
      </div>
      <div>
        <Container maxWidth="sm">
              <Button variant="contained" href="/" 
                style={{
                  backgroundColor: "#9a9a9a",
                  color: "#FFFFFF" ,
                  fontSize: "20px" ,
                  marginRight : "20px"
              }} >
                All Interviews
              </Button>
            
              <Button variant="contained" href="/create" 
              style={{
                  backgroundColor: "#9a9a9a",
                  color: "#FFFFFF" ,
                  fontSize: "20px"
              }} >
                Create New Interview
              </Button>

            </Container>
      </div>
    </div>
  );
};

export default Navbar;
