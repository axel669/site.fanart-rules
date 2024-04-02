import { schema } from "./schema.js"
import { notify } from "./notif.js"

const user = preact.signal(null)
const loadUser = async () => {
    if (user.value !== null) {
        return
    }

    const res = await http.get("api/user")

    if (res.ok === false) {
        user.value = false
        return
    }
    user.value = res.data
}

const Login = () => {
    return html`
        <form action="https://dev-u5o6kihm.us.auth0.com/oauth/authorize"
        slot="action" ws-x="[grid] [gr.cols min-content]">
            <input type="hidden" name="scope" value="openid profile email" />
            <input type="hidden" name="response_type" value="token" />
            <input type="hidden" name="redirect_uri" value=${location.href} />
            <input type="hidden" name="client_id" value="PMMgbagvhm3WFk7JkA2hO5NvnRPI66nh" />
            <button ws-x="[$flat] [$compact]">
                Login
            <//>
        <//>
    `
}

const inputs = {
    "bool": (props) => {
        const { rules, item } = props
        const { key } = item
        const update = (evt) => rules[key] = evt.target.checked
        return html`
            <label ws-x="@toggle [$flat] [fl.main start] [gap 4px]">
                <input type="checkbox" onInput=${update} checked=${rules[key]} />
                <span slot="label-text">${item.label}<//>
            <//>
        `
    },
    "text": (props) => {
        const { rules, item } = props
        const { key } = item
        const update = (evt) => rules[key] = evt.target.value
        return html`
            <label ws-x="@control">
                <span slot="label-text">${item.label}<//>
                <input type="text" value=${rules[key]} onInput=${update} />
            <//>
        `
    },
    "choice": (props) => {
        const id = Math.random().toString(16)
        const { rules, item } = props
        const { key } = item
        const update = (value) => () => rules[key] = value
        const radios = item.choices.map(
            choice => html`
                <label ws-x="@toggle [$flat] [fl.main start] [gap 4px]">
                    <input type="radio" name=${id} onInput=${update(choice)}
                    checked=${choice === rules[key]} />
                    <span>${choice}<//>
                <//>
            `
        )

        return html`
            <ws-grid ws-x="[p 0px] [gr.cols repeat(${item.cols}, 1fr)]">
                ${radios}
            <//>
        `
    },
    "textarea": (props) => {
        const { rules, item } = props
        const { key } = item
        const update = (evt) => {
            rules[key] = evt.target.value
            len.value = evt.target.value.length
        }
        const len = preact.useSignal(0)

        return html`
            <label ws-x="@control">
                <span slot="label-text" ws-hint="(${len.value}/1000)">${item.label}<//>
                <textarea ws-x="[h 10em]" maxlength="1000" onInput=${update}>${rules[key]}<//>
            <//>
        `
    },
}

const EditorGroup = (props) => {
    const { group, rules } = props

    const items = group.items.map(
        item => {
            if (Array.isArray(item) === true) {
                const items = item.map(
                    item => html`<${inputs[item.type]} ...${{ item, rules }} />`
                )
                return html`
                    <ws-grid ws-x="[p 0px] [gr.cols 1fr 1fr]">
                        ${items}
                    <//>
                `
            }
            if (item.group !== undefined) {
                return html`<${EditorGroup} ...${{ group: item, rules }} />`
            }
            return html`<${inputs[item.type]} ...${{ item, rules }} />`
        }
    )

    return html`
        <fieldset ws-x="[b 2px solid @primary] [r 4px] [m.x 0px]">
            <legend ws-x="[b 1px solid @primary] [p 4px] [r 4px]">${group.group}<//>
            <ws-flex ws-x="[p 0px] [gap 12px]">
                ${items}
            <//>
        <//>
    `
}
const RuleEditor = (props) => {
    console.log("editor called")
    const { user } = props

    user.rules = user.rules ?? {}
    user.url = user.url ?? ""
    const groups = schema.map(
        group => html`<${EditorGroup} ...${{ group, rules: user.rules }} />`
    )

    const saving = preact.useSignal(false)
    const save = async () => {
        saving.value = true
        const result = await http.post({
            url: "api/rules",
            data: { url: user.url, rules: user.rules }
        })
        saving.value = false

        const { errors } = result.data
        if (errors === undefined) {
            notify(3500, "secondary", `Saved`)
            return
        }

        console.log(errors)
        notify(3500, "danger", `Failed to save: ${errors[0]}`)
    }
    const nameUpdate = (evt) => user.url = evt.target.value
    const copyURL = () => navigator.clipboard.writeText(`${location.origin}/${user.url}`)

    return html`
        <ws-flex ws-x="[over.y auto]" slot="content">
            <label ws-x="@control">
                <span slot="label-text" ws-hint="Make sure to save before using the URL">URL<//>
                <input type="text" onInput=${nameUpdate} value=${user.url} />
                <span ws-x="[$adorn start] [$subtitle]">${location.origin}/<//>
                <button ws-x="[$adorn end] [$flat] [$compact] [$color @primary]"
                onClick=${copyURL}>
                    Copy
                <//>
            <//>
            ${groups}
        <//>
        <div ws-x="[disp grid] [gr.cols 1fr]" slot="footer">
            <button ws-x="[$fill] [$color @secondary]" disabled=${saving.value} onClick=${save}>
                <${show} when=${saving.value === false}>
                    Save
                    <else>Saving...<//>
                <//>
            <//>
        <//>
        <${show} when=${saving.value === true}>
            <ws-flex ws-x="[fl-center] [pos fixed] [inset 0px] [bg rgba(0,0,0,0.5)] [z +100]">
                <ws-circle-spinner ws-x="[@size 100px]" />
                <div>Saving<//>
            <//>
        <//>
    `
}

export default () => {
    loadUser()

    return html`
        <${show} when=${user.value === null}>
            <ws-flex ws-x="[w 120px] [p 0px] [m.x auto]">
                <ws-hexagon-spinner ws-x="[@size 120px]" />
                <div ws-x="[t.a center]">Loading<//>
            <//>
            <else>
                <ws-screen ws-x="[@screen-width min(100%, 540px)]">
                    <ws-paper ws-x="[$outline]">
                        <ws-titlebar slot="header" ws-x="[$fill] [$color @primary]">
                            <span slot="title" ws-x="[$title]">
                                Fanart Rules
                            <//>
                            <${show} when=${user.value === false}>
                                <${Login} />
                            <//>
                        <//>
                        <${show} when=${user.value !== false}>
                            <${RuleEditor} user=${user.value} />
                            <else>
                                <ws-flex ws-x="[over.y auto]" slot="content">
                                    <div>
                                        Please login to create/edit your rules.
                                    <//>
                                <//>
                            <//>
                        <//>
                    <//>
                <//>
            <//>
        <//>
    `
}
