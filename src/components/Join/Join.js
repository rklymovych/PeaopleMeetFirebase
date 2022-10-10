import React, {useState} from 'react';
import axios from 'axios'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {getRequest} from "../../pureFunctions";
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import {auth, db, database} from '../../firebase'
import {useHistory} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  flex: {
    maxWidth: '50%',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  }
}));

const Join = () => {
  const history = useHistory();
  const classes = useStyles();
  const [collection, setCollection] = useState({
    collectionName: '',
    doc: '',
    name: '',

  });

  const url = process.env.REACT_APP_REALTIME_DB


  const testAxios = async () => {
    const note = {
      title: 'text test ',
      date: Date.now()
    }
    try {
      await axios.post(`${url}/status.json`, note)

    } catch (err) {
      console.log(err.message)
    }
  }
  const test2Axios = async () => {
    const note = {
      title: 'text test ',
      date: Date.now()
    }
    try {
      await axios.post(`${url}/test.json`, note)

    } catch (err) {
      console.log(err.message)
    }
  }

  const deleteLastStatus = async () => {
    const a = await getRequest()
    console.log(a[0].id)
    try {
      await axios.delete(`${url}/test/${a[0].id}.json`)
      //
      // const key = Object.keys(res.data).map(key => {
      //   return {
      //     ...res.data[key],
      //     id: key
      //   }


    } catch (err) {
      console.log(err.message)
    }
  }
  const putLastStatus = async () => {
    const a = await getRequest()
    console.log(a)
    const note123 = {
      title: 'put text123 123 ',
      date: Date.now()
    }
    try {
      await axios.put(`${url}/test/${a[0].id}.json`, note123)
      //
      // const key = Object.keys(res.data).map(key => {
      //   return {
      //     ...res.data[key],
      //     id: key
      //   }


    } catch (err) {
      console.log(err.message)
    }
  }

  //    Firestore Database
	const createCollection = async () => {
		if (!collection.collectionName || !collection.name || !collection.doc) {
			console.log("no collection!");
		} else {
      for (const key in collection) {
        if (Object.hasOwnProperty.call(collection, key)) {
          db.collection(collection.collectionName)
          .doc(collection.doc)
          .set({
            key : collection.name,
          })
          .then(() => {
            console.log("Collection successfuly created");
          })
          .catch((e) => {
            console.log(e);
          });
        }
      }
    }
  }

  const setCollectionHandler = (e) => {
    setCollection({
      ...collection,
      [e.target.name]: e.target.value
    })
  }


  return (
      <div className={classes.root}>
        <Grid container spacing={3} style={{width: '100%', margin: 0}}>
          {/* <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Typography variant={"h4"}>Realtime Database</Typography>
              <hr/>
              <div>
                <Button color="primary" onClick={testAxios}>
                  Test Axios
                </Button>
                <br/>
                <Button color="primary" onClick={putLastStatus}>
                  putLastStatus
                </Button>

  
                <br/>
                <Button onClick={deleteLastStatus}>deleteLastStatus</Button>
                <br/>
                <Button onClick={test2Axios}>test2Axios</Button>
                <br/>
                <Button onClick={getRequest}>getRequest</Button>
              </div>
            </Paper>
          </Grid> */}


          <Grid item xs={12} sm={6} style={{display: 'flex', flexWrap: 'wrap', width: '100%'}}>
            <Paper className={classes.paper}>
              <Typography variant={"h4"}>Firestore Database</Typography>
              <hr/>
              <div>
                <div className={classes.flex}>
                  <TextField id="standard-basic" name="collectionName" label="collection"
                             value={collection.collectionName}
                             onChange={(e) => setCollectionHandler(e)}/>
                  <TextField id="standard-basic" name="doc" label="doc" value={collection.doc}
                             onChange={(e) => setCollectionHandler(e)}/>
                  <TextField id="standard-basic" name="name" label="name" value={collection.name}
                             onChange={(e) => setCollectionHandler(e)}/> <br/>
                  <Button onClick={createCollection}>Create Collection</Button>
                </div>


                <hr/>

                <Button target="_blank"
                        href="https://console.firebase.google.com/u/0/project/radio-aba5d/firestore/data/~2Fusers~2F5x3Ip2M7EzbR9oee2rC16SP247N2"
                        >Show Collections</Button>
              </div>
            </Paper>
          </Grid>

        </Grid>


      </div>
  );
}
export default Join