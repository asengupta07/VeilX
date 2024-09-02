// middleware/auth.ts
import jwt, { JwtPayload } from 'jsonwebtoken';

const secretKey: string | undefined = process.env.JWT_SECRET;

if (!secretKey) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

interface VerifyTokenResult {
  message?: string;
  error?: string;
  userId?: string;
}

export const verifyToken = (token: string | null | undefined): VerifyTokenResult => {
  if (!token) {
    return { message: 'No token provided' };
  }

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    const userId = decoded.userId as string;
    return { userId };
  } catch (error) {
    return { message: 'Invalid token', error: (error as Error).message };
  }
};
