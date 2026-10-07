export const formatEventDate = (
  date: string,
  options?: Intl.DateTimeFormatOptions
) => {
  const cleanDate = date.split("T")[0];

  const [year, month, day] =
    cleanDate
      .split("-")
      .map(Number);

  const localDate =
    new Date(
      year,
      month - 1,
      day
    );

  return localDate.toLocaleDateString(
    "es-DO",
    options ?? {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};