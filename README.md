# Delivery Slot Picker

This is a Delivery Slot Picker application that allows users to select available delivery slots.

## Table of Contents

- [Structure of Website](#structure-of-website)
- [Technologies Used](#technologies-used)
- [Improvements](#improvements)
- [Assumptions](#assumptions)
- [Commands](#commands)

## Structure of Website

```
DeliverySlotPicker/
├── node_modules/       # All the dependencies installed via npm (generated using npm install)
├── public/             # Public folder containing static assets
│   └── index.html      # Main HTML file
├── src/                # Source code for the app
│   ├── __tests__/      # Test cases for the components
│   │   └── App.test.js # Unit tests for App component
│   ├── App.css         # Styling for the App component
│   ├── App.js          # Main React component
│   ├── index.css       # Global styles
│   └── index.js        # Entry point of the application
├── package-lock.json   # Detailed tree of dependencies
├── package.json        # Project configurations and dependencies
```

## Technologies Used

- **React** (v18.x) – Frontend library to build UI components
- **JavaScript** (ES6) – JavaScript standard used for logic and behavior

## Improvements

- **Backend Integration:**
  - Currently, the application doesn’t have a backend. Integration with a backend such as Node.js or Express would allow storing and retrieving available delivery slots from a database.
  
- **Abstract Hardcoded Values:**
  - Some values in the application are hardcoded and could be moved to a config file for better maintainability and scalability.
  
  Example hardcoded values:
  - Available delivery slots (e.g., `Monday`, `Tuesday`, `Wednesday`, etc.)
  - Default selection (e.g., `Wednesday` is selected by default)
  
  Moving these to a config file will make it easier to change and manage.

- **Checkbox Bug:**
  - There's an issue where the `Wednesday` delivery slot is still selected even after checking the checkbox. Fixing this issue requires updating the component's state logic and the checkbox handler.

- **Special Days Styling**
  - Improve the styling to make special days such as Wednesday visually stand out.

## Assumptions

- The website is only handling the frontend logic of the delivery slot picker. No backend or database is assumed at this stage.

## Commands

### Command to Setup Project

```bash
npm install
```

### Command to Start Project

```bash
npm start
```

### Command to Run Tests

```bash
npm test
```
