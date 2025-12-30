/**
 * Secure code execution sandbox for coding games
 * Prevents arbitrary code execution and XSS attacks
 */

/**
 * Allowed function names that can be used in code games
 */
const ALLOWED_FUNCTION_NAMES = [
  'sortNumbers',
  'findMedian',
  'twoSum',
  'reverseString',
  'isPalindrome',
  'golfScore',
  'fizzBuzz',
];

/**
 * Allowed keywords in user code (whitelist approach)
 */
const ALLOWED_KEYWORDS = [
  'function', 'return', 'if', 'else', 'for', 'while', 'const', 'let', 'var',
  'true', 'false', 'null', 'undefined', 'Math', 'Array', 'String', 'Number',
  'parseInt', 'parseFloat', 'toString', 'length', 'push', 'pop', 'shift', 'unshift',
  'slice', 'splice', 'indexOf', 'includes', 'map', 'filter', 'reduce', 'sort',
  'split', 'join', 'substring', 'substr', 'toLowerCase', 'toUpperCase', 'trim',
  'abs', 'floor', 'ceil', 'round', 'max', 'min', 'pow', 'sqrt',
];

/**
 * Dangerous patterns that should be blocked
 */
const DANGEROUS_PATTERNS = [
  /eval\s*\(/i,
  /Function\s*\(/i,
  /setTimeout\s*\(/i,
  /setInterval\s*\(/i,
  /document\./i,
  /window\./i,
  /localStorage\./i,
  /sessionStorage\./i,
  /XMLHttpRequest/i,
  /fetch\s*\(/i,
  /import\s+/i,
  /require\s*\(/i,
  /process\./i,
  /global\./i,
  /__proto__/i,
  /constructor\./i,
  /\.prototype\./i,
];

/**
 * Validate code before execution
 */
export function validateCode(code: string): { valid: boolean; error?: string } {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'Invalid code' };
  }

  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      return { valid: false, error: 'Code contains unsafe operations' };
    }
  }

  // Check code length (prevent DoS)
  if (code.length > 5000) {
    return { valid: false, error: 'Code is too long' };
  }

  return { valid: true };
}

/**
 * Safely execute code in a sandboxed context
 */
export function safeExecuteCode(
  code: string,
  functionName: string,
  params: any[]
): { success: boolean; result?: any; error?: string } {
  // Validate code first
  const validation = validateCode(code);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Check if function name is allowed
  if (!ALLOWED_FUNCTION_NAMES.includes(functionName)) {
    return { success: false, error: 'Invalid function name' };
  }

  try {
    // Create a safe execution context
    const safeContext = {
      // Only allow safe Math operations
      Math: {
        abs: Math.abs,
        floor: Math.floor,
        ceil: Math.ceil,
        round: Math.round,
        max: Math.max,
        min: Math.min,
        pow: Math.pow,
        sqrt: Math.sqrt,
      },
      // Only allow safe Array methods
      Array: {
        isArray: Array.isArray,
      },
      // Only allow safe Number methods
      Number: {
        parseInt: parseInt,
        parseFloat: parseFloat,
        isNaN: Number.isNaN,
        isFinite: Number.isFinite,
      },
      // Only allow safe String methods
      String: {
        fromCharCode: String.fromCharCode,
      },
    };

    // Create function with limited scope
    const func = new Function(
      ...Object.keys(safeContext),
      functionName,
      ...params.map((_, i) => `param${i}`),
      `
      ${code}
      if (typeof ${functionName} === 'function') {
        return ${functionName}(${params.map((_, i) => `param${i}`).join(', ')});
      }
      return null;
      `
    );

    // Execute with safe context
    const result = func(...Object.values(safeContext), undefined, ...params);

    return { success: true, result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Execution failed' };
  }
}

