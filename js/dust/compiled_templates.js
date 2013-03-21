(function() {
  dust.register("QuestionView", body_0);

  function body_0(chk, ctx) {
    return chk.write("<span id=\"content-area-span\">").reference(ctx.get("readableQuestionIdx"), ctx, "h").write(": ").reference(ctx.get("factor1"), ctx, "h").write(" ").reference(ctx.get("operator"), ctx, "h").write(" ").reference(ctx.get("factor2"), ctx, "h").write(" = </span><form id=\"htmlFormAnswerPanel\" onsubmit=\"oMM.next( this ); return false;\"><input type=\"number\" id=\"answerField\" name=\"answerField\" autocomplete=\"off\" title=\"Enter a NUMERIC answer only (Characters of 0 - 9 only)\" pattern=\"[0-9]{1,3}\"></form>");
  }
  return body_0;
})();

	(function() {
  dust.register("ResultView", body_0);

  function body_0(chk, ctx) {
    return chk.write("<span id=\"htmlAnswerDisplayPanel\"><em>").reference(ctx.get("type"), ctx, "h").write(" ").section(ctx.get("operation"), ctx, {
      "block": body_1
    }, null).write("</em>><br/>Your score is ").reference(ctx.get("questionsPercent"), ctx, "h").write("<br/>You answered ").reference(ctx.get("questionsAnswered"), ctx, "h").write(" and got ").reference(ctx.get("questionsCorrect"), ctx, "h").write(" correct.<br/>Time elapsed: ").reference(ctx.get("timeSpent"), ctx, "h").write(" seconds<br/></span>");
  }
  function body_1(chk, ctx) {
    return chk.reference(ctx.get("multiplicator"), ctx, "h");
  }
  return body_0;
})();

(function() {
  dust.register("demo3", body_0);

  function body_0(chk, ctx) {
    return chk.write("<p id=\"mmInfoPanelAddendum\"><select id=\"mmIDAddendumSelect\" class=\"mm-block-style\" onChange=\"oMM.handleInfoPanelAddendumSelect( this )\">").section(ctx.get("value"), ctx, {
      "block": body_1
    }, null).write("</select></p>");
  }
  function body_1(chk, ctx) {
    return chk.write("<option value=\"").reference(ctx.getPath(true, []), ctx, "h").write("\">").reference(ctx.getPath(true, []), ctx, "h").write("</option>\n");
  }
  return body_0;
})();

