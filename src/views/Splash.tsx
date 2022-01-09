import cube from "../assets/cube.png";
import styles from "./Splash.module.css";

function SplashView() {
  return (
    <div className={styles.Splash}>
      <img src={cube} />
      <h1>Albert</h1>
      <h2>L1 Labs</h2>
    </div>
  );
}
export default SplashView;
