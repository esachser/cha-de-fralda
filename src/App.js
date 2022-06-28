import './App.css';
import React, { useEffect, useState } from 'react';
import { AppBar, Button, Card, CardMedia, Checkbox, CircularProgress, Container, createTheme, CssBaseline, Divider, FormControlLabel, FormGroup, Link, Paper, Stack, ThemeProvider, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Route, Routes } from 'react-router-dom';
import background from "./img/cha-lucas.png";

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
  function handleOnClick() {
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
        window.location = `${process.env.PUBLIC_URL}#/sucesso`;
        setBtnDisabled(false);
        setIcon(<SendIcon />);
        setBtnText('Enviar');
        // Rotear para sucesso, obrigado
      });
  }
  return (
    <>
      <FormGroup style={{ padding: '1em' }} >
        {props.data.map((v) => <div key={v}><FormControlLabel key={v} control={<Checkbox value={v} color="primary" className="listcha" onChange={handleCheck} />} label={v} />  <Divider /> </div>)}
      </FormGroup>
      <div style={{ display: 'flex', justifyContent: 'right', width: '100%' }}>
        <Button variant="contained" disabled={btnDisabled || items.size === 0} endIcon={icon} onClick={handleOnClick} >{btnText}</Button>
      </div>
    </>
  );
}

const theme = createTheme({
  palette: {
    text: {
      primary: '#2a4458'
    }
  },
  spacing: 5,
});

function App() {
  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" style={{ background: '#deefff30' }} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} >
          <Stack spacing={2}>
            <AppBar
              position="absolute"
              color="default"
              elevation={0}
              sx={{
                position: 'relative',
                borderBottom: (t) => `1px solid ${t.palette.divider}`,
              }}
              style={{
                padding: '1em',
                background: '#deefff',
                backgroundImage: `url(${background})`,
                backgroundSize: '100% 101%',
                paddingTop: '98%',
              }}
            >
              {/* <Toolbar>
              <Typography variant="h4" color="#6bacde" noWrap>
                Chá do Lucas
              </Typography>
            </Toolbar> */}
            </AppBar>

            <Routes>
              <Route path="/" element={
                <>

                  <Card variant="outlined" style={{ padding: '1em', background: '#deefff80', textAlign: 'justify' }} >
                    <Typography variant="p" color="inherit">
                      Mamãe e papai tentarão usar a menor quantidade possível de fraldas descartáveis.
                      Por isso, a principal sugestão de presente são é fraldas ecológicas.
                      <br />
                      <br />
                      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }} >
                      <Link href="https://bit.ly/FraldasEcologicasLucas" target="_blank" rel="noopener">
                        <Button variant="contained">
                          Opções de fraldas ecológicas
                        </Button>
                      </Link>
                      </div>
                      <br />
                      No link acima tem opções de fraldas ecológicas da <Link href="https://www.instagram.com/paninhosdoicaro/" target="_blank" rel="noopener">@paninhosdoicaro</Link>
                    </Typography>
                  </Card>

                  <Card variant="outlined" style={{ padding: '1em', background: '#deefff80', textAlign: 'justify' }} >
                    <Typography variant="p" color="inherit">
                      Além disso, mamãe e papai também prepararam uma listinha com outras sugestões de presentes.<br />
                      É só escolher um item, selecionar ele clicando no quadradinho e, depois, clicar em enviar.
                    </Typography>
                  </Card>

                  <Loader>
                    <PrintList />
                  </Loader>

                </>
              } />
              <Route path="/sucesso" element={
                <Card variant="outlined" style={{ padding: '1em', background: '#deefff80', textAlign: 'center' }}>
                  <Typography variant="h6" color="inherit">
                    Mamãe, papai e eu agradecemos!<br />
                    Esperamos você no dia 25/07 💙
                    <br />
                    <br />
                  </Typography>
                  <CardMedia
                    component="img"
                    alt="baby approved"
                    image="https://media.giphy.com/media/3ohzdGySOAEL1KVlRu/giphy.gif"
                  />
                </Card>
              } />
            </Routes>
          </Stack>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
