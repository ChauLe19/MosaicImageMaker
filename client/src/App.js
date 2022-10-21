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
import { faArrowTurnRight, faDownload, faPlus, faX } from '@fortawesome/free-solid-svg-icons'
import {Buffer} from 'buffer';

function App() {
  const baseURL = "http://127.0.0.1:5000";
  const [post, setPost] = React.useState("");
  const [preview, setPreview] = React.useState("https://i.natgeofe.com/n/9135ca87-0115-4a22-8caf-d1bdef97a814/75552.jpg");
  const [mosaic, setMosaic] = React.useState("");
  const [collection, setCollection] = React.useState([])

  // this is mostly for testing
  React.useEffect(() => {
    axios.post(`${baseURL}/receiver`, {
      text: 'Send data'
    }).then((response) => {
      setPost(response.data);
    });
  }, []);

  const Upload = async (formData) => {
    await fetch(`${baseURL}/generate`, {
      method: 'POST',
      body: formData
    }).then(resp => {
      if(resp.status === 200)
        return resp.blob()
      else
        console.log(resp)
    }).then(data => {
        
      let blob = new Blob([data], { type: "text/plain" });
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        let base64string = reader.result.split(',')[1];
        console.log(base64string)
        setMosaic(base64string);
      }
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);

    Upload(formData);
  }

  const fileSelectedHandler = (e) => {
    setCollection([...e.target.files, ...collection])
  }

  const removeImage = (file) => {
    if (window.confirm("Are you sure you want to delete this picture?")) {
      collection.splice(collection.findIndex((f) => f.name === file.name), 1)
      setCollection([...collection])
    }
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button class="flat nobg">
              <FontAwesomeIcon icon={faDownload} /> &nbsp;Download
            </button>
            <button class="flat nobg">
              <FontAwesomeIcon icon={faArrowTurnRight} />&nbsp;Share
            </button>
          </div>
          <img src={mosaic ? `data:image/jpeg;base64,${mosaic}` : "https://i.natgeofe.com/n/9135ca87-0115-4a22-8caf-d1bdef97a814/75552.jpg" } style={{ width: "100%" }} />
          <input type="submit" form="GenerateFormID" style={{ width: "100%", padding: "1vh" }} value="Generate/Reshuffle" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "5vh" }}>
          <form id="GenerateFormID" onSubmit={handleSubmit} className="container mt-5 pt-5 pb-5" enctype="multipart/form-data" style={{ width: "100%", display: "grid", gridTemplateColumns: " 20% 80%" }}>
            <div className="form-inline justify-content-center mt-5" style={{ alignSelf: "center" }}>
              <label for="image-edit" className="ml-sm-4 font-weight-bold mr-md-4" >
                <img src={preview} width="100%" />
              </label>
              <input type="file" id="image-edit" name="file" accept="image/*" className="file-custom" style={{ width: "50px", display: "none" }} onChange={previewSelectedHandler} />
            </div>
            <div style={{ textAlign: "left", padding: "5vh" }}>
              <label>Cell Density:</label>
              <input type="range" min={1} max={100} defaultValue={50} class="slider" id="myRange" style={{ width: "100%" }} />
              <label>Other param:</label>
              <input type="range" min={1} max={100} defaultValue={50} class="slider" id="myRange" style={{ width: "100%" }} />
            </div>

          </form>
          <div style={{ textAlign: "left", fontWeight: 'bold' }}>
            Collection
          </div>
          <div style={{ height: "300px", overflowY: "scroll" }}>
            <div>
              <div style={{ display: "inline-block", width: "25%", aspectRatio: "1", float: "left", padding: "5px", boxSizing: "border-box" }}>
                <input id='collection[]' type="file" multiple onChange={fileSelectedHandler} name="collection[]" accept="image/*" style={{ display: 'none' }} />
                <label for="collection[]" >
                  <FontAwesomeIcon icon={faPlus} className="add-image-button" style={{ aspectRatio: "1/1", border: "2px solid black", boxSizing: "border-box" }} />
                </label>
              </div>
              {
                collection.map((img) =>
                  <div className='collection-cell' style={{ display: "inline-block", width: "25%", aspectRatio: "1/1", float: "left", padding: "5px", boxSizing: "border-box", position: 'relative' }} onClick={() => removeImage(img)} >
                    {/* <div style={{ width: "100%", height: "100%", boxSizing: 'border-box', position: 'absolute', padding: 'inherit', inset: '0px', boxSizing: 'border-box'}}>
                      <FontAwesomeIcon icon={faX} style= {{width: '100%', height: "100%"}}/>
                    </div> */}
                    <img src={URL.createObjectURL(img)} style={{ objectFit: "cover", width: "100%", height: "100%", border: "2px solid black", boxSizing: "border-box" }} />
                  </div>
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
