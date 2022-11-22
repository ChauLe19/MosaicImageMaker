from msilib.schema import MIME
from re import I
from PIL import Image #python image library
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import sys
from maker import *

#Path to save-images
IMAGES_FOLDER = os.path.join(os.getcwd(),"save_images")
COLLECTION_FOLDER = os.path.join(os.getcwd(),"collection_images")

#allowed types
allowedTypes = {'image/png', 'image/jpg', 'image/jpeg'}

#Set up Flask:
app = Flask(__name__)
#Set up Flask to bypass CORS:
cors = CORS(app)


#@app.route("/")
#Create the receiver API POST endpoint:
@app.route("/receiver", methods=["POST"])
def postME():
    # data = request.get_json()
#    data = jsonify(data)
    print(request)
    return "receiving " + str(request.get_json())


@app.route('/uploadmainimage', methods=['POST'])
def uploadMain():
    print("uploadmain")

@app.route('/deletefromcollection', methods=['POST'])
def deleteFromCollection():
    print("delete")


@app.route('/generate', methods=['POST'])
def generateMos():
    print("gen")
    return send_file(os.path.join(COLLECTION_FOLDER, "test.png"))


@app.route('/uploadtocollection', methods=['POST']) #change to /collection??
def handleUploadingImageToCollection():
    density = request.form['density']

    #TODO
    """
    1.  need a separate request for when the user clicks the plus button and adds a file to collection, so that they can be checked and/or rejected individually
        right now the user could add multiple, but only one is being checked.
    2.  need a separate requrest for when a user clicks an image in the collection to delete.
    3. If a user sends an invalid image, dont have it added to the UI 
    4. separate request for when a user wants to download an image
    """

    files = request.files #the POST file/s example of files: files =  ImmutableMultiDict([('file', <FileStorage: '' ('application/octet-stream')>), ('collection', <FileStorage: 'test3.png' ('image/png')>)])
    
    #check for file
    if not (files.getlist('collection')):
        print("no file")
        return jsonify({ 'success': False, 'file': 'No File'})
    
    submission_name = files.getlist('collection')[0].filename
    main_mosaic_image = files.get('file')
        
    for collection_file in request.files.getlist('collection'):
        if (checkFileType(collection_file.headers['Content-Type'])):
            submission_name = saveAndConvertImageToCollection(collection_file)
        else:
            print("not an acceptable image file")
            return jsonify({ 'success': False, 'file': 'Not Image'})



    # currently only send back what was sent to server
    # next step, send the mosaic image
    print("sub name = ",submission_name)
    print("main name = ", main_mosaic_image)
    main_mosaic_image.save(os.path.join(IMAGES_FOLDER, main_mosaic_image.filename))
    # return send_file(os.path.join(COLLECTION_FOLDER, submission_name))
    
    mosaic_pic(os.path.join(IMAGES_FOLDER, main_mosaic_image.filename), int(density))
    print('DONE: ', main_mosaic_image.filename)
    return send_file(os.path.join(os.getcwd(), os.path.join(IMAGES_FOLDER, main_mosaic_image.filename)))

#check that an image is an acceptable type
def checkFileType(filetype):
    print("Checking Image Type")
    
    if (filetype in allowedTypes):
        return True
    return False

def saveAndConvertImageToCollection(file):
    print("Converting and Saving Image")
    currentFileName = file.filename
    file.save(os.path.join(COLLECTION_FOLDER, file.filename)) # os.getcwd()

    # TODO: Discuss again since maker.py doesn't work with .png but with .jpg (original code was png)
    if not (file.filename.endswith(".jpg") or file.filename.endswith(".jpeg")):
        print("not a jpg")
        image = Image.open(os.path.join(COLLECTION_FOLDER, file.filename))
        newFileName = os.path.splitext(file.filename)[0] + ".jpg"
        print(newFileName)
        image = image.convert('RGB')
        image.save(os.path.join(COLLECTION_FOLDER, newFileName))
        image.close()
        os.remove(os.path.join(COLLECTION_FOLDER, file.filename))
        currentFileName = newFileName
        
    return currentFileName


if __name__ == "__main__": 
   app.run(debug=True)