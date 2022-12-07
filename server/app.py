# App.py    Ethan Dingus, Chau Le     Virginia Tech       Dec 6, 2022 
# This is the server for Mosaic Image Maker.

import io
from msilib.schema import MIME
from re import I
from PIL import Image #python image library
from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import os
import sys
from maker import *
import base64
import hashlib
import asyncio
import threading
from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions
imagekit = ImageKit(
    private_key='private_rHERXddWmVnU1f3XW5oYGIqNlkw=',
    public_key='public_MAc4Hls7UWfyyhszVd29r1Smiso=',
    url_endpoint = 'https://ik.imagekit.io/MosaicImageMaker'
)

#Path to save-images
IMAGES_FOLDER = os.path.join(os.getcwd(),"save_images")
COLLECTION_FOLDER = os.path.join(os.getcwd(),"collection_images")

#allowed types
allowedTypes = {'image/png', 'image/jpg', 'image/jpeg'}

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


@app.route('/generate', methods=['POST'])
def handleUploadingImage():
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
    to_be_deleted_images = []
    main_mosaic_image = files.get('file')
        
    for collection_file in request.files.getlist('collection'):
        if (checkFileType(collection_file.headers['Content-Type'])):
            submission_name = saveAndConvertImage(collection_file, COLLECTION_FOLDER)
            to_be_deleted_images.append(submission_name)
        else:
            print(collection_file.filename + " is not an acceptable image file") #just let the mosaic be created without it 
            #return jsonify({ 'success': False, 'file': 'Not Image'})



    # currently only send back what was sent to server
    # next step, send the mosaic image
    print("sub name = ",submission_name)
    print("main name = ", main_mosaic_image)
    main_mosaic_image.filename = saveAndConvertImage(main_mosaic_image, IMAGES_FOLDER)
    
    mosaic_pic(os.path.join(IMAGES_FOLDER, main_mosaic_image.filename), int(density))
    print('DONE: ', main_mosaic_image.filename)
    
    # this helps deleting file after sending the result
    return_data = io.BytesIO()
    with open(os.path.join(IMAGES_FOLDER, main_mosaic_image.filename), 'rb') as fo:
        reading = fo.read()
        return_data.write(reading)
        return_data.seek(0)    
        base64_image = base64.b64encode(reading)
        thread = threading.Thread(target = uploadToDB, args=(base64_image,))
        thread.daemon = True
        thread.start()
    
    for image_name in to_be_deleted_images:
        os.remove(os.path.join(COLLECTION_FOLDER, image_name))
    os.remove(os.path.join(IMAGES_FOLDER, main_mosaic_image.filename))

    # delete every images after sending the result
    return send_file(return_data, mimetype=main_mosaic_image.mimetype)

#check that an image is an acceptable type
def checkFileType(filetype):
    print("Checking Image Type")
    
    if (filetype in allowedTypes):
        return True
    return False

def saveAndConvertImage(file, folder_path):
    print("Converting and Saving Image")
    currentFileName = file.filename
    file.save(os.path.join(folder_path, file.filename)) # os.getcwd()

    # TODO: Discuss again since maker.py doesn't work with .png but with .jpg (original code was png)
    if not (file.filename.endswith(".jpg") or file.filename.endswith(".jpeg")):
        print("not a jpg")
        image = Image.open(os.path.join(folder_path, file.filename))
        newFileName = os.path.splitext(file.filename)[0] + ".jpg"
        print(newFileName)
        image = image.convert('RGB')
        image.save(os.path.join(folder_path, newFileName))
        image.close()
        os.remove(os.path.join(folder_path, file.filename))
        currentFileName = newFileName
    file.close()
        
    return currentFileName

def uploadToDB(base64_image):
    upload = imagekit.upload_file(
            file = base64_image,
            file_name=hashlib.sha1(base64_image).hexdigest() + ".jpg",
            options=UploadFileRequestOptions(overwrite_file=True, use_unique_file_name= False)
        )


if __name__ == "__main__": 
   app.run(debug=True)
