(function(){
  /* ---------- Quote data ---------- */
  // types: flat (one-time, optional qty), hours, cams, users (monthly per user with minimum), monthly, tier, free
  var DATA = {
    residential: {
      sub: "For homes, families, and personal devices.",
      groups: [
        {title:"Computer repair", items:[
          {id:"r-virus", name:"Virus & malware removal", type:"flat", price:129},
          {id:"r-tune", name:"Computer tune-up", type:"flat", price:89},
          {id:"r-reinstall", name:"Windows reinstall with data backup", type:"flat", price:149},
          {id:"r-ssd", name:"SSD upgrade with data transfer", type:"flat", price:99, parts:true},
          {id:"r-newpc", name:"New computer setup & transfer", type:"flat", price:129},
          {id:"r-recovery", name:"Data recovery", unit:"Starting price; files from failing or deleted drives", type:"flat", price:149, from:true},
          {id:"r-build", name:"Custom PC build", unit:"Assembly, Windows, and drivers", type:"flat", price:199, parts:true}
        ]},
        {title:"Phone & tablet", items:[
          {id:"p-screen", name:"Screen replacement", unit:"Per device", type:"flat", qty:true, price:89, parts:true, qlabel:"Devices"},
          {id:"p-battery", name:"Battery replacement", unit:"Per device", type:"flat", qty:true, price:69, parts:true, qlabel:"Devices"},
          {id:"p-port", name:"Charging port repair", unit:"Per device", type:"flat", qty:true, price:79, parts:true, qlabel:"Devices"},
          {id:"p-setup", name:"New phone setup & transfer", unit:"Per phone", type:"flat", qty:true, price:75, qlabel:"Phones"}
        ]},
        {title:"Home WiFi & smart home", items:[
          {id:"w-trouble", name:"WiFi troubleshooting visit", type:"flat", price:99},
          {id:"w-mesh", name:"Mesh WiFi install", unit:"Up to 3 nodes, placed and secured", type:"flat", price:199, parts:true},
          {id:"w-node", name:"Additional mesh nodes", unit:"Per node", type:"flat", qty:true, price:49, parts:true, qlabel:"Nodes"},
          {id:"w-link", name:"Garage, shop, or boathouse link", unit:"Per building", type:"flat", qty:true, price:349, parts:true, qlabel:"Buildings"},
          {id:"w-cam", name:"Cameras & video doorbells", unit:"$99 first device, $49 each after", type:"cams", price:99, extra:49, parts:true, qlabel:"Devices", def:2},
          {id:"w-smart", name:"Smart home or TV setup", unit:"Hourly", type:"hours", price:75, def:1},
          {id:"w-help", name:"Tech help & lessons", unit:"Hourly", type:"hours", price:75, def:1}
        ]},
        {title:"Gaming & media", items:[
          {id:"m-vhs", name:"Video tapes to digital", unit:"VHS, VHS-C, MiniDV, Hi8 · per tape", type:"flat", qty:true, price:20, qlabel:"Tapes", def:5},
          {id:"m-cass", name:"Audio cassettes to digital", unit:"Per tape", type:"flat", qty:true, price:15, qlabel:"Tapes", def:3},
          {id:"m-photo", name:"Photo scanning", unit:"Per photo", type:"flat", qty:true, price:0.5, qlabel:"Photos", def:100, step:25},
          {id:"m-slide", name:"Slide scanning", unit:"Per slide", type:"flat", qty:true, price:0.75, qlabel:"Slides", def:100, step:25},
          {id:"m-console", name:"Console cleaning & fan service", unit:"Per console", type:"flat", qty:true, price:69, qlabel:"Consoles"},
          {id:"m-csetup", name:"Console setup, transfer & accounts", unit:"Per console", type:"flat", qty:true, price:75, qlabel:"Consoles"},
          {id:"m-periph", name:"Keyboard, mouse, or headset service", unit:"Per item", type:"flat", qty:true, price:29, qlabel:"Items"}
        ]},
        {title:"Monthly plan", items:[
          {id:"h-care", name:"Home care plan", unit:"Monitoring, updates, 1 hr remote help per quarter, priority booking", type:"monthly", price:19}
        ]}
      ]
    },
    commercial: {
      sub: "For offices, shops, contractors, churches, and nonprofits.",
      groups: [
        {title:"Managed IT", items:[
          {id:"b-it", name:"Small business IT plan", unit:"Monitoring, patching, backups, help desk · $300/mo minimum", type:"users", price:95, min:300, def:5},
          {id:"b-checkup", name:"30-minute tech checkup", unit:"Backups, passwords, WiFi, and updates reviewed, with a written report", type:"free"}
        ]},
        {title:"Setup projects", items:[
          {id:"b-m365", name:"Microsoft 365 or Google Workspace setup", unit:"Email on your domain, migration, shared files · estimated hours", type:"hours", price:75, def:4},
          {id:"b-net", name:"Business network & WiFi setup", unit:"Firewall, business WiFi, guest network · estimated hours", type:"hours", price:75, def:4, parts:true},
          {id:"b-onsite", name:"Computer setup & on-site support", unit:"Estimated hours", type:"hours", price:75, def:2}
        ]},
        {title:"Websites", items:[
          {id:"b-site", name:"Website", type:"tier", tiers:[
            {label:"Starter, up to 5 pages", price:1500},
            {label:"Standard, up to 10 pages", price:2500},
            {label:"Online store or booking site", price:3000, from:true}
          ]},
          {id:"b-gbp", name:"Google Business Profile setup", type:"flat", price:299},
          {id:"b-care", name:"Website care plan", unit:"Hosting, updates, backups, small edits", type:"monthly", price:79}
        ]},
        {title:"Software & automation", items:[
          {id:"b-auto", name:"Automation & Power Platform", unit:"Quotes, invoices, scheduling, reports · estimated hours", type:"hours", price:100, def:10},
          {id:"b-custom", name:"Custom software & apps", unit:"Web apps, portals, mobile apps · estimated hours", type:"hours", price:100, def:20}
        ]}
      ]
    }
  };


  /* ---------- Shared ---------- */
  // Home picker chips; also the "What do you need?" options on the contact form
  var picks = [
    {k:"Slow or broken computer", svc:"Diagnosis & repair", note:"Tune-ups, Windows reinstalls, SSD upgrades, and hardware fixes for PCs, Macs, and laptops.", q:"residential:r-tune"},
    {k:"Viruses or pop-ups", svc:"Virus & malware removal", note:"Full cleanup plus a check of your browsers, extensions, and saved passwords.", q:"residential:r-virus"},
    {k:"Cracked phone screen", svc:"Phone & tablet repair", note:"Screens, batteries, and charging ports for iPhone, Galaxy, Pixel, and iPad.", q:"residential:p-screen"},
    {k:"WiFi dead zones", svc:"Whole-home mesh WiFi", note:"Nodes placed where they work best and secured, so every room gets a strong signal.", q:"residential:w-mesh"},
    {k:"WiFi for the garage or dock", svc:"Outbuilding WiFi link", note:"Point-to-point bridge and outdoor access point for garages, shops, barns, and boathouses.", q:"residential:w-link"},
    {k:"IT for my business", svc:"Small business IT plan", note:"Monitoring, patching, backups, and a help desk, priced per user. Start with a free tech checkup.", q:"commercial:b-it"},
    {k:"A new website", svc:"Website design", note:"Fast, mobile-friendly sites built to show up on Google, with optional care plans.", q:"commercial:b-site"},
    {k:"Automate busywork", svc:"Automation & custom software", note:"Quotes, invoices, scheduling, and reports connected across the apps you already use.", q:"commercial:b-auto"},
    {k:"Old VHS tapes", svc:"Tapes to digital", note:"VHS, VHS-C, MiniDV, and Hi8 to a USB drive or download link. Home recordings only.", q:"residential:m-vhs"}
  ];

  function param(name){ var m = new RegExp("[?&]" + name + "=([^&]*)").exec(location.search); return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : ""; }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menuBtn"), bar = document.querySelector(".bar");
  if(menuBtn){
    menuBtn.addEventListener("click", function(){
      var open = !bar.classList.contains("open");
      bar.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", open);
    });
  }

  /* ---------- Pricing page ---------- */
  function initPricing(){
    /* ---------- State ---------- */
    var mode = "residential";
    var state = { residential:{}, commercial:{} };
    var where = { kind:"drop", miles:10 };

    function fmt(n){
      var neg = n < 0; n = Math.abs(n);
      var s = (Math.round(n*100) % 100 === 0) ? Math.round(n).toLocaleString("en-US") : n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
      return (neg ? "−$" : "$") + s;
    }
    function priceLabel(it){
      if(it.type==="free") return "Free";
      if(it.type==="hours") return fmt(it.price)+"/hr";
      if(it.type==="users") return fmt(it.price)+"/user/mo";
      if(it.type==="monthly") return fmt(it.price)+"/mo";
      if(it.type==="tier") return "from "+fmt(it.tiers[0].price);
      if(it.type==="cams") return "from "+fmt(it.price);
      return (it.from ? "from " : "") + fmt(it.price) + (it.parts ? " + parts" : "");
    }
    function getS(id){ var s = state[mode][id]; if(!s){ s = state[mode][id] = {on:false, qty:null, tier:0}; } return s; }
    function findItem(m, id){ var g = DATA[m].groups; for(var i=0;i<g.length;i++){ for(var j=0;j<g[i].items.length;j++){ if(g[i].items[j].id===id) return g[i].items[j]; } } return null; }
    function defQty(it){ return it.def || 1; }

    /* ---------- Render options ---------- */
    var qOptions = document.getElementById("qOptions");
    function stepper(id, val, step, label){
      return '<span class="qlabel">'+label+'</span><span class="stepper"><button type="button" data-step="-1" data-id="'+id+'" aria-label="Fewer '+label.toLowerCase()+'">−</button>'+
        '<input type="number" inputmode="numeric" min="1" step="'+step+'" value="'+val+'" data-qty="'+id+'" id="qty-'+id+'" aria-label="'+label+'">'+
        '<button type="button" data-step="1" data-id="'+id+'" aria-label="More '+label.toLowerCase()+'">+</button></span>';
    }
    function renderOptions(){
      var html = "";
      var d = DATA[mode];
      if(mode==="residential"){
        html += '<div class="qgroup"><h2>Where</h2><div class="where" role="radiogroup" aria-label="Service location">'+
          '<label><input type="radio" name="where" value="drop" id="whereDrop"'+(where.kind==="drop"?" checked":"")+'>Drop-off or remote</label>'+
          '<label><input type="radio" name="where" value="house" id="whereHouse"'+(where.kind==="house"?" checked":"")+'>House call</label></div>'+
          (where.kind==="house" ? '<div class="miles"><span class="qlabel">Miles from Fond du Lac</span><span class="stepper"><button type="button" data-miles="-5" aria-label="Fewer miles">−</button><input type="number" inputmode="numeric" min="0" step="1" value="'+where.miles+'" id="milesIn" aria-label="Miles"><button type="button" data-miles="5" aria-label="More miles">+</button></span></div>' : '')+
          '</div>';
      }
      d.groups.forEach(function(g){
        html += '<div class="qgroup"><h2>'+g.title+'</h2>';
        g.items.forEach(function(it){
          var s = getS(it.id);
          html += '<div class="qitem"><input type="checkbox" id="cb-'+it.id+'" data-cb="'+it.id+'"'+(s.on?" checked":"")+'>'+
            '<div><label class="qname" for="cb-'+it.id+'">'+it.name+'</label>'+(it.unit?'<span class="qunit">'+it.unit+'</span>':'')+'</div>'+
            '<span class="qprice">'+priceLabel(it)+'</span>';
          if(s.on){
            var q = s.qty || defQty(it);
            if(it.type==="hours") html += '<div class="qextra">'+stepper(it.id,q,0.5,"Hours")+'</div>';
            else if(it.type==="users") html += '<div class="qextra">'+stepper(it.id,q,1,"Users")+'</div>';
            else if(it.type==="cams" || (it.type==="flat" && it.qty)) html += '<div class="qextra">'+stepper(it.id,q,it.step||1,it.qlabel||"Quantity")+'</div>';
            else if(it.type==="tier"){
              html += '<div class="qextra"><div class="tiers" role="radiogroup" aria-label="Website type">';
              it.tiers.forEach(function(t,i){
                html += '<label><input type="radio" name="tier-'+it.id+'" data-tier="'+it.id+'" value="'+i+'"'+(s.tier===i?" checked":"")+'><span>'+t.label+'</span><span>'+(t.from?"from ":"")+fmt(t.price)+'</span></label>';
              });
              html += '</div></div>';
            }
          }
          html += '</div>';
        });
        html += '</div>';
      });
      qOptions.innerHTML = html;
    }

    /* ---------- Compute quote ---------- */
    function compute(){
      var once = [], monthly = [], anyParts = false, anyFrom = false, anyEst = false, laborOnce = 0;
      DATA[mode].groups.forEach(function(g){
        g.items.forEach(function(it){
          var s = state[mode][it.id];
          if(!s || !s.on) return;
          var q = s.qty || defQty(it);
          if(it.parts) anyParts = true;
          if(it.type==="flat"){
            var amt = it.price * (it.qty ? q : 1);
            once.push([it.name + (it.qty && q>1 ? " × "+q : "") + (it.from ? " (starting)" : ""), amt]);
            if(it.from) anyFrom = true;
          } else if(it.type==="cams"){
            once.push([it.name + " × " + q, it.price + it.extra * Math.max(0,q-1)]);
          } else if(it.type==="hours"){
            once.push([it.name + " · " + q + " hr", it.price*q]);
            if(/estimated/i.test(it.unit||"")) anyEst = true;
          } else if(it.type==="tier"){
            var t = it.tiers[s.tier||0];
            once.push([t.label + (t.from ? " (starting)" : ""), t.price]);
            if(t.from) anyFrom = true;
          } else if(it.type==="free"){
            once.push([it.name, 0]);
          } else if(it.type==="monthly"){
            monthly.push([it.name, it.price]);
          } else if(it.type==="users"){
            var base = it.price*q, amtM = Math.max(base, it.min);
            monthly.push([it.name + " · " + q + (q===1?" user":" users"), amtM]);
            if(amtM > base) monthly.push(["Includes " + fmt(it.min) + " monthly minimum", null]);
          }
        });
      });
      var adj = [];
      var subtotal = once.reduce(function(a,l){ return a + l[1]; }, 0);
      if(mode==="residential" && where.kind==="house" && (once.length || monthly.length)){
        var travel = Math.max(0, (where.miles||0) - 15) * 1;
        if(travel > 0) adj.push(["Travel · " + ((where.miles||0)-15) + " mi beyond 15", travel]);
        if(subtotal < 99){ adj.push(["House call minimum", 99 - subtotal]); }
      }
      var onceTotal = subtotal + adj.reduce(function(a,l){ return a + l[1]; }, 0);
      var monthTotal = monthly.reduce(function(a,l){ return a + (l[1]||0); }, 0);
      return {once:once, adj:adj, monthly:monthly, onceTotal:onceTotal, monthTotal:monthTotal, anyParts:anyParts, anyFrom:anyFrom, anyEst:anyEst};
    }

    var qLines = document.getElementById("qLines"), qTotals = document.getElementById("qTotals"), qNotes = document.getElementById("qNotes");
    var qbAmt = document.getElementById("qbAmt"), qbLbl = document.getElementById("qbLbl");
    function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }
    function renderQuote(){
      var r = compute(), h = "";
      if(!r.once.length && !r.monthly.length){
        h = '<p class="rempty">Check a service to start your quote.</p>';
      } else {
        if(r.once.length){
          h += '<div class="rsub">One-time</div>';
          r.once.forEach(function(l){ h += '<div class="rline"><span>'+esc(l[0])+'</span><span>'+(l[1]===0?"Free":fmt(l[1]))+'</span></div>'; });
          r.adj.forEach(function(l){ h += '<div class="rline adj"><span>'+esc(l[0])+'</span><span>'+fmt(l[1])+'</span></div>'; });
        } else if(r.adj.length){
          h += '<div class="rsub">One-time</div>';
          r.adj.forEach(function(l){ h += '<div class="rline adj"><span>'+esc(l[0])+'</span><span>'+fmt(l[1])+'</span></div>'; });
        }
        if(r.monthly.length){
          h += '<div class="rsub">Monthly</div>';
          r.monthly.forEach(function(l){ h += '<div class="rline'+(l[1]===null?" adj":"")+'"><span>'+esc(l[0])+'</span><span>'+(l[1]===null?"":fmt(l[1])+"/mo")+'</span></div>'; });
        }
      }
      qLines.innerHTML = h;

      var t = '<div class="rtotal-row"><span class="lbl">One-time total</span><span class="big red">'+fmt(r.onceTotal)+'</span></div>';
      if(r.monthTotal > 0) t += '<div class="rtotal-row"><span class="lbl">Monthly</span><span class="mid">'+fmt(r.monthTotal)+'/mo</span></div>';
      qTotals.innerHTML = t;

      var n = [];
      if(r.anyParts) n.push("Parts and equipment are extra, billed at cost plus handling and itemized.");
      if(r.anyEst) n.push("Hours are estimates. We confirm them after a free call, before any work starts.");
      if(r.anyFrom) n.push("Starting prices are confirmed once we see the device or project.");
      if(mode==="residential" && where.kind==="drop" && r.once.length) n.push("Drop-off or remote. Switch to House call to include travel.");
      qNotes.innerHTML = n.map(function(x){ return "<p>"+x+"</p>"; }).join("");

      qbAmt.textContent = fmt(r.onceTotal) + (r.monthTotal>0 ? " + " + fmt(r.monthTotal) + "/mo" : "");
      qbLbl.textContent = (mode==="residential" ? "Residential" : "Commercial") + " quote";
      document.getElementById("qMode").textContent = mode==="residential" ? "Residential" : "Commercial";
      return r;
    }

    function setMode(m){
      mode = m;
      document.getElementById("modeRes").setAttribute("aria-pressed", m==="residential");
      document.getElementById("modeCom").setAttribute("aria-pressed", m==="commercial");
      document.getElementById("modeSub").textContent = DATA[m].sub;
      renderOptions(); renderQuote();
    }
    document.getElementById("modeRes").addEventListener("click", function(){ setMode("residential"); });
    document.getElementById("modeCom").addEventListener("click", function(){ setMode("commercial"); });

    /* ---------- Option events ---------- */
    function clampQty(it, v){
      var minV = it.type==="hours" ? 0.5 : 1;
      v = parseFloat(v); if(isNaN(v)) v = minV;
      if(it.type==="hours") v = Math.round(v*2)/2;
      else v = Math.round(v);
      return Math.max(minV, Math.min(v, 10000));
    }
    qOptions.addEventListener("change", function(e){
      var el = e.target;
      if(el.dataset.cb){
        var s = getS(el.dataset.cb); s.on = el.checked;
        if(s.on && !s.qty){ s.qty = defQty(findItem(mode, el.dataset.cb)); }
        renderOptions(); renderQuote();
        var again = document.getElementById("cb-"+el.dataset.cb); if(again) again.focus();
      } else if(el.dataset.tier){
        getS(el.dataset.tier).tier = parseInt(el.value,10); renderQuote();
      } else if(el.name==="where"){
        where.kind = el.value; renderOptions(); renderQuote();
        var w = document.getElementById(el.value==="house"?"whereHouse":"whereDrop"); if(w) w.focus();
      }
    });
    qOptions.addEventListener("input", function(e){
      var el = e.target;
      if(el.dataset.qty){
        var it = findItem(mode, el.dataset.qty);
        if(el.value === "") return;
        getS(it.id).qty = clampQty(it, el.value); renderQuote();
      } else if(el.id==="milesIn"){
        var v = parseInt(el.value,10); where.miles = isNaN(v) ? 0 : Math.max(0, Math.min(v, 500)); renderQuote();
      }
    });
    qOptions.addEventListener("blur", function(e){
      var el = e.target;
      if(el.dataset && el.dataset.qty){ var it = findItem(mode, el.dataset.qty); el.value = getS(it.id).qty || defQty(it); }
      if(el.id==="milesIn"){ el.value = where.miles; }
    }, true);
    qOptions.addEventListener("click", function(e){
      var b = e.target.closest("button"); if(!b) return;
      if(b.dataset.step){
        var it = findItem(mode, b.dataset.id), s = getS(it.id);
        var step = it.type==="hours" ? 0.5 : (it.step || 1);
        s.qty = clampQty(it, (s.qty||defQty(it)) + step*parseInt(b.dataset.step,10));
        var inp = document.getElementById("qty-"+it.id); if(inp) inp.value = s.qty;
        renderQuote();
      } else if(b.dataset.miles){
        where.miles = Math.max(0, Math.min((where.miles||0) + parseInt(b.dataset.miles,10), 500));
        var mi = document.getElementById("milesIn"); if(mi) mi.value = where.miles;
        renderQuote();
      }
    });

    document.getElementById("qReset").addEventListener("click", function(){
      state[mode] = {}; if(mode==="residential"){ where = {kind:"drop", miles:10}; }
      renderOptions(); renderQuote();
    });

    function preselect(m, id){
      if(m !== mode) mode = m;
      var s = state[m][id] || (state[m][id] = {on:false, qty:null, tier:0});
      s.on = true; if(!s.qty) s.qty = defQty(findItem(m, id));
      setMode(m);
    }


    /* ---------- Send quote to contact page ---------- */
    document.getElementById("qSend").addEventListener("click", function(){
      var r = compute();
      if(!r.once.length && !r.monthly.length){ qLines.innerHTML = '<p class="rempty">Check at least one service first.</p>'; return; }
      var lines = ["FondyTech " + (mode==="residential"?"residential":"commercial") + " quote:"];
      r.once.forEach(function(l){ lines.push("- " + l[0] + ": " + (l[1]===0?"Free":fmt(l[1]))); });
      r.adj.forEach(function(l){ lines.push("- " + l[0] + ": " + fmt(l[1])); });
      r.monthly.forEach(function(l){ if(l[1]!==null) lines.push("- " + l[0] + ": " + fmt(l[1]) + "/mo"); });
      lines.push("One-time total: " + fmt(r.onceTotal) + (r.monthTotal>0 ? " | Monthly: " + fmt(r.monthTotal) + "/mo" : ""));
      if(mode==="residential") lines.push("Location: " + (where.kind==="house" ? "House call, " + where.miles + " miles" : "Drop-off or remote"));
      location.href = "contact.html?need=" + encodeURIComponent("Quote from the pricing page") + "&quote=" + encodeURIComponent(lines.join("\n"));
    });

    // pricing.html?add=residential:w-mesh starts with that service checked
    var add = param("add").split(":");
    if(add.length === 2 && DATA[add[0]] && findItem(add[0], add[1])) preselect(add[0], add[1]);
    else setMode("residential");
  }
  if(document.getElementById("qOptions")) initPricing();

  /* ---------- Home picker ---------- */
  var chips = document.getElementById("chips");
  if(chips){
    var rSvc = document.getElementById("rSvc"), rNote = document.getElementById("rNote"), rQuote = document.getElementById("rQuote"), rBook = document.getElementById("rBook");
    picks.forEach(function(p, i){
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = p.k;
      b.setAttribute("aria-pressed", i===0 ? "true" : "false");
      b.addEventListener("click", function(){ pick(i); });
      chips.appendChild(b);
    });
    var pick = function(i){
      Array.prototype.forEach.call(chips.children, function(c,j){ c.setAttribute("aria-pressed", j===i ? "true" : "false"); });
      rSvc.textContent = picks[i].svc; rNote.textContent = picks[i].note;
      rQuote.href = "pricing.html?add=" + picks[i].q;
      rBook.href = "contact.html?need=" + encodeURIComponent(picks[i].k);
    };
    pick(0);
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("bookForm");
  if(form){
    var need = document.getElementById("fNeed"), note = document.getElementById("formNote");
    picks.map(function(p){ return p.k; }).concat(["Quote from the pricing page","Something else"]).forEach(function(t){
      var o = document.createElement("option"); o.textContent = t; need.appendChild(o);
    });
    // contact.html?need=...&quote=... comes from the picker, Business IT, or the quote builder
    var wanted = param("need"), quote = param("quote");
    if(wanted) need.value = wanted;
    if(quote) document.getElementById("fMsg").value = quote;
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var name = document.getElementById("fName"), reach = document.getElementById("fReach");
      if(!name.value.trim() || !reach.value.trim()){
        note.textContent = "Add your name and a phone number or email so we can reply.";
        note.hidden = false; (name.value.trim() ? reach : name).focus(); return;
      }
      note.textContent = "Preview only: this form isn’t connected yet, so nothing was sent. On the live site it will deliver your request to FondyTech.";
      note.hidden = false;
    });
  }
})();
