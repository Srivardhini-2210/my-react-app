import React from "react";
import { Button } from "./ui/Button";

export function FilterModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Filter Options</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Category</span>
            <select className="w-full border rounded p-2">
              <option>All</option>
              <option>Development</option>
              <option>Design</option>
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Apply</Button>
        </div>
      </div>
    </div>
  );
}
