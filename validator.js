"use strict"
let Validation = require('./validation');

class Validator 
{
    constructor() {
    
    } 
    
    parseRules(rules) {
        if(rules.length > 0){
            let arrRules =  rules.split('|');
            return arrRules;
        }
        return [];
    }
    parseValidationArray(validationRules) {
        let arr = Object.entries(validationRules);
        let retArr = []
        if(arr.length > 0 ) {
            for(let i=0;i<arr.length;i++) {
                let rule = arr[i];
                let field = rule[0];
                let rules = this.parseRules(rule[1]);                
                retArr[field] = rules;
            }
            return  retArr;
        }
        return [];
    }
    parseRuleAndParameter(ruleAndParameter) {
        let startBracket = ruleAndParameter.indexOf('[');
        let endBracket = ruleAndParameter.indexOf(']');
        if(endBracket > startBracket ) {
            let rule = ruleAndParameter.substring(0,startBracket);
            let parameter = ruleAndParameter.substring(startBracket+1,endBracket);
            return { rule:rule , parameter:parameter };
        }
        return [];
    }
    isEmpty(value) {
        if(value == undefined || value == null || value == ''){
            return true;
        }
        return false;
    }
    isNumeric(value){
        if(typeof(value) === "number") {
            return true;
        }
        return false;
    }
    isDigit(char) {
        let digits = "0123456789";
        return digits.indexOf(char) > -1;
    }
    checkRequired(field, value) {
        if(this.isEmpty(value)) {
            return new Validation(false, "The field "+field+" is required");
        } else {
            return new Validation(true, null);
        }
    }

    checkMinLength(field , value , param) {
        if(this.isEmpty(value) === false) {
            if(value.length >= param) {
                return new Validation(true, null);
            }
        }
        return new Validation (false, "The field "+field+" must have length greater or equal to "+param);
    }
    checkMaxLength(field , value , param) {
        if(this.isEmpty(value) || value.length <= param) {
                return new Validation(true, null);
        } 
        return new Validation (false, "The field "+field+" must have length less or equal to "+param);
    }

    checkNum(field , value) {
        if(this.isNumeric(value)) {
            return new Validation(true, null);
        }
        return new Validation(false, "The field "+field+" must be a number");
    }
    checkMin(field , value, parameter) {
        if(this.isNumeric(value)) {
            if(value >= parameter) {
                return new Validation(true, null);
            }
        }
        return new Validation(false, "The field "+field+" must greater or equal to "+parameter);
    }
    checkMax(field , value, parameter) {
        if(this.isNumeric(value)) {
            if(value <= parameter) {
                return new Validation(true, null);
            }
        }
        return new Validation(false, "The field "+field+" must less or equal to "+parameter);
    }
    checkInt(field , value) {
        if(this.isNumeric(value)) {
            let str = value.toString();
            let isInt = true;
            for(let i=0; i< str.length;i++){
                if(this.isDigit(str[i]) === false ) {
                    isInt=false;
                }
            }
            if(isInt === true) {
                return new Validation(true , null);
            }            
        }
        return new Validation(false, "The field "+field+" must be an integer");
    }
    checkEmail(field , value) {
        let regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isEmail = regularExpression.test(String(value).toLowerCase());
        if(isEmail === true){
            return new Validation(true, null);
        }
        return new Validation(false, "The field "+field+" must be a valid email address");
    }
    check(field,value,rule,parameter=null) {
        let result = null;
        switch(rule) {
            case 'req' :
                result = this.checkRequired(field,value);
                break;
            case 'min_len' :
                result = this.checkMinLength(field, value, parameter);
                break;
            case 'max_len' :
                result = this.checkMaxLength(field, value, parameter);
                break;
            case 'num' :
                result = this.checkNum(field , value);
                break;
            case 'min' :
                result = this.checkMin(field , value , parameter);
                break;
            case 'max' :
                result = this.checkMax(field , value , parameter);
                break;
            case 'int' :
                result = this.checkInt(field, value);
                break;
            case 'email' :
                result = this.checkEmail(field,value);
        }
        return result;
    }

    isValid(field , value , ruleStr) {
        let startBracket = ruleStr.indexOf('[');
        let hasRuleParameter = ( startBracket > -1 );
        let rule = null;
        let parameter = null;
        if(hasRuleParameter) {
            let ruleAndParameter = this.parseRuleAndParameter(ruleStr);
            rule = ruleAndParameter.rule.toLowerCase();
            parameter = ruleAndParameter.parameter.toLowerCase();
            return this.check(field,value,rule,parameter);
        } else {
            rule = ruleStr.toLowerCase();
            return this.check(field,value,rule);
        }        
    }

    validateField(field , value, rulesArr) {
        let validation = new Validation(true, null); 
        for(let i=0;i<rulesArr.length;i++) {
            let checkResult = this.isValid(field, value , rulesArr[i]);
            if(checkResult.isValid === false) {
                if(validation.isValid===true) {
                    validation = checkResult;
                } else {
                    validation.errorMessage += '. '+checkResult.errorMessage;
                }
            }
        }   
        return validation;         
    }
    validate (obj , validationRules) { 
        let validationArray = this.parseValidationArray(validationRules);
        let isValid = true;
        let validationResult = [];        
        if(validationArray != null ) {  
            if(Object.entries(validationArray).length > 0) {
                let arr = Object.entries(obj);
                for(let i=0;i<arr.length;i++){
                    let item = arr[i];
                    let field = item[0];
                    let value = item[1];
                    validationResult[field] = this.validateField(field, value , validationArray[field]);
                    if(validationResult[field].isValid === false) {
                        isValid = false;
                    }
                }            
            }  
        }
        this.validationResult = validationResult;
        return isValid;
    }
}

module.exports = Validator;