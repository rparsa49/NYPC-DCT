import pydicom
import cv2
import numpy as np
import json
import matplotlib.pyplot as plt

# Function to save circles data to a file
# Arguments:
# - circles: Detected circles data
# - file_path: Path to the file where circles data will be saved
def save_circles_data(circles, file_path):
    circles_list = circles[0].tolist()
    with open(file_path, 'w') as f:
        json.dump(circles_list, f)

# Function to load circles data from a file
# Arguments:
# - file_path: Path to the file where circles data is stored
# Returns:
# - Numpy array of circles data
def load_circles_data(file_path):
    with open(file_path, 'r') as f:
        circles_list = json.load(f)
    return np.array([circles_list], dtype=np.uint16)

# Function to filter out unwanted circles based on coordinates
# Arguments:
# - circles: Numpy array of detected circles
# Returns:
# - Numpy array of filtered circles
def filter_circles(circles):
    filtered_circles = []
    for circle in circles[0]:
        x, y, radius = circle
        if y < 359:
            filtered_circles.append(circle)
    return np.array([filtered_circles], dtype=np.uint16)

# Function to calculate the mean pixel value for a circle
# Arguments:
# - image: Image data
# - circle: Circle parameters (x, y, radius)
# Returns:
# - Mean pixel value within the circle
def calculate_mean_pixel_value(image, circle):
    x, y, radius = circle
    mask = np.zeros(image.shape, dtype=np.uint8)
    cv2.circle(mask, (x, y), radius, 1, thickness=-1)
    pixel_values = image[mask == 1]
    mean_value = np.mean(pixel_values)
    return mean_value

# Function to load a DICOM image
# Arguments:
# - dicom_path: Path to the DICOM file
# Returns:
# - Image data and DICOM metadata
def load_dicom_image(dicom_path):
    dicom_data = pydicom.dcmread(dicom_path)
    image = dicom_data.pixel_array
    return image, dicom_data

# Function to process the image and save detected circles data
# Arguments:
# - image: Image data
# - circles_data_path: Path to save the circles data
def process_and_save_circles(image, circles_data_path):
    image_8bit = cv2.normalize(
        image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8U)
    blurred_image = cv2.GaussianBlur(image_8bit, (9, 9), 0)
    circles = cv2.HoughCircles(blurred_image, cv2.HOUGH_GRADIENT, 1,
                               minDist=20, param1=50, param2=30, minRadius=0, maxRadius=50)

    if circles is not None:
        circles = np.uint16(np.around(circles))
        circles = filter_circles(circles)
        save_circles_data(circles, circles_data_path)

# Function to draw circles on an image and calculate mean pixel values
# Arguments:
# - image: Image data
# - saved_circles: Numpy array of saved circles data
# - radii_ratios: List of radii ratios for smaller circles
# Returns:
# - Image with drawn circles and list of mean pixel values
def draw_and_calculate_circles(image, saved_circles, radii_ratios):
    image_8bit = cv2.normalize(
        image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8U)
    contour_image = cv2.cvtColor(image_8bit, cv2.COLOR_GRAY2BGR)
    mean_pixel_values = []

    for circle in saved_circles[0, :]:
        x, y, radius = circle
        cv2.circle(contour_image, (x, y), radius, (255, 0, 0), 2)
        cv2.circle(contour_image, (x, y), 2, (0, 255, 0), 3)

        for ratio in radii_ratios:
            new_radius = int(radius * ratio)
            mean_value = calculate_mean_pixel_value(image, (x, y, new_radius))
            mean_pixel_values.append(mean_value)
            cv2.circle(contour_image, (x, y), new_radius, (0, 255, 255), 2)

    return contour_image, mean_pixel_values

# Function to display an image using matplotlib
# Arguments:
# - image: Image data to be displayed
# - title: Title for the displayed image
def display_image(image, title='Image'):
    plt.imshow(image)
    plt.title(title)
    plt.axis('off')
    plt.show()
