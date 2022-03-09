const date = new Date();

let month: string | number = date.getMonth() + 1;
month = month > 9 ? month : `0${month}`;

let day: string | number = date.getDate();
day = day > 9 ? day : `0${day}`;

export const dateNow = `${date.getFullYear()}-${month}-${day}`;
