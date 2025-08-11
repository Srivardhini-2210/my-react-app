// scripts/fetchCourseraCourses.js
import fs from 'fs';
import fetch from 'node-fetch';

const outputPath = './public/coursera_courses.json';

async function fetchAllCourses() {
  let page = 1;
  let allCourses = [];
  const pageSize = 50; // Coursera API limit

  console.log("Fetching Coursera courses...");

  while (true) {
    const url = `https://www.coursera.org/api/courses.v1?start=${(page - 1) * pageSize}&limit=${pageSize}&fields=slug,name,description,photoUrl,partnerIds`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch page ${page}`);
    
    const data = await res.json();
    if (!data.elements || data.elements.length === 0) break;

    allCourses.push(...data.elements);
    console.log(`Fetched page ${page} (${data.elements.length} courses)`);

    page++;
  }

  fs.writeFileSync(outputPath, JSON.stringify(allCourses, null, 2));
  console.log(`✅ Saved ${allCourses.length} courses to ${outputPath}`);
}

fetchAllCourses().catch(err => {
  console.error(err);
  process.exit(1);
});
