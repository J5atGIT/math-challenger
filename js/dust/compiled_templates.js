(function() {
  dust.register("demo", body_0);

  function body_0(chk, ctx) {
    return chk.write("<span id=\"content-area-span\">").reference(ctx.get("text"), ctx, "h").write("</span><form id=\"htmlFormAnswerPanel\" onSubmit=\"oMM.next( this ); return false;\"><input type=\"number\" id=\"answerField\" name=\"answerField\" autocomplete=\"off\" title=\"Enter a NUMERIC answer only (Characters of 0 - 9 only)\" pattern=\"[0-9]{1,3}\" /></form>");
  }
  return body_0;
})();
	

	(function() {
  dust.register("demo2", body_0);

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