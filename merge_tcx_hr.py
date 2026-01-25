import xml.etree.ElementTree as ET
import re
import sys

# Usage: python merge_tcx_hr.py from_hr.tcx to_nohr.tcx output_merged.tcx
if len(sys.argv) != 4:
    print("Usage: python merge_tcx_hr.py <from_hr.tcx> <to_nohr.tcx> <output_merged.tcx>")
    sys.exit(1)

hr_tcx = sys.argv[1]  # file with HR data (from)
main_tcx = sys.argv[2]  # file to merge into (to)
output_tcx = sys.argv[3]

# Parse both files
main_tree = ET.parse(main_tcx)
main_root = main_tree.getroot()
hr_tree = ET.parse(hr_tcx)
hr_root = hr_tree.getroot()

# TCX namespace
ns_url = "http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2"
ns = {"tcx": ns_url}

# Build a timestamp->HR map from the HR file
hr_map = {}
for tp in hr_root.findall(".//tcx:Trackpoint", ns):
    time = tp.find("tcx:Time", ns)
    hr = tp.find("tcx:HeartRateBpm/tcx:Value", ns)
    if time is not None and hr is not None:
        hr_map[time.text] = hr.text

# Merge HR into main file
count = 0
for tp in main_root.findall(".//tcx:Trackpoint", ns):
    time = tp.find("tcx:Time", ns)
    if time is not None and time.text in hr_map:
        # Find or create HeartRateBpm element (with namespace)
        hrbpm = tp.find("tcx:HeartRateBpm", ns)
        if hrbpm is None:
            hrbpm = ET.Element(f"{{{ns_url}}}HeartRateBpm")
            value = ET.Element(f"{{{ns_url}}}Value")
            hrbpm.append(value)
            tp.append(hrbpm)
        else:
            value = hrbpm.find(f"{{{ns_url}}}Value")
            if value is None:
                value = ET.Element(f"{{{ns_url}}}Value")
                hrbpm.append(value)
        value.text = hr_map[time.text]
        count += 1

# Register default namespace to avoid prefixes
ET.register_namespace("", ns_url)

# Write merged file
main_tree.write(output_tcx, encoding="utf-8", xml_declaration=True)

# Post-process: remove any explicit namespace prefixes from tags (except root)
with open(output_tcx, "r", encoding="utf-8") as f:
    xml_data = f.read()
# Remove tags like <ns0:HeartRateBpm> and </ns0:HeartRateBpm>
xml_data = re.sub(r"<(/?)(ns\d+:)", r"<\1", xml_data)
# Remove xmlns:ns0=... declarations
xml_data = re.sub(r'xmlns:ns\d+="[^"]*"', "", xml_data)
# Clean up extra spaces
xml_data = re.sub(r"\s+>", ">", xml_data)
with open(output_tcx, "w", encoding="utf-8") as f:
    f.write(xml_data)

print(f"Merged heart rate into {count} trackpoints. Output: {output_tcx}")
