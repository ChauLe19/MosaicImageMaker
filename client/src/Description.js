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
import { Buffer } from 'buffer';

function Description() {
    return (<div>
        <h2>Mosaic Picture Generator</h2>
        <div>Mosaic Picture Generator provides an easy way to generate a mosaic image of your main photo out of many other cell images you provide.
        </div>
        <div>Start by select your main image at "Upload your photo". Then upload your cell image collection using "+" button. Lastly, click on "Generate" button and see your result. Download or Share as you wish!!!</div>
  </div>);
}

export default Description;
