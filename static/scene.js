let scene, renderer, camera, controls;
let resolution;

let g = {
    A: [
        [40, 10, 20],
        ["B"]
    ],
    B: [
        [-20, 10, -40],
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

init();
grid();
obstacles();
graph();

arrows();

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
    let cubeGeometry = new THREE.BoxGeometry (50,50,50);
    let cubeMaterial = new THREE.MeshPhongMaterial({color: 0xff0f0f, transparent: true, opacity: 0.5});
    let cube = new THREE.Mesh (cubeGeometry, cubeMaterial);

    cube.position.set (25, 25, -25);
    scene.add (cube);
}

function arrows() {
    makeLine([0,10,-20,0,10,0], 0x00ffff)
    makeLine([0,10,-20,0,50,-20], 0x00ffff)
    makeLine([0,10,-20,0,10,-50], 0x00ffff)
    makeLine([0,10,-20,0,0,-20], 0x00ffff)
    makeLine([0,10,0,40,10,20], 0x00ffff)
    makeNode( [0, 10, 0])
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
    makeLine([20,10,0,0,10,-20], 0xff0000)
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
    renderer.render (scene, camera);
}

function not() {
    var help = [ 10, 0, 0, -10, 0, 0]
    makeLine( help )

    const points = [];
    points.push( new THREE.Vector3( -10, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 10, 0 ) );
    points.push( new THREE.Vector3( 10, 0, 0 ) );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const line = new THREE.Line( geometry );
    scene.add( line );

    var cubeGeometry = new THREE.BoxGeometry (3,3,3);
    var cubeMaterial = new THREE.MeshBasicMaterial ({color: 0x1ec876});
    cube = new THREE.Mesh (cubeGeometry, cubeMaterial);

    cube.position.set (0, 0, 13);
    scene.add (cube);

}