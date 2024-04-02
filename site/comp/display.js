import { schema } from "./schema.js"

const displays = {
    "bool": (props) => {
        const { rules, item } = props
        const { key } = item

        if (rules[key] !== true) {
            return null
        }
        return html`
            <ws-chip ws-x="[$color @secondary] [$fill]" style="align-self: self-start;">${item.label}<//>
        `
    },
    "text": (props) => {
        const { rules, item } = props
        const { key } = item
        return html`
            <ws-grid ws-x="[gr.cols 120px 1fr] [p 0px] [b 1px solid @primary]">
                <div ws-x="[bg @primary] [t.c @text-color-invert] [p 4px] [t.a center]">
                    ${item.label}
                <//>
                <div ws-x="[p 4px]">${rules[key]}<//>
            <//>
        `
    },
    "choice": (props) => {
        const { rules, item } = props
        const { key } = item

        if (rules[key] === "Yes") {
            return html`<ws-chip ws-x="[$fill] [w 50%] [$color @secondary]">Yes<//>`
        }
        if (rules[key] === "Ask") {
            return html`<ws-chip ws-x="[$fill] [w 50%] [$color @warning]">Ask<//>`
        }
        return null
    },
    "textarea": (props) => {
        const { rules, item } = props
        const { key } = item

        const text = rules[key]?.trim() ?? ""
        if (text === "") {
            return null
        }
        return html`
            <fieldset ws-x="[b 2px solid @primary] [r 4px] [m.x 0px]">
                <legend ws-x="[b 1px solid @primary] [p 4px] [r 4px]">${item.label}<//>
                <div ws-x="[t.ws pre]">${text}<//>
            <//>
        `
    },
}

const RuleGroup = (props) => {
    const { group, rules } = props

    const [first] = group.items
    if (rules[first.key] === "No") {
        return html`
            <fieldset ws-x="[b 2px solid @primary] [r 4px] [m.x 0px]">
                <legend ws-x="[b 1px solid @primary] [p 4px] [r 4px]">${group.group}<//>
                <ws-flex ws-x="[p 0px] [gap 12px]">
                    <ws-chip ws-x="[$fill] [$color @danger]">No<//>
                <//>
            <//>
        `
    }

    const nonFalse = group.items.filter(
        item => rules[item.key] !== undefined && rules[item.key] !== false
    )
    if (nonFalse.length === 0) {
        return null
    }

    const items = group.items.map(
        item => {
            if (Array.isArray(item) === true) {
                const items = item.map(
                    item => html`<${displays[item.type]} ...${{ item, rules }} />`
                )
                return html`
                    <ws-grid ws-x="[p 0px] [gr.cols 1fr 1fr]">
                        ${items}
                    <//>
                `
            }
            if (item.group !== undefined) {
                return html`<${RuleGroup} ...${{ group: item, rules }} />`
            }
            return html`<${displays[item.type]} ...${{ item, rules }} />`
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
const Rules = (props) => {
    console.log("editor called")
    const { rules } = props

    const groups = schema.map(
        group => html`<${RuleGroup} ...${{ group, rules }} />`
    )

    return html`
        <ws-flex ws-x="[over.y auto]" slot="content">
            ${groups}
        <//>
    `
}

const rules = preact.signal(false)

const loadRules = async () => {
    if (rules.value !== false) {
        return
    }
    const res = await http.get("rules")

    if (res.ok === false) {
        rules.value = false
        return
    }
    rules.value = res.data
}
export default (props) => {
    const { user } = props
    loadRules()

    return html`
        <${show} when=${rules.value === false}>
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
                        <//>
                        <ws-flex ws-x="[over.y auto]" slot="content">
                            <${Rules} rules=${rules.value} />
                            <!-- <pre>${JSON.stringify(rules.value, null, 2)}<//> -->
                        <//>
                    <//>
                <//>
            <//>
        <//>
    `
}
