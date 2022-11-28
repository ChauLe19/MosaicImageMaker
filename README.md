This repo is for testing client written in JS (ReactJS) and server written in Python. Currently, user can upload a picture, the server receives it and save the image in `save-images` folder.

Setup:

1. Install dependencies in the client (If you don't have nodejs installed, please do so)
```
cd client
npm install
```

2. Install dependencies in the server (If you don't have python installed, please do so)
```
cd server
pip3 install flask
pip3 install flask-cors
pip3 install Pillow
pip3 install matplotlib.pyplot
pip3 install scipy
pip3 install imagekitio
pip3 install numpy
```

3. Start the server
```
cd server
python3 app.py
```

4. Start the client, then go to http://localhost:3000
```
cd client
npm start
```