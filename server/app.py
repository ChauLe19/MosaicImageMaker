from PIL import Image #python image library
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

#Path to save-images
IMAGES_FOLDER = os.path.join(os.getcwd(),"save-images")

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
    print(IMAGES_FOLDER)
    files = request.files
    file = files.get('file')
    #file = request.files['file']
    # handle image here
    #TODO
    #1. Check that file is an image file
    #2. Convert image to one type - PNG? (if needed)
    #3. Rename image? (if needed)
    #4. resize image to standard size (512x512) (this would make all the images square?) ??
    #5. save to save-images folder in server  (directory not found)

    #get amount of files in directory (for renaming)
    amountOfImages = 0
    for path in IMAGES_FOLDER:
        if os.path.isfile(os.path.join(IMAGES_FOLDER, path)):
            amountOfImages = amountOfImages + 1
    print("amount of images = ", amountOfImages)

    #check for file
    if (file.filename == ""):
        print("no file")
        return jsonify({ 'success': False, 'file': 'No File'})

    #check there is an image file
    if (checkFileType(file.filename)):

        #save image to folder
        file.save(os.path.join(IMAGES_FOLDER, file.filename)) # os.getcwd()

        #convert image and resave
        #img = Image.open(os.path.join(IMAGES_FOLDER, file.filename))
        #img.save(file.filename[:-3] + "png")

        return jsonify({ 'success': True, 'file': 'Received'})
    else:
        print("not an image file")
        return jsonify({ 'success': False, 'file': 'Not Image'})


#check images function
def checkFileType(filename):
    print("checking type")
    allowedTypes = {'png', 'jpg', 'jpeg'}
    if (filename[-3] in allowedTypes):
        return True
    return False


if __name__ == "__main__": 
   app.run(debug=True)