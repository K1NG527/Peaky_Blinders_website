import { useEffect, useRef } from 'react';
import { useCharacter } from '@/context/CharacterContext';

const VS = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FS = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color;

  // Simple noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.2;
    
    // Create swirling effect
    vec2 p = uv * 3.0;
    for(int n = 1; n < 4; n++) {
        float i = float(n);
        p += vec2(0.7 / i * sin(i * p.y + t + 0.3 * i) + 0.8, 0.4 / i * sin(i * p.x + t + 0.3 * i) + 1.6);
    }
    
    float v = 0.5 + 0.5 * sin(p.x);
    vec3 color = mix(u_color * 0.2, u_color, v * 0.3);
    
    // Add "embers" / "glint"
    float g = noise(uv * 100.0 + t);
    if (g > 0.995) color += 0.2;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function WhiskeyShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, isStealthMode } = useCharacter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    if (!program) return;
    const vs = createShader(gl, gl.VERTEX_SHADER, VS);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const posAttrib = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    const resize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    window.addEventListener('resize', resize);
    resize(); // Initial size

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const colorLoc = gl.getUniformLocation(program, 'u_color');

    let animationFrame: number;
    const render = (time: number) => {
      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);

      const rgb = theme.accentRgb.split(',').map(v => parseInt(v) / 255);
      gl.uniform3f(colorLoc, rgb[0], rgb[1], rgb[2]);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [theme, isStealthMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full opacity-40 pointer-events-none"
      style={{ filter: 'blur(20px)' }}
    />
  );
}
