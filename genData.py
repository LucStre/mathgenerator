import mathgenerator
import json
import inspect

genList = mathgenerator.get_gen_list()

def get_default_args(func):
    signature = inspect.signature(func)
    return {
        k: v.default
        for k, v in signature.parameters.items()
        if v.default is not inspect.Parameter.empty
    }

data = []
for id, gen in enumerate(genList):
    samples = []
    genFn = mathgenerator.get_by_id(id) 
    for _ in range(10):
        p, s = genFn()
        samples.append({"problem": p, "solution": s})
    data.append({
        "id": id,
        "name": gen[0],
        "function_name": gen[0],
        "subject": gen[1],
        "kwargs": str(inspect.signature(genFn))[1:-1].split(", "),
        "samples": samples
    })

out_file = open("data.js", "w")
out_file.write('const data = ')
json.dump(data, out_file)
out_file.close()