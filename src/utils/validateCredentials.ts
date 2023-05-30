const validateCredentials = (username: string, password: string) => {
  if (!username || !password) {
    return 'Username, password, and name fields cannot be empty!'
  }

  return true
}

export default validateCredentials
