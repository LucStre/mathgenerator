import random
from scipy.integrate import quad
import sympy


def definite_integral(max_coef=100):
    r"""Definite Integral of Quadratic Equation

    | Ex. Problem | Ex. Solution |
    | --- | --- |
    | The definite integral within limits $0$ to $1$ of the equation $28x^2 + 32x + 66 = $ | $91.33$ |
    """
    def integrand(x, a, b, c):
        return a * x**2 + b * x + c

    a = random.randint(0, max_coef)
    b = random.randint(0, max_coef)
    c = random.randint(0, max_coef)

    result = quad(integrand, 0, 1, args=(a, b, c))[0]
    solution = round(result, 2)

    problem = f"The definite integral within limits $0$ to $1$ of the equation ${a}x^2 + {b}x + {c} = $"
    return problem, f'${solution}$'


def power_rule_differentiation(max_coef=10,
                               max_exp=10,
                               max_terms=5):
    r"""Power Rule Differentiation

    | Ex. Problem | Ex. Solution |
    | --- | --- |
    | Differentiate $1x^{5} + 4x^{7} + 4x^{4}$ | $5x^{4} + 28x^{6} + 16x^{3}$ |
    """
    numTerms = random.randint(1, max_terms)
    problem = "Differentiate $"
    solution = "$"

    for i in range(numTerms):
        if i > 0:
            problem += " + "
            solution += " + "
        coefficient = random.randint(1, max_coef)
        exponent = random.randint(1, max_exp)

        problem += f'{coefficient}x^{{{exponent}}}'
        solution += f'{coefficient * exponent}x^{{{exponent - 1}}}'

    return problem + '$', solution + '$'


def power_rule_integration(max_coef=10,
                           max_exp=10,
                           max_terms=5):
    r"""Power Rule Integration

    | Ex. Problem | Ex. Solution |
    | --- | --- |
    | Integrate $9x^{6} + 2x^{6} + 4x^{3}$ | $\frac{9}{6}x^{7} + \frac{2}{6}x^{7} + \frac{4}{3}x^{4} + C$ |
    """
    numTerms = random.randint(1, max_terms)
    problem = "Integrate $"
    solution = "$"

    for i in range(numTerms):
        if i > 0:
            problem += " + "
            solution += " + "
        coefficient = random.randint(1, max_coef)
        exponent = random.randint(1, max_exp)

        problem += f'{coefficient}x^{{{exponent}}}'
        solution += rf'\frac{{{coefficient}}}{{{exponent}}}x^{{{exponent + 1}}}'

    solution += " + C"

    return problem + '$', solution + '$'


def stationary_points(max_exp=3, max_coef=10):
    r"""Stationary Points

    | Ex. Problem | Ex. Solution |
    | --- | --- |
    | $f(x)=6*x^3 + 6*x^2 + x + 8$ | ${- \frac{1}{3} - \frac{\sqrt{2}}{6}, - \frac{1}{3} + \frac{\sqrt{2}}{6}}$ |
    """
    solution = ''
    while len(solution) == 0:
        x = sympy.symbols('x')
        problem = 0
        for exp in range(max_exp + 1):
            coefficient = random.randint(0, max_coef)
            problem += coefficient * pow(x, exp)
        solution = sympy.stationary_points(problem, x)

    problem = 'f(x)=' + str(problem).replace('**', '^')
    return f'${problem}$', f'${sympy.latex(solution)[6:-8]}}}$'


def trig_differentiation():
    r"""Trigonometric Differentiation

    | Ex. Problem | Ex. Solution |
    | --- | --- |
    | $\frac{d}{dx}(\csc)=$ | $-\csc \cdot \cot$ |
    """
    pairs = {
        r'\sin': r'\cos',
        r'\cos': r'-\sin',
        r'\tan': r'\sec^{{2}}',
        r'\cot': r'-\csc^{{2}}',
        r'\sec': r'\sec \cdot \tan',
        r'\csc': r'-\csc \cdot \cot'
    }
    problem = random.choice(list(pairs.keys()))
    solution = f'${pairs[problem]}$'
    problem = rf'$\frac{{d}}{{dx}}({problem})=$'

    return problem, solution


def generate_equation(x, max_elements, min_value, max_value, min_exponent, max_exponent):
    for i in range(random.randint(1, max_elements)):
        element = random.randint(min_value, max_value) * x**random.randint(min_exponent, max_exponent)
        if i == 0:
            equation = element
        else:
            equation += element
    return equation


def indefinite_integral(max_elements=4, min_value=-5, max_value=5, min_exponent=-5, max_exponent=5):
    r"""Indefinite Integral

    | Ex. Problem | Ex. Solution |
    | --- | --- |
    | The indefinite integral of the equation $5x^2 + 5 = $ | $5^3/3 + 5x + constant$ |
    """
    x = sympy.Symbol('x')

    equation = generate_equation(x, max_elements, min_value, max_value, min_exponent, max_exponent)
    result = sympy.integrate(equation, x)

    problem = f"The indefinite integral of the equation ${equation}$"
    return problem, f'${result}$ + constant'


def limit(x0=sympy.oo, max_elements=4, min_value=-5, max_value=5, min_exponent=-5, max_exponent=5):
    r"""Limit

    | Ex. Problem | Ex. Solution |
    | --- | --- |
    | The limit of the equation $\lim_{x \to 2} x^{2}$ | $4$ |
    """
    x = sympy.Symbol('x')

    equation = generate_equation(x, max_elements, min_value, max_value, min_exponent, max_exponent)
    result = sympy.limit(equation, x, x0)

    problem = f"The limit of the equation ${equation}$ that tends to ${x0}$"
    return problem, f'${result}$'


def limit_of_sum(min_value=-5, max_value=5, min_exponent=-5, max_exponent=-1):
    r"""Limit of sum

    | Ex. Problem | Ex. Solution |
    | --- | --- |
    | The limit of the sum $\lim_{n \to \infty} \sum_{k=1}^{n} 3/k^{4}/$ | $\pi^{4}/30 \approx 3.25$ |
    """
    n, k = sympy.Symbol('n'), sympy.Symbol('k')

    equation = generate_equation(k, 1, min_value, max_value, min_exponent, max_exponent)
    sum = sympy.Sum(equation, (k, 1, n)).doit()
    result = sympy.limit(sum, n, sympy.oo)

    problem = f"The limit of the sum ${equation}$ from ${1}$ to ${n}$ that tends to ${sympy.oo}$"
    return problem, f'${result}$ \approx ${round(result.evalf(), 2)}$'


def sequence_sum(min_value=-5, max_value=5, min_exponent=-5, max_exponent=-1):
    r"""Infinite sum of sequence

    | Ex. Problem | Ex. Solution |
    | --- | --- |
    | The infinite sum of $\sum_{n=1}^{\infty} 1/n^{2}$ | $(\pi^{2})/6 \approx 1.64$ |
    """
    n = sympy.Symbol('n')

    equation = generate_equation(n, 1, min_value, max_value, min_exponent, max_exponent)
    sum = sympy.Sum(equation, (n, 1, sympy.oo))
    result = sum.doit()
    if sum.is_convergent():
        convergence = "converges"
    else:
        convergence = "diverges"
    problem = f"The infinite sum of the equation ${equation}$"
    return problem, f'${result}$ \approx ${round(result.evalf(), 2)} ${convergence}$'
