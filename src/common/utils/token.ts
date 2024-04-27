import jwt from 'jsonwebtoken';
import nodeCache from 'node-cache';

const cache = new nodeCache();
type Payload = {
  userId: string;
  userRole: string;
};

export class Token {
  constructor() {}

  static getOrIssueToken(payload: Payload) {
    let token = cache.get(payload.userId);
    if (token) {
      return token;
    }

    token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: 86400 });
    cache.set(payload.userId, token, 86400);
    return token;
  }

  static verifyToken(token: string) {
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as Payload;
    } catch (e) {
      console.log(e);
    }

    return payload;
  }

  static invalidateToken(userId: string) {
    if (userId) cache.del(userId);
  }
}
