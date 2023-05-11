let fullDate = new Date(); // Won't stay the same when changed to prev/next month.

const todaysFullDate = new Date(); // Will stay the same.
const todaysDay = todaysFullDate.toLocaleString("en-us", {weekday: "long"}); // ex. Sunday, Monday, etc.

// HTML.
const currentDayContainer = document.querySelector(".current-day_");
const currentMYContainer = document.querySelector(".current-m-y_");
const allDatesContainer = document.querySelector("._days");

const previousButton = document.querySelector(".previous_");
const nextButton = document.querySelector(".next_");

function generateCalendar() {
	let date = fullDate.getDate();
	let month = fullDate.getMonth();
	let year = fullDate.getFullYear();

	let lastDateOfTheMonth = new Date(year, month + 1, 0).getDate(); // Putting 0 as the date will get you the last date in the previous month.
	let lastDayOfTheMonth = new Date(year, month, lastDateOfTheMonth).getDay(); // ex. Sunday = 0, Monday = 1, etc.

	let daysFromPrevMonthNeeded = new Date(year, month, 1).getDay(); // Get the day index of the first date in the current month.
	let daysFromNextMonthNeeded = 7 - lastDayOfTheMonth - 1;

	currentDayContainer.innerText = `${fullDate.toString() == todaysFullDate.toString() ? todaysDay : ""}`; // Only show days name when it is the current month you're in.
	currentMYContainer.innerText = fullDate.toLocaleString("en-us", {month: "long", year: "numeric"}); // ex. January 2023.
	currentMYContainer.setAttribute("datetime", `${year}-${month + 1}`);

	allDatesContainer.innerHTML = "";

	// Generate dates in the previous month.
	for (let p = daysFromPrevMonthNeeded; p > 0; p--) {
		const dateElement = createDate(new Date(year, month, 0).getDate() - p + 1, false);
		dateElement.setAttribute("datetime", `${month == 0 ? year - 1 : year}-${month == 0 ? 12 : month}-${dateElement.innerText}`);

		allDatesContainer.append(dateElement);
	};

	// Generate dates in the current month.
	for (let c = 1; c <= lastDateOfTheMonth; c++) {
		const dateElement = createDate(c);
		dateElement.setAttribute("datetime", `${year}-${month + 1}-${c}`);

		if (fullDate.toString() == todaysFullDate.toString() && c == date) {dateElement.dataset.currentDay = "true";}

		allDatesContainer.append(dateElement);
	};

	// Generate dates in the next month.
	for (let n = 1; n <= daysFromNextMonthNeeded; n++) {
		const dateElement = createDate(n, false, true);
		dateElement.setAttribute("datetime", `${month == 11 ? year + 1 : year}-${month == 11 ? 1 : month + 2}-${dateElement.innerText}`);

		allDatesContainer.append(dateElement);
	};

	function createDate(passedDate, currentMonth = true, nextMonth = false) {
		const timeElement = document.createElement("time");
		timeElement.innerText = passedDate;

		if (!currentMonth) timeElement.dataset.inOtherMonth = "true";
		if (nextMonth) return timeElement; // No need to check for sunday for date in the next month.
		if (isSunday(passedDate, currentMonth)) timeElement.dataset.day = "sunday";

		return timeElement;
	};

	function isSunday(passedDate, currentMonth) {
		return new Date(year, currentMonth ? month : month - 1, passedDate).getDay() == 0; // 0 == Sunday.
	};

	function checkForSixthRow() { // Not counting the row for the 7 days of the week.
		const calendarRow = getComputedStyle(allDatesContainer).getPropertyValue("grid-template-rows").split(" ").length;

		if (calendarRow > 5) {
			let allDates = allDatesContainer.querySelectorAll("time");
			let fifthRow = [];
			let sixthRow = [];
			let sixthRowNeededDates = [];

			let fourthRowLastDate = allDates[27];

			for (let i = 28; i <= 34; i++) fifthRow.push(allDates[i]);
			for (let i = 35; i < 42; i++) sixthRow.push(allDates[i]);

			sixthRow.forEach((date, index) => {
				if (date.innerText >= 30) sixthRowNeededDates.push(date);
				date.remove();
			});

			sixthRowNeededDates.reverse().forEach((date, index) => {
				const slash = document.createElement("span");
				slash.innerText = "/";
				slash.classList.add("slash_");

				const doubleDatesContainer = document.createElement("span");
				doubleDatesContainer.dataset.doubleDates = "true";

				// Swapping the swappy swap because the index is not correct (something like that).
				if (sixthRowNeededDates.length > 1) doubleDatesContainer.append(fifthRow[index == 1 ? 0 : 1]);
				if (sixthRowNeededDates.length == 1) doubleDatesContainer.append(fifthRow[index]);
				doubleDatesContainer.append(slash);
				doubleDatesContainer.append(date);

				fourthRowLastDate.parentNode.insertBefore(doubleDatesContainer, fourthRowLastDate.nextSibling);
			});
		};
	};

	checkForSixthRow();
};

previousButton.addEventListener("click", () => {
	fullDate.setMonth(fullDate.getMonth() - 1);
	generateCalendar();
});

nextButton.addEventListener("click", () => {
	fullDate.setMonth(fullDate.getMonth() + 1);
	generateCalendar();
});

document.addEventListener("DOMContentLoaded", () => generateCalendar());