const notif = preact.signal(null)

export const notify = (time, color, message) => {
    notif.value = { color, message }
    setTimeout(
        () => notif.value = null,
        time
    )
}

export default () => {
    return html`
        <${show} when=${notif.value !== null}>
            <ws-toaster ws-x="[$tc] [z 300]">
                <ws-notification ws-x="[$color @${notif.value?.color}]">
                    <ws-icon class="bi-exclamation-triangle-fill">
                        ${notif.value?.message}
                    <//>
                <//>
            <//>
        <//>
    `
}
