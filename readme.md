## Hoisting Nested Functions

This repository contains an analysis written using Jalangi2 dynamic analysis framework to detect hoistable functions in a given Javascript code. The [analysis](jalangi2/experiments/analysis.js) can be found at the following location
- Analysis:
  - jalangi2/experiments/analysis.js

There are sample examples for each corner case present at the following locations:
- Function declaration:
  - jalangi2/experiments/function_declaration.js
- Anonymous Function Expression:
  - jalangi2/experiments/function_expression_anonymous.js
- Function Expression:
  - jalangi2/experiments/function_expression.js
- Direct Eval:
  - jalangi2/experiments/direct_eval_example.js
- InDirect Eval:
  - jalangi2/experiments/indirect_eval_example.js
- Recursive Functions:
  - jalangi2/experiments/recursion_example.js

Each of the examples above are refered in the [mainExample](jalangi2/experiments/mainExample.js) file. Following are the steps that need to be performed.
1. Open command prompt and go to the directory "jalangi2/experiments/"
2. Then open [mainExample](jalangi2/experiments/mainExample.js) file and uncomment the example file you want to execute.
3. Now execute the following command:
   - node ../src/js/commands/jalangi.js --inlineIID --inlineSource --analysis analysis.js mainExample.js
   This command will run our analysis on the example given and output the result with functions marked as hoistable and not hoistable.


