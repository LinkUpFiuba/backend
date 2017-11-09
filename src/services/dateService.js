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

export const getActualDate = () => {
  const now = new Date()
  return dateFormat(now, 'yyyy-mm')
}
