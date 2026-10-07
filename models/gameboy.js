const createGameboy = () => {
    const gameboyGroup = new THREE.Group();

    // Palette
    const colors = {
        shell: new THREE.Color(0xd9d9d1),
        bezel: new THREE.Color(0x707070),
        screen: new THREE.Color(0x9bbc0f),
        screenDark: new THREE.Color(0x8bac0f),
        dpad: new THREE.Color(0x333333),
        buttonAB: new THREE.Color(0xa93659),
        startSelect: new THREE.Color(0x999999),
        textBlue: new THREE.Color(0x302080),
        accents: new THREE.Color(0x555555)
    };

    // Materials
    const shellMat = new THREE.MeshPhysicalMaterial({
        color: colors.shell,
        roughness: 0.6,
        metalness: 0.05,
        clearcoat: 0.1
    });

    const screenMat = new THREE.MeshPhysicalMaterial({
        color: colors.screen,
        emissive: colors.screen,
        emissiveIntensity: 0.2,
        roughness: 0.1,
        metalness: 0.1
    });

    const bezelMat = new THREE.MeshPhysicalMaterial({
        color: colors.bezel,
        roughness: 0.3,
        metalness: 0.2
    });

    const buttonMat = new THREE.MeshPhysicalMaterial({
        color: colors.buttonAB,
        roughness: 0.4,
        metalness: 0.1
    });

    const dpadMat = new THREE.MeshPhysicalMaterial({
        color: colors.dpad,
        roughness: 0.8
    });

    const rubberMat = new THREE.MeshPhysicalMaterial({
        color: colors.startSelect,
        roughness: 0.9
    });

    // 1. Main Shell - Custom Shape Extrusion for rounded corners and the "chin"
    const shellWidth = 4.0;
    const shellHeight = 6.5;
    const shellDepth = 1.2;
    const radius = 0.3;

    const shellShape = new THREE.Shape();
    shellShape.moveTo(-shellWidth / 2 + radius, -shellHeight / 2);
    shellShape.lineTo(shellWidth / 2 - radius * 2, -shellHeight / 2); // Bottom right "cut" slant
    shellShape.quadraticCurveTo(shellWidth / 2, -shellHeight / 2, shellWidth / 2, -shellHeight / 2 + radius * 2);
    shellShape.lineTo(shellWidth / 2, shellHeight / 2 - radius);
    shellShape.quadraticCurveTo(shellWidth / 2, shellHeight / 2, shellWidth / 2 - radius, shellHeight / 2);
    shellShape.lineTo(-shellWidth / 2 + radius, shellHeight / 2);
    shellShape.quadraticCurveTo(-shellWidth / 2, shellHeight / 2, -shellWidth / 2, shellHeight / 2 - radius);
    shellShape.lineTo(-shellWidth / 2, -shellHeight / 2 + radius);
    shellShape.quadraticCurveTo(-shellWidth / 2, -shellHeight / 2, -shellWidth / 2 + radius, -shellHeight / 2);

    const extrudeSettings = { depth: shellDepth, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 5 };
    const shellGeo = new THREE.ExtrudeGeometry(shellShape, extrudeSettings);
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    shellMesh.position.z = -shellDepth / 2;
    gameboyGroup.add(shellMesh);

    // 2. Screen Bezel
    const bezelWidth = 3.4;
    const bezelHeight = 2.8;
    const bezelShape = new THREE.Shape();
    bezelShape.moveTo(-bezelWidth / 2 + 0.1, -bezelHeight / 2);
    bezelShape.lineTo(bezelWidth / 2 - 0.1, -bezelHeight / 2);
    bezelShape.quadraticCurveTo(bezelWidth / 2, -bezelHeight / 2, bezelWidth / 2, -bezelHeight / 2 + 0.1);
    bezelShape.lineTo(bezelWidth / 2, bezelHeight / 2 - 0.1);
    bezelShape.quadraticCurveTo(bezelWidth / 2, bezelHeight / 2, bezelWidth / 2 - 0.1, bezelHeight / 2);
    bezelShape.lineTo(-bezelWidth / 2 + 0.1, bezelHeight / 2);
    bezelShape.quadraticCurveTo(-bezelWidth / 2, bezelHeight / 2, -bezelWidth / 2, bezelHeight / 2 - 0.1);
    bezelShape.lineTo(-bezelWidth / 2, -bezelHeight / 2 + 0.1);
    bezelShape.quadraticCurveTo(-bezelWidth / 2, -bezelHeight / 2, -bezelWidth / 2 + 0.1, -bezelHeight / 2);

    const bezelExtrude = new THREE.ExtrudeGeometry(bezelShape, { depth: 0.05, bevelEnabled: false });
    const bezelMesh = new THREE.Mesh(bezelExtrude, bezelMat);
    bezelMesh.position.set(0, 1.3, 0.58);
    gameboyGroup.add(bezelMesh);

    // 3. LCD Screen Panel
    const lcdGeo = new THREE.PlaneGeometry(2.2, 2.0);
    const lcdMesh = new THREE.Mesh(lcdGeo, screenMat);
    lcdMesh.position.set(0, 1.4, 0.64);
    gameboyGroup.add(lcdMesh);

    // Screen Glass Layer
    const glassGeo = new THREE.PlaneGeometry(3.3, 2.7);
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xffffff),
        transmission: 0.9,
        roughness: 0.05,
        thickness: 0.1,
        transparent: true,
        opacity: 0.3
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(0, 1.3, 0.65);
    gameboyGroup.add(glassMesh);

    // 4. D-PAD
    const dpadGroup = new THREE.Group();
    const crossWidth = 0.8;
    const crossThickness = 0.25;
    const horizGeo = new THREE.BoxGeometry(crossWidth, crossThickness, 0.2);
    const vertGeo = new THREE.BoxGeometry(crossThickness, crossWidth, 0.2);
    const dpadHoriz = new THREE.Mesh(horizGeo, dpadMat);
    const dpadVert = new THREE.Mesh(vertGeo, dpadMat);
    
    // Center circle for dpad
    const dpadCenterGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.22, 16);
    const dpadCenter = new THREE.Mesh(dpadCenterGeo, dpadMat);
    dpadCenter.rotation.x = Math.PI/2;

    dpadGroup.add(dpadHoriz, dpadVert, dpadCenter);
    dpadGroup.position.set(-1.1, -1.0, 0.65);
    gameboyGroup.add(dpadGroup);

    // 5. Buttons A & B
    const createButton = (x, y, color) => {
        const bGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.2, 32);
        const mat = new THREE.MeshPhysicalMaterial({ color: color, roughness: 0.4 });
        const mesh = new THREE.Mesh(bGeo, mat);
        mesh.rotation.x = Math.PI / 2;
        mesh.position.set(x, y, 0.65);
        return mesh;
    };

    const buttonA = createButton(1.3, -0.9, colors.buttonAB);
    const buttonB = createButton(0.6, -1.2, colors.buttonAB);
    gameboyGroup.add(buttonA, buttonB);

    // 6. Start & Select Buttons (Pills)
    const createPill = (x, y) => {
        const pillGeo = new THREE.CapsuleGeometry(0.08, 0.4, 4, 8);
        const mesh = new THREE.Mesh(pillGeo, rubberMat);
        mesh.rotation.z = Math.PI / 3;
        mesh.rotation.x = Math.PI / 2;
        mesh.position.set(x, y, 0.6);
        return mesh;
    };

    gameboyGroup.add(createPill(-0.4, -2.4)); // Select
    gameboyGroup.add(createPill(0.4, -2.4));  // Start

    // 7. Speaker Slits
    const speakerGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const slitGeo = new THREE.CapsuleGeometry(0.03, 0.8, 2, 4);
        const slit = new THREE.Mesh(slitGeo, shellMat);
        slit.material = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0x333333), roughness: 1 });
        slit.rotation.z = -Math.PI / 4;
        slit.position.x = i * 0.18;
        speakerGroup.add(slit);
    }
    speakerGroup.position.set(0.8, -2.5, 0.6);
    gameboyGroup.add(speakerGroup);

    // 8. Power LED
    const ledGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const ledMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff0000) });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(-1.45, 1.6, 0.66);
    gameboyGroup.add(led);

    // 9. Back Details (Battery Hump & Cartridge Slot)
    const humpGeo = new THREE.BoxGeometry(3.0, 2.5, 0.3);
    const hump = new THREE.Mesh(humpGeo, shellMat);
    hump.position.set(0, -1.0, -0.7);
    gameboyGroup.add(hump);

    const cartSlotGeo = new THREE.BoxGeometry(2.6, 0.2, 0.8);
    const cartSlot = new THREE.Mesh(cartSlotGeo, bezelMat);
    cartSlot.position.set(0, 2.5, -0.4);
    gameboyGroup.add(cartSlot);

    // 10. Indentations and Lines
    // Using thin boxes to simulate plastic seams
    const lineMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xbbbbbb) });
    const seamHorizontal = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.01, 0.01), lineMat);
    seamHorizontal.position.set(0, -0.2, 0.61);
    gameboyGroup.add(seamHorizontal);

    // 11. Subtle curved indent at the bottom right
    const curveRadius = 0.8;
    const curveGeo = new THREE.TorusGeometry(curveRadius, 0.05, 8, 24, Math.PI / 2);
    const curveMesh = new THREE.Mesh(curveGeo, shellMat);
    curveMesh.position.set(shellWidth/2 - curveRadius, -shellHeight/2 + curveRadius, 0.5);
    curveMesh.rotation.z = Math.PI;
    gameboyGroup.add(curveMesh);

    // 12. Top Power Switch
    const switchBaseGeo = new THREE.BoxGeometry(0.4, 0.1, 0.2);
    const switchBase = new THREE.Mesh(switchBaseGeo, shellMat);
    switchBase.position.set(-1.0, 3.2, 0.1);
    gameboyGroup.add(switchBase);

    const switchKnobGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    const switchKnob = new THREE.Mesh(switchKnobGeo, rubberMat);
    switchKnob.position.set(-0.9, 3.25, 0.1);
    gameboyGroup.add(switchKnob);

    // 13. Volume & Contrast Dials (Side)
    const dialGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const volDial = new THREE.Mesh(dialGeo, dpadMat);
    volDial.rotation.z = Math.PI / 2;
    volDial.position.set(-2.0, 0.5, 0.0);
    gameboyGroup.add(volDial);

    const contrastDial = new THREE.Mesh(dialGeo, dpadMat);
    contrastDial.rotation.z = Math.PI / 2;
    contrastDial.position.set(2.0, 0.5, 0.0);
    gameboyGroup.add(contrastDial);

    // 14. Adding some "Text" labels with tiny boxes
    const createTextLabel = (w, h, x, y, color) => {
        const geo = new THREE.PlaneGeometry(w, h);
        const mat = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, 0.61);
        return mesh;
    };

    // "Nintendo Gameboy" branding area
    gameboyGroup.add(createTextLabel(1.5, 0.1, 0, -0.3, colors.textBlue));
    // "A" and "B" button markers
    gameboyGroup.add(createTextLabel(0.15, 0.15, 1.3, -1.3, colors.textBlue));
    gameboyGroup.add(createTextLabel(0.15, 0.15, 0.6, -1.6, colors.textBlue));

    // Refine Shell Material with Noise (Subtle Texture)
    shellMat.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
            `vec4 diffuseColor = vec4( diffuse, opacity );`,
            `
            float n = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
            vec3 noiseDiff = diffuse * (0.95 + n * 0.05);
            vec4 diffuseColor = vec4( noiseDiff, opacity );
            `
        );
    };

    gameboyGroup.rotation.x = -0.1; // Slight tilt for display
    
    return gameboyGroup;
};

return createGameboy();