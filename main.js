/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/

"use strict";

/* <Animation template> */

var update_fps = function() {
    fps.innerHTML = Math.round(1000/(Date.now()-now));
    now = Date.now();
};

var init_fps = function() {
    fps = document.createElement("a");
    fps.style.color = "lime";
    document.body.appendChild(fps);
    now = Date.now();
};

var init_canvas = function() {
    c   = document.getElementById("cvs");
    ctx = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    W = window.innerWidth;
    H = window.innerHeight;
};


var pull_loop = function() {
    main_loop.update();
    requestAnimationFrame(pull_loop);
};

var main = function() {
    update_fps();
    update();
    clear();
    draw();
};


var clear = function() {
    c.width = c.width;
};


window.onload = function() {
    init_fps();
    init_canvas();
    setup();
    main_loop = new Interval(main, 16);
    requestAnimationFrame(pull_loop);
    // setInterval(main, 16)
};

/* </Animation template> */






/* <Game loop> */

var main_loop, fps, now, c, ctx, W, H;

var map, mage;
var coins = [], coin_ref;
var enemies = [];
var mana = 8, health = 8;
var joystick_divs;
var use_joystick = true;
var paused = false;
var minimap, joystick;

var setup = () => {
    map = new Map();
    joystick = new Joystick();
    mage = new Mage();
    
    init_map(map);
    
    mage.set_cycle(data.mage.idle);
    add_event_listeners();
    coin_ref = create_coin_counter();
    
    mana_container.show();
    health_container.show();
    questionmark.show();
    
    update_stats();
    
    load_level(level);
    minimap = new Minimap(map, minimap_colors);
};

var update = () => {  
    // mage.update();
    map.update();
    handle_mage_at_screen_edges();
    handle_mage_collisions();
    handle_mage_coins_collisions();
    handle_bullet_collision();
    handle_enemy_collision();
};

var draw = () => {
    map.update_animation();
    map.draw();
    minimap.draw();
    // for(var i in coins) coins[i].draw();
    // for(var i in enemies) enemies[i].draw();
    // for(var i in mage_bullets) mage_bullets[i].draw();
};

/* </Game loop> */


































var link = "https://i.ibb.co/VxTkPJJ/mage-sprite-8.png";


/* <Toast messages> */

var toast = new Element({
    background: "grey", color: "#fff",
    left: "50%", bottom: "10vh", position: "absolute",
    transform: "translate(-50%, 0)",
    padding: "5px 10px 5px 10px", borderRadius: "5px",
    zIndex: "100",
});

toast.apply_design({
    top: "10vh", bottom: ""
});


/* </Toast messages> */


/* <Coin display> */

var create_coin_counter = function() {
    var div = new Element({
        background: "url("+link+")",
        backgroundPosition: "0 -256px",
        backgroundSize: "512px 512px",
        width: "32px", height: "32px", textAlign: "center",
        lineHeight: "39px", color: "#000", fontWeight: "bold",
        position: "fixed", top: "0", right: "0",
    });
    div.text = coin_counter;
    div.show();
    
    div.add_event_listener( "click" , function() {
        shop_container.fade_in();
        shop_container.appendChild(shop_exit);
        shop_exit.show();
        pause();
    });
    
    return div;
};

/* </Coin display> */


/* <Info display> */

var questionmark = new Element({
    background: "url("+link+")",
    backgroundPosition: "-288px -256px",
    backgroundSize: "512px 512px",
    width: "32px", height: "32px", textAlign: "center",
    lineHeight: "39px", color: "#000", fontWeight: "bold",
    position: "fixed", top: "40px", right: 0,
});

questionmark.add_event_listener( "click" , function() {
    toast.makeToast("Try to defeat all enemies!");
});

/* </Info display> */


/* <Stats> */

var mana_container = new Element({
    width: "96px", height: "32px", position: "fixed",
    right: "40px", top: "0"
});
var mana_left = new Element({
    width: "32px", height: "32px",
    backgroundImage: "url("+link+")",
    backgroundSize: "512px 512px",
});
var mana_middle = new Element({
    width: "32px", height: "32px",
    left: "32px", position: "absolute", top: "0",
    backgroundImage: "url("+link+")",
    backgroundSize: "512px 512px",
});
var mana_right = new Element({
    width: "32px", height: "32px",
    left: "64px", position: "absolute", top: "0",
    backgroundImage: "url("+link+")",
    backgroundSize: "512px 512px",
});

mana_container.appendChild(mana_left);
mana_container.appendChild(mana_middle);
mana_container.appendChild(mana_right);


var health_container = new Element({
    width: "96px", height: "32px", position: "fixed",
    right: "140px", top: "0"
});
var health_left = new Element({
    width: "32px", height: "32px",
    backgroundImage: "url("+link+")",
    backgroundSize: "512px 512px",
});
var health_middle = new Element({
    width: "32px", height: "32px",
    left: "32px", position: "absolute", top: "0",
    backgroundImage: "url("+link+")",
    backgroundSize: "512px 512px",
});
var health_right = new Element({
    width: "32px", height: "32px",
    left: "64px", position: "absolute", top: "0",
    backgroundImage: "url("+link+")",
    backgroundSize: "512px 512px",
});

health_container.appendChild(health_left);
health_container.appendChild(health_middle);
health_container.appendChild(health_right);




var set_mana = function(value /* 0-8 */) {
    if(value === 0) {
        mana_left.div.style.backgroundPosition = "-96px -320px";
        mana_right.div.style.backgroundPosition = "-352px -320px";
        mana_middle.div.style.backgroundPosition = "-256px -320px";
    }
    if(value === 1) {
        mana_left.div.style.backgroundPosition = "-64px -320px";
        mana_right.div.style.backgroundPosition = "-352px -320px";
        mana_middle.div.style.backgroundPosition = "-256px -320px";
    }
    if(value === 2) {
        mana_left.div.style.backgroundPosition = "-32px -320px";
        mana_right.div.style.backgroundPosition = "-352px -320px";
        mana_middle.div.style.backgroundPosition = "-256px -320px";
    }
    if(value === 3) {
        mana_left.div.style.backgroundPosition = "-32px -320px";
        mana_right.div.style.backgroundPosition = "-352px -320px";
        mana_middle.div.style.backgroundPosition = "-224px -320px";
    }
    if(value === 4) {
        mana_left.div.style.backgroundPosition = "-32px -320px";
        mana_right.div.style.backgroundPosition = "-352px -320px";
        mana_middle.div.style.backgroundPosition = "-192px -320px";
    }
    if(value === 5) {
        mana_left.div.style.backgroundPosition = "-32px -320px";
        mana_right.div.style.backgroundPosition = "-352px -320px";
        mana_middle.div.style.backgroundPosition = "-160px -320px";
    }
    if(value === 6) {
        mana_left.div.style.backgroundPosition = "-32px -320px";
        mana_right.div.style.backgroundPosition = "-352px -320px";
        mana_middle.div.style.backgroundPosition = "-128px -320px";
    }
    if(value === 7) {
        mana_left.div.style.backgroundPosition = "-32px -320px";
        mana_right.div.style.backgroundPosition = "-320px -320px";
        mana_middle.div.style.backgroundPosition = "-128px -320px";
    }
    if(value === 8) {
        mana_left.div.style.backgroundPosition = "-32px -320px";
        mana_right.div.style.backgroundPosition = "-288px -320px";
        mana_middle.div.style.backgroundPosition = "-128px -320px";
    }
};


var set_health = function(value /* 0-8 */) {
    if(value === 0) {
        health_left.div.style.backgroundPosition = "-96px -352px";
        health_right.div.style.backgroundPosition = "-352px -352px";
        health_middle.div.style.backgroundPosition = "-256px -352px";
    }
    if(value === 1) {
        health_left.div.style.backgroundPosition = "-64px -352px";
        health_right.div.style.backgroundPosition = "-352px -352px";
        health_middle.div.style.backgroundPosition = "-256px -352px";
    }
    if(value === 2) {
        health_left.div.style.backgroundPosition = "-32px -352px";
        health_right.div.style.backgroundPosition = "-352px -352px";
        health_middle.div.style.backgroundPosition = "-256px -352px";
    }
    if(value === 3) {
        health_left.div.style.backgroundPosition = "-32px -352px";
        health_right.div.style.backgroundPosition = "-352px -352px";
        health_middle.div.style.backgroundPosition = "-224px -352px";
    }
    if(value === 4) {
        health_left.div.style.backgroundPosition = "-32px -352px";
        health_right.div.style.backgroundPosition = "-352px -352px";
        health_middle.div.style.backgroundPosition = "-192px -352px";
    }
    if(value === 5) {
        health_left.div.style.backgroundPosition = "-32px -352px";
        health_right.div.style.backgroundPosition = "-352px -352px";
        health_middle.div.style.backgroundPosition = "-160px -352px";
    }
    if(value === 6) {
        health_left.div.style.backgroundPosition = "-32px -352px";
        health_right.div.style.backgroundPosition = "-352px -352px";
        health_middle.div.style.backgroundPosition = "-128px -352px";
    }
    if(value === 7) {
        health_left.div.style.backgroundPosition = "-32px -352px";
        health_right.div.style.backgroundPosition = "-320px -352px";
        health_middle.div.style.backgroundPosition = "-128px -352px";
    }
    if(value === 8) {
        health_left.div.style.backgroundPosition = "-32px -352px";
        health_right.div.style.backgroundPosition = "-288px -352px";
        health_middle.div.style.backgroundPosition = "-128px -352px";
    }
};

var update_stats = function() {
    set_mana(mana); set_health(health);
    if(health < 0) {
        level = 1, health = 8, mana = 8, coin_counter = 0;
        coin_ref.innerHTML = 0;
        update_stats();
        toast.makeToast("Game Over", 1000);
        setTimeout(function() {
            load_level(level);
        },50);
    }
};

/* </Stats> */





/* <Shop> */

var prices = {
    hp: 10, mp: 1
};



function ScrollSelector(width, height, values, callback) {
    var container = new Element({
        scrollSnapType: "y mandatory",
        overflowX: "hidden", overflowY: "scroll",
        width: width+"px", height: height+"px",
        borderRadius: "10px"
    });
    
    var tabs = [];
    for(var i = 0; i < values.length; i++) {
        var value = values[i];
        var tab = new Element({
            width: width+"px", height: height/2+"px",
            background: "white", color: "black",
            lineHeight: height/2+7+"px", textAlign: "center",
            overflow: "hidden", scrollSnapAlign: "center"
        });
        tab.text = value;
        tab.div.setAttribute("value", value);
        container.appendChild(tab);
        tabs.push(tab);
        
        if(i === 0) tab.div.style.borderTop = height/4+"px solid white";
        if(i === values.length-1) tab.div.style.borderBottom = height/4+"px solid white";
    }
    
    container.add_event_listener("scroll", function() {
        var s = container.div.scrollTop;
        var i = s/(height/2);
        if(i % 1 === 0) {
            container.value = values[i];
            for(var j in tabs) tabs[j].div.style.fontWeight = "lighter";
            tabs[i].div.style.fontWeight = "bolder";
            callback(container.value);
        }
    });
    
    
    container.value = values[0];
    for(var j in tabs) tabs[j].div.style.fontWeight = "lighter";
    tabs[0].div.style.fontWeight = "bolder";
            
    container.tabs = tabs;
    
    return container;
}





var shop_exit = new Element({
    width: "30px", height: "30px",
    position: "absolute", right: "10px",
    top: "10px", background: "red",
    color: "#fff", borderRadius: "5px"
});
shop_exit.text = "<svg width='30px' height='30px'><path"+
" d='M7 7 l16 16 M23 7 L7 23' stroke='white' stroke-width"+
"='5'></path></svg>";

shop_exit.add_event_listener( "click" , function() {
    shop_exit.remove();
    shop_container.fade_out();
    resume();
});


var shop_container = new Element({
    width: "180px",
    height: "150px",
    background: "rgba(255,255,255,0.5)",
    borderRadius: "20px", position: "fixed",
    left: "50%", top: "50%",
    transform: "translate(-50%, -50%)"
});

var shop_mana_container = new Element({
    height: "50px",
    width: "110px",
    position: "fixed",
    left: "20px", top: "20px",
});

var shop_health_container = new Element({
    height: "50px",
    width: "110px",
    position: "fixed",
    left: "20px", top: "80px",
});

var mana_selector = new ScrollSelector(50, 50, [1,2,3,4,5], function(v) {
    mana_selector.remove();
    shop_mana_container.appendChild(shop_mana_potion);
    shop_mana_potion.text = v;
    shop_mana_coin.text = v*prices.mp;
});

var shop_mana_potion = new Element({
    width: "50px", height: "50px",
    left: "0", position: "absolute", top: "0",
    backgroundImage: "url("+link+")",
    backgroundSize: "800px 800px",
    backgroundPosition: "0 -500px",
    lineHeight: "72px", color: "#000",
    textAlign: "center", fontWeight: "bolder"
}); shop_mana_potion.text = 1;
shop_mana_potion.add_event_listener( "click" , function() {
    shop_mana_potion.remove();
    shop_mana_container.appendChild(mana_selector);
});

var shop_mana_coin = new Element({
    width: "50px", height: "50px",
    left: "60px", position: "absolute", top: "0",
    backgroundImage: "url("+link+")",
    backgroundSize: "800px 800px",
    backgroundPosition: "0 -400px",
    lineHeight: "57px", color: "#000",
    textAlign: "center", fontWeight: "bolder"
}); shop_mana_coin.text = 1*prices.mp;
shop_mana_coin.add_event_listener( "click" , function() {
    if(coin_counter >= parseInt(shop_mana_coin.text) &&
    mana <= 8-parseInt(shop_mana_potion.text)) {
        coin_counter -= parseInt(shop_mana_coin.text);
        mana += parseInt(shop_mana_potion.text);
        update_stats();
        coin_ref.text = coin_counter;
    }
});


shop_mana_container.appendChild(shop_mana_potion);
shop_mana_container.appendChild(shop_mana_coin);




var health_selector = new ScrollSelector(50, 50, [1,2,3], function(v) {
    health_selector.remove();
    shop_health_container.appendChild(shop_health_potion);
    shop_health_potion.text = v;
    shop_health_coin.text = v*prices.hp;
});

var shop_health_potion = new Element({
    width: "50px", height: "50px",
    left: "0", position: "absolute", top: "0",
    backgroundImage: "url("+link+")",
    backgroundSize: "800px 800px",
    backgroundPosition: "0 -550px",
    lineHeight: "72px", color: "#000",
    textAlign: "center", fontWeight: "bolder"
}); shop_health_potion.text = 1;
shop_health_potion.add_event_listener( "click" , function() {
    shop_health_potion.remove();
    shop_health_container.appendChild(health_selector);
});

var shop_health_coin = new Element({
    width: "50px", height: "50px",
    left: "60px", position: "absolute", top: "0",
    backgroundImage: "url("+link+")",
    backgroundSize: "800px 800px",
    backgroundPosition: "0 -400px",
    lineHeight: "57px", color: "#000",
    textAlign: "center", fontWeight: "bolder"
}); shop_health_coin.text = 1*prices.hp;
shop_health_coin.add_event_listener( "click" , function() {
    if(coin_counter >= parseInt(shop_health_coin.text) &&
    health <= 8-parseInt(shop_health_potion.text)) {
        coin_counter -= parseInt(shop_health_coin.text);
        health += parseInt(shop_health_potion.text);
        update_stats();
        coin_ref.text = coin_counter;
    }
});


shop_health_container.appendChild(shop_health_potion);
shop_health_container.appendChild(shop_health_coin);


shop_container.appendChild(shop_mana_container);
shop_container.appendChild(shop_health_container);
shop_container.appendChild(shop_exit);



/* </Shop> */









/*

use awd/arrow keys for movement and space for shooting or use touch...
most featured are designed for mobile/touch devices


 108 -  159:    Animation template
 166 -  219:    Game loop
 257 -  272:    Toast messages
 275 -  299:    Coin display
 302 -  317:    Info display
 320 -  488:    Stats
 494 -  691:    Shop
 717 -  788:    Sprite class
 801 -  925:    Mage class
 932 -  976:    Enemy class
 988 - 1020:    Projectile class
1035 - 1053:    Coin class
1059 - 1164:    Map class
1175 - 1441:    Minimap class
1462 - 1626:    Controls class
1647 - 1789:    DOM Elenment class
1814 - 1828:    Interval class
1833 - 1911:    Class functions
1945 - 1960:    Camera focus
1964 - 2007:    Block effects
2012 - 2090:    Mage - Block collision
2097 - 2115:    Mage - Coin collision
2122 - 2174:    Projectile collision
2178 - 2196:    Enemy collision
2255 - 2302:    Keyboard controls
2309 - 2405:    Map initialization
2416 - 2452:    Level loading
2460 - 2598:    Sprite + Level data
2601 - 2609:    Image slicing



 110 -  113:  [function]   update_fps
 115 -  120:  [function]   init_fps
 122 -  129:  [function]   init_canvas
 132 -  135:  [function]   pull_loop
 137 -  142:  [function]   main
 145 -  147:  [function]   clear
 179 -  198:  [function]   setup
 200 -  208:  [function]   update
 210 -  217:  [function]   draw
 277 -  297:  [function]   create_coin_counter
 378 -  424:  [function]   set_mana
 427 -  473:  [function]   set_health
 475 -  486:  [function]   update_stats
 502 -  547:  [class]      ScrollSelector
 720 -  786:  [class]      Sprite
 754 -  756:  [function]   update
 804 -  920:  [class]      Mage
 825 -  827:  [function]   min
 911 -  914:  [function]   reload
 934 -  969:  [class]      Enemy
 990 - 1015:  [class]      MageBullet
1037 - 1048:  [class]      Coin
1067 - 1162:  [class]      Map
1186 - 1439:  [class]      Minimap
1248 - 1278:  [function]   start
1280 - 1307:  [function]   move
1309 - 1322:  [function]   stop
1348 - 1356:  [function]   detailed_draw
1361 - 1425:  [function]   draw
1464 - 1624:  [class]      Joystick
1473 - 1475:  [function]   apply_design
1478 - 1602:  [function]   setup
1493 - 1602:  [constant]   W
1537 - 1554:  [function]   change_func
1556 - 1584:  [function]   start
1607 - 1616:  [function]   make_draggable
1618 - 1620:  [function]   is_targeted
1649 - 1775:  [class]      Element
1816 - 1826:  [class]      Interval
1835 - 1870:  [function]   spawn_enemies
1872 - 1885:  [function]   spawn_coins
1888 - 1894:  [function]   delete_all_coins
1896 - 1902:  [function]   delete_all_bullets
1904 - 1910:  [function]   delete_all_enemies
1924 - 1926:  [function]   pause
1928 - 1930:  [function]   resume
1934 - 1941:  [function]   equals
1947 - 1958:  [function]   handle_mage_at_screen_edges
1966 - 2004:  [function]   block_collisions
2014 - 2088:  [function]   handle_mage_collisions
2100 - 2113:  [function]   handle_mage_coins_collisions
2124 - 2172:  [function]   handle_bullet_collision
2180 - 2194:  [function]   handle_enemy_collision
2219 - 2223:  [function]   get_index
2226 - 2236:  [function]   get_indices
2238 - 2240:  [function]   choice
2242 - 2247:  [function]   get_id
2264 - 2272:  [function]   handle_keyboard
2275 - 2300:  [function]   add_event_listeners
2311 - 2403:  [function]   init_map
2419 - 2449:  [function]   load_level
2621 - 2622:  [function]   print


*/
















/* <Sprite class> */


function Sprite() {
    
    this.img = new Image();
    this.img.crossOrigin = "*";
    this.img.src = link;
    this.active_data;
    this.cycle_array;
    this.interval;
    
    this.blit = function(x,y,m) {
        var d = this.active_data;
        if(d && d[6] && !m || d && !d[6] && m) {
            ctx.setTransform(-1,0,0,1,x,y);
            ctx.drawImage(this.img, d[0], d[1], d[2], d[3],
                                   -d[5],   0,  d[4], d[5]);
            ctx.setTransform(1,0,0,1,0,0);
        } else if(d) {
            ctx.drawImage(this.img, d[0], d[1], d[2], d[3],
                                    x,    y,    d[4], d[5]);
        }
    };
    
    this.set_cycle = function(array, time, mirror) {
        time = time || 150;
        var cycle = [];
        for(var i in array) {
            var d = data.tiles[Math.abs(array[i])];
            if(array[i] < 0 || mirror) d = d.concat(true);
            cycle.push(d);
        }
        
        
        if(!equals(cycle,this.cycle_array)) {
            this.cycle_array = [-1,cycle];
            var update = () =>  {
                this.update_cycle(this.cycle_array);
            };
            update();
            // if(this.interval) this.interval.pause();
            this.animation_interval = new Interval(update,time);
        }
    };
    
    this.update_cycle = function(array) {
        var ca = array;
        this.cycle_array[0] = ca[0]>ca[1].length-2?0:ca[0]+1;
        this.active_data = ca[1][this.cycle_array[0]];
    };
    
    this.get_cycle = function(array) {
        var cycle = [];
        for(var i in array) {
            var d = data.tiles[Math.abs(array[i])];
            if(array[i] < 0) d = d.concat(true);
            cycle.push(d);
        }
        return cycle;
    };
    
    this.update_animation = function() {
        this.animation_interval.update();
    };
    
    this.update = function() {
        if(this.interval) this.interval.update();
    };
}

/* </Sprite class> */












/* <Mage class> */

var mage_bullets = [];
function Mage(scale) {
    Sprite.call(this);
    this.vel = {x:0, y:0};
    this.pos = {x:48, y:48};
    this.gravity = {x:0, y:0.5};
    this.friction = {x:1, y:1};
    this.size = 24;
    this.on_ground = false;
    this.at_wall = false;
    this.mirror = false;
    this.shot = false;
    this.invincible = false;
    this.in_double = false;
    this.in_air = true;
    var self = this;
    
    this.draw = function(x,y) {
        this.blit(x-this.size/2,
                  y-this.size/2, this.mirror);
    };
    
    var min = function(u, v) {
        return Math.abs(u) < v? u: u<0?-v:v;
    }; 
    
    this.update = function() {
        
        var keyboard = handle_keyboard(this);
        
        var dx = keyboard.dx || (joystick.right?1:joystick.left?-1:0);
        var dy = -keyboard.dy || 0;
        
        if(use_joystick && !paused) {
            this.vel.x = min(this.vel.x+dx/3, 3);
            if(dx === 0) this.vel.x *= 0.85;
            if(Math.abs(this.vel.x) < 0.1) this.vel.x = 0;
            
            if(dx > 0) this.mirror = false;
            if(dx < 0) this.mirror = true;
            
            
            if((joystick.jump || dy > 0) && (this.on_ground)) {
                this.jump(this.in_air?1.5:2);
            }
            
            if(this.vel.y > 0 && !this.in_double && (joystick.jump || dy > 0)) {
                this.in_double = true;
                this.jump(2);
            }
        
            this.vel.x += this.gravity.x*this.friction.x;
            
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;
            
            if(!this.on_ground) {
                this.vel.y += this.gravity.y*this.friction.y;
            } else {
                this.in_double = false;
                this.in_air = false;
            }
            
            if(this.at_wall) {
                this.in_double = false;
                this.in_air = false;
                if((dx > 0 || joystick.jump || dy > 0) && this.at_wall === "l") this.jump(2,3);
                if((dx < 0 || joystick.jump || dy > 0) && this.at_wall === "r") this.jump(2,-3);
            }
            
            if(!this.on_ground && !this.at_wall) {
                this.in_air = true;
            }
                
            if(this.vel.y < 0) this.set_cycle(data.mage.jump);
            if(this.vel.y > 0 && !mage.on_wall) this.set_cycle(data.mage.fall);
            if(this.vel.y > 9 && !mage.on_wall) this.set_cycle(data.mage.fast_fall);
            if(this.on_ground && dx === 0) this.set_cycle(data.mage.idle);
            if(this.at_wall && !this.on_ground) this.set_cycle(data.mage.wall);
            if(this.on_ground && dx !== 0) this.set_cycle(data.mage.walk);
            
            if(keyboard.shooting || joystick.shoot || this.shot) {
                this.shoot(250); // cooldown ms
                this.set_cycle(data.mage.shoot);
            }
            
            
            if(this.vel.x !== 0 || this.vel.y !== 0) minimap.reposition();
        }
    };
    
    this.jump = function(sy, sx) {
        this.in_air = true;
        
        var x = Math.abs((sx||0));
        var y = Math.sqrt(map.tile_size*
                (map.tile_size*sy)/32);
        x = Math.sqrt(map.tile_size*
                (map.tile_size*x+this.size/2)/32);
        this.vel.y = -y;
        this.vel.x += sx>0?x:sx<0?-x:0;
    };
    
    this.shoot = function(cooldown) {
        if(!this.shot && mana > 0 && !paused) {
            mana--; update_stats();
            this.shot = true;   
            var a = this;
            var reload = function() {
                space_key_down = false;
                a.shot = false;
            };
            setTimeout(reload, cooldown);
            var bullet = new MageBullet(this.pos, this.mirror);
            mage_bullets.push(bullet);
        }
    };
}

Mage.prototype = Object.create(Sprite.prototype);


/* </Mage class> */






/* <Enemy class> */

function Enemy(x,y) {
    Sprite.call(this);
    this.size = 24;
    this.pos = {x:(x+0.5)*map.tile_size+(map.tile_size-this.size)/2,
                y:(y+0.5)*map.tile_size+(map.tile_size-this.size)/2};
    
    this.mirror = false;
    var color = Math.floor(4*Math.random());
    
    this.create = function() {
        this.id = get_id();
        this.set_cycle(data.enemy[color], 300);
        map.data.foreground[this.id] = this;
        
        var a = this;
        this.interval = new Interval(function() {
            var np = {x: a.pos.x + map.tile_size/(a.mirror?-6:6), y:a.pos.y};
            var col = block_collisions(a.pos, a.size);
            if(col.bbl && !col.bbr || col.bbr && !col.bbl ||
            col.tr || col.tl) {
                a.mirror = !a.mirror;
            }
            a.pos.x += map.tile_size/(a.mirror?-20:20);
        }, 40); 
        
    };
    
    this.draw = function(x,y) {
        // var x = this.pos.x + map.offset.x;
        // var y = this.pos.y + map.offset.y;
        this.blit(x-this.size/2, y-this.size/2, this.mirror);
    };
    
    
    this.create();
}


Enemy.prototype = Object.create(Sprite.prototype);



/* </Enemy class> */











/* <Projectile class> */

function MageBullet(pos, mirror) {
    Sprite.call(this);
    this.pos = {x:pos.x, y:pos.y};
    this.size = 24;
    this.mirror = mirror;
    
    this.create = function() {
        this.id = get_id();
        this.set_cycle(data.bullet.move, 500);
        map.data.foreground[this.id] = this;
        var a = this;
        this.interval = new Interval(function() {
            a.pos.x += map.tile_size/(a.mirror?-3:3);
        }, 16);
    };
    
    this.draw = function(x,y) {
        // var coords = map.get_coords([this.pos.y, this.pos.x]);
        // var x = this.pos.x + map.offset.x;
        // var y = this.pos.y + map.offset.y;
        this.blit(x-this.size/2, y-this.size/2, this.mirror);
    };
    
    
    this.create();
}

MageBullet.prototype = Object.create(Sprite.prototype);


/* </Projectile class> */














/* <Coin class> */

function Coin(x,y) {
    Sprite.call(this);
    this.pos = {x:x, y:y};
    this.coords = map.get_coords([y,x]);
    this.size = 24;
    this.id = get_id();
    this.draw = function() {
        var x = this.coords.x + map.offset.x;
        var y = this.coords.y + map.offset.y;
        this.blit(x-this.size/2, y-this.size/2);
    };
}

Coin.prototype = Object.create(Sprite.prototype);


/* </Coin class> */





/* <Map class> */


/* Background is the background image and shouldn't be
   changed in game. Foreground is for light data images
   and sprites that need to update every frame.
   Updating background needs a Map.create call to render changes 
*/
function Map() {
    this.tile_size = 32; // parseInt(prompt("Blocksize: ", 32));
    this.width = null;
    this.height = null;
    this.img = new Image();
    this.offset = {x:0, y:0}; // drawing offset (translation)
    this.data = {foreground:{}};
    this.create = function() {
        var h = this.tile_size*this.data.background.length;
        var w = this.tile_size*this.data.background[0].length;
        c.width = w; c.height = h;
        c.style.width = w+"px"; c.style.height = h+"px";
        this.detailed_draw();
        this.img.src = c.toDataURL("image/png")
        .replace("image/png","image/octet-stream");
        c.width = W; c.height = H;
        c.style.width = W+"px"; c.style.height = H+"px";
    };
    this.draw = function() {
        /* background image */
        if(this.background_img)
            ctx.drawImage(this.background_img,
            this.offset.x-window.innerWidth/2-50, this.offset.y-window.innerHeight/3);
        
        /* static background */
        ctx.drawImage(this.img, this.offset.x, this.offset.y);
        
        /* non-static foreground */
        for(var i in this.data.foreground) {
            var sprite = this.data.foreground[i];
            sprite.draw(sprite.pos.x+this.offset.x,
                        sprite.pos.y+this.offset.y);
        }
    };
    this.detailed_draw = function() {
        for(var y in this.data.background) {
            for(var x in this.data.background[y]) {
                var tile_id = this.data.background[y][x];
                if(this.enemy_tile == tile_id) tile_id = 0;
                var mirror_tile = tile_id < 0;
                var tile = this.data.tiles[Math.abs(tile_id)][0];
                if(mirror_tile) tile = this.mirror_tile(tile);
            
                
                if(32 % tile.length !== 0)
                    throw "Tile SizeError: tile "+tile_id+
                          ": "+tile.length;
                var height = this.tile_size/tile.length;
                    
                for(var ty in tile) {
                    if(32 % tile[ty].length !== 0)
                    throw "Tile SizeError: tile "+tile_id+
                          ": "+tile[ty].length;
                    var width = this.tile_size/tile[ty].length;
                    for(var tx in tile[ty]) {
                        ctx.fillStyle =
                        this.data.colors[tile[ty][tx]];
                        ctx.fillRect(x*this.tile_size+tx*
                                     width+this.offset.x,
                                     y*this.tile_size+ty*
                                     height+this.offset.y,
                                     width, height);
                    }
                }
            }
        }
    };
    this.mirror_tile = function(tile) {
        var new_tile = JSON.parse(JSON.stringify(tile));
        for(var i in new_tile) new_tile[i].reverse();
        return new_tile;
    };
    this.get_tile = function(x,y) {
        return this.data.background[y][x];
    };
    this.get_coords = function(a) {
        return {x: this.tile_size*a[1]+this.tile_size/2,
                y: this.tile_size*a[0]+this.tile_size/2};
    };
    
    this.update_animation = function() {
        if(!paused) {
           for(var i in this.data.foreground) {
                this.data.foreground[i].update_animation();
            }
        }
    };
    
    this.update = function() {
        if(!paused) {
            for(var i in this.data.foreground) {
                this.data.foreground[i].update();
            }
        }
    };
}

/* </Map class> */










/* <Minimap class> */

var minimap_colors = {
    0:"rgba(0,0,0,0)", 1:"#fff",
    enemy: "#f00", coin: "#ff0",
    bullet: "#f0f", 3: "#0f0",
    2: "#0f0", mage: "#0f0",
    4: "#00f", 5: "#fa0",
    6: "#0ff"
};

function Minimap(map, colors) {
    
    var mx = window.innerWidth-228+"px", my = "40px",
         x = "calc(100vw - 72px)", y = "40px";
    /* map_x, map_y, mini_x, mini_y*/
    var width = 188, height = 188;
    
    this.map = map;
    this.offset = {x:32, y:32};
    var mini = document.createElement("div");
    // mini.style.backgroundColor = "#000";
    mini.style.width = 32+"px";
    mini.style.height = 32+"px";
    mini.style.borderRadius = 5+"px";
    // mini.style.border = "1px solid #fff";
    mini.style.position = "absolute";
    mini.style.zIndex = "2";
    mini.style.backgroundImage = "url("+link+")",
    mini.style.backgroundPosition = "-160px -128px",
    mini.style.backgroundSize = "256px 256px",
    mini.style.left = x; mini.style.top = y;
    
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = width, canvas.height = height,
    canvas.style.width = width+"px",
    canvas.style.background = "rgba(0,0,0,0.5)";
    canvas.style.height = height+"px";
    canvas.style.borderRadius = 5+"px";
    canvas.style.border = "1px solid #000";
    canvas.style.zIndex = "1";
    canvas.style.position = "absolute";
    canvas.style.left = mx;
    canvas.style.top = my;
    
    mini.addEventListener("click", function(e) {
        if(canvas.parentNode != document.body)
            document.body.appendChild(canvas);
        else document.body.removeChild(canvas);
        
        self.reposition();
    });
    
    this.reposition = function() { 
        var f = tile_size / self.map.tile_size;
        self.offset.x = -mage.pos.x*f+width/2;
        self.offset.y = -mage.pos.y*f+height/2;
        start_offset.x = self.offset.x;
        start_offset.y = self.offset.y; 
    };
    
    
    
    
    var drag = false,
        map_translate = false,
        map_zoom = false,
        map_pivot,
        start_offset = {x:32, y:32},
        start_size = 4,
        tile_size = 4;
        
    var start = function(e) {
        if(e.target === mini) {
            drag = true;
        } else if(e.target === canvas) {
            if(e.targetTouches.length === 1) {
                map_translate = true;
                map_pivot = {
                    x: e.targetTouches[0].clientX,
                    y: e.targetTouches[0].clientY,
                };
            } else if(e.targetTouches.length === 2) {
                if(map_translate) {
                    map_translate = false,
                    start_offset.x = self.offset.x,
                    start_offset.y = self.offset.y;
                    draw();
                }
                map_zoom = true;
                var x1 = e.targetTouches[0].clientX,
                    y1 = e.targetTouches[0].clientY,
                    x2 = e.targetTouches[1].clientX,
                    y2 = e.targetTouches[1].clientY;
                map_pivot = {
                    x: x1+(x2-x1)/2 - parseInt(canvas.style.left),
                    y: y1+(y2-y1)/2 - parseInt(canvas.style.top),
                    l: Math.sqrt(Math.pow(y2-y1,2)+Math.pow(x2-x1,2))
                };
                
            }
        }
    };
    
    var move = function(e) {
        var x = e.targetTouches[0].clientX,
            y = e.targetTouches[0].clientY;
        if(drag && e.target === mini) {
            var tx = x-16, ty = y-16;
            mini.style.left = tx+"px"; mini.style.top = ty+"px";
            canvas.style.left = tx-width+32+"px"; canvas.style.top = ty+"px";
        } else if(map_translate) {
            x = e.targetTouches[0].clientX,
            y = e.targetTouches[0].clientY;
            self.offset.x = start_offset.x+x-map_pivot.x;
            self.offset.y = start_offset.y+y-map_pivot.y;
            draw();
        } else if(map_zoom) {
            x = e.targetTouches[0].clientX,
            y = e.targetTouches[0].clientY;
            var px = map_pivot.x, py = map_pivot.y;
            var x2 = e.targetTouches[1].clientX,
                y2 = e.targetTouches[1].clientY;
            var l = Math.sqrt(Math.pow(y2-y,2)+Math.pow(x2-x,2));
            var f = l / map_pivot.l;
            tile_size = f*start_size;
            self.offset.x = start_offset.x-((f-1)*(map_pivot.x-start_offset.x));
            self.offset.y = start_offset.y-((f-1)*(map_pivot.y-start_offset.y));
            
            draw();
        }
    };
    
    var stop = function(e) {
        drag = false;
        if(map_translate && e.target === canvas) {
            map_translate = false,
            start_offset.x = self.offset.x,
            start_offset.y = self.offset.y;
        } if(map_zoom && e.target === canvas) {
            map_translate = false;
            map_zoom = false;
            start_size = tile_size;
            start_offset.x = self.offset.x,
            start_offset.y = self.offset.y;
        }
    };
    
    
    
    /* {0:"#000", 1:"#fff", emeny: "#f00", coin: "#ff0", bullet: "#f0f",
        3: "#0f0", 2: "#0f0"}
    */
    
    var self = this;
    this.create = function() {
        var h = self.map.tile_size*self.map.data.background.length;
        var w = self.map.tile_size*self.map.data.background[0].length;
        img_width = w, img_height = h;
        canvas.width = w; canvas.height = h;
        canvas.style.width = w+"px";
        canvas.style.height = h+"px";
        detailed_draw();
        img.src = canvas.toDataURL("image/png")
        .replace("image/png","image/octet-stream");
        canvas.width = width; canvas.height = height;
        canvas.style.width = width+"px";
        canvas.style.height = height+"px";
    };
    
    
    var img = new Image(), img_width, img_height;
    var detailed_draw = function() {
        for(var y in self.map.data.background) {
            for(var x in self.map.data.background[y]) {
                var id = self.map.data.background[y][x];
                ctx.fillStyle = colors[id]?colors[id]:"rgba(0,0,0,0)";
                ctx.fillRect(x*self.map.tile_size, y*self.map.tile_size, self.map.tile_size, self.map.tile_size);
            }
        }
    };
    
    this.create();
    
    
    var draw = function() {
        canvas.width = canvas.width;
        ctx.translate(self.offset.x, self.offset.y);
        
        var f = tile_size / self.map.tile_size;
        
        /* background */ /*
        for(var y in map.data.background) {
            for(var x in map.data.background[y]) {
                var id = map.data.background[y][x];
                ctx.fillStyle = colors[id]?colors[id]:"rgba(0,0,0,0)";
                ctx.fillRect(x*tile_size, y*tile_size, tile_size, tile_size);
            }
        } */
        
        ctx.drawImage(img, 0, 0, f*img_width, f*img_height);
        
        
        for(var i in self.map.data.foreground) {
            if(self.map.data.foreground[i] instanceof Mage) {
                var mage = self.map.data.foreground[i];
                ctx.fillStyle = colors.mage?colors.mage:"rgba(0,0,0,0)";
                ctx.beginPath();
                ctx.arc(mage.pos.x*f, mage.pos.y*f, tile_size/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
            }
        }
        
        
        for(var i in self.map.data.foreground) {
            if(self.map.data.foreground[i] instanceof MageBullet) {
                var bullet = self.map.data.foreground[i];
                ctx.fillStyle = colors.bullet?colors.bullet:"rgba(0,0,0,0)";
                ctx.beginPath();
                ctx.arc(bullet.pos.x*f, bullet.pos.y*f, tile_size/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
            }
        }
        
        
        for(var i in self.map.data.foreground) {
            if(self.map.data.foreground[i] instanceof Enemy) {
                var enemy = self.map.data.foreground[i];
                ctx.fillStyle = colors.enemy?colors.enemy:"rgba(0,0,0,0)";
                ctx.beginPath();
                ctx.arc(enemy.pos.x*f, enemy.pos.y*f, tile_size/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
            }
        }
        
        
        for(var i in self.map.data.foreground) {
            if(self.map.data.foreground[i] instanceof Coin) {
                var coin =self.map.data.foreground[i];
                ctx.fillStyle = colors.coin?colors.coin:"rgba(0,0,0,0)";
                ctx.beginPath();
                ctx.arc(coin.coords.x*f, coin.coords.y*f, tile_size/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
            }
        }
    };
    
    
    
    document.addEventListener("touchstart", start);
    document.addEventListener("touchmove", move);
    document.addEventListener("touchend", stop);
    document.addEventListener("touchcancel", stop);
    document.body.appendChild(mini);
    
    this.draw = function() {
        if(canvas.parentNode === document.body)
            draw();
    };
}

/* </Minimap class> */




















/* <Controls class> */

function Joystick(callback) {
    
    var left_div, right_div, jump_div, shoot_div,
        change_div, pos, divs;
        
    this.left = false, this.right = false, this.jump = false,
    this.shoot = false, this.drag = false;
    
    
    var apply_design = function(e, s) {
        for(var i in s) e.style[i] = s[i];
    };
        
    
    var setup = function() {
        left_div = document.createElement("div");
        right_div = document.createElement("div");
        jump_div = document.createElement("div");
        shoot_div = document.createElement("div");
        change_div = document.createElement("div");
        
        left_div.setAttribute("name", "left");
        right_div.setAttribute("name", "right");
        jump_div.setAttribute("name", "jump");
        shoot_div.setAttribute("name", "shoot");
        change_div.setAttribute("name", "change");
        
        divs = [left_div, right_div, jump_div, shoot_div];
        
        var W = window.innerWidth, H = window.innerHeight;
        pos = {
            left: {
                x:"60px", y:"calc(100vh - 50px)", w:80, h:50,
                svg: "<svg width='80'height='50'"+
                     "style='background:rgba(0,0,0,0);'><path fill='rgba(0,0,0,0.6)' d='"+
                     "M22 25 l15 -15 l0 10 l20 0 l0 10 l-20 0 l0 10 z'></path></svg>",
            },
            right: {
                x:"150px", y:"calc(100vh - 50px)", w:80, h:50,
                svg: "<svg width='80'height='50'"+
                     "style='background:rgba(0,0,0,0);'><path fill='rgba(0,0,0,0.6)' d='"+
                     "M58 25 l-15 -15 l0 10 l-20 0 l0 10 l20 0 l0 10 z'></path></svg>"
            },
            jump: {
                x:"calc(100vw - 50px)", y:"calc(100vh - 50px)", w:50, h:50,
                svg: "<svg width='50'height='50'"+
                     "style='background:rgba(0,0,0,0);'><path fill='rgba(0,0,0,0.6)' d='"+
                     "M25 10 l15 15 l-10 0 l0 15 l-10 0 l0 -15 l-10 0 z'></path></svg>"
            },
            shoot: {
                x:"calc(100vw - 50px)", y:"calc(100vh - 110px)", w:50, h:50,
                svg: "<svg width='50'height='50'"+
                     "style='background:rgba(0,0,0,0);'><circle fill='rgba(128,0,255,0.6)'"+
                     " cx='25' cy='25', r='15'></circle></svg>"
            }
        };
        
        for(var i in divs) {
            var p = pos[divs[i].getAttribute("name")];
            apply_design(divs[i], {
                background: "rgba(255,255,255,0.3)",
                position: "absolute", left: p.x,
                top: p.y, width: p.w+"px", height: p.h+"px",
                borderRadius: "10px", border: "1px solid black",
                // boxSizing: "border-box"
            });
            
            divs[i].innerHTML = p.svg;
            document.body.appendChild(divs[i]);
            
            make_draggable(divs[i]);
        }
        
        var change_func = function(e) {
            if(is_targeted(e.target, change_div)) {
                self.drag = !self.drag;
                var color = change_div.style.background;
                if(color === "rgb(0, 0, 0)") {
                    pause();
                    toast.makeToast("Drag control buttons to reposition them");
                    change_div.style.background = "#fff";
                    for(var i in divs)
                        divs[i].style.background = "red";
                } else {
                    resume();
                    change_div.style.background = "#000";
                    for(var i in divs)
                        divs[i].style.background = "rgba(255,255,255,0.1)";
                }
            }
        };
        
        var start = function(e) {
            var x, y;
            
            var trues = [];
            
            for(var i in e.touches) {
                if(!isNaN(i)) {
                    x = e.touches[i].clientX,
                    y = e.touches[i].clientY;
                    var elems = document.elementsFromPoint(x,y);
                    for(var i in elems) {
                        var elem = elems[i], name = elem.getAttribute("name");
                        if(name !== null && !self.drag && name !== "change") {
                            self[name] = true;
                            trues.push(name);
                        }
                    }
                }
            }
            
            
            
            for(var i in divs) {
                var elem = divs[i], name = elem.getAttribute("name");
                if(!trues.includes(name)) self[name] = false;
            } 
            
            
        };
        
        window.addEventListener("click", change_func);
        window.addEventListener("touchstart", start);
        window.addEventListener("touchmove", start);
        window.addEventListener("touchend", start);
        window.addEventListener("touchcancel", start);
        
        document.body.appendChild(change_div);
        
        change_div.style.width = "32px", change_div.style.height = "32px",
        change_div.style.position = "absolute",
        change_div.style.right = "5px", change_div.style.top = "80px",
        change_div.style.background = "#000";
        change_div.style.borderRadius = "10px";
        change_div.style.border = "1px solid white";
        
        
    };
    
    
        
    var self = this;
    var make_draggable = function(elem) {
        elem.style.transform = "translate(-50%, -50%)";
        elem.style.position = "absolute";
        window.addEventListener("touchmove", function(e) {
            if(self.drag && is_targeted(e.target, elem)) {
                elem.style.left = e.targetTouches[0].clientX+"px";
                elem.style.top = e.targetTouches[0].clientY+"px";
            }
        });
    };
    
    var is_targeted = function(elem, target) {
        return elem?(elem === target || is_targeted(elem.parentNode, target)):false;
    };
    
    // window.addEventListener("DOMContentLoaded", setup);
    setup();
}

/* </Controls class> */




















/* <DOM Elenment class> */

function Element(design, text) {
    this.appendChild = function(element) {
        this.div.appendChild(element.div);
        this.children.push(element);
    };
    
    this.show = function() {
        if(!this.on_screen()) {
            document.body.appendChild(this.div);
        } this.div.style.opacity = "1";
    };
    
    this.hide = function() {
        this.div.style.opacity = "0";
        this.div.style.transition = "";
    };
    
    this.remove = function() {
        if(this.div.parentNode) {
            this.div.parentNode.removeChild(this.div);
        }
    };
     
    this.on_screen = function(node) {
        node = node || this.div;
        if(node.parentNode) {
            var a = node.parentNode == document.body;
            return a || this.on_screen(node.parentNode);
        }
        return false;
    };
     
    this.apply_design = function(design) {
        for(var i in design) {
            this.div.style[i] = design[i];
        }
    };
     
    this.fade_in = function(a) {
        a = a || 1;
        var div = this.div;
        // div.style.left = ""; div.style.right = "";
        this.apply_design({opacity:0, transition:a+"s"});
        this.show();
        setTimeout(function(){div.style.opacity = "1"});
    };
     
    this.fade_out = function(a) {
        a = a || 1;
        var div = this.div, elem = this;
        this.apply_design({opacity:1, transition:a+"s"});
        setTimeout(function(){div.style.opacity = "0"});
        setTimeout(function(){elem.hide();},a*1000);
    };
     
    this.slide_from_right = function(a) {
        a = a || 0.2;
        var div = this.div;
        div.style.left = ""; div.style.right = "";
        this.apply_design({
            left:"100vw",position:"absolute",transition: a+"s"});
        this.show();
        setTimeout(function(){div.style.left = "0"});
    };
     
    this.slide_to_right = function(a) {
        a = a || 0.2;
        var div = this.div, elem = this;
        div.style.left = ""; div.style.right = "";
        this.apply_design({
            left:"0",position:"absolute",transition: a+"s"});
        this.show();
        setTimeout(function(){div.style.left = "100vw"});
        setTimeout(function(){elem.hide();},a*1000);
    };
     
    this.slide_from_left = function(a) {
        a = a || 0.2;
        var div = this.div;
        div.style.left = ""; div.style.right = "";
        this.apply_design({
            right:"100vw",position:"absolute",transition:a+"s"});
        this.show();
        setTimeout(function(){div.style.right = "0"});
    };
     
    this.slide_to_left = function(a) {
        a = a || 0.2;
        var div = this.div; var elem = this;
        div.style.left = ""; div.style.right = "";
        this.apply_design({
            right:"0",position:"absolute",transition:a+"s"});
        this.show();
        setTimeout(function(){div.style.right = "100vw"});
        setTimeout(function(){elem.hide();},a*1000);
    };
     
    this.add_event_listener = function(event, listener) {
        this.div.addEventListener(event, function(e) {
            listener(e);
        });
    };
     
    this.copy_text = function(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text || this.text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    };
    
    
    this.div = document.createElement("div");
    this.apply_design(design);
    this.children = [];
    if(text) this.text = text;
    
    Object.defineProperty(this, "text", {
        get: function() {
            return this.div.innerHTML;
        }, set: function(value) {
            this.div.innerHTML = value;
        }
    });
}

 

toast.makeToast = (text, duration) => {
    duration = duration || text.length*50;
    toast.text = text;
    toast.show();
    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(()=>{
        toast.fade_out();
    }, duration);
};

/* </DOM Elenment class> */
























/* <Interval class> */

function Interval(callback, speed) {
    this.speed = speed;
    this.start = Date.now();
    this.update = function() {
        var now = Date.now();
        if(now - this.start >= this.speed) {
            this.start = now;
            callback();
        }
    };
}

/* </Interval class> */




/* <Class functions> */

var spawn_enemies = function(v) {
    var indices = [], m = map.data.background;
    if(!(v instanceof Array)) {
        for(var y in m) {
            for(var x in m[y]) {
                var ny = parseInt(y)+1;
                if(m[ny] && (m[y][x] == 0) && (m[ny][x] == 1)) {
                    indices.push([parseInt(x), ny-1]);
                }
            }
        }
        
        for(var i = 0; i < v; i++) {
            var pos = choice(indices);
            enemies.push(new Enemy(pos[0], pos[1]));
        }
    } else {
        // v can be a number for how many enemies to randomly spawn
        // or an array where to spawn enemies (position given in
        // map data background) The background-block will be the
        // air-block 0
        for(var y in m) {
            for(var x in m[y]) {
                if(m[y][x] == map.enemy_tile) {
                    indices.push([parseInt(x), parseInt(y)]);
                }
            }
        }
        
        
        for(var i in indices) {
            enemies.push(new Enemy(indices[i][0], indices[i][1]));
        }
        
    }
};

var spawn_coins = function(k) {
    for(var j = 0; j < k; j++) {
        var x, y, i = 0;
        do {
            i++;
            x = Math.floor(Math.random()*map.data.background[0].length);
            y = Math.floor(Math.random()*map.data.background.length);
        } while(i < 1e3 && map.data.solid_tiles.includes(parseInt(map.get_tile(x,y))));
        var coin = new Coin(x,y);
        coin.set_cycle(data.coin.idle, 150+Math.floor(Math.random()*50));
        map.data.foreground[coin.id] = coin;
        coins.push(coin);
    }
};


var delete_all_coins = function() {
    for(var i in coins) {
        delete coins[i].interval;
        delete map.data.foreground[coins[i].id];
    }
    coins = [];
};

var delete_all_bullets = function() {
    for(var i in mage_bullets) {
        delete mage_bullets[i].interval;
        delete map.data.foreground[mage_bullets[i].id];
    }
    mage_bullets = [];
};

var delete_all_enemies = function() {
    for(var i in enemies) {
        delete enemies[i].interval;
        delete map.data.foreground[enemies[i].id];
    }
    enemies = [];
};
/* </Class functions> */

/**************************************************************/








/*************************[FUNCTIONS]**************************/

var pause = function() {
    paused = true;
};

var resume = function() {
    paused = false;
};



var equals = function(c,a) {
    if(!a || !c) return false;
    for(var i in c) {
        for(var j in c[i]) {
            if(c[i][j] !== a[1][i][j]) return false;
        }
    } return true;
};



/* <Camera focus> */

var handle_mage_at_screen_edges = function() {
    var map_pos = map.data.foreground.mage.pos;
    var screen = {x: map_pos.x+map.offset.x,
                  y: map_pos.y+map.offset.y};
    var border = {x:1e3, y:1e3};
    if(border.x > W/2-50) border.x = W/2-50;
    if(border.y > H/3) border.y = H/3;
    if(screen.x < border.x) map.offset.x += border.x-screen.x;
    if(screen.x > W-border.x) map.offset.x += (W-border.x)-screen.x;
    if(screen.y < border.y) map.offset.y += border.y-screen.y;
    if(screen.y > H-border.y) map.offset.y += (H-border.y)-screen.y;
};

/* </Camera focus> */



/* <Block effects> */

var block_collisions = function(pos /* map coords */, size) {
    var i = get_indices(pos, size);
    var tiles = [[i.t,i.r], [i.t,i.l], [i.b,i.r], [i.b,i.l],
                 [i.bb, i.l], [i.bb, i.r]];
    var coords = [map.get_coords(tiles[0]),
                  map.get_coords(tiles[1]),
                  map.get_coords(tiles[2]),
                  map.get_coords(tiles[3]),
                  map.get_coords(tiles[4]),
                  map.get_coords(tiles[5])];
    var collisions = {};
    
    for(var i in coords) {
        var cs = coords[i];
        var index = get_index(cs);
        var tile_data = map.get_tile(index[0],index[1]);
        var d = mage.size/2+map.tile_size/2;
        var dx = pos.x - cs.x;
        var dy = pos.y - cs.y;
        
        if(map.data.solid_tiles.includes(parseInt(tile_data))){
            var vy = dy>0?d-dy:-d-dy;
            var vx = dx>0?d-dx:-d-dx;
            if(Math.abs(dx) > Math.abs(dy)) {
                pos.x += vx;
            } else {
                pos.y += vy;
            }
            collisions.tr = (i == 0 || collisions.tr);
            collisions.tl = (i == 1 || collisions.tl);
            collisions.br = (i == 2 || collisions.br);
            collisions.bl = (i == 3 || collisions.bl);
            collisions.bbr = (i == 4 || collisions.bbr);
            collisions.bbl = (i == 5 || collisions.bbl);
        }
    }
    
    return collisions;
};


/* </Block effects> */




/* <Mage - Block collision> */

var handle_mage_collisions = function() {
    var i = get_indices(mage.pos, mage.size);
    
    var tiles = [[i.t,i.r], [i.t,i.l], [i.b,i.r], [i.b,i.l],
                 [i.bb, i.l], [i.bb, i.r]];
    var coords = [map.get_coords(tiles[0]),
                  map.get_coords(tiles[1]),
                  map.get_coords(tiles[2]),
                  map.get_coords(tiles[3]),
                  map.get_coords(tiles[4]),
                  map.get_coords(tiles[5])];
    var collisions = {};
    
    var effects = [];
    
    for(var i in coords) {
        var cs = coords[i];
        var index = get_index(cs);
        var tile_data = map.get_tile(index[0],index[1]);
        var d = mage.size/2+map.tile_size/2;
        var dx = mage.pos.x - cs.x;
        var dy = mage.pos.y - cs.y;
        
        if(map.data.solid_tiles.includes(parseInt(tile_data))){
            var vy = dy>0?d-dy:-d-dy;
            var vx = dx>0?d-dx:-d-dx;
            if(Math.abs(dx) > Math.abs(dy)) {
                mage.pos.x += vx;
                collisions.x = dx>0?"l":"r";
            } else {
                mage.pos.y += vy;
                collisions.y = dy>0?"t":"b";
            }
        }
        
        if(!effects.includes(tile_data)) effects.push(tile_data);
    }
    
    
    /* collision data stored in collisions
    if y:b => ground
    if y:t and x:null => head bump
    if x:l/r and y:t/null => wall
    */
    
    var on_ground = collisions.y == "b";
    var head_bump = collisions.y == "t" && collisions.x == null;
    var on_wall = collisions.x && collisions.y != "b";
    on_wall = on_wall?collisions.x:false;
    
    if(on_ground) {
        mage.vel.y = 0;
        mage.on_ground = true;
        mage.at_wall = false;
    } else {
        mage.on_ground = false;
    }
    
    if(head_bump) mage.vel.y = 0;
    
    if(on_wall && mage.vel.y > 0) {
        mage.vel.y *= 0.6;
        if(mage.vel.y === 0.5) mage.vel.y = 0.49;
        mage.at_wall = on_wall;
    } else {
        mage.at_wall = false;
    }
    
    for(var i in effects) {
        if(effects[i] != map.enemy_tile)
            map.data.tiles[effects[i]][1]();
    }
    
    return collisions;
};

/* </Mage - Block collision> */






/* <Mage - Coin collision> */

var coin_counter = 0;
var handle_mage_coins_collisions = function() {
    var mage_pos = get_index(mage.pos);
    for(var i in coins) {
        var coin_pos = [coins[i].pos.x, coins[i].pos.y];
        if(coin_pos[0] === mage_pos[0] && coin_pos[1] === mage_pos[1]) {
            coin_ref.text = ++coin_counter;
            delete map.data.foreground[coins[i].id];
            delete coins[i].interval;
            delete coins[i];
            coins.splice(i,1);
            spawn_coins(1);
        }
    }
};

/* </Mage - Coin collision> */






/* <Projectile collision> */

var handle_bullet_collision = function() {
    for(var i in mage_bullets) {
        var m = mage_bullets[i];
        var x = m.pos.x;
        var y = m.pos.y;
        var index = get_index(m.pos);
        var ix = index[0], iy = index[1];
        
        
        /* wall collisions */
        if(map.data.solid_tiles.includes(parseInt(map.get_tile(ix,iy)))) {
            delete m.interval;
            delete map.data.foreground[m.id];
            delete mage_bullets[i];
            mage_bullets.splice(i,1);
            return;
        }
        
        /* coin collision */
        for(var j in coins) {
            if(coins[j].pos.x === ix && coins[j].pos.y === iy) {
                coin_ref.text = ++coin_counter;
                delete map.data.foreground[coins[j].id];
                delete coins[j].interval;
                delete coins[j];
                coins.splice(j,1);
                spawn_coins(1);
            }
        }
        
        /* enemy collision */
        for(var j in enemies) {
            var e = enemies[j];
            var e_pos = get_index(e.pos);
            if((ix==e_pos[0]) && (iy==e_pos[1])) {
                delete map.data.foreground[enemies[j].id];
                delete enemies[j].interval;
                delete enemies[j];
                enemies.splice(j,1);
                
                delete m.interval;
                delete map.data.foreground[m.id];
                delete mage_bullets[i];
                mage_bullets.splice(i,1);
                return;
            }
        }
    }
};

/* </Projectile collision> */



/* <Enemy collision> */

var handle_enemy_collision = function() {
    for(var i in enemies) {
        var e = enemies[i],
            e_pos = get_index(e.pos),
            m_pos = get_index(mage.pos);
        if((e_pos[0] == m_pos[0]) && (e_pos[1] == m_pos[1]) &&
        !mage.invincible && !paused) {
            toast.makeToast("Hit"); // vvv
            health--;
            update_stats();
            mage.invincible = true;
            setTimeout(function() {mage.invincible = false;}, 1000);
        }
    }
};

/* </Enemy collision> */






















var get_index = function(pos) {
    var y = Math.floor(pos.y/map.tile_size);
    var x = Math.floor(pos.x/map.tile_size);
    return [x,y];
};


var get_indices = function(pos,size) {
    var t = Math.floor((pos.y-size/2)/map.tile_size);
    var l = Math.floor((pos.x-size/2)/map.tile_size);
    var b = Math.floor((pos.y+size/2-1)/map.tile_size);
    var r = Math.floor((pos.x+size/2-1)/map.tile_size);
    var bb = Math.floor((pos.y+size/2)/map.tile_size);
    
    return {
        t:t, l:l, b:b, r:r, bb:bb
    };
};

var choice = function(a) {
    return a[Math.floor(a.length*Math.random())];
};

var get_id = function() {
    var i = 1;
    while(map.data.foreground[i] !== undefined) {
        i++;
    } return i;
};







/* <Keyboard controls> */

var left_key_down = false;
var right_key_down = false;
var up_key_down = false;
var space_key_down = false;



var handle_keyboard = function(mage) {
    var dx, dy, shooting;
    if(right_key_down) dx = 1;
    if(left_key_down) dx = -1;
    if(up_key_down) dy = -1;
    if(space_key_down) shooting = true;
    
    return {dx:dx, dy:dy, shooting:shooting};
};

var tstart;
var add_event_listeners = function() {
    window.addEventListener("keydown", function(e) {
        if(e.keyCode == 37 || e.keyCode == 65) left_key_down = true;
        if(e.keyCode == 38 || e.keyCode == 87) up_key_down = true;
        if(e.keyCode == 39 || e.keyCode == 68) right_key_down = true;
        if(e.keyCode == 32) space_key_down = true;
    });
    window.addEventListener("keyup", function(e) {
        if(e.keyCode == 37 || e.keyCode == 65) left_key_down = false;
        if(e.keyCode == 38 || e.keyCode == 87) up_key_down = false;
        if(e.keyCode == 39 || e.keyCode == 68) right_key_down = false;
        if(e.keyCode == 32) space_key_down = false;
        handle_keyboard(mage);
    });
    
    window.addEventListener("resize", function(e) {
        setTimeout(function() { 
            c.width = window.innerWidth;
            c.height = window.innerHeight;
            c.style.width = "100vw";
            c.style.height = "100vh"; 
        },500); 
    });
    
    
};

/* </Keyboard controls> */






/* <Map initialization> */

var init_map = function(map) {
    map.data.foreground.mage = mage;
    
    map.data.colors = ["rgba(0,0,0,0)","#000","#fff","#f00",
                       "#a00", /*"#666", */"#333", "#111",
                       "#000", /*"#888", */"#fa0",
                       "#00f"];
    
    map.data.tiles = [
        
        [[[0]], function() {}],

        [[[7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
         [7,4,4,4,4,4,4,4,4,4,4,4,4,4,4,7],
         [7,4,4,4,4,4,4,4,4,4,4,4,4,4,4,7],
         [7,4,4,4,4,4,4,4,4,4,4,4,4,4,4,7],
         [7,4,4,4,4,4,4,4,4,4,4,4,4,4,4,7],
         [7,4,4,4,4,4,4,4,4,4,4,4,4,4,4,7],
         [7,4,4,4,4,4,4,4,4,4,4,4,4,4,4,7],
         [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
         [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
         [4,4,4,4,4,4,4,7,7,4,4,4,4,4,4,4],
         [4,4,4,4,4,4,4,7,7,4,4,4,4,4,4,4],
         [4,4,4,4,4,4,4,7,7,4,4,4,4,4,4,4],
         [4,4,4,4,4,4,4,7,7,4,4,4,4,4,4,4],
         [4,4,4,4,4,4,4,7,7,4,4,4,4,4,4,4],
         [4,4,4,4,4,4,4,7,7,4,4,4,4,4,4,4],
         [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]],
         function() {}],
         
         [[[3,3,3,3,3,3,3,3],
           [0,0,0,0,0,0,0,0],
           [0,3,3,0,0,3,3,0],
           [0,3,3,0,0,3,3,0],
           [0,3,3,0,0,3,3,0],
           [0,3,3,0,0,3,3,0],
           [0,0,0,0,0,0,0,0],
           [3,3,3,3,3,3,3,3]], function() {
               load_level(level+1);
           }],

         [[[3,3,3,3,3,3,3,3],
           [0,0,0,0,0,0,0,0],
           [0,3,3,0,0,3,3,0],
           [0,3,3,0,0,3,3,0],
           [0,3,3,3,3,3,3,0],
           [0,3,3,0,0,3,3,0],
           [0,0,0,0,0,0,0,0],
           [3,3,3,3,3,3,3,3]], function() {
               var l = level;
               load_level(level-1);
               if(l === level+1) {
                    mage.pos.x = (data.levels[level-1].end.x+0.5)*map.tile_size;
                    mage.pos.y = (data.levels[level-1].end.y+0.5)*map.tile_size;
                }
           }],

        [[[9]], function() {
             mage.pos.x = 32*map.tile_size;
             mage.pos.y = 43*map.tile_size;
         }],

        [[[8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
         [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
         [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
         [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
         [7,4,4,4,4,4,4,4,4,4,4,4,4,4,4,7],
         [7,4,4,4,4,4,4,4,4,4,4,4,4,4,4,7],
         [7,4,4,4,4,4,4,4,4,4,4,4,4,4,4,7],
         [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
         [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
         [4,4,4,4,4,4,4,7,7,4,4,4,4,4,4,4],
         [4,4,4,4,4,4,4,7,7,4,4,4,4,4,4,4],
         [4,4,4,4,4,4,4,7,7,4,4,4,4,4,4,4],
         [4,4,4,4,4,4,4,7,7,4,4,4,4,4,4,4],
         [4,4,4,4,4,4,4,7,7,4,4,4,4,4,4,4],
         [4,4,4,4,4,4,4,7,7,4,4,4,4,4,4,4],
         [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]], function() {
             health--; update_stats();
             mage.pos.x = 7.5*map.tile_size;
             mage.pos.y = 43*map.tile_size;
             mage.vel.x = 0; mage.vel.y = 0;
         }],
          
         
    ];
    
    map.data.solid_tiles = [1,2,3,4];
    map.enemy_tile = 9;
    var img = new Image();
    img.src = "https://i.imgur.com/epSeAdJ.jpg";
    map.background_img = img;
};

/* </Map initialization> */






/***************************[DATA]****************************/



/* <Level loading> */

var level = 1;
var load_level = function(id) {
    var lvl = data.levels[id-1];
    if(lvl && (coin_counter >= lvl.cost || lvl.unlocked)) {
        if(!lvl.unlocked) coin_counter -= lvl.cost;
        lvl.unlocked = true;
        coin_ref.text = coin_counter;
        
        map.data.background = lvl.map; level = id;
        map.offset = {x:0, y:0};
        map.create();
        if(minimap) minimap.create();
        
        mage.pos.x = (lvl.start.x+0.5)*map.tile_size;
        mage.pos.y = (lvl.start.y+0.5)*map.tile_size;
             
        delete_all_coins();
        delete_all_enemies();
        delete_all_bullets();
                
        spawn_coins(lvl.coins);
        spawn_enemies(lvl.enemies);
        
        mage.invincible = true;
        setTimeout(function() {mage.invincible = false;}, 1000);
    } else if(lvl){
        toast.makeToast("You need "+lvl.cost
        +" coins to enter level "+id+"!");
    } else {
        toast.makeToast("Level "+id+" does not exist yet");
    }
};


/* </Level loading> */







/* <Sprite + Level data> */

var m = 24; /* mage size */
var cid = 2;
var add = cid*16;
var data = {
    tiles: [0,],
    mage: {
        idle: [1+add,2+add,-2-add,-1-add,-2-add,2+add],
        walk: [10+add,3+add,4+add,5+add],
        jump: [6+add],
        fall: [7+add],
        wall: [-8-add],
        fast_fall: [9+add],
        shoot: [11+add],
    },
    coin: {
        idle: [129,130,131,-129,132,133,134,135],
    },
    bullet: {
        move: [137,136],
    },
    questionmark: [138],
    enemy: [
        [145,146], [147,148], [149,150], [151,152]
    ],
    mana: [161,162,163,164,165,166,167,168,169],
    health: [177,178,179,180,181,182,183,184,185],
    
    levels: [
        {
            cost: 0,
            start: {x: 4, y: 62},
            end: {x: 62, y: 6},
            coins: 32,
            enemies: [9],
            map: [

                "1111111111111111111111111111111111111111111111111111111111111111",
                "1000000100000000000000000000000000000000100000000000000000009001",
                "1000000100000000010000000000000000000000100000000001111100111111",
                "1000000010000000010000000000009000000000100009000011000111000001",
                "1000000010000009010000000001111110000090101111110010000000000001",
                "1000000000000111110000000000000000000111111000000010000100000001",
                "1000000000000000010000000000000000000000100000000001000100000001",
                "1000000001000000010000090000000000000000100000000001000100002111",
                "1000000001000000010001111100000000100000100000110111000111011101",
                "1110090000100001111110000000000000100000100000100001000100001001",
                "1001111111100000000000000000000000100000000000000001000100000001",
                "1000000000000000000000000100000900100000009000100001000100001001",
                "1000000000000000000000001000111111100111111111100001000100001001",
                "1000000000900000000000011001000000000000000000111001000100091001",
                "1000000111111000000000010001000000000000000000001001000100110001",
                "1000000000001111100000100010000000000000000000000101000101000001",
                "1000000000000000100001100110000000000090000000100011000110000001",
                "1000000111000000109010001100001111111111111111100001101100000101",
                "1090011100100000111100011000001000000000000000100000000000001011",
                "1111110000100000000001110000001100100000000000119000000000911001",
                "1110000000100000000111000000000000100000000000011111000111110001",
                "1000000000100000000000000000900000100090000000010001000100010001",
                "1000000000100001111111111111111111111111111111111111000111110001",
                "1000000090100001100100000011100000111000000000100000000000000001",
                "1000001111100001000100000011000000011000000000000000000000000001",
                "1000000000100001000100010010000900001000000000900000000000090001",
                "1100000000100001000100010000000100000000011111111110011111111111",
                "1110000000100001000000010000000100000000000000100000000000000001",
                "1001000000100001000000010010000000001000000000100100000000000001",
                "1001100000100001000100000011000000011000000000100100000000000001",
                "1000110000110001000100900011100000111000090000190000000100090001",
                "1000011000010001000011111111110001111111111111111110011100111101",
                "1000000000010000000000000010000000001000000000100000000100000001",
                "1000000000010000000000000010000000001000000000100000000100000001",
                "1000000000019000000111000010001000001000100100000000100100009001",
                "1009001100011100000000000010001000001000100100000001000111111111",
                "1111111000000100000000000010011100001000000000100010000000000001",
                "1000000000000100000000000010001000001000009000100100000009000001",
                "1000000000000000000090000010000000001000111111100000010111100001",
                "1000000000900001111111110010000000901000000000100900010000000001",
                "1000000001111111000000000010000000111000000000111111110000000001",
                "1000000000000000000000000010000000001000110000000000011111111001",
                "1000000000000000000000000010000000001000000000000000010000001001",
                "1001000100000000000000000010000111001000090011000000010090001001",
                "1001000100000000000000000011090100001111111111111000010011101001",
                "1001000101111111111111111011111100001000000000000000010000000001",
                "1001000101000000000000000010000000001000000011100000010000000001",
                "1001000101110000000001111110000000001000000000000000010001001111",
                "1001555101000000900000111000000090001001100000000000010001111001",
                "1001111101000001111000110000011111001000100090000000010001000001",
                "1400000001000090000000100000000000011000111111110000010001000001",
                "1111111111000111111110100000000000111000100000011100010001000901",
                "1000000001000100000000100000009001110000101110000000010001001111",
                "1000000001000100000000100011111111100000100000090000000001000001",
                "1000000001000100000000100000000000000000100011111110000001000001",
                "1110090001000100009000100000000000000000110000000010000001000001",
                "1000011000000100011111100111110000000000111000900010000000090001",
                "1000000000090100010000000100000000001111111111111111111111111111",
                "1001100000111100010000000140090000000111111111111100000000000001",
                "1000000100000100010900000111111100000011111111111000000009000001",
                "1100000100000100011110000000000000010001111111110000011111111101",
                "1110000000000100000000000000000000111000000000000001111111110001",
                "1113000000900100009000000000090001111100090000000001111111140001",
                "1111111111111111111111111111111111111111111111111111111111111111",


            ]
        }, {
            cost: 2,
            start: {x:1, y:1},
            coins: 1, enemies: 0,
            map: [
                "111", "302", "111"
            ]
        }
    ]
};


/*

violett 1-16
blue 17-32
red 33-48
magenta 49-64
lightblue 65-80
lime 81-96
grey 96-112
green 113-128
coins 129-135
bullet 136-137
questionmark 138
enemy 145-152
mana 161-169
health 177-185

minus before the number mirrors the drawing vertically

*/

/* </Sprite + Level data> */


/* <Image slicing> */

for(var y = 0; y < 1024; y+=64) {
    for(var x = 0; x < 1024; x+=64) {
        data.tiles.push([x+1,y+1,62,62,m,m]);
    }
}

/* </Image slicing> */

/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/