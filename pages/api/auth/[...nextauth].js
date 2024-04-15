import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", required: true },
                password: { label: "Password", type: "password", required: true }
            },
            authorize: async (credentials) => {
                try {
                    const res = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(credentials)
                    });

                    if (res.ok) {
                        const user = await res.json();
                        return user;
                    } else {
                        throw new Error("Your login details are incorrect");
                    }
                } catch (error) {
                    console.error("Authentication error:", error);
                    throw new Error("An error occurred during authentication");
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (token.id) {
                session.user.id = token.id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
});
