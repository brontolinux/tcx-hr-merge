# Using TCX Heart Rate Merger in Your Browser

This guide explains how to download and use the TCX Heart Rate Merger directly in your web browser. No installation required, no technical knowledge needed!

## What This Tool Does

If you have a fitness activity file (TCX format) that's missing heart rate data, and another file that has the heart rate but wrong GPS or distance information, this tool can combine them to create a complete file with both correct location data AND heart rate.

## Step-by-Step Instructions

### Step 1: Download the Tool

1. Go to [github.com/marcomarongiu/tcx-hr-merge](https://github.com/marcomarongiu/tcx-hr-merge)
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Save the ZIP file to your computer (e.g., your Downloads folder)
5. Extract/unzip the downloaded file:
   - **Windows**: Right-click the ZIP file → "Extract All..."
   - **Mac**: Double-click the ZIP file
   - **Linux**: Right-click → "Extract Here" (or use your file manager)

### Step 2: Open the Tool

1. Open the extracted folder
2. Navigate to: `web-service` → `frontend`
3. Double-click on **`index.html`**

The tool will open in your default web browser. You should see a page titled "TCX Heart Rate Merger" with two file upload areas.

> **Tip**: If the file doesn't open in your browser, try right-clicking it and selecting "Open with" → your preferred browser (Chrome, Firefox, Safari, Edge, etc.)

### Step 3: Prepare Your TCX Files

You'll need two TCX files:

1. **Heart Rate Source File** – The file that has your heart rate data (even if GPS/distance is wrong)
2. **Target Activity File** – The file with correct GPS/distance that you want to add heart rate to

Common places to download TCX files:

- **Strava**: Go to your activity → click the three dots (...) → "Export Original"
- **Garmin Connect**: Go to your activity → click the gear icon → "Export to TCX"

### Step 4: Merge Your Files

1. Click the first upload button (❤️ **Heart Rate Source File**) and select your file with heart rate data
2. Click the second upload button (📍 **Target Activity File**) and select your file that needs the heart rate added
3. Click the **"Merge Files"** button
4. Wait a moment while the tool processes your files
5. Click **"Download Merged File"** to save the result to your computer

### Step 5: Upload to Your Fitness Platform

Now you can upload the merged file to your preferred platform:

- **Strava**: Go to strava.com → click "+" → "Upload activity" → select your merged file
- **Garmin Connect**: Go to connect.garmin.com → "Import" → select your merged file

## Important Notes

### Your Data Stays Private

All processing happens directly in your browser on your own computer. Your fitness files are **never uploaded to any server**. Once you close the browser tab, nothing is stored.

### No Internet Required

After you've downloaded and extracted the tool, you can use it without an internet connection. It works entirely offline!

### Troubleshooting

**The page looks wrong or doesn't work:**

- Try using a modern browser like Chrome, Firefox, Safari, or Edge
- Make sure JavaScript is enabled in your browser

**The merge button is disabled:**

- Make sure you've selected both files before clicking merge

**The download doesn't start:**

- Check if your browser is blocking downloads
- Try right-clicking the download button and selecting "Save link as..."

## Questions?

If you run into issues, you can:

- Check the [GitHub Issues page](https://github.com/marcomarongiu/tcx-hr-merge/issues) for known problems
- Open a new issue to ask for help
