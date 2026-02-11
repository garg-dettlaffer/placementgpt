const PISTON_API = import.meta.env.VITE_PISTON_API_URL || 'https://emkc.org/api/v2/piston';

export const piston = {
  async execute(language, code, stdin = '', testCases = []) {
    const languageMap = {
      'Python 3': 'python',
      'Java': 'java',
      'C++': 'cpp',
      'JavaScript': 'javascript',
      'Python': 'python'
    };

    const pistonLang = languageMap[language] || language.toLowerCase();

    try {
      const response = await fetch(`${PISTON_API}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: pistonLang,
          version: '*',
          files: [
            {
              name: `solution.${this.getExtension(pistonLang)}`,
              content: code
            }
          ],
          stdin: stdin,
          args: [],
          compile_timeout: 10000,
          run_timeout: 3000,
          compile_memory_limit: -1,
          run_memory_limit: -1
        })
      });

      const result = await response.json();
      
      if (testCases.length > 0) {
        const testResults = [];
        for (const testCase of testCases) {
          try {
            const testResponse = await fetch(`${PISTON_API}/execute`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                language: pistonLang,
                version: '*',
                files: [{ 
                  name: `solution.${this.getExtension(pistonLang)}`, 
                  content: code 
                }],
                stdin: testCase.input || '',
              })
            });
            
            const testResult = await testResponse.json();
            const actualOutput = testResult.run?.stdout?.trim() || '';
            const expectedOutput = testCase.output?.trim() || '';
            
            testResults.push({
              input: testCase.input,
              expectedOutput: expectedOutput,
              actualOutput: actualOutput,
              passed: actualOutput === expectedOutput,
              error: testResult.run?.stderr || testResult.compile?.stderr
            });
          } catch (err) {
            testResults.push({
              input: testCase.input,
              expectedOutput: testCase.output,
              actualOutput: '',
              passed: false,
              error: err.message
            });
          }
        }
        
        return {
          ...result,
          testResults,
          allPassed: testResults.every(t => t.passed)
        };
      }

      return result;
    } catch (error) {
      return {
        run: {
          stdout: '',
          stderr: `Error: ${error.message}`,
          code: 1
        }
      };
    }
  },

  getExtension(language) {
    const extensions = {
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      javascript: 'js',
      typescript: 'ts',
      go: 'go',
      rust: 'rs'
    };
    return extensions[language] || 'txt';
  },

  async getSupportedLanguages() {
    try {
      const response = await fetch(`${PISTON_API}/runtimes`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      return [];
    }
  }
};
