import json
import pandas as pd
import requests
from bs4 import BeautifulSoup

url = "https://nptel.ac.in/courses"  # Update to correct course list page
response = requests.get(url)
soup = BeautifulSoup(response.content, "html.parser")

courses = soup.find_all("div", class_="courseCard")  # Adjust selector as needed
course_list = []

for course in courses:
    title_tag = course.find("h5")
    link_tag = course.find("a", href=True)

    if title_tag and link_tag:
        title = title_tag.text.strip()
        link = "https://nptel.ac.in" + link_tag['href']
        course_list.append({"title": title, "link": link})

# Save to JSON
with open("nptel_courses.json", "w") as f:
    json.dump(course_list, f, indent=2)

print("✅ Scraping completed. Saved to nptel_courses.json")
