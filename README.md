# NY Proton Center Dual-Energy CT Tool User Guide

## System Requirements
### Frontend
1. Install Node.js and its package manager, npm from [here](https://nodejs.org/en) (LTS Version)
2. Run the installer
3. To verify installation, type:
```
node -v
npm -v
```
4. Clone this repository using the following command:
```
git clone https://github.com/rparsa49/NYPC-DCT.git
```
5. Clone the repository with submodules:
```
git clone --recurse-submodules https://github.com/rparsa49/NYPC-DCT.git
```
6. Open the folder in Visual Studio Code, then proceed to the next section.

### Backend
1. Install Python from [here](https://www.python.org/downloads/release/python-3114/) (Make sure it is version 3.11.4)
2. Follow the installer.
3. Verify your installation with:
```
python3 --version
```
4. Back in VSCode, navigate to the following directories:
```
cd dicom-imaging-suite
cd dect-scan-fast-api
```
5. Install the dependencies. This might take a while:
```
python3 -m pip install -r requirements.txt
```
6. Everything is set up now! Please move to the next section.

## Running the Application
1. First, run the backend. Make sure you are in the folder `dect-scan-fast-api`. To run the backend, run:
```
uvicorn app:app --host 127.0.0.1 --port 5050 --reload
```
You should see something like this in your terminal:
```
INFO:     Will watch for changes in these directories: ['/Users/royaparsa/NYPC-DCT-BE']
INFO:     Uvicorn running on http://127.0.0.1:5050 (Press CTRL+C to quit)
INFO:     Started reloader process [20115] using StatReload
```
2. Now, you can run your frontend. Open a new terminal and navigate to `dicom-imaging-suite`. To run the frontend, please run:
```
npm run
```
3. A webpage should open up and show the landing page of the application. You are now ready to use it!

## Using the Application
1. The application accepts a folder in the following structure:

- folder_name
    - scans_of_high_energy
        - scan1.dcm
        - scan2.dcm
        ...
    - scans_of_low_energy
        - scan1.dcm
        - scan2.dcm
        ...
2. It will take a moment to get processed before it opens the analysis page.
3. Happy using!
