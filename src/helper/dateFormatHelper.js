const {intlFormatDistance } = require('date-fns');

export function displayTimeDistance(timestamp) {
    const timeDistance = intlFormatDistance(new Date(timestamp),new Date(),  { addSuffix: true, includeSeconds: true });
    return timeDistance;
}