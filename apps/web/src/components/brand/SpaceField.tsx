"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const TRAIL_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uPrev;
uniform sampler2D uMark;
uniform vec2 uMouse;
uniform vec2 uDelta;
uniform vec2 uRes;
uniform float uDecay;
uniform float uForce;
uniform float uTime;
uniform float uEmit;

void main() {
  vec4 prev = texture2D(uPrev, vUv);
  vec2 vel = prev.xy * 2.0 - 1.0;
  vec2 advected = clamp(vUv - vel * vec2(0.014, 0.014 * uRes.x / max(uRes.y, 1.0)), 0.0, 1.0);
  vec4 adv = texture2D(uPrev, advected);
  float dens = adv.a * uDecay;

  vec2 aspect = vec2(uRes.x / max(uRes.y, 1.0), 1.0);
  vec2 p = (vUv - uMouse) * aspect;
  float d = length(p);
  float splat = exp(-d * d * 220.0) * uForce;
  dens += splat;

  float mark = texture2D(uMark, vec2(vUv.x, 1.0 - vUv.y)).r;
  dens += mark * uEmit * (0.55 + 0.45 * sin(uTime * 0.7 + vUv.x * 6.0));

  dens = clamp(dens, 0.0, 1.0);
  vel = (vel + uDelta * splat * 10.0) * 0.982;
  vel += (vec2(mark) - 0.5) * mark * 0.004;
  vel = clamp(vel, vec2(-1.0), vec2(1.0));
  gl_FragColor = vec4(vel * 0.5 + 0.5, 0.0, dens);
}
`;

const SCENE_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTrail;
uniform sampler2D uMark;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uTime;
uniform float uReduce;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.07 + 13.17;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(uRes.x / max(uRes.y, 1.0), 1.0);
  vec2 p = (uv - 0.5) * aspect;

  float t = uTime * (1.0 - uReduce * 0.85);
  float n1 = fbm(p * 1.6 + vec2(t * 0.03, -t * 0.02));
  float n2 = fbm(p * 3.1 - vec2(t * 0.04, t * 0.015) + n1);
  float nebula = smoothstep(0.32, 0.82, n2) * 0.16 + n1 * 0.05;

  float stars = 0.0;
  vec2 sp = uv * vec2(140.0, 90.0);
  float h = hash(floor(sp));
  float tw = 0.55 + 0.45 * sin(t * (1.4 + h * 3.0) + h * 20.0);
  stars += step(0.985, h) * tw * 0.55;
  float h2 = hash(floor(uv * vec2(70.0, 44.0) + 17.0));
  stars += step(0.993, h2) * 0.9;

  vec4 trail = texture2D(uTrail, uv);
  float smoke = trail.a;
  vec2 texel = 1.0 / uRes;
  smoke += texture2D(uTrail, uv + vec2(texel.x * 2.0, 0.0)).a * 0.35;
  smoke += texture2D(uTrail, uv - vec2(texel.x * 2.0, 0.0)).a * 0.35;
  smoke += texture2D(uTrail, uv + vec2(0.0, texel.y * 2.0)).a * 0.35;
  smoke += texture2D(uTrail, uv - vec2(0.0, texel.y * 2.0)).a * 0.35;
  smoke *= 0.42;
  smoke = pow(clamp(smoke, 0.0, 1.0), 0.85);

  float mark = texture2D(uMark, vec2(uv.x, 1.0 - uv.y)).r;
  float markGlow = mark * (0.18 + 0.1 * n2);

  vec2 mp = (uv - uMouse) * aspect;
  float cursor = exp(-dot(mp, mp) * 18.0) * 0.07;

  float g = nebula + stars + smoke * 0.95 + markGlow + cursor;
  float vig = smoothstep(1.35, 0.18, length(p));
  g *= vig;
  g = clamp(g, 0.0, 1.0);

  float grain = (hash(uv * uRes + t * 60.0) - 0.5) * 0.045;
  vec3 col = vec3(g + grain);
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("shader");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) || "compile");
  }
  return sh;
}

function program(gl: WebGLRenderingContext, frag: string) {
  const p = gl.createProgram();
  if (!p) throw new Error("program");
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) || "link");
  }
  return p;
}

function makeTarget(gl: WebGLRenderingContext, w: number, h: number) {
  const tex = gl.createTexture();
  const fb = gl.createFramebuffer();
  if (!tex || !fb) throw new Error("fbo");
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  return { tex, fb, w, h };
}

function makeMarkTexture(gl: WebGLRenderingContext) {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 1024;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, c.width, c.height);
  const family =
    getComputedStyle(document.documentElement).getPropertyValue("--font-be-vietnam").trim() ||
    '"Be Vietnam Pro", sans-serif';
  ctx.fillStyle = "#fff";
  ctx.font = `600 420px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#fff";
  ctx.shadowBlur = 48;
  ctx.fillText("Vết", c.width / 2, c.height * 0.46);
  const tex = gl.createTexture();
  if (!tex) throw new Error("mark");
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  return tex;
}

export function SpaceField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    let trailProg: WebGLProgram;
    let sceneProg: WebGLProgram;
    let mark: WebGLTexture;
    try {
      trailProg = program(gl, TRAIL_FRAG);
      sceneProg = program(gl, SCENE_FRAG);
      mark = makeMarkTexture(gl);
    } catch {
      return;
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const mouse = { x: 0.5, y: 0.5, dx: 0, dy: 0, force: 0 };
    const loc = { x: 0.5, y: 0.5 };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / Math.max(r.width, 1);
      const y = 1 - (e.clientY - r.top) / Math.max(r.height, 1);
      mouse.dx += x - loc.x;
      mouse.dy += y - loc.y;
      loc.x = x;
      loc.y = y;
      mouse.x = x;
      mouse.y = y;
      mouse.force = Math.min(1.2, mouse.force + 0.35);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let ping = makeTarget(gl, 4, 4);
    let pong = makeTarget(gl, 4, 4);
    let writePing = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, reduce ? 1 : 1.5);
      const w = Math.max(2, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(2, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const tw = Math.max(32, Math.floor(w * 0.45));
      const th = Math.max(32, Math.floor(h * 0.45));
      if (ping.w !== tw || ping.h !== th) {
        ping = makeTarget(gl, tw, th);
        pong = makeTarget(gl, tw, th);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const trailPos = gl.getAttribLocation(trailProg, "aPos");
    const scenePos = gl.getAttribLocation(sceneProg, "aPos");
    const tPrev = gl.getUniformLocation(trailProg, "uPrev");
    const tMark = gl.getUniformLocation(trailProg, "uMark");
    const tMouse = gl.getUniformLocation(trailProg, "uMouse");
    const tDelta = gl.getUniformLocation(trailProg, "uDelta");
    const tRes = gl.getUniformLocation(trailProg, "uRes");
    const tDecay = gl.getUniformLocation(trailProg, "uDecay");
    const tForce = gl.getUniformLocation(trailProg, "uForce");
    const tTime = gl.getUniformLocation(trailProg, "uTime");
    const tEmit = gl.getUniformLocation(trailProg, "uEmit");
    const sTrail = gl.getUniformLocation(sceneProg, "uTrail");
    const sMark = gl.getUniformLocation(sceneProg, "uMark");
    const sRes = gl.getUniformLocation(sceneProg, "uRes");
    const sMouse = gl.getUniformLocation(sceneProg, "uMouse");
    const sTime = gl.getUniformLocation(sceneProg, "uTime");
    const sReduce = gl.getUniformLocation(sceneProg, "uReduce");
    const start = performance.now();
    let raf = 0;
    let alive = true;

    const bindQuad = (prog: WebGLProgram, locPos: number) => {
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(locPos);
      gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);
    };

    const frame = (now: number) => {
      if (!alive) return;
      resize();
      const t = (now - start) / 1000;
      const src = writePing ? ping : pong;
      const dst = writePing ? pong : ping;

      gl.viewport(0, 0, dst.w, dst.h);
      bindQuad(trailProg, trailPos);
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, src.tex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, mark);
      gl.uniform1i(tPrev, 0);
      gl.uniform1i(tMark, 1);
      gl.uniform2f(tMouse, mouse.x, mouse.y);
      gl.uniform2f(tDelta, mouse.dx, mouse.dy);
      gl.uniform2f(tRes, dst.w, dst.h);
      gl.uniform1f(tDecay, reduce ? 0.92 : 0.975);
      gl.uniform1f(tForce, mouse.force);
      gl.uniform1f(tTime, t);
      gl.uniform1f(tEmit, reduce ? 0.012 : 0.022);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      bindQuad(sceneProg, scenePos);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dst.tex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, mark);
      gl.uniform1i(sTrail, 0);
      gl.uniform1i(sMark, 1);
      gl.uniform2f(sRes, canvas.width, canvas.height);
      gl.uniform2f(sMouse, mouse.x, mouse.y);
      gl.uniform1f(sTime, t);
      gl.uniform1f(sReduce, reduce ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      mouse.dx *= 0.86;
      mouse.dy *= 0.86;
      mouse.force *= 0.9;
      writePing = !writePing;

      if (!reduce) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="space-field" aria-hidden />;
}
