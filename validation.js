"use strict"

class Validation 
{
    constructor(_isValid , _errorMessage) {
        this.isValid = _isValid;
        this.errorMessage = _errorMessage;
    }
}

module.exports = Validation;