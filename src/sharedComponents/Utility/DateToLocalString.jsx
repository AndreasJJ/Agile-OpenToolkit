// Turns a date object into a string on the form that input elements wants it. Also uses correct timezone
export default function DateToLocalString(date) {
	return date.toLocaleString("en-GB", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: "numeric", month: "2-digit", day: "2-digit"}).split("/").reverse().join("-")
}