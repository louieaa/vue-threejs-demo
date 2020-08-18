<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:35:49
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-13 11:52:36
-->
<template>
  <div class="page-js2">
    <div id="info"><a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> css3d - orthographic</div>
  </div>
</template>

<script>
import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  name: "js2",
  components: {},
  data() {
    return {
      camera:null,
      scene:null,
      renderer:null,
      scene2:null,
      renderer2:null,
      material:null
    };
  },
  methods: {
    init() {
				var frustumSize = 500;
        var aspect = window.innerWidth / window.innerHeight;
        console.log(window.innerWidth,window.innerHeight,aspect,788)
				this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );

        this.camera.position.set( 100, 10, 10 );
        this.scene = new THREE.Scene();
				this.scene.background = new THREE.Color( 0xf0f0f0 );

				this.scene2 = new THREE.Scene();

				this.material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 1, side: THREE.DoubleSide } );

				// left
				this.createPlane(
					100, 100,
					'chocolate',
					new THREE.Vector3( - 50, 0, 0 ),
					new THREE.Euler( 0, - 90 * THREE.MathUtils.DEG2RAD, 0 )
				);
				// right
				this.createPlane(
					100, 100,
					'saddlebrown',
					new THREE.Vector3( 0, 0, 50 ),
					new THREE.Euler( 0, 0, 0 )
				);
				// top
				this.createPlane(
					100, 100,
					'yellowgreen',
					new THREE.Vector3( 0, 50, 0 ),
					new THREE.Euler( - 90 * THREE.MathUtils.DEG2RAD, 0, 0 )
				);
				// bottom
				this.createPlane(
					300, 300,
					'seagreen',
					new THREE.Vector3( 0, - 50, 0 ),
					new THREE.Euler( - 90 * THREE.MathUtils.DEG2RAD, 0, 0 )
				);

				//

				this.renderer = new THREE.WebGLRenderer();
				this.renderer.setPixelRatio( window.devicePixelRatio );
				this.renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( this.renderer.domElement );

				this.renderer2 = new CSS3DRenderer();
				this.renderer2.setSize( window.innerWidth, window.innerHeight );
				this.renderer2.domElement.style.position = 'absolute';
				this.renderer2.domElement.style.top = 0;
				document.body.appendChild( this.renderer2.domElement );

				var controls = new OrbitControls( this.camera, this.renderer2.domElement );
				controls.minZoom = 0.5;
				controls.maxZoom = 2;
    },
    createPlane(width, height, cssColor, pos, rot){
      var element = document.createElement( 'div' );
      element.style.width = width + 'px';
      element.style.height = height + 'px';
      element.style.opacity = 0.75;
      element.style.background = cssColor;

      var object = new CSS3DObject( element );
      object.position.copy( pos );
      object.rotation.copy( rot );
      this.scene2.add( object );

      var geometry = new THREE.PlaneBufferGeometry( width, height );
      var mesh = new THREE.Mesh( geometry, this.material );
      mesh.position.copy( object.position );
      mesh.rotation.copy( object.rotation );
      this.scene.add( mesh );
    },
    animate() {
      requestAnimationFrame( this.animate );
      this.renderer.render( this.scene, this.camera );
      this.renderer2.render( this.scene2, this.camera );

    }
  },
  mounted() {
    this.init();
    this.animate();
  }
};
</script>
<style lang="scss" scoped></style>
