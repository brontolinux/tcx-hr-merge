# TCX Heart Rate Merger - Python Script

A command-line Python script to merge heart rate (HR) data from one TCX file into another, using timestamps as the reference.

## When to Use

This tool is useful when you have:

- A TCX file with correct GPS/distance data but missing heart rate
- Another TCX file with heart rate data but incorrect laps or distances

The script will copy the heart rate values from the first file into the second, matching data points by timestamp.

## Requirements

- Python 3.x (no additional dependencies required)

## Usage

```bash
python merge_tcx_hr.py <from_hr.tcx> <to_nohr.tcx> <output_merged.tcx>
```

### Arguments

| Argument              | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| `<from_hr.tcx>`       | The TCX file containing the heart rate data (source)           |
| `<to_nohr.tcx>`       | The TCX file to merge into (target, with correct GPS/distance) |
| `<output_merged.tcx>` | The output file with merged heart rate data                    |

### Example

```bash
python merge_tcx_hr.py activity_with_hr.tcx activity_without_hr.tcx merged_output.tcx
```

This will read HR data from `activity_with_hr.tcx`, merge it into `activity_without_hr.tcx`, and save the result to `merged_output.tcx`.

## How it Works

1. The script parses both TCX files as XML
2. It builds a map of timestamps to heart rate values from the source file
3. For each trackpoint in the target file, if a matching timestamp is found in the source, the heart rate value is copied over
4. The merged file is written with proper XML formatting

## Tested Configuration

This script was tested with:

- A TCX file downloaded from Strava (activity uploaded by Technogym treadmill via Technogym Live app)
- Heart rate data from a Garmin Forerunner watch, downloaded from Garmin Connect

Your mileage may vary with other configurations. **Pull requests are welcome!**

## License

GNU General Public License v3.0 (GPL-3.0)
