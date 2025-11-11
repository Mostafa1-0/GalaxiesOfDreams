// 3D Space Explorer - Solar System Visualization
let scene, camera, renderer, controls;
let planets = [];
let sun;
let starField;
let orbitSpeed = 1;
let showLabels = true;
let showOrbits = true;
let raycaster, mouse;
let selectedPlanet = null;

// Planet data with realistic properties
const planetData = [
    {
        name: 'Mercury',
        radius: 0.4,
        distance: 8,
        speed: 0.04,
        color: 0x8c7853,
        texture: null,
        info: {
            diameter: '4,879 km',
            distance: '57.9 million km from Sun',
            day: '59 Earth days',
            year: '88 Earth days',
            moons: '0'
        }
    },
    {
        name: 'Venus',
        radius: 0.9,
        distance: 12,
        speed: 0.015,
        color: 0xffc649,
        texture: null,
        info: {
            diameter: '12,104 km',
            distance: '108.2 million km from Sun',
            day: '243 Earth days',
            year: '225 Earth days',
            moons: '0'
        }
    },
    {
        name: 'Earth',
        radius: 1,
        distance: 16,
        speed: 0.01,
        color: 0x4169e1,
        texture: 'Earth.png',
        info: {
            diameter: '12,742 km',
            distance: '149.6 million km from Sun',
            day: '24 hours',
            year: '365.25 days',
            moons: '1 (Moon)'
        }
    },
    {
        name: 'Mars',
        radius: 0.5,
        distance: 20,
        speed: 0.008,
        color: 0xcd5c5c,
        texture: 'Mars03.jpg',
        info: {
            diameter: '6,779 km',
            distance: '227.9 million km from Sun',
            day: '24.6 hours',
            year: '687 Earth days',
            moons: '2 (Phobos, Deimos)'
        }
    },
    {
        name: 'Jupiter',
        radius: 2.5,
        distance: 28,
        speed: 0.002,
        color: 0xdaa520,
        texture: 'jupitur.png',
        info: {
            diameter: '139,820 km',
            distance: '778.5 million km from Sun',
            day: '9.9 hours',
            year: '12 Earth years',
            moons: '79+'
        }
    },
    {
        name: 'Saturn',
        radius: 2.2,
        distance: 36,
        speed: 0.0009,
        color: 0xfad5a5,
        texture: null,
        info: {
            diameter: '116,460 km',
            distance: '1.43 billion km from Sun',
            day: '10.7 hours',
            year: '29 Earth years',
            moons: '82+'
        }
    },
    {
        name: 'Uranus',
        radius: 1.5,
        distance: 44,
        speed: 0.0004,
        color: 0x4fd0e0,
        texture: null,
        info: {
            diameter: '50,724 km',
            distance: '2.87 billion km from Sun',
            day: '17.2 hours',
            year: '84 Earth years',
            moons: '27'
        }
    },
    {
        name: 'Neptune',
        radius: 1.4,
        distance: 52,
        speed: 0.0001,
        color: 0x4169e1,
        texture: 'Neptune.png',
        info: {
            diameter: '49,244 km',
            distance: '4.5 billion km from Sun',
            day: '16 hours',
            year: '165 Earth years',
            moons: '14'
        }
    }
];

// Initialize the 3D scene
function init3DSpace() {
    const canvas = document.getElementById('space-3d-canvas');
    const wrapper = document.getElementById('space-3d-canvas-wrapper');
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        wrapper.clientWidth / wrapper.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 30, 60);
    camera.lookAt(0, 0, 0);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Controls setup
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 150;
    
    // Raycaster for mouse interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const sunLight = new THREE.PointLight(0xffffff, 2, 300);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    
    // Create starfield
    createStarField();
    
    // Create sun
    createSun();
    
    // Create planets
    createPlanets();
    
    // Event listeners
    setupEventListeners();
    
    // Hide loading screen
    document.getElementById('loading-screen').style.display = 'none';
    
    // Start animation
    animate();
}

// Create starfield background
function createStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 400;
        positions[i + 1] = (Math.random() - 0.5) * 400;
        positions[i + 2] = (Math.random() - 0.5) * 400;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8
    });
    
    starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
}

// Create the sun
function createSun() {
    const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xfdb813,
        emissive: 0xfdb813,
        emissiveIntensity: 1
    });
    
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.userData = {
        name: 'Sun',
        info: {
            diameter: '1,392,700 km',
            mass: '1.989 × 10³⁰ kg',
            temperature: '5,778 K (surface)',
            age: '4.6 billion years',
            type: 'G-type main-sequence star'
        }
    };
    scene.add(sun);
    
    // Sun glow effect
    const glowGeometry = new THREE.SphereGeometry(3.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xfdb813,
        transparent: true,
        opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sun.add(glow);
}

// Create planets
function createPlanets() {
    const textureLoader = new THREE.TextureLoader();
    
    planetData.forEach((data, index) => {
        // Planet mesh
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        let material;
        
        if (data.texture) {
            const texture = textureLoader.load(data.texture);
            material = new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 0.8,
                metalness: 0.2
            });
        } else {
            material = new THREE.MeshStandardMaterial({
                color: data.color,
                roughness: 0.8,
                metalness: 0.2
            });
        }
        
        const planet = new THREE.Mesh(geometry, material);
        planet.userData = {
            name: data.name,
            distance: data.distance,
            speed: data.speed,
            angle: Math.random() * Math.PI * 2,
            info: data.info
        };
        
        scene.add(planet);
        planets.push(planet);
        
        // Orbit line
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitPoints = [];
        for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            orbitPoints.push(
                Math.cos(angle) * data.distance,
                0,
                Math.sin(angle) * data.distance
            );
        }
        orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
        
        const orbitMaterial = new THREE.LineBasicMaterial({
            color: 0x3296ff,
            transparent: true,
            opacity: 0.3
        });
        
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        orbit.userData.isOrbit = true;
        scene.add(orbit);
        planet.userData.orbit = orbit;
        
        // Add Saturn's rings
        if (data.name === 'Saturn') {
            const ringGeometry = new THREE.RingGeometry(data.radius * 1.5, data.radius * 2.5, 64);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xc9b181,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            planet.add(ring);
        }
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate sun
    if (sun) {
        sun.rotation.y += 0.001;
    }
    
    // Update planet positions
    planets.forEach(planet => {
        const userData = planet.userData;
        userData.angle += userData.speed * orbitSpeed * 0.01;
        
        planet.position.x = Math.cos(userData.angle) * userData.distance;
        planet.position.z = Math.sin(userData.angle) * userData.distance;
        
        // Rotate planet
        planet.rotation.y += 0.01;
        
        // Update orbit visibility
        if (userData.orbit) {
            userData.orbit.visible = showOrbits;
        }
    });
    
    // Slowly rotate starfield
    if (starField) {
        starField.rotation.y += 0.0001;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

// Setup event listeners
function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', onWindowResize);
    
    // Mouse click for planet selection
    renderer.domElement.addEventListener('click', onMouseClick);
    
    // Orbit speed control
    const speedSlider = document.getElementById('orbit-speed');
    const speedValue = document.getElementById('speed-value');
    speedSlider.addEventListener('input', (e) => {
        orbitSpeed = parseFloat(e.target.value);
        speedValue.textContent = orbitSpeed.toFixed(1) + 'x';
    });
    
    // Show labels toggle
    document.getElementById('show-labels').addEventListener('change', (e) => {
        showLabels = e.target.checked;
    });
    
    // Show orbits toggle
    document.getElementById('show-orbits').addEventListener('change', (e) => {
        showOrbits = e.target.checked;
    });
    
    // Reset camera button
    document.getElementById('reset-camera').addEventListener('click', () => {
        camera.position.set(0, 30, 60);
        controls.target.set(0, 0, 0);
        controls.update();
    });
    
    // Close planet info
    const closeBtn = document.querySelector('.planet-info .close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('planet-info').style.display = 'none';
        });
    }
}

// Handle window resize
function onWindowResize() {
    const wrapper = document.getElementById('space-3d-canvas-wrapper');
    camera.aspect = wrapper.clientWidth / wrapper.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
}

// Handle mouse click for planet selection
function onMouseClick(event) {
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    const allObjects = [sun, ...planets];
    const intersects = raycaster.intersectObjects(allObjects);
    
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        showPlanetInfo(clickedObject);
    }
}

// Show planet information panel
function showPlanetInfo(planet) {
    const infoPanel = document.getElementById('planet-info');
    const nameElement = document.getElementById('planet-name');
    const detailsElement = document.getElementById('planet-details');
    
    nameElement.textContent = planet.userData.name;
    
    let detailsHTML = '<div class="planet-info-grid">';
    for (const [key, value] of Object.entries(planet.userData.info)) {
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        detailsHTML += `
            <div class="info-row">
                <span class="info-label">${label}:</span>
                <span class="info-value">${value}</span>
            </div>
        `;
    }
    detailsHTML += '</div>';
    
    detailsElement.innerHTML = detailsHTML;
    infoPanel.style.display = 'block';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a page with the 3D canvas
    if (document.getElementById('space-3d-canvas')) {
        init3DSpace();
    }
});
