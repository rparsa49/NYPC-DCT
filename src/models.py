import math
import numpy as np

'''
These method formulas are references from the following:
https://github.com/NewYorkProtonCenter/dual-energy-ct/blob/main/dect_formula.py
'''

def z_eff_truth(w_m, Z, A, n):
    """
    The effective atomic number (Phys. Med. Biol. 59 (2014) 83).
    Arguments:
        w_m: weight fraction of elements for material
        Z: atomic number of elements
        A: atomic weight of elements
        n: the fitting parameter
    """
    numerator = 0
    denominator = 0
    for ele_i in range(0, len(w_m)):
        numerator = numerator + w_m[ele_i] * pow(Z[ele_i], (n+1)) / A[ele_i]
        denominator = denominator + w_m[ele_i] * Z[ele_i] / A[ele_i]
    return pow(numerator / denominator, 1.0/n)

def rho_e_truth(rho_m, w_m, rho_w, w_w, Z, A):
    """
    The ln of mean excitation potential (truth).
    Arguments:
        rho_m: density of material
        w_m: weight fraction of elements for material
        rho_w: density of water
        w_w: weight fraction of elements for water
        Z: atomic number of elements
        A: atomic weight of elements
    """

    n_m = 0
    for ele_i in range(0, len(w_m)):
        n_m = n_m + w_m[ele_i] * Z[ele_i] / A[ele_i]
    n_w = 0
    for ele_i in range(0, len(w_w)):
        n_w = n_w + w_w[ele_i] * Z[ele_i] / A[ele_i]
    return rho_m * n_m / (rho_w * n_w)
