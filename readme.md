# NodeJS - Validator

Simple validator not Node.JS. You can validate user input using this library.

### How to use

You must include the library in your project
```
const Validator = require('./validator');
let validator = new Validator();
```

Then you must create a validation rules array as exists. 
Each key in the object must have the same name in the data object. You can see the validation rules below.
Rules must be separated with |
```
validationRules  = {
    'username' : 'req|min_len[10]|max_len[20]',
    'surname'  : 'req|min_len[15]|max_len[20]',
    'age'      : 'num|min[18]|max[55]',
    'email'    : 'req|email'
} 
```

Your data must be in Object like this. Please note !!! All keys must be same with validation rules array
```
testBody = {
    username: '111111111111',
    surname : 'srn13123123112312312',
    age: 18.1 ,
    email: "email@email.com"
}
```

Finally you can validate easily your data
```
if(validator.validate(testBody , validationRules)) {
    console.log('is valid');
} else {
    console.log(validator.validationResult);
}
```

### Validation rules
1)  req             - Required
2)  min_len[value]  - Min length must be greater or equal to value
3)  max_len[value]  - Max length must be less or equal to value
4)  num             - Must be numeric
5)  min[value]      - Min or equal numeric value 
6)  max[value]      - Max or less numeric value
7)  int             - Must be an integer
8)  email           - Must be a valid email