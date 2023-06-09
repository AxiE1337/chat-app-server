import { Server, Socket } from 'socket.io'
import { IMessage, IRoom } from '../types'
import findRooms from './utils/findRooms'

const rooms: IRoom[] = [
  {
    usersId: [
      'e8bf7f21-20dc-4318-bd8b-973649c81fb4',
      'd0c64d88-b683-4783-b55a-3c9a4865e6a1',
    ],
    id: '123123',
    roomName: ['john123', 'alex123'],
  },
]
let messages: IMessage[] = []

const socketOn = async (socket: Socket, io: Server) => {
  socket.on('join_room', (roomId: string) => {
    socket.join(roomId)
    const room = rooms.find((r) => r.id === roomId)
    socket.emit('joined_room', {
      roomId: room?.id,
      roomName: room?.roomName,
    })
  })
  socket.on(
    'create_room',
    ({ room, userId }: { room: IRoom; userId: string }) => {
      rooms.push(room)
      const userRooms = findRooms(userId, rooms)

      socket.emit('receive_rooms', userRooms)
      socket
        .to(room.usersId.filter((r) => r !== userId))
        .emit('receive_rooms', userRooms)
      socket.join(room.id)
    }
  )
  socket.on('get_rooms', (userId: string) => {
    const userRooms = findRooms(userId, rooms)
    socket.join(userId)
    socket.emit('receive_rooms', userRooms)
  })
  socket.on('send_message', (message: IMessage) => {
    io.to(message.roomId).emit('receive_message', message)
    messages.push(message)
  })
  socket.on('get_messages', (roomId) => {
    const userMessages = messages.filter((m) => m.roomId === roomId)
    socket.emit('receive_messages', userMessages)
  })
  socket.on('delete_message', (message: IMessage, userId: string) => {
    if (message.uid !== userId) return
    messages = messages.filter((m) => m.id !== message.id)

    const userMessages = messages.filter((m) => m.roomId === message.roomId)
    io.to(message.roomId).emit('receive_messages', userMessages)
  })
}

export default socketOn
