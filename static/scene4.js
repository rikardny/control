let scene, renderer, camera, controls;
let resolution;

let g = {
    A: [
        [0, 10, 0],
        []
    ],
}

var colors = [
	0xed6a5a,
	0xf4f1bb,
	0x9bc1bc,
	0x5ca4a9,
	0xe6ebe0,
	0xf0b67f,
	0xfe5f55,
	0xd6d1b1,
	0xc7efcf,
	0xeef5db,
	0x50514f,
	0xf25f5c,
	0xffe066,
	0x247ba0,
	0x70c1b3
];

var clock = new THREE.Clock();

init();
grid();
obstacles();
graph();
animate();

function init() {
    container = document.getElementById( 'container' );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xcccccc );

    camera = new THREE.PerspectiveCamera (60, window.innerWidth/window.innerHeight, 1, 1000);
    camera.position.set( -100, 80, 50 )
    camera.lookAt (new THREE.Vector3(0,0,0));
    frustumSize = 1000;

    renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild( renderer.domElement );

    resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 1;
    controls.enableZoom = true;

    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );

    const light2 = new THREE.PointLight( 0x999999, 1, 1000 );
    light2.position.set( -50, 100, 80 )
    scene.add( light2 );
}

function grid() {
    var gridXZ = new THREE.GridHelper(100, 10);
    scene.add(gridXZ);

    const material = new THREE.LineBasicMaterial( { color: 0x9090ff } );
    const points = [];
    points.push( new THREE.Vector3(0, 0, 0));
    points.push( new THREE.Vector3(0, 50, 0));
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    var Y = new THREE.Line( geometry, material )
    scene.add(Y);

}

function obstacles() {
    let cubeGeometry = new THREE.BoxGeometry (50,5,80);
    let cubeMaterial = new THREE.MeshPhongMaterial({color: 0xff0f0f, transparent: true, opacity: 0.5});
    let cube = new THREE.Mesh (cubeGeometry, cubeMaterial);

    cube.position.set (35, 2.5, 0);
    scene.add (cube);

    let wall1G = new THREE.BoxGeometry(50,40,5);
    let wall2G = new THREE.BoxGeometry(50,40,5);
    let roofG = new THREE.BoxGeometry( 50,5,80);
    let wall1 = new THREE.Mesh(wall1G, cubeMaterial)
    let wall2 = new THREE.Mesh(wall2G, cubeMaterial)
    let roof = new THREE.Mesh(roofG, cubeMaterial)

    wall1.position.set(35, 25, 37.5)
    wall2.position.set(35, 25, -37.5)
    roof.position.set(35,47.5, 0);
    scene.add(wall1)
    scene.add(wall2)
    scene.add(roof)
}



function graph() {
    for (const [key, value] of Object.entries(g)) {
        makeNode(value[0]);
        let source, target, line;
        value[1].forEach(element => {
            source = value[0];
            target = g[element][0]
            line = source.concat(target)
            makeLine(line, 0xffffff)
        });
    }
    // makeLine([-40,10,-40,-20,50,-20], 0x00ff00)
}

function makeNode( pos ) {
    var g = new THREE.SphereGeometry( 2, 32, 16 );
    let color = colors[Math.floor(Math.random()*colors.length)];
    var m = new THREE.MeshBasicMaterial( { color: color });
    var node = new THREE.Mesh( g, m );
    node.position.set( pos[0], pos[1], pos[2] )
    scene.add( node );
}

function makeLine( geo, c ) {
	var g = new MeshLine();
	g.setGeometry( geo );

	var material = new MeshLineMaterial( {
		useMap: false,
		color: new THREE.Color( c ),
		opacity: 1,
        resolution: resolution,
		sizeAttenuation: true,
		lineWidth: 1,
	});
	var mesh = new THREE.Mesh( g.geometry, material );
	scene.add( mesh );

}

onWindowResize();

function onWindowResize() {

	var w = container.clientWidth;
	var h = container.clientHeight;

	var aspect = w / h;

	camera.left   = - frustumSize * aspect / 2;
	camera.right  =   frustumSize * aspect / 2;
	camera.top    =   frustumSize / 2;
	camera.bottom = - frustumSize / 2;

	camera.updateProjectionMatrix();

	renderer.setSize( w, h );

	resolution.set( w, h );

}

window.addEventListener( 'resize', onWindowResize );

function animate() {
    controls.update();
    requestAnimationFrame ( animate );  

    scene.rotation.y -= 0.25*clock.getDelta();
    renderer.render (scene, camera);
}