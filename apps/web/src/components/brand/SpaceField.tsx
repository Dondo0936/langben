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
  vec2 advected = clamp(vUv - vel * vec2(0.018, 0.018 * uRes.x / max(uRes.y, 1.0)), 0.0, 1.0);
  vec4 adv = texture2D(uPrev, advected);
  float dens = adv.a * uDecay;
  vec2 aspect = vec2(uRes.x / max(uRes.y, 1.0), 1.0);
  vec2 p = (vUv - uMouse) * aspect;
  float d = length(p);
  float splat = exp(-d * d * 220.0) * uForce * 0.35;
  dens += splat;
  dens = clamp(dens, 0.0, 1.0);
  vel = (vel + uDelta * splat * 14.0) * 0.975;
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
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
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
  float n1 = fbm(p * 1.35 + vec2(t * 0.04, -t * 0.03));
  float n2 = fbm(p * 2.6 - vec2(t * 0.05, t * 0.02) + n1);
  float nebula = pow(smoothstep(0.28, 0.82, n2), 1.6) * 0.10 + n1 * 0.03;

  float stars = 0.0;
  vec2 sp = uv * vec2(220.0, 140.0);
  vec2 si = floor(sp);
  vec2 sf = fract(sp) - 0.5;
  float h = hash(si);
  float tw = 0.4 + 0.6 * sin(t * (1.6 + h * 4.0) + h * 20.0);
  stars += step(0.978, h) * tw * (1.0 - smoothstep(0.0, 0.07, length(sf)));
  vec2 sp2 = uv * vec2(70.0, 44.0) + 17.0;
  float h2 = hash(floor(sp2));
  vec2 sf2 = fract(sp2) - 0.5;
  stars += step(0.992, h2) * 0.9 * (1.0 - smoothstep(0.0, 0.05, length(sf2)));

  vec4 trail = texture2D(uTrail, uv);
  float smoke = trail.a;
  vec2 texel = 1.0 / uRes;
  smoke += texture2D(uTrail, uv + vec2(texel.x * 2.0, 0.0)).a * 0.5;
  smoke += texture2D(uTrail, uv - vec2(texel.x * 2.0, 0.0)).a * 0.5;
  smoke += texture2D(uTrail, uv + vec2(0.0, texel.y * 2.0)).a * 0.5;
  smoke += texture2D(uTrail, uv - vec2(0.0, texel.y * 2.0)).a * 0.5;
  smoke += texture2D(uTrail, uv + texel * 3.0).a * 0.28;
  smoke += texture2D(uTrail, uv - texel * 3.0).a * 0.28;
  smoke = pow(clamp(smoke * 0.22, 0.0, 1.0), 0.95);

  float mark = texture2D(uMark, vec2(uv.x, 1.0 - uv.y)).r;
  float markGlow = mark * (0.045 + 0.025 * n2);
  vec2 mp = (uv - uMouse) * aspect;
  float cursor = exp(-dot(mp, mp) * 28.0) * 0.03;
  float g = nebula + stars * 0.85 + smoke * 0.42 + markGlow + cursor;
  float vig = smoothstep(1.45, 0.12, length(p));
  g *= vig;
  g = clamp(g, 0.0, 1.0);
  float grain = (hash(uv * uRes + t * 40.0) - 0.5) * 0.03;
  gl_FragColor = vec4(vec3(g + grain), 1.0);
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
  ctx.font = `600 240px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#fff";
  ctx.shadowBlur = 28;
  ctx.fillText("Vết", c.width / 2, c.height * 0.48);
  const tex = gl.createTexture();
  if (!tex) throw new Error("mark");
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  return tex;
}

type Star = { x: number; y: number; r: number; ph: number; sp: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number };

function fitCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const cssW = Math.max(2, canvas.clientWidth);
  const cssH = Math.max(2, canvas.clientHeight);
  const w = Math.min(1920, Math.floor(cssW * dpr));
  const h = Math.min(1080, Math.floor(cssH * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  return { w, h, dpr };
}

function run2d(canvas: HTMLCanvasElement, reduce: boolean, overlay = false) {
  const ctx = canvas.getContext("2d", { alpha: overlay });
  if (!ctx) return () => undefined;
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  const stars: Star[] = Array.from({ length: overlay ? 120 : 180 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.4 + 0.3,
    ph: Math.random() * Math.PI * 2,
    sp: 0.4 + Math.random() * 1.8,
  }));
  const sparks: Spark[] = [];
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    mouse.tx = (e.clientX - r.left) / Math.max(r.width, 1);
    mouse.ty = (e.clientY - r.top) / Math.max(r.height, 1);
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  const start = performance.now();
  let raf = 0;
  let alive = true;

  const frame = (now: number) => {
    if (!alive) return;
    const { w, h } = fitCanvas(canvas);
    const t = (now - start) / 1000;
    mouse.x += (mouse.tx - mouse.x) * 0.12;
    mouse.y += (mouse.ty - mouse.y) * 0.12;
    const mx = mouse.x * w;
    const my = mouse.y * h;
    const dx = mouse.tx - mouse.x;
    const dy = mouse.ty - mouse.y;
    const force = Math.min(1.4, Math.hypot(dx, dy) * 18);

    if (overlay) {
      ctx.clearRect(0, 0, w, h);
    } else {
      ctx.fillStyle = reduce ? "#000" : "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, w, h);
      const nebula = ctx.createRadialGradient(w * (0.35 + Math.sin(t * 0.12) * 0.08), h * 0.4, 0, w * 0.4, h * 0.45, w * 0.55);
      nebula.addColorStop(0, "rgba(240,240,250,0.10)");
      nebula.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, w, h);
      const nebula2 = ctx.createRadialGradient(w * (0.72 + Math.cos(t * 0.09) * 0.06), h * 0.7, 0, w * 0.7, h * 0.7, w * 0.42);
      nebula2.addColorStop(0, "rgba(240,240,250,0.07)");
      nebula2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, w, h);
    }

    if (!overlay) {
      ctx.fillStyle = "#f0f0fa";
      for (const s of stars) {
        const a = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph));
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    if (!reduce && !overlay && force > 0.02) {
      for (let i = 0; i < 4; i++) {
        sparks.push({
          x: mx,
          y: my,
          vx: dx * w * 2 + (Math.random() - 0.5) * 18,
          vy: dy * h * 2 + (Math.random() - 0.5) * 18,
          life: 1,
        });
      }
    }
    if (sparks.length > 420) sparks.splice(0, sparks.length - 420);
    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      p.x += p.vx * 0.016;
      p.y += p.vy * 0.016;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= 0.012;
      if (p.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = p.life * (overlay ? 0.22 : 0.55);
      ctx.fillStyle = "#f0f0fa";
      ctx.beginPath();
      ctx.arc(p.x, p.y, (overlay ? 3 : 7) * p.life + 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const glowR = overlay ? 48 : 90;
    const glow = ctx.createRadialGradient(mx, my, 0, mx, my, glowR);
    glow.addColorStop(0, overlay ? "rgba(240,240,250,0.03)" : "rgba(240,240,250,0.07)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(mx - glowR, my - glowR, glowR * 2, glowR * 2);

    if (!overlay) {
      ctx.save();
      ctx.globalAlpha = 0.07 + 0.03 * Math.sin(t * 0.7);
      ctx.fillStyle = "#f0f0fa";
      ctx.font = `600 ${Math.floor(h * 0.22)}px ${getComputedStyle(document.documentElement).getPropertyValue("--font-be-vietnam") || "sans-serif"}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Vết", w / 2, h * 0.46);
      ctx.restore();
    }

    if (!reduce) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
  };
}

function runWebgl(canvas: HTMLCanvasElement, reduce: boolean) {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance",
  });
  if (!gl) throw new Error("webgl");
  const trailProg = program(gl, TRAIL_FRAG);
  const sceneProg = program(gl, SCENE_FRAG);
  const mark = makeMarkTexture(gl);
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const mouse = { x: 0.5, y: 0.5, dx: 0, dy: 0, force: 0.015 };
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
    mouse.force = Math.min(1.1, mouse.force + 0.28);
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  let ping = makeTarget(gl, 4, 4);
  let pong = makeTarget(gl, 4, 4);
  let writePing = true;
  const trailPos = gl.getAttribLocation(trailProg, "aPos");
  const scenePos = gl.getAttribLocation(sceneProg, "aPos");
  const u = {
    tPrev: gl.getUniformLocation(trailProg, "uPrev"),
    tMark: gl.getUniformLocation(trailProg, "uMark"),
    tMouse: gl.getUniformLocation(trailProg, "uMouse"),
    tDelta: gl.getUniformLocation(trailProg, "uDelta"),
    tRes: gl.getUniformLocation(trailProg, "uRes"),
    tDecay: gl.getUniformLocation(trailProg, "uDecay"),
    tForce: gl.getUniformLocation(trailProg, "uForce"),
    tTime: gl.getUniformLocation(trailProg, "uTime"),
    tEmit: gl.getUniformLocation(trailProg, "uEmit"),
    sTrail: gl.getUniformLocation(sceneProg, "uTrail"),
    sMark: gl.getUniformLocation(sceneProg, "uMark"),
    sRes: gl.getUniformLocation(sceneProg, "uRes"),
    sMouse: gl.getUniformLocation(sceneProg, "uMouse"),
    sTime: gl.getUniformLocation(sceneProg, "uTime"),
    sReduce: gl.getUniformLocation(sceneProg, "uReduce"),
  };
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
    const { w, h } = fitCanvas(canvas);
    const tw = Math.max(32, Math.floor(w * 0.9));
    const th = Math.max(32, Math.floor(h * 0.9));
    if (ping.w !== tw || ping.h !== th) {
      ping = makeTarget(gl, tw, th);
      pong = makeTarget(gl, tw, th);
    }
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
    gl.uniform1i(u.tPrev, 0);
    gl.uniform1i(u.tMark, 1);
    gl.uniform2f(u.tMouse, mouse.x, mouse.y);
    gl.uniform2f(u.tDelta, mouse.dx, mouse.dy);
    gl.uniform2f(u.tRes, dst.w, dst.h);
    gl.uniform1f(u.tDecay, reduce ? 0.88 : 0.94);
    gl.uniform1f(u.tForce, Math.max(0.02, mouse.force));
    gl.uniform1f(u.tTime, t);
    gl.uniform1f(u.tEmit, reduce ? 0.004 : 0.007);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, w, h);
    bindQuad(sceneProg, scenePos);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, dst.tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, mark);
    gl.uniform1i(u.sTrail, 0);
    gl.uniform1i(u.sMark, 1);
    gl.uniform2f(u.sRes, w, h);
    gl.uniform2f(u.sMouse, mouse.x, mouse.y);
    gl.uniform1f(u.sTime, t);
    gl.uniform1f(u.sReduce, reduce ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    mouse.dx *= 0.86;
    mouse.dy *= 0.86;
    mouse.force *= 0.92;
    writePing = !writePing;
    if (!reduce) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
  };
}

export function SpaceField() {
  const glRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const glCanvas = glRef.current;
    const fxCanvas = fxRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stopGl: (() => void) | undefined;
    if (glCanvas) {
      try {
        stopGl = runWebgl(glCanvas, reduce);
      } catch {
        glCanvas.remove();
      }
    }
    const stopFx = fxCanvas ? run2d(fxCanvas, reduce, Boolean(stopGl)) : undefined;
    return () => {
      stopGl?.();
      stopFx?.();
    };
  }, []);

  return (
    <>
      <canvas ref={glRef} className="space-field" aria-hidden />
      <canvas ref={fxRef} className="space-field space-field-fx" aria-hidden />
    </>
  );
}
