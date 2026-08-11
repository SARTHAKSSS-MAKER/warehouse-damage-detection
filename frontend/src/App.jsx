import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleFile = (file) => {
    if (!file) return

    if (!file.type.startsWith('video/')) {
      alert('Please select a video file.')
      return
    }

    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
    }

    const url = URL.createObjectURL(file)

    setSelectedFile(file)
    setVideoUrl(url)
    setShowResults(false)
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    handleFile(file)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files[0]
    handleFile(file)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeFile = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
    }

    setSelectedFile(null)
    setVideoUrl('')
    setShowResults(false)
    setIsDetecting(false)
  }

  const startDetection = () => {
    if (!selectedFile) return

    setIsDetecting(true)
    setShowResults(false)

    /*
      Temporary frontend simulation.

      Later this button will send the video
      to our AI/backend detection API.
    */

    setTimeout(() => {
      setIsDetecting(false)
      setShowResults(true)
    }, 2000)
  }

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [videoUrl])

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <main className="app">

      {/* ================================
          NAVBAR
      ================================= */}

      <nav className="navbar">
        <div className="logo">WAREHOUSEAI</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#detection">Detection</a>
          <a href="#about">About</a>
        </div>
      </nav>


      {/* ================================
          HERO SECTION
      ================================= */}

      <section id="home" className="hero-section">

        <p className="eyebrow">
          AI-POWERED WAREHOUSE INSPECTION
        </p>

        <h1 className="hero-title">
          <span>Detect Package</span>
          <span>Damage Smarter.</span>
        </h1>

        <p className="hero-description">
          Upload a warehouse video and let our AI system
          detect damaged packages automatically.
        </p>

        <a
          href="#detection"
          className="detect-button"
        >
          Start Detection
        </a>

      </section>


      {/* ================================
          DETECTION SECTION
      ================================= */}

      <section
        id="detection"
        className="detection-section"
      >

        <div className="detection-container">

          <div className="detection-heading">

            <p className="section-label">
              AI PACKAGE INSPECTION
            </p>

            <h2>
              Package Damage
              <br />
              Detection.
            </h2>

            <p>
              Upload a warehouse video and our system
              will analyze the packages for visible damage.
            </p>

          </div>


          {/* ==============================
              UPLOAD AREA
          =============================== */}

          {!selectedFile && (

            <div
              className={`upload-card ${
                isDragging ? 'dragging' : ''
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >

              <div className="upload-icon">
                ↑
              </div>

              <h3>
                Upload Warehouse Video
              </h3>

              <p>
                Drag & drop your video here
                <br />
                or choose a file from your device
              </p>

              <label className="upload-button">
                Choose Video

                <input
                  type="file"
                  accept="video/mp4,video/mov,video/avi,video/webm,video/*"
                  onChange={handleFileChange}
                  hidden
                />
              </label>

              <span className="upload-hint">
                MP4, MOV, AVI or WebM
              </span>

            </div>

          )}


          {/* ==============================
              VIDEO PREVIEW
          =============================== */}

          {selectedFile && (

            <div className="video-card">

              <div className="video-preview">

                <video
                  src={videoUrl}
                  controls
                  playsInline
                />

              </div>


              <div className="file-info">

                <div>
                  <span className="file-label">
                    Selected video
                  </span>

                  <h3>
                    {selectedFile.name}
                  </h3>

                  <p>
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>

                <button
                  className="remove-button"
                  onClick={removeFile}
                  type="button"
                >
                  Remove
                </button>

              </div>


              <button
                className="analyze-button"
                onClick={startDetection}
                disabled={isDetecting}
                type="button"
              >

                {isDetecting
                  ? 'Analyzing Video...'
                  : 'Start Detection'
                }

              </button>

            </div>

          )}


          {/* ==============================
              PROCESSING STATE
          =============================== */}

          {isDetecting && (

            <div className="processing-card">

              <div className="loader"></div>

              <h3>
                Analyzing warehouse video
              </h3>

              <p>
                Our AI system is processing the video.
                Please wait...
              </p>

            </div>

          )}


          {/* ==============================
              RESULTS
          =============================== */}

          {showResults && (

            <div className="results-card">

              <div className="results-header">

                <div>
                  <p className="section-label">
                    ANALYSIS COMPLETE
                  </p>

                  <h3>
                    Detection Results
                  </h3>
                </div>

                <span className="status-badge">
                  Complete
                </span>

              </div>


              <div className="results-grid">

                <div className="result-item">
                  <span>Total Packages</span>
                  <strong>24</strong>
                </div>

                <div className="result-item">
                  <span>Damaged Packages</span>
                  <strong>5</strong>
                </div>

                <div className="result-item">
                  <span>Safe Packages</span>
                  <strong>19</strong>
                </div>

                <div className="result-item">
                  <span>Damage Rate</span>
                  <strong>20.8%</strong>
                </div>

              </div>


              <div className="results-note">
                AI detection results will be connected to
                the trained package-damage detection model.
              </div>

            </div>

          )}

        </div>

      </section>


      {/* ================================
          ABOUT SECTION
      ================================= */}

      <section
        id="about"
        className="about-section"
      >

        <p className="section-label">
          ABOUT WAREHOUSEAI
        </p>

        <h2>
          Smarter inspection.
          <br />
          Better warehouses.
        </h2>

        <p>
          WarehouseAI uses artificial intelligence to help
          warehouse teams identify damaged packages faster
          and improve inspection efficiency.
        </p>

      </section>


      {/* ================================
          FOOTER
      ================================= */}

      <footer className="footer">
        <p>
          © 2026 WarehouseAI. All rights reserved.
        </p>
      </footer>

    </main>
  )
}

export default App