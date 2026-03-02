/**
 * WebGL 热力图渲染优化
 * 为大规模数据提供硬件加速渲染
 */

import { ref, onBeforeUnmount } from 'vue'

export function useHeatmapWebGL() {
  const isWebGLSupported = ref(false)
  const gl = ref(null)
  const programs = ref({})
  const buffers = ref({})
  const textures = ref({})

  // 顶点着色器 - 标准2D渲染
  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    
    uniform vec2 u_resolution;
    uniform vec2 u_offset;
    uniform float u_scale;
    
    varying vec2 v_texCoord;
    
    void main() {
      vec2 clipSpace = ((a_position * u_scale + u_offset) / u_resolution) * 2.0 - 1.0;
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      v_texCoord = a_texCoord;
    }
  `

  // 片段着色器 - 热力图渲染 + 颜色映射
  const fragmentShaderSource = `
    precision highp float;
    
    varying vec2 v_texCoord;
    
    uniform sampler2D u_dataTexture;
    uniform sampler2D u_colorTexture;
    
    uniform float u_minValue;
    uniform float u_maxValue;
    uniform float u_noDataValue;
    uniform bool u_showGrid;
    uniform float u_gridScale;
    
    void main() {
      float value = texture2D(u_dataTexture, v_texCoord).r;
      
      // 处理无数据值
      if (value == u_noDataValue || isnan(value)) {
        gl_FragColor = vec4(0.95, 0.95, 0.95, 1.0);
        return;
      }
      
      // 归一化
      float t = clamp((value - u_minValue) / (u_maxValue - u_minValue), 0.0, 1.0);
      
      // 从颜色查找表中获取颜色
      vec4 color = texture2D(u_colorTexture, vec2(t, 0.5));
      
      // 添加网格线
      if (u_showGrid) {
        vec2 gridPos = fract(v_texCoord * u_gridScale);
        float gridLine = step(0.98, gridPos.x) + step(0.98, gridPos.y);
        color = mix(color, vec4(0.0, 0.0, 0.0, 0.2), gridLine * 0.3);
      }
      
      gl_FragColor = color;
    }
  `

  /**
   * 初始化 WebGL 上下文
   */
  function initWebGL(canvas) {
    const context = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      preserveDrawingBuffer: true
    }) || canvas.getContext('experimental-webgl')

    if (!context) {
      console.warn('WebGL not supported, falling back to Canvas 2D')
      isWebGLSupported.value = false
      return false
    }

    gl.value = context
    isWebGLSupported.value = true

    // 创建着色器程序
    programs.value.heatmap = createProgram(vertexShaderSource, fragmentShaderSource)
    
    // 设置 WebGL 状态
    gl.value.enable(gl.value.BLEND)
    gl.value.blendFunc(gl.value.SRC_ALPHA, gl.value.ONE_MINUS_SRC_ALPHA)
    
    return true
  }

  /**
   * 创建着色器
   */
  function createShader(type, source) {
    const shader = gl.value.createShader(type)
    gl.value.shaderSource(shader, source)
    gl.value.compileShader(shader)

    if (!gl.value.getShaderParameter(shader, gl.value.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.value.getShaderInfoLog(shader))
      gl.value.deleteShader(shader)
      return null
    }

    return shader
  }

  /**
   * 创建着色器程序
   */
  function createProgram(vsSource, fsSource) {
    const vertexShader = createShader(gl.value.VERTEX_SHADER, vsSource)
    const fragmentShader = createShader(gl.value.FRAGMENT_SHADER, fsSource)

    const program = gl.value.createProgram()
    gl.value.attachShader(program, vertexShader)
    gl.value.attachShader(program, fragmentShader)
    gl.value.linkProgram(program)

    if (!gl.value.getProgramParameter(program, gl.value.LINK_STATUS)) {
      console.error('Program link error:', gl.value.getProgramInfoLog(program))
      return null
    }

    return {
      program,
      attribLocations: {
        position: gl.value.getAttribLocation(program, 'a_position'),
        texCoord: gl.value.getAttribLocation(program, 'a_texCoord')
      },
      uniformLocations: {
        resolution: gl.value.getUniformLocation(program, 'u_resolution'),
        offset: gl.value.getUniformLocation(program, 'u_offset'),
        scale: gl.value.getUniformLocation(program, 'u_scale'),
        dataTexture: gl.value.getUniformLocation(program, 'u_dataTexture'),
        colorTexture: gl.value.getUniformLocation(program, 'u_colorTexture'),
        minValue: gl.value.getUniformLocation(program, 'u_minValue'),
        maxValue: gl.value.getUniformLocation(program, 'u_maxValue'),
        noDataValue: gl.value.getUniformLocation(program, 'u_noDataValue'),
        showGrid: gl.value.getUniformLocation(program, 'u_showGrid'),
        gridScale: gl.value.getUniformLocation(program, 'u_gridScale')
      }
    }
  }

  /**
   * 创建顶点缓冲区
   */
  function createBuffers(width, height) {
    // 全屏四边形
    const positions = new Float32Array([
      0, 0,
      width, 0,
      0, height,
      0, height,
      width, 0,
      width, height
    ])

    const texCoords = new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      0, 1,
      1, 0,
      1, 1
    ])

    const positionBuffer = gl.value.createBuffer()
    gl.value.bindBuffer(gl.value.ARRAY_BUFFER, positionBuffer)
    gl.value.bufferData(gl.value.ARRAY_BUFFER, positions, gl.value.STATIC_DRAW)

    const texCoordBuffer = gl.value.createBuffer()
    gl.value.bindBuffer(gl.value.ARRAY_BUFFER, texCoordBuffer)
    gl.value.bufferData(gl.value.ARRAY_BUFFER, texCoords, gl.value.STATIC_DRAW)

    buffers.value = { position: positionBuffer, texCoord: texCoordBuffer }
  }

  /**
   * 创建数据纹理
   */
  function createDataTexture(matrix, noDataValue = -9999) {
    const rows = matrix.length
    const cols = matrix[0]?.length || 0

    // 创建 Float32Array 存储数据
    const data = new Float32Array(rows * cols)
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const value = matrix[row]?.[col]
        data[row * cols + col] = Number.isFinite(value) ? value : noDataValue
      }
    }

    const texture = gl.value.createTexture()
    gl.value.bindTexture(gl.value.TEXTURE_2D, texture)
    gl.value.texImage2D(
      gl.value.TEXTURE_2D,
      0,
      gl.value.LUMINANCE,
      cols,
      rows,
      0,
      gl.value.LUMINANCE,
      gl.value.FLOAT,
      data
    )

    // 设置纹理参数
    gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_MIN_FILTER, gl.value.NEAREST)
    gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_MAG_FILTER, gl.value.NEAREST)
    gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_WRAP_S, gl.value.CLAMP_TO_EDGE)
    gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_WRAP_T, gl.value.CLAMP_TO_EDGE)

    textures.value.data = texture
    return texture
  }

  /**
   * 创建颜色查找表纹理
   */
  function createColorTexture(colors) {
    const width = 256
    const height = 1
    const data = new Uint8Array(width * 4)

    for (let i = 0; i < width; i++) {
      const t = i / (width - 1)
      const color = getColorAt(t, colors)
      data[i * 4] = color.r
      data[i * 4 + 1] = color.g
      data[i * 4 + 2] = color.b
      data[i * 4 + 3] = 255
    }

    const texture = gl.value.createTexture()
    gl.value.bindTexture(gl.value.TEXTURE_2D, texture)
    gl.value.texImage2D(
      gl.value.TEXTURE_2D,
      0,
      gl.value.RGBA,
      width,
      height,
      0,
      gl.value.RGBA,
      gl.value.UNSIGNED_BYTE,
      data
    )

    gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_MIN_FILTER, gl.value.LINEAR)
    gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_MAG_FILTER, gl.value.LINEAR)

    textures.value.color = texture
    return texture
  }

  /**
   * 从颜色数组中获取指定位置的颜色
   */
  function getColorAt(t, colors) {
    const idx = t * (colors.length - 1)
    const lower = Math.floor(idx)
    const upper = Math.ceil(idx)
    const frac = idx - lower

    const c1 = hexToRgb(colors[lower] || colors[0])
    const c2 = hexToRgb(colors[upper] || colors[colors.length - 1])

    const smoothT = frac * frac * (3 - 2 * frac)

    return {
      r: Math.round(c1.r + (c2.r - c1.r) * smoothT),
      g: Math.round(c1.g + (c2.g - c1.g) * smoothT),
      b: Math.round(c1.b + (c2.b - c1.b) * smoothT)
    }
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 128, g: 128, b: 128 }
  }

  /**
   * 渲染热力图
   */
  function render(config) {
    const { 
      width, 
      height, 
      offsetX, 
      offsetY, 
      scale, 
      minValue, 
      maxValue,
      showGrid,
      gridScale
    } = config

    if (!gl.value || !programs.value.heatmap) return

    gl.value.viewport(0, 0, width, height)
    gl.value.clearColor(0.95, 0.95, 0.95, 1)
    gl.value.clear(gl.value.COLOR_BUFFER_BIT)

    const prog = programs.value.heatmap
    gl.value.useProgram(prog.program)

    // 设置属性
    gl.value.bindBuffer(gl.value.ARRAY_BUFFER, buffers.value.position)
    gl.value.enableVertexAttribArray(prog.attribLocations.position)
    gl.value.vertexAttribPointer(prog.attribLocations.position, 2, gl.value.FLOAT, false, 0, 0)

    gl.value.bindBuffer(gl.value.ARRAY_BUFFER, buffers.value.texCoord)
    gl.value.enableVertexAttribArray(prog.attribLocations.texCoord)
    gl.value.vertexAttribPointer(prog.attribLocations.texCoord, 2, gl.value.FLOAT, false, 0, 0)

    // 设置 uniform
    gl.value.uniform2f(prog.uniformLocations.resolution, width, height)
    gl.value.uniform2f(prog.uniformLocations.offset, offsetX, offsetY)
    gl.value.uniform1f(prog.uniformLocations.scale, scale)
    gl.value.uniform1f(prog.uniformLocations.minValue, minValue)
    gl.value.uniform1f(prog.uniformLocations.maxValue, maxValue)
    gl.value.uniform1f(prog.uniformLocations.noDataValue, -9999)
    gl.value.uniform1i(prog.uniformLocations.showGrid, showGrid ? 1 : 0)
    gl.value.uniform1f(prog.uniformLocations.gridScale, gridScale || 10)

    // 绑定纹理
    gl.value.activeTexture(gl.value.TEXTURE0)
    gl.value.bindTexture(gl.value.TEXTURE_2D, textures.value.data)
    gl.value.uniform1i(prog.uniformLocations.dataTexture, 0)

    gl.value.activeTexture(gl.value.TEXTURE1)
    gl.value.bindTexture(gl.value.TEXTURE_2D, textures.value.color)
    gl.value.uniform1i(prog.uniformLocations.colorTexture, 1)

    // 绘制
    gl.value.drawArrays(gl.value.TRIANGLES, 0, 6)
  }

  /**
   * 清理资源
   */
  function cleanup() {
    if (!gl.value) return

    // 删除缓冲区
    Object.values(buffers.value).forEach(buffer => {
      gl.value.deleteBuffer(buffer)
    })

    // 删除纹理
    Object.values(textures.value).forEach(texture => {
      gl.value.deleteTexture(texture)
    })

    // 删除程序
    Object.values(programs.value).forEach(prog => {
      gl.value.deleteProgram(prog.program)
    })

    buffers.value = {}
    textures.value = {}
    programs.value = {}
  }

  onBeforeUnmount(cleanup)

  return {
    isWebGLSupported,
    initWebGL,
    createBuffers,
    createDataTexture,
    createColorTexture,
    render,
    cleanup
  }
}
