# Cypress Testing for Salary Insights

## Overview
This project contains Cypress tests for verifying salary insights on the Deel training website. It checks for correct salary insights display for various roles and countries, ensures SVG images are displayed, and validates API calls.

## Prerequisites
Node.js (>=14.x)

npm (>=6.x)

## Clone the repository
      git clone https://github.com/epeles/deel_home_assignment.git

      cd salary-insights-tests

## Install dependencies
      npm install

## Running Tests
Open Cypress Test Runner:

      npx cypress open

Run tests in headless mode:
  
      npx cypress run

## Test Description
The test suite iterates through multiple roles and countries, performing the following checks:

1. Selects the role and country from dropdowns.
2. Submits the form.
3. Verifies that the correct country and role are displayed.
4. Ensures the corresponding flag image is visible.
5. Intercepts and validates the Amplitude API call, checking the response status and payload.

## Directory Structure
     salary-insights-tests/
     ├── cypress/
     │   ├── fixtures/
     │   │   └── roleAndCountry.json
     │   ├── integration/
     │   │   └── salaryInsights.spec.js
     │   ├── plugins/
     │   └── support/
     ├── package.json
     └── README.md

## License
This project is licensed under the MIT License.
