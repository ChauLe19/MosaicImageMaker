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
import { faArrowTurnRight, faDownload, faPlus, faWindowRestore, faX } from '@fortawesome/free-solid-svg-icons'
import { Buffer } from 'buffer';
import Description from './Description';

function App() {
  const baseURL = "http://127.0.0.1:5000";
  const [post, setPost] = React.useState("");
  const [preview, setPreview] = React.useState("https://thumbs.dreamstime.com/b/thin-line-black-camera-logo-like-upload-your-photo-thin-line-black-camera-logo-like-upload-your-photo-graphic-art-design-element-106033006.jpg");
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
    //TODO seperate fetch for each form
    //window.alert(formData)
    console.log(formData)
    await fetch(`${baseURL}/generate`, {
      method: 'POST',
      body: formData,
    }).then(resp => {
      if (resp.status === 200)
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
    window.alert(e.target)
    window.alert(e.target.id)
    if (e.target.id == "generateFormID") {
      window.alert(e.target.id)
    }
    else if (e.target.id == "mainImageID") {
      previewSelectedHandler(e)
      window.alert(e.target.id)
    }
    else if (e.target.id == "collectionFormID") {
      e.
      fileSelectedHandler(e)
      window.alert(e.target.id)
    }
    
    e.preventDefault()
    const formData = new FormData(e.target);

    Upload(formData);
  }

  const fileSelectedHandler = (e) => {
    setCollection([...e.target.files, ...collection])
    //handleSubmit(e.form)
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
          <img src={mosaic ? `data:image/jpeg;base64,${mosaic}` : "https://i.natgeofe.com/n/9135ca87-0115-4a22-8caf-d1bdef97a814/75552.jpg"} style={{ width: "100%" }} />

          <form id="generateFormID"  enctype="multipart/form-data"  onSubmit={handleSubmit}>
            <input className='generateButton' type="submit" form="generateFormID" style={{ width: "100%" }} value="Generate"/>
          </form>
         
        </div>

        <div style={{ display: "flex", flexDirection: "column", padding: "5vh" }}>

          <form id="gen" onSubmit={handleSubmit} className="container mt-5 pt-5 pb-5" enctype="multipart/form-data" style={{ width: "100%", display: "grid", gridTemplateColumns: " 20% 80%" }}>
            <div style={{ alignSelf: "center" }}>
              <label for="image-edit">
                <img id="mosaic-image" src={preview} width="100%" />
              </label>
            </div>
            <div style={{ textAlign: "left", padding: "5vh" }}>
              <label>Cell Density:</label>
              <input name='density' type="range" min={1} max={100} defaultValue={20} class="slider" style={{ width: "100%" }} />
              <label>Other param:</label>
              <input type="range" min={1} max={100} defaultValue={50} class="slider" style={{ width: "100%" }} />
            </div>
          </form>

          <form id="mainImageID" onChange={handleSubmit} enctype="multipart/form-data">
            <input type="file" id="image-edit" form="mainImageID" name="file" accept="image/*" className="file-custom" style={{ width: "50px", display: "none" }}  />
          </form>

          <div style={{ textAlign: "left", fontWeight: 'bold' }}>
            Collection
          </div>
          <div style={{ height: "300px", overflowY: "scroll" }}>
            <div>
              <div className='collection-cell'>

                <form id="collectionFormID"  enctype="multipart/form-data" onChange={handleSubmit}>
                  <input id='collection' form="collectionFormID" type="file" name="collection" accept="image/*" style={{ display: 'none' }}/>
                </form>

                <label for="collection" >
                  <FontAwesomeIcon icon={faPlus} className="add-image-button" style={{ boxSizing: "border-box" }} />
                </label>
              </div>
              {
                collection.map((img) =>
                  <div className='collection-cell' style={{ position: "relative" }} onClick={() => removeImage(img)} >
                    <img className='collection-cell-item' src={URL.createObjectURL(img)} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                  </div>
                )
              }
            </div>
          </div>
        </div>

      </div>

        <Description/>
    </div >
  );
}

export default App;
