// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:

// note: ( code heavily borrowed from:
// http://oreilly.com/javascript/excerpts/javascript-good-parts/json.html)
// Did not include reviver


var parseJSON = function(json) {
  // your code goes here

  var at, // index of current character (is actually +1?)
      ch, // current character
      text,
      escapee = {
        '"':  '"',
        '\\': '\\',
        '/':  '/',
        b:    'b',
        f:    '\f',
        n:    '\n',
        r:    '\r',
        t:    '\t'        
      },

      //gets next character
      next = function(c) {

        //if param c is provided, verify that it matches current character
        if(c && c!== ch) {
          error("Expected '" + c + "' instead of '" + ch + "'");
        }

        //if no error, get next character
        //when no more characters, return the empty string
        ch = text.charAt(at);
        at += 1;
        return ch;
      },

      //call error wen something is wrong
      error = function(m) {

        throw new SyntaxError(m);
        /*throw {
          name: 'SyntaxError',
          message: m,
          at: at,
          text: text
        };*/
      },

      word = function() {
        switch(ch) {
          case 't':
            next('t');
            next('r');
            next('u');
            next('e');
            return true;
          case 'f':
            next('f');
            next('a');
            next('l');
            next('s');
            next('e');
            return false;
          case 'n':
            next('n');
            next('u');
            next('l');
            next('l');
            return null;
          }
          error("Unexpected '" + ch + "'");
      },

      number = function() {
        var number,
            string = '';

        if(ch === '-') {
          string = '-';
          next('-');
        }

        while( ch >= '0' && ch <= '9') {
          string += ch;
          next();
        }

        if(ch === '.') {
          string += '.';
          while(next() && ch >= '0' && ch <= '9' ) {
            string += ch;
          }
        }

        if(ch === 'e' || ch === 'E') {
          string += ch;
          next();
          if(ch === '-' || ch === '+') {
            string += ch;
            next();
          }
          
          while( ch >= '0' && ch <= '9') {
            string += ch;
            next();
          }
        }

        number = +string;;
        if( isNaN(number)) {
          error("Bad number");
        } else {
          return number;
        }
      },

      array = function () {
        var array = [];

        if (ch === '[') {
          next ('[');
          white();

          if(ch === ']'){
            next(']');
            return array; // which will be empty
          } 
        }

        while (ch) {
          array.push(value());
          white();
          if(ch === ']') {
            next(']');
            return array;
          } 
          next(',');
          white();
        }

        error("Bad array");
      },

      object = function () {
        var object = {};

        if(ch === '{') {
          next('{');
          white();

          if(ch === '}') {
            next('}');
            return object // empty object
          }
        }

        while (ch) {
          key = string();
          white();
          next(':');
          object[key] = value();
          white();

          if(ch === '}') {
            next('}');
            return object;
          }
          next(',');
          white();          
        }

        error("bad object");
      },

      string = function () {
        var hex,
            i, 
            string = '',
            uffff;

      if(ch === '"') {
        while(next()) {
          if(ch === '"') {
            next();
            return string;
          } else  if(ch === '\\'){
            next();
            if( ch === 'u') {
              uffff = 0; 
              for( i = 0; i<4; i += 1) {
                hex = parseInt(next(), 16);
                if(!isFinite(hex)) {
                  break;
                }
                uffff = uffff * 16 + hex;
              }

              string += String.fromCharCode(uffff);
            } else if(typeof escapee[ch] === 'string') {
              string += escapee[ch];
            } else { break};
          } else {
            string += ch; //normal string char
          }
        }
        error("Bad String");
      }


      }, 

      value = function() {
        white();
        switch (ch) {
          case '{':
            return object();
          case '[':
            return array();
          case '"':
            return string();
          case '-':
            return number();
          default:
            return ch >= '0' && ch <= '9' ? number() : word();     
        }
      },

      //skip whitespace
      white = function() {
        while( ch && ch <= ' ') {
          next();
        }
      };

  
   var mainFunction = function(json) {

    var result;
    text = json;
    at = 0;
    ch = ' ';
    result = value();
    white();
    if(ch) {
      error("Syntax error");
    }
      return result;
  };

  return mainFunction(json);

};





