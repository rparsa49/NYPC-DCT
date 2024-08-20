import matplotlib.pyplot as plt
import numpy as np
from dect_processing import *
from models import *
import scipy.optimize as sp

# Paths to DICOM files and circles data
new_dicom_path = "/Users/royaparsa/NYPC-DCT/images/CT1.3.12.2.1107.5.1.4.83775.30000024051312040257200012307.dcm"
circles_data_path = 'circles_data.json'

# Load new DICOM image
new_image, new_dicom_data = load_dicom_image(new_dicom_path)

# Load saved circles data
saved_circles = load_circles_data(circles_data_path)

# Define radii ratios
radii_ratios = [0.3, 0.6, 0.9]

# Draw circles and calculate HU values using modality LUT
contour_image, mean_hu_values = draw_and_calculate_circles(
    new_image, saved_circles, radii_ratios, new_dicom_data)

# Display the result
display_image(contour_image, title='Mapped Areas of Interest On New Image')

# Extract hu_low, hu_mid, hu_high for each insert
hu_low = mean_hu_values[::3]
hu_mid = mean_hu_values[1::3]
hu_high = mean_hu_values[2::3]

print("HU LOW: ", hu_low)
print("HU MID: ", hu_mid)
print("HU HIGH: ", hu_high)

materials_high = determine_materials(hu_high)
materials_mid = determine_materials(hu_mid)
materials_low = determine_materials(hu_low)

# Display the results
print("\nMaterials in larger AOI: ")
for i, material in enumerate(materials_high):
    print(f"Circle {i+1}: HU = {hu_high[i]}, Material = {material}")

print("\nMaterials in medium AOI: ")
for i, material in enumerate(materials_mid):
    print(f"Circle {i+1}: HU = {hu_mid[i]}, Material = {material}")

print("\nMaterials in smaller AOI: ")
for i, material in enumerate(materials_low):
    print(f"Circle {i+1}: HU = {hu_low[i]}, Material = {material}")

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
print(f"\nTrue rho_e for water: {rho_e_true}")

# Calculate Z_eff
n = 3.1  # Power law constant
z_eff_true = z_eff_truth(w_m, Z, A, n)
print(f"\nTrue Z_eff for water {z_eff_true}")

ln_i_true = ln_i_truth(w_m, Z, A, I)
print(f"\nTrue ln(I) for water {ln_i_true}")

# Calibration process
# Define functions to fit the models
def fit_rho(x, a):
    return rho_e_model(x[0], x[1], a)

def fit_z(x, a):
    return z_eff_model(x[0], x[1], x[2], a, n)

# Prepare data for fitting
x_rho = np.array([hu_low, hu_high])
y_rho = np.array([rho_e_true] * len(hu_low))

# Fit the rho_e model
popt_rho, pcov_rho = sp.curve_fit(fit_rho, x_rho, y_rho)
print(f"\nFitted rho_e model parameters: {popt_rho}")

# Calculate rho_e for Z_eff model
rho_for_z = [rho_e_model(hu_low[i], hu_high[i], popt_rho[0])
             for i in range(len(hu_low))]
rho_for_z_arr = np.array(rho_for_z)

# Prepare data for fitting Z_eff model
x_z = np.array([hu_low, hu_high, rho_for_z_arr])
y_z = np.array([z_eff_true] * len(hu_low))

# Fit the Z_eff model
popt_z, pcov_z = sp.curve_fit(fit_z, x_z, y_z)
print(f"\nFitted Z_eff model parameters: {popt_z}")

# Calculate measured values for comparison
rho_e_meas = [rho_e_model(hu_low[i], hu_high[i], popt_rho[0])
              for i in range(len(hu_low))]
z_eff_meas = [z_eff_model(
    hu_low[i], hu_high[i], rho_e_meas[i], popt_z[0], n) for i in range(len(hu_low))]
ln_i_meas = [ln_i_fit(z_eff_meas[i]) for i in range(len(hu_low))]

# Bethe equation calculations
beta2 = beta_proton(140)  # Add calculation of proton kinetic energy

spr_meas = [spr_w_truth(rho_e_meas[i], ln_i_meas[i], ln_i_true, beta2)
            for i in range(len(hu_low))]
spr_true = spr_w_truth(rho_e_true, ln_i_true, ln_i_true, beta2)

print(f"\nStopping Power Ratio (SPR) for water: {spr_true}")
print(f"\nMeasured Stopping Power Ratios: {spr_meas}")
