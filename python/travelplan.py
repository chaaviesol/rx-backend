import json
import sys
import calendar
# from datetime import datetime
from datetime import datetime, timedelta
# import pprint

# Load the schedule data file from the first argument
schedule_data_file = sys.argv[1]

with open(schedule_data_file, 'r') as file:
    data = json.load(file)

schedule_data = data['scheduleData']
month_year = data['month']

# Extract month and year from the "02-2024" format
month, year = map(int, month_year.split('-'))

# Determine the number of days in the specified month and year
_, total_days = calendar.monthrange(year, month)

doctors_per_visit = {
    'supercore': 6,  # 6 visits
    'core': 4,       # 4 visits
    'important': 2   # 2 visits
}

# Minimum day gaps between visits for each category
min_gap = {
    'supercore': 4,  # 4 days gap
    'core': 6,       # 6 days gap
    'important': 10  # 10 days gap
}

# Group doctors by their category (visit_type)
partitions = {
    'supercore': [],
    'core': [],
    'important': []
}

# Define a map to correct day names
day_corrections = {
    "monday": "Monday",
    "tuesday": "Tuesday",
    "wednesday": "Wednesday",
    "thursday": "Thursday",
    "friday": "Friday",
    "saturday": "Saturday",
    "sunday": "Sunday",
    "wenesday": "Wednesday"  # Correcting common misspelling
}

for dr in schedule_data:
    # Validate findAddress
    if not dr.get('findAddress'):
        raise ValueError(f"No address found for doctor {dr['findDr']['firstName']}")
    
    # Ensure findAddress is not empty
    if not dr['findAddress']:
        raise ValueError(f"Address list is empty for doctor {dr['findDr']['firstName']}")

    # Extract schedules
    schedules = []
    for item in dr.get('findSchedule', []):
        schedule_info = item.get('schedule')
        
        # Handle cases where schedule is a list instead of a dictionary
        if isinstance(schedule_info, list):
            for sub_item in schedule_info:
                day = sub_item.get('day')
                if day:
                    corrected_day = day_corrections.get(day.lower(), day.capitalize())
                    schedules.append(corrected_day)
        else:
            if schedule_info and 'day' in schedule_info:
                day = schedule_info.get('day')
                if day:
                    corrected_day = day_corrections.get(day.lower(), day.capitalize())
                    schedules.append(corrected_day)
    
    # Validate schedules
    if not schedules:
        # print(f"No valid schedules found for doctor {dr['findDr']['firstName']}. Skipping.")
        continue  # Skip this doctor if no valid schedules are found
    
    # Ensure findAddress is a non-empty list before accessing it
    doctor_info = {
        # "name": dr['findDr']['firstName'],
        "name": f"{dr['findDr']['firstName']} {dr['findDr']['lastName']}",
        "category": dr['findDr']['visit_type'].lower(),
        "address": dr['findAddress'][0]['address'],
        "schedule": schedules
    }
    
    visit_type = doctor_info['category']
    if visit_type not in partitions:
        print(f"Unknown visit type '{visit_type}' for doctor {doctor_info['name']}. Skipping.")
        continue  # Skip if visit_type is unrecognized
    
    partitions[visit_type].append(doctor_info)

# Allocate visits over the number of days in the specified month
visit_plan = {}

# Function to allocate visits with a required day gap
def allocate_visits_with_gap(category, num_visits, gap):
    doctors = partitions[category]
    last_visit_day = {}  # Store the last visit day for each doctor
    
    for doctor in doctors:
        available_days = doctor['schedule']  # List of available days for this doctor
        scheduled_visits = 0
        current_day = 1
        
        while scheduled_visits < num_visits and current_day <= total_days:
            date = datetime(year, month, current_day)
            day_of_week = date.strftime('%A')
            
            if day_of_week in available_days:
                # Check gap constraint
                last_day = last_visit_day.get(doctor['name'])
                if last_day is None or (date - last_day).days >= gap:
                    date_str = date.strftime('%d-%m-%Y')
                    if date_str not in visit_plan:
                        visit_plan[date_str] = []
                    
                    visit_plan[date_str].append({
                        "doctor": doctor['name'],
                        "category": category,
                        "day": day_of_week,
                        "address": doctor['address']
                    })
                    
                    last_visit_day[doctor['name']] = date
                    scheduled_visits += 1
                    # Move current_day forward by at least gap days
                    current_day += gap
                else:
                    current_day += 1
            else:
                current_day += 1

# Allocate visits based on category and required gaps
allocate_visits_with_gap('supercore', doctors_per_visit['supercore'], min_gap['supercore'])
allocate_visits_with_gap('core', doctors_per_visit['core'], min_gap['core'])
allocate_visits_with_gap('important', doctors_per_visit['important'], min_gap['important'])

# Sort the visit plan by date keys and print as JSON
sorted_visit_plan = dict(sorted(visit_plan.items(), key=lambda x: datetime.strptime(x[0], '%d-%m-%Y')))

# Construct the final response structure
response = {
    "error": False,
    "success": True,
    "message": "Successfully run travel plan.",
    "data": sorted_visit_plan
}

# Return the visit plan as a JSON string
print(json.dumps(response))











