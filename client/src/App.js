import logo from './logo.svg';
import './App.css';
import axios from "axios"
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTurnRight, faDownload } from '@fortawesome/free-solid-svg-icons'

function App() {
  const baseURL = "http://127.0.0.1:5000";
  const [post, setPost] = React.useState("");
  const [preview, setPreview] = React.useState("https://i.natgeofe.com/n/9135ca87-0115-4a22-8caf-d1bdef97a814/75552.jpg");
  const [collection, setCollection] = React.useState([])

  React.useEffect(() => {
    axios.post(`${baseURL}/receiver`, {
      text: 'Send data'
    }).then((response) => {
      setPost(response.data);
    });
  }, []);

  const Upload = async (formData) => {
    await fetch(`${baseURL}/upload-image`, {
      method: 'POST',
      body: formData
    }).then(resp => {
      resp.json().then(data => { console.log(data) })
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);

    Upload(formData);
  }

  const fileSelectedHandler = (e) => {
    setCollection([...collection, ...e.target.files])
  }

  const previewSelectedHandler = (e) => {
    setPreview(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>
          Mosaic Picture Generator
        </h2>

      </header>
      <div className='main'>
        <div style={{ padding: "5vh" }}>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <button style={{background: 'none', boxShadow: "none", border: "0px", borderRadius: "0px", cursor: "pointer"}}>
              <FontAwesomeIcon icon={faDownload} /> 
              Download
            </button>
            <button style={{background: 'none', boxShadow: "none", border: "0px", borderRadius: "0px", cursor: "pointer"}}>
              <FontAwesomeIcon icon={faArrowTurnRight} /> 
              Share
            </button>
          </div>
          <img src='https://i.natgeofe.com/n/9135ca87-0115-4a22-8caf-d1bdef97a814/75552.jpg' style={{ width: "100%" }} />
          <input type="submit" form="GenerateFormID" style={{ width: "100%" }}  value="Generate/Reshuffle"/>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "5vh" }}>
          <form id="GenerateFormID" onSubmit={handleSubmit} className="container mt-5 pt-5 pb-5" enctype="multipart/form-data" style={{ width: "100%", display: "grid", gridTemplateColumns: " 20% 80%" }}>
            <div className="form-inline justify-content-center mt-5" style={{ alignSelf: "center" }}>
              <label for="image-edit" className="ml-sm-4 font-weight-bold mr-md-4" >
                <img src={preview} width="100%" />
              </label>
              <input type="file" id="image-edit" name="file" accept="image/*" className="file-custom" style={{ width: "50px", display: "none" }} onChange={previewSelectedHandler} />
            </div>
            {/* <div className="input-group justify-content-center mt-4">
              <button type="submit" className="btn btn-md btn-primary">Upload</button>
            </div> */}
            <div style={{ textAlign: "left", padding: "5vh" }}>
              <label>Cell Density:</label>
              <input type="range" min={1} max={100} defaultValue={50} class="slider" id="myRange" style={{ width: "100%" }} />
              <label>Other param:</label>
              <input type="range" min={1} max={100} defaultValue={50} class="slider" id="myRange" style={{ width: "100%" }} />
            </div>
          </form>
          <form>

            <input type="file" multiple onChange={fileSelectedHandler} />
          </form>
          <div style={{ height: "300px", overflowY: "scroll" }}>
            <div>
              {
                collection.map((img) =>
                  <img src={URL.createObjectURL(img)} style={{display: "inline-block", width: "25%", objectFit: "cover", aspectRatio: "1", float: "left" }} />
                )
              }
            </div>
          </div>

        </div>
      </div>
    </div >
  );
}

export default App;
