import dateFormat from 'dateformat'

export const validTimestamp = (actualTimestamp, startDate, endDate) => {
  if (startDate && startDate !== 'undefined') {
    startDate = startDate.concat('-01 00:00:00')
    if (startDate > actualTimestamp) return false
  }
  if (endDate && endDate !== 'undefined') {
    endDate = endDate.concat('-31 23:59:59')
    if (actualTimestamp > endDate) return false
  }
  return true
}

export const validDate = (actualDate, startDate, endDate) => {
  if (startDate && startDate !== 'undefined') {
    if (startDate > actualDate) return false
  }
  if (endDate && endDate !== 'undefined') {
    if (actualDate > endDate) return false
  }
  return true
}

const addMonth = currentDate => {
  const date = new Date(currentDate.valueOf())
  date.setMonth(date.getMonth() + 1)
  return date
}

export const getDatesBetween = (startDate, endDate) => {
  const dates = []
  const date1 = new Date(`${startDate}-02`)
  const date2 = new Date(`${endDate}-28`)
  let currentDate = date1

  while (currentDate <= date2) {
    const date = dateFormat(currentDate, 'yyyy-mm')
    dates.push(date)
    currentDate = addMonth(currentDate)
  }
  return dates
}

export const getDatesBetween2 = (startDate, endDate) => {
  const day = 1000 * 60 * 60 * 24
  const date1 = new Date(`${startDate}-02`)
  const date2 = new Date(`${endDate}-28`)

  const dates = new Set()
  const diff = (date2.getTime() - date1.getTime()) / day
  for (let i = 0; i <= diff; i++) {
    const xx = date1.getTime() + day * i
    const yy = new Date(xx)
    const date = dateFormat(yy, 'yyyy-mm')

    dates.add(date)
  }
  return dates
}

export const getActualDate = () => {
  const now = new Date()
  return dateFormat(now, 'yyyy-mm')
}
