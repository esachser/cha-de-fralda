import './App.css';
import React, { useEffect, useState } from 'react';
import { AppBar, Button, Card, Checkbox, CircularProgress, Container, createTheme, CssBaseline, FormControlLabel, FormGroup, Paper, ThemeProvider, Toolbar, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Route, Routes } from 'react-router-dom';

function Loader(props) {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    if (!data) {
      fetch('https://southamerica-east1-chadefralda.cloudfunctions.net/peek-items')
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw res;
        })
        .then((value) => {
          setData(value.Items);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  })

  const mapped = data ? React.Children.map(props.children, (c) => {
    if (React.isValidElement(c)) {
      return React.cloneElement(c, { data });
    }
    return c;
  }) : undefined;

  return (
    <div style={{ width: '100%' }} >
      {
        data ?
          mapped
          :
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </div>
      }
    </div>
  );
}

function PrintList(props) {
  const [items, setItems] = useState(new Set());
  function handleCheck(e) {
    const newItems = new Set(items);
    if (e.target.checked) {
      newItems.add(e.target.value);
    } else {
      newItems.delete(e.target.value);
    }
    setItems(newItems);
  }

  const [btnDisabled, setBtnDisabled] = useState(false);
  const [icon, setIcon] = useState(<SendIcon />);
  const [btnText, setBtnText] = useState('Enviar');
  function handleOnClick(e) {
    items.forEach(element => {
      console.log(element);
    });

    const dataSend = {
      Items: [...items].map((v) => ({
        Name: v,
        Qtd: 1,
      })),
    };

    console.log(dataSend);

    const headers = new Headers();
    headers.set('content-type', 'application/json');

    setBtnDisabled(true);
    setIcon(<CircularProgress />);
    setBtnText('');

    fetch('https://southamerica-east1-chadefralda.cloudfunctions.net/peek-items', {
      headers,
      method: 'POST',
      body: JSON.stringify(dataSend),
      mode: 'cors'
    })
      .then((res) => {
        if (res.ok) {
          return res.text();
        }
        throw res;
      })
      .then((value) => {
        console.log(value);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        // setTimeout(() => {setBtnDisabled(false);}, 10000);
        // setBtnDisabled(false);
        // setIcon(<SendIcon />);
        // setBtnText('Enviar');
        // Rotear para sucesso, obrigado
        window.location = '/sucesso'
      });
  }
  return (
    <>
      <FormGroup>
        {props.data.map((v) => <FormControlLabel key={v} control={<Checkbox value={v} className="listcha" onChange={handleCheck} />} label={v} />)}
      </FormGroup>
      <div style={{ display: 'flex', justifyContent: 'right', width: '100%' }}>
        <Button variant="contained" disabled={btnDisabled} endIcon={icon} onClick={handleOnClick} >{btnText}</Button>
      </div>
    </>
  );
}

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <AppBar
            position="absolute"
            color="default"
            elevation={0}
            sx={{
              position: 'relative',
              borderBottom: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            <Toolbar>
              <Typography variant="h4" color="inherit" noWrap>
                Chá do Lucas
              </Typography>
            </Toolbar>
          </AppBar>

          <Routes>
            <Route path="/" element={
              <>
                <Card variant="outlined">
                  <Typography variant="p" color="inherit" noWrap>
                    Explicar o chá do luquinhas, escolha, bla bla bla. <br />
                    Outra linha.
                  </Typography>
                </Card>

                <Loader>
                  <PrintList />
                </Loader>
              </>
            } />
            <Route path="/sucesso" element={
              <Card variant="outlined">
                <Typography variant="p" color="inherit" noWrap>
                  MUUUITO OBRIGADO!
                </Typography>
              </Card>
            } />
          </Routes>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
