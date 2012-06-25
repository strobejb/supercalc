/*
 * parser.js
 *
 * www.catch22.net
 *
 * Copyright (C) 2012 James Brown
 * Licenced under the MIT licence
 * Please refer to the file LICENCE.TXT for copying permission
 */

var Parser;
var VarMap;

Parser = Parser || {};
VarMap = VarMap || {};

Parser.Token = {
    OPERATOR:   'Operator',
    IDENTIFIER: 'Identifier',
    NUMBER:     'Number',
    UNKNOWN:    'Unknown',
    NONE:       null,

    ANDAND: '&&',
    OROR:   '||',
    EQU:    '==',
    NEQ:    '!=',
    SHR:    '<<',
    SHL:    '>>',
    INC:    '++',
    DEC:    '--',
    DEREF:  '->'
};

Parser.Number = {
  DEC:   10,
  HEX:   16,
  OCT:   8,
  BIN:   2,
  FLOAT: 'Floating'
};

Parser.Expression = {
  NUMBER:       'Number',
  IDENTIFIER:   'Identifier',
  UNARY:        'Unary',
  POSTFIX:      'Postfix',
  BINARY:       'Binary',
  TERTIARY:     'Tertiary',
  ASSIGNMENT:   'Assignment'
};

Parser.Mode = {
  PROGRAMMER: 'Prg',
  NORMAL:     'Sci',
  FRACTION:   'Fra'
}

Parser.Lexer = function() {

  var buf = '2 + 2';
  var idx = 0;            // position in buf
  var ch  = '\x00';       // current character read
  var tstr = '';          // identifier
  var tnum = 0;           // number, if current token is TOK_NUMBER
  var numbase = 0;
  var NUM = Parser.Number;
  var TOK = Parser.Token;
  var tpos = 0;

  var parsemode = Parser.Mode.PROGRAMMER;

  function init(expression, mode) {
     buf  = expression;
     idx  = 0;
     ch   = nextch();
     t    = 0;

     parsemode = mode;
  }

  // return next character, don't read ahead
  function peekch() {
    return idx < buf.length ? buf.charAt(idx) : '\x00';
  }

  // return next character, and read ahead
  function nextch() {
    var c = '\x00';
    if(idx < buf.length) {
      c = buf.charAt(idx);
      idx += 1; 
    }
    return c;
  }

  function isalpha(ch) {
    return ch >= 'A' && ch <= 'Z' || ch >= 'a' && ch <= 'z';
  }

  function isxdigit(ch) {
    return ch >= '0' && ch <= '9' || ch >= 'A' && ch <= 'F' || ch >= 'a' && ch <= 'f';
  }

  function isdigit(ch) {
    return ch >= '0' && ch <= '9';
  }

  function skipwhitespace() {
    while(ch == ' ' || ch == '\u0009' || ch == '\u00A0' || ch == '\u00D0')
      ch = nextch();
    return ch;
  }

  function create_token(type, val) {
    return {
      type:   type,
      value:  val,
      base:   numbase,
      pos:    tpos
    };
  }

  //
  //  Parse hex/decimal/octal/float numbers
  //  return a NUMBER Token
  //
  function parse_number() {

    tstr = '';

    if(ch == '0') {     // Hex/Octal
      ch = nextch();

      if(ch == 'X' || ch == 'x') {    // Hex
        ch = nextch();
        while(isxdigit(ch)) {
          tstr += ch;
          ch = nextch();
        }

        numbase = NUM.HEX;
      }
      else if(ch == 'B' || ch == 'b') {    // Bin
        ch = nextch();
        while(isxdigit(ch)) {
          tstr += ch;
          ch = nextch();
        }

        numbase = NUM.BIN;
      }
      else {            // Octal
        tstr = '0';
        while(isdigit(ch)) {
          tstr += ch;
          ch = nextch();
        }
        numbase = NUM.OCT;
      }
    }
    else {            // Decimal

      numbase = NUM.DEC;
      tstr = '';

      while(isdigit(ch)) {
        tstr += ch;
        ch = nextch();
      }
    }

    // floating point!
    if(ch == '.' && numbase != NUM.HEX) {

      /* restrict s
       * if(parsemode == Parser.Mode.PROGRAMMER) {
        return null;
      }*/

      numbase = NUM.FLOAT;
      tstr += '.';
      ch = nextch();

      while(isdigit(ch)) {
        tstr += ch;
        ch = nextch();
      }

      // optional exponent
      if(ch == 'e' || ch == 'E') {
        tstr += ch;
        ch = nextch();

        if(ch == '-' || ch == '+') {
          tstr += ch;
          ch = nextch();
        }

        while(isdigit(ch)) {
          tstr += ch;
          ch = nextch();
        }
      }

      tnum = parseFloat(tstr);
    }
    else {
      tnum = parseInt(tstr, numbase);
    }
    
    return create_token(TOK.NUMBER, tnum);
  }

  //
  //  
  //
  function parse_identifier() {
    tstr = '';

    while(isalpha(ch) || isdigit(ch) || ch == '_') {
      tstr += ch;
      ch = nextch();
    }
    return create_token(TOK.IDENTIFIER, tstr);
  }

  // this is the main function!
  function gettok() {
    ch = skipwhitespace();

    tpos = idx;

    // parse numbers
    if(isdigit(ch) || (ch == '.' && isdigit(peekch()))) {
      return parse_number();
    }

    // parse identifiers
    if(isalpha(ch) || ch == '_') {
      return parse_identifier();
    }

    // check for double-charactor operators
    switch(ch) {
    case '!': ch = nextch();
              if(ch == '=') {                               // !=
                ch = nextch();
                return create_token(TOK.OPERATOR, TOK.NEQ);
              }
              return create_token(TOK.OPERATOR, '!');       // !
  
    case '=': ch = nextch();
              if(ch == '=') {                               // ==
                ch = nextch();
                return create_token(TOK.OPERATOR, TOK.EQU);
              }
              return create_token(TOK.OPERATOR, '=');       // =

    case '<': ch = nextch();
              if(ch == '=') {                               // <=
                ch = nextch();
                return create_token(TOK.OPERATOR, TOK.LE);
              }
              else if(ch == '<') {                          // <<
                ch = nextch();
                return create_token(TOK.OPERATOR, TOK.SHR);
              }
              return create_token(TOK.OPERATOR, '<');       // <
              
    case '>': ch = nextch();
              if(ch == '=') {                               // >=
                ch = nextch();
                return create_token(TOK.OPERATOR, TOK.LE);
              }
              else if(ch == '>') {                          // >>
                ch = nextch();
                return create_token(TOK.OPERATOR, TOK.SHL);
              }
              return create_token(TOK.OPERATOR, '>');       // >
              
    case '&': ch = nextch();
              if(ch == '&') {                               // &&
                ch = nextch();
                return create_token(TOK.OPERATOR, TOK.ANDAND);
              }
              return create_token(TOK.OPERATOR, '&');       // &

    case '|': ch = nextch();
              if(ch == '|') {                               // ||
                ch = nextch();
                return create_token(TOK.OPERATOR, TOK.OROR);
              }
              return create_token(TOK.OPERATOR, '|');       // |

    case '+': ch = nextch();
              if(ch == '+') {                               // ++
                ch = nextch();
                return create_token(TOK.OPERATOR, TOK.INC);
              }
              return create_token(TOK.OPERATOR, '+');       // +

    case '-': ch = nextch();
              if(ch == '-') {                               // --
                ch = nextch();
                return create_token(TOK.OPERATOR, TOK.DEC);
              }
              else if(ch == '>') {                          // ->
                ch = nextch();
                return create_token(TOK.OPERATOR, TOK.DEREF);
              }
              return create_token(TOK.OPERATOR, '-');       // -

    case '×': case '÷': 
    case '*': case '+': case '-': case '/': case '%': case '!': case '~':
    case '(': case ')': case '[': case ']':
    case '?': case ':': 
              var t = create_token(TOK.OPERATOR, ch);       // single-character operators
              ch = nextch();
              return t;
   
    case '': case '\x00':
              return create_token(TOK.NONE, '');
    default:                                                // unknown character!
              var t = create_token(TOK.UNKNOWN, ch);
              ch = nextch();
              return t;
    }
  }

  // return the 'interface' to the lexical analyser!
  return {
    init: init,
    gettok: gettok
  };
}

Parser.Parser = function() {

  var lexer = new Parser.Lexer();
  var TOK   = Parser.Token;
  var EXPR  = Parser.Expression;
  var NUM   = Parser.Number;
  var t     = { type: TOK.NONE };            // current token

  var ERR   = 0;

  function ExprNode(type, tok, left, right, cond) {
    return {
      type:  type,      // one of EXPR_BINARY, EXPR_UNARY etc
      op:    tok,       // operator token
      left:  left,      // left-side ExprNode
      right: right,     // right-side ExprNode
      cond:  cond       // conditional (tertiary)
    }
  }

  function Precedence(t)
  {
    if(t.type != TOK.OPERATOR)
      return 0;

    switch(t.value)
    {
    // unary operators at 14+
    // '++', '--', '*', '&', '+', '-', '~', '!'

    // binary operators at 4 to 13 inclusive
    case '*': case '/': case '%': return 13;
    case '+': case '-':           return 12;
    case TOK.SHL: case TOK.SHR:   return 11;
    case '<': case '>':       
    case TOK.LE : case TOK.GE:    return 10;
    case TOK.EQU: case TOK.NEQ:   return 9;
    case '&':                     return 8;
    case '^':                     return 7;
    case '|':                     return 6;
    case TOK.ANDAND:              return 5;
    case TOK.OROR:                return 4;

    // not referenced
    case '?':                     return 3; 
    case '=':                     return 2; 
    case ',':                     return 1; 
    default:                      return 0;
    }
  }

  function PrimaryExpression() {

    var p = null;

    switch(t.type) {
    case TOK.NUMBER:
      p = ExprNode(EXPR.NUMBER, t);
      t = lexer.gettok();
      break;

    case TOK.IDENTIFIER:
      p = ExprNode(EXPR.IDENTIFIER, t);
      t = lexer.gettok();
      break;

    default:
      ERR = true;
      break;      
    }

    return p;
  }

  function PostfixExpression(p) {

    var q = null;

    while(true) {
      var op = t;

      if(op.type == TOK.OPERATOR) {
        switch(op.value) {
          //case '[': // array bounds
          //case '.': // field access
          //case '(': // function calls
          case TOK.DEREF: // ->
          case TOK.INC: case TOK.DEC: // post increment/decrement
            t = lexer.gettok();
            q = UnaryExpression();
            p = ExprNode(EXPR.POSTFIX, op, p, q);
            continue;
        }
      }

      return p;
    }
  }
  
  function UnaryExpression() {

    var op = t;
    var p  = null;

    if(op.type == TOK.OPERATOR) {

      switch(op.value) {
      /*case '*': case '&':  // pointer/address
        t = gettok();
        p = UnaryExpression();
        p = ExprNode(EXPR.POINTER, op, p);
      }*/
      case '+': case '-': case '~': case '!': case TOK.INC: case TOK.DEC:
        t = lexer.gettok();
        p = UnaryExpression();
        p = ExprNode(EXPR.UNARY, op, p);
        break;

      case '(':
        t = lexer.gettok();
        p = FullExpression(')');
        p = PostfixExpression(p);
        break;
      }

      return p;
    }

    //case TOK.INC: case TOK.DEC:
    //break;

    p = PrimaryExpression();
    p = PostfixExpression(p);

    return p;
  }

  function BinaryExpression(k) {
    var left = UnaryExpression();
    var i    = 0;

    for(i = Precedence(t); i >= k && i > 0; i--) {
      while(Precedence(t) == i && t != '=') {// && ch != '=') {
        var op = t;
        var right = 0;
        t = lexer.gettok();
        if(op.type == TOK.OPERATOR && (op.value == TOK.ANDAND || op.value == TOK.OROR)) {
          right = BinaryExpression(i);
        }
        else {
          right = BinaryExpression(i+1);
        }
        left = ExprNode(EXPR.BINARY, op, left, right);
      }
    }

    return left;
  }

  function ConditionalExpression() {
    
    var p = BinaryExpression(4);

    if(t.type == TOK.OPERATOR && t.value == '?') {
      var op = t;
      t = lexer.gettok();

      var left  = Expression(':');
      var right = ConditionalExpression();

      p = ExprNode(EXPR.TERTIARY, op, left, right, p);
    }

    return p;
  }

  function AssignmentExpression() {

    var p = ConditionalExpression();

    if(t.type == TOK.OPERATOR) {
      if(t.value == '='  
         || (Precedence(t) >= 6 && Precedence(t) <= 8)       // & ^ |
         || (Precedence(t) >= 11 && Precedence(t) <= 13)) {  // << >> + - * / % 
        
        var op = t;
        t = lexer.gettok();

        if(op.value != '=' && (t.type != TOK.OPERATOR && t.value != '=')) {
          return null;
        }
        else {
          var q = AssignmentExpression();
          p = ExprNode(EXPR.ASSIGNMENT, op, p, q);
        }
      }
    }

    return p;
  }

  function Test(ch) {
    if(ch) {
      if(t.value == ch) {
        t = lexer.gettok();
        return true;
      }
      else {
        //alert('error');
        return false;
      }
    }
    return true;
  }

  function Expression(term) {
    //var p = ConditionalExpression();
    var p = AssignmentExpression();

    return Test(term) ? p : null;
  }

  function FullExpression(term) {
    var p = Expression();

    if(term && !Test(term))
      return null;
    else
      return p;
  }

  function parse_expression() {
    return Expression(null)
  }

  function parse(expression, mode) {
    lexer.init(expression, mode);

    t = lexer.gettok();

    var expr = parse_expression();

    // only support a single expression - so there should be nothing
    // else to parse at this point. Any tokens remaining is an error
    if(t.type != TOK.NONE)
      return null;

    return expr;
  }

  return {
    parse: parse
  };

}


Parser.Evaluator = function() {

  var parser = new Parser.Parser();
  var TOK    = Parser.Token;
  var EXPR   = Parser.Expression;
  var NUM    = Parser.Number;
  var evalmode   = null;

  function calc(lval, operator, rval) {
    var val = null;
    switch(operator) {
        case '+':         val = lval + rval;  break;
        case '-':         val = lval - rval;  break;
        case '*':         val = lval * rval;  break;
        case '/':         val = lval / rval;  break;
        case '%':         val = lval % rval;  break;
        case '|':         val = lval | rval;  break;
        case '&':         val = lval & rval;  break;
        case TOK.ANDAND:  val = lval && rval; break;
        case TOK.OROR:    val = lval || rval; break;
        case TOK.SHR:     val = lval << rval; break;
        case TOK.SHL:     val = lval >> rval; break;
        case TOK.GE:      val = lval >= rval; break;
        case TOK.LE:      val = lval <= rval; break;
        case TOK.EQU:     val = lval == rval; break;
        case TOK.NEQ:     val = lval != rval; break;
    }
    return val;
  }

  function eval0(expr) {

    if(expr == null) {
      return null;
    }

    switch(expr.type) {

    case EXPR.IDENTIFIER: 
      return VarMap[expr.op.value];

    case EXPR.NUMBER:
      var val = expr.op.value;

      if(val && evalmode == 'Prg') {
        val = Math.floor(val);
      }

      return val;

    case EXPR.UNARY:
      var val = eval0(expr.left);

      if(val == null)
        return null;

      switch(expr.op.value) {
        case '+': val =  val;         break;
        case '-': val = -val;         break;
        case '!': val = !val ? 1 : 0; break;
        case '~': val = ~val;         break;
        default:  val = null;         break; // error
      }

      if(val && evalmode == 'Prg') {
        val = Math.floor(val);
      }

      return val;

    case EXPR.POSTFIX:
      // we don't support these yet!
      return null;

    case EXPR.BINARY:
      var lval = eval0(expr.left);
      var rval = eval0(expr.right);
      var val  = null;

      if(lval == null || rval == null)
        return null;

      val = calc(lval, expr.op.value, rval);

      if(val && evalmode == 'Prg') {
        val = Math.floor(val);
      }

      return val;

    case EXPR.TERTIARY:
      if(eval0(expr.cond)) {
        return eval0(expr.left);
      }
      else {
        return eval0(expr.right);
      }

    case EXPR.ASSIGNMENT:
     
      // can only assign into variables
      if(expr.left.type != EXPR.IDENTIFIER)
        return null;

      // calculate the right-hand-side and store!
      var val = eval0(expr.right);
      VarMap[expr.left.op.value] = val;
      return val;
        
    default:
      return null;
    }    
  }

  // evaluate the string expression 
  // mode = 'Prg' / 'Sci' / 'Fra'
  function evalulate(str, mode) {
    evalmode = mode;
    
    // parse the expression
    var expr = parser.parse(str, mode);

    if(expr == null) 
      return null; //'ERR';

    // evaluate the expression
    return eval0(expr);
  }

  return {
    evalulate: evalulate
  }

}
