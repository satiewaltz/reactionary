// Originally by https://github.com/andy0130tw/markdown-it-ast
// Modified to reduce output - Dave B

function markdownItAST(tokens) {
  function genTreeNode(node, children = []) {
    return {
      type: node,
      children: children ? children : []
    };
  }

  // dummy root node
  var rootNode = genTreeNode(null);
  var curr = rootNode;
  var stack = [];
  tokens.forEach(function(tok, idx) {
    var tmp;
    if (tok.nesting == 1) {
      //////////////////

      tok.type = tok.type.slice(0, -5);
      const { type, children, ...newTok } = tok;
      tok = type;
      tmp = genTreeNode(tok, children);

      curr.children.push(tmp);
      // if (tmp.type == "heading") {
      //   console.log(curr);
      // }
      stack.push(curr);
      curr = tmp;
      // console.log(curr);
    } else if (tok.nesting == -1) {
      if (!stack.length) throw new Error("AST stack underflow.");
      tmp = stack.pop();
      // TODO: check whether the close node corresponds to the one it opens
      // console.log(stack);
      // curr = stack[stack.length - 1];

      curr = tmp;
    } else if (tok.nesting == 0) {
      if (curr.type == "heading") {
        console.log(curr.children[0].children);
      }
      curr.children.push(tok);
    } else {
      throw new ValueError(
        "Invalid nesting level found in token index " + idx + "."
      );
    }
    // console.log(tmp);
    curr.children.push(tmp);
    // console.log(curr.children[0]);
  });

  if (stack.length != 0)
    throw new Error("Unbalanced block open/close tokens.");

  return rootNode.children;
}

module.exports = {
  makeAST: markdownItAST
};
