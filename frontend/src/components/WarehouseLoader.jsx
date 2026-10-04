import { useEffect, useState } from "react"

function WarehouseLoader({ onComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 3600
    const intervalTime = 30
    const increment = 100 / (duration / intervalTime)

    const progressTimer = setInterval(() => {
      setProgress((current) => {
        const next = current + increment

        if (next >= 100) {
          clearInterval(progressTimer)
          return 100
        }

        return next
      })
    }, intervalTime)

    const completeTimer = setTimeout(() => {
      onComplete()
    }, duration + 300)

    return () => {
      clearInterval(progressTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  const products = [
    { icon: "📦", className: "loader-box orange", left: "8%", delay: "0.1s", duration: "2.7s" },
    { icon: "📊", className: "loader-box cyan", left: "18%", delay: "0.7s", duration: "2.4s" },
    { icon: "📦", className: "loader-box purple", left: "29%", delay: "1.1s", duration: "2.9s" },
    { icon: "📈", className: "loader-box green", left: "40%", delay: "0.4s", duration: "2.5s" },
    { icon: "📦", className: "loader-box pink", left: "51%", delay: "1.4s", duration: "2.8s" },
    { icon: "🚚", className: "loader-box blue", left: "62%", delay: "0.8s", duration: "2.6s" },
    { icon: "📦", className: "loader-box orange", left: "73%", delay: "1.7s", duration: "2.5s" },
    { icon: "🔄", className: "loader-box cyan", left: "84%", delay: "0.5s", duration: "2.9s" },
    { icon: "📦", className: "loader-box purple", left: "93%", delay: "1.3s", duration: "2.6s" }
  ]

  return (
    <div className="warehouse-loader">
      <div className="loader-background-grid"></div>

      <div className="loader-glow loader-glow-one"></div>
      <div className="loader-glow loader-glow-two"></div>
      <div className="loader-glow loader-glow-three"></div>

      <div className="loader-particles">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${15 + ((index * 23) % 70)}%`,
              animationDelay: `${(index % 6) * 0.4}s`
            }}
          ></span>
        ))}
      </div>

      <div className="loader-content">

        <div className="loader-brand">
          <div className="loader-brand-icon">
            <span>W</span>
          </div>

          <div>
            <strong>WAREHOUSE</strong>
            <small>INTELLIGENCE SYSTEM</small>
          </div>
        </div>

        <div className="loader-title">
          <span>BIG DATA POWERED</span>
          <h1>Warehouse Inventory Intelligence</h1>
          <p>
            Demand Forecasting • Inventory Risk • Smart Reorder
          </p>
        </div>

        <div className="warehouse-stage">

          <div className="loader-rack rack-one">
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="loader-rack rack-two">
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="warehouse-building">
            <div className="warehouse-roof"></div>

            <div className="warehouse-sign">
              WAREHOUSE
            </div>

            <div className="warehouse-door">
              <div></div>
              <div></div>
            </div>

            <div className="warehouse-window window-one"></div>
            <div className="warehouse-window window-two"></div>
            <div className="warehouse-window window-three"></div>

            <div className="warehouse-lights">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="loader-floor"></div>

          {products.map((product, index) => (
            <div
              key={index}
              className={product.className}
              style={{
                left: product.left,
                animationDelay: product.delay,
                animationDuration: product.duration
              }}
            >
              {product.icon}
            </div>
          ))}

        </div>

        <div className="loader-modules">
          <div>
            <span>01</span>
            <strong>INVENTORY</strong>
          </div>

          <i></i>

          <div>
            <span>02</span>
            <strong>FORECASTING</strong>
          </div>

          <i></i>

          <div>
            <span>03</span>
            <strong>RISK ANALYSIS</strong>
          </div>

          <i></i>

          <div>
            <span>04</span>
            <strong>SMART REORDER</strong>
          </div>
        </div>

        <div className="loader-progress-area">
          <div className="loader-status">
            <span>INITIALIZING INTELLIGENCE MODULES</span>
            <strong>{Math.min(100, Math.floor(progress))}%</strong>
          </div>

          <div className="loader-progress">
            <div
              className="loader-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default WarehouseLoader