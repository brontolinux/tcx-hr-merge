# TCX Heart Rate Merger

Merge heart rate data from one TCX file into another, using timestamps as the reference.

This is useful when you have a TCX file with correct GPS/distance data but missing heart rate, and another TCX file with heart rate data but incorrect laps or distances. The tool matches trackpoints by timestamp and copies the heart rate values over.

## Available Versions

### 🌐 Browser Version (Recommended for Most Users)

Use the tool directly in your web browser – no installation required!

- **[Browser Instructions](BROWSER.md)** – Step-by-step guide for non-technical users
- All processing happens locally in your browser – your files never leave your device
- Works offline after downloading

### 🐍 Python Script

A command-line tool for users comfortable with Python.

- **[Python Script](python-script/)** – Instructions and source code
- Requires Python 3.x
- Ideal for automation or batch processing

### ☁️ Web Service Deployment

Deploy the browser version to AWS S3 for team or public use.

- **[Web Service](web-service/)** – Terraform configuration for AWS deployment
- Static website hosting – no server-side processing costs
- Optional IP restriction for private deployments

## Background

I did an activity on a Technogym Treadmill with my Garmin watch sending heart rate data to the Technogym Live app. When the activity was uploaded to Strava, the heart rate information was missing. I still had the HR data in my watch, but with incorrect distance/lap information.

I asked CoPilot to merge the two TCX files from Strava and Garmin Connect, and it wrote a Python script to do the trick. The web-based version was added later for easier access.

## How it Works

1. Both TCX files are parsed as XML
2. A map of timestamps to heart rate values is built from the source file
3. For each trackpoint in the target file, if a matching timestamp exists, the heart rate is copied over
4. The merged file is saved with proper XML formatting

## License

GNU General Public License v3.0 (GPL-3.0)

## Author

Marco Marongiu

---

**Built with GitHub Copilot** – This project was developed with AI assistance. While it works well for the tested scenarios (TCX files from Strava and Garmin Connect), your mileage may vary with other sources or configurations. The code may have quirks, edge cases might not be handled, and there could be room for improvement.

**Pull requests are welcome!**
