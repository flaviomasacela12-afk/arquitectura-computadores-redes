document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const menuToggle = $('#menuToggle');
  const mainMenu = $('#mainMenu');
  menuToggle?.addEventListener('click', () => {
    const open = mainMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menu' : 'Abrir menu');
  });
  $$('.nav-link').forEach(link => link.addEventListener('click', () => {
    mainMenu.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  const themeToggle = $('#themeToggle');
  const applyTheme = theme => {
    document.body.classList.toggle('dark', theme === 'dark');
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀' : '☾';
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro');
    }
  };
  applyTheme(localStorage.getItem('cybertech-theme') || 'light');
  themeToggle?.addEventListener('click', () => {
    const theme = document.body.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem('cybertech-theme', theme);
    applyTheme(theme);
  });

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    $('#progressBar').style.width = `${scrollable ? (window.scrollY / scrollable) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: .12 });
  $$('.reveal').forEach(element => revealObserver.observe(element));

  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      const link = $(`.nav-link[href="#${entry.target.id}"]`);
      $$('.nav-link').forEach(navLink => navLink.classList.remove('active'));
      link?.classList.add('active');
    }
  }), { rootMargin: '-30% 0px -60% 0px' });
  $$('main section[id]').forEach(section => sectionObserver.observe(section));

  $$('.details-button').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.info-card');
    const open = card.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.firstChild.textContent = open ? 'Ocultar detalles ' : 'Ver detalles ';
  }));

  const cycleMessages = {
    memory: 'La memoria entrega la próxima instrucción a la CPU.', fetch: 'FETCH: la CPU obtiene la instrucción desde memoria.',
    decode: 'DECODE: la Unidad de Control interpreta qué operación debe realizarse.',
    execute: 'EXECUTE: la ALU y los registros realizan la operación solicitada.',
    result: 'RESULTADO: la operación termina y el dato queda disponible.'
  };
  let cycleTimer;
  const setCycleStage = (stage, index) => {
    $$('.cycle-stage').forEach((element, position) => element.classList.toggle('active', position === index));
    $$('.cycle-stage').forEach((element, position) => element.classList.toggle('done', position < index));
    $('#cycleMessage').textContent = cycleMessages[stage];
  };
  $('#startCycle')?.addEventListener('click', () => {
    clearInterval(cycleTimer);
    const stages = ['memory', 'fetch', 'decode', 'execute', 'result'];
    let index = 0;
    setCycleStage(stages[index], index);
    cycleTimer = setInterval(() => {
      index += 1;
      if (index === stages.length) { clearInterval(cycleTimer); return; }
      setCycleStage(stages[index], index);
    }, 900);
  });
  $('#resetCycle')?.addEventListener('click', () => { clearInterval(cycleTimer); setCycleStage('memory', 0); });

  const memoryInfo = {
    registers: ['REGISTROS', 'VELOCIDAD: MUY ALTA · CAPACIDAD: MUY PEQUEÑA', 'Almacenamiento temporal de la información que la CPU está procesando.'],
    cache: ['CACHE', 'VELOCIDAD: ALTA · CAPACIDAD: LIMITADA', 'Conserva datos usados con frecuencia para reducir el tiempo de acceso.'],
    ram: ['RAM', 'VELOCIDAD: MEDIA · CAPACIDAD: MAYOR', 'Memoria principal temporal donde residen programas y datos activos.'],
    storage: ['SSD / HDD', 'VELOCIDAD: MENOR · CAPACIDAD: PERSISTENTE', 'Almacenamiento secundario que conserva la información aun sin energía.']
  };
  const updateMemory = key => {
    const info = memoryInfo[key];
    $('#memoryDetail').innerHTML = `<strong>${info[0]}</strong><span>${info[1]}</span><p>${info[2]}</p>`;
    $$('[data-memory]').forEach(button => button.classList.toggle('active', button.dataset.memory === key));
  };
  $$('#memoryPyramid [data-memory]').forEach(button => button.addEventListener('click', () => updateMemory(button.dataset.memory)));
  $$('.memory-lab').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.memory; updateMemory(key);
    $('#labMemoryOutput').textContent = memoryInfo[key][1].toLowerCase().replace(' · ', ', ');
    $$('.memory-lab').forEach(item => item.classList.toggle('active', item === button));
  }));

  const networkInfo = {
    computer: ['COMPUTADOR', 'Dispositivo que procesa información y participa como origen o destino de una comunicación.', 'Genera y recibe evidencia'], server: ['SERVIDOR', 'Equipo que ofrece servicios, recursos o datos a otros dispositivos conectados.', 'Concentra actividad'], switch: ['SWITCH', 'Conecta equipos dentro de una red local y reenvía tramas al destino correspondiente.', 'Relaciona dispositivos'], router: ['ROUTER', 'Interconecta redes y decide por qué ruta lógica enviar los paquetes.', 'Une segmentos'], ip: ['DIRECCIÓN IP', 'Identificador lógico utilizado para localizar un dispositivo dentro de una red.', 'Permite rastrear origen / destino'], mac: ['DIRECCIÓN MAC', 'Identificador físico asociado a una interfaz de red para la comunicación local.', 'Vincula una interfaz']
  };
  $$('.network-card').forEach(button => button.addEventListener('click', () => {
    const info = networkInfo[button.dataset.network]; $('#networkTitle').textContent = info[0]; $('#networkDescription').textContent = info[1]; $('#networkRelevance').textContent = info[2];
    $$('.network-card').forEach(item => item.classList.toggle('active', item === button));
  }));

  const addressInfo = { ip: ['Una dirección IP identifica lógicamente un dispositivo dentro de una red y puede cambiar según su configuración.', '192.168.1.10'], mac: ['Una dirección MAC identifica físicamente una interfaz de red en el ámbito local correspondiente.', '00:1A:2B:3C:4D:5E'] };
  const updateAddress = key => { $('#addressDescription').textContent = addressInfo[key][0]; $('#addressExample').textContent = addressInfo[key][1]; $$('.switch-button').forEach(button => button.classList.toggle('active', button.dataset.address === key)); };
  $$('.switch-button').forEach(button => button.addEventListener('click', () => updateAddress(button.dataset.address)));
  $$('.address-lab').forEach(button => button.addEventListener('click', () => { $('#labAddressOutput').textContent = addressInfo[button.dataset.address][0]; $$('.address-lab').forEach(item => item.classList.toggle('active', item === button)); }));

  $('#sendPacket')?.addEventListener('click', () => {
    const map = $('.network-map'); map.classList.remove('sending'); void map.offsetWidth; map.classList.add('sending'); $('#packetStatus').textContent = 'Paquete en tránsito: computador A → switch → router → internet.';
    setTimeout(() => { $('#packetStatus').textContent = 'Comunicación observada. Origen, destino y ruta pueden analizarse.'; }, 2800);
  });

  const topologyData = {
    star: ['ESTRELLA', 'Todos los equipos se conectan a un dispositivo central. Es fácil de administrar y aislar.', '<div class="topology-art star-art"><i>PC</i><b>SWITCH</b><i>PC</i><i>PC</i><i>PC</i></div>'],
    ring: ['ANILLO', 'Cada equipo se conecta con dos vecinos y la comunicación sigue una trayectoria circular.', '<div class="topology-art ring-art"><i style="left:10%;top:42%">PC</i><i style="left:40%;top:5%">PC</i><i style="right:8%;top:42%">PC</i><i style="left:40%;bottom:2%">PC</i></div>'],
    bus: ['BUS', 'Todos los equipos comparten un medio principal. Es sencillo, pero una falla en el medio afecta el segmento.', '<div class="topology-art bus-art"><i style="left:8%">PC</i><i style="left:34%">PC</i><i style="left:60%">PC</i><i style="right:5%">PC</i></div>']
  };
  $$('.topology-button').forEach(button => button.addEventListener('click', () => { const data = topologyData[button.dataset.topology]; $('#topologyDescription').textContent = data[1]; $('#topologyVisual').innerHTML = `<div class="topology-name">${data[0]}</div>${data[2]}`; $$('.topology-button').forEach(item => item.classList.toggle('active', item === button)); }));

  const cpuSteps = { fetch: 'FETCH: la CPU obtiene la instrucción desde memoria.', decode: 'DECODE: la Unidad de Control interpreta “sumar dos valores”.', execute: 'EXECUTE: la ALU suma los valores y guarda el resultado.' };
  $$('.lab-step').forEach(button => button.addEventListener('click', () => { $('#labCpuOutput').textContent = cpuSteps[button.dataset.step]; $$('.lab-step').forEach(item => item.classList.toggle('active', item === button)); }));
  $$('.quiz-options button').forEach(button => button.addEventListener('click', () => { const correct = button.dataset.answer === 'correct'; button.classList.add(correct ? 'correct' : 'wrong'); $('#quizOutput').textContent = correct ? '✓ RESPUESTA CORRECTA. RAM, registros y tráfico ofrecen perspectivas diferentes y complementarias.' : 'Revisa nuevamente los tres tipos de evidencia.'; }));

  const concepts = { CPU: 'Unidad central que coordina y ejecuta instrucciones.', ALU: 'Unidad que realiza operaciones aritméticas y lógicas.', UC: 'Unidad que interpreta instrucciones y coordina componentes.', REGISTROS: 'Memoria interna muy rápida para datos temporales.', FETCH: 'Etapa en la que la CPU obtiene una instrucción.', DECODE: 'Etapa en la que la instrucción es interpretada.', EXECUTE: 'Etapa en la que se realiza la operación.', CACHE: 'Memoria rápida que conserva datos usados con frecuencia.', RAM: 'Memoria principal temporal del sistema.', IP: 'Dirección lógica de un dispositivo en una red.', MAC: 'Identificador físico de una interfaz de red.', SWITCH: 'Dispositivo que conecta equipos en una red local.', ROUTER: 'Dispositivo que interconecta redes.', RED: 'Conjunto de dispositivos que intercambian información.', 'EVIDENCIA DIGITAL': 'Información con valor para comprender una actividad informática.', 'LIVE FORENSICS': 'Análisis de información mientras el sistema permanece operativo.' };
  $$('#conceptCloud button').forEach(button => button.addEventListener('click', () => { $('#conceptOutput').textContent = `${button.dataset.concept}: ${concepts[button.dataset.concept]}`; $$('#conceptCloud button').forEach(item => item.classList.toggle('active', item === button)); }));

  const exportToPDF = () => {
    if (typeof html2pdf === 'undefined') { window.print(); return; }
    html2pdf().set({ margin: .35, filename: 'cybertech-arquitectura-redes-ciberdelitos.pdf', image: { type: 'jpeg', quality: .95 }, html2canvas: { scale: 1.4, useCORS: true }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } }).from($('#printArea')).save();
  };
  $('#pdfButton')?.addEventListener('click', exportToPDF); $('#heroPdf')?.addEventListener('click', exportToPDF);
});
