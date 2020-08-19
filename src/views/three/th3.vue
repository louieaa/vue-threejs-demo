<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:35:49
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-19 11:43:55
-->
<template>
  <div class="page-th2">
    <h1>Creating a scene</h1>
    <h4>创建一个场景，画文字</h4>
    <div class="tool">
      <el-button plain @click="color">color</el-button>
      <el-button type="danger" plain @click="fontFun">font</el-button>
      <el-button type="success" plain @click="weight">weight</el-button>
      <el-button type="info" plain @click="bevel">bevel</el-button>
    </div>
    <div class="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
THREE.Cache.enabled = true
export default {
  name: "th2",
  components: {},
  data() {
    return {
      stats:null,
      permalink:null,
      hex:null,

      cameraTarget:null,
      scene:null, // 场景
      camera:null, // 相机
      renderer:null, // 渲染
      container:null, // 渲染dom
      geometry:null,
      
      fontLoader:null,
      group:null,
      textMesh1:null,
      textMesh2:null,
      textGeo:null, 
      materials:null,
      firstLetter:true,
      pointLight:null,
      text:'three.js',
      height:20,
      size:70,
      hover:30,
      curveSegments:4,
      bevelThickness:2,
      bevelSize:1.5,
      bevelEnabled:true,
      font:undefined,
      fontName:'han/yaoti',
      fontWeight:'bold',
      mirror:true,
      // threejs 自带的字体
      fontMap:{
				"helvetiker": 0,
				"optimer": 1,
				"gentilis": 2,
				"droid/droid_sans": 3,
        "droid/droid_serif": 4,
        "han/cao": 5,
        "han/yaoti": 6,
        "han/yingbi": 7,
      },
      weightMap:{
        "regular": 0,
				"bold": 1
      },
      reverseFontMap:[],
      reverseWeightMap:[],
      targetRotation:0,
      targetRotationOnMouseDown:0,
      mouseX:0,
      mouseXOnMouseDown:0,
      gap:300, // 缺口
      windowHalfX:0,
      fontIndex:1,
      w:window.innerWidth,
      h:window.innerHeight,
      cp:{
        fov:0 ,// 角度
        aspect:0, // 宽高比
        near:0, // 近面
        far:0 // 远面
      },
    };
  },
  computed:{
  },
  methods: {
    decimalToHex( d ) {
      var hex = Number( d ).toString( 16 );
      hex = "000000".substr( 0, 6 - hex.length ) + hex;
      return hex.toUpperCase();
    },
    init(){
      // 获取屏幕可视范围
      this.handleGetWindowInner();
      // SCENE
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color( '#000000' );
      this.scene.fog = new THREE.Fog( '#000000', 250, 1400 );
      // CAMERA
      this.cp={
        fov:30,// 角度
        aspect:this.w/this.h, // 宽高比
        near:1, // 近面
        far: 1500 // 远面
      }
      this.camera = new THREE.PerspectiveCamera(this.cp.fov,this.cp.aspect,this.cp.near,this.cp.far);
      this.camera.position.set( 0, 400, 700 );
      this.cameraTarget = new THREE.Vector3( 0, 150, 0 );
      // this.camera.lookAt( 0, 0, 0 )

      // LIGHTS 灯光
      var dirLight = new THREE.DirectionalLight( '#f60f60', 0.125 );
			dirLight.position.set( 0, 0, 1 ).normalize();
      this.scene.add( dirLight );
      this.pointLight = new THREE.PointLight( 0xffffff, 1.5 );
			this.pointLight.position.set( 0, 100, 90 );
      this.scene.add( this.pointLight );

      // Get text from hash
      var hash = document.location.hash.substr( 1 );
      if ( hash.length !== 0 ) {
        var colorhash = hash.substring( 0, 6 );
        var fonthash = hash.substring( 6, 7 );
        var weighthash = hash.substring( 7, 8 );
        var bevelhash = hash.substring( 8, 9 );
        var texthash = hash.substring( 10 );

        this.hex = colorhash;
        this.pointLight.color.setHex( parseInt( colorhash, 16 ) );

        this.fontName = this.reverseFontMap[ parseInt( fonthash ) ];
        this.fontWeight = this.reverseWeightMap[ parseInt( weighthash ) ];

        this.bevelEnabled = parseInt( bevelhash );

        this.text = decodeURI( texthash );

        // this.updatePermalink();

      } else {
        this.pointLight.color.setHSL( Math.random(), 1, 0.5 );
        this.hex = this.decimalToHex( this.pointLight.color.getHex() );
      }
      this.materials = [
        new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
      ]
      this.group = new THREE.Group();
      this.group.position.y = 100;
      this.scene.add( this.group );
      // 加载文字
      this.loadFont();

      //plane
      var plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 10000, 10000 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
      );
      plane.position.y = 100;
      plane.rotation.x = - Math.PI / 2;
      this.scene.add( plane );

      //RENDERER
      this.renderer = new THREE.WebGLRenderer( { antialias: true } );
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize(this.w,this.h)
      this.container =document.querySelector('.container')
      this.container.appendChild(this.renderer.domElement)
      // STATS
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
      this.stats.domElement.style.left = '150px';
      this.container.appendChild( this.stats.dom );
    },
    boolToNum( b ) {
      return b ? 1 : 0;
    },
    // updatePermalink() {
    //   var link = this.hex + this.fontMap[ this.fontName ] + this.weightMap[ this.fontWeight ] + this.boolToNum( this.bevelEnabled ) + "#" + encodeURI( this.text );
    //   // this.permalink.href = "#" + link;
    //   window.location.hash = link;
    // },
    onDocumentKeyDown( event ) {
      if ( this.firstLetter ) {
        this.firstLetter = false;
        this.text = "";
      }
      var keyCode = event.keyCode;
      // backspace
      if ( keyCode == 8 ) {
        event.preventDefault();
        this.text = this.text.substring( 0, this.text.length - 1 );
        this.refreshText();
        return false;
      }
    },
    onDocumentKeyPress( event ) {
      var keyCode = event.which;
      // backspace
      if ( keyCode == 8 ) {
        event.preventDefault();
      } else {
        var ch = String.fromCharCode( keyCode );
        this.text += ch;
        this.refreshText();
      }
    },
    // 加载汉字
    // loadFontHan(){
    //   this.fontLoader = new THREE.FontLoader();
    //   this.fontLoader.load( '/fonts/han/cao.typeface.json',  ( response )=> {
    //     this.font = response;
    //     this.refreshText();
    //   } );
    // },
    //自带文字几何体
    loadFont() {
      this.fontLoader = new THREE.FontLoader();
      this.fontLoader.load( '/fonts/' + this.fontName + '_' + this.fontWeight + '.typeface.json',  ( response )=> {
        this.font = response;
        this.refreshText();
      } );
    },
    createText() {
      this.textGeo = new THREE.TextGeometry( this.text, {
        font: this.font, //字体，默认是'helvetiker'  需对应引用的字体文件
        size: this.size, //字号大小，一般为大写字母的高度
        height: this.height, //文字的厚度
        // style: 'normal', //值为'normal'或'italics'  是否斜体
        // weight: 'bold', //值为'normal'或'bold'   是否加粗
        curveSegments: this.curveSegments, //弧线分段数，使得文字的曲线更加光滑  默认12
        bevelThickness: this.bevelThickness, //斜角与原文本轮廓之间的延申距离厚度
        bevelSize: this.bevelSize,  //斜角与原文本轮廓之间的延申距离 默认8
        bevelEnabled: this.bevelEnabled  //布尔值，是否使用倒角，意为在边缘处斜切
      } );
      this.textGeo.computeBoundingBox();
      this.textGeo.computeVertexNormals();

      var triangle = new THREE.Triangle();

      // "fix" side normals by removing z-component of normals for side faces
      // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

      if ( ! this.bevelEnabled ) {
        var triangleAreaHeuristics = 0.1 * ( this.height * this.size );
        for ( var i = 0; i < this.textGeo.faces.length; i ++ ) {
          var face = this.textGeo.faces[ i ];
          if ( face.materialIndex == 1 ) {
            for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
              face.vertexNormals[ j ].z = 0;
              face.vertexNormals[ j ].normalize();

            }
            var va = this.textGeo.vertices[ face.a ];
            var vb = this.textGeo.vertices[ face.b ];
            var vc = this.textGeo.vertices[ face.c ];
            var s = triangle.set( va, vb, vc ).getArea();

            if ( s > triangleAreaHeuristics ) { 
              for ( var z = 0; z < face.vertexNormals.length; z++ ) {
                face.vertexNormals[ z ].copy( face.normal );
              }
            }
          }

        }

      }
      var centerOffset = - 0.5 * ( this.textGeo.boundingBox.max.x - this.textGeo.boundingBox.min.x );
      this.textGeo = new THREE.BufferGeometry().fromGeometry( this.textGeo );
      this.textMesh1 = new THREE.Mesh( this.textGeo, this.materials );
      this.textMesh1.position.x = centerOffset;
      this.textMesh1.position.y = this.hover;
      this.textMesh1.position.z = 0;
      this.textMesh1.rotation.x = 0;
      this.textMesh1.rotation.y = Math.PI * 2;
      this.group.add( this.textMesh1 );
      if ( this.mirror ) {
        this.textMesh2 = new THREE.Mesh( this.textGeo, this.materials );
        this.textMesh2.position.x = centerOffset;
        this.textMesh2.position.y = - this.hover;
        this.textMesh2.position.z = this.height;
        this.textMesh2.rotation.x = Math.PI;
        this.textMesh2.rotation.y = Math.PI * 2;
        this.group.add( this.textMesh2 );
      }
    },
    refreshText() {
      // this.updatePermalink();
      this.group.remove( this.textMesh1 );
      if ( this.mirror ) this.group.remove( this.textMesh2 );
      if ( !this.text ) return;
      this.createText();
    },
    onDocumentMouseDown( event ) {
      event.preventDefault();
      document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
      document.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
      document.addEventListener( 'mouseout', this.onDocumentMouseOut, false );
      this.mouseXOnMouseDown = event.clientX - this.windowHalfX;
      this.targetRotationOnMouseDown = this.targetRotation;
    },
    onDocumentMouseMove( event ) {
      this.mouseX = event.clientX - this.windowHalfX;
      this.targetRotation = this.targetRotationOnMouseDown + ( this.mouseX - this.mouseXOnMouseDown ) * 0.02;
    },
    onDocumentMouseUp() {
      document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
      document.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );
      document.removeEventListener( 'mouseout', this.onDocumentMouseOut, false );
    },
    onDocumentMouseOut() {
      document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
      document.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );
      document.removeEventListener( 'mouseout', this.onDocumentMouseOut, false );
    },
    onDocumentTouchStart( event ) {
      if ( event.touches.length == 1 ) {
        event.preventDefault();
        this.mouseXOnMouseDown = event.touches[ 0 ].pageX - this.windowHalfX;
        this.targetRotationOnMouseDown = this.targetRotation;
      }
    },
    onDocumentTouchMove( event ) {
      if ( event.touches.length == 1 ) {
        event.preventDefault();
        this.mouseX = event.touches[ 0 ].pageX - this.windowHalfX;
        this.targetRotation = this.targetRotationOnMouseDown + ( this.mouseX - this.mouseXOnMouseDown ) * 0.05;
      }
    },
    animate() {
      requestAnimationFrame( this.animate );
      this.render();
      this.stats.update();
    },
    render() {
      this.group.rotation.y += ( this.targetRotation - this.group.rotation.y ) * 0.05;
      this.camera.lookAt( this.cameraTarget );
      this.renderer.clear();
      this.renderer.render( this.scene, this.camera );
    },
    color(){
      this.pointLight.color.setHSL( Math.random(), 1, 0.5 );
      this.hex = this.decimalToHex( this.pointLight.color.getHex() );
      // this.updatePermalink();
    },
    fontFun(){
      this.fontIndex ++;
      this.fontName = this.reverseFontMap[ this.fontIndex % this.reverseFontMap.length ];
      //  this.fontIndex % this.reverseFontMap.length 这种方式是动态递增获取数组的值
      // console.log(this.fontIndex,this.reverseFontMap,this.reverseFontMap.length,this.fontIndex % this.reverseFontMap.length,this.fontName)
      this.loadFont();
    },
    weight(){
      if ( this.fontWeight === "bold" ) {
        this.fontWeight = "regular";
      } else {
        this.fontWeight = "bold";
      }
      this.loadFont();
    },
    bevel(){
      this.bevelEnabled = !this.bevelEnabled;
			this.refreshText();
    },
    handleGetWindowInner(){
      this.w = window.innerWidth - this.gap,
      this.h = window.innerHeight- this.gap,
      this.windowHalfX = this.w / 2;
    },
    onWindowResize() {
      this.handleGetWindowInner();
      this.camera.aspect = this.w / this.h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( this.w, this.h );
    },
    handleAddEvent(){
      document.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
			document.addEventListener( 'touchstart', this.onDocumentTouchStart, false );
			document.addEventListener( 'touchmove', this.onDocumentTouchMove, false );
			document.addEventListener( 'keypress', this.onDocumentKeyPress, false );
			document.addEventListener( 'keydown', this.onDocumentKeyDown, false );
    },  
    // 字体集合
    handleFontList(){
      for ( let i in this.fontMap ) {
        // console.log(i,this.fontMap[ i ])
        this.reverseFontMap[ this.fontMap[ i ] ] = i;
      }
      console.log(this.reverseFontMap,777)
    },
  },
  mounted() {
    window.addEventListener( 'resize', this.onWindowResize, false );
  
    this.handleFontList();
		for ( let i in this.weightMap ){
      this.reverseWeightMap[ this.weightMap[ i ] ] = i;
    } 
    this.init();
    this.handleAddEvent();
    this.animate();
  }
};
</script>
<style lang="scss" scoped>
.container{
  position: relative;
}
.tool{
  margin: 10px 0;
}
</style>
