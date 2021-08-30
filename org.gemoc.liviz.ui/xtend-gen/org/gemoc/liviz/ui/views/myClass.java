package org.gemoc.liviz.ui.views;

import org.eclipse.xtend2.lib.StringConcatenation;

@SuppressWarnings("all")
public class myClass {
  public String generate() {
    StringConcatenation _builder = new StringConcatenation();
    _builder.append("template ");
    String _generate = this.generate();
    _builder.append(_generate);
    _builder.append(" ");
    _builder.newLineIfNotEmpty();
    return _builder.toString();
  }
}
