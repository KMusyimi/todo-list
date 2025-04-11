import { JSX } from "react"

export default function RectSolidSvg(): JSX.Element {
    return (<svg width= "21" height = "21" viewBox = "0 0 21 21" fill = "none" xmlns = "http://www.w3.org/2000/svg" >
        <rect x="2.4269" y = "1.59878" width = "16.9629" height = "16.9629" rx = "4.49018" fill = "#E2E2E2" />
            <rect x="2.4269" y = "1.59878" width = "16.9629" height = "16.9629" rx = "4.49018" stroke = "#E2E2E2" strokeWidth = "2.99345" />
                </svg>)
}

export function NotesSvg(): JSX.Element {
    return (<svg fill= "none" height = "24" strokeWidth = "1.5" viewBox = "0 0 24 24" width = "24" xmlns = "http://www.w3.org/2000/svg" > <path d="M8 14L16 14" stroke = "currentColor" strokeLinecap = "round" strokeLinejoin = "round" /> <path d="M8 10L10 10" stroke = "currentColor" strokeLinecap = "round" strokeLinejoin = "round" /> <path d="M8 18L12 18" stroke = "currentColor" strokeLinecap = "round" strokeLinejoin = "round" /> <path d="M10 3H6C4.89543 3 4 3.89543 4 5V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V5C20 3.89543 19.1046 3 18 3H14.5M10 3V1M10 3V5" stroke = "currentColor" strokeLinecap = "round" strokeLinejoin = "round" /> </svg>)
}

export function DescriptionSvg(): JSX.Element {
    return (<svg fill= "currentColor" enableBackground = "new 0 0 27 27" height = "27" id = "Layer_1" version = "1.1" viewBox = "0 0 512 512" width = "27" > <path d="M449.441,393.818V178.852c0-31.555-27.967-57.236-62.365-57.236H369.99v-3.434c0-31.566-27.967-57.236-62.365-57.236  h-23.034H152.586h-27.661c-34.388,0-62.365,25.67-62.365,57.236v214.965c0,31.555,27.978,57.236,62.365,57.236h17.084v3.435  c0,31.565,27.978,57.235,62.366,57.235h27.661h132.005h11.867h11.167C421.474,451.053,449.441,425.384,449.441,393.818z   M364.041,432.318H232.036h-27.661c-23.177,0-41.956-17.237-41.956-38.5v-3.435v-18.736V178.852c0-21.263,18.779-38.5,41.956-38.5  h27.661h117.545h14.46h5.949h17.085c23.177,0,41.956,17.237,41.956,38.5v214.966c0,21.263-18.779,38.5-41.956,38.5h-11.167H364.041z  " /> <path d="M197.397,214.935h162.334c4.484,0,8.115-3.632,8.115-8.116s-3.631-8.115-8.115-8.115H197.397  c-4.484,0-8.116,3.631-8.116,8.115S192.913,214.935,197.397,214.935z" /> <path d="M223.046,261.967c0,4.484,3.642,8.115,8.126,8.115h152.119c4.484,0,8.126-3.631,8.126-8.115s-3.642-8.127-8.126-8.127  H231.172C226.688,253.84,223.046,257.482,223.046,261.967z" /> <path d="M348.083,317.102c0-4.484-3.632-8.116-8.116-8.116h-142.57c-4.484,0-8.116,3.632-8.116,8.116s3.631,8.126,8.116,8.126  h142.57C344.451,325.228,348.083,321.587,348.083,317.102z" /> <path d="M391.417,372.249c0-4.484-3.642-8.115-8.126-8.115H249.689c-4.484,0-8.116,3.631-8.116,8.115s3.631,8.116,8.116,8.116  h133.602C387.776,380.365,391.417,376.733,391.417,372.249z" /> </svg>)
}

export function ProjectIcon({ color }: { color: string }) {
    return (
    <svg className="project-icon" viewBox = "0 0 24 24" fill = "none" >
        <rect x="0.997817" y = "0.997817" width = "22.0044" height = "22.0044" rx = "4.98909"
            stroke = { color }
            strokeWidth = "3" />
        </svg>)
}