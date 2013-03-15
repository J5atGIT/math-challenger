(function() {
  dust.register("demo", body_0);

  function body_0(chk, ctx) {
    return chk.write("<span id=\"content-area-span\">").reference(ctx.get("text"), ctx, "h").write("</span><form id=\"htmlFormAnswerPanel\" onSubmit=\"oMM.next( this ); return false;\"><input type=\"text\" id=\"answerField\" name=\"answerField\" autocomplete=\"off\" title=\"Entera NUMERIC answer only (Characters of 0 - 9 only)\" pattern=\"[0-9]{1,3}\" /></form>");
  }
  return body_0;
})();
	