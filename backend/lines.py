import cv2
import pdf2image
import numpy as np
import img2pdf
import os, glob
import sys

# Get file name from arguments
filename = sys.argv[1]

# Get images from pdf
images = pdf2image.convert_from_path(f'./{filename}')
for i in range(len(images)):
    images[i].save(f"{i}input.png", "png")

# Detect and draw lines on images
for i in range(len(images)):
    image = cv2.imread(f"{i}input.png")
    gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (19,1))
    detected_lines = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, horizontal_kernel, iterations=2)

    cnts = cv2.findContours(detected_lines, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]

    for c in cnts:
        cv2.drawContours(image, [c], -1, (25,25,255), 3)

    cv2.imwrite(f"{i}output.png", image)

# Concat images and save to pdf
with open("output.pdf", "wb") as f:
    f.write(img2pdf.convert([i for i in os.listdir('.') if i.endswith("output.png")]))

# Remove leftover files
for f in glob.glob("*.png"):
    os.remove(f)

# cv2.imshow('thresh', thresh)
# cv2.imshow('detected_lines', detected_lines)
# cv2.imshow('image', image)
# cv2.waitKey()
