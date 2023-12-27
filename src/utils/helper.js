import moment from 'moment';


// CURRENCY CONVERTER / HELPER FORMATTER
export function currencyConverter (amount) {
    return Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function numberConverter (amount) {
    return Number(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function calcTotalAmount (amount) {
    let charges;
	const calcChargesAmount = (3 / 100) * amount;
	if (calcChargesAmount > 3000) {
		charges = 3000;
	} else {
		charges = calcChargesAmount;
	}
	console.log(charges, amount + charges);
	return amount + charges;
};

// DATE CONVERTER HELPER FUNCTION
export function dateConverter(givenDate) {
    const currentDate = moment().startOf('day');
    const inputDate = moment(givenDate);

    if (inputDate.isSame(currentDate, 'day')) {
        const diffInMins = moment().diff(inputDate, 'minutes');
        if (diffInMins < 60) {
            return `${diffInMins} minute ago`;
        } else {
            return `Today, ${inputDate.format('h:mm A')}`;
        }
    } else if (inputDate.isSame(currentDate.clone().subtract(1, 'day'), 'day')) {
        return `Yesterday, ${inputDate.format('h:mm A')}`;
    } else if (inputDate.isSame(currentDate.clone().subtract(2, 'day'), 'day')) {
        return `Two days ago`;
    } else if (inputDate.isAfter(currentDate)) {
        const diffInDays = inputDate.diff(currentDate, 'days');
        if (diffInDays === 1) {
            return `Tomorrow`;
        } else {
            return `In ${diffInDays} days`;
        }
    } else {
        return inputDate.format('MMM Do YYYY');
    }
}