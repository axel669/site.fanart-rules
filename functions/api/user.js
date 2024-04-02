export const onRequestGet = async ({ data }) => {
    const { user, mongo } = data
    const rules = await mongo.post({
        url: "action/findOne",
        data: {
            dataSource: "fanart",
            database: "fanart",
            collection: "rules",
            filter: {
                email: user.email
            }
        }
    })

    return Response.json({
        ...data.user,
        url: rules.data.document?.url,
        rules: rules.data.document?.rules,
    })
}
