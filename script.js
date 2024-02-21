//gsap.registerPlugin(SplitText);
class Line {
  constructor(opts) {
    this.line_container = opts.line_container;
    this.copy = opts.copy || "HELLO WORLD!";
    this.delay = opts.delay || 0;
    this.key_sound = opts.key_sound || null;
    this.has_underline =
      typeof opts.has_underline === "boolean" ? opts.has_underline : false;
    this.build();
  } //constructor

  build() {
    this.line_elm = document.createElement("div");
    this.line_elm.classList.add("line");

    this.grad_elm = document.createElement("div");
    this.grad_elm.classList.add("grad");

    this.line_elm.appendChild(this.grad_elm);

    this.copy_elm = document.createElement("div");
    this.copy_elm.classList.add("copy");
    this.copy_elm.innerText = this.copy;

    this.line_elm.appendChild(this.copy_elm);

    this.line_container.appendChild(this.line_elm);

    this.splitting = new SplitText(this.copy_elm, { type: "words,chars" });
    gsap.set(this.splitting.chars, { opacity: 0 });
    gsap.set(this.copy_elm, { position: "relative", justifySelf: "start" });

    this.underline_elm = document.createElement("div");
    this.underline_elm.classList.add("underline");

    this.copy_elm.appendChild(this.underline_elm);

    gsap.set(this.underline_elm, {
      position: "absolute",
      left: 1,
      bottom: 1,
      width: "100%",
      height: "0.15vw",
      backgroundColor: "#7af042",
      opacity: 0
    });
    // this.animate();
  } //build

  animate() {
    let tl = gsap
      .timeline({ paused: false, delay: this.delay })
      .set(this.line_elm, { display: "grid" })
      .set(this.splitting.chars, { opacity: 0, visibility: "visible" })
      .fromTo(
        this.line_elm,
        {
          "--grad-offset-scale": 1
        },
        {
          "--grad-offset-scale": -1,
          duration: 0.5,
          ease: "power4.inOut"
        }
      )
      .fromTo(
        this.splitting.chars,
        { opacity: 1, backgroundColor: "#7df14a" },
        {
          opacity: 1,
          backgroundColor: "transparent",
          duration: 0.05,
          stagger: 0.05,
          ease: "steps(1)"
        },
        "-=0.12"
      )
      .fromTo(
        this.splitting.chars,
        {
          color: "#fff",
          textShadow:
            "0px 0px 6px rgba(255,255,255,1), 0px 0px 15px rgba(255,255,255,1)"
        },
        {
          color: "#7df14a",
          textShadow:
            "0px 0px 6px rgba(255,255,255,0), 0px 0px 15px rgba(255,255,255,0)",
          duration: 0.45,
          stagger: 0.05
        },
        "<"
      )
      .add(
        function () {
          this.key_sound.play();
        }.bind(this),
        "<"
      )
      .add(
        function () {
          this.key_sound.stop();
        }.bind(this),
        "-=0.25"
      );
    if (this.has_underline) {
      tl.set(this.underline_elm, { opacity: 1 }, "<");
    }
    return tl;
  } //animate
} //Line

class LineBreak {
  constructor(opts) {
    this.line_container = opts.line_container;
    this.build();
  }
  build() {
    this.line_elm = document.createElement("div");
    this.line_elm.classList.add("line");
    this.copy_elm = document.createElement("div");
    this.copy_elm.innerHTML = "&nbsp;";

    this.line_elm.appendChild(this.copy_elm);

    this.line_container.appendChild(this.line_elm);
  }
  animate() {
    return gsap.timeline().set(this.line_elm, { display: "grid" });
  }
} //LineBreak

class ClearScreen {
  constructor(opts) {
    this.mother_container_elm = opts.mother_container_elm;
    this.line_container = opts.line_container;
    this.beep_sound = opts.beep_sound || null;
    this.build();
  }
  build() {
    this.root_elm = document.createElement("div");
    this.root_elm.classList.add("clear_screen_container");
    this.mother_container_elm.appendChild(this.root_elm);

    this.top_elm = document.createElement("div");
    this.bottom_elm = document.createElement("div");

    this.root_elm.appendChild(this.top_elm);
    this.root_elm.appendChild(this.bottom_elm);

    gsap.set(this.root_elm, {
      display: "grid",
      position: "fixed",
      left: 0,
      top: 0,
      width: "100vw",
      height: "100vh",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "1fr 1fr",
      opacity: 0
    });
    gsap.set([this.top_elm, this.bottom_elm], {
      backgroundColor: "#80ff10",
      opacity: 0
    });
  } //build
  animate() {
    let tl = gsap
      .timeline()
      .add(
        function () {
          if (this.beep_sound) {
            let s = this.beep_sound.clone();

            s.on(
              "end",
              function () {
                s._events.end.pop();
                s.disconnect();
                s = null;
              }.bind(this)
            );
            s.play();
            s.sourceNode.playbackRate.value = gsap.utils.random(0.9, 1.5);
          }
          let lines = this.mother_container_elm.querySelectorAll(".line, .boot_screen");
          lines.forEach(
            function (l) {
              gsap.set(l, { display: "none" });
            }.bind(this)
          );
        }.bind(this)
      )
      .set(this.root_elm, { opacity: 1 })
      .set([this.top_elm, this.bottom_elm], { opacity: 1, stagger: 0.05 })
      .set([this.top_elm, this.bottom_elm], {
        opacity: 0,
        stagger: 0.05,
        delay: 0.1
      });
    return tl;
  } //animate
} //ClearScreen


class BootScreen {
  constructor(opts) {
    this.num_bars = 12;
    this.num_lines = 26;
    this.line_sections = 4;
    this.details_screen_data = [
      [{copy:'APOLLO CORE STARTUP',col_span:2}],
      [{copy:'RESET PRIORITY COMMANDS', col_span:2}, {copy:'1990'}, {copy:'90'}],
      [{copy:'SEEGSON PROFILE DELETED', col_span:2}, {copy:'0000'}, {copy:'X-RW-W'}],
      [{copy:'ADMINISTRATION'}, {copy:'1023'}],
      [{copy:'SECURITY CLEARANCE <span>N 1</span>',col_span:2}, {copy:'T'},{copy:'90'}],
      [{copy:'WEYLAND YUTANI'}, {copy:'SUBSYSTEM ONLINE'}],
      [{copy:'SET <span>R</span>'}, {copy:'OVERRIDE'}, {copy:'Y N'}, {copy:'Y'}],
      [{copy:'REBOOT COMPLETE'}, {copy:'Y'}]
    ];
    this.chars = [
      "A",
      "X",
      "Y",
      "I",
      "@",
      "2",
      "0",
      "K",
      "5",
      "9",
      "V",
      "D",
      "H",
      "%",
      "}",
      "#",
      "U",
      "1",
      "^",
      ">",
      "+",
      "E"
    ];
    this.boot_sound = opts.boot_sound || null;
    this.detail_beep_sound = opts.detail_beep_sound || null;
    this.mother_container_elm = document.querySelector("#mother_container");
    this.build();
  } //constructor
  
  build() {
    this.root_elm = document.createElement("div");
    this.root_elm.classList.add("boot_screen");
    gsap.set(this.root_elm,{
      display:'grid',
      gridTemplateRows:'1fr',
      gridTemplateColumns:'1fr',
      alignItems:'center',
      justifyItems:'center'
    })

    this.random_chars_screen = document.createElement("div");
    this.random_chars_screen.classList.add("random_chars_screen");
    gsap.set(this.random_chars_screen,{
      width:'75vw',
      height:'50vh',
      position:'relative',
      overflow:'hidden',
      gridRow:1,
      gridColumn:1
    })
 
    this.root_elm.appendChild(this.random_chars_screen);

    gsap.set(this.root_elm, {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%"
    });
    this.line_elms = [];
    this.line_section_elms = [];
    for (var i = 0; i < this.num_lines; i++) {
      let line_elm = document.createElement("div");
      line_elm.classList.add("line_elm");
      line_elm.classList.add(`line_elm_${i}`);
      gsap.set(line_elm, { display: "grid", gridTemplateRows: "1fr" });
      for (var n = 0; n < this.line_sections; n++) {
        let sec = document.createElement("div");
        gsap.set(sec,{
          display:'inline-block',
          opacity:0,
          gridRow:1,
          fontSize:'2vh',
          justifySelf:gsap.utils.random(['start','end','center'])
        });
        sec.classList.add("section");
        let char = gsap.utils.random(this.chars);
        sec.innerHTML = `<span class='char'>${char}</span><span class='char'>${char}</span><span class='char'>${char}</span><span class='char'>${char}</span><span class='char'>${char}</span><span class='char'>${char}</span><span class='char'>${char}</span><span class='char'>${char}</span>`;
        line_elm.appendChild(sec);
        gsap.set(sec.querySelectorAll('.char'),{opacity:0});
        gsap.set([...sec.querySelectorAll('.char')].slice(0, gsap.utils.random(2,7)),{opacity:1});
        this.line_section_elms.push(sec);
      } //for line section
      this.random_chars_screen.appendChild(line_elm);
      this.line_elms.push(line_elm);
    } //for line nums
    for(var ls = 0; ls < (this.line_section_elms.length/3); ls++){
      let lse = gsap.utils.random(this.line_section_elms);
      gsap.set(lse,{opacity:1});
    }//for
    
    //front bars
    this.bars_container = document.createElement('div');
    this.bars_container.classList.add('bars_container');
    gsap.set(this.bars_container,{position:'absolute', left:0, top:0, width:'100%', height:'100%'})
    this.random_chars_screen.appendChild(this.bars_container);
    
    this.bars_elm = [];
    for(var b = 0; b < this.num_bars; b++){
      let bar_elm = document.createElement('div');
      bar_elm.classList.add('bar_elm');
      this.bars_container.appendChild(bar_elm);
      
      let bar_glow = document.createElement('div');
      bar_glow.classList.add('bar_glow');
      bar_elm.appendChild(bar_glow);
      
      gsap.set(bar_elm,{
        background:'#80ff10',
        '--glow-opacity':0,
        width:"random(15,100)%",
        height:"random(1,2)%",
        position:'absolute',
        top:"random(0,100)%",
        left:"random(-25,75)%",
        opacity:0
      });
      
      gsap.set(bar_glow,{
        width:'100%',
        height:'100%',
        boxShadow:'0px 0px 5px #80ff10, 0px 0px 15px #80ff10, 0px 0px 20px #80ff10',
        opacity:'var(--glow-opacity)'
      })
      
      this.bars_elm.push(bar_elm);
    }//for this.num_bars
    //end front bars
    
    //detail screen
    this.details_screen = document.createElement('div');
    this.details_screen.classList.add('details_screen');
    gsap.set(this.details_screen,{
      display: 'grid',
      gridTemplateRows: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
      gridTemplateColumns: '1fr',
      gridRow: 1,
      gridColumn: 1,
      width:'75vw',
      height:'50vh',
      textTransform:'uppercase',
      fontSize:'1.1vh'
    })
    
    
    this.details_screen_data.forEach(function(detail_line){
      let d_line = document.createElement('div');
      d_line.classList.add('detail_line');
      
      gsap.set(d_line,{'--text-shadow-opacity': 0});
       
      // let shadow_string = '0px 0px 5px rgba(50,100,6,var(--text-shadow-opacity))';
      // for(var i = 0; i < 18; i++){
      //   shadow_string += `, 0px 0px ${5 * (i+1)}px rgba(50,100,6,var(--text-shadow-opacity))`
      // }//for
      // gsap.set(d_line,{textShadow: shadow_string});
      
      gsap.set(d_line, {fontSize:'2.2vh',display:'grid', gridGap:'1vw', gridTemplateColumns:`1fr 1fr 1fr 1fr`,  alignItems:'center'})
      detail_line.forEach(function(line_data,index){//cols
        let copy = line_data.copy;
        let detail_copy_elm = document.createElement('div');
        detail_copy_elm.classList.add('detail_copy');
        detail_copy_elm.innerHTML = copy;
        if(line_data.col_span){
          gsap.set(detail_copy_elm,{gridColumn:`${index+1} / span ${line_data.col_span}`})
        }
        d_line.appendChild(detail_copy_elm);
        
      }.bind(this))
      this.details_screen.appendChild(d_line);
    }.bind(this));
        
    this.root_elm.prepend(this.details_screen);
    
    this.details_splitting = new SplitText(this.details_screen, { type: "words,chars",charsClass:'char' });
    
    this.mother_container_elm.appendChild(this.root_elm);
  } //build
  
  detailsScreenAnimation(){
     let tl = gsap.timeline();
     this.details_screen.querySelectorAll('.detail_line').forEach(function(line_elm,index){
      tl.set(line_elm,{'--text-shadow-opacity':0});
      tl.fromTo(line_elm.querySelectorAll('.char'),{
        opacity:0
      },{
        opacity:1,
        stagger:0.01,
        duration:0.01,
        onComplete:function(){
          
          gsap.fromTo(line_elm,
            {'--text-shadow-opacity':1},
            {
              '--text-shadow-opacity':0,
              duration:1,
              ease:'expo.out'
            })
          
            if (this.detail_beep_sound) {
              let s = this.detail_beep_sound.clone();

              s.on(
                "end",
                function () {
                  s._events.end.pop();
                  s.disconnect();
                  s = null;
                }.bind(this)
              );
              s.play();
              s.sourceNode.playbackRate.value = gsap.utils.random(0.9, 1.5);
            }
        }.bind(this)
      });// tl.fromTo


     }.bind(this))//.('.detail_line').forEach
    
    tl.fromTo(this.random_chars_screen.querySelectorAll('.line_elm'),{opacity:1},{opacity:0,duration:0.01,stagger:0.1},0)
        
    return tl;
  }//detailsScreenAnimation
  
  
  barsAnimation(){
    this.bar_tl = gsap.timeline({repeatRefresh:true})
    
    this.bars_elm.forEach(function(bar_elm){
      let b_tl = gsap.timeline({repeatRefresh:true,repeat:-1})
      b_tl.set(bar_elm,{
        width:"random(15,100)%",
        height:"random(1,2)%",
        top:"random(0,100)%",
        left:"random(-25,75)%",
      })
      b_tl.to(bar_elm,{opacity:1,'--glow-opacity':1,delay:"random(0,2.5)",duration:0.05,ease:'expo.out'})
      b_tl.to(bar_elm,{opacity:0, '--glow-opacity':0,duration:"random(0.2,0.5)"})
      this.bar_tl.add(b_tl,0)
    }.bind(this));//this.bars_elm.forEach
    
    return this.bar_tl;
  }//barsAnimation
  
  charsBGAnimation(){
    this.chars_tl =  gsap.timeline({repeat:-1,repeatRefresh:true})
    .set(this.line_section_elms,{opacity:0,delay:0.1})
    .add(function(){
      for(var ls = 0; ls < (this.line_section_elms.length/gsap.utils.random(3,4,1)); ls++){
        let lse = gsap.utils.random(this.line_section_elms);
        gsap.set(lse,{
          opacity: 1,
          justifySelf: gsap.utils.random(['start','end','center'])
        });
      }//for
    }.bind(this));
    return this.chars_tl;
  }//charsBGAnimation
  
 
  animate(){
    let tl = gsap.timeline()
    .add(function(){
      this.boot_sound.play();
      gsap.set(this.root_elm,{display:'grid'})
      gsap.set(this.bars_container,{opacity:1})
      this.charsBGAnimation();
      this.barsAnimation();
    }.bind(this))
    .add(this.detailsScreenAnimation(),2)
    .add(function(){
      this.chars_tl.pause();
      this.bar_tl.pause();
      gsap.set(this.bars_container,{opacity:0})
    }.bind(this),'-=0.15')
    return tl;
  }//animate
  
} //BootScreen


class Mother {
  constructor(opts) {
    this.lines_container = document.querySelector("#lines_container");
    this.mother_container_elm = document.querySelector("#mother_container");
    this.lines_copy_array = opts.lines_copy_array || ["HELLO WORLD!!"];
    this.cmd_seq = opts.cmd_seq || [{ type: "line", copy: "HELLO WORLD!" }];
    this.type_src =
      opts.type_src || "https://assets.codepen.io/927237/alien_keys.mp3";
    this.beep_src =
      opts.beep_src || "https://assets.codepen.io/927237/beep.wav";
    this.boot_src =
      opts.boot_src || "https://assets.codepen.io/927237/boot.mp3";
    this.detail_beep_src = opts.detail_beep_src || "https://assets.codepen.io/927237/detail_beep.mp3";
    this.lines = [];
    this.cmds = [];
    this.master_tl = gsap.timeline({ paused: true, repeat: -1 });
    this.build();
  }

  build(){
    this.start_button = document.createElement('div');
    this.start_button.classList.add('start_button');
    this.start_button.innerHTML = '<span>BOOT</span>';
    gsap.set(this.start_button,{
      border:'1px solid #80ff10',
      display:'grid',
      alignItems:'center',
      justifyItems:'center',
      fontSize:'3.5vh',
      padding:'15px',
      boxSizing:'border-box',
      cursor:'pointer'
    });
    this.mother_container_elm.appendChild(this.start_button);
    
    this.start_button.addEventListener('click',function(e){
      gsap.set(this.start_button,{display:'none'})
      this.loadAndPlay();
    }.bind(this));
    
    this.start_button.addEventListener('mouseover',function(e){
      gsap.set(this.start_button,{border:'1px solid transparent', color:'#000',background:'#80ff10'})
    }.bind(this))
    this.start_button.addEventListener('mouseout',function(e){
      gsap.set(this.start_button,{border:'1px solid #80ff10', color:'#80ff10',background:'transparent'})
    }.bind(this))
  }//build
  
  load() {
    let kp_f = function (resolve) {
      this.key_sound = new Pz.Sound(
        {
          source: "file",
          options: { path: this.type_src, loop: true,volume: 0.1 }
        },
        resolve
      );
    };

    let bp_f = function (resolve) {
      this.beep_sound = new Pz.Sound(
        {
          source: "file",
          options: { path: this.beep_src, volume: 0.1 }
        },
        resolve
      );
    };
    
    let bo_f = function (resolve) {
      this.boot_sound = new Pz.Sound(
        {
          source: "file",
          options: { path: this.boot_src, volume: 0.08 }
        },
        resolve
      );
    };
    
    let db_f = function (resolve) {
      this.detail_beep_sound = new Pz.Sound(
        {
          source: "file",
          options: { path: this.detail_beep_src, volume: 0.05 }
        },
        resolve
      );
    };

    let kp = new Promise(kp_f.bind(this));
    let bp = new Promise(bp_f.bind(this));
    let bop = new Promise(bo_f.bind(this));
    let dbp = new Promise(db_f.bind(this));
    return Promise.all([kp, bp, bop, dbp]);
  } //load

  buildSeq() {
    console.log("starting seq", this);
    let default_line_opts = {
      line_container: this.lines_container,
      key_sound: this.key_sound,
      has_underline: false
    };
    let clear_screen_opts = {
      line_container: this.lines_container,
      mother_container_elm: this.mother_container_elm,
      beep_sound: this.beep_sound
    };
    
    let boot_screen_opts = {
      boot_sound: this.boot_sound,
      detail_beep_sound: this.detail_beep_sound
    };
    this.cmd_seq.forEach(
      function (cmd, index) {
        let c = null;
        switch (cmd.type) {
          case "line":
            c = new Line(Object.assign({}, default_line_opts, cmd));
            break;
          case "clear":
            c = new ClearScreen(Object.assign({}, clear_screen_opts, cmd));
            break;
          case "linebreak":
            c = new LineBreak({ line_container: this.lines_container });
            break;
          case "boot":
            c = new BootScreen(boot_screen_opts);
            break;
          case "delay":
            c = {
              animate: function () {
                return gsap.fromTo(
                  { v: 0 },
                  { v: 0 },
                  { v: 1, duration: cmd.t || 1 }
                );
              }
            };
            break;
          default:
        } //switch
        this.master_tl.add(c.animate.apply(c));
      }.bind(this) //function
    ); //this.cmd_seq.forEach
    this.master_tl.play();
  } //buildSeq

  loadAndPlay() {
    this.load().then(this.buildSeq.bind(this)); 
  } //loadAndPlay
} //Mother

let mother = new Mother({
  cmd_seq: [
    { type: "boot" },
    { type: "delay", t: 2 },
    { type: "clear" },
    {
      type: "line",
      copy: "INTERFACE 2037 READY FOR INQUIRY",
      has_underline: true
    },
    { type: "linebreak" },
    { type: "line", copy: "REQUEST CLARIFICATION ON" },
    {
      type: "line",
      copy: "SCIENCE INABILITY TO NEUTRALIZE ALIEN",
      delay: -0.5,
      has_underline: true
    },
    { type: "delay", t: 1 },
    { type: "linebreak" },
    { type: "line", copy: "UNABLE TO CLARIFY", has_underline: true },
    { type: "delay", t: 2 },
    { type: "clear" },

    { type: "line", copy: "REQUEST ENHANCEMENT", has_underline: true },
    { type: "linebreak" },
    { type: "delay", t: 1 },
    { type: "line", copy: "NO FURTHER ENHANCEMENT" },
    { type: "line", copy: "SPECIAL ORDER 937" },
    { type: "line", copy: "SCIENCE OFFICER EYES ONLY", has_underline: true },

    { type: "delay", t: 2 },
    { type: "clear" },

    { type: "line", copy: "EMERGENCY COMMAND OVERRIDE 100375" },
    { type: "line", copy: "WHAT IS SPECIAL ORDER 937", has_underline: true },
    { type: "delay", t: 2 },
    { type: "clear" },

    { type: "line", copy: "NOSTROMO REROUTED" },
    { type: "line", copy: "TO NEW CO-ORDINATES." },
    { type: "line", copy: "INVESTIGATE LIFE FORM. GATHER SPECIMEN." },

    { type: "delay", t: 2 },
    { type: "clear" },

    { type: "line", copy: "PRIORITY ONE" },
    { type: "line", copy: "INSURE RETURN OF ORGANISM" },
    { type: "line", copy: "FOR ANALYSIS.", delay: -0.5 },
    { type: "line", copy: "ALL OTHER CONSIDERATIONS SECONDARY." },
    { type: "line", copy: "CREW EXPENDABLE." },
    { type: "delay", t: 2 },
    { type: "clear" },
    { type: "clear" },
    { type: "clear" }
  ]
});