# TCX Heart Rate Merger

This project provides a Python script to merge heart rate (HR) data from one TCX file into another, using timestamps as the reference. This is useful when you have a TCX file with correct GPS/distance data but missing HR, and another TCX file with HR data but incorrect laps or distances.

This script was tested with a TCX file downloaded from Strava, where the activity was uploaded to Strava by a Technogym treadmill and the Technogym Live app, and the HR information from a Garmin Forerunner watch, downloaded from Garmin Connect. I didn't have a chance to test it on any other setting, so YMMV. **Pull requests are gladly welcome**.

A web-based version of this tool is also available in the [web-service](web-service/) directory. It can be deployed to AWS S3, or simply opened directly in your browser from a local file (`web-service/frontend/index.html`) - all processing happens client-side, so no server is needed.

## Motivation

I did an activity on a Technogym Treadmill, with my Garmin watch sending heart rate data to the Technogym Live app. When the activity was finished and uploaded by Live to Strava, the heart rate information was missing, for some reason (it was still visible on Live, but didn't end up in Technogym and, hence, not in Strava either). I still had the heart rate information in the watch, but with incorrect distance point or lap information.

I asked CoPilot to merge the two TCX files from Strava and Connect, it ended up writing a python script to do the trick. So here it is.

## Command Line Usage

### Features

- Merges HR data from a "source" TCX file into a "target" TCX file by matching timestamps.
- Produces a new TCX file with the merged HR data, preserving the structure and formatting of the target file.
- Handles large TCX files efficiently.

### Requirements

- Python 3.x

### How to Run

- download the two TCX files (e.g. from Strava and Garmin Connect)
- run the script:

```
python merge_tcx_hr.py <from_hr.tcx> <to_nohr.tcx> <output_merged.tcx>
```

- `<from_hr.tcx>`: The TCX file containing the heart rate data (source).
- `<to_nohr.tcx>`: The TCX file to merge into (target, usually with correct GPS/distance/laps).
- `<output_merged.tcx>`: The output file with merged HR data.

### Example

```
python merge_tcx_hr.py activity_with_hr.tcx activity_without_hr.tcx merged_output.tcx
```

## How it Works

- The script matches each Trackpoint in the target file to the source file by timestamp.
- If a matching timestamp is found and HR data is present, it inserts or updates the `<HeartRateBpm>` value in the target file.
- The output TCX file is normalized to avoid unnecessary XML namespace prefixes.

## License

GNU General Public License v3.0 (GPL-3.0)

## Author

Marco Marongiu
