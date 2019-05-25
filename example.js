const Validator = require('./validator');
let validator = new Validator();

validationRules  = {
    'username' : 'req|min_len[10]|max_len[20]',
    'surname'  : 'req|min_len[15]|max_len[20]',
    'age'      : 'num|min[18]|max[55]',
    'email'    : 'req|email'
} 

testBody = {
    username: '111111111111',
    surname : 'srn13123123112312312',
    age: 18.1 ,
    email: "email@email.com"
}

if(validator.validate(testBody , validationRules)) {
    console.log('is valid');
} else {
    console.log(validator.validationResult);
}