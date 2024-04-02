// export const onRequestGet = async ({ data }) => {
//     const { user, mongo } = data
//     const rules = await mongo.post({
//         url: "action/findOne",
//         data: {
//             dataSource: "fanart",
//             database: "fanart",
//             collection: "rules",
//             filter: {
//                 email: user.email
//             }
//         }
//     })

//     if (rules.ok === false) {
//         return Response.json(false)
//     }

//     return Response.json(rules.data.document)
// }

export const onRequestPost = async ({ request, data }) => {
    const { user, mongo } = data
    const updates = await request.json()

    const existing = await mongo.post({
        url: "action/findOne",
        data: {
            dataSource: "fanart",
            database: "fanart",
            collection: "rules",
            filter: {
                url: updates.url
            },
        }
    })
    if (existing.data.document !== null && existing.data.document.email !== user.email) {
        return Response.json({
            errors: ["URL is already in use."]
        })
    }

    const result = await mongo.post({
        url: "action/updateOne",
        data: {
            dataSource: "fanart",
            database: "fanart",
            collection: "rules",
            filter: {
                email: user.email
            },
            update: {
                $set: updates
            },
            upsert: true,
        }
    })

    if (result.ok === false) {
        return Response.json(false)
    }

    return Response.json(result.data)
}
