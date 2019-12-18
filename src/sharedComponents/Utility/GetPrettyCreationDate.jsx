// Takes in a date object and returns a readable string how how long ago the date was compared to now
export default function getPrettyCreationDate(date) {
	let deltaTime = ((new Date()).getTime() - date.getTime())
	// less than 1 second
	if(deltaTime < 1000) {
	  return "less than 1 second"
	// less than 1 minute ago
	} else if(deltaTime < 60000) {
	  return Math.floor(deltaTime/1000) + " seconds ago"
	// less than 1 hour ago
	} else if(deltaTime < 3600000) {
	  return Math.floor(deltaTime/60000) + " minutes ago"
	// less than 1 day
	} else if(deltaTime < 86400000) {
	  return Math.floor(deltaTime/3600000) + " hours ago"
	// less than 1 week ago
	} else if(deltaTime < 604800000) {
	  return Math.floor(deltaTime/86400000) + " days ago"
	// less than 1 month ago
	} else if(deltaTime < 2628000000) {
	  return Math.floor(deltaTime/604800000) + " weeks ago"
	// less than 1 year ago
	} else if(deltaTime < 31540000000) {
	  return Math.floor(deltaTime/2628000000) + " months ago"
	// more than a year ago
	} else {
	  return Math.floor(deltaTime/31540000000) + " years ago"
	}
}