"use client";

import PageHeader from "@/components/layout/page-header";
import { Camera, AlertTriangle, Crosshair, Users, Activity } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export default function OverwatchPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [crowdCount, setCrowdCount] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [cameraError, setCameraError] = useState("");

  // Load Model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
      } catch (err) {
        console.error("Failed to load coco-ssd model:", err);
      }
    };
    loadModel();
  }, []);

  // Setup Webcam
  const setupCamera = async () => {
    setCameraError("");

    if (typeof window !== "undefined" && window.isSecureContext === false) {
      setCameraError("Camera access requires a secure context (HTTPS or localhost).");
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera API is not supported in your browser.");
      return;
    }

    try {
      // Using simplest constraint to prevent OverconstrainedError
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Error accessing webcam:", err);
      if (err.name === 'NotAllowedError' || err.message?.toLowerCase().includes('permission denied')) {
        setCameraError("PERMISSION_DENIED");
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError' || err.message?.includes('Could not start video source')) {
        setCameraError("Camera is in use by another application (e.g. Zoom, Teams) or blocked by antivirus.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError("No camera device found. Please connect a webcam.");
      } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
        setCameraError("Camera does not support the requested video settings.");
      } else {
        setCameraError(`Camera error: ${err.message || err.name || 'Unknown error'}`);
      }
    }
  };

  useEffect(() => {
    setupCamera();
  }, []);

  // Detection Loop
  useEffect(() => {
    let animationFrameId: number;
    
    const detectFrame = async () => {
      if (!model || !videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      if (video.readyState === 4) {
        setIsDetecting(true);
        const predictions = await model.detect(video);
        
        // Count people
        const people = predictions.filter(p => p.class === 'person');
        setCrowdCount(people.length);

        // Draw bounding boxes
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          
          predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox;
            const text = `${prediction.class} ${(prediction.score * 100).toFixed(1)}%`;
            
            // Box style based on class
            const isPerson = prediction.class === 'person';
            ctx.strokeStyle = isPerson ? '#ef4444' : '#22c55e'; // red for person, green for others
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);

            // Text background
            ctx.fillStyle = isPerson ? '#ef4444' : '#22c55e';
            ctx.fillRect(x, y - 20, ctx.measureText(text).width + 8, 20);

            // Text
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px sans-serif';
            ctx.fillText(text, x + 4, y - 5);
          });
        }
      }
      animationFrameId = requestAnimationFrame(detectFrame);
    };

    if (model) {
      detectFrame();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [model]);

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="shrink-0 mb-4">
        <PageHeader 
          title="Overwatch Command Center" 
          subtitle="Real-time live feeds and autonomous Computer Vision monitoring."
        >
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-lg border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-bold tracking-wider">LIVE SYSTEM</span>
          </div>
        </PageHeader>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* HERO FEED - Local Webcam with ML */}
        <div className="lg:col-span-2 bg-black rounded-xl border border-gray-800 overflow-hidden relative flex flex-col group shadow-xl">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              HQ WEBCAM (LIVE CV)
            </div>
            <div className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
              Zone: Central District
            </div>
            {isDetecting && (
              <div className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                <Users className="w-3 h-3 text-red-400" />
                Crowd Density: {crowdCount}
              </div>
            )}
          </div>

          <div className="absolute top-4 right-4 z-10">
            <div className={`text-xs font-mono px-2 py-1 rounded shadow-lg flex items-center gap-2 border ${model ? 'bg-black/60 backdrop-blur-md text-green-400 border-green-500/30' : 'bg-black/80 text-yellow-400 border-yellow-500/30'}`}>
              <Activity className="w-3 h-3" />
              {model ? 'AI ACTIVE (COCO-SSD)' : 'LOADING ML MODEL...'}
            </div>
          </div>

          {/* Video element for webcam */}
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover flex-1 bg-[#0a0a0a]"
            onLoadedMetadata={() => {
              if (videoRef.current && canvasRef.current) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
              }
            }}
          />
          
          {/* Canvas for TensorFlow bounding boxes */}
          <canvas 
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {cameraError === "PERMISSION_DENIED" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-50 p-6 backdrop-blur-sm">
              <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center shadow-2xl animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Camera Access Blocked</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Voluntra Overwatch requires camera access to run the live CV models. 
                  Please click the <strong className="text-gray-900">lock icon</strong> in your browser's address bar, switch Camera to <strong className="text-green-600">Allow</strong>, and try again.
                </p>
                <button 
                  onClick={setupCamera}
                  className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-lg transition-colors flex justify-center items-center gap-2"
                >
                  <Activity className="w-4 h-4" /> I have allowed access
                </button>
              </div>
            </div>
          )}

          {cameraError && cameraError !== "PERMISSION_DENIED" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-50">
              <div className="text-red-500 font-bold bg-red-100 px-4 py-3 rounded-lg flex items-center gap-2 max-w-md text-center shadow-lg border border-red-200">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <span className="text-sm">{cameraError}</span>
              </div>
              <button 
                onClick={setupCamera}
                className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-lg transition-colors"
              >
                Retry Camera Connection
              </button>
            </div>
          )}
        </div>

        {/* SECONDARY FEEDS */}
        <div className="grid grid-rows-2 gap-4 h-full">
          {/* Simulated Feed 1 */}
          <div className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden relative group">
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <div className="bg-red-600/80 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                REC
              </div>
              <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                Zone: Northern Suburbs
              </div>
            </div>
            
            <div className="w-full h-full relative overflow-hidden bg-[#111]">
              <div 
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-70 animate-[pulse_4s_ease-in-out_infinite] scale-105"
              />
              <div className="absolute inset-0 bg-black/40 mix-blend-multiply pointer-events-none" />
              <div className="absolute bottom-3 left-3 z-10">
                <div className="bg-blue-500/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-blue-400">
                  <Users className="w-3 h-3" />
                  Crowd Density: Low
                </div>
              </div>
            </div>
          </div>

          {/* Simulated Feed 2 */}
          <div className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden relative group">
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <div className="bg-red-600/80 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                REC
              </div>
              <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                Zone: Downtown Hub
              </div>
            </div>
            
            <div className="w-full h-full relative overflow-hidden bg-[#111]">
               <div 
                 className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596720426673-e4e14290f0cc?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-70 animate-[pulse_5s_ease-in-out_infinite] scale-105"
               />
               <div className="absolute inset-0 bg-black/40 mix-blend-multiply pointer-events-none" />
               <div className="absolute bottom-3 left-3 z-10">
                <div className="bg-orange-500/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-orange-400">
                  <AlertTriangle className="w-3 h-3" />
                  Warning: Water Level
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
