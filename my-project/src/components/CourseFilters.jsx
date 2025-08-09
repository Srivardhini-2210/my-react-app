import React, { useState, useEffect } from "react";

const platformOptions = ["Coursera", "Udemy","NPTEL", "edX", "All Platforms"];
const levelOptions = ["Beginner", "Intermediate", "Advanced", "All Levels"];
const priceOptions = ["Free", "<$20", "$20-$50", "$50-$100", "$100+"];
const durationOptions = ["< 5 hours", "5-15 hours", "15-30 hours", "30+ hours"];
const ratingOptions = ["4+ stars", "3+ stars", "2+ stars"];
const formatOptions = [ "Hands-on Labs", "Quizzes & Assignments", "Certificate Available"];

const CourseFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isVisible,
  onClose,
  setPendingCount
}) => {
  const [localFilters, setLocalFilters] = useState({
    platforms: [],
    levels: [],
    priceRanges: [],
    durations: [],
    ratings: [],
    formats: [],
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Update parent's badge on every change
  useEffect(() => {
    if (setPendingCount) setPendingCount(getActiveCount());
    // eslint-disable-next-line
  }, [localFilters]);

  const handleCheckboxChange = (category, value, checked) => {
    const updated = { ...localFilters };
    if (checked) {
      updated[category] = [...updated[category], value];
    } else {
      updated[category] = updated[category].filter(item => item !== value);
    }
    setLocalFilters(updated);
  };

  const getActiveCount = () =>
    Object.values(localFilters).reduce((count, arr) => count + arr.length, 0);

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const empty = {
      platforms: [],
      levels: [],
      priceRanges: [],
      durations: [],
      ratings: [],
      formats: []
    };
    setLocalFilters(empty);
    onClearFilters();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30">
      <div className="bg-white w-full sm:w-[370px] h-full shadow-lg p-6 overflow-y-auto transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button onClick={onClose} className="text-2xl leading-none" aria-label="Close Filter">
            ×
          </button>
        </div>

        {getActiveCount() > 0 && (
          <div className="flex justify-between mb-4">
            <span className="text-sm text-gray-700">{getActiveCount()} filter{getActiveCount() !== 1 ? "s" : ""} selected</span>
            <button className="text-sm text-blue-600" onClick={clearFilters}>Clear all</button>
          </div>
        )}

        {/* All filter sections */}
        {[
          ["Platform", "platforms", platformOptions],
          ["Difficulty Level", "levels", levelOptions],
          ["Price Range", "priceRanges", priceOptions],
          ["Duration", "durations", durationOptions],
          ["Rating", "ratings", ratingOptions],
          ["Course Format", "formats", formatOptions]
        ].map(([label, key, options]) => (
          <section className="mb-5" key={key}>
            <p className="font-medium mb-2">{label}</p>
            {options.map(option => (
              <label key={option} className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters[key].includes(option)}
                  onChange={e => handleCheckboxChange(key, option, e.target.checked)}
                  className="accent-blue-600"
                />
                {option}
              </label>
            ))}
          </section>
        ))}

        <div className="flex justify-between mt-8">
          <button onClick={clearFilters} className="px-4 py-2 border rounded hover:bg-gray-100">Clear</button>
          <button onClick={applyFilters} className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700">Apply</button>
        </div>
      </div>
      {/* click-outside closes */}
      <div onClick={onClose} className="flex-1 h-full" />
    </div>
  );
};

export default CourseFilters;
