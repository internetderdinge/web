const capitalizeFirstLetter = (name: string): string =>
  name[0].toUpperCase().concat(name.slice(1).toLowerCase());

export default capitalizeFirstLetter;
