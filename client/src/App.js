import logo from './logo.svg';
import './App.css';
import axios from "axios"
import React from 'react';

function App() {
  const baseURL = "http://127.0.0.1:5000";
  const [post, setPost] = React.useState("");
  React.useEffect(() => {
    axios.post(`${baseURL}/receiver`, {
      text: 'Send data'
    }).then((response) => {
      setPost(response.data);
    });
  }, []);

  const Upload = async(formData) => {
    await fetch(`${baseURL}/upload-image`, {
      method: 'POST',
      body: formData
    }).then(resp => {
      resp.json().then(data => {console.log(data)})
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    
    Upload(formData);
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          {post}
        </p>
        <form onSubmit={handleSubmit} className="container mt-5 pt-5 pb-5" enctype="multipart/form-data">
          <div className="form-inline justify-content-center mt-5">
            <label htmlFor="image" className="ml-sm-4 font-weight-bold mr-md-4">Image :  </label>
            <div className="input-group">
              <input type="file" id="image" name="file"
                accept="image/*" className="file-custom" />
            </div>
          </div>

          <div className="input-group justify-content-center mt-4">
            <button type="submit" className="btn btn-md btn-primary">Upload</button>
          </div>
        </form>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
