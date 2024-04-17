import pydicom
import matplotlib.pyplot as plt 
import cv2
import numpy as np

# Load the DICOM file
file_path = '/Users/royaparsa/NYPC-DCT/images/example.dcm'
dicom_data = pydicom.dcmread(file_path)
image = dicom_data.pixel_array

# Print general information about the DICOM file (all of these are standard, can be obtained from here: https://www.dicomlibrary.com/dicom/dicom-tags/)
print("DICOM File Information:")
print("Patient Name:", dicom_data.get("PatientName", "Unknown"))
print("Patient ID:", dicom_data.get("PatientID", "Unknown"))
print("Modality:", dicom_data.get("Modality", "Unknown"))
print("Study Date:", dicom_data.get("StudyDate", "Unknown"))
print("Insitution Name:", dicom_data.get("InstitutionName", "Unknown"))

# Display the image data
if "PixelData" in dicom_data:
    plt.imshow(dicom_data.pixel_array, cmap="gray") # putting it in grayscale for OPENCV image detection
    plt.title("DICOM Image")

    plt.axis('off')  # Turn off axis numbers and ticks
    plt.show()
else:
    print("No pixel data found in the DICOM file.")

# Attempting to isolate circles in image
# Convert to 8-bit grayscale image for OpenCV processing
image_8bit = cv2.normalize(
    image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8U)

# Apply thresholding to create a binary image
_, binary_image = cv2.threshold(
    image_8bit, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

# Find contours
contours, _ = cv2.findContours(
    binary_image, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE) # Retrieves all contours and establishes a tree hierarchy of them

# Draw contours on the original image
# Convert grayscale to BGR for colored contour
contour_image = cv2.cvtColor(image_8bit, cv2.COLOR_GRAY2BGR)
for contour in contours:
    cv2.drawContours(contour_image, [contour], -1,
                     (255, 0, 0), 2)  

# Display the result
plt.imshow(contour_image)
plt.title('Areas of Interest')
plt.axis('off')
plt.show()
