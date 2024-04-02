import cookie from "cookie"
import jwt from "@tsndr/cloudflare-worker-jwt"

import auth0 from "../comm/auth0.js"

export const onRequestGet = async ({ request, env }) => {
    const url = new URL(request.url)
    const token = url.searchParams.get("token")

    if (token === null) {
        return Response.json(false)
    }

    const response = await auth0.get({
        url: "/userinfo",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    if (response.ok === false) {
        return Response.json(false)
    }

    const userToken = await jwt.sign(
        { email: response.data.email },
        env.jwt_secret,
        { algorithm: "HS256" }
    )

    return Response.json(true, {
        headers: {
            "Set-Cookie": cookie.serialize(
                "user",
                userToken,
                {
                    httpOnly: true,
                    expires: new Date(
                        Date.now() + 691200000
                    ),
                    secure: true,
                    sameSite: "strict",
                }
            )
        }
    })
}
