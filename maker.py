#  maker.py    Quentin Holmes, Chau Le, Ethan Dingus     Virginia Tech       Dec 6, 2022 
# This is the UI for Mosaic Image Maker Client.
import numpy as np
import os
import cv2  # may need to install library on computer use link-->https://blog.finxter.com/how-to-install-opencv-on-pycharm/
from PIL import Image  # PIListhePythonImagingLibrary
import glob
# fromscipyimportspatial
import sys
import matplotlib.pyplot as plt
import math
import copy
import warnings
import threading
from concurrent.futures import ThreadPoolExecutor
from scipy import spatial

MAX_WORKERS = 8
tile_size = (10, 10)
tile_imgs = []
tiles = []  # resizes all the images in picture

#threading function #1
def findhuehelper(tile):
    arry=np.array(tile)
    avg_colors.append(arry.mean(axis=0).mean(axis=0))
    #return arry.mean(axis=0).mean(axis=0)# get the average of the a row
    

def findhue(mainpath, tiles):
    # resizing the the image to be smaller and than making it big pixelizing the image
    main_img = Image.open(mainpath)
    width = int(np.round(main_img.size[0] / tile_size[0]))
    height = int(np.round(main_img.size[1] / tile_size[1]))

    tiny_main = main_img.resize((width, height)) # resize main to the size of the tiles
    # tiny_main.show()
    #Added this so the image could be better pixelated
    pixel_main = tiny_main.resize(main_img.size,Image.Resampling.NEAREST)
    # pixel_main.show()

    # calculate avg color for each tile
    global avg_colors
    avg_colors = []

    for tile in tiles:
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            future = executor.submit(findhuehelper, tile)
            #print(future.result())
        #findhuehelper(tile)

    # makes a tree for our colors
    tree = spatial.KDTree(avg_colors)

    # Empty integer array to store indices of tiles
    closest_tiles = np.zeros((width, height), dtype=np.uint32)

    for i in range(width):
        for j in range(height):
            pixel = pixel_main.getpixel((i * tile_size[0], j * tile_size[1]))  # Get the pixel color at (i, j)
            closest = tree.query(pixel)  # Returns (distance, index)
            closest_tiles[i, j] = closest[1]  # We only need the index

    return pixel_main, closest_tiles

#threading function #2
#def organizehelper(i, j):
#    print("organizehelper")
#   x,y = i*w, j*h #globals
#   index = close_tiles[i, j]


def organize(pixel_main, close_tiles, result_image_path): # Organizes the tiles to be drawn on the mosiac image
    '''
    Takes the new colored images and organizes them to be in the correct positon for
    '''
    width = int(np.round(pixel_main.size[0] / tile_size[0]))
    height = int(np.round(pixel_main.size[1] / tile_size[1]))
    mosaic = Image.new('RGB',pixel_main.size) # RGB is the type of the image will be if i wanted I could make it gray

    w = tile_size[0]     # width of the tiles
    h = tile_size[1]     # height of the tiles

    #with ThreadPoolExecutor(max_workers=8) as executor:
        #future = executor.submit(organizehelper, i, j)
        
    for i in range(width):
        for j in range(height):
            x,y = i*w, j*h

            index = close_tiles[i, j]

            mosaic.paste(tiles[index],(x,y))

    mosaic.save(result_image_path)
    # mosaic.show()

    return mosaic

def mosaic_pic(main_pic, density):
    global tile_size
    global tile_imgs
    global tiles
    mainpath = main_pic
    # with Image.open("MeninDark.jpg") as mainimg:
    # mainimg.show()
    tile_size = (density, density)
    tile_imgs.clear()
    tiles.clear()

    
    # adds the images from folder into a list
    for name in glob.glob(
            './collection_images/*'):
        tile_imgs.append(name)

    for path in tile_imgs:  # look into crop eye for another way to do it
        tile = Image.open(path)
        tile = tile.resize(tile_size)
        #tile.show() #for testing resize
        tiles.append(tile)

    pixel_main,close_tiles = findhue(mainpath, tiles)
    mosaic_img = organize(pixel_main,close_tiles, mainpath)
    
"""
def main(img,otherimgs):
    #First we find the avg colors of the tile images and then find the closest color to it


    main(mainimg, tiles)  # call to use the main image
    return True


"""
