import matplotlib.pyplot as plt
import numpy as np
from dect_processing import *
from models import *
import scipy.optimize as sp

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

# Extract hu_low, hu_mid, hu_high for each insert
hu_low = mean_hu_values[::3]
hu_mid = mean_hu_values[1::3]
hu_high = mean_hu_values[2::3]

print("HU LOW: ", hu_low)
print("HU MID: ", hu_mid)
print("HU HIGH: ", hu_high)

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
n = 3.1  # Power law constant
z_eff_true = z_eff_truth(w_m, Z, A, n)
print(f"True Z_eff for water {z_eff_true}")

ln_i_true = ln_i_truth(w_m, Z, A, I)
print(f"True ln(I) for water {ln_i_true}")

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
print(f"Fitted rho_e model parameters: {popt_rho}")

# Calculate rho_e for Z_eff model
rho_for_z = [rho_e_model(hu_low[i], hu_high[i], popt_rho[0])
             for i in range(len(hu_low))]
rho_for_z_arr = np.array(rho_for_z)

# Prepare data for fitting Z_eff model
x_z = np.array([hu_low, hu_high, rho_for_z_arr])
y_z = np.array([z_eff_true] * len(hu_low))

# Fit the Z_eff model
popt_z, pcov_z = sp.curve_fit(fit_z, x_z, y_z)
print(f"Fitted Z_eff model parameters: {popt_z}")

# Calculate measured values for comparison
rho_e_meas = [rho_e_model(hu_low[i], hu_high[i], popt_rho[0])
              for i in range(len(hu_low))]
z_eff_meas = [z_eff_model(
    hu_low[i], hu_high[i], rho_e_meas[i], popt_z[0], n) for i in range(len(hu_low))]
ln_i_meas = [ln_i_fit(z_eff_meas[i]) for i in range(len(hu_low))]

# Calculate relative differences
rho_e_diff = [(rho_e_meas[i] - rho_e_true) / rho_e_true *
              100 for i in range(len(hu_low))]
z_eff_diff = [(z_eff_meas[i] - z_eff_true) / z_eff_true *
              100 for i in range(len(hu_low))]
ln_i_diff = [(ln_i_meas[i] - ln_i_true) / ln_i_true *
             100 for i in range(len(hu_low))]

# Create arrays for true values with the same length as measured values
rho_e_true_arr = np.full(len(hu_low), rho_e_true)
z_eff_true_arr = np.full(len(hu_low), z_eff_true)
ln_i_true_arr = np.full(len(hu_low), ln_i_true)

# Plotting
fig, ax = plt.subplots(2, 3, figsize=(18, 12))

# Scatter plots of measured vs. true values
ax[0, 0].scatter(rho_e_meas, rho_e_true_arr, c='g')
ax[0, 0].plot(rho_e_true_arr, rho_e_true_arr, 'r--')
ax[0, 0].set_xlabel('True rho_e')
ax[0, 0].set_ylabel('Measured rho_e')

ax[0, 1].scatter(z_eff_meas, z_eff_true_arr, c='g')
ax[0, 1].plot(z_eff_true_arr, z_eff_true_arr, 'r--')
ax[0, 1].set_xlabel('True Z_eff')
ax[0, 1].set_ylabel('Measured Z_eff')

ax[0, 2].scatter(ln_i_meas, ln_i_true_arr, c='g')
ax[0, 2].plot(ln_i_true_arr, ln_i_true_arr, 'r--')
ax[0, 2].set_xlabel('True ln(I)')
ax[0, 2].set_ylabel('Measured ln(I)')

# Scatter plots of relative differences
ax[1, 0].scatter(rho_e_diff, rho_e_true_arr, c='g')
ax[1, 0].plot([min(rho_e_true_arr), max(rho_e_true_arr)], [0, 0], 'r--')
ax[1, 0].set_ylabel('True rho_e')
ax[1, 0].set_xlabel('Relative difference (%)')

ax[1, 1].scatter(z_eff_diff, z_eff_true_arr, c='g')
ax[1, 1].plot([min(z_eff_true_arr), max(z_eff_true_arr)], [0, 0], 'r--')
ax[1, 1].set_ylabel('True Z_eff')
ax[1, 1].set_xlabel('Relative difference (%)')

ax[1, 2].scatter(ln_i_diff, ln_i_true_arr, c='g')
ax[1, 2].plot([min(ln_i_true_arr), max(ln_i_true_arr)], [0, 0], 'r--')
ax[1, 2].set_ylabel('True ln(I)')
ax[1, 2].set_xlabel('Relative difference (%)')

plt.tight_layout()
plt.show()

# Display the result
# display_image(contour_image, title='Mapped Areas of Interest On New Image')
