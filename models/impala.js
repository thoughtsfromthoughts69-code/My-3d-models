const createImpala = () => {
    const impalaGroup = new THREE.Group();

    // High-end Physical Materials
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x8B4513), // Saddle Brown
        roughness: 0.85,
        metalness: 0.05,
        sheen: 1.0,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color(0xFFE4B5)
    });

    const whiteMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xF5F5F5),
        roughness: 0.7,
        metalness: 0.0
    });

    const blackMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x111111),
        roughness: 0.3,
        metalness: 0.2
    });

    const hornMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x222222),
        roughness: 0.9,
        metalness: 0.1,
        flatShading: false
    });

    const eyeMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x000000),
        roughness: 0.0,
        metalness: 0.5,
        clearcoat: 1.0
    });

    // --- TORSO CONSTRUCTION (Organic Sculpting) ---
    const torsoGroup = new THREE.Group();
    const bodyGeometry = new THREE.IcosahedronGeometry(1, 15);
    const bodyVertices = bodyGeometry.attributes.position;
    const v3 = new THREE.Vector3();

    for (let i = 0; i < bodyVertices.count; i++) {
        v3.fromBufferAttribute(bodyVertices, i);
        // Stretch for torso
        v3.z *= 2.2; 
        // Belly thinning
        if (v3.y < 0) v3.x *= 0.8;
        // Shoulder/Hips bulking
        if (v3.z > 1.2 || v3.z < -1.2) v3.x *= 1.1;
        // Taper neck area
        if (v3.z > 1.8) {
            v3.x *= 0.6;
            v3.y *= 0.8;
        }
        bodyVertices.setXYZ(i, v3.x, v3.y, v3.z);
    }
    bodyVertices.needsUpdate = true;
    bodyGeometry.computeVertexNormals();

    const torso = new THREE.Mesh(bodyGeometry, bodyMaterial);
    torso.position.y = 2.5;
    torso.castShadow = true;
    torsoGroup.add(torso);

    // White underbelly
    const bellyGeo = new THREE.SphereGeometry(0.85, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const belly = new THREE.Mesh(bellyGeo, whiteMaterial);
    belly.scale.set(0.7, 0.5, 1.8);
    belly.position.set(0, 2.1, 0);
    torsoGroup.add(belly);

    // --- NECK AND HEAD ---
    const neckPoints = [
        new THREE.Vector3(0, 2.8, 1.8),
        new THREE.Vector3(0, 3.8, 2.4),
        new THREE.Vector3(0, 4.8, 2.8)
    ];
    const neckCurve = new THREE.CatmullRomCurve3(neckPoints);
    const neckGeo = new THREE.TubeGeometry(neckCurve, 20, 0.28, 12, false);
    const neck = new THREE.Mesh(neckGeo, bodyMaterial);
    impalaGroup.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 4.9, 3.0);
    headGroup.rotation.x = -0.3;

    // Skull
    const skullGeo = new THREE.IcosahedronGeometry(0.35, 4);
    const skullVerts = skullGeo.attributes.position;
    for (let i = 0; i < skullVerts.count; i++) {
        v3.fromBufferAttribute(skullVerts, i);
        if (v3.z > 0) { // Muzzle stretch
            v3.z *= 1.8;
            v3.x *= 0.5;
            v3.y *= 0.6;
        }
        skullVerts.setXYZ(i, v3.x, v3.y, v3.z);
    }
    skullGeo.computeVertexNormals();
    const skull = new THREE.Mesh(skullGeo, bodyMaterial);
    headGroup.add(skull);

    // Muzzle White Patch
    const muzzleWhite = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), whiteMaterial);
    muzzleWhite.position.set(0, -0.05, 0.5);
    muzzleWhite.scale.set(1, 0.8, 1.2);
    headGroup.add(muzzleWhite);

    // Nose
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), blackMaterial);
    nose.position.set(0, 0.05, 0.65);
    headGroup.add(nose);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
    leftEye.position.set(0.18, 0.15, 0.1);
    const rightEye = leftEye.clone();
    rightEye.position.x = -0.18;
    headGroup.add(leftEye, rightEye);

    // Ears
    const createEar = (isLeft) => {
        const earShape = new THREE.Shape();
        earShape.moveTo(0, 0);
        earShape.quadraticCurveTo(0.2, 0.4, 0, 0.8);
        earShape.quadraticCurveTo(-0.2, 0.4, 0, 0);
        const earGeo = new THREE.ExtrudeGeometry(earShape, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 });
        const ear = new THREE.Mesh(earGeo, bodyMaterial);
        ear.rotation.z = isLeft ? -Math.PI / 4 : Math.PI / 4;
        ear.rotation.x = -0.2;
        ear.position.set(isLeft ? 0.2 : -0.2, 0.3, -0.1);
        return ear;
    };
    headGroup.add(createEar(true), createEar(false));

    // --- HORNS (Lyrate Shape) ---
    const createHorn = (isLeft) => {
        const hPoints = [];
        const sign = isLeft ? 1 : -1;
        hPoints.push(new THREE.Vector3(sign * 0.1, 0.25, -0.1));
        hPoints.push(new THREE.Vector3(sign * 0.3, 0.8, -0.2));
        hPoints.push(new THREE.Vector3(sign * 0.1, 1.4, -0.5));
        hPoints.push(new THREE.Vector3(sign * 0.4, 1.8, -0.3));
        
        const hCurve = new THREE.CatmullRomCurve3(hPoints);
        const hGeo = new THREE.TubeGeometry(hCurve, 64, 0.06, 12, false);
        
        // Add ridging to horns via vertex displacement
        const hPos = hGeo.attributes.position;
        const tempV = new THREE.Vector3();
        for (let i = 0; i < hPos.count; i++) {
            tempV.fromBufferAttribute(hPos, i);
            const dist = tempV.length();
            const ridge = 1.0 + Math.sin(dist * 40.0) * 0.08;
            tempV.multiplyScalar(ridge);
            hPos.setXYZ(i, tempV.x, tempV.y, tempV.z);
        }
        hGeo.computeVertexNormals();

        const horn = new THREE.Mesh(hGeo, hornMaterial);
        return horn;
    };
    headGroup.add(createHorn(true), createHorn(false));

    impalaGroup.add(headGroup);

    // --- LEGS ---
    const createLeg = (x, z, isFront) => {
        const legGroup = new THREE.Group();
        legGroup.position.set(x, 2.5, z);

        // Thigh
        const thighGeo = new THREE.CylinderGeometry(isFront ? 0.15 : 0.22, 0.1, 1.2, 12);
        const thigh = new THREE.Mesh(thighGeo, bodyMaterial);
        thigh.position.y = -0.6;
        thigh.rotation.x = isFront ? 0.1 : -0.2;
        legGroup.add(thigh);

        // Shin
        const shinGeo = new THREE.CylinderGeometry(0.08, 0.05, 1.2, 12);
        const shin = new THREE.Mesh(shinGeo, bodyMaterial);
        shin.position.set(0, -1.7, isFront ? 0.1 : -0.15);
        shin.rotation.x = isFront ? -0.05 : 0.2;
        legGroup.add(shin);

        // Hoof
        const hoofGeo = new THREE.BoxGeometry(0.12, 0.15, 0.15);
        const hoof = new THREE.Mesh(hoofGeo, blackMaterial);
        hoof.position.set(0, -2.4, isFront ? 0.15 : -0.25);
        legGroup.add(hoof);

        return legGroup;
    };

    impalaGroup.add(createLeg(0.4, 1.5, true));   // Front Left
    impalaGroup.add(createLeg(-0.4, 1.5, true));  // Front Right
    impalaGroup.add(createLeg(0.45, -1.4, false)); // Back Left
    impalaGroup.add(createLeg(-0.45, -1.4, false));// Back Right

    // --- TAIL ---
    const tailPoints = [
        new THREE.Vector3(0, 2.6, -2.1),
        new THREE.Vector3(0, 2.2, -2.4),
        new THREE.Vector3(0, 1.8, -2.3)
    ];
    const tailCurve = new THREE.CatmullRomCurve3(tailPoints);
    const tailGeo = new THREE.TubeGeometry(tailCurve, 10, 0.05, 8, false);
    const tail = new THREE.Mesh(tailGeo, bodyMaterial);
    
    // Tail stripe
    const tailStripe = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 10, 0.02, 8, false), blackMaterial);
    tailStripe.position.y += 0.01;
    impalaGroup.add(tail, tailStripe);

    // --- FINAL REFINEMENTS ---
    impalaGroup.add(torsoGroup);

    // Global scale and rotation adjustments
    impalaGroup.scale.set(1.2, 1.2, 1.2);
    impalaGroup.traverse(child => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return impalaGroup;
};

return createImpala();