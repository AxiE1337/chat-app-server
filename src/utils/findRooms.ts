import { IRoom } from '../../types'
import { rooms } from '..'

const findRooms = (uid: string): IUserRoom[] => {
  const userRooms: IUserRoom[] = []
  for (let room of rooms) {
    for (let userId of room.usersId) {
      if (userId === uid) {
        userRooms.push({
          usersId: room.usersId,
          id: room.id,
          roomName: room.roomName,
        })
      }
    }
  }
  return userRooms
}
export default findRooms

interface IUserRoom extends Omit<IRoom, 'messages'> {}
