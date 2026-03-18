import { ref } from "vue"

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCOPES = 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'

let tokenClient = null
export const accessToken = ref(null)
export const userInfo = ref(null)

export const initGoogleAuth = function () {
    if (!window.google) {
        console.error('Google Identity Services non ancora caricato')
        return
    }
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: () => {}
    })
}

export const signIn = function () {
    return new Promise((resolve, reject) => {
        tokenClient.callback = async (response) => {
            if (response.error) {
                reject(response.error)
                return
            }
            accessToken.value = response.access_token
            const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken.value}` }
            })
            userInfo.value = await resp.json()
            resolve()
        }
        tokenClient.requestAccessToken()
    })
}

export const isSignedIn = function () {
    return accessToken.value !== null
}

export const flushToGoogleCalendar = async function (smartEvents) {
    if (!isSignedIn()) await signIn()

    for (const event of smartEvents) {
        await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                summary: event.label,
                start: {
                    dateTime: event.startDateToISO(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                end: {
                    dateTime: event.endDateToISO(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                }
            })
        })
    }
}