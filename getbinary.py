import numpy as np
import cv2
import skimage.exposure
import json

# read mp4 file
vidcap = cv2.VideoCapture('badapple.mp4')
success, image = vidcap.read()

count = 0
all_frames = []
# pixels of the output
XOUTPUT, YOUTPUT = 120, 135


def run_length_encode(binary):
    c = binary[0][0]
    s = ""
    count = 0
    for i in [item for sublist in binary for item in sublist]:
        if i == c:
            count += 1
        else:
            s += str(count) + ("W" if c == 0 else "B")
            c = i
            count = 1
    s += str(count) + ("W" if c == 0 else "B")
    return s


while success:
    success, image = vidcap.read()
    if (count % 3 == 0):
        blur = cv2.GaussianBlur(image, (0, 0), sigmaX=3,
                                sigmaY=3, borderType=cv2.BORDER_DEFAULT)
        result = skimage.exposure.rescale_intensity(
            blur, in_range=(127.5, 255), out_range=(0, 255))
        grayscale = cv2.cvtColor(result.astype(np.uint8), cv2.COLOR_BGR2GRAY)
        shrunk = cv2.resize(grayscale, (XOUTPUT, YOUTPUT))
        ret, binary = cv2.threshold(shrunk, 127, 1, cv2.THRESH_BINARY)
        # Image.fromarray(shrunk).save(f"binary/{count}.png")
        binary = [i.tolist() for i in binary]
        all_frames.append(run_length_encode(binary))
        print("Frame", count)
    count += 1


open(f"binary{XOUTPUT}x{YOUTPUT}.txt", "w").write('\n'.join(all_frames))
