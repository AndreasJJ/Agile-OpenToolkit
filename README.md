# Agile Toolkit
Frontend system for Agile Toolkit

## Tech used

### Frontend
The front end is a ReactJs (hooks) && Redux stack with styled-components for css. 

Babel and webpack is used for compiling and development builds/hosting.

### Backend
The backend is a full firebase stack w/ firestore. It should however be possible to change it to another service rather easily.

## Linting and Testing
Both linting and testing will run precommit and prepush (with husky) to make sure the code is of satisfactory quality.

### Pre-commit and Pre-push
* Linting will run pre-commit
* Linting and testing will run pre-push

### Linting
Eslint - AirBnB.

### Testing
The underlying test engine is Jest for all testing.
Testing RectJs and Redux:
* React Testing Library

Testing Firebase:
* Firebase's proprietary test SDK 

## Features
* Login/Registration system
* Account details widget
* Products creation
* Backlog
* Labels
* Sprints overview
  * Sprint overview
  * Sprintboard
* Settings
  * Github webhook
  * Gitlab webhook

## Future Features
* Retrospective board
* Planning poker
* Product overview page
* News widget
* Account Settings widget
* Advanced product settings
  * Roles
  * Other 3rd-party integrations
* Organizational account registration
* Teams (possibility to have multiple teams for a product with their own backlog and sprintboard)
* Payment/subscription integration (Make it possible to add paid subscription tiers which decides how many products a user might have, teams a product might have, etc.)

## Contribute
When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change. 

Please note we have a code of conduct, and follow it in all your interactions with the project.

## Pull Request Process
1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent.
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Code of Conduct
This project and everyone participating in it is governed by the Code of Conduct expected to uphold this code.

## License
This project is licensed under the [GNU Affero General Public License v3.0](https://github.com/AndreasJJ/Agile-Open-Toolkit/blob/master/LICENSE).
