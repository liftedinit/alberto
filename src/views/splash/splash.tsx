import cubePng from "@/assets/cube.png"
import "./splash.css"

export function Splash() {
  return (
    <div className="Splash" data-testid="splash-screen">
      <img src={cubePng} alt="Alberto Logo" />
      <h1>Alberto</h1>
      <h2>Lifted Initiative</h2>
    </div>
  )
}
