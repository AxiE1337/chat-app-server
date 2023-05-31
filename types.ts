export interface IMessage {
  id: string
  uid: string
  username: string
  roomId: string
  message: string
  iat: Date
}
export interface IRoom {
  id: string
  roomName: string[]
  usersId: string[]
}
