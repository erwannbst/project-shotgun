export const generateRoomId = () => {
  return Math.random().toString(36).slice(2, 7).toLocaleUpperCase()
}
