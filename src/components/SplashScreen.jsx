import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashScreen.css";
import { FaLeaf } from "react-icons/fa";

const SplashScreen = () => {
  const navigate = useNavigate();
  const DURATION = 3000;

  // Animated progress 0→100
  const [progress, setProgress] = useState(0);

  // Typewriter taglines
  const taglines = ["Growing Tomorrow", "Farming Smart", "Harvesting Innovation"];
  const [tagline, setTagline] = useState("");
  const tagIndex = useRef(0);
  const charIndex = useRef(0);

  // Animate progress bar
  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const pct = Math.min(100, ((now - start) / DURATION) * 100);
      setProgress(Math.floor(pct));
      if (pct < 100) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  // Typewriter cycling
  // useEffect(() => {
  //   let timer;
  //   const type = () => {
  //     const current = taglines[tagIndex.current];
  //     if (charIndex.current < current.length) {
  //       setTagline((t) => t + current[charIndex.current++]);
  //       timer = setTimeout(type, 100);
  //     } else {
  //       timer = setTimeout(() => {
  //         setTagline("");
  //         charIndex.current = 0;
  //         tagIndex.current = (tagIndex.current + 1) % taglines.length;
  //         type();
  //       }, 800);
  //     }
  //   };
  //   type();
  //   return () => clearTimeout(timer);
  // }, []);

  // Redirect after DURATION
  useEffect(() => {
    const timer = setTimeout(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      navigate(user?.username ? "/dashboard" : "/signin");
    }, DURATION);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container bg-dark vh-100 d-flex justify-content-center align-items-center">
            
          <div className="splash-screen bg-dark d-flex flex-column ">
            <div className="splash-box">
              {/* Rotating leaf */}
              <div className="logo-container">
                <i className="fas fa-leaf logo-icon"></i>
              </div>
              {/* Title */}
              <h1 className="splash-title text-success">SmartFarm <FaLeaf/>  </h1>
              {/* Tagline */}
              <p className="splash-tagline text-success">
                {tagline}
                <span className="cursor text-warning">|</span>
              </p>
              {/* Progress Bar */}
              {/* <div className="progress-bar">
                <div
                  className="progress-fill bg-success"
                  style={{ width: `${progress}%` }}
                />
              </div> */}
              {/* Loading Text */}
              <p className="splash-loading text-light">
                {progress < 100 ? `Loading ${progress}%` : "Redirecting…"}
              </p>
            </div>
          </div>
    </div>
  );
};

export default SplashScreen;
