import http from "@axel669/http"

export const onRequestGet = async ({ params, env }) => {
    const mongo = http.create(
        "https://us-west-2.aws.data.mongodb-api.com/app/data-vmadr/endpoint/data/v1",
        {
            headers: {
                apiKey: env.mongo_key
            }
        }
    )

    const rules = await mongo.post({
        url: "action/findOne",
        data: {
            dataSource: "fanart",
            database: "fanart",
            collection: "rules",
            filter: {
                url: params.user
            }
        }
    })

    if (rules.ok === false) {
        return Response.json(false)
    }

    const artRules = rules.data.document?.rules ?? null
    return Response.json(artRules)
}
