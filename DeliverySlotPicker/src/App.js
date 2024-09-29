import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Dynamically generates 4 weeks of dates, excluding Sundays.
 * Optionally adds extra days to fill the last group based on group size.
 *
 * @param {number} groupSize - The number of days in each group.
 * @returns {Date[]} Array of valid dates excluding Sundays.
 */
export const generateDates = (groupSize) => {
  const dates = [];
  let date = new Date();
  let validDays = 0;

  // Generate exactly 4 weeks (28 valid days, excluding Sundays)
  while (validDays < 28) {
    if (date.getDay() !== 0) { // Skip Sundays
      dates.push(new Date(date));
      validDays++;
    }
    date.setDate(date.getDate() + 1);
  }

  // Calculate how many more days are needed to fill the last group
  const remainder = dates.length % groupSize;
  if (remainder !== 0) {
    const extraDaysNeeded = groupSize - remainder;

    // Add extra days to fill the last group
    for (let i = 0; i < extraDaysNeeded; i++) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0) { // Still skip Sundays
        dates.push(new Date(date));
      } else {
        i--; // Skip Sundays but ensure the needed extra days are added
      }
    }
  }

  return dates;
};

/**
 * Groups an array of dates into chunks of the specified size.
 *
 * @param {Date[]} dates - The array of dates to be grouped.
 * @param {number} groupSize - The number of dates in each group.
 * @returns {Date[][]} A two-dimensional array of grouped dates.
 */
const groupDates = (dates, groupSize) => {
  const grouped = [];
  let i = 0;

  while (i < dates.length) {
    let group = dates.slice(i, i + groupSize);
    grouped.push(group);
    i += groupSize;
  }

  return grouped;
};

/**
 * Determines if a date-slot combination is unavailable based on the day of the week and slot.
 * It also accounts for a special item flag, which makes Wednesdays unavailable.
 *
 * @param {Date} date - The date being checked.
 * @param {string} slot - The time slot being checked ('AM', 'PM', 'EVE').
 * @param {boolean} isSpecialItem - A flag indicating if a special item is selected, making Wednesdays unavailable.
 * @returns {string|boolean} Returns 'unavailable' or 'full' if the slot is unavailable, otherwise false.
 */
const isUnavailable = (date, slot, isSpecialItem) => {
  const day = date.getDay(); // Sunday = 0, Monday = 1, etc.
  const isFriday = day === 5;
  const isWednesday = day === 3;

  // If the flag for a special item is true, mark Wednesdays as unavailable
  if (isSpecialItem && isWednesday) {
    return 'unavailable'; // Return a special flag for unavailable Wednesdays
  }

  // Condition for the first slot on every second Friday being unavailable
  const isSecondFriday = Math.ceil(date.getDate() / 7) % 2 === 0;
  if (isFriday && isSecondFriday && slot === 'AM') {
    return 'full'; // Mark Friday AM as full for the condition
  }

  return false; // Available by default
};

/**
 * A Slot component that displays time slots and handles click events for selection and availability checks.
 *
 * @param {Object} props - The component props.
 * @param {Date} props.date - The date of the slot.
 * @param {string} props.slot - The time slot (e.g., 'AM', 'PM', 'EVE').
 * @param {Function} props.onSelect - Function called when the slot is selected.
 * @param {boolean} props.isSelected - Whether the slot is currently selected.
 * @param {Function} props.isUnavailable - Function to check if the slot is unavailable.
 * @param {boolean} props.isSpecialItem - Whether special item rules apply (Wednesdays unavailable).
 * @returns {JSX.Element} The rendered Slot component.
 */
const Slot = ({ date, slot, onSelect, isSelected, isUnavailable, isSpecialItem }) => {
  const dateString = date.toISOString().split('T')[0];
  const availabilityStatus = isUnavailable(date, slot, isSpecialItem);

  // Handle unavailable and full state
  const isUnavailableSlot = availabilityStatus === 'unavailable';
  const isFullSlot = availabilityStatus === 'full';

  return (
    <div
      className={`slot ${isUnavailableSlot ? 'unavailable' : ''} ${isFullSlot ? 'full' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => (!isUnavailableSlot && !isFullSlot) && onSelect(date, slot)}
      style={{ cursor: isUnavailableSlot || isFullSlot ? 'not-allowed' : 'pointer' }}
    >
      {slot} {isFullSlot ? '(Full)' : isUnavailableSlot ? '(Unavailable)' : ''}
    </div>
  );
};

/**
 * A date and slot picker component that generates and displays selectable date slots in groups.
 *
 * @param {Object} props - The component props.
 * @param {number} props.groupSize - The number of days in each group.
 * @param {boolean} props.isSpecialItem - A flag that applies special availability rules (e.g., making Wednesdays unavailable).
 * @returns {JSX.Element} The rendered DateSlotPicker component.
 */
const DateSlotPicker = ({ groupSize, isSpecialItem }) => {
  const [dates, setDates] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState({});

  useEffect(() => {
    setDates(generateDates(groupSize)); // Generate dates dynamically based on group size
  }, [groupSize]); // Regenerate dates whenever group size changes

  const groupedDates = groupDates(dates, groupSize);

  const handleSelect = (date, slot) => {
    const key = `${date.toDateString()}-${slot}`;
    setSelectedSlots((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="date-slot-picker-container">
      <div className="date-slot-picker">
        {groupedDates.map((group, groupIndex) => (
          <div key={groupIndex} className="date-group">
            {group.map((date) => (
              <div key={date.toDateString()} className="date-block">
                <h3>{date.toDateString()}</h3>
                <div className="slots">
                  {['AM', 'PM', 'EVE'].map((slot) => (
                    <Slot
                      key={slot}
                      date={date}
                      slot={slot}
                      onSelect={handleSelect}
                      isSelected={selectedSlots[`${date.toDateString()}-${slot}`]}
                      isUnavailable={isUnavailable}
                      isSpecialItem={isSpecialItem}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Main App component for selecting delivery slots with configurable group size and special item flag.
 *
 * @returns {JSX.Element} The rendered App component.
 */
const App = () => {
  const [groupSize, setGroupSize] = useState(3); // Default to 3-day groups
  const [isSpecialItem, setIsSpecialItem] = useState(true); // Flag for special item

  return (
    <div className="App">
      <h1>Delivery Slot Picker</h1>
      <label>
        Select Group Size:
        <select value={groupSize} onChange={(e) => setGroupSize(Number(e.target.value))}>
          <option value={3}>3 Days</option>
          <option value={4}>4 Days</option>
          <option value={5}>5 Days</option>
          <option value={6}>6 Days</option>
          <option value={7}>7 Days</option>
        </select>
      </label>
      <label>
        Special Item (Wednesdays Unavailable):
        <input
          type="checkbox"
          checked={isSpecialItem}
          onChange={() => setIsSpecialItem((prev) => !prev)}
        />
      </label>
      <DateSlotPicker groupSize={groupSize} isSpecialItem={isSpecialItem} />
    </div>
  );
};

export default App;
