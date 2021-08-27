package org.gemoc.liviz.ui.views;

import org.eclipse.gemoc.executionframework.ui.views.engine.IEngineSelectionListener;
import org.eclipse.gemoc.xdsmlframework.api.core.IExecutionEngine;

public class LivizEngineSelectionListener implements IEngineSelectionListener 
{

	@Override
	public void engineSelectionChanged(IExecutionEngine<?> engine) 
	{
		System.out.println("event triggered");
	
		
	}

}
