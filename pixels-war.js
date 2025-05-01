const urlParams = new URLSearchParams(window.location.search)
const PIXEL_URL = urlParams.get("baseurl") || "https://pixels-war.oie-lab.net"
const MAP_ID = urlParams.get("mapid") || "TEST"

document.getElementById("connect").addEventListener("click", () => {
    const base = document.getElementById("baseurl").value
    const map = document.getElementById("mapid").value
    // Redirige vers la page avec les bons paramètres
    window.location.href = `?baseurl=${base}&mapid=${map}`
})

document.addEventListener("DOMContentLoaded", async () => {
    const PREFIX = `${PIXEL_URL}/api/v1/${MAP_ID}`

    document.getElementById("baseurl").value = PIXEL_URL
    document.getElementById("mapid").value = MAP_ID
    //document.getElementById("baseurl").readOnly = true
    //document.getElementById("mapid").readOnly = true

    const preinitResp = await fetch(`${PREFIX}/preinit`, { credentials: "include" })
    const { key } = await preinitResp.json()

    const initResp = await fetch(`${PREFIX}/init?key=${key}`, { credentials: "include" })
    const { id: user_id, nx, ny, data } = await initResp.json()

    // Adapter dynamiquement la grille
    const grid = document.getElementById("grid")
    grid.style.gridTemplateColumns = `repeat(${nx}, 4px)`
    grid.style.gridTemplateRows = `repeat(${ny}, 4px)`

    // Créer les pixels
    grid.innerHTML = ''
    const pixels = []

    for (let y = 0; y < ny; y++) {
        for (let x = 0; x < nx; x++) {
            const color = data[y][x]
            const div = document.createElement("div")
            div.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`
            div.dataset.x = x
            div.dataset.y = y
            div.title = `(${x}, ${y})`
            grid.appendChild(div)
            pixels.push(div)

            // Clic sur pixel, changement
            div.addEventListener("click", async () => {
                const [r, g, b] = getPickedColorInRGB()
                const resp = await fetch(`${PREFIX}/set/${user_id}/${y}/${x}/${r}/${g}/${b}`, {
                    method: "GET",
                    credentials: "include"
                })
                const result = await resp.json()

                if (result === 0) {
                    div.style.backgroundColor = `rgb(${r},${g},${b})`
                } else {
                    alert(`Attends encore ${Math.ceil(result / 1e9)} sec avant de repeindre`)
                }
            })

            // Click droit, couleur du pixel
            div.addEventListener("contextmenu", (e) => {
                e.preventDefault()
                pickColorFrom(div)
            })
        }
    }

    // Bouton Refresh
    document.getElementById("refresh").addEventListener("click", () => refresh(user_id))

    // Refresh auto 
    setInterval(() => refresh(user_id), 3000)

    function refresh(user_id) {
        fetch(`${PREFIX}/deltas?id=${user_id}`, { credentials: "include" })
            .then((response) => response.json())
            .then((json) => {
                for (const [y, x, r, g, b] of json.deltas) {
                    const index = y * nx + x
                    const div = pixels[index]
                    div.style.backgroundColor = `rgb(${r},${g},${b})`
                }
            })
    }

    function getPickedColorInRGB() {
        const colorHexa = document.getElementById("colorpicker").value
        const r = parseInt(colorHexa.substring(1, 3), 16)
        const g = parseInt(colorHexa.substring(3, 5), 16)
        const b = parseInt(colorHexa.substring(5, 7), 16)
        return [r, g, b]
    }

    function pickColorFrom(div) {
        const bg = window.getComputedStyle(div).backgroundColor
        const [r, g, b] = bg.match(/\d+/g)
        const rh = parseInt(r).toString(16).padStart(2, '0')
        const gh = parseInt(g).toString(16).padStart(2, '0')
        const bh = parseInt(b).toString(16).padStart(2, '0')
        document.getElementById("colorpicker").value = `#${rh}${gh}${bh}`
    }
    
})
