import { useState } from "react";
import Autocomplete from "./Autocomplete";

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Canada",
  "China",
  "Denmark",
  "Egypt",
  "Finland",
  "France",
  "Germany",
  "India",
  "Italy",
  "Japan",
  "Mexico",
  "Netherlands",
  "Norway",
  "Poland",
  "Russia",
  "Spain",
  "Sweden",
  "Thailand",
  "United Kingdom",
  "United States",
  "Vietnam",
];

export default function AutocompleteDemo() {
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleSelect = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <h2>Autocomplete</h2>
      <Autocomplete
        options={countries}
        onSelect={handleSelect}
        placeholder="Search countries..."
        maxSuggestions={5}
      />
      {selectedCountry && <p>Selected: {selectedCountry}</p>}
    </div>
  );
}
