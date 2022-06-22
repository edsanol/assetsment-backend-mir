import jwt from 'jsonwebtoken'

export const JWTgenerator = async (id: string): Promise<any> => {
  return await new Promise((resolve, reject) => {
    const payload = { id }

    jwt.sign(
      payload,
      process.env.JWT_KEY as string,
      {
        expiresIn: 60 * 60 * 24 * 365
      },
      (err: Error | null, token) => {
        if (err) {
          console.log(err)
          reject(new Error('Failed to generate JWT'))
        } else {
          resolve(token)
        }
      }
    )
  })
}
