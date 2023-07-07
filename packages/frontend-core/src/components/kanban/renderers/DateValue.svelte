<script>
  import dayjs from "dayjs"

  export let value
  export let schema

  // Adding the 0- will turn a string like 00:00:00 into a valid ISO
  // date, but will make actual ISO dates invalid
  $: isTimeValue = !isNaN(new Date(`0-${value}`))
  $: timeOnly = isTimeValue || schema?.timeOnly
  $: dateOnly = schema?.dateOnly
  $: format = timeOnly
    ? "HH:mm:ss"
    : dateOnly
    ? "MMM D YYYY"
    : "MMM D YYYY, HH:mm"
  $: displayValue = getDisplayValue(value, format, timeOnly, isTimeValue)

  const getDisplayValue = (value, format, timeOnly, isTimeValue) => {
    if (!value) {
      return ""
    }
    // Parse full date strings
    if (!timeOnly || !isTimeValue) {
      return dayjs(value).format(format)
    }
    // Otherwise must be a time string
    return dayjs(`0-${value}`).format(format)
  }
</script>

<div>{displayValue || " "}</div>
