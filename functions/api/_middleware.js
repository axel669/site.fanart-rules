import http from "@axel669/http"
import cookie from "cookie"
import jwt from "@tsndr/cloudflare-worker-jwt"

export const onRequest = async ({ request, env, next, data }) => {
    const cookies = cookie.parse(request.headers.get("cookie") ?? "")

    if (cookies.user === undefined) {
        return Response.json(false, { status: 401 })
    }

    const valid = await jwt.verify(
        cookies.user,
        env.jwt_secret,
        { algorithm: "HS256" }
    )
    if (valid === false) {
        return Response.json(false, { status: 401 })
    }

    const info = await jwt.decode(
        cookies.user,
        env.jwt_secret,
        { algorithm: "HS256" }
    )
    data.user = info.payload
    data.mongo = http.create(
        "https://us-west-2.aws.data.mongodb-api.com/app/data-vmadr/endpoint/data/v1",
        { headers: {
            apiKey: env.mongo_key
        } }
    )
    return await next()
}
