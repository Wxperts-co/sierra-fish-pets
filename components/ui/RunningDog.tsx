"use client";

import Lottie from "lottie-react";
import dogAnimation from "@/data/running-dog.json";

export default function RunningDog() {
  return (
    <div className="w-40">
      <Lottie
        animationData={dogAnimation}
        loop={true}
      />
    </div>
  );
}