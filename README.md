ECE 4574 Project Fall 2022
Chau Le, Quentin Holmes, Ethan Dingus

This repo contains all the source code of the project, as well as some test images that can be used.

The client side is a React Web App, which communicates with a server side implemented with Python. The User is able to select a main image which they want to convert into a mosaic,
a density value that determines the amount of individual tiles that make up the mosaic, as well as a collection of other images which are the mosaic tiles themselves. After generating
the mosaic, the user is able to download the image to their device, or share the new image via various social media platforms or email.

Follow the setup steps in order to start and run the project.

Setup:

1. Install dependencies in the client (If you don't have nodejs installed, please do so)
```
cd client
npm install
```

2. Install dependencies in the server (If you don't have python installed, please do so)
```
cd server
pip3 install -r requirements.txt
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