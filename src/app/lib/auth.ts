import { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

export interface DecodedToken extends JwtPayload {
  userId?: string;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
