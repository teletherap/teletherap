import React from 'react';
import styled from '@emotion/styled'
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useHistory } from "react-router-dom";
import Config from '../config';


const Header = () => {
  const history = useHistory()
  const Flexed = styled.div(props => ({
    'flex-grow': 1,
  }))

  return (
    <Flexed>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ marginRight: 10, color: 'yellow' }}>
            {Config.Title}
          </Typography>
          <Button color="inherit"
            onClick={() => history.push('/')}>
            Home
          </Button>
        </Toolbar>
      </AppBar>
    </Flexed>
  );
};

export default Header;
