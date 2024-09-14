"use client"
import { Player } from '@lottiefiles/react-lottie-player'
import React from 'react'
import animationData from "./PulseAnimation.json"
export const Pulse = () => {
  return (
    <div >
      <Player src={animationData} loop  autoplay />
    </div>
  )
}