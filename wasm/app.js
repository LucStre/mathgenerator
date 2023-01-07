const d_splash = document.getElementById('splash');
const d_splashMessage = document.getElementById('splash-message');
const d_splashProgress = document.getElementById('splash-progress');

const d_genList = document.getElementById('generatorList');
const d_genListOrig = d_genList.innerHTML;
const d_id = document.getElementById('agId');
const d_title = document.getElementById('agTitle');
const d_funcName = document.getElementById('agFunctionName');
const d_subject = document.getElementById('agSubject');
const d_kwargs = document.getElementById('agKwargs');
const d_kwargInputs = document.getElementById('agKwargInputs');
const d_prob = document.getElementById('agProblem');
const d_sol = document.getElementById('agSolution');

let pyodide,
  genDict,
  curId = 0;

function handleSearch() {
  const search = document.getElementById('search').value;

  if (!search) return displayGenDict();

  displayGenDict(
    [...genDict.keys()]
      .filter((g) => g.toLowerCase().includes(search.toLowerCase()))
      .reduce((acc, curr) => {
        acc.set(curr, genDict.get(curr));
        return acc;
      }, new Map()),
    true
  );
}

function getKwargs() {
  const kwargs = [...document.querySelectorAll('#agKwargInputs input')]
    .map((input) => {
      let value = input.value;

      if (input.type === 'number') value = +value;
      else if (input.getAttribute('data-array') === 'true')
        value = `[${value
          .split(',')
          .map((v) => (isNaN(v) ? `'${v}'` : v))
          .join(', ')}]`;
      else value = `'${value}'`;

      return `${input.name}=${value}`;
    })
    .join(', ');

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
  let g = [...genDict.values()][id];
  d_id.innerHTML = g.get('id');
  d_title.innerHTML = g.get('name');
  d_funcName.innerHTML = g.get('name');
  d_subject.innerHTML = g.get('subject');
  // d_kwargs.innerHTML = g.get("kwargs").join(', ');
  d_kwargInputs.innerHTML = g
    .get('kwargs')
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
        : valueIsNumber
        ? valueRaw
        : valueRaw.slice(1, -1);

      return `<label>${name}: <input name="${name}" value="${value}" type="${inputType}" data-array="${valueIsArray}" /></label>`;
    })
    .join('');
  // Move to top of screen if on mobile
  if (window.innerWidth < 790) window.scrollTo(0, 0);
  // Run generator
  generateSample();
}

function displayGenDict(dict = genDict, open = false) {
  const groups = {};
  for (const gen of dict.values()) {
    var div = document.createElement('div');
    div.className = 'generatorListItem';
    div.innerHTML = `<p class='genListItem'>${gen.get('name')}</p>`;
    div.onclick = () => setGenerator(gen.get('id'));
    groups[gen.get('subject')] = groups[gen.get('subject')] || [];
    groups[gen.get('subject')].push(div);
  }
  d_genList.innerHTML = d_genListOrig;
  for (let group in groups) {
    const details = document.createElement('details');
    if (open) details.setAttribute('open', '');
    details.innerHTML = `<summary>${group
      .split('_')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ')}</summary>`;
    groups[group].forEach((div) => details.appendChild(div));
    d_genList.appendChild(details);
  }
}

(async () => {
  d_splashMessage.innerHTML = 'Loading <code>pyodide</code>...';
  pyodide = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.20.0/full/',
  });

  d_splashMessage.innerHTML = 'Loading <code>micropip</code>...';
  await pyodide.loadPackage('micropip');
  const micropip = pyodide.pyimport('micropip');

  d_splashMessage.innerHTML = 'Installing <code>mathgenerator</code>...';
  await micropip.install('./mathgenerator-1.5.0-py3-none-any.whl');

  d_splashMessage.innerHTML = 'Loading <code>mathgenerator</code>...';
  await pyodide.runPython('import mathgenerator');

  d_splashMessage.innerHTML = 'Loading list of generators...';
  await pyodide.runPython(`import mathgenerator
import inspect

genList = mathgenerator.get_gen_list()

def get_default_args(func):
    signature = inspect.signature(func)
    return {
        k: v.default
        for k, v in signature.parameters.items()
        if v.default is not inspect.Parameter.empty
    }

data = {}
for id, gen in enumerate(genList):
    samples = []
    genFn = mathgenerator.get_by_id(id) 
    for _ in range(10):
        p, s = genFn()
        samples.append({"problem": p, "solution": s})
    data[gen[0]] = {
        "id": id,
        "name": gen[0],
        "function_name": gen[0],
        "subject": gen[1],
        "kwargs": str(inspect.signature(genFn))[1:-1].split(", "),
        "samples": samples
    }
`);
  genDict = pyodide.globals.get('data').toJs();
  displayGenDict();

  d_splashMessage.innerHTML = 'Finishing up...';
  setGenerator(curId);

  d_splash.style.display = 'none';

  // Set up search
  document.getElementById('search').oninput = handleSearch;

  document.getElementById('resetKwargs').onclick = () => setGenerator(curId);
})();
