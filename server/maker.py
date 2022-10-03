import numpy as np
import os
import cv2 #may need to install library on computer use link --> https://blog.finxter.com/how-to-install-opencv-on-pycharm/
from PIL import Image # PIL is the Python Imaging Library

import matplotlib.pyplot as plt
import math
import copy
import warnings

directory ='/C:\Users\Que\Desktop\2022Fall_Classes\ECE4574_LargeScale\Proejct\MosaicImageMaker\server'
os.chdir(directory) #the directory can change based on what server or folder we wanna use this is temporary
imagename=" "
img_color=cv2.imread(imagename) #this is the image in color
cv2.imshow(img_color)
# img=Image.open(filename)  could also use this if it is more helpful to go about using this for uploadign images in cv2 doesnt work


"""
Maybe look at cropeye in hw1 and look at the picture an how you would crop a image if possible
you could look trhough the corp main image and set a random image from folder to be that color  on it 
may have to color change save the new images and then organize
"""
def findhue(main_img,other_imgs):
    '''
    This fuction should look through the main upload image and the folder with other imgaes
    and goes through each group of pixels of main and sets a image from the list to be that color
    the RGB should just change

    Find the average color for the list of images
    and find the average rgb for the pixels in main image in each pixel batch
    '''

    for o in other_imgs:


def organize(main_img,other_imgs):
    '''
    Takes the new colored images and organizes them to be in the correct positon for


    '''