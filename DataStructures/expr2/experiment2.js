//-------------------------------+
// Author: Dharmeet Singh        |
// Email: dharmeet@vlabs.ac.in   |
//-------------------------------+

//----------------------------------------------------------------------------------------+
// The validation and evaluation of expression is done, according to regular expressions  |
// similar to the following:                                                              |
// E -----> E + T | E - T | T                                                             | 
// T -----> T * F | T / F | F                                                             |
// F -----> (E) | n                                                                       |
// E - Expression, T - Term, F - Factor and n - Number                                    |
// We have three functions evalExpr(), evalTerm() and evalFactor, and as we also have     |
// modulus and exponent function in the calculator so we need evalHPTerm(), as '^' and '%'|
// has higher precendence than multiply and divide.                                       |
//----------------------------------------------------------------------------------------+

window.model = {
	
    mAdd: '+',    // property for constant characters
    mSub: '-',
    mMul: '*',
    mDiv: '/',
    mExp: '^',
    mMod: '%',
    mClBrckt: ')',
    mOpenBrckt: '(',
    mZero: '0',
    mNine: '9',
    mDot: '.',
    mExpr: '',   // property to store the expression associated with this object

    // Function to implement the regular expression E -----> E + T | E - T | T
    evalExpr: function() {
        var mTermValue = this.evalTerm();

        if (this.mExpr.length > 0 && this.mExpr.charAt(0) == this.mAdd) {
            this.mExpr = this.mExpr.substring(1);
            mTermValue = mTermValue + this.evalExpr();
            if (this.mExpr.length > 0) {
        	    if (this.mExpr.charAt(0) == this.mSub) {
                    this.mExpr = this.mExpr.substring(1);
                    return mTermValue - this.evalExpr();
                }
                else if (this.mExpr.charAt(0) == this.mAdd) {
                    this.mExpr = this.mExpr.substring(1);
                    return mTermValue + this.evalExpr();
                } else if (this.mExpr.charAt(0) != this.mClBrckt) 
                    throw new IOException(this.mExpr); 
            } 
           // else 
             //   return mTermValue; 
        } 
        else if (this.mExpr.length > 0 && this.mExpr.charAt(0) == this.mSub) {
            this.mExpr = this.mExpr.substring(1);
            mTermValue = mTermValue + (-1)*this.evalTerm();
            if (this.mExpr.length > 0) { // for expression like a*b - c + d*e
                if (this.mExpr.charAt(0) == this.mSub) {
                    this.mExpr = this.mExpr.substring(1);
                    return mTermValue - this.evalExpr();
                }
                else if (this.mExpr.charAt(0) == this.mAdd) {
                    this.mExpr = this.mExpr.substring(1);
                    return mTermValue + this.evalExpr();
                }
                //else
                    //throw new IOException(this.mExpr);
            }
        }
        return mTermValue;
	},

    // Function to implement the expression T -----> T * F | T / F | F
    evalTerm: function() {
        console.log("Entering evalTerm");
        var mFactor = this.evalFactor();

        if (this.mExpr.length > 0) {
           if (this.mExpr.charAt(0) == this.mMul) {
                this.mExpr = this.mExpr.substring(1);
                mFactor = mFactor * this.evalTerm();
                return this.evalHPTerm(mFactor);
            } 
            else if (this.mExpr.charAt(0) == this.mDiv) {
                this.mExpr = this.mExpr.substring(1);
                var mDivisor = this.evalTerm();
                if (mDivisor == 0)
                    throw new IOException(this.mExpr);
                return mFactor / mDivisor;
            }
            else if (this.mExpr.charAt(0) == this.mMod) {
                this.mExpr = this.mExpr.substring(1);
                var mDivisor = this.evalFactor();
                if (mDivisor == 0)
                    throw new IOException();
                mFactor = mFactor % mDivisor;
                return this.evalHPTerm(mFactor);
            } 
            else if (this.mExpr.charAt(0) == this.mExp) {
                this.mExpr = this.mExpr.substring(1);
                // for expression of type a^b*c we should first calculate a^b
                mFactor = Math.pow(mFactor, this.evalFactor());
                return this.evalHPTerm(mFactor);
            }
        }
        console.log(mFactor);
        return mFactor;
    },

    // Function to implement the expression F -----> ( E ) | n 
    evalFactor: function() {
        console.log("Entering evalFactor");
        var mNumber;
        var numb = "";
        var len = 0;
        if (this.mExpr.length > 0) {
            if ((this.mExpr.charAt(0) >= this.mZero && this.mExpr.charAt(0) <= this.mNine) || this.mExpr.charAt(0) == this.mDot) {
                numb = this.mExpr.match("[0-9]*\\.?[0-9]+");
                console.log(numb);
                mNumber = parseFloat(numb);
                console.log(mNumber);
                
                if (this.mExpr.length == numb[0].length) {
                    console.log("mExpr equals numb length");
                    this.mExpr = "";
                }
                else {
                    console.log(numb[0].length);
                    this.mExpr = this.mExpr.substring(numb[0].length);
                    console.log(this.mExpr);
                }
                console.log(mNumber);
                return mNumber;
            }
            else if (this.mExpr.charAt(0) == this.mOpenBrckt) {
                this.mExpr = this.mExpr.substring(1);
                console.log(this.mExpr);
                mNumber = this.evalExpr();
                console.log("return to mOpenBrckt");
                if (this.mExpr.charAt(0) == this.mClBrckt) {
                    console.log(this.mExpr);
                    this.mExpr = this.mExpr.substring(1);
                    return mNumber;
                }
                else {
                    throw new IOException(this.mExpr);
                }
            }
        }
        throw new IOException(this.mExpr);
    },
    
    // Function to take care of expressions like a*b^c where ^ has higher precedence then *
    evalHPTerm: function(mFactor) {
        console.log("Entering evalHPTerm");
        if (this.mExpr.length > 0) {
            if (this.mExpr.charAt(0) == this.mAdd) {
                this.mExpr = this.mExpr.substring(1);
                return mFactor + this.evalExpr();
            }
            else if (this.mExpr.charAt(0) == this.mSub) {
                this.mExpr = this.mExpr.substring(1);
                mFactor = mFactor + (-1)*this.evalTerm();
                if (this.mExpr.length > 0) {
                    if (this.mExpr.charAt(0) == this.mAdd) {
                        this.mExpr = this.mExpr.substring(1);
                        return mFactor + this.evalExpr();
                    }
                    else if (this.mExpr.charAt(0) == this.mSub) {
                        this.mExpr = this.mExpr.substring(1);
                        return mFactor - this.evalExpr();
                    }
                }
                else
                    return mFactor;
            }
            else if (this.mExpr.charAt(0) == this.mMul) {
                this.mExpr = this.mExpr.substring(1);
                return mFactor * this.evalTerm();
            }
            else if (this.mExpr.charAt(0) == this.mDiv) {
                this.mExpr = this.mExpr.substring(1);
                var mDivisor = this.evalTerm();
                if (mDivisor == 0)
                    throw new IOException();
                return mFactor / mDivisor;
            }
            else if (this.mExpr.charAt(0) == this.mMod) {
                this.mExpr = this.mExpr.substring(1);
                var mDivisor = this.evalFactor();
                if (mDivisor == 0)
                    throw new IOException();
                mFactor = mFactor % mDivisor;
                    return this.evalHPTerm(mFactor);
            }
            else if (this.mExpr.charAt(0) == this.mExp) {
                this.mExpr = this.mExpr.substring(1);
                mFactor = Math.pow(mFactor, this.evalFactor());
                return this.evalHPTerm(mFactor);
            }
            else if (this.mExpr.charAt(0) != this.mClBrckt)
                throw new IOException(this.mExpr);
        }
        return mFactor;
    },

}

window.view = {

    addClickEvent: function (id, method) {
        //console.log('clicked');
        //console.log(id);
        var element = document.getElementById(id);
        element.addEventListener('click', method, false);
    },

    activateEvents: function () {
        this.addClickEvent('keyOpenBrcktId', function() { view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyCloseBrcktId', function() { view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keySevenId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyEightId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyNineId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyDivId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyExpId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyFourId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyFiveId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keySixId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyMulId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyModId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyOneId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyTwoId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyThreeId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keySubId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyOneByXId', function() {view.setInnerHTMLOneByX('screenId') });
        this.addClickEvent('keyZeroId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyUnaryOpId', function() {view.setInnerHTMLUnary('screenId') });
        this.addClickEvent('keyDotId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyAddId', function() {view.setInnerHTML('screenId', this.value) });
        this.addClickEvent('keyEqualToId', function() {view.setFinalExpression('screenId') });
        this.addClickEvent('keyClearId', function() {view.clearScreen('screenId') });
        this.addClickEvent('keyBackspaceId', function() {view.setInnerHTMLBackspace('screenId') });
    },

    setInnerHTML: function (id, innerHTML) {
        document.getElementById(id).innerHTML = this.getInnerHTML(id) + innerHTML;
    },

    setInnerHTMLOneByX: function(id) {
        document.getElementById(id).innerHTML = '1/(' + this.getInnerHTML(id) + ')';
    },

    setInnerHTMLUnary: function(id) {
        document.getElementById(id).innerHTML = '-(' + this.getInnerHTML(id) + ')';
    },

    setInnerHTMLBackspace: function(id) {
        var expr = this.getInnerHTML(id);
        expr = expr.substring(0, expr.length - 1);
        document.getElementById(id).innerHTML = expr;
    },

    setFinalExpression: function(id) {
        try {
            model.mExpr = this.getInnerHTML(id);
            var finalValue = model.evalExpr();

            document.getElementById(id).innerHTML = finalValue;
        } 
        catch (IOException) {
            if(model.mExpr.length == 0)
                document.getElementById(id).innerHTML = "NaN";
            else {
                var mFinalExpression = this.getInnerHTML(id);
                var invalidStartIndex = mFinalExpression.indexOf(model.mExpr);
                //document.getElementById("colorRed").style.color="#FF0000";
                var mInvalidExpression = mFinalExpression.substring(invalidStartIndex);
                
                mFinalExpression = mFinalExpression.substring(0, invalidStartIndex);
                document.getElementById(id).innerHTML = mFinalExpression + '<span 
                style="color: #FF0000; font-size: 17px;">' + mInvalidExpression + '</span>';
            }
                
        }
    },

    getInnerHTML: function (id) {
        var value = document.getElementById(id).innerHTML;
        return value;
    },

    clearScreen: function (id) {
        document.getElementById(id).innerHTML = '';
    },

    init: function () {
        this.activateEvents();
    }
}

window.onload = function () {
  window.view.init();
}