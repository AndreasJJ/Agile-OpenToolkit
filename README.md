# Agile Toolkit
Open-source Agile development website that contains all the tools needed to easily follow agile development methodology such as scrum. 

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

## How to install
As this is purely frontend based w/ firebase as a backend it is fairly easy to host. It can be hosted from pretty much anywhere, but I really would suggest using firebase's static hosting option as to only use one backend provider. 

### Splash page license key
We use react [fullpage.js](https://github.com/alvarotrigo/fullPage.js) for the splash page, either remove the splash page or get a license key and edit it in **/src/pages/Splash/index.jsx**:

```const LICENSEKEY = ***```

### Firebase project creation
You will of course need a firebase project, check out the firebase documentation on how to do it (it's pretty easy) [link](https://firebase.google.com/docs/web/setup?authuser=0#create-firebase-project)

### Firebase Config Details
_All file paths are written with a base in the root of the repo_

#### src/sharedComponents/Firebase/Firebase.js
You will need to change the config object with your project config details. You can read more about it [here](https://firebase.google.com/docs/web/setup#config-object)
``` javascript
const config = {
  apiKey: '***',
  authDomain: '***',
  databaseURL: '***',
  projectId: '***',
  storageBucket: '***',
  messagingSenderId: '***',
  appId: '***'
};
```

**You will need to replace the config object with your config details**.

#### firebase.json
This is the config file is the config for Firebase functions, Firebase hosting, Firebase firestore, and Firebase emulators (for testing)

- Firebase Functions: This allows you to change what's ran predeployment for firebsae functions.
- Firebase Hosting: This allows you to specify the public directory, ignored files, and rewrites.
- Firebase Firestore: This allows you to specify (if wanted) which files contains the rules and indexes for firestore.
- Firebase Emulators: This allows you to config the emulator used under testing.

**You do generally not need to change anything here unless you want to change some functionality**.

#### .firebaserc
This is where you specify which firebase project that this project directory should point to. 

**You will need to replace the projet name with your firebase project name**.

#### firebase/firestore.rules
The firebase firestore rules. These can also be changed in the firebase web console. 

**You do generally not need to change anything here unless you want to change some functionality**.

#### firebase/firestore.indexes.json
The firebase firestore indexes. These can also be changed in the firebase web console. 

**You do generally not need to change anything here unless you want to change some functionality**.

#### firebase/functions
The firebase functions directory. This is where all code and related files for the firebase functions are located. 

**You do generally not need to change anything here unless you want to change some functionality**.

### Project Structure
The folders **/public** (used for development hosting) and **/firebase/public** (used for production) contains the same **index.html** file which is the base of the website. They are not connected, so if you edit one you will have to edit the other one to not have discrepancies. 

**firebase/public/images** However is automatically created and updated during the compilation process

### Compiling
_Be sure to be in the root of the project_.

You will first have to install the npm modules with the command:
* ```npm install``` 

Then you can run the compiling command:
* ```npm run production```

The bundle.js should now be located in **/firebase/public**

### Deployment
To deploy to firebase you will first have to download the [firebase CLI](https://firebase.google.com/docs/web/setup?authuser=0#install-cli-deploy). After you've logged in and connected your firebase project to the git repo/project folder, simply run the command: 
* ```firebase deploy```

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
