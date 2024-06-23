import matplotlib.pyplot as plt
from dect_processing import *

# Paths to DICOM files and circles data
initial_dicom_path = '/Users/royaparsa/NYPC-DCT/images/Emptyphantoms/Gammexbody/CT.1.3.12.2.1107.5.1.4.83775.30000024050721561583000000063.dcm'
new_dicom_path = '/Users/royaparsa/NYPC-DCT/images/Emptyphantoms/3Dprinted/CT.1.3.12.2.1107.5.1.4.83775.30000024050721561583000000259.dcm'
circles_data_path = 'circles_data.json'

# Load and process initial DICOM image
initial_image, initial_dicom_data = load_dicom_image(initial_dicom_path)

# Process and save circles data
process_and_save_circles(initial_image, circles_data_path)

# Load new DICOM image
new_image, _ = load_dicom_image(new_dicom_path)

# Load saved circles data
saved_circles = load_circles_data(circles_data_path)

# Define radii ratios
radii_ratios = [0.3, 0.6, 0.9]

# Draw circles and calculate mean pixel values
contour_image, mean_pixel_values = draw_and_calculate_circles(
    new_image, saved_circles, radii_ratios)

# Display the result
display_image(contour_image, title='Mapped Areas of Interest On New Image')
