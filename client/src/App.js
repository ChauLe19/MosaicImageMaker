/*  App.js    Chau Le, Ethan Dingus     Virginia Tech       Dec 6, 2022 
 *  This is the UI for Mosaic Image Maker Client.
 */
import logo from './logo.svg';
import './App.css';
import { trackPromise } from 'react-promise-tracker';
import { useState } from 'react';
import { Bars } from 'react-loader-spinner'; //install react-loader-spinner
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
import { faArrowTurnRight, faDownload, faPlus, faX, faMailForward, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram, faInstagramSquare, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { Buffer } from 'buffer';
import Description from './Description';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import { RenderArea } from 'react-area';
const sha1 = require('js-sha1')
const IMAGEKIT_DB = 'https://ik.imagekit.io/MosaicImageMaker/'

function App() {
  const baseURL = "http://127.0.0.1:5000";
  const [post, setPost] = React.useState("");
  const [preview, setPreview] = React.useState("https://thumbs.dreamstime.com/b/thin-line-black-camera-logo-like-upload-your-photo-thin-line-black-camera-logo-like-upload-your-photo-graphic-art-design-element-106033006.jpg");
  const [mosaic, setMosaic] = React.useState("");
  const [collection, setCollection] = React.useState([])
  const [density, setDensity] = React.useState(20)
  const [imageURL, setImageURL] = React.useState("")
  const [isLoading, setIsLoading] = useState(false);
  // this is mostly for testing
  // TODO: NOT NEEDED ANYMORE
  // React.useEffect(() => {
  //   axios.post(`${baseURL}/receiver`, {
  //     text: 'Send data'
  //   }).then((response) => {
  //     setPost(response.data);
  //   });
  // }, []);

  const Upload = async (formData) => {
    console.log(formData)
    setIsLoading(true);
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
        setMosaic(base64string);
        setImageURL(IMAGEKIT_DB + DataURIToImgURL(base64string));
      }
    })
    setIsLoading(false);
  }

  function DataURIToImgURL(uri) {
    const filename = `${sha1.hex(uri)}.jpg`
    return filename
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    formData.delete('collection')
    for (const file of collection) {
      formData.append('collection', file)
    }

    Upload(formData);
  }

  const fileSelectedHandler = (e) => {
    let temp_collection = [...e.target.files, ...collection]
    let unique_collection = temp_collection.filter((c, index) => {
      return temp_collection.findIndex(obj => obj.name === c.name) === index;
    });

    setCollection(unique_collection)
  }

  const removeImage = (file) => {
    if (window.confirm("Are you sure you want to delete this picture?")) {
      collection.splice(collection.findIndex((f) => f.name === file.name), 1)
      setCollection([...collection])
    }
  }

  const handleDensity = (e) => {
    setDensity(e.target.value);
  }

  const handleDownload = (e) => {
    const linkSource = `data:image/jpeg;base64,${mosaic}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = 'index.jpg';
    downloadLink.click();
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
            <button class="flat nobg" onClick={handleDownload}>
              <FontAwesomeIcon icon={faDownload} /> &nbsp;Download
            </button>
            <button class="flat nobg fake-button" style={{ flexGrow: 2 }}>
            </button>
            <button class="flat nobg fake-button">
              Share via:
            </button>
            <FacebookShareButton url={imageURL ? imageURL : "https://i.natgeofe.com/n/9135ca87-0115-4a22-8caf-d1bdef97a814/75552.jpg"}>
              <button class="flat nobg">
                <FontAwesomeIcon icon={faFacebookF} />
              </button>
            </FacebookShareButton>
            <TwitterShareButton url={imageURL ? imageURL : "https://i.natgeofe.com/n/9135ca87-0115-4a22-8caf-d1bdef97a814/75552.jpg"}>
              <button class="flat nobg">
                <FontAwesomeIcon icon={faTwitter} />
              </button>
            </TwitterShareButton>
            <LinkedinShareButton url={imageURL ? imageURL : "https://i.natgeofe.com/n/9135ca87-0115-4a22-8caf-d1bdef97a814/75552.jpg"}>
              <button class="flat nobg">
                <FontAwesomeIcon icon={faLinkedin} />
              </button>
            </LinkedinShareButton>
            <EmailShareButton url={imageURL ? imageURL : "https://i.natgeofe.com/n/9135ca87-0115-4a22-8caf-d1bdef97a814/75552.jpg"}>
              <button class="flat nobg">
                <FontAwesomeIcon icon={faEnvelope} />
              </button>
            </EmailShareButton>
          </div>
            {isLoading ? <div style={{ width: "100%" , alignSelf: "center"}}><Bars color="#3066be" height="100%" width="100%" /></div> : <img src={mosaic ? `data:image/jpeg;base64,${mosaic}` : "https://i.natgeofe.com/n/9135ca87-0115-4a22-8caf-d1bdef97a814/75552.jpg"} style={{ width: "100%" }} />}
          <input className='generateButton' type="submit" form="GenerateFormID" style={{ width: "100%" }} value="Generate" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "5vh" }}>
          <form id="GenerateFormID" onSubmit={handleSubmit} className="container mt-5 pt-5 pb-5" enctype="multipart/form-data" style={{ width: "100%", display: "grid", gridTemplateColumns: " 20% 80%" }}>
            <div style={{ alignSelf: "center" }}>
              <label for="image-edit">
                <img id="mosaic-image" src={preview} width="100%" />
              </label>
              <input type="file" id="image-edit" name="file" accept="image/*" className="file-custom" style={{ width: "50px", display: "none" }} onChange={previewSelectedHandler} />
            </div>
            <div style={{ textAlign: "left", padding: "5vh" }}>
              <label>Tile Size (px): </label>
              <label>{density}</label>
              <input name='density' type="range" min={1} max={50} defaultValue={20} class="slider" style={{ width: "100%" }} onChange={handleDensity} />
            </div>

          </form>
          <div style={{ textAlign: "left", fontWeight: 'bold' }}>
            Collection
          </div>
          <div style={{ height: "300px", overflowY: "scroll" }}>
            <div>
              <div className='collection-cell'>
                <input id='collection' form='GenerateFormID' type="file" multiple onChange={fileSelectedHandler} name="collection" accept="image/*" style={{ display: 'none' }} />
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
      <Description />
    </div >
  );
}

export default App;
