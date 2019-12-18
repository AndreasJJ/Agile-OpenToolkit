const member = require('./src/triggers/member.js');
const product = require('./src/triggers/product.js');
const sprint = require('./src/triggers/sprint.js');
const story = require('./src/triggers/story.js');
const github = require('./src/api/github.js');
const gitlab = require('./src/api/gitlab.js');
const secretKey = require('./src/api/secretKey.js');

const functions = require('firebase-functions');

// Listen for changes in all documents in the 'products/{product}/members' collection and add it to the users product list
exports.addProductToUserProductList = functions.firestore
    .document('products/{product}/members/{member}')
    .onWrite(member.addProductToUserProductList);

// Listen for updates in all documents in the 'products' collection and updates the all the users who has it in their product list
exports.updateProductInfo = functions.firestore
    .document('products/{product}')
    .onUpdate(product.updateProductInfo);

// Listen for deletes in all doucments in the 'products/{sprint}/sprints' collection and deletes the sprint from all stories who has
// their story set to it
exports.updateStoriesOnSprintDelete = functions.firestore
    .document('products/{product}/sprints/{sprint}')
    .onDelete(sprint.updateStoriesOnSprintDelete);

// Listen for changes in all doucments in the 'products/{story}/stories' collection and updates the 'totalIssues' and 'finishedIssues' fields in sprints
// who the story belongs to
exports.updateSprints = functions.firestore
	.document('products/{product}/stories/{story}')
    .onWrite(story.updateSprints);

// Listen for changes in all doucments in the 'products/{story}/stories' collection and updates the 'totalEstimate' field in sprints
// who the story belongs to
exports.updateSprintEstimate = functions.firestore
    .document('products/{product}/stories/{story}')
    .onWrite(story.updateSprintEstimate);

// Listen for changes in all doucments in the 'products/{story}/stories' collection and updates the --STATS-- document.
exports.updateStoriesStats = functions.firestore
    .document('products/{product}/stories/{story}')
    .onWrite(story.updateStoriesStats);

// API endpoint functions
exports.github_webhook_endpoint = functions.https.onRequest(github.webhook);
exports.gitlab_webhook_endpoint = functions.https.onRequest(gitlab.webhook);
exports.secret_key_reset_endpoint = functions.https.onRequest(secretKey.reset);