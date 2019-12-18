// Turns firebase timestamp into date object
export default function FsTsToDate(timestamp) {
	return new Date(timestamp.nanoseconds/1000000 + timestamp.seconds*1000)
}