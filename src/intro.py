import pydicom
import matplotlib.pyplot as plt
import cv2
import numpy as np
import json

# Function to save circles data to a file
def save_circles_data(circles, file_path):
    circles_list = circles[0].tolist()
    with open(file_path, 'w') as f:
        json.dump(circles_list, f)

# Function to load circles data from a file
def load_circles_data(file_path):
    with open(file_path, 'r') as f:
        circles_list = json.load(f)
    return np.array([circles_list], dtype=np.uint16)

# Function to filter out unwanted circles based on coordinates
def filter_circles(circles):
    filtered_circles = []
    for circle in circles[0]:
        x, y, radius = circle
        if y < 359:
            filtered_circles.append(circle)
    return np.array([filtered_circles], dtype=np.uint16)

# Function to calculate the HU for each circle
def calculate_hu(image, circles, slope, intercept):
    hu_values = []
    for circle in circles[0]:
        x, y, radius = circle
        mask = np.zeros(image.shape, dtype=np.uint8)
        cv2.circle(mask, (x, y), radius, 1, thickness=-1)
        pixel_values = image[mask == 1]
        hu = pixel_values * slope + intercept
        hu_values.append(np.mean(hu))
    return hu_values

# Path to the initial DICOM file
initial_dicom_path = '/Users/royaparsa/NYPC-DCT/images/Emptyphantoms/Gammexbody/CT.1.3.12.2.1107.5.1.4.83775.30000024050721561583000000063.dcm'

# Path to save the circles data
circles_data_path = 'circles_data.json'

# Load the DICOM file
dicom_data = pydicom.dcmread(initial_dicom_path)
image = dicom_data.pixel_array

# Display general information about the DICOM file
print("DICOM File Information:")
print("Patient Name:", dicom_data.get("PatientName", "Unknown"))
print("Patient ID:", dicom_data.get("PatientID", "Unknown"))
print("Modality:", dicom_data.get("Modality", "Unknown"))
print("Study Date:", dicom_data.get("StudyDate", "Unknown"))
print("Institution Name:", dicom_data.get("InstitutionName", "Unknown"))

# Convert to 8-bit grayscale image for OpenCV processing
image_8bit = cv2.normalize(
    image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8U)

# Apply Gaussian blur to reduce noise and improve circle detection
blurred_image = cv2.GaussianBlur(image_8bit, (9, 9), 0)

# Hough Circles to detect circles
circles = cv2.HoughCircles(blurred_image, cv2.HOUGH_GRADIENT, 1, minDist=20,
                           param1=50, param2=30, minRadius=0, maxRadius=50)

# Draw circles on the original image
contour_image = cv2.cvtColor(image_8bit, cv2.COLOR_GRAY2BGR)
if circles is not None:
    circles = np.uint16(np.around(circles))
    # Filter out unwanted circles
    circles = filter_circles(circles)
    # Save circles data
    save_circles_data(circles, circles_data_path)
    for i in circles[0, :]:
        # Draw the outer circle
        cv2.circle(contour_image, (i[0], i[1]), i[2], (255, 0, 0), 2)
        # Draw the center of the circle
        cv2.circle(contour_image, (i[0], i[1]), 2, (0, 255, 0), 3)

# Path to another DICOM file to apply the saved circles
new_dicom_path = '/Users/royaparsa/NYPC-DCT/images/example.dcm'

# Load the new DICOM file
new_dicom_data = pydicom.dcmread(new_dicom_path)
new_image = new_dicom_data.pixel_array

# Convert to 8-bit grayscale image for OpenCV processing
new_image_8bit = cv2.normalize(
    new_image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8U)

# Load saved circles data
saved_circles = load_circles_data(circles_data_path)

# Draw saved circles on the new DICOM image
new_contour_image = cv2.cvtColor(new_image_8bit, cv2.COLOR_GRAY2BGR)
for i in saved_circles[0, :]:
    # Draw the outer circle
    cv2.circle(new_contour_image, (i[0], i[1]), i[2], (255, 0, 0), 2)
    # Draw the center of the circle
    cv2.circle(new_contour_image, (i[0], i[1]), 2, (0, 255, 0), 3)

# Get rescale slope and intercept
slope = new_dicom_data.RescaleSlope
intercept = new_dicom_data.RescaleIntercept

# Calculate HU values for the identified circles
hu_values = calculate_hu(new_image, saved_circles, slope, intercept)
for idx, hu in enumerate(hu_values):
    print(f"Circle {idx + 1}: HU = {hu:.2f}")

# Display the result
plt.imshow(new_contour_image)
plt.title('Mapped Areas of Interest On New Image')
plt.axis('off')
plt.show()

