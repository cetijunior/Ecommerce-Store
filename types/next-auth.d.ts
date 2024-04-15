// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session types to include the accessToken
   */

  interface User {
    accessToken?: string;
  }

  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      accessToken?: string;  // Ensure this property is declared
    };
  }
}