import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface AnimatedBackgroundProps {
  className?: string
  children?: React.ReactNode
}

export function AnimatedBackground({ className, children }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create floating squares
    const squares: Array<{
      x: number
      y: number
      size: number
      dx: number
      dy: number
      rotation: number
      rotationSpeed: number
      opacity: number
    }> = []

    // Initialize squares
    for (let i = 0; i < 6; i++) {
      squares.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 60 + 20,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.1 + 0.05,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      squares.forEach((square) => {
        // Update position
        square.x += square.dx
        square.y += square.dy
        square.rotation += square.rotationSpeed

        // Bounce off walls
        if (square.x < 0 || square.x > canvas.width) square.dx *= -1
        if (square.y < 0 || square.y > canvas.height) square.dy *= -1

        // Keep squares in bounds
        square.x = Math.max(0, Math.min(canvas.width, square.x))
        square.y = Math.max(0, Math.min(canvas.height, square.y))

        // Draw square
        ctx.save()
        ctx.translate(square.x, square.y)
        ctx.rotate(square.rotation)
        ctx.globalAlpha = square.opacity
        
        // Use theme-aware colors
        const isDark = document.documentElement.classList.contains("dark")
        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"
        ctx.lineWidth = 1
        
        ctx.fillRect(-square.size / 2, -square.size / 2, square.size, square.size)
        ctx.strokeRect(-square.size / 2, -square.size / 2, square.size, square.size)
        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "transparent" }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
