# Agile Toolkit
Frontend system for Agile Toolkit

## Tech used

### Frontend
 * React
 * Redux
 * react-fullpage
 * react-nprogress
 * chart.js
 * Styled-components
 * ...

### Backend
 * Firebase
   * Authentication
   * Firestore
   * Cloud functions

## Linting and Testing
Both linting and testing will run precommit and prepush (with husky) to make sure the code is of satisfactory quality.

## Pre-commit and Pre-push
* Linting will run pre-commit
* Linting and testing will run pre-push

### Linting
We use eslint AirBnB.

### Testing
The underlying test engine is Jest for all testing.
Testing RectJs and Redux:
* React Testing Library

Testing Firebase:
* Firebase's proprietary test SDK 
