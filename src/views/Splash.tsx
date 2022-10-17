import cube from "../assets/cube.png"
import "./Splash.css"

function SplashView() {
  return (
    <div className="Splash" data-testid="splash-screen">
      <img src={cube} alt="Alberto Logo" />
      <h1>Alberto</h1>
      <h2>Lifted Initiative</h2>
    </div>
  )
}
export default SplashView
