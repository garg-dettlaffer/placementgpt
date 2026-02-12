// Simple wrapper for Piston API code execution
const PISTON_API = import.meta.env.VITE_PISTON_API_URL || 'https://emkc.org/api/v2/piston';

const languageMap = {
  python: { name: 'python', version: '3.10.0', extension: 'py' },
  javascript: { name: 'javascript', version: '18.15.0', extension: 'js' },
  java: { name: 'java', version: '15.0.2', extension: 'java' },
  cpp: { name: 'c++', version: '10.2.0', extension: 'cpp' },
  c: { name: 'c', version: '10.2.0', extension: 'c' },
};

export async function executeCode(language, code, stdin = '') {
  const langConfig = languageMap[language] || languageMap.python;

  try {
    const response = await fetch(`${PISTON_API}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: langConfig.name,
        version: langConfig.version,
        files: [
          {
            name: `solution.${langConfig.extension}`,
            content: code
          }
        ],
        stdin: stdin,
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Code execution error:', error);
    throw new Error(`Failed to execute code: ${error.message}`);
  }
}

export default { executeCode };
