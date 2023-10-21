import layoutparser as lp
import pdf2image, img2pdf
import cv2, os, glob, sys
print("imported")
# model = lp.AutoLayoutModel('lp://EfficientDete/PubLayNet')
model = lp.models.Detectron2LayoutModel('lp://PrimaLayout/mask_rcnn_R_50_FPN_3x/config',
                                 extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST", 0.1],
                                 label_map={1:"TextRegion", 2:"ImageRegion", 3:"TableRegion", 4:"MathsRegion", 5:"SeparatorRegion", 6:"OtherRegion"})

# Get file name from arguments
filename = sys.argv[1]

# Get images from pdf
images = pdf2image.convert_from_path(f'./{filename}')
print("read images")
for i in range(len(images)):
    images[i].save(f"{i}input.png", "png")
print("converted images")

for i in range(len(images)):
    image = cv2.imread(f"{i}input.png")
    image = image[...,::-1]
    layout = model.detect(image)
    lines = [d for d in layout.to_dict()["blocks"] if d["type"]=="SeparatorRegion"]
    separators = lp.Layout([b for b in layout if b.type=='SeparatorRegion'])
    # print(separators)
    new_image = lp.draw_box(image, separators, box_width=2)
    new_image.save(f"{i}output.png")

# Concat images and save to pdf
with open("output.pdf", "wb") as f:
    f.write(img2pdf.convert([i for i in os.listdir('.') if i.endswith("output.png")]))

# Remove leftover files
for f in glob.glob("*.png"):
    os.remove(f)