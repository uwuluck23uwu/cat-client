import React, { useRef, useEffect, useState } from "react";
import {
  Camera,
  CameraOff,
  Maximize2,
  Minimize2,
  RotateCcw,
  Download,
  Video,
  Square,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

interface CameraViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isStreamActive, setIsStreamActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // 📸 เพิ่ม state สำหรับกล้อง
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  // Load camera devices
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((d) => d.kind === "videoinput");
      setCameras(videoDevices);
      if (videoDevices[0]) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    });
  }, []);

  // Start camera stream
  const startCamera = async () => {
    try {
      setError(null);

      const constraints: MediaStreamConstraints = {
        video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true,
        audio: true,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(mediaStream);

      if (videoRef.current) {
        const v = videoRef.current;
        v.srcObject = mediaStream;
        v.muted = true;

        try {
          await v.play();
          setIsStreamActive(true);
        } catch (e1) {
          console.warn("Autoplay blocked, waiting for metadata...", e1);
          v.onloadedmetadata = async () => {
            try {
              await v.play();
              setIsStreamActive(true);
            } catch (e2) {
              console.error("Play after metadata failed:", e2);
              setError("ไม่สามารถเล่นวิดีโอกล้องได้");
              setIsStreamActive(false);
            }
          };
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(
        "ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้งานกล้องในเบราว์เซอร์"
      );
      setIsStreamActive(false);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsStreamActive(false);
    if (isRecording) stopRecording();
  };

  // Take screenshot
  const takeScreenshot = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `pet-camera-${new Date()
            .toISOString()
            .slice(0, 19)}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }, "image/png");
      }
    }
  };

  // Start recording
  const startRecording = () => {
    if (!stream) return;
    try {
      const mr = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pet-recording-${new Date()
          .toISOString()
          .slice(0, 19)}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      mr.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("ไม่สามารถเริ่มบันทึกวิดีโอได้");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
    setIsFullscreen((s) => !s);
  };

  // Recording timer
  useEffect(() => {
    let id: number | null = null;
    if (isRecording) {
      id = window.setInterval(() => setRecordingTime((p) => p + 1), 1000);
    }
    return () => {
      if (id !== null) clearInterval(id);
    };
  }, [isRecording]);

  // Auto start/stop when modal open/close
  useEffect(() => {
    if (isOpen && !isStreamActive) startCamera();
    return () => {
      if (!isOpen) stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedCamera]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-xl shadow-2xl ${
          isFullscreen ? "w-full h-full" : "max-w-4xl w-full max-h-[90vh]"
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold">
              กล้องวงจรปิด - ติดตามยูจิและลูน่า
            </h3>
            {isRecording && (
              <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                REC {formatTime(recordingTime)}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera View */}
        <div className="relative bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            className={`w-full bg-black ${
              isFullscreen ? "h-screen object-contain" : "h-96 object-contain"
            }`}
          />

          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 text-white">
              <div className="text-center">
                <CameraOff className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2">เกิดข้อผิดพลาด</p>
                <p className="text-sm text-gray-300 mb-4">{error}</p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ลองใหม่
                </button>
              </div>
            </div>
          )}

          {/* Loading overlay */}
          {!error && !isStreamActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 text-white">
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400 animate-pulse" />
                <p className="text-lg">กำลังเชื่อมต่อกล้อง...</p>
              </div>
            </div>
          )}

          {/* Live overlay */}
          {isStreamActive && (
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg">
              <div className="text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  LIVE
                </div>
                <div className="text-xs text-gray-300 mt-1">
                  {new Date().toLocaleString("th-TH")}
                </div>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="bg-gray-100 p-4">
          <div className="flex items-center justify-between">
            {/* Left controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={isStreamActive ? stopCamera : startCamera}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isStreamActive
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {isStreamActive ? (
                  <CameraOff className="w-4 h-4" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                {isStreamActive ? "ปิดกล้อง" : "เปิดกล้อง"}
              </button>

              {/* 🔽 Camera selector */}
              <select
                value={selectedCamera ?? ""}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {cameras.map((cam) => (
                  <option key={cam.deviceId} value={cam.deviceId}>
                    {cam.label || `กล้อง ${cam.deviceId}`}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsMuted((m) => !m)}
                className={`p-2 rounded-lg transition-colors ${
                  isMuted
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
                disabled={!isStreamActive}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Center controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={takeScreenshot}
                disabled={!isStreamActive}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">ถ่ายภาพ</span>
              </button>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!isStreamActive}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {isRecording ? (
                  <Square className="w-4 h-4" />
                ) : (
                  <Video className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {isRecording ? "หยุดบันทึก" : "บันทึกวิดีโอ"}
                </span>
              </button>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                title="รีเฟรชกล้อง"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>
                สถานะ:{" "}
                {isStreamActive ? "🟢 เชื่อมต่อแล้ว" : "🔴 ไม่ได้เชื่อมต่อ"}
              </span>
              <span>คุณภาพ: HD 720p</span>
              <span>เสียง: {isMuted ? "🔇 ปิด" : "🔊 เปิด"}</span>
            </div>
            <div className="text-xs text-gray-500">
              กดปุ่ม ESC เพื่อออกจากโหมดเต็มจอ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraView;
