import cube from "../assets/cube.png";
import "./Splash.css";

function SplashView() {
  return (
    <div className="Splash">
      <img src={cube} alt="Albert Logo" />
      <h1>Albert</h1>
      <h2>L1 Labs</h2>
    </div>
  );
}
export default SplashView;
