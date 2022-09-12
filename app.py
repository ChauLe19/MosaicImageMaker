from flask import Flask, request, jsonify
from flask_cors import CORS
import os
#Set up Flask:
app = Flask(__name__)
#Set up Flask to bypass CORS:
cors = CORS(app)

#Create the receiver API POST endpoint:
@app.route("/receiver", methods=["POST"])
def postME():
    # data = request.get_json()
#    data = jsonify(data)
    print(request)
    return "receiving " + str(request.get_json())


@app.route('/upload-image', methods=['POST'])
def handleUploadingImage():
    files = request.files
    file = files.get('file')
    # handle image here
    
    file.save(os.path.join(os.getcwd(),"save-images", file.filename))
    return jsonify({
        'success': True,
        'file': 'Received'
    })

if __name__ == "__main__": 
   app.run(debug=True)