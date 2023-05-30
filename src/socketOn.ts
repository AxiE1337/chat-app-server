import { Server, Socket } from 'socket.io'
import { IMessage, IRoom } from '../types'
import { rooms } from '.'
import findRooms from './utils/findRooms'

const socketOn = async (socket: Socket, io: Server) => {
  socket.on('join_room', (roomId: string) => {
    socket.join(roomId)
    const room = rooms.find((r) => r.id === roomId)
    socket.emit('joined_room', {
      messages: room?.messages,
      roomId: room?.id,
      roomName: room?.roomName,
    })
  })
  socket.on(
    'create_room',
    ({ room, userId }: { room: IRoom; userId: string }) => {
      rooms.push(room)
      const userRooms = findRooms(userId)
      socket.emit('receive_rooms', userRooms)
      socket.join(room.id)
    }
  )
  socket.on('get_rooms', (userId: string) => {
    const userRooms = findRooms(userId)
    socket.emit('receive_rooms', userRooms)
  })
  socket.on('send_message', (message: IMessage) => {
    io.to(message.roomId).emit('receive_message', message)
    const roomIndex = rooms.findIndex((r) => r.id === message.roomId)
    if (roomIndex === -1) return
    rooms[roomIndex].messages.push(message)
  })
}

export default socketOn
