const createMetaphysicalExistence = () => {
    const mainGroup = new THREE.Group();

    // High-end Material Palettes
    const matPolishedChrome = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xcccccc),
        metalness: 0.9,
        roughness: 0.1,
        reflectivity: 1.0,
        clearcoat: 1.0
    });

    const matDarkVoid = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x050505),
        metalness: 0.2,
        roughness: 0.9,
        transmission: 0,
        thickness: 2
    });

    const matEtherealGlass = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xffffff),
        metalness: 0.0,
        roughness: 0.05,
        transmission: 0.95,
        thickness: 0.5,
        ior: 1.52,
        transparent: true,
        opacity: 0.4
    });

    const matNeuralGlow = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x00ffff),
        emissive: new THREE.Color(0x4488ff),
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.5
    });

    const matDeepOak = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x221100),
        roughness: 0.4,
        metalness: 0.0
    });

    // 1. THE VOID SPHERE (The context of non-existence)
    const voidGeometry = new THREE.IcosahedronGeometry(100, 5);
    const voidPos = voidGeometry.attributes.position;
    for (let i = 0; i < voidPos.count; i++) {
        const x = voidPos.getX(i);
        const y = voidPos.getY(i);
        const z = voidPos.getZ(i);
        const noise = (Math.random() - 0.5) * 5;
        voidPos.setXYZ(i, x + noise, y + noise, z + noise);
    }
    const voidMesh = new THREE.Mesh(voidGeometry, new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x0a0a0a),
        wireframe: true,
        transparent: true,
        opacity: 0.1
    }));
    mainGroup.add(voidMesh);

    // 2. THE SANCTUM OF THOUGHT (The Architectural Core)
    const sanctumGroup = new THREE.Group();
    
    // Floating Floor - A complex extruded hexagon
    const floorShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 15;
        const y = Math.sin(angle) * 15;
        if (i === 0) floorShape.moveTo(x, y);
        else floorShape.lineTo(x, y);
    }
    const floorExtrudeSettings = { depth: 0.5, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.5 };
    const floorGeo = new THREE.ExtrudeGeometry(floorShape, floorExtrudeSettings);
    const floorMesh = new THREE.Mesh(floorGeo, matPolishedChrome);
    floorMesh.rotation.x = Math.PI / 2;
    sanctumGroup.add(floorMesh);

    // Modular Furniture: The Desk of Reason
    const deskGroup = new THREE.Group();
    const deskTopGeo = new THREE.BoxGeometry(6, 0.2, 3);
    const deskTop = new THREE.Mesh(deskTopGeo, matEtherealGlass);
    deskTop.position.set(0, 2.5, 0);
    
    const deskLegGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 16);
    const legPositions = [[-2.8, 1.25, -1.3], [2.8, 1.25, -1.3], [-2.8, 1.25, 1.3], [2.8, 1.25, 1.3]];
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(deskLegGeo, matPolishedChrome);
        leg.position.set(pos[0], pos[1], pos[2]);
        deskGroup.add(leg);
    });
    deskGroup.add(deskTop);
    deskGroup.position.set(0, 0, -4);
    sanctumGroup.add(deskGroup);

    // Modular Furniture: The Ergonomic Chair (Complex Math Surfaces)
    const chairGroup = new THREE.Group();
    const seatCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, -0.2, 1),
        new THREE.Vector3(1, 0, 0)
    ]);
    const seatGeo = new THREE.TubeGeometry(seatCurve, 20, 0.8, 8, false);
    const seat = new THREE.Mesh(seatGeo, matDarkVoid);
    seat.scale.set(1, 0.2, 1.5);
    seat.position.y = 1.8;
    
    const backrestShape = new THREE.Shape();
    backrestShape.moveTo(-0.8, 0);
    backrestShape.bezierCurveTo(-0.8, 2, 0.8, 2, 0.8, 0);
    const backrestGeo = new THREE.ExtrudeGeometry(backrestShape, { depth: 0.1, bevelEnabled: true });
    const backrest = new THREE.Mesh(backrestGeo, matDarkVoid);
    backrest.position.set(0, 2, 1);
    backrest.rotation.x = -Math.PI / 8;
    
    const chairBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.5, 1.8, 32), matPolishedChrome);
    chairBase.position.y = 0.9;
    
    chairGroup.add(seat, backrest, chairBase);
    chairGroup.position.set(0, 0, -1);
    sanctumGroup.add(chairGroup);

    // 3. THE NEURAL LOOM (Advanced Geometry Manipulation)
    const loomGroup = new THREE.Group();
    const strandCount = 12;
    for (let i = 0; i < strandCount; i++) {
        const points = [];
        for (let j = 0; j < 20; j++) {
            const angle = (j / 20) * Math.PI * 4 + (i / strandCount) * Math.PI * 2;
            const radius = 10 + Math.sin(j * 0.5) * 5;
            points.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                (j - 10) * 4,
                Math.sin(angle) * radius
            ));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, 100, 0.05, 8, false);
        const tube = new THREE.Mesh(tubeGeo, matNeuralGlow);
        loomGroup.add(tube);
    }
    sanctumGroup.add(loomGroup);

    // 4. FRAGMENTS OF REALITY (Displaced BufferGeometry)
    const fragments = new THREE.Group();
    for (let k = 0; k < 15; k++) {
        const fragGeo = new THREE.IcosahedronGeometry(Math.random() * 2 + 1, 1);
        const posAttr = fragGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
            posAttr.setX(i, posAttr.getX(i) * (1 + Math.random() * 0.5));
            posAttr.setY(i, posAttr.getY(i) * (1 + Math.random() * 0.5));
        }
        const frag = new THREE.Mesh(fragGeo, matPolishedChrome);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 20 + Math.random() * 10;
        frag.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        frag.rotation.set(Math.random(), Math.random(), Math.random());
        fragments.add(frag);
    }
    sanctumGroup.add(fragments);

    // 5. THE CENTRAL "THOUGHT" CORE (Mathematical Sculpture)
    const coreGeometry = new THREE.SphereGeometry(2, 64, 64);
    const corePos = coreGeometry.attributes.position;
    const coreTime = Date.now() * 0.001;
    for (let i = 0; i < corePos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(corePos, i);
        const noise = Math.sin(v.x * 2 + coreTime) * Math.cos(v.y * 2 + coreTime) * 0.5;
        v.multiplyScalar(1 + noise);
        corePos.setXYZ(i, v.x, v.y, v.z);
    }
    const coreMesh = new THREE.Mesh(coreGeometry, matNeuralGlow);
    coreMesh.position.y = 8;
    sanctumGroup.add(coreMesh);

    // Interior Lighting Fixtures
    const lightFixtureGeo = new THREE.TorusGeometry(12, 0.1, 16, 100);
    const lightFixture = new THREE.Mesh(lightFixtureGeo, matNeuralGlow);
    lightFixture.rotation.x = Math.PI / 2;
    lightFixture.position.y = 12;
    sanctumGroup.add(lightFixture);

    // Ceiling detail
    const ceilingGeo = new THREE.CylinderGeometry(15, 15, 0.2, 6, 1, true);
    const ceiling = new THREE.Mesh(ceilingGeo, matDarkVoid);
    ceiling.position.y = 15;
    sanctumGroup.add(ceiling);

    // Floating Monitors (Representing Information/Thought)
    for (let i = 0; i < 3; i++) {
        const monitorGroup = new THREE.Group();
        const screenGeo = new THREE.BoxGeometry(4, 2.2, 0.1);
        const screen = new THREE.Mesh(screenGeo, matEtherealGlass);
        const frame = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.4, 0.15), matPolishedChrome);
        monitorGroup.add(screen, frame);
        
        const angle = (i / 3) * Math.PI * 0.5 - Math.PI/4;
        monitorGroup.position.set(Math.sin(angle) * 5, 4, -6 + Math.cos(angle) * 2);
        monitorGroup.rotation.y = -angle;
        sanctumGroup.add(monitorGroup);
    }

    mainGroup.add(sanctumGroup);

    // Final composition adjustments
    mainGroup.scale.set(0.5, 0.5, 0.5);

    // Animation Logic would go in the external loop, but we provide the structure
    mainGroup.userData.update = (time) => {
        coreMesh.rotation.y += 0.01;
        loomGroup.rotation.y -= 0.005;
        voidMesh.rotation.z += 0.001;
        
        const pos = coreGeometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const v = new THREE.Vector3().fromBufferAttribute(pos, i).normalize();
            const wave = Math.sin(time * 2 + i * 0.1) * 0.2;
            v.multiplyScalar(2 + wave);
            pos.setXYZ(i, v.x, v.y, v.z);
        }
        pos.needsUpdate = true;
    };

    return mainGroup;
};

return createMetaphysicalExistence();