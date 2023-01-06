const d_splash = document.getElementById('splash');

const d_genList = document.getElementById('generatorList');
const d_id = document.getElementById('agId');
const d_title = document.getElementById('agTitle');
const d_funcName = document.getElementById('agFunctionName');
const d_subject = document.getElementById('agSubject');
const d_kwargs = document.getElementById('agKwargs');
const d_kwargInputs = document.getElementById('agKwargInputs');
const d_prob = document.getElementById('agProblem');
const d_sol = document.getElementById('agSolution');

let pyodide,
  genList,
  curId = 0;

function getKwargs() {
  const kwargs = [...document.querySelectorAll('#agKwargInputs input')]
    .map((input) => {
      let value = input.value;

      if (input.type === 'number') value = +value;
      if (input.getAttribute('data-array') === 'true')
        value = `[${value
          .split(',')
          .map((v) => (isNaN(v) ? `'${v}'` : v))
          .join(', ')}]`;

      return `${input.name}=${value}`;
    })
    .join(', ');

  console.log('kwargs', kwargs);

  return kwargs;
}

async function generateSample() {
  const out = pyodide.runPython(`mathgenerator.genById(${curId}, ${getKwargs()})`);
  const [problem, solution] = out;
  MathJax.typesetClear([d_prob, d_sol]);
  d_prob.innerHTML = problem;
  d_sol.innerHTML = solution;
  MathJax.typesetPromise([d_prob, d_sol]);
}

async function setGenerator(id) {
  // Set global curId
  curId = id;
  // Set active generator text
  let g = genList.get(id);
  d_id.innerHTML = g.get(0);
  d_title.innerHTML = g.get(1);
  d_funcName.innerHTML = g.get(3);
  d_subject.innerHTML = g.get(4);
  // d_kwargs.innerHTML = [...g.get(5)].join(', ');
  d_kwargInputs.innerHTML = [...g.get(5)]
    .map((input) => {
      const [name, valueRaw] = input.split('=');
      const valueIsNumber = !isNaN(valueRaw);
      const valueIsArray = valueRaw.startsWith('[') && valueRaw.endsWith(']');
      const inputType = valueIsNumber ? 'number' : 'text';

      const value = valueIsArray
        ? valueRaw
            .slice(1, -1)
            .split(', ')
            .map((v) => (isNaN(v) ? v.slice(1, -1) : v))
            .join(',')
        : valueRaw;

      return `<label>${name}: <input name="${name}" value="${value}" type="${inputType}" data-array="${valueIsArray}" /></label>`;
    })
    .join('');
  // Move to top of screen if on mobile
  if (window.innerWidth < 790) window.scrollTo(0, 0);
  // Run generator
  generateSample();
}

(async () => {
  pyodide = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.20.0/full/',
  });
  await pyodide.loadPackage('micropip');
  const micropip = pyodide.pyimport('micropip');
  await micropip.install('mathgenerator');
  await pyodide.runPython('import mathgenerator');
  // Build generator list
  genList = await pyodide.runPython('mathgenerator.getGenList()');
  for (let gen of genList) {
    var div = document.createElement('div');
    div.className = 'generatorListItem';
    div.innerHTML = `<p class='genListItem'>${gen.get(1)}</p>`;
    div.onclick = () => setGenerator(gen.get(0));
    d_genList.appendChild(div);
  }
  generateSample();
  d_splash.style.display = 'none';
})();
