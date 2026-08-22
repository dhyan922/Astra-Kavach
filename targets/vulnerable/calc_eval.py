def evaluate_expression(expression: str) -> float:
    """
    Evaluates a simple mathematical expression using eval.
    Vulnerable to Arbitrary Code Execution if expression is malicious.
    """
    # Vulnerable implementation: direct eval is highly dangerous
    return float(eval(expression))
