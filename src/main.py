import matplotlib.pyplot as plt
from dect_processing import *
from models import *

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

# Draw circles and calculate hu values from mean pixel area in each circle
contour_image, mean_hu_values = draw_and_calculate_circles(
    new_image, saved_circles, radii_ratios)

# SANITY CHECK: Attempt to calculate using truth equations for assumption of all inserts being water

# Atomic weights of hydrogen and oxygen
atomic_weight_H = 1.0079
atomic_weight_O = 15.999

# Calculate molar mass of water
molar_mass_water = (2 * atomic_weight_H) + atomic_weight_O

# Calculate mass contribution of each element in mole of water
mass_H = 2 * atomic_weight_H
mass_O = atomic_weight_O

# Calculate Weight Fraction
weight_fraction_H = mass_H / molar_mass_water
weight_fraction_O = mass_O / molar_mass_water

# Element properties for water
Z = [1, 8]
A = [1.0079, 15.999]
I = [19.2, 95.0]

# Weight fractions for water
w_m = [weight_fraction_H, weight_fraction_O]
w_w = [weight_fraction_H, weight_fraction_O]

# Density of water (g/cc)
rho_w = 1.0
rho_m = 1.0

# Calculate true rho_e
rho_e_true = rho_e_truth(rho_m, w_m, rho_w, w_w, Z, A)
print(f"True rho_e for water: {rho_e_true}")

# Calculate Z_eff
n = 3.1 # Power law constant
z_eff_true =  z_eff_truth(w_m, Z, A, n)
print(f"True Z_eff for water {z_eff_true}")

ln_i_true = ln_i_truth(w_m, Z, A, I)
print(f"True ln(I) for water {ln_i_true}")

# Display the result
# display_image(contour_image, title='Mapped Areas of Interest On New Image')
