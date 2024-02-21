
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

    this.underline_elm = document.createElement("div");
    this.underline_elm.classList.add("underline");

    this.copy_elm.appendChild(this.underline_elm);

    // this.animate();
  } //build
}

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

  } //build
   //animate
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

    this.random_chars_screen = document.createElement("div");
    this.random_chars_screen.classList.add("random_chars_screen");
 
    this.root_elm.appendChild(this.random_chars_screen);

    this.line_elms = [];
    this.line_section_elms = [];
    for (var i = 0; i < this.num_lines; i++) {
      let line_elm = document.createElement("div");
      line_elm.classList.add("line_elm");
      line_elm.classList.add(`line_elm_${i}`);
      
      for (var n = 0; n < this.line_sections; n++) {
        let sec = document.createElement("div");
        sec.classList.add("section");
        sec.innerHTML = `<span class='char'>${char}</span><span class='char'>${char}</span><span class='char'>${char}</span><span class='char'>${char}</span><span class='char'>${char}</span><span class='char'>${char}</span><span class='char'>${char}</span><span class='char'>${char}</span>`;
        line_elm.appendChild(sec);
        this.line_section_elms.push(sec);
      } //for line section
      this.random_chars_screen.appendChild(line_elm);
      this.line_elms.push(line_elm);
    } //for line nums


    //front bars
    this.bars_container = document.createElement('div');
    this.bars_container.classList.add('bars_container');
    this.random_chars_screen.appendChild(this.bars_container);
    
    this.bars_elm = [];
    for(var b = 0; b < this.num_bars; b++){
      let bar_elm = document.createElement('div');
      bar_elm.classList.add('bar_elm');
      this.bars_container.appendChild(bar_elm);
      
      let bar_glow = document.createElement('div');
      bar_glow.classList.add('bar_glow');
      bar_elm.appendChild(bar_glow);
          
      this.bars_elm.push(bar_elm);
    }//for this.num_bars
    //end front bars
    
    //detail screen
    this.details_screen = document.createElement('div');
    this.details_screen.classList.add('details_screen');
    
    this.details_screen_data.forEach(function(detail_line){
      let d_line = document.createElement('div');
      d_line.classList.add('detail_line');
      
    

      detail_line.forEach(function(line_data,index){//cols
        let copy = line_data.copy;
        let detail_copy_elm = document.createElement('div');
        detail_copy_elm.classList.add('detail_copy');
        detail_copy_elm.innerHTML = copy;

        d_line.appendChild(detail_copy_elm);
        
      }.bind(this))
      this.details_screen.appendChild(d_line);
    }.bind(this));
        
    this.root_elm.prepend(this.details_screen);
    
    this.details_splitting = new SplitText(this.details_screen, { type: "words,chars",charsClass:'char' });
    
    this.mother_container_elm.appendChild(this.root_elm);
  } //build
  
  detailsScreenAnimation(){
     this.details_screen.querySelectorAll('.detail_line').forEach(function(line_elm,index){
      tl.set(line_elm,{'--text-shadow-opacity':0});
      tl.fromTo(line_elm.querySelectorAll('.char'),{
        opacity:0
      },{
        opacity:1,
        stagger:0.01,
        duration:0.01,
        onComplete:function(){
          
          
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
            }
        }.bind(this)
      });// tl.fromTo


     }.bind(this))//.('.detail_line').forEach
    
    tl.fromTo(this.random_chars_screen.querySelectorAll('.line_elm'),{opacity:1},{opacity:0,duration:0.01,stagger:0.1},0)
        
    return tl;
  }//detailsScreenAnimation
  

  
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
    this.build();
  }

  build(){
    this.start_button = document.createElement('div');
    this.start_button.classList.add('start_button');
    this.start_button.innerHTML = '<span>BOOT</span>';
    
    this.mother_container_elm.appendChild(this.start_button);
    
    this.start_button.addEventListener('click',function(e){
      
      this.loadAndPlay();
    }.bind(this));
    
    this.start_button.addEventListener('mouseover',function(e){
      
    }.bind(this))
    this.start_button.addEventListener('mouseout',function(e){
      
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