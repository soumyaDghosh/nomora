export function validateDate(date: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export function validateTime(time: string): Boolean {
    return /^(0?[1-9]|1[0-2])(:[0-5][0-9])? (AM|PM)$/.test(time);
}