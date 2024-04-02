import "./setup.js"
import http from "https://esm.sh/@axel669/http@0.1.2/browser"

import Editor from "./comp/editor.js"
import Display from "./comp/display.js"
import Notifications from "./comp/notif.js"

window.http = http
const target = new URL(location).pathname.slice(1) || null

if (tokenInfo.access_token !== undefined) {
    await http.get({
        url: "login",
        query: { token: tokenInfo.access_token }
    })
}

// const rules = preact.signal(
//     (target === null) ? null
// )
const App = () => {
    return html`
        <${show} when=${target !== null}>
            <${Display} user=${target} />
            <else>
                <${Editor} />
            <//>
        <//>
        <${Notifications} />
    `
}

console.log("load:", target)

preact.render(html`<${App} />`, document.body)
