import csv
import json

csv_file = "open-meteo-33.62N73.12E583m (2).csv"
json_file = "clean_output.json"

with open(csv_file, encoding='utf-8') as f:
    lines = f.readlines()

# Skip metadata rows to find header (starts with "time")
data_start_index = next(i for i, line in enumerate(lines) if line.startswith("time"))
data_lines = lines[data_start_index:]

# Read with DictReader
reader = csv.DictReader(data_lines)

# Clean keys: rename and remove empty fields
def clean_key(key):
    return (
        key.replace(" (°C)", "_C")
           .replace(" (%)", "_percent")
           .replace(" (mm)", "_mm")
           .replace(" (hPa)", "_hPa")
           .replace(" (m)", "_m")
           .replace(" ", "_")
           .strip()
    )

weather_data = []
for row in reader:
    clean_row = {}
    for key, value in row.items():
        if key.strip() == "":
            continue  # skip empty headers
        new_key = clean_key(key)
        try:
            clean_row[new_key] = float(value)
        except ValueError:
            clean_row[new_key] = value
    weather_data.append(clean_row)

# Write clean JSON
with open(json_file, "w", encoding='utf-8') as f:
    json.dump(weather_data, f, indent=4)

print("  Clean JSON saved to:", json_file)
