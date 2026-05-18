import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { motion } from 'framer-motion'
import { useStore } from '@/store'

interface SummerAnimationProps {
  isPlaying: boolean
  animationSpeed: number
  cameraAngle: number
}

export function SummerAnimation({
  isPlaying,
  animationSpeed,
  cameraAngle
}: SummerAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const animationIdRef = useRef<number | null>(null)

  // Water shader material
  const waterMaterialRef = useRef<THREE.ShaderMaterial | null>(null)

  // Tree animation system
  const treeGroupRef = useRef<THREE.Group>(new THREE.Group())
  const windTimeRef = useRef(0)
  const windStrengthRef = useRef(0.5)
  const windFrequencyRef = useRef(0.5)

  // Character animation system
  const characterGroupRef = useRef<THREE.Group>(new THREE.Group())
  const characterTimeRef = useRef(0)
  const characterSpeedRef = useRef(0.3)

  // Accessibility: Add ARIA attributes
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup with Pixar-like lighting
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87CEEB)
    scene.fog = new THREE.Fog(0x87CEEB, 1, 20)
    sceneRef.current = scene

    // Camera setup with cinematic perspective
    const camera = new THREE.PerspectiveCamera(50, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000)
    camera.position.set(0, 5, 15)
    cameraRef.current = camera

    // Renderer setup with high quality settings
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Accessibility: Add ARIA attributes to canvas
    renderer.domElement.setAttribute('role', 'img')
    renderer.domElement.setAttribute('aria-label', 'Summer beach scene with animated characters')
    canvasRef.current = renderer.domElement

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controlsRef.current = controls

    // Lighting with golden hour effect
    const ambientLight = new THREE.AmbientLight(0xFFD700, 0.3)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xFFD700, 0.8)
    directionalLight.position.set(10, 20, 10)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Soft light for ambient
    const hemisphereLight = new THREE.HemisphereLight(0xFFD700, 0x001122, 0.2)
    scene.add(hemisphereLight)

    // Water shader material with realistic waves
    const waterMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() },
        uColor: { value: new THREE.Color(0x4a90e2) },
        uRefraction: { value: 0.02 },
        uReflection: { value: 0.3 }
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec3 newPosition = position;
          newPosition.y += sin(position.x * 2.0 + time * 2.0) * 0.1;
          newPosition.x += cos(position.y * 2.0 + time * 1.5) * 0.1;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uRefraction;
        uniform float uReflection;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          // Golden hour color variation
          vec3 color = uColor * (0.8 + 0.2 * sin(vUv.x * 10.0 + vUv.y * 10.0));

          // Refraction effect
          vec2 refractionUv = vUv + vNormal.xy * uRefraction;
          color.rgb += texture2D(undefined, refractionUv).rgb * uRefraction;

          // Reflection effect
          vec2 reflectionUv = vUv + vNormal.xy * uReflection;
          color.rgb += texture2D(undefined, reflectionUv).rgb * uReflection;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    waterMaterialRef.current = waterMaterial

    // Create palm tree model with realistic textures
    const createPalmTree = () => {
      const treeGroup = new THREE.Group()

      // Trunk with bark texture
      const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 3, 8)
      const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.7,
        bumpScale: 0.01
      })
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
      trunk.position.y = 1.5
      treeGroup.add(trunk)

      // Leaves with realistic texture
      const leafGeometry = new THREE.ConeGeometry(2, 4, 8)
      const leafMaterial = new THREE.MeshStandardMaterial({
        color: 0x32CD32,
        side: THREE.DoubleSide,
        roughness: 0.5,
        metalness: 0.1
      })

      // Create multiple leaf layers
      for (let i = 0; i < 3; i++) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial)
        leaf.position.y = 3 + i * 1.5
        leaf.rotation.x = Math.PI / 2
        leaf.scale.set(0.8 - i * 0.1, 0.8 - i * 0.1, 0.8 - i * 0.1)
        treeGroup.add(leaf)
      }

      return treeGroup
    }

    // Add palm trees to scene
    const tree1 = createPalmTree()
    tree1.position.set(-3, -5, 0)
    treeGroupRef.current.add(tree1)

    const tree2 = createPalmTree()
    tree2.position.set(3, -5, 0)
    treeGroupRef.current.add(tree2)

    scene.add(treeGroupRef.current)

    // Create character models with nostalgic summer colors
    const createCharacter = (type: 'young-couple' | 'family' | 'single') => {
      const characterGroup = new THREE.Group()

      // Base model (simplified for example)
      const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 8)
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: type === 'young-couple' ? 0xFF6B6B : type === 'family' ? 0x4ECDC4 : 0xFFE66D,
        roughness: 0.5
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.y = 0.75
      characterGroup.add(body)

      // Head
      const headGeometry = new THREE.SphereGeometry(0.3, 8, 8)
      const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xF5F5F5,
        roughness: 0.3
      })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.y = 1.8
      characterGroup.add(head)

      // Arms
      const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8)
      const leftArm = new THREE.Mesh(armGeometry, bodyMaterial)
      leftArm.position.set(-0.4, 1.2, 0)
      leftArm.rotation.z = Math.PI / 4
      characterGroup.add(leftArm)

      const rightArm = new THREE.Mesh(armGeometry, bodyMaterial)
      rightArm.position.set(0.4, 1.2, 0)
      rightArm.rotation.z = -Math.PI / 4
      characterGroup.add(rightArm)

      // Legs
      const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 8)
      const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial)
      leftLeg.position.set(-0.2, -0.6, 0)
      characterGroup.add(leftLeg)

      const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial)
      rightLeg.position.set(0.2, -0.6, 0)
      characterGroup.add(rightLeg)

      // Add family members if needed
      if (type === 'family') {
        const child = createCharacter('single')
        child.scale.set(0.7, 0.7, 0.7)
        child.position.set(-1, -1.5, 0)
        characterGroup.add(child)
      }

      return characterGroup
    }

    // Add characters to scene
    const youngCouple = createCharacter('young-couple')
    youngCouple.position.set(-5, -5, 0)
    characterGroupRef.current.add(youngCouple)

    const family = createCharacter('family')
    family.position.set(0, -5, 0)
    characterGroupRef.current.add(family)

    const singlePerson = createCharacter('single')
    singlePerson.position.set(5, -5, 0)
    characterGroupRef.current.add(singlePerson)

    scene.add(characterGroupRef.current)

    // Load beach scene model
    const loader = new GLTFLoader()
    loader.load(
      '/models/beach-scene.glb',
      (gltf) => {
        modelRef.current = gltf.scene
        modelRef.current.scale.set(10, 10, 10)
        modelRef.current.position.y = -5
        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
            // Apply water shader to water objects
            if (child.name.includes('Water')) {
              child.material = waterMaterial
            }
          }
        })
        scene.add(modelRef.current)
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error)
      }
    )

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    // Animation loop with emotional summer vibes
    const animate = () => {
      if (!isPlaying) {
        animationIdRef.current = requestAnimationFrame(animate)
        return
      }

      if (controlsRef.current) controlsRef.current.update()

      // Update water shader time
      if (waterMaterialRef.current) {
        waterMaterialRef.current.uniforms.time.value += 0.01 * animationSpeed
      }

      // Animate palm trees
      windTimeRef.current += 0.01
      treeGroupRef.current.children.forEach((tree, index) => {
        if (tree instanceof THREE.Group) {
          // Animate leaves
          tree.children.forEach((child, childIndex) => {
            if (childIndex > 0) { // Skip trunk
              child.rotation.z = Math.sin(windTimeRef.current * windFrequencyRef.current + index) * windStrengthRef.current * (1 + index * 0.2)
              child.rotation.x = Math.cos(windTimeRef.current * windFrequencyRef.current * 0.7 + index) * windStrengthRef.current * 0.3
            }
          })

          // Subtle trunk movement
          tree.children[0].rotation.z = Math.sin(windTimeRef.current * 0.3) * 0.02
        }
      })

      // Animate characters
      characterTimeRef.current += 0.01
      characterGroupRef.current.children.forEach((character, index) => {
        if (character instanceof THREE.Group) {
          // Walking animation
          const walkCycle = Math.sin(characterTimeRef.current * characterSpeedRef.current + index)
          const walkHeight = Math.abs(walkCycle) * 0.2

          // Legs
          character.children[4].rotation.x = walkCycle * 0.5
          character.children[5].rotation.x = -walkCycle * 0.5

          // Arms
          character.children[2].rotation.z = Math.PI / 4 + walkCycle * 0.2
          character.children[3].rotation.z = -Math.PI / 4 - walkCycle * 0.2

          // Body movement
          character.position.z = walkCycle * 0.3
          character.position.y = -5 + walkHeight

          // Head tilt
          character.children[1].rotation.x = walkCycle * 0.1
        }
      })

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!controlsRef.current) return

      switch(e.key) {
        case 'ArrowUp':
          controlsRef.current.dollyIn(1.1)
          break
        case 'ArrowDown':
          controlsRef.current.dollyOut(1.1)
          break
        case 'ArrowLeft':
          controlsRef.current.rotateLeft(0.1)
          break
        case 'ArrowRight':
          controlsRef.current.rotateRight(0.1)
          break
        case 'w':
          controlsRef.current.moveUp(0.5)
          break
        case 's':
          controlsRef.current.moveDown(0.5)
          break
        case 'a':
          controlsRef.current.moveLeft(0.5)
          break
        case 'd':
          controlsRef.current.moveRight(0.5)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyDown)
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement)
      }
    }
  }, [])

  // Update animation speed when prop changes
  useEffect(() => {
    if (waterMaterialRef.current) {
      waterMaterialRef.current.uniforms.time.value += 0.01 * animationSpeed
    }
  }, [animationSpeed])

  // Update camera angle when prop changes
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.x = Math.sin(cameraAngle * Math.PI / 180) * 15
      cameraRef.current.position.z = Math.cos(cameraAngle * Math.PI / 180) * 15
      cameraRef.current.lookAt(0, 0, 0)
    }
  }, [cameraAngle])

  return (
    <motion.div
      ref={mountRef}
      className="w-full h-[600px] rounded-2xl overflow-hidden glass-card border border-[var(--glass-border)] shadow-lg"
      role="application"
      aria-label="Interactive summer beach scene with animated characters"
      tabIndex={0}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    />
  )
}